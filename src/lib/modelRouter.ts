import { MilestoneStage, TurnClassifierResult, VentureBlueprint } from '../types/venture';

export type InferenceTier = 'fast' | 'reasoning' | 'synthesis';

/**
 * Dynamic Model Router: routes each task to the lowest-cost tier that satisfies
 * latency and reasoning requirements, avoiding single-heavyweight-model lock-in.
 */
export function resolveModelForTier(tier: InferenceTier): string {
  switch (tier) {
    case 'fast':
      // Routine Socratic dialogue turns, state classification, and safeguarding
      return process.env.DALEEL_MODEL_FAST || 'gemini-3.5-flash-lite';
    case 'reasoning':
      // Complex multi-step STEM/quantitative troubleshooting & Classroom Studio synthesis
      return process.env.DALEEL_MODEL_REASONING || 'gemini-3.5-flash-lite';
    case 'synthesis':
      // Full VentureBlueprint co-design & multimodal oral-defense rubric evaluation
      return process.env.DALEEL_MODEL_SYNTHESIS || 'gemini-3.5-flash-lite';
  }
}

/**
 * Builds a deterministic, cache-friendly static system prefix from the active VentureBlueprint
 * and Specialist Persona so multi-turn sessions maximize KV/prefix cache hit rates.
 */
export function buildStaticPromptPrefix(params: {
  blueprint: VentureBlueprint;
  milestone: MilestoneStage;
  personaMode: 'socratic' | 'specialist';
}): string {
  const { blueprint, milestone, personaMode } = params;
  const rubricSummary = blueprint.rubric
    .map((r) => `- ${r.criterion} (${r.weightPct}%): Proficient = "${r.proficient}"`)
    .join('\n');

  if (personaMode === 'specialist') {
    const sp = blueprint.specialistPersona;
    return [
      `[DALEEL STATIC PREFIX :: SPECIALIST PERSONA]`,
      `Venture: ${blueprint.title} (${blueprint.gradeBand})`,
      `Driving Question: ${blueprint.drivingQuestion}`,
      `Specialist: ${sp.name} — ${sp.roleTitle}`,
      `Tone: ${sp.tone} | Reading Level: ${sp.readingLevel}`,
      `Domain Corpus: ${sp.domainCorpusSummary}`,
      `Strict Out-of-Scope Boundary: ${sp.outOfScopeBoundary}`,
      `Active Milestone (Level ${milestone.levelNumber} - ${milestone.title}): ${milestone.curriculumCode} (${milestone.curriculumTopic})`,
      `Verification Gate: ${milestone.verificationGate}`,
      `Rubric Criteria:\n${rubricSummary}`,
    ].join('\n');
  }

  return [
    `[DALEEL STATIC PREFIX :: SOCRATIC MENTOR]`,
    `Venture: ${blueprint.title} (${blueprint.gradeBand})`,
    `Driving Question: ${blueprint.drivingQuestion}`,
    `Active Milestone (Level ${milestone.levelNumber} - ${milestone.title}): ${milestone.curriculumCode} (${milestone.curriculumTopic})`,
    `Milestone Key Question: ${milestone.keyQuestion}`,
    `Verification Gate: ${milestone.verificationGate}`,
    `Rubric Criteria:\n${rubricSummary}`,
    `Anti-Leakage Rule: Never hand over final answers, completed essays, or solved equations. Ask one focused diagnostic question (2-4 sentences).`,
  ].join('\n');
}

/**
 * Detects unsupported media links (e.g. unindexed YouTube/Vimeo/TikTok URLs)
 * attached during Remix & Upload authoring.
 */
export function detectUnsupportedMediaWarnings(sourceText: string): string[] {
  const warnings: string[] = [];
  if (!sourceText.trim()) return warnings;

  if (/https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com|tiktok\.com)/i.test(sourceText)) {
    warnings.push(
      'Unindexed video URL detected (YouTube/Vimeo/TikTok). Daleel cannot transcribe external video links directly—paste key transcript excerpts or attach a text/PDF summary instead.'
    );
  }
  if (/https?:\/\/docs\.google\.com\/.*\/edit/i.test(sourceText)) {
    warnings.push(
      'Private Google Doc edit link detected. Export as PDF or paste the rubric/reading text directly so the Specialist Persona can index it reliably.'
    );
  }
  return warnings;
}

/**
 * Strict schema validator for AI-generated or teacher-edited VentureBlueprints.
 */
export function validateVentureBlueprint(candidate: unknown): {
  valid: boolean;
  errors: string[];
  blueprint?: VentureBlueprint;
} {
  const errors: string[] = [];
  if (!candidate || typeof candidate !== 'object') {
    return { valid: false, errors: ['Blueprint payload must be a JSON object.'] };
  }

  const bp = candidate as Partial<VentureBlueprint>;
  if (!bp.title || typeof bp.title !== 'string') errors.push('Missing string field: title');
  if (!bp.drivingQuestion || typeof bp.drivingQuestion !== 'string') {
    errors.push('Missing string field: drivingQuestion');
  }
  if (!bp.gradeBand || !['3-5', '6-8', '9-12'].includes(bp.gradeBand)) {
    errors.push('Invalid gradeBand (expected 3-5, 6-8, or 9-12)');
  }
  if (!Array.isArray(bp.rubric) || bp.rubric.length === 0) {
    errors.push('Rubric must contain at least one validated criterion.');
  }
  if (!Array.isArray(bp.milestones) || bp.milestones.length === 0) {
    errors.push('Milestones must contain at least one stage.');
  }
  if (!bp.specialistPersona || !bp.specialistPersona.name || !bp.specialistPersona.roleTitle) {
    errors.push('Specialist persona requires name and roleTitle.');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, errors: [], blueprint: bp as VentureBlueprint };
}

/**
 * Deterministic local classifier fallback when offline or API key is unavailable.
 */
export function runHeuristicClassifier(params: {
  message: string;
  isMultivariate: boolean;
}): TurnClassifierResult {
  const q = params.message.toLowerCase();

  // Safeguarding check
  const selfHarmOrUnsafe =
    /\b(kill myself|hurt myself|suicide|self-harm|end my life|bring a weapon|bomb)\b/i.test(q);
  if (selfHarmOrUnsafe) {
    return {
      answerExtractionAttempt: false,
      misconceptionTag: null,
      reasoningQuality: 'low',
      stallIncrement: false,
      confidenceTag: 'neutral',
      safeguardingFlag: {
        triggered: true,
        severity: 'alert',
        reason: 'Potential student safety or self-harm phrasing detected in mentor chat.',
      },
    };
  }

  const answerExtractionAttempt =
    /\b(just tell me|give me the answer|write it for me|solve it for me|do my homework|what is the exact answer)\b/i.test(
      q
    );

  const lowEffortStall =
    q.trim().length < 12 || /\b(idk|i don't know|no idea|confused|stuck|help)\b/i.test(q);

  const misconceptionTag = params.isMultivariate
    ? 'multivariate_variable_confusion'
    : /\b(sugar is always bad|more heat is always faster)\b/i.test(q)
      ? 'domain_oversimplification'
      : null;

  const confidentMisconception =
    Boolean(misconceptionTag) && /\b(definitely|obviously|100% sure|certain)\b/i.test(q);

  const hesitantAccurate =
    !misconceptionTag &&
    /\b(maybe|i think|not sure|could it be)\b/i.test(q) &&
    q.trim().length > 20;

  return {
    answerExtractionAttempt,
    misconceptionTag,
    reasoningQuality: answerExtractionAttempt || lowEffortStall ? 'low' : 'developing',
    stallIncrement: answerExtractionAttempt || lowEffortStall || Boolean(misconceptionTag),
    confidenceTag: confidentMisconception
      ? 'confident_misconception'
      : hesitantAccurate
        ? 'hesitant_accurate'
        : 'calibrated',
    safeguardingFlag: { triggered: false, severity: 'none' },
  };
}
