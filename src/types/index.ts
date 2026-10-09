export type AppView = 'student' | 'teacher' | 'parent';

export type SweetenerType = 'Honey' | 'Date Paste';

export interface CurriculumStandard {
  code: string; // e.g. "NGSS MS-PS1-2" or "CCSS.MATH.HSA.CED.A.2"
  subject: 'Physical Science' | 'Algebra & Economics' | 'Physiology & Health' | 'Sensory & Nutrition';
  topic: string;
  competencyStatement: string;
  masteryStatus: 'Practicing' | 'Mastered' | 'Needs Variable Scaffolding';
}

export interface BatchLogRecord {
  batchId: string;
  batchNumber: number;
  sweetener: SweetenerType;
  tempF: number;
  ruleChecked: boolean;
  hasViolation: boolean;
  violationReason?: string;
  timestamp: string;
  scienceObservation: string;
  independentVariable: string;
  controlledConstants: string[];
}

export type LearnerCluster =
  | 'Empirical Builders'
  | 'Algorithmic Modelers'
  | 'Creative Catalysts'
  | 'Systems Optimizers';

export interface StudentProfile {
  id: string;
  name: string;
  grade: string;
  role: string;
  department: string;
  avatarColor: string;
  activeLevel: number;
  bio: string;
  staminaScore: number;
  focusMinutes: number;
  cluster: LearnerCluster;
  peerReviewsCompleted: number; // 42-style peer evaluation metric
  collaborativeVelocity: number; // 0-100 velocity index
  standardsMastery: Record<string, number>;
}

export interface CandyLevel {
  levelNumber: number;
  title: string;
  subtitle: string;
  colorName: string;
  bgGradient: string;
  badgeBg: string;
  borderTone: string;
  shadowTone: string;
  stars: number;
  status: 'completed' | 'active' | 'locked';
  realWorldTask: string;
  inAppTool: string;
  curriculumCode: string;
  curriculumTopic: string;
  keyQuestion: string;
}

export interface TeamMessage {
  id: string;
  sender: string;
  recipient: string;
  message: string;
  timestamp: string;
  mathTopic?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isDispatchedHint?: boolean;
}

export interface ClassScatterPoint {
  id: string;
  studentName: string;
  peStaminaIndex: number; // 0 to 100
  focusDurationMins: number; // 0 to 60
  cluster: LearnerCluster;
  peerReviews: number;
  isTargetStudent: boolean;
  notes?: string;
}

export interface SkillRadarPoint {
  axis: string;
  studentScore: number;
  classAverage: number;
}

// 42-Style Pod Collaboration Matrix
export interface PodCollaborationNode {
  podName: string;
  leadStudent: string;
  membersCount: number;
  exchangeVelocity: number; // Messages & data transfers
  crossSubjectIntegrations: string[];
}

export interface CompetencyGainMetric {
  subject: string;
  discipline: string;
  baseline: number; // Traditional pedagogy baseline %
  omniMesh: number; // OmniMesh Active Mesh %
  gainDelta: string;
  standardCode: string;
}

export interface CognitiveBandwidthPoint {
  minute: number;
  deepFlow: number; // % in deep flow active experimentation
  peerMesh: number; // % in peer evaluation & costing
  socraticInquiry: number; // % in Socratic inquiry
  frictionRate: number; // % in cognitive friction / fatigue
}

export interface LongitudinalBatchMetric {
  batch: string;
  stage: string;
  marginPct: number;
  errorRiskPct: number;
  socraticHints: number;
  textureRating: number;
}

