import fs from 'fs';
import path from 'path';
import os from 'os';
import { VentureBlueprint, ClaimArtifact } from '../types/venture';
import { TRAILSPARK_REFERENCE_BLUEPRINT } from '../data/referenceBlueprints';
import { BatchLogRecord } from '../types';

export interface PersistedHelpRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentRole: string;
  levelTitle: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'resolved';
  priority?: 'normal' | 'stall_3x' | 'safeguarding';
}

export interface PersistedDiscussionPost {
  id: string;
  authorName: string;
  authorRole: string;
  avatarColor: string;
  topic: string;
  badge: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
}

export interface PersistedVivaSubmission {
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

export interface PersistedParentNote {
  id: string;
  studentId: string;
  text: string;
  timestamp: string;
}

export interface ClassroomStateSnapshot {
  version: number;
  activeBlueprint: VentureBlueprint;
  helpRequests: PersistedHelpRequest[];
  discussionPosts: PersistedDiscussionPost[];
  claimsByStudent: Record<string, Record<number, ClaimArtifact>>;
  completedLevelsByStudent: Record<string, number[]>;
  vivaByStudent: Record<string, Record<number, PersistedVivaSubmission>>;
  pausedStudentIds: Record<string, boolean>;
  directMessagesByStudent: Record<string, Array<{ id: string; text: string; timestamp: string }>>;
  studentSignals: Record<string, { misconceptionTag: string | null; confidenceTag: string }>;
  batchLogsByStudent: Record<string, BatchLogRecord>;
  parentNotes: PersistedParentNote[];
}

function getStorePath(): string {
  // Use /tmp on serverless platforms (like Vercel) where project root is read-only
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  if (isServerless) {
    return path.join(os.tmpdir(), 'daleel-classroom-store.json');
  }
  return path.join(process.cwd(), '.daleel-classroom-store.json');
}

function createInitialState(): ClassroomStateSnapshot {
  return {
    version: 1,
    activeBlueprint: TRAILSPARK_REFERENCE_BLUEPRINT,
    helpRequests: [
      {
        id: 'help-init-1',
        studentId: 'samir-haddad',
        studentName: 'Samir Haddad',
        studentRole: 'Kitchen Science & Formulation Lead',
        levelTitle: 'Level 3: Kitchen Fair Test',
        message:
          'Samir flagged a dual-variable trial in Batch 03 (Date Paste + 350°F) and requested teacher assistance with variable isolation.',
        timestamp: '14:18',
        status: 'pending',
        priority: 'normal',
      },
    ],
    discussionPosts: [
      {
        id: 'disc-1',
        authorName: 'Samir Haddad',
        authorRole: 'Lab Scientist & Biothermal Lead',
        avatarColor: 'bg-emerald-600',
        topic: 'Single-Variable Control (325°F vs 350°F)',
        badge: 'Physical Science',
        content:
          'Quick heads-up to all kitchen pods: when I switched from honey to date paste AND raised the oven to 350°F, my bar browned too quickly and I could not prove which variable caused the chewiness!',
        timestamp: '14 mins ago',
        likes: 12,
        replies: 4,
      },
      {
        id: 'disc-2',
        authorName: 'Jad Mansour',
        authorRole: 'Unit Economics & Algebra Lead',
        avatarColor: 'bg-blue-600',
        topic: 'Date Paste Unit Cost Breakthrough',
        badge: 'Economics',
        content:
          'Checked our linear cost model C(x) = Fixed + Variable(x). Switching 40g of honey ($0.022/g) to local date paste ($0.018/g) saves $0.16 per bar and lifts our gross margin to 71.2%.',
        timestamp: '9 mins ago',
        likes: 15,
        replies: 6,
      },
    ],
    claimsByStudent: {},
    completedLevelsByStudent: {
      'samir-haddad': [1, 2],
    },
    vivaByStudent: {},
    pausedStudentIds: {},
    directMessagesByStudent: {},
    studentSignals: {
      'samir-haddad': {
        misconceptionTag: 'multivariate_variable_confusion',
        confidenceTag: 'confident_misconception',
      },
      'jad-mansour': {
        misconceptionTag: null,
        confidenceTag: 'hesitant_accurate',
      },
    },
    batchLogsByStudent: {},
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
    // Fallback to initial state
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
    // Serverless memory cache remains valid for warm instances
  }
  return memoryStore;
}
