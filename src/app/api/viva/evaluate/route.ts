import { NextResponse } from 'next/server';
import { resolveModelForTier } from '../../../../lib/modelRouter';
import { TRAILSPARK_REFERENCE_BLUEPRINT } from '../../../../data/referenceBlueprints';
import { VentureBlueprint } from '../../../../types/venture';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      transcript = '',
      durationSeconds = 0,
      levelNumber = 7,
      studentName = 'Student',
      initialClaim = '',
      blueprint = TRAILSPARK_REFERENCE_BLUEPRINT,
    } = body as {
      transcript?: string;
      durationSeconds?: number;
      levelNumber?: number;
      studentName?: string;
      initialClaim?: string;
      blueprint?: VentureBlueprint;
    };

    if (!transcript.trim()) {
      return NextResponse.json(
        { error: 'Transcript is required to evaluate oral defense.' },
        { status: 400 }
      );
    }

    const synthesisModel = resolveModelForTier('synthesis');
    const rubricText = blueprint.rubric
      .map((r) => `- ${r.criterion} (${r.weightPct}%): Proficient="${r.proficient}", Exemplary="${r.exemplary}"`)
      .join('\n');

    if (GEMINI_API_KEY) {
      try {
        const prompt = `
You are Daleel's Oral Defense (Viva Voce) Rubric Evaluator.
Student: ${studentName} | Level ${levelNumber} | Recording Duration: ${durationSeconds}s
Venture: ${blueprint.title}
Student's Initial Claim: "${initialClaim || 'None'}"
Oral Defense Transcript: "${transcript}"

Rubric:
${rubricText}

Return ONLY valid JSON:
{
  "overallReadiness": "Emerging" | "Proficient" | "Exemplary",
  "strengths": [string, string],
  "followUpQuestion": string,
  "criterionScores": [{ "criterion": string, "level": "Emerging" | "Proficient" | "Exemplary", "note": string }]
}`;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${synthesisModel}:generateContent?key=${GEMINI_API_KEY}`;
        const resp = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 600,
              responseMimeType: 'application/json',
            },
          }),
        });

        if (resp.ok) {
          const data = await resp.json();
          const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (raw) {
            return NextResponse.json({
              evaluation: JSON.parse(raw),
              model: synthesisModel,
              tier: 'synthesis',
            });
          }
        }
      } catch (err) {
        console.warn('Viva evaluation Gemini fallback:', err);
      }
    }

    // Deterministic rubric-aligned fallback
    const wordCount = transcript.trim().split(/\s+/).length;
    const readiness = wordCount >= 35 ? 'Proficient' : 'Emerging';
    return NextResponse.json({
      evaluation: {
        overallReadiness: readiness,
        strengths: [
          `Delivered a ${durationSeconds || 15}s oral explanation addressing ${blueprint.title}.`,
          wordCount >= 20
            ? 'Connected reasoning back to your milestone task.'
            : 'Concise initial statement; expand with specific trial evidence.',
        ],
        followUpQuestion:
          'Which specific measurement or constant from your trials best proves your conclusion?',
        criterionScores: blueprint.rubric.map((r) => ({
          criterion: r.criterion,
          level: readiness,
          note:
            readiness === 'Proficient'
              ? 'Addressed key concepts; cite exact numbers to reach Exemplary.'
              : 'Needs clearer evidence and controlled-variable references.',
        })),
      },
      model: synthesisModel,
      tier: 'synthesis',
      status: 'fallback_active',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Viva evaluation failed' },
      { status: 500 }
    );
  }
}
