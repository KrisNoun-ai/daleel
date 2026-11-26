import { NextResponse } from 'next/server';
import {
  detectUnsupportedMediaWarnings,
  resolveModelForTier,
  validateVentureBlueprint,
} from '../../../../lib/modelRouter';
import { TRAILSPARK_REFERENCE_BLUEPRINT } from '../../../../data/referenceBlueprints';
import { GradeBand, VentureBlueprint } from '../../../../types/venture';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      gradeBand = '9-12',
      standards = '',
      classHours = 12,
      localContext = '',
      sourceNotes = '',
    } = body as {
      gradeBand?: GradeBand;
      standards?: string;
      classHours?: number;
      localContext?: string;
      sourceNotes?: string;
    };

    const unsupportedMediaWarnings = detectUnsupportedMediaWarnings(sourceNotes);
    const synthesisModel = resolveModelForTier('synthesis');

    if (GEMINI_API_KEY) {
      try {
        const prompt = `
You are Daleel's AI Venture Co-Designer (Guided Architect Mode).
Generate a complete, valid JSON VentureBlueprint for a teacher.

INPUT PARAMETERS:
- Grade Band: ${gradeBand}
- Target Standards / Outcomes: ${standards || 'Scientific Inquiry & Quantitative Modeling'}
- Available Class Hours: ${classHours}
- Local Community Context: ${localContext || 'Local school & neighborhood community'}
- Attached Source Excerpts: ${sourceNotes || 'None'}

REQUIREMENTS:
Return ONLY valid JSON matching this exact TypeScript shape:
{
  "id": string,
  "version": "1.0.0",
  "title": string,
  "subjectArea": string,
  "gradeBand": "${gradeBand}",
  "drivingQuestion": string,
  "communityAudience": string,
  "endProductDeliverable": string,
  "podSize": number,
  "estimatedHours": ${Number(classHours) || 12},
  "competencies": [{ "code": string, "framework": "NGSS" | "CCSS" | "IB" | "AP" | "CASE" | "Custom", "statement": string }],
  "rubric": [{ "id": string, "criterion": string, "emerging": string, "proficient": string, "exemplary": string, "weightPct": number }],
  "specialistPersona": {
    "id": "specialist",
    "name": string,
    "roleTitle": string,
    "tone": string,
    "readingLevel": string,
    "domainCorpusSummary": string,
    "outOfScopeBoundary": string
  },
  "milestones": [
    7 objects with levelNumber 1..7, stageKey ("frame"|"research"|"model"|"isolate_variables"|"cost_impact"|"peer_review"|"oral_defense"), title, subtitle, enabled: true, colorName ("blue"|"green"|"purple"|"amber"|"gold"|"teal"|"ruby"), realWorldTask, claimPrompt, claimPlaceholder, verificationGate ("rubric_check"|"primary_source_citation"|"variable_isolation"|"unit_economics"|"oral_defense"), curriculumCode, curriculumTopic, keyQuestion
  ]
}`;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${synthesisModel}:generateContent?key=${GEMINI_API_KEY}`;
        const resp = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 2048,
              responseMimeType: 'application/json',
            },
          }),
        });

        if (resp.ok) {
          const data = await resp.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            const validation = validateVentureBlueprint(parsed);
            if (validation.valid && validation.blueprint) {
              validation.blueprint.unsupportedMediaWarnings = unsupportedMediaWarnings;
              return NextResponse.json({
                blueprint: validation.blueprint,
                warnings: unsupportedMediaWarnings,
                model: synthesisModel,
                validated: true,
              });
            }
          }
        }
      } catch (err) {
        console.warn('Blueprint Co-Designer AI synthesis fell back to deterministic builder:', err);
      }
    }

    // Deterministic schema-validated fallback blueprint tailored to the teacher's 4 inputs
    const topicLabel = standards.trim() || 'Community Applied Inquiry';
    const contextLabel = localContext.trim() || 'Local School & Community';
    const generated: VentureBlueprint = {
      ...TRAILSPARK_REFERENCE_BLUEPRINT,
      id: `custom-${Date.now()}`,
      title: `${topicLabel.slice(0, 42)} Venture`,
      subjectArea: topicLabel,
      gradeBand,
      drivingQuestion: `How can Grade ${gradeBand} pods investigate and prototype a measurable solution for ${contextLabel} aligned to ${topicLabel}?`,
      communityAudience: `${contextLabel} Stakeholders & Faculty Panel`,
      endProductDeliverable: 'Validated Prototype Artifact + Evidence Defense',
      estimatedHours: Number(classHours) || 12,
      isReference: false,
      unsupportedMediaWarnings,
      competencies: [
        {
          code: standards.split(',')[0]?.trim() || 'CASE-CUSTOM-1',
          framework: 'Custom',
          statement: `Apply ${topicLabel} to solve an authentic challenge in ${contextLabel}.`,
        },
      ],
      specialistPersona: {
        id: 'specialist',
        name: 'Dr. Wissam Sammouri',
        roleTitle: `${topicLabel.slice(0, 28)} Field Advisor`,
        tone: 'Inquisitive, Socratic, supportive, concise (2–4 sentences)',
        readingLevel: `Grades ${gradeBand}`,
        domainCorpusSummary: sourceNotes.trim()
          ? `Teacher-attached source context: ${sourceNotes.slice(0, 300)}`
          : `Core principles of ${topicLabel} applied to ${contextLabel}.`,
        outOfScopeBoundary:
          'Never solve deliverables for the student; require an unassisted claim first and guide via diagnostic questions.',
      },
      milestones: TRAILSPARK_REFERENCE_BLUEPRINT.milestones.map((m) => ({
        ...m,
        curriculumCode: standards.split(',')[0]?.trim() || m.curriculumCode,
        claimPrompt: `Submit your unassisted claim for "${m.title}" (${topicLabel}) before unlocking mentor feedback.`,
      })),
    };

    const validation = validateVentureBlueprint(generated);
    return NextResponse.json({
      blueprint: validation.blueprint,
      warnings: unsupportedMediaWarnings,
      model: synthesisModel,
      validated: validation.valid,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to generate VentureBlueprint' },
      { status: 500 }
    );
  }
}
