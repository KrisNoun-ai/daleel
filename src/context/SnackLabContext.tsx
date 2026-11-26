'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  AppView,
  SweetenerType,
  BatchLogRecord,
  StudentProfile,
  TeamMessage,
  ChatMessage,
  ClassScatterPoint,
  SkillRadarPoint,
  CurriculumStandard,
  CandyLevel,
  LearnerCluster,
  PodCollaborationNode,
} from '../types';
import {
  ClaimArtifact,
  TurnClassifierResult,
  VentureBlueprint,
} from '../types/venture';
import {
  REFERENCE_BLUEPRINTS,
  TRAILSPARK_REFERENCE_BLUEPRINT,
} from '../data/referenceBlueprints';
import {
  broadcastClassroomEvent,
  subscribeClassroomEvents,
} from '../lib/realtimeBus';

export const LEBANESE_DEMO_STUDENTS: StudentProfile[] = [
  {
    id: 'samir-haddad',
    name: 'Samir Haddad',
    grade: 'Grade 9',
    role: 'Lab Scientist & Biothermal Lead',
    department: 'Operations & Kitchen Lab',
    avatarColor: 'bg-emerald-600',
    activeLevel: 3,
    bio: 'Specializes in moisture retention kinetics, polysaccharide binders, and controlled fair tests in the food incubator.',
    staminaScore: 88,
    focusMinutes: 52,
    cluster: 'Empirical Builders',
    peerReviewsCompleted: 14,
    collaborativeVelocity: 88,
    standardsMastery: {
      'NGSS MS-PS1-2 (Variable Isolation)': 94,
      'CCSS.MATH.HSA (Linear Modeling)': 72,
      'PE Standard 4 (Aerobic Focus)': 86,
      'Food Safety (Water Activity)': 91,
    },
  },
  {
    id: 'yara-khoury',
    name: 'Yara Khoury',
    grade: 'Grade 9',
    role: 'Brand & Creative Director',
    department: 'Marketing & Packaging Studio',
    avatarColor: 'bg-purple-600',
    activeLevel: 6,
    bio: 'Designs biodegradable food packaging, typographic systems, and consumer empathy maps for Lebanese youth.',
    staminaScore: 78,
    focusMinutes: 48,
    cluster: 'Creative Catalysts',
    peerReviewsCompleted: 18,
    collaborativeVelocity: 94,
    standardsMastery: {
      'NGSS MS-PS1-2 (Variable Isolation)': 80,
      'CCSS.MATH.HSA (Linear Modeling)': 68,
      'PE Standard 4 (Aerobic Focus)': 79,
      'Design & Visual Storytelling': 98,
    },
  },
  {
    id: 'jad-mansour',
    name: 'Jad Mansour',
    grade: 'Grade 9',
    role: 'Unit Economics & Linear Algebra Lead',
    department: 'Cost Accounting & Analytics',
    avatarColor: 'bg-blue-600',
    activeLevel: 5,
    bio: 'Formulates multi-variable cost equations C(x) = Fixed + Variable(x) and models batch margins from 20 to 200 units.',
    staminaScore: 65,
    focusMinutes: 42,
    cluster: 'Algorithmic Modelers',
    peerReviewsCompleted: 22,
    collaborativeVelocity: 91,
    standardsMastery: {
      'NGSS MS-PS1-2 (Variable Isolation)': 76,
      'CCSS.MATH.HSA (Linear Modeling)': 96,
      'PE Standard 4 (Aerobic Focus)': 64,
      'Profit Margin Optimization': 95,
    },
  },
  {
    id: 'nour-saliba',
    name: 'Nour Saliba',
    grade: 'Grade 9',
    role: 'Sensory Science & Nutrition Lead',
    department: 'Food Science & Quality Assurance',
    avatarColor: 'bg-amber-600',
    activeLevel: 4,
    bio: 'Oversees blindfold sensory matrices, chemosensory flavor curves, and water activity Aw meters for shelf preservation.',
    staminaScore: 82,
    focusMinutes: 50,
    cluster: 'Systems Optimizers',
    peerReviewsCompleted: 16,
    collaborativeVelocity: 86,
    standardsMastery: {
      'NGSS MS-PS1-2 (Variable Isolation)': 88,
      'CCSS.MATH.HSA (Linear Modeling)': 84,
      'PE Standard 4 (Aerobic Focus)': 83,
      'Sensory Blind Testing Matrix': 94,
    },
  },
  {
    id: 'karim-gemayel',
    name: 'Karim Gemayel',
    grade: 'Grade 9',
    role: 'Biopolymer Chemistry Specialist',
    department: 'Formulation & Material Science',
    avatarColor: 'bg-teal-600',
    activeLevel: 2,
    bio: 'Studies soluble pectin gelling chains and dietary fiber hydration in Mediterranean dried fruits and dates.',
    staminaScore: 84,
    focusMinutes: 46,
    cluster: 'Empirical Builders',
    peerReviewsCompleted: 12,
    collaborativeVelocity: 82,
    standardsMastery: {
      'NGSS MS-PS1-2 (Variable Isolation)': 90,
      'CCSS.MATH.HSA (Linear Modeling)': 78,
      'PE Standard 4 (Aerobic Focus)': 81,
      'Material Hydration': 92,
    },
  },
  {
    id: 'lea-aoun',
    name: 'Lea Aoun',
    grade: 'Grade 9',
    role: 'Consumer Insights & Survey Statistician',
    department: 'Market Research & Field Data',
    avatarColor: 'bg-rose-600',
    activeLevel: 1,
    bio: 'Deploys stratified sampling across 120 Lebanese high school athletes to pinpoint exact caloric and protein demands.',
    staminaScore: 76,
    focusMinutes: 44,
    cluster: 'Creative Catalysts',
    peerReviewsCompleted: 15,
    collaborativeVelocity: 89,
    standardsMastery: {
      'NGSS MS-PS1-2 (Variable Isolation)': 82,
      'CCSS.MATH.HSA (Linear Modeling)': 88,
      'PE Standard 4 (Aerobic Focus)': 75,
      'Survey Sampling & Statistics': 96,
    },
  },
  {
    id: 'tarek-rahme',
    name: 'Tarek Rahme',
    grade: 'Grade 9',
    role: 'Thermal Kinetics & Oven Calibration Lead',
    department: 'Operations & Process Engineering',
    avatarColor: 'bg-indigo-600',
    activeLevel: 3,
    bio: 'Calibrates convective heat transfer and Maillard caramelization profiles for consistent chewiness texture.',
    staminaScore: 86,
    focusMinutes: 49,
    cluster: 'Empirical Builders',
    peerReviewsCompleted: 13,
    collaborativeVelocity: 85,
    standardsMastery: {
      'NGSS MS-PS1-2 (Variable Isolation)': 89,
      'CCSS.MATH.HSA (Linear Modeling)': 75,
      'PE Standard 4 (Aerobic Focus)': 85,
      'Thermal Heat Transfer': 93,
    },
  },
  {
    id: 'maya-boulos',
    name: 'Maya Boulos',
    grade: 'Grade 9',
    role: 'Venture Strategy & Pitch Lead',
    department: 'Executive Governance & Defense',
    avatarColor: 'bg-sky-600',
    activeLevel: 7,
    bio: 'Prepares executive pitch syntheses, investor returns calculations, and regulatory food safety certifications.',
    staminaScore: 80,
    focusMinutes: 51,
    cluster: 'Systems Optimizers',
    peerReviewsCompleted: 20,
    collaborativeVelocity: 95,
    standardsMastery: {
      'NGSS MS-PS1-2 (Variable Isolation)': 86,
      'CCSS.MATH.HSA (Linear Modeling)': 92,
      'PE Standard 4 (Aerobic Focus)': 78,
      'Executive Oral Presentation': 97,
    },
  },
];

export const CANDY_LEVELS: CandyLevel[] = [
  {
    levelNumber: 1,
    title: 'Customer Discovery',
    subtitle: 'Survey classmates & build customer persona',
    colorName: 'blue',
    bgGradient: 'from-sky-400 to-blue-600',
    badgeBg: 'bg-blue-500',
    borderTone: 'border-blue-300',
    shadowTone: 'shadow-blue-500/30',
    stars: 3,
    status: 'completed',
    realWorldTask: 'Survey 25 high school athletes and students on snack habits and dietary preferences in Beirut.',
    inAppTool: 'Interactive Persona Builder & Classmate Survey Matrix',
    curriculumCode: 'CCSS.ELA-LITERACY.SL.9-10.1',
    curriculumTopic: 'Qualitative Research & Persona Architecture',
    keyQuestion: 'Who exactly is your consumer, and how do you validate what they truly need vs what they say?',
  },
  {
    levelNumber: 2,
    title: 'Recipe Architecture',
    subtitle: 'Select ingredients & balance macronutrients',
    colorName: 'green',
    bgGradient: 'from-emerald-400 to-teal-600',
    badgeBg: 'bg-emerald-500',
    borderTone: 'border-emerald-300',
    shadowTone: 'shadow-emerald-500/30',
    stars: 3,
    status: 'completed',
    realWorldTask: 'Source raw rolled oats, seeds, and binders to engineer a clean-label formula.',
    inAppTool: 'Nutritional Ratio Calculator & Ingredient Synthesizer',
    curriculumCode: 'NGSS MS-PS1-1',
    curriculumTopic: 'Macronutrient Chemistry & Pectin Matrix',
    keyQuestion: 'What structural role does each ingredient play in water binding and chewiness?',
  },
  {
    levelNumber: 3,
    title: 'Kitchen Lab (Fair Test)',
    subtitle: 'Bake trial batches isolating one variable at a time',
    colorName: 'purple',
    bgGradient: 'from-fuchsia-500 to-purple-600',
    badgeBg: 'bg-purple-500',
    borderTone: 'border-purple-300',
    shadowTone: 'shadow-purple-500/30',
    stars: 2,
    status: 'active',
    realWorldTask: 'Bake 3 batches in school test kitchen, testing Date Paste vs Honey at controlled temperature.',
    inAppTool: 'Scientific Fair Test Workbench & Kinetic Thermal Simulator',
    curriculumCode: 'NGSS MS-PS1-2',
    curriculumTopic: 'Controlled Variable Scientific Inquiry',
    keyQuestion: 'If you change both the sweetener and the baking temperature, how do you prove causality?',
  },
  {
    levelNumber: 4,
    title: 'Taste & Sensory Lab',
    subtitle: 'Blind taste tests & shelf-life water activity',
    colorName: 'amber',
    bgGradient: 'from-amber-400 to-orange-500',
    badgeBg: 'bg-amber-500',
    borderTone: 'border-amber-300',
    shadowTone: 'shadow-amber-500/30',
    stars: 1,
    status: 'active',
    realWorldTask: 'Run blindfold sensory evaluation with 10 peer tasters on crispness, chewiness, and sweetness.',
    inAppTool: 'Sensory Radar Matrix & Water Activity (Aw) Tracker',
    curriculumCode: 'NGSS MS-LS1-8',
    curriculumTopic: 'Chemosensory Receptors & Microbial Stability',
    keyQuestion: 'Is 5 tasters sufficient sample size to establish statistical sensory significance?',
  },
  {
    levelNumber: 5,
    title: 'The Numbers (Linear Cost)',
    subtitle: 'Cost per bar, margin curves, scale-up slider',
    colorName: 'gold',
    bgGradient: 'from-yellow-400 to-amber-600',
    badgeBg: 'bg-yellow-500',
    borderTone: 'border-yellow-300',
    shadowTone: 'shadow-yellow-500/30',
    stars: 0,
    status: 'active',
    realWorldTask: 'Calculate wholesale bulk vs retail pricing for packaging, dry ingredients, and production labor.',
    inAppTool: 'Linear Cost Function Model C(x) = Fixed + Variable(x)',
    curriculumCode: 'CCSS.MATH.HSA.CED.A.2',
    curriculumTopic: 'Linear Modeling & Margin Derivatives',
    keyQuestion: 'How does scaling batch size from 20 to 150 bars alter your break-even point?',
  },
  {
    levelNumber: 6,
    title: 'Brand & Wrapper Studio',
    subtitle: 'Logo design, slogan, and mock wrapper packaging',
    colorName: 'teal',
    bgGradient: 'from-cyan-400 to-teal-600',
    badgeBg: 'bg-teal-500',
    borderTone: 'border-teal-300',
    shadowTone: 'shadow-teal-500/30',
    stars: 0,
    status: 'active',
    realWorldTask: 'Create an eye-catching wrapper mockup that complies with food nutrition labeling guidelines.',
    inAppTool: 'Packaging Visualizer & Brand Persona Validator',
    curriculumCode: 'CCSS.ELA-LITERACY.WHST.9-10.2',
    curriculumTopic: 'Visual Communication & Regulatory Labeling',
    keyQuestion: 'Does your wrapper typography and color palette reflect the athletic customer persona from Level 1?',
  },
  {
    levelNumber: 7,
    title: 'The Big Pitch',
    subtitle: 'Pitch outline & mock investor simulation',
    colorName: 'ruby',
    bgGradient: 'from-rose-500 to-red-600',
    badgeBg: 'bg-rose-500',
    borderTone: 'border-rose-300',
    shadowTone: 'shadow-rose-500/30',
    stars: 0,
    status: 'active',
    realWorldTask: 'Present a 3-minute investor pitch to school administrators, parents, and culinary judges.',
    inAppTool: 'Socratic Investor Panel & Pitch Defense Simulator',
    curriculumCode: 'CCSS.ELA-LITERACY.SL.9-10.4',
    curriculumTopic: 'Executive Oral Presentation & Defense',
    keyQuestion: 'Can you defend your ingredient costs, fair-test science, and target margin under investor scrutiny?',
  },
];

// 28 LEBANESE COHORT PEERS (GRADE 9) FOR TABLEAU SCATTER & CLUSTER ANALYSIS
export const LEBANESE_28_COHORT: ClassScatterPoint[] = [
  { id: 'target-student', studentName: 'Samir Haddad', peStaminaIndex: 88, focusDurationMins: 52, cluster: 'Empirical Builders', peerReviews: 14, isTargetStudent: true },
  { id: 'peer-1', studentName: 'Yara Khoury', peStaminaIndex: 78, focusDurationMins: 48, cluster: 'Creative Catalysts', peerReviews: 18, isTargetStudent: false },
  { id: 'peer-2', studentName: 'Jad Mansour', peStaminaIndex: 65, focusDurationMins: 42, cluster: 'Algorithmic Modelers', peerReviews: 22, isTargetStudent: false },
  { id: 'peer-3', studentName: 'Nour Saliba', peStaminaIndex: 82, focusDurationMins: 50, cluster: 'Systems Optimizers', peerReviews: 16, isTargetStudent: false },
  { id: 'peer-4', studentName: 'Karim Gemayel', peStaminaIndex: 84, focusDurationMins: 46, cluster: 'Empirical Builders', peerReviews: 12, isTargetStudent: false },
  { id: 'peer-5', studentName: 'Lea Aoun', peStaminaIndex: 76, focusDurationMins: 44, cluster: 'Creative Catalysts', peerReviews: 15, isTargetStudent: false },
  { id: 'peer-6', studentName: 'Tarek Rahme', peStaminaIndex: 86, focusDurationMins: 49, cluster: 'Empirical Builders', peerReviews: 13, isTargetStudent: false },
  { id: 'peer-7', studentName: 'Maya Boulos', peStaminaIndex: 80, focusDurationMins: 51, cluster: 'Systems Optimizers', peerReviews: 20, isTargetStudent: false },
  { id: 'peer-8', studentName: 'Ziad Frem', peStaminaIndex: 90, focusDurationMins: 54, cluster: 'Empirical Builders', peerReviews: 15, isTargetStudent: false },
  { id: 'peer-9', studentName: 'Charbel Aoun', peStaminaIndex: 58, focusDurationMins: 36, cluster: 'Algorithmic Modelers', peerReviews: 11, isTargetStudent: false },
  { id: 'peer-10', studentName: 'Amina Berri', peStaminaIndex: 81, focusDurationMins: 47, cluster: 'Systems Optimizers', peerReviews: 17, isTargetStudent: false },
  { id: 'peer-11', studentName: 'Georges Kanaan', peStaminaIndex: 74, focusDurationMins: 43, cluster: 'Creative Catalysts', peerReviews: 14, isTargetStudent: false },
  { id: 'peer-12', studentName: 'Zeina Tueni', peStaminaIndex: 68, focusDurationMins: 41, cluster: 'Algorithmic Modelers', peerReviews: 16, isTargetStudent: false },
  { id: 'peer-13', studentName: 'Rami Saade', peStaminaIndex: 92, focusDurationMins: 55, cluster: 'Empirical Builders', peerReviews: 19, isTargetStudent: false },
  { id: 'peer-14', studentName: 'Celine Chidiac', peStaminaIndex: 83, focusDurationMins: 49, cluster: 'Systems Optimizers', peerReviews: 15, isTargetStudent: false },
  { id: 'peer-15', studentName: 'Walid Helou', peStaminaIndex: 70, focusDurationMins: 45, cluster: 'Creative Catalysts', peerReviews: 13, isTargetStudent: false },
  { id: 'peer-16', studentName: 'Marc Mouawad', peStaminaIndex: 89, focusDurationMins: 53, cluster: 'Empirical Builders', peerReviews: 18, isTargetStudent: false },
  { id: 'peer-17', studentName: 'Lynn Sfeir', peStaminaIndex: 62, focusDurationMins: 39, cluster: 'Algorithmic Modelers', peerReviews: 12, isTargetStudent: false },
  { id: 'peer-18', studentName: 'Hadi Chamoun', peStaminaIndex: 75, focusDurationMins: 46, cluster: 'Creative Catalysts', peerReviews: 14, isTargetStudent: false },
  { id: 'peer-19', studentName: 'Rana Matar', peStaminaIndex: 87, focusDurationMins: 52, cluster: 'Systems Optimizers', peerReviews: 21, isTargetStudent: false },
  { id: 'peer-20', studentName: 'Elie Bitar', peStaminaIndex: 54, focusDurationMins: 33, cluster: 'Algorithmic Modelers', peerReviews: 10, isTargetStudent: false },
  { id: 'peer-21', studentName: 'Nayla Rizk', peStaminaIndex: 79, focusDurationMins: 48, cluster: 'Creative Catalysts', peerReviews: 16, isTargetStudent: false },
  { id: 'peer-22', studentName: 'Bassam Fattal', peStaminaIndex: 85, focusDurationMins: 50, cluster: 'Empirical Builders', peerReviews: 17, isTargetStudent: false },
  { id: 'peer-23', studentName: 'Layla Hobeika', peStaminaIndex: 72, focusDurationMins: 44, cluster: 'Systems Optimizers', peerReviews: 15, isTargetStudent: false },
  { id: 'peer-24', studentName: 'Fadi Ghostine', peStaminaIndex: 66, focusDurationMins: 40, cluster: 'Algorithmic Modelers', peerReviews: 13, isTargetStudent: false },
  { id: 'peer-25', studentName: 'Soraya Bustros', peStaminaIndex: 77, focusDurationMins: 47, cluster: 'Creative Catalysts', peerReviews: 16, isTargetStudent: false },
  { id: 'peer-26', studentName: 'Kamal Gebran', peStaminaIndex: 91, focusDurationMins: 56, cluster: 'Empirical Builders', peerReviews: 20, isTargetStudent: false },
  { id: 'peer-27', studentName: 'Dina Trad', peStaminaIndex: 60, focusDurationMins: 38, cluster: 'Algorithmic Modelers', peerReviews: 11, isTargetStudent: false },
];

export const POD_MESH_NODES: PodCollaborationNode[] = [
  {
    podName: 'Kitchen Operations & Science',
    leadStudent: 'Samir Haddad',
    membersCount: 7,
    exchangeVelocity: 94,
    crossSubjectIntegrations: ['Physical Science', 'Heat Kinetics', 'Recipe Isolation'],
  },
  {
    podName: 'Unit Economics & Math',
    leadStudent: 'Jad Mansour',
    membersCount: 7,
    exchangeVelocity: 91,
    crossSubjectIntegrations: ['Linear Algebra', 'Batch Costing', 'Profit Margins'],
  },
  {
    podName: 'Branding & Packaging',
    leadStudent: 'Yara Khoury',
    membersCount: 7,
    exchangeVelocity: 96,
    crossSubjectIntegrations: ['Visual Communication', 'Labeling Standards', 'Customer Empathy'],
  },
  {
    podName: 'Quality & Food Safety',
    leadStudent: 'Nour Saliba',
    membersCount: 7,
    exchangeVelocity: 88,
    crossSubjectIntegrations: ['Food Biology', 'Water Activity (aw)', 'Shelf Life'],
  },
];

export type MentorPersona = 'socratic' | 'biochemist' | 'economist' | 'food_safety';

export interface ClassDiscussionPost {
  id: string;
  authorName: string;
  authorRole: string;
  grade: string;
  avatarColor: string;
  topic: string;
  content: string;
  timestamp: string;
  likes: number;
  repliesCount: number;
  badge?: string;
}

export const INITIAL_CLASS_DISCUSSION_POSTS: ClassDiscussionPost[] = [
  {
    id: 'post-1',
    authorName: 'Jad Mansour',
    authorRole: 'Unit Economics Lead',
    grade: 'Grade 9',
    avatarColor: 'bg-blue-600',
    topic: 'Linear Cost C(x) Equation for Bulk Date Paste',
    content: 'Team, our cost equation C(x) = $15.00 fixed equipment amortized + $0.72 per bar variable drops down to $0.66 if we purchase Lebanese Medjool dates in 20kg bulk boxes from the Bekaa coop! That opens up a 73.6% gross margin at a $2.50 retail price.',
    timestamp: '25m ago',
    likes: 8,
    repliesCount: 4,
    badge: 'Economics',
  },
  {
    id: 'post-2',
    authorName: 'Nour Saliba',
    authorRole: 'Sensory QA & Water Activity Lead',
    grade: 'Grade 9',
    avatarColor: 'bg-emerald-600',
    topic: 'Blind Sensory Testing Results for Batch 03 vs 04',
    content: 'Just ran the sensory radar test with 12 classmates. 10 out of 12 preferred the 325°F bake over the 350°F bake because the pectin fibers retained optimal chewiness without surface crusting. Also measured water activity Aw = 0.58, which is completely mold-safe!',
    timestamp: '42m ago',
    likes: 11,
    repliesCount: 6,
    badge: 'Sensory QA',
  },
  {
    id: 'post-3',
    authorName: 'Tarek Rahme',
    authorRole: 'Thermal Kinetics & Oven Calibration',
    grade: 'Grade 9',
    avatarColor: 'bg-indigo-600',
    topic: 'Fair Test Reminder: Isolate Oven Temp & Sweetener',
    content: 'Reminder for everyone working on Level 3 batches: if you shift both your binder and your baking temperature in the same batch, the physical science standard NGSS MS-PS1-2 fails because you cannot prove which parameter altered the texture. Test one variable at a time!',
    timestamp: '1h ago',
    likes: 14,
    repliesCount: 5,
    badge: 'Physical Science',
  },
  {
    id: 'post-4',
    authorName: 'Yara Khoury',
    authorRole: 'Brand Identity & Packaging Designer',
    grade: 'Grade 9',
    avatarColor: 'bg-purple-600',
    topic: 'Wrapper Design & Nutrition Facts Panel',
    content: 'Uploaded the first draft of the recyclable compostable wrapper! Emphasizing 8g Mediterranean Plant Protein, Zero Refined Sugars, and locally sourced Bekaa oats. Feedback wanted on the athletic typography.',
    timestamp: '2h ago',
    likes: 9,
    repliesCount: 3,
    badge: 'Brand Studio',
  },
];

export interface TeacherHelpRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentRole: string;
  levelTitle: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'resolved';
}

interface OmniMeshContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  authenticatedParentStudent: string | null;
  setAuthenticatedParentStudent: (id: string | null) => void;
  isParentPinModalOpen: boolean;
  setIsParentPinModalOpen: (open: boolean) => void;
  isArchitectureModalOpen: boolean;
  setIsArchitectureModalOpen: (open: boolean) => void;

  students: StudentProfile[];
  activeStudentId: string;
  setActiveStudentId: (id: string) => void;
  student: StudentProfile;

  levels: CandyLevel[];
  selectedLevelNumber: number;
  setSelectedLevelNumber: (lvl: number) => void;
  isLevelModalOpen: boolean;
  setIsLevelModalOpen: (open: boolean) => void;

  sweetener: SweetenerType;
  setSweetener: (s: SweetenerType) => void;
  tempF: number;
  setTempF: (t: number) => void;
  ruleChecked: boolean;
  setRuleChecked: (c: boolean) => void;

  lastBatchLog: BatchLogRecord | null;
  logBatch: () => void;
  resetDemoToViolation: () => void;
  resetDemoToValid: () => void;

  // Socratic Mentor Desk
  isSocraticDrawerOpen: boolean;
  setIsSocraticDrawerOpen: (open: boolean) => void;
  socraticMessages: ChatMessage[];
  sendSocraticMessageToGemini: (text: string) => Promise<void>;
  isGeminiThinking: boolean;
  hasUnreadSocraticHint: boolean;
  markSocraticAsRead: () => void;
  openLevelSocraticDesk: (levelNumber: number) => void;

  // Field Professional Mentorship Persona (Dr. Wissam Sammouri)
  activeMentorPersona: MentorPersona;
  setActiveMentorPersona: (persona: MentorPersona) => void;

  // Real-time Teacher Assistance Requests
  teacherHelpRequests: TeacherHelpRequest[];
  activeTeacherNotification: TeacherHelpRequest | null;
  requestTeacherHelp: (customMessage?: string) => void;
  dismissTeacherNotification: () => void;
  resolveTeacherHelp: (id: string) => void;

  // Class Discussion Forum
  isClassDiscussionOpen: boolean;
  setIsClassDiscussionOpen: (open: boolean) => void;
  classDiscussionPosts: ClassDiscussionPost[];
  addClassDiscussionPost: (topic: string, content: string) => void;
  likeDiscussionPost: (id: string) => void;

  isTeamDispatchOpen: boolean;
  setIsTeamDispatchOpen: (open: boolean) => void;
  teamMessages: TeamMessage[];
  sendTeamMessage: (msg: string) => void;

  teacherViewMode: 'overview' | 'deep_dive';
  setTeacherViewMode: (mode: 'overview' | 'deep_dive') => void;
  teacherDeepDiveStudent: string;
  setTeacherDeepDiveStudent: (id: string) => void;
  dispatchSocraticHint: () => void;
  isHintDispatched: boolean;

  teacherCopilotMessages: ChatMessage[];
  sendTeacherCopilotMessageToGemini: (text: string) => Promise<void>;
  isTeacherCopilotThinking: boolean;

  curriculumStandards: CurriculumStandard[];
  scatterPoints: ClassScatterPoint[];
  radarData: SkillRadarPoint[];
  podNodes: PodCollaborationNode[];

  // Phase 1: Teacher-Configurable VentureBlueprint, Claim-First Gate & Anti-Leakage Stall State
  activeBlueprint: VentureBlueprint;
  availableBlueprints: VentureBlueprint[];
  activateBlueprint: (blueprint: VentureBlueprint) => void;
  addAndActivateBlueprint: (blueprint: VentureBlueprint) => void;
  isCoDesignerOpen: boolean;
  setIsCoDesignerOpen: (open: boolean) => void;
  claimsByLevel: Record<number, ClaimArtifact>;
  submitInitialClaim: (levelNumber: number, claimText: string) => void;
  stallCountByLevel: Record<number, number>;
  recommendTeacherCallByLevel: Record<number, boolean>;
  lastTurnClassification: TurnClassifierResult | null;

  // Phase 2: Co-Orchestration, Human Override, Voice Defense & Join-by-Code
  pausedStudentIds: Record<string, boolean>;
  toggleAiPauseForStudent: (studentId: string) => void;
  sendDirectTeacherMessage: (studentId: string, text: string) => void;
  studentSignals: Record<string, { misconceptionTag: string | null; confidenceTag: string }>;
  classJoinCode: string;
  isJoinModalOpen: boolean;
  setIsJoinModalOpen: (open: boolean) => void;
  joinClassWithCode: (code: string, studentName: string) => { ok: boolean; error?: string };
  isPortfolioModalOpen: boolean;
  setIsPortfolioModalOpen: (open: boolean) => void;
  vivaSubmissions: Record<
    number,
    {
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
  >;
  saveVivaSubmission: (
    levelNumber: number,
    submission: {
      transcript: string;
      durationSeconds: number;
      evaluation: {
        overallReadiness: string;
        strengths: string[];
        followUpQuestion: string;
        criterionScores: Array<{ criterion: string; level: string; note: string }>;
      };
    }
  ) => void;
  completedLevels: number[];
  completeLevel: (levelNumber: number) => void;
  parentNotes: Array<{ id: string; studentId: string; text: string; timestamp: string }>;
  sendParentEncouragement: (text: string) => void;
  exportStudentDataJson: () => void;
  deleteStudentData: () => void;
}

const OmniMeshContext = createContext<OmniMeshContextType | undefined>(undefined);

export const SnackLabProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('student');
  const [authenticatedParentStudent, setAuthenticatedParentStudent] = useState<string | null>(null);
  const [isParentPinModalOpen, setIsParentPinModalOpen] = useState<boolean>(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState<boolean>(false);

  // 8 Lebanese Students
  const [students] = useState<StudentProfile[]>(LEBANESE_DEMO_STUDENTS);
  const [activeStudentId, setActiveStudentId] = useState<string>('samir-haddad');
  const student = students.find((s) => s.id === activeStudentId) || students[0];

  const [availableBlueprints, setAvailableBlueprints] = useState<VentureBlueprint[]>(REFERENCE_BLUEPRINTS);
  const [activeBlueprint, setActiveBlueprint] = useState<VentureBlueprint>(TRAILSPARK_REFERENCE_BLUEPRINT);
  const [isCoDesignerOpen, setIsCoDesignerOpen] = useState<boolean>(false);
  const [claimsByLevel, setClaimsByLevel] = useState<Record<number, ClaimArtifact>>({});
  const [stallCountByLevel, setStallCountByLevel] = useState<Record<number, number>>({});
  const [recommendTeacherCallByLevel, setRecommendTeacherCallByLevel] = useState<Record<number, boolean>>({});
  const [lastTurnClassification, setLastTurnClassification] = useState<TurnClassifierResult | null>(null);

  // Phase 2 state
  const [pausedStudentIds, setPausedStudentIds] = useState<Record<string, boolean>>({});
  const [studentSignals, setStudentSignals] = useState<
    Record<string, { misconceptionTag: string | null; confidenceTag: string }>
  >({
    'samir-haddad': {
      misconceptionTag: 'multivariate_variable_confusion',
      confidenceTag: 'confident_misconception',
    },
    'jad-mansour': {
      misconceptionTag: null,
      confidenceTag: 'hesitant_accurate',
    },
  });
  const [classJoinCode] = useState<string>('DALEEL9');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState<boolean>(false);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState<boolean>(false);
  const [completedLevels, setCompletedLevels] = useState<number[]>([1, 2]);
  const [parentNotes, setParentNotes] = useState<
    Array<{ id: string; studentId: string; text: string; timestamp: string }>
  >([]);
  const [vivaSubmissions, setVivaSubmissions] = useState<
    Record<
      number,
      {
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
    >
  >({});

  const syncClassroomMutation = async (action: string, payload: Record<string, unknown>) => {
    try {
      await fetch('/api/classroom/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
      });
    } catch {
      // Offline resilient: local state & localStorage remain intact
    }
  };

  // Cross-device server polling every 4 seconds (Phone <-> Laptop live sync)
  useEffect(() => {
    let active = true;
    const pullState = async () => {
      try {
        const resp = await fetch('/api/classroom/state', { cache: 'no-store' });
        if (!resp.ok || !active) return;
        const remote = await resp.json();
        if (Array.isArray(remote.helpRequests)) {
          setTeacherHelpRequests(remote.helpRequests);
        }
        if (Array.isArray(remote.discussionPosts)) {
          setClassDiscussionPosts(remote.discussionPosts);
        }
        if (remote.pausedStudentIds) {
          setPausedStudentIds(remote.pausedStudentIds);
        }
        if (remote.studentSignals) {
          setStudentSignals((prev) => ({ ...prev, ...remote.studentSignals }));
        }
        if (remote.completedLevelsByStudent?.[activeStudentId]) {
          setCompletedLevels(remote.completedLevelsByStudent[activeStudentId]);
        }
        if (Array.isArray(remote.parentNotes)) {
          setParentNotes(remote.parentNotes);
        }
      } catch {
        // Ignore transient network errors
      }
    };
    pullState();
    const timer = setInterval(pullState, 4000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [activeStudentId]);

  // Subscribe to cross-tab / realtime classroom events
  useEffect(() => {
    const unsub = subscribeClassroomEvents((event) => {
      if (event.type === 'HELP_REQUEST') {
        const req: TeacherHelpRequest = {
          id: event.payload.id,
          studentId: event.payload.studentId,
          studentName: event.payload.studentName,
          studentRole: 'Student Pod Member',
          levelTitle: event.payload.levelTitle,
          message: event.payload.message,
          timestamp: event.payload.timestamp,
          status: 'pending',
        };
        setTeacherHelpRequests((prev) =>
          prev.some((p) => p.id === req.id) ? prev : [req, ...prev]
        );
        setActiveTeacherNotification(req);
      } else if (event.type === 'TEACHER_OVERRIDE_PAUSE') {
        setPausedStudentIds((prev) => ({
          ...prev,
          [event.payload.studentId]: event.payload.paused,
        }));
      } else if (event.type === 'TEACHER_DIRECT_MESSAGE') {
        setSocraticMessages((prev) => [
          ...prev,
          {
            id: `tdm-${Date.now()}`,
            sender: 'assistant',
            text: `[Teacher Direct Note]: ${event.payload.text}`,
            timestamp: event.payload.timestamp,
            isDispatchedHint: true,
          },
        ]);
      } else if (event.type === 'MISCONCEPTION_SIGNAL') {
        setStudentSignals((prev) => ({
          ...prev,
          [event.payload.studentId]: {
            misconceptionTag: event.payload.misconceptionTag,
            confidenceTag: event.payload.confidenceTag,
          },
        }));
      }
    });
    return unsub;
  }, []);

  const toggleAiPauseForStudent = (studentId: string) => {
    setPausedStudentIds((prev) => {
      const nextPaused = !prev[studentId];
      broadcastClassroomEvent({
        type: 'TEACHER_OVERRIDE_PAUSE',
        payload: { studentId, paused: nextPaused },
      });
      return { ...prev, [studentId]: nextPaused };
    });
  };

  const sendDirectTeacherMessage = (studentId: string, text: string) => {
    if (!text.trim()) return;
    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    broadcastClassroomEvent({
      type: 'TEACHER_DIRECT_MESSAGE',
      payload: { studentId, text: text.trim(), timestamp: ts },
    });
    if (studentId === activeStudentId) {
      setSocraticMessages((prev) => [
        ...prev,
        {
          id: `tdm-${Date.now()}`,
          sender: 'assistant',
          text: `[Teacher Direct Note]: ${text.trim()}`,
          timestamp: ts,
          isDispatchedHint: true,
        },
      ]);
    }
  };

  const joinClassWithCode = (code: string, studentName: string) => {
    if (code.trim().toUpperCase() !== classJoinCode) {
      return { ok: false, error: `Invalid class code. Try "${classJoinCode}".` };
    }
    if (!studentName.trim()) {
      return { ok: false, error: 'Please enter your name to join.' };
    }
    const match = students.find(
      (s) => s.name.toLowerCase() === studentName.trim().toLowerCase()
    );
    if (match) {
      setActiveStudentId(match.id);
    }
    setCurrentView('student');
    setIsJoinModalOpen(false);
    return { ok: true };
  };

  const saveVivaSubmission = (
    levelNumber: number,
    submission: {
      transcript: string;
      durationSeconds: number;
      evaluation: {
        overallReadiness: string;
        strengths: string[];
        followUpQuestion: string;
        criterionScores: Array<{ criterion: string; level: string; note: string }>;
      };
    }
  ) => {
    const fullSub = {
      ...submission,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setVivaSubmissions((prev) => ({
      ...prev,
      [levelNumber]: fullSub,
    }));
    syncClassroomMutation('SAVE_VIVA', {
      studentId: activeStudentId,
      levelNumber,
      submission: fullSub,
    });
  };

  // Local browser draft cache for intermittent school Wi-Fi resilience
  useEffect(() => {
    try {
      const cached = localStorage.getItem('daleel_draft_cache_v1');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.claimsByLevel) setClaimsByLevel(parsed.claimsByLevel);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('daleel_draft_cache_v1', JSON.stringify({ claimsByLevel }));
    } catch {
      // Ignore storage errors
    }
  }, [claimsByLevel]);

  const COLOR_STYLE_MAP: Record<string, { bgGradient: string; badgeBg: string; borderTone: string; shadowTone: string }> = {
    blue: { bgGradient: 'from-sky-400 to-blue-600', badgeBg: 'bg-sky-500', borderTone: 'border-sky-300', shadowTone: 'shadow-sky-500/30' },
    green: { bgGradient: 'from-emerald-400 to-green-600', badgeBg: 'bg-emerald-500', borderTone: 'border-emerald-300', shadowTone: 'shadow-emerald-500/30' },
    purple: { bgGradient: 'from-fuchsia-500 to-purple-600', badgeBg: 'bg-purple-500', borderTone: 'border-purple-300', shadowTone: 'shadow-purple-500/30' },
    amber: { bgGradient: 'from-orange-400 to-amber-600', badgeBg: 'bg-amber-500', borderTone: 'border-amber-300', shadowTone: 'shadow-amber-500/30' },
    gold: { bgGradient: 'from-yellow-400 to-amber-500', badgeBg: 'bg-yellow-500', borderTone: 'border-yellow-300', shadowTone: 'shadow-yellow-500/30' },
    teal: { bgGradient: 'from-teal-400 to-cyan-600', badgeBg: 'bg-teal-500', borderTone: 'border-teal-300', shadowTone: 'shadow-teal-500/30' },
    ruby: { bgGradient: 'from-rose-500 to-red-600', badgeBg: 'bg-rose-500', borderTone: 'border-rose-300', shadowTone: 'shadow-rose-500/30' },
  };

  const levels: CandyLevel[] = activeBlueprint.milestones
    .filter((m) => m.enabled)
    .map((m, idx) => {
      const styles = COLOR_STYLE_MAP[m.colorName] || COLOR_STYLE_MAP.blue;
      const baseRef = CANDY_LEVELS[idx];
      return {
        levelNumber: m.levelNumber,
        title: m.title,
        subtitle: m.subtitle,
        colorName: m.colorName,
        bgGradient: styles.bgGradient,
        badgeBg: styles.badgeBg,
        borderTone: styles.borderTone,
        shadowTone: styles.shadowTone,
        stars: baseRef ? baseRef.stars : completedLevels.includes(m.levelNumber) ? 3 : 0,
        status: completedLevels.includes(m.levelNumber) ? 'completed' : 'active',
        realWorldTask: m.realWorldTask,
        inAppTool: m.verificationGate,
        curriculumCode: m.curriculumCode,
        curriculumTopic: m.curriculumTopic,
        keyQuestion: m.keyQuestion,
      };
    });

  const activateBlueprint = (blueprint: VentureBlueprint) => {
    setActiveBlueprint(blueprint);
    setClaimsByLevel({});
    setStallCountByLevel({});
    setRecommendTeacherCallByLevel({});
    const firstLevel = blueprint.milestones.find((m) => m.enabled)?.levelNumber || 1;
    setSelectedLevelNumber(firstLevel);
    syncClassroomMutation('ACTIVATE_BLUEPRINT', { blueprint });
  };

  const addAndActivateBlueprint = (blueprint: VentureBlueprint) => {
    setAvailableBlueprints((prev) => [blueprint, ...prev.filter((b) => b.id !== blueprint.id)]);
    activateBlueprint(blueprint);
  };

  const submitInitialClaim = (levelNumber: number, claimText: string) => {
    if (!claimText.trim()) return;
    const claim = {
      levelNumber,
      blueprintId: activeBlueprint.id,
      claimText: claimText.trim(),
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setClaimsByLevel((prev) => ({
      ...prev,
      [levelNumber]: claim,
    }));
    syncClassroomMutation('SUBMIT_CLAIM', { studentId: activeStudentId, claim });
  };

  const completeLevel = (levelNumber: number) => {
    setCompletedLevels((prev) => (prev.includes(levelNumber) ? prev : [...prev, levelNumber]));
    syncClassroomMutation('COMPLETE_LEVEL', { studentId: activeStudentId, levelNumber });
  };

  const sendParentEncouragement = (text: string) => {
    if (!text.trim()) return;
    const note = {
      id: `pn-${Date.now()}`,
      studentId: activeStudentId,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setParentNotes((prev) => [note, ...prev]);
    syncClassroomMutation('SEND_PARENT_NOTE', { note });
  };

  const exportStudentDataJson = () => {
    if (typeof window === 'undefined') return;
    const payload = {
      exportedAt: new Date().toISOString(),
      student,
      activeBlueprint: activeBlueprint.title,
      completedLevels,
      claimsByLevel,
      vivaSubmissions,
      lastBatchLog,
      parentNotes: parentNotes.filter((n) => n.studentId === activeStudentId),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daleel-data-${student.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteStudentData = () => {
    setClaimsByLevel({});
    setCompletedLevels([]);
    setVivaSubmissions({});
    setStallCountByLevel({});
    setRecommendTeacherCallByLevel({});
    setParentNotes((prev) => prev.filter((n) => n.studentId !== activeStudentId));
    try {
      localStorage.removeItem('daleel_draft_cache_v1');
    } catch {
      // ignore
    }
    syncClassroomMutation('DELETE_STUDENT_DATA', { studentId: activeStudentId });
  };

  const [selectedLevelNumber, setSelectedLevelNumber] = useState<number>(3);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState<boolean>(false);

  const [sweetener, setSweetener] = useState<SweetenerType>('Date Paste');
  const [tempF, setTempF] = useState<number>(350);
  const [ruleChecked, setRuleChecked] = useState<boolean>(true);

  const [lastBatchLog, setLastBatchLog] = useState<BatchLogRecord | null>({
    batchId: 'batch-03',
    batchNumber: 3,
    sweetener: 'Date Paste',
    tempF: 350,
    ruleChecked: true,
    hasViolation: true,
    violationReason:
      'Multivariate Deviation: Changed both sweetener (Honey -> Date Paste) and oven temp (325°F -> 350°F) simultaneously.',
    timestamp: 'Today at 14:15',
    scienceObservation:
      'Date paste contains pectin and insoluble dietary fiber that bind water molecules, but the 350°F heat accelerated surface Maillard browning prematurely.',
    independentVariable: 'Sweetener + Temperature (Two variables changed)',
    controlledConstants: ['Rolled oats (180g)', 'Bake time (18 mins)'],
  });

  const [isSocraticDrawerOpen, setIsSocraticDrawerOpen] = useState<boolean>(false);
  const [hasUnreadSocraticHint, setHasUnreadSocraticHint] = useState<boolean>(true);
  const [isGeminiThinking, setIsGeminiThinking] = useState<boolean>(false);
  const [socraticMessages, setSocraticMessages] = useState<ChatMessage[]>([
    {
      id: 'soc-init',
      sender: 'assistant',
      text: 'Welcome to Level 3! Do you have any specific question before we start?',
      timestamp: 'Just now',
    },
  ]);

  const openLevelSocraticDesk = (levelNum: number) => {
    setSelectedLevelNumber(levelNum);
    setSocraticMessages([
      {
        id: `soc-init-${Date.now()}`,
        sender: 'assistant',
        text: `Welcome to Level ${levelNum}! Do you have any specific question before we start?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const [isTeamDispatchOpen, setIsTeamDispatchOpen] = useState<boolean>(false);
  const [teamMessages, setTeamMessages] = useState<TeamMessage[]>([
    {
      id: 'tm-1',
      sender: 'Samir Haddad (Lab Scientist)',
      recipient: 'Jad Mansour (Finance Lead)',
      message: 'Hey Jad, we are testing Date Paste in Batch 03. How does swapping 40g of date paste affect our linear cost function C(x)?',
      timestamp: '14:05',
      mathTopic: 'Linear Equations & Batch Scaling',
    },
    {
      id: 'tm-2',
      sender: 'Jad Mansour (Finance Lead)',
      recipient: 'Samir Haddad (Lab Scientist)',
      message: 'Date paste is $0.018/g vs raw honey at $0.022/g. Swapping 40g reduces raw ingredient cost by $0.16 per bar! That expands gross margin to 71.2%.',
      timestamp: '14:08',
      mathTopic: 'Algebra: Linear Cost Optimization',
    },
  ]);

  // Industry Mentorship Persona
  const [activeMentorPersona, setActiveMentorPersona] = useState<MentorPersona>('socratic');

  // Real-time Teacher Help Requests & Live Notifications
  const [teacherHelpRequests, setTeacherHelpRequests] = useState<TeacherHelpRequest[]>([
    {
      id: 'help-init-1',
      studentId: 'samir-haddad',
      studentName: 'Samir Haddad',
      studentRole: 'Kitchen Science & Formulation Lead',
      levelTitle: 'Level 3: Kitchen Lab (Fair Test)',
      message: 'Samir flagged a dual-variable trial in Batch 03 (Date Paste + 350°F) and requested teacher assistance with NGSS MS-PS1-2 variable isolation.',
      timestamp: '14:18',
      status: 'pending',
    },
  ]);
  const [activeTeacherNotification, setActiveTeacherNotification] = useState<TeacherHelpRequest | null>(null);

  const requestTeacherHelp = (customMessage?: string) => {
    const activeLevelObj = levels.find((l) => l.levelNumber === selectedLevelNumber) || levels[2];
    const isMultivariate = sweetener !== 'Honey' && tempF !== 325;
    const defaultMsg = isMultivariate
      ? `${student.name} changed both Sweetener (${sweetener}) & Temperature (${tempF}°F) in Batch 03 and needs teacher scaffolding on single-variable fair testing.`
      : `${student.name} requested faculty guidance on Level ${activeLevelObj.levelNumber}: ${activeLevelObj.title}.`;

    const newRequest: TeacherHelpRequest = {
      id: `help-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      studentRole: student.role,
      levelTitle: `Level ${activeLevelObj.levelNumber}: ${activeLevelObj.title}`,
      message: customMessage || defaultMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'pending',
    };

    setTeacherHelpRequests((prev) => [newRequest, ...prev]);
    setActiveTeacherNotification(newRequest);
    syncClassroomMutation('REQUEST_HELP', { request: newRequest });

    broadcastClassroomEvent({
      type: 'HELP_REQUEST',
      payload: {
        id: newRequest.id,
        studentId: newRequest.studentId,
        studentName: newRequest.studentName,
        levelNumber: activeLevelObj.levelNumber,
        levelTitle: newRequest.levelTitle,
        message: newRequest.message,
        timestamp: newRequest.timestamp,
        priority: customMessage?.includes('SAFEGUARDING')
          ? 'safeguarding'
          : customMessage?.includes('3-turn')
            ? 'stall_3x'
            : 'normal',
      },
    });

    // Provide immediate student feedback in chat
    setSocraticMessages((prev) => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        sender: 'assistant',
        text: `✋ Teacher Assistance Alert Dispatched! Dr. Wissam Sammouri has been notified of your request for guidance regarding "${newRequest.levelTitle}". A faculty popup notification has been triggered on the teacher dashboard.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDispatchedHint: true,
      },
    ]);
  };

  const dismissTeacherNotification = () => {
    setActiveTeacherNotification(null);
  };

  const resolveTeacherHelp = (id: string) => {
    setTeacherHelpRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'resolved' } : r))
    );
    if (activeTeacherNotification?.id === id) {
      setActiveTeacherNotification(null);
    }
  };

  // Class Discussion Forum
  const [isClassDiscussionOpen, setIsClassDiscussionOpen] = useState<boolean>(false);
  const [classDiscussionPosts, setClassDiscussionPosts] = useState<ClassDiscussionPost[]>(
    INITIAL_CLASS_DISCUSSION_POSTS
  );

  const addClassDiscussionPost = (topic: string, content: string) => {
    if (!content.trim()) return;
    const newPost: ClassDiscussionPost = {
      id: `post-${Date.now()}`,
      authorName: student.name,
      authorRole: student.role,
      grade: student.grade,
      avatarColor: student.avatarColor,
      topic: topic.trim() || 'Formulation & Lab Discussion',
      content: content.trim(),
      timestamp: 'Just now',
      likes: 1,
      repliesCount: 0,
      badge: 'Student Insight',
    };
    setClassDiscussionPosts((prev) => [newPost, ...prev]);
  };

  const likeDiscussionPost = (id: string) => {
    setClassDiscussionPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const [teacherViewMode, setTeacherViewMode] = useState<'overview' | 'deep_dive'>('overview');
  const [teacherDeepDiveStudent, setTeacherDeepDiveStudent] = useState<string>('samir-haddad');
  const [isHintDispatched, setIsHintDispatched] = useState<boolean>(false);

  const [isTeacherCopilotThinking, setIsTeacherCopilotThinking] = useState<boolean>(false);
  const [teacherCopilotMessages, setTeacherCopilotMessages] = useState<ChatMessage[]>([
    {
      id: 'tcp-1',
      sender: 'assistant',
      text: "Marhaba! Welcome to the Faculty Diagnostic Inquiry Desk. I synthesize cohort stamina correlations, peer pod velocities, and multi-variable trial metrics across Grade 9. How may I assist your diagnostic review today?",
      timestamp: 'Just now',
    },
  ]);

  // SEND MESSAGE (STUDENT SOCRATIC) - INTEGRATED WITH GEMINI 3.8 FLASH & FIELD PROFESSIONALS
  const sendSocraticMessageToGemini = async (userText: string) => {
    if (!userText.trim()) return;
    if (pausedStudentIds[student.id]) {
      setSocraticMessages((prev) => [
        ...prev,
        {
          id: `usr-${Date.now()}`,
          sender: 'user',
          text: userText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        {
          id: `pause-${Date.now()}`,
          sender: 'assistant',
          text: 'Your teacher has paused the AI mentor for your pod to speak with you directly.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isDispatchedHint: true,
        },
      ]);
      return;
    }

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setSocraticMessages((prev) => [...prev, userMsg]);
    setIsGeminiThinking(true);

    const isMultivariate = sweetener !== 'Honey' && tempF !== 325;
    const activeLevelObj = levels.find((l) => l.levelNumber === selectedLevelNumber) || levels[0];
    const initialClaim = claimsByLevel[selectedLevelNumber]?.claimText || '';
    const stallCount = stallCountByLevel[selectedLevelNumber] || 0;

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'student_socratic',
          message: userText,
          history: socraticMessages.slice(-6).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text,
          })),
          contextData: {
            persona: activeMentorPersona,
            studentName: student.name,
            grade: student.grade,
            role: student.role,
            levelNumber: activeLevelObj.levelNumber,
            levelTitle: activeLevelObj.title,
            sweetener,
            tempF,
            isMultivariate,
            initialClaim,
            stallCount,
            blueprint: activeBlueprint,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();
      const reply = data.text || "Let's explore that step by step!";

      if (data.classification) {
        setLastTurnClassification(data.classification);
        setStudentSignals((prev) => ({
          ...prev,
          [student.id]: {
            misconceptionTag: data.classification.misconceptionTag,
            confidenceTag: data.classification.confidenceTag,
          },
        }));
        broadcastClassroomEvent({
          type: 'MISCONCEPTION_SIGNAL',
          payload: {
            studentId: student.id,
            studentName: student.name,
            misconceptionTag: data.classification.misconceptionTag,
            confidenceTag: data.classification.confidenceTag,
          },
        });
      }
      if (typeof data.nextStallCount === 'number') {
        setStallCountByLevel((prev) => ({
          ...prev,
          [selectedLevelNumber]: data.nextStallCount,
        }));
      }
      if (data.recommendTeacherCall) {
        setRecommendTeacherCallByLevel((prev) => ({
          ...prev,
          [selectedLevelNumber]: true,
        }));
      }
      if (data.safeguardingAlert) {
        requestTeacherHelp(
          `[SAFEGUARDING ALERT] Immediate teacher check-in flagged in ${activeLevelObj.title}.`
        );
      }

      setSocraticMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.warn('Gemini 3.8 Flash API fallback invoked:', err);
      // Smart domain-tailored fallback
      const q = userText.toLowerCase();
      let reply = '';

      if (activeMentorPersona === 'biochemist') {
        if (q.includes('pectin') || q.includes('sugar') || q.includes('honey') || q.includes('date')) {
          reply = `[Dr. Wissam Sammouri - Biochemist]: Date paste contains branched pectin polysaccharide chains and soluble plant fibers that bind free water molecules into a stable hydrocolloid matrix. Wild honey, in contrast, consists of simple monosaccharides (glucose & fructose) which are hygroscopic but lack structural fiber.`;
        } else if (q.includes('water activity') || q.includes('aw') || q.includes('safe') || q.includes('spoil')) {
          reply = `[Dr. Wissam Sammouri - Biochemist]: Water activity (aw) represents unbound moisture that microorganisms require to proliferate. In our Lebanese Mediterranean climate, keeping aw < 0.60 guarantees microbiological shelf stability without artificial preservatives. Your trial batch targets aw = 0.58.`;
        } else {
          reply = isMultivariate
            ? `[Dr. Wissam Sammouri - Biochemist]: In biochemical research, you cannot change both the binder (${sweetener}) and thermal kinetic exposure (${tempF}°F) simultaneously! How will we isolate whether the chewiness stemmed from pectin hydration or heat browning? Return the oven to 325°F to maintain scientific control.`
            : `[Dr. Wissam Sammouri - Biochemist]: Excellent variable isolation! With your oven locked at 325°F, you can directly quantify how ${sweetener}'s fiber structure impacts moisture retention and sensory chewiness.`;
        }
      } else if (activeMentorPersona === 'economist') {
        if (q.includes('cost') || q.includes('price') || q.includes('margin') || q.includes('jad') || q.includes('break')) {
          reply = `[Rania Khoury - Venture Economics]: At wholesale bulk pricing, Lebanese date paste is $0.018/g vs wild mountain honey at $0.022/g. A 40g replacement cuts unit ingredient cost by $0.16/bar, widening gross margin to 71.2% at a $2.50 retail price. Check with Jad Mansour to verify your linear break-even model C(x)!`;
        } else {
          reply = `[Rania Khoury - Venture Economics]: Every formulation choice is an economic choice. If we scale production from a 20-bar classroom batch to a 500-bar commercial run, how do amortized equipment costs affect your target margin?`;
        }
      } else if (activeMentorPersona === 'food_safety') {
        if (q.includes('safety') || q.includes('shelf') || q.includes('mold') || q.includes('fda') || q.includes('libnor')) {
          reply = `[Karim Berbari - QA & Standards]: Under Lebanese Libnor and international FDA packaging standards, moisture content must be tightly governed. Keeping the bake temperature at 325°F avoids burnt exterior crusting while ensuring internal microbial inactivation.`;
        } else {
          reply = `[Karim Berbari - QA & Standards]: Quality assurance demands reproducibility. If you don't isolate one variable at a time in your fair tests, your batch fails quality certification. Make sure your oven stays at 325°F!`;
        }
      } else {
        // Socratic Coach default
        if (q.includes('fair test') || q.includes('variable') || q.includes('rule')) {
          if (isMultivariate) {
            reply = `Put on your lab goggles, ${student.name.split(' ')[0]}! Look closely at your trial: you altered both the Sweetener (${sweetener}) AND shifted the oven to ${tempF}°F simultaneously. In Grade 9 Physical Science (NGSS MS-PS1-2), how will you prove which one changed the chewy texture? Try returning the oven to 325°F to isolate the fruit paste!`;
          } else {
            reply = `In physical science, a fair test requires isolating exactly ONE independent variable while holding all other parameters constant. That way, any measured change in texture or water activity (aw) is scientifically attributable.`;
          }
        } else if (isMultivariate) {
          reply = `Look at your active bench parameters: You have two variables active (Sweetener + ${tempF}°F). What happens to your experimental certainty if you change two variables at once?`;
        } else {
          reply = `Great scientific inquiry! Notice how holding your oven constant at 325°F lets you observe the pure biochemical impact of ${sweetener}. What are your peer tasters predicting about chewiness?`;
        }
      }

      setSocraticMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsGeminiThinking(false);
    }
  };

  // SEND MESSAGE (TEACHER COPILOT) - WIRED TO REASONING ESCALATION TIER
  const sendTeacherCopilotMessageToGemini = async (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = {
      id: `t-usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setTeacherCopilotMessages((prev) => [...prev, userMsg]);
    setIsTeacherCopilotThinking(true);

    const targetStudentObj = students.find((s) => s.id === teacherDeepDiveStudent) || student;
    try {
      const resp = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'teacher_copilot',
          message: userText,
          contextData: {
            blueprintTitle: activeBlueprint.title,
            targetStudent: targetStudentObj.name,
            targetRole: targetStudentObj.role,
            lastBatchViolation: lastBatchLog?.hasViolation,
            openHelpRequests: teacherHelpRequests.filter((r) => r.status === 'pending').length,
            latestClassification: lastTurnClassification,
          },
        }),
      });
      const data = await resp.json();
      setTeacherCopilotMessages((prev) => [
        ...prev,
        {
          id: `t-ai-${Date.now()}`,
          sender: 'assistant',
          text:
            data.text ||
            `Classroom Synthesis for ${targetStudentObj.name}: Review Level 3 variable isolation and pair with Jad Mansour.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setTeacherCopilotMessages((prev) => [
        ...prev,
        {
          id: `t-ai-${Date.now()}`,
          sender: 'assistant',
          text: `Classroom Synthesis for ${targetStudentObj.name}: Focus on single-variable isolation in Level 3 before advancing to linear unit costing.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTeacherCopilotThinking(false);
    }
  };

  const logBatch = () => {
    const changedSweetener = sweetener !== 'Honey';
    const changedTemp = tempF !== 325;
    const isMultivariate = changedSweetener && changedTemp;

    const record: BatchLogRecord = {
      batchId: `batch-0${Date.now().toString().slice(-2)}`,
      batchNumber: 3,
      sweetener,
      tempF,
      ruleChecked,
      hasViolation: isMultivariate,
      violationReason: isMultivariate
        ? `Multivariate Deviation: Changed both sweetener (Honey -> ${sweetener}) and temperature (325°F -> ${tempF}°F) simultaneously.`
        : undefined,
      timestamp: 'Just now',
      scienceObservation: isMultivariate
        ? 'Inconclusive trial: Two variables active. Unable to isolate whether chewiness was influenced by pectin fiber matrix or thermal moisture evaporation rate.'
        : `Rigorous Single-Variable Trial: Temperature held constant at 325°F. Change in chewiness is 100% attributable to the polysaccharide fiber structure in ${sweetener}.`,
      independentVariable: isMultivariate ? `${sweetener} + ${tempF}°F (Invalid Dual Variable)` : sweetener,
      controlledConstants: isMultivariate
        ? ['Rolled oats (180g)', 'Bake time (18 mins)']
        : ['Oven temperature (325°F)', 'Rolled oats (180g)', 'Bake time (18 mins)'],
    };

    setLastBatchLog(record);

    if (isMultivariate) {
      setHasUnreadSocraticHint(true);
      setSocraticMessages((prev) => [
        ...prev,
        {
          id: `soc-${Date.now()}`,
          sender: 'assistant',
          text: `Scientific Method Check: You tested ${sweetener} at ${tempF}°F. In physical science, if you change two variables at once, you cannot isolate which caused the texture difference. Try locking the oven at 325°F!`,
          timestamp: 'Just now',
        },
      ]);
    }
  };

  const resetDemoToViolation = () => {
    setSweetener('Date Paste');
    setTempF(350);
    setRuleChecked(true);
    setLastBatchLog({
      batchId: 'batch-03',
      batchNumber: 3,
      sweetener: 'Date Paste',
      tempF: 350,
      ruleChecked: true,
      hasViolation: true,
      violationReason:
        'Multivariate Deviation: Changed both sweetener (Honey -> Date Paste) and oven temp (325°F -> 350°F) simultaneously.',
      timestamp: 'Today at 14:15',
      scienceObservation:
        'Date paste contains pectin and insoluble dietary fiber that bind water molecules, but the 350°F heat accelerated surface Maillard browning prematurely.',
      independentVariable: 'Sweetener + Temperature (Two variables changed)',
      controlledConstants: ['Rolled oats (180g)', 'Bake time (18 mins)'],
    });
    setHasUnreadSocraticHint(true);
  };

  const resetDemoToValid = () => {
    setSweetener('Date Paste');
    setTempF(325);
    setRuleChecked(true);
    setLastBatchLog({
      batchId: 'batch-04',
      batchNumber: 4,
      sweetener: 'Date Paste',
      tempF: 325,
      ruleChecked: true,
      hasViolation: false,
      timestamp: 'Today at 14:28',
      scienceObservation:
        'Controlled single variable verified. Date paste increases bar moisture retention via polysaccharide branching while maintaining water activity Aw < 0.60 for microbiological safety.',
      independentVariable: 'Sweetener (Honey -> Date Paste isolated)',
      controlledConstants: ['Oven temperature (325°F)', 'Rolled oats (180g)', 'Bake time (18 mins)'],
    });
    setHasUnreadSocraticHint(false);
  };

  const dispatchSocraticHint = () => {
    setIsHintDispatched(true);
    setHasUnreadSocraticHint(true);
    setSocraticMessages((prev) => [
      ...prev,
      {
        id: `soc-disp-${Date.now()}`,
        sender: 'assistant',
        text: "Teacher Socratic Intervention: Samir, isolate your sweetener by returning the oven to 325°F. Once your fair test is certified, share the formulation costs with Jad Mansour.",
        timestamp: 'Just now',
        isDispatchedHint: true,
      },
    ]);
  };

  const markSocraticAsRead = () => {
    setHasUnreadSocraticHint(false);
  };

  const sendTeamMessage = (msg: string) => {
    if (!msg.trim()) return;
    const newMsg: TeamMessage = {
      id: `tm-${Date.now()}`,
      sender: `${student.name} (${student.role})`,
      recipient: 'Jad Mansour (Finance Lead)',
      message: msg,
      timestamp: 'Just now',
      mathTopic: 'Linear Equations & Batch Scaling',
    };
    setTeamMessages((prev) => [...prev, newMsg]);
  };

  const curriculumStandards: CurriculumStandard[] = [
    {
      code: 'NGSS MS-PS1-2',
      subject: 'Physical Science',
      topic: 'Controlled Variable Investigation',
      competencyStatement:
        'Analyze and interpret data on the properties of substances before and after substances interact to determine if a chemical reaction has occurred.',
      masteryStatus: lastBatchLog?.hasViolation ? 'Needs Variable Scaffolding' : 'Mastered',
    },
    {
      code: 'CCSS.MATH.HSA.CED.A.2',
      subject: 'Algebra & Economics',
      topic: 'Linear Unit Cost Modeling',
      competencyStatement:
        'Create equations in two or more variables to represent relationships between quantities; graph equations on coordinate axes with labels and scales.',
      masteryStatus: 'Practicing',
    },
    {
      code: 'PE Standard 4',
      subject: 'Physiology & Health',
      topic: 'Cardiovascular Reserve & Cognitive Stamina',
      competencyStatement:
        'Demonstrate understanding of how sustained aerobic training enhances executive cognitive stamina during extended analytical lab problem solving.',
      masteryStatus: 'Mastered',
    },
  ];

  // Dynamic Scatter Points (28 Lebanese Students)
  const scatterPoints = LEBANESE_28_COHORT.map((entry) => {
    if (entry.id === 'target-student') {
      return {
        ...entry,
        studentName: student.name,
        peStaminaIndex: student.staminaScore,
        focusDurationMins: lastBatchLog?.hasViolation ? 20 : student.focusMinutes,
        notes: lastBatchLog?.hasViolation
          ? 'Analytical fatigue detected after 20 mins seated math; dual-variable violation occurred.'
          : 'High sustained focus (52 mins) with controlled scientific variable isolation.',
      };
    }
    return entry;
  });

  const targetDeepStudentObj = students.find((s) => s.id === teacherDeepDiveStudent) || student;
  const isViolationState = lastBatchLog?.hasViolation && targetDeepStudentObj.id === 'samir-haddad';

  const radarData: SkillRadarPoint[] = [
    {
      axis: 'Empirical Rigor',
      studentScore: isViolationState ? 58 : targetDeepStudentObj.standardsMastery['NGSS MS-PS1-2 (Variable Isolation)'] || 92,
      classAverage: 76,
    },
    {
      axis: 'Linear Modeling',
      studentScore: targetDeepStudentObj.standardsMastery['CCSS.MATH.HSA (Linear Modeling)'] || 82,
      classAverage: 71,
    },
    {
      axis: 'Cognitive Stamina',
      studentScore: targetDeepStudentObj.standardsMastery['PE Standard 4 (Aerobic Focus)'] || 85,
      classAverage: 69,
    },
    {
      axis: 'Food Safety & Aw',
      studentScore: isViolationState ? 64 : 91,
      classAverage: 74,
    },
    {
      axis: '42 Peer Reciprocity',
      studentScore: targetDeepStudentObj.collaborativeVelocity || 89,
      classAverage: 78,
    },
  ];

  return (
    <OmniMeshContext.Provider
      value={{
        currentView,
        setCurrentView,
        authenticatedParentStudent,
        setAuthenticatedParentStudent,
        isParentPinModalOpen,
        setIsParentPinModalOpen,
        isArchitectureModalOpen,
        setIsArchitectureModalOpen,

        students,
        activeStudentId,
        setActiveStudentId,
        student,

        levels,
        selectedLevelNumber,
        setSelectedLevelNumber,
        isLevelModalOpen,
        setIsLevelModalOpen,

        sweetener,
        setSweetener,
        tempF,
        setTempF,
        ruleChecked,
        setRuleChecked,

        lastBatchLog,
        logBatch,
        resetDemoToViolation,
        resetDemoToValid,

        isSocraticDrawerOpen,
        setIsSocraticDrawerOpen,
        socraticMessages,
        sendSocraticMessageToGemini,
        isGeminiThinking,
        hasUnreadSocraticHint,
        markSocraticAsRead,
        openLevelSocraticDesk,

        activeMentorPersona,
        setActiveMentorPersona,

        teacherHelpRequests,
        activeTeacherNotification,
        requestTeacherHelp,
        dismissTeacherNotification,
        resolveTeacherHelp,

        isClassDiscussionOpen,
        setIsClassDiscussionOpen,
        classDiscussionPosts,
        addClassDiscussionPost,
        likeDiscussionPost,

        isTeamDispatchOpen,
        setIsTeamDispatchOpen,
        teamMessages,
        sendTeamMessage,

        teacherViewMode,
        setTeacherViewMode,
        teacherDeepDiveStudent,
        setTeacherDeepDiveStudent,
        dispatchSocraticHint,
        isHintDispatched,

        teacherCopilotMessages,
        sendTeacherCopilotMessageToGemini,
        isTeacherCopilotThinking,

        curriculumStandards,
        scatterPoints,
        radarData,
        podNodes: POD_MESH_NODES,

        activeBlueprint,
        availableBlueprints,
        activateBlueprint,
        addAndActivateBlueprint,
        isCoDesignerOpen,
        setIsCoDesignerOpen,
        claimsByLevel,
        submitInitialClaim,
        stallCountByLevel,
        recommendTeacherCallByLevel,
        lastTurnClassification,

        pausedStudentIds,
        toggleAiPauseForStudent,
        sendDirectTeacherMessage,
        studentSignals,
        classJoinCode,
        isJoinModalOpen,
        setIsJoinModalOpen,
        joinClassWithCode,
        isPortfolioModalOpen,
        setIsPortfolioModalOpen,
        vivaSubmissions,
        saveVivaSubmission,
        completedLevels,
        completeLevel,
        parentNotes,
        sendParentEncouragement,
        exportStudentDataJson,
        deleteStudentData,
      }}
    >
      {children}
    </OmniMeshContext.Provider>
  );
};

export const useSnackLab = () => {
  const context = useContext(OmniMeshContext);
  if (!context) {
    throw new Error('useSnackLab must be used within an OmniMeshProvider');
  }
  return context;
};

export const useOmniMesh = useSnackLab;
export const OmniMeshProvider = SnackLabProvider;
