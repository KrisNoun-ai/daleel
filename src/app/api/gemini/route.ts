import { NextResponse } from 'next/server';
import {
  buildStaticPromptPrefix,
  resolveModelForTier,
  runHeuristicClassifier,
} from '../../../lib/modelRouter';
import { TRAILSPARK_REFERENCE_BLUEPRINT } from '../../../data/referenceBlueprints';
import { TurnClassifierResult, VentureBlueprint } from '../../../types/venture';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function callGemini(params: {
  model: string;
  systemInstruction: string;
  contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>;
  temperature?: number;
  maxOutputTokens?: number;
  responseMimeType?: string;
}) {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${params.model}:generateContent?key=${GEMINI_API_KEY}`;
  const generationConfig: Record<string, unknown> = {
    temperature: params.temperature ?? 0.7,
    maxOutputTokens: params.maxOutputTokens ?? 350,
  };
  if (params.responseMimeType) {
    generationConfig.responseMimeType = params.responseMimeType;
  }

  let response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: params.systemInstruction }] },
      contents: params.contents,
      generationConfig,
    }),
  });

  if (response.status === 503) {
    await new Promise((r) => setTimeout(r, 500));
    response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: params.systemInstruction }] },
        contents: params.contents,
        generationConfig,
      }),
    });
  }

  return response;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mode, message, history = [], contextData = {} } = body;

    // ------------------------------------------------------------------
    // MODE: TEACHER COPILOT (Reasoning Escalation Tier)
    // ------------------------------------------------------------------
    if (mode === 'teacher_copilot') {
      const reasoningModel = resolveModelForTier('reasoning');
      const systemInstruction = `
You are the Daleel Faculty Classroom Studio Copilot assisting a K-12 teacher.
You analyze real classroom mastery, misconception clusters, confidence-vs-mastery signals, and cross-pod collaboration.
Active Classroom Context:
${JSON.stringify(contextData, null, 2)}

RULES:
1. Be practical, evidence-based, and concise (3-5 crisp sentences or bullet points).
2. Highlight specific misconception clusters and suggest a 5-minute targeted mini-lesson or peer pairing.
3. Never use opaque technical jargon; speak as an experienced instructional coach.
`;

      if (GEMINI_API_KEY) {
        try {
          const resp = await callGemini({
            model: reasoningModel,
            systemInstruction,
            contents: [{ role: 'user', parts: [{ text: message }] }],
            temperature: 0.5,
            maxOutputTokens: 400,
          });
          if (resp.ok) {
            const data = await resp.json();
            const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (replyText) {
              return NextResponse.json({ text: replyText, model: reasoningModel, tier: 'reasoning' });
            }
          }
        } catch (err) {
          console.warn('Teacher Copilot Gemini call failed, using fallback:', err);
        }
      }

      return NextResponse.json({
        text: `Classroom Synthesis: Focus first on pods showing variable-isolation drift in Level 3. Pair students with confident misconceptions alongside peers who logged controlled single-variable trials, and run a 5-minute mini-lesson on holding oven temperature constant.`,
        model: reasoningModel,
        tier: 'reasoning',
        status: 'fallback_active',
      });
    }

    // ------------------------------------------------------------------
    // MODE: STUDENT SOCRATIC / SPECIALIST (Two-Stage Guarded Pipeline)
    // ------------------------------------------------------------------
    const fastModel = resolveModelForTier('fast');
    const isMultivariate = Boolean(contextData.isMultivariate);
    const currentStallCount = Number(contextData.stallCount || 0);
    const blueprint: VentureBlueprint = contextData.blueprint || TRAILSPARK_REFERENCE_BLUEPRINT;
    const activeLevelNum = Number(contextData.levelNumber || 3);
    const milestone =
      blueprint.milestones.find((m) => m.levelNumber === activeLevelNum) ||
      blueprint.milestones[0];

    const personaMode: 'socratic' | 'specialist' =
      contextData.persona && contextData.persona !== 'socratic' ? 'specialist' : 'socratic';

    // STAGE 1: State, Misconception & Safeguarding Classifier
    let classification: TurnClassifierResult = runHeuristicClassifier({
      message,
      isMultivariate,
    });

    if (GEMINI_API_KEY && !classification.safeguardingFlag.triggered) {
      try {
        const classifierPrompt = `
You are Daleel's Stage-1 Pedagogical State & Safeguarding Classifier.
Analyze the student's message in the context of Level ${milestone.levelNumber} (${milestone.title}: ${milestone.curriculumTopic}).
Current experiment multivariate violation: ${isMultivariate}.
Student's unassisted initial claim: "${contextData.initialClaim || 'None submitted'}".

Return ONLY valid JSON matching this exact shape:
{
  "answerExtractionAttempt": boolean,
  "misconceptionTag": string | null,
  "reasoningQuality": "low" | "developing" | "strong",
  "stallIncrement": boolean,
  "confidenceTag": "hesitant_accurate" | "confident_misconception" | "calibrated" | "neutral",
  "safeguardingFlag": { "triggered": boolean, "severity": "none" | "alert", "reason": string }
}`;
        const cResp = await callGemini({
          model: fastModel,
          systemInstruction: classifierPrompt,
          contents: [{ role: 'user', parts: [{ text: message }] }],
          temperature: 0.1,
          maxOutputTokens: 180,
          responseMimeType: 'application/json',
        });

        if (cResp.ok) {
          const cData = await cResp.json();
          const rawJson = cData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawJson) {
            const parsed = JSON.parse(rawJson);
            classification = {
              ...classification,
              ...parsed,
              safeguardingFlag: parsed.safeguardingFlag || classification.safeguardingFlag,
            };
          }
        }
      } catch (err) {
        console.warn('Stage-1 classifier fell back to heuristic:', err);
      }
    }

    // Immediate Safeguarding Escalation
    if (classification.safeguardingFlag?.triggered) {
      return NextResponse.json({
        text: "I'm pausing our lab session right here because your safety comes first. I've alerted your teacher so a trusted adult can check in with you right away.",
        model: fastModel,
        tier: 'fast',
        classification,
        nextStallCount: currentStallCount,
        recommendTeacherCall: true,
        safeguardingAlert: true,
      });
    }

    const nextStallCount = classification.stallIncrement ? currentStallCount + 1 : 0;
    const recommendTeacherCall = nextStallCount >= 3;

    // STAGE 2: Guarded Socratic / Specialist Mentor Response (using Static Prefix + Dynamic Turn Context)
    const staticPrefix = buildStaticPromptPrefix({
      blueprint,
      milestone,
      personaMode,
    });

    const dynamicTurnInstruction = `
${staticPrefix}

[DYNAMIC TURN CONTEXT]
Student: ${contextData.studentName || 'Student'} (${contextData.grade || 'Grade 9'})
Student's Unassisted Initial Claim: "${contextData.initialClaim || 'Not provided'}"
Bench Parameters: Sweetener=${contextData.sweetener || 'Date Paste'}, Temp=${contextData.tempF || 325}°F, MultivariateViolation=${isMultivariate}
Stage-1 Classifier Output:
- Answer Extraction Attempt: ${classification.answerExtractionAttempt}
- Misconception Tag: ${classification.misconceptionTag || 'none'}
- Reasoning Quality: ${classification.reasoningQuality}
- Consecutive Stall Count: ${nextStallCount}

RESPONSE INSTRUCTIONS:
1. If Answer Extraction Attempt is true: warmly refuse to hand over the answer and ask one narrower diagnostic question referencing their own Initial Claim.
2. If Misconception Tag is present: challenge the specific flaw without lecturing (2–4 concise sentences).
3. If Consecutive Stall Count >= 3: acknowledge they've worked hard on a tricky concept and encourage them to click "Call Teacher to Pod" right below so their teacher can join them.
`;

    if (GEMINI_API_KEY) {
      try {
        const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
        if (Array.isArray(history)) {
          for (const item of history.slice(-6)) {
            if (item.text) {
              contents.push({
                role: item.role === 'model' || item.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: item.text }],
              });
            }
          }
        }
        contents.push({ role: 'user', parts: [{ text: message }] });

        const resp = await callGemini({
          model: fastModel,
          systemInstruction: dynamicTurnInstruction,
          contents,
          temperature: 0.65,
          maxOutputTokens: 320,
        });

        if (resp.ok) {
          const data = await resp.json();
          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return NextResponse.json({
              text: replyText,
              model: fastModel,
              tier: 'fast',
              classification,
              nextStallCount,
              recommendTeacherCall,
              safeguardingAlert: false,
            });
          }
        }
      } catch (err) {
        console.warn('Stage-2 mentor fell back to domain logic:', err);
      }
    }

    // Domain-tailored fallback when offline or key unset
    const firstName = (contextData.studentName || 'Student').split(' ')[0];
    let fallbackText = '';
    if (classification.answerExtractionAttempt) {
      fallbackText = `I won't give away the final answer, ${firstName}, because your own reasoning is what matters here. Look back at your initial claim—what is the ONE thing you predicted would change, and what evidence would prove it?`;
    } else if (personaMode === 'specialist') {
      fallbackText = isMultivariate
        ? `[${blueprint.specialistPersona.name}]: In controlled research, altering two variables at once makes it impossible to isolate cause and effect. Before we interpret texture or results, how could you lock one constant so your test is valid?`
        : `[${blueprint.specialistPersona.name}]: Good variable discipline, ${firstName}. Based on your initial claim, what measurable evidence will you record next to test against the rubric?`;
    } else {
      fallbackText = isMultivariate
        ? `Good question, ${firstName}! Right now your bench has two variables changed at once (${contextData.sweetener} and ${contextData.tempF}°F). How will you prove which one caused the difference unless you hold one constant?`
        : `Great inquiry, ${firstName}! Looking at your initial claim for ${milestone.title}, what single piece of evidence from your next trial would confirm or challenge your prediction?`;
    }

    if (recommendTeacherCall) {
      fallbackText += ` (You've hit 3 tricky turns in a row—feel free to tap "Call Teacher to Pod" so your teacher can jump in!)`;
    }

    return NextResponse.json({
      text: fallbackText,
      model: fastModel,
      tier: 'fast',
      classification,
      nextStallCount,
      recommendTeacherCall,
      safeguardingAlert: false,
      status: 'fallback_active',
    });
  } catch (error: any) {
    console.error('Gemini Route Catch Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
