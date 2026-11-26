import fs from 'fs';
import path from 'path';
import os from 'os';
import { VentureBlueprint, ClaimArtifact } from '../types/venture';
import {
  WATERSHED_ENGINEERING_BLUEPRINT,
  COMMUNITY_ECONOMICS_BLUEPRINT,
  TRAILSPARK_REFERENCE_BLUEPRINT,
} from '../data/referenceBlueprints';

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

export interface ClassroomStateSnapshot {
  version: number;
  joinCode: string;
  activeBlueprint: VentureBlueprint;
  students: StudentRecord[];
  helpRequests: HelpRequestItem[];
  discussionPosts: DiscussionPostItem[];
  claimsByStudent: Record<string, Record<number, ClaimArtifact>>;
  completedLevelsByStudent: Record<string, number[]>;
  vivaByStudent: Record<string, Record<number, VivaSubmissionItem>>;
  pausedStudentIds: Record<string, boolean>;
  directMessagesByStudent: Record<string, Array<{ id: string; text: string; timestamp: string }>>;
  studentSignals: Record<string, { misconceptionTag: string | null; confidenceTag: string }>;
  parentNotes: ParentNoteItem[];
}

export const STARTER_BLUEPRINTS: VentureBlueprint[] = [
  WATERSHED_ENGINEERING_BLUEPRINT,
  COMMUNITY_ECONOMICS_BLUEPRINT,
  {
    ...TRAILSPARK_REFERENCE_BLUEPRINT,
    title: 'Sustainable Food Formulation Lab',
  },
];

function getStorePath(): string {
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  if (isServerless) {
    return path.join(os.tmpdir(), 'daleel-clean-store.json');
  }
  return path.join(process.cwd(), '.daleel-clean-store.json');
}

function createInitialState(): ClassroomStateSnapshot {
  return {
    version: 1,
    joinCode: 'DALEEL9',
    activeBlueprint: WATERSHED_ENGINEERING_BLUEPRINT,
    students: [
      {
        id: 'student-1',
        name: 'Lina Mansour',
        grade: 'Grade 8',
        podName: 'Pod A',
        joinedAt: 'Today',
      },
      {
        id: 'student-2',
        name: 'Omar Khoury',
        grade: 'Grade 8',
        podName: 'Pod B',
        joinedAt: 'Today',
      },
    ],
    helpRequests: [],
    discussionPosts: [
      {
        id: 'disc-1',
        authorName: 'Lina Mansour',
        authorRole: 'Student • Pod A',
        topic: 'Testing one filter layer at a time',
        badge: 'Variable Control',
        content:
          'When we kept water volume and slope constant and only changed biochar depth, our turbidity drop became much easier to measure.',
        timestamp: 'Just now',
        likes: 3,
      },
    ],
    claimsByStudent: {},
    completedLevelsByStudent: {},
    vivaByStudent: {},
    pausedStudentIds: {},
    directMessagesByStudent: {},
    studentSignals: {},
    parentNotes: [],
  };
}

let memoryStore: ClassroomStateSnapshot | null = null;

export function readClassroomStore(): ClassroomStateSnapshot {
  if (memoryStore) return memoryStore;
  try {
    const p = getStorePath();
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, 'utf8');
      memoryStore = JSON.parse(raw) as ClassroomStateSnapshot;
      return memoryStore;
    }
  } catch {
    // Fallback
  }
  memoryStore = createInitialState();
  writeClassroomStore(memoryStore);
  return memoryStore;
}

export function writeClassroomStore(next: ClassroomStateSnapshot): ClassroomStateSnapshot {
  next.version = (next.version || 0) + 1;
  memoryStore = next;
  try {
    fs.writeFileSync(getStorePath(), JSON.stringify(next, null, 2), 'utf8');
  } catch {
    // Serverless memory cache remains valid
  }
  return memoryStore;
}
