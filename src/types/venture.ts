export type GradeBand = '3-5' | '6-8' | '9-12';

export type VerificationGateType =
  | 'variable_isolation'
  | 'unit_economics'
  | 'primary_source_citation'
  | 'rubric_check'
  | 'oral_defense';

export interface CompetencyTag {
  code: string; // e.g., "NGSS MS-PS1-2" or CASE URI/identifier
  framework: 'NGSS' | 'CCSS' | 'IB' | 'AP' | 'CASE' | 'Custom';
  statement: string;
}

export interface RubricCriterion {
  id: string;
  criterion: string;
  emerging: string;
  proficient: string;
  exemplary: string;
  weightPct: number;
}

export interface MilestoneStage {
  levelNumber: number;
  stageKey:
    | 'frame'
    | 'research'
    | 'model'
    | 'isolate_variables'
    | 'cost_impact'
    | 'peer_review'
    | 'oral_defense';
  title: string;
  subtitle: string;
  enabled: boolean;
  colorName: 'blue' | 'green' | 'purple' | 'amber' | 'gold' | 'teal' | 'ruby';
  realWorldTask: string;
  claimPrompt: string; // Prompt for the "AI-Free Claim First" gate
  claimPlaceholder: string;
  verificationGate: VerificationGateType;
  curriculumCode: string;
  curriculumTopic: string;
  keyQuestion: string;
}

export interface SpecialistPersonaConfig {
  id: string;
  name: string;
  roleTitle: string;
  tone: string;
  readingLevel: string;
  domainCorpusSummary: string;
  outOfScopeBoundary: string;
}

export interface VentureBlueprint {
  id: string;
  version: string;
  title: string;
  subjectArea: string;
  gradeBand: GradeBand;
  drivingQuestion: string;
  communityAudience: string;
  endProductDeliverable: string;
  podSize: number;
  estimatedHours: number;
  competencies: CompetencyTag[];
  rubric: RubricCriterion[];
  milestones: MilestoneStage[];
  specialistPersona: SpecialistPersonaConfig;
  isReference?: boolean;
  unsupportedMediaWarnings?: string[];
}

export interface ClaimArtifact {
  levelNumber: number;
  blueprintId: string;
  claimText: string;
  submittedAt: string;
}

export interface TurnClassifierResult {
  answerExtractionAttempt: boolean;
  misconceptionTag: string | null;
  reasoningQuality: 'low' | 'developing' | 'strong';
  stallIncrement: boolean;
  confidenceTag: 'hesitant_accurate' | 'confident_misconception' | 'calibrated' | 'neutral';
  safeguardingFlag: {
    triggered: boolean;
    severity: 'none' | 'alert';
    reason?: string;
  };
}

export interface HelpRequestItem {
  id: string;
  studentId: string;
  studentName: string;
  levelNumber: number;
  levelTitle: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'resolved';
  priority: 'normal' | 'stall_3x' | 'safeguarding';
}

export interface DiscussionPostItem {
  id: string;
  authorName: string;
  authorRole: string;
  topic: string;
  badge: string;
  content: string;
  timestamp: string;
  likes: number;
}

export interface VivaSubmissionItem {
  transcript: string;
  durationSeconds: number;
  evaluation: {
    overallReadiness: string;
    strengths: string[];
    followUpQuestion: string;
    criterionScores: Array<{ criterion: string; level: string; note: string }>;
  };
  submittedAt: string;
}

export interface StudentRecord {
  id: string;
  name: string;
  grade: string;
  podName: string;
  joinedAt: string;
}

export interface ParentNoteItem {
  id: string;
  studentId: string;
  text: string;
  timestamp: string;
}
