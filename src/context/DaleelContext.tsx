'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ClaimArtifact,
  TurnClassifierResult,
  VentureBlueprint,
  HelpRequestItem,
  DiscussionPostItem,
  VivaSubmissionItem,
  StudentRecord,
  ParentNoteItem,
} from '../types/venture';
import {
  WATERSHED_ENGINEERING_BLUEPRINT,
  COMMUNITY_ECONOMICS_BLUEPRINT,
  TRAILSPARK_REFERENCE_BLUEPRINT,
} from '../data/referenceBlueprints';
import { broadcastClassroomEvent, subscribeClassroomEvents } from '../lib/realtimeBus';

const STARTER_BLUEPRINTS: VentureBlueprint[] = [
  WATERSHED_ENGINEERING_BLUEPRINT,
  COMMUNITY_ECONOMICS_BLUEPRINT,
  {
    ...TRAILSPARK_REFERENCE_BLUEPRINT,
    title: 'Sustainable Food Formulation Lab',
  },
];

export type WorkspaceRole = 'student' | 'teacher' | 'parent';

export interface ChatTurn {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isTeacherNote?: boolean;
}

interface DaleelContextType {
  role: WorkspaceRole;
  setRole: (role: WorkspaceRole) => void;

  joinCode: string;
  isJoinModalOpen: boolean;
  setIsJoinModalOpen: (open: boolean) => void;
  isDiscussionOpen: boolean;
  setIsDiscussionOpen: (open: boolean) => void;
  isCoDesignerOpen: boolean;
  setIsCoDesignerOpen: (open: boolean) => void;
  isPortfolioOpen: boolean;
  setIsPortfolioOpen: (open: boolean) => void;

  activeBlueprint: VentureBlueprint;
  availableBlueprints: VentureBlueprint[];
  activateBlueprint: (bp: VentureBlueprint) => void;
  addAndActivateBlueprint: (bp: VentureBlueprint) => void;

  students: StudentRecord[];
  activeStudentId: string;
  setActiveStudentId: (id: string) => void;
  activeStudent: StudentRecord;
  joinClassWithCode: (code: string, name: string) => { ok: boolean; error?: string };

  selectedLevelNumber: number;
  setSelectedLevelNumber: (lvl: number) => void;

  claimsByStudent: Record<string, Record<number, ClaimArtifact>>;
  submitInitialClaim: (levelNumber: number, claimText: string) => void;
  completedLevelsByStudent: Record<string, number[]>;
  completeLevel: (levelNumber: number) => void;

  mentorMode: 'socratic' | 'specialist';
  setMentorMode: () => void;
  setMentorRoleMode: (mode: 'socratic' | 'specialist') => void;
  chatByLevel: Record<number, ChatTurn[]>;
  isMentorThinking: boolean;
  sendMentorMessage: (text: string) => Promise<void>;
  stallCountByLevel: Record<number, number>;
  recommendTeacherCallByLevel: Record<number, boolean>;
  lastClassification: TurnClassifierResult | null;

  helpRequests: HelpRequestItem[];
  activePopupAlert: HelpRequestItem | null;
  dismissPopupAlert: () => void;
  requestTeacherHelp: (customMessage?: string) => void;
  resolveTeacherHelp: (id: string) => void;

  pausedStudentIds: Record<string, boolean>;
  toggleAiPause: (studentId: string) => void;
  sendDirectTeacherMessage: (studentId: string, text: string) => void;
  studentSignals: Record<string, { misconceptionTag: string | null; confidenceTag: string }>;

  vivaByStudent: Record<string, Record<number, VivaSubmissionItem>>;
  saveVivaSubmission: (levelNumber: number, sub: Omit<VivaSubmissionItem, 'submittedAt'>) => void;

  discussionPosts: DiscussionPostItem[];
  addDiscussionPost: (topic: string, badge: string, content: string) => void;
  likeDiscussionPost: (id: string) => void;

  teacherCopilotMessages: ChatTurn[];
  isCopilotThinking: boolean;
  sendTeacherCopilotMessage: (text: string) => Promise<void>;

  parentNotes: ParentNoteItem[];
  sendParentNote: (text: string) => void;
  exportStudentDataJson: () => void;
  deleteStudentData: () => void;
}

const DaleelContext = createContext<DaleelContextType | undefined>(undefined);

export const DaleelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<WorkspaceRole>('student');
  const [joinCode] = useState<string>('DALEEL9');

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isDiscussionOpen, setIsDiscussionOpen] = useState(false);
  const [isCoDesignerOpen, setIsCoDesignerOpen] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);

  const [availableBlueprints, setAvailableBlueprints] = useState<VentureBlueprint[]>(STARTER_BLUEPRINTS);
  const [activeBlueprint, setActiveBlueprint] = useState<VentureBlueprint>(STARTER_BLUEPRINTS[0]);

  const [students, setStudents] = useState<StudentRecord[]>([
    { id: 'student-1', name: 'Lina Mansour', grade: 'Grade 8', podName: 'Pod A', joinedAt: 'Today' },
    { id: 'student-2', name: 'Omar Khoury', grade: 'Grade 8', podName: 'Pod B', joinedAt: 'Today' },
  ]);
  const [activeStudentId, setActiveStudentId] = useState<string>('student-1');
  const activeStudent = students.find((s) => s.id === activeStudentId) || students[0];

  const [selectedLevelNumber, setSelectedLevelNumber] = useState<number>(1);
  const [claimsByStudent, setClaimsByStudent] = useState<Record<string, Record<number, ClaimArtifact>>>({});
  const [completedLevelsByStudent, setCompletedLevelsByStudent] = useState<Record<string, number[]>>({});
  const [vivaByStudent, setVivaByStudent] = useState<Record<string, Record<number, VivaSubmissionItem>>>({});

  const [mentorMode, setMentorRoleMode] = useState<'socratic' | 'specialist'>('socratic');
  const [chatByLevel, setChatByLevel] = useState<Record<number, ChatTurn[]>>({});
  const [isMentorThinking, setIsMentorThinking] = useState(false);
  const [stallCountByLevel, setStallCountByLevel] = useState<Record<number, number>>({});
  const [recommendTeacherCallByLevel, setRecommendTeacherCallByLevel] = useState<Record<number, boolean>>({});
  const [lastClassification, setLastClassification] = useState<TurnClassifierResult | null>(null);

  const [helpRequests, setHelpRequests] = useState<HelpRequestItem[]>([]);
  const [activePopupAlert, setActivePopupAlert] = useState<HelpRequestItem | null>(null);
  const [pausedStudentIds, setPausedStudentIds] = useState<Record<string, boolean>>({});
  const [studentSignals, setStudentSignals] = useState<
    Record<string, { misconceptionTag: string | null; confidenceTag: string }>
  >({});

  const [discussionPosts, setDiscussionPosts] = useState<DiscussionPostItem[]>([]);
  const [parentNotes, setParentNotes] = useState<ParentNoteItem[]>([]);

  const [teacherCopilotMessages, setTeacherCopilotMessages] = useState<ChatTurn[]>([
    {
      id: 'cop-init',
      sender: 'assistant',
      text: 'Welcome to Daleel Classroom Studio. Ask for a 5-minute mini-lesson or misconception summary based on live student work.',
      timestamp: 'Now',
    },
  ]);
  const [isCopilotThinking, setIsCopilotThinking] = useState(false);

  const syncMutation = async (action: string, payload: Record<string, unknown>) => {
    try {
      await fetch('/api/classroom/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
      });
    } catch {
      // Offline resilient
    }
  };

  // Local Wi-Fi resilience draft cache
  useEffect(() => {
    try {
      const cached = localStorage.getItem('daleel_clean_cache_v1');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.claimsByStudent) setClaimsByStudent(parsed.claimsByStudent);
        if (parsed.chatByLevel) setChatByLevel(parsed.chatByLevel);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        'daleel_clean_cache_v1',
        JSON.stringify({ claimsByStudent, chatByLevel })
      );
    } catch {
      // ignore
    }
  }, [claimsByStudent, chatByLevel]);

  // Cross-device server polling every 4s
  useEffect(() => {
    let mounted = true;
    const pull = async () => {
      try {
        const resp = await fetch('/api/classroom/state', { cache: 'no-store' });
        if (!resp.ok || !mounted) return;
        const remote = await resp.json();
        if (remote.activeBlueprint) setActiveBlueprint(remote.activeBlueprint);
        if (Array.isArray(remote.students)) setStudents(remote.students);
        if (Array.isArray(remote.helpRequests)) setHelpRequests(remote.helpRequests);
        if (Array.isArray(remote.discussionPosts)) setDiscussionPosts(remote.discussionPosts);
        if (remote.claimsByStudent) setClaimsByStudent((prev) => ({ ...remote.claimsByStudent, ...prev }));
        if (remote.completedLevelsByStudent) setCompletedLevelsByStudent(remote.completedLevelsByStudent);
        if (remote.vivaByStudent) setVivaByStudent(remote.vivaByStudent);
        if (remote.pausedStudentIds) setPausedStudentIds(remote.pausedStudentIds);
        if (remote.studentSignals) setStudentSignals(remote.studentSignals);
        if (Array.isArray(remote.parentNotes)) setParentNotes(remote.parentNotes);
      } catch {
        // ignore
      }
    };
    pull();
    const timer = setInterval(pull, 4000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  // Same-browser instant BroadcastChannel sync
  useEffect(() => {
    return subscribeClassroomEvents((event) => {
      if (event.type === 'HELP_REQUEST') {
        const item: HelpRequestItem = {
          ...event.payload,
          status: 'pending',
        };
        setHelpRequests((prev) => (prev.some((r) => r.id === item.id) ? prev : [item, ...prev]));
        setActivePopupAlert(item);
      } else if (event.type === 'TEACHER_OVERRIDE_PAUSE') {
        setPausedStudentIds((prev) => ({ ...prev, [event.payload.studentId]: event.payload.paused }));
      } else if (event.type === 'TEACHER_DIRECT_MESSAGE') {
        setChatByLevel((prev) => {
          const turns = prev[selectedLevelNumber] || [];
          return {
            ...prev,
            [selectedLevelNumber]: [
              ...turns,
              {
                id: `tdm-${Date.now()}`,
                sender: 'assistant',
                text: `[Teacher]: ${event.payload.text}`,
                timestamp: event.payload.timestamp,
                isTeacherNote: true,
              },
            ],
          };
        });
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
  }, [selectedLevelNumber]);

  const activateBlueprint = (bp: VentureBlueprint) => {
    setActiveBlueprint(bp);
    setChatByLevel({});
    setStallCountByLevel({});
    setRecommendTeacherCallByLevel({});
    const first = bp.milestones.find((m) => m.enabled)?.levelNumber || 1;
    setSelectedLevelNumber(first);
    syncMutation('ACTIVATE_BLUEPRINT', { blueprint: bp });
  };

  const addAndActivateBlueprint = (bp: VentureBlueprint) => {
    setAvailableBlueprints((prev) => [bp, ...prev.filter((b) => b.id !== bp.id)]);
    activateBlueprint(bp);
  };

  const joinClassWithCode = (code: string, name: string) => {
    if (code.trim().toUpperCase() !== joinCode) {
      return { ok: false, error: `Invalid class code. Try "${joinCode}".` };
    }
    const clean = name.trim();
    if (!clean) return { ok: false, error: 'Please enter your name.' };

    const existing = students.find((s) => s.name.toLowerCase() === clean.toLowerCase());
    if (existing) {
      setActiveStudentId(existing.id);
    } else {
      const created: StudentRecord = {
        id: `stu-${Date.now()}`,
        name: clean,
        grade: `Grades ${activeBlueprint.gradeBand}`,
        podName: 'Pod A',
        joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setStudents((prev) => [...prev, created]);
      setActiveStudentId(created.id);
      syncMutation('JOIN_CLASS', { name: clean, grade: created.grade, podName: created.podName });
    }
    setRole('student');
    setIsJoinModalOpen(false);
    return { ok: true };
  };

  const submitInitialClaim = (levelNumber: number, claimText: string) => {
    if (!claimText.trim()) return;
    const claim: ClaimArtifact = {
      levelNumber,
      blueprintId: activeBlueprint.id,
      claimText: claimText.trim(),
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setClaimsByStudent((prev) => ({
      ...prev,
      [activeStudentId]: {
        ...(prev[activeStudentId] || {}),
        [levelNumber]: claim,
      },
    }));
    setChatByLevel((prev) => ({
      ...prev,
      [levelNumber]: prev[levelNumber] || [
        {
          id: `init-${levelNumber}-${Date.now()}`,
          sender: 'assistant',
          text: `Welcome to Level ${levelNumber}! Do you have any specific question before we start?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    }));
    syncMutation('SUBMIT_CLAIM', { studentId: activeStudentId, claim });
  };

  const completeLevel = (levelNumber: number) => {
    setCompletedLevelsByStudent((prev) => {
      const existing = prev[activeStudentId] || [];
      if (existing.includes(levelNumber)) return prev;
      return { ...prev, [activeStudentId]: [...existing, levelNumber] };
    });
    syncMutation('COMPLETE_LEVEL', { studentId: activeStudentId, levelNumber });
  };

  const requestTeacherHelp = (customMessage?: string) => {
    const milestone =
      activeBlueprint.milestones.find((m) => m.levelNumber === selectedLevelNumber) ||
      activeBlueprint.milestones[0];
    const req: HelpRequestItem = {
      id: `help-${Date.now()}`,
      studentId: activeStudent.id,
      studentName: activeStudent.name,
      levelNumber: milestone.levelNumber,
      levelTitle: `Level ${milestone.levelNumber}: ${milestone.title}`,
      message: customMessage || `${activeStudent.name} requested teacher support on ${milestone.title}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'pending',
      priority: customMessage?.includes('SAFEGUARDING')
        ? 'safeguarding'
        : customMessage?.includes('3-turn')
          ? 'stall_3x'
          : 'normal',
    };
    setHelpRequests((prev) => [req, ...prev]);
    setActivePopupAlert(req);
    broadcastClassroomEvent({ type: 'HELP_REQUEST', payload: req });
    syncMutation('REQUEST_HELP', { request: req });
  };

  const resolveTeacherHelp = (id: string) => {
    setHelpRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'resolved' } : r)));
    syncMutation('RESOLVE_HELP', { id });
  };

  const sendMentorMessage = async (text: string) => {
    if (!text.trim()) return;
    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userTurn: ChatTurn = { id: `u-${Date.now()}`, sender: 'user', text: text.trim(), timestamp: ts };

    if (pausedStudentIds[activeStudent.id]) {
      setChatByLevel((prev) => ({
        ...prev,
        [selectedLevelNumber]: [
          ...(prev[selectedLevelNumber] || []),
          userTurn,
          {
            id: `p-${Date.now()}`,
            sender: 'assistant',
            text: 'Your teacher has paused the AI mentor for your pod to speak with you directly.',
            timestamp: ts,
            isTeacherNote: true,
          },
        ],
      }));
      return;
    }

    setChatByLevel((prev) => ({
      ...prev,
      [selectedLevelNumber]: [...(prev[selectedLevelNumber] || []), userTurn],
    }));
    setIsMentorThinking(true);

    const milestone =
      activeBlueprint.milestones.find((m) => m.levelNumber === selectedLevelNumber) ||
      activeBlueprint.milestones[0];
    const initialClaim = claimsByStudent[activeStudent.id]?.[selectedLevelNumber]?.claimText || '';
    const stallCount = stallCountByLevel[selectedLevelNumber] || 0;

    try {
      const resp = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'student_socratic',
          message: text.trim(),
          history: (chatByLevel[selectedLevelNumber] || []).slice(-6).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text,
          })),
          contextData: {
            persona: mentorMode,
            studentName: activeStudent.name,
            grade: activeStudent.grade,
            levelNumber: milestone.levelNumber,
            levelTitle: milestone.title,
            initialClaim,
            stallCount,
            blueprint: activeBlueprint,
          },
        }),
      });
      const data = await resp.json();

      if (data.classification) {
        setLastClassification(data.classification);
        const sig = {
          misconceptionTag: data.classification.misconceptionTag,
          confidenceTag: data.classification.confidenceTag,
        };
        setStudentSignals((prev) => ({ ...prev, [activeStudent.id]: sig }));
        broadcastClassroomEvent({
          type: 'MISCONCEPTION_SIGNAL',
          payload: { studentId: activeStudent.id, studentName: activeStudent.name, ...sig },
        });
        syncMutation('UPDATE_SIGNAL', { studentId: activeStudent.id, ...sig });
      }
      if (typeof data.nextStallCount === 'number') {
        setStallCountByLevel((prev) => ({ ...prev, [selectedLevelNumber]: data.nextStallCount }));
      }
      if (data.recommendTeacherCall) {
        setRecommendTeacherCallByLevel((prev) => ({ ...prev, [selectedLevelNumber]: true }));
      }
      if (data.safeguardingAlert) {
        requestTeacherHelp(`[SAFEGUARDING ALERT] Immediate teacher check-in needed in ${milestone.title}.`);
      }

      setChatByLevel((prev) => ({
        ...prev,
        [selectedLevelNumber]: [
          ...(prev[selectedLevelNumber] || []),
          {
            id: `a-${Date.now()}`,
            sender: 'assistant',
            text: data.text || 'What evidence from your work supports that idea?',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      }));
    } catch {
      setChatByLevel((prev) => ({
        ...prev,
        [selectedLevelNumber]: [
          ...(prev[selectedLevelNumber] || []),
          {
            id: `err-${Date.now()}`,
            sender: 'assistant',
            text: 'Look back at your initial claim—what is the one variable or assumption you want to test next?',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      }));
    } finally {
      setIsMentorThinking(false);
    }
  };

  const toggleAiPause = (studentId: string) => {
    setPausedStudentIds((prev) => {
      const paused = !prev[studentId];
      broadcastClassroomEvent({ type: 'TEACHER_OVERRIDE_PAUSE', payload: { studentId, paused } });
      return { ...prev, [studentId]: paused };
    });
    syncMutation('TOGGLE_AI_PAUSE', { studentId });
  };

  const sendDirectTeacherMessage = (studentId: string, text: string) => {
    if (!text.trim()) return;
    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    broadcastClassroomEvent({
      type: 'TEACHER_DIRECT_MESSAGE',
      payload: { studentId, text: text.trim(), timestamp: ts },
    });
    syncMutation('DIRECT_MESSAGE', {
      studentId,
      message: { id: `tdm-${Date.now()}`, text: text.trim(), timestamp: ts },
    });
    if (studentId === activeStudent.id) {
      setChatByLevel((prev) => ({
        ...prev,
        [selectedLevelNumber]: [
          ...(prev[selectedLevelNumber] || []),
          {
            id: `tdm-${Date.now()}`,
            sender: 'assistant',
            text: `[Teacher]: ${text.trim()}`,
            timestamp: ts,
            isTeacherNote: true,
          },
        ],
      }));
    }
  };

  const saveVivaSubmission = (
    levelNumber: number,
    sub: Omit<VivaSubmissionItem, 'submittedAt'>
  ) => {
    const full: VivaSubmissionItem = {
      ...sub,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setVivaByStudent((prev) => ({
      ...prev,
      [activeStudent.id]: {
        ...(prev[activeStudent.id] || {}),
        [levelNumber]: full,
      },
    }));
    syncMutation('SAVE_VIVA', { studentId: activeStudent.id, levelNumber, submission: full });
  };

  const addDiscussionPost = (topic: string, badge: string, content: string) => {
    if (!content.trim()) return;
    const post: DiscussionPostItem = {
      id: `disc-${Date.now()}`,
      authorName: activeStudent.name,
      authorRole: `Student • ${activeStudent.podName}`,
      topic: topic.trim() || activeBlueprint.title,
      badge: badge || 'Inquiry',
      content: content.trim(),
      timestamp: 'Just now',
      likes: 0,
    };
    setDiscussionPosts((prev) => [post, ...prev]);
    syncMutation('ADD_DISCUSSION_POST', { post });
  };

  const likeDiscussionPost = (id: string) => {
    setDiscussionPosts((prev) => prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)));
    syncMutation('LIKE_DISCUSSION_POST', { id });
  };

  const sendTeacherCopilotMessage = async (text: string) => {
    if (!text.trim()) return;
    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTeacherCopilotMessages((prev) => [
      ...prev,
      { id: `cu-${Date.now()}`, sender: 'user', text: text.trim(), timestamp: ts },
    ]);
    setIsCopilotThinking(true);
    try {
      const resp = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'teacher_copilot',
          message: text.trim(),
          contextData: {
            blueprintTitle: activeBlueprint.title,
            studentCount: students.length,
            openHelpRequests: helpRequests.filter((r) => r.status === 'pending').length,
            studentSignals,
          },
        }),
      });
      const data = await resp.json();
      setTeacherCopilotMessages((prev) => [
        ...prev,
        {
          id: `ca-${Date.now()}`,
          sender: 'assistant',
          text: data.text || 'Focus on pods with flagged misconceptions for a 5-minute check-in.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsCopilotThinking(false);
    }
  };

  const sendParentNote = (text: string) => {
    if (!text.trim()) return;
    const note: ParentNoteItem = {
      id: `pn-${Date.now()}`,
      studentId: activeStudent.id,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setParentNotes((prev) => [note, ...prev]);
    syncMutation('SEND_PARENT_NOTE', { note });
  };

  const exportStudentDataJson = () => {
    if (typeof window === 'undefined') return;
    const payload = {
      exportedAt: new Date().toISOString(),
      student: activeStudent,
      venture: activeBlueprint.title,
      completedLevels: completedLevelsByStudent[activeStudent.id] || [],
      claims: claimsByStudent[activeStudent.id] || {},
      vivaSubmissions: vivaByStudent[activeStudent.id] || {},
      parentNotes: parentNotes.filter((n) => n.studentId === activeStudent.id),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daleel-${activeStudent.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteStudentData = () => {
    setClaimsByStudent((prev) => {
      const next = { ...prev };
      delete next[activeStudent.id];
      return next;
    });
    setCompletedLevelsByStudent((prev) => {
      const next = { ...prev };
      delete next[activeStudent.id];
      return next;
    });
    setVivaByStudent((prev) => {
      const next = { ...prev };
      delete next[activeStudent.id];
      return next;
    });
    setChatByLevel({});
    try {
      localStorage.removeItem('daleel_clean_cache_v1');
    } catch {
      // ignore
    }
    syncMutation('DELETE_STUDENT_DATA', { studentId: activeStudent.id });
  };

  return (
    <DaleelContext.Provider
      value={{
        role,
        setRole,
        joinCode,
        isJoinModalOpen,
        setIsJoinModalOpen,
        isDiscussionOpen,
        setIsDiscussionOpen,
        isCoDesignerOpen,
        setIsCoDesignerOpen,
        isPortfolioOpen,
        setIsPortfolioOpen,
        activeBlueprint,
        availableBlueprints,
        activateBlueprint,
        addAndActivateBlueprint,
        students,
        activeStudentId,
        setActiveStudentId,
        activeStudent,
        joinClassWithCode,
        selectedLevelNumber,
        setSelectedLevelNumber,
        claimsByStudent,
        submitInitialClaim,
        completedLevelsByStudent,
        completeLevel,
        mentorMode,
        setMentorMode: () => setMentorRoleMode('socratic'),
        setMentorRoleMode,
        chatByLevel,
        isMentorThinking,
        sendMentorMessage,
        stallCountByLevel,
        recommendTeacherCallByLevel,
        lastClassification,
        helpRequests,
        activePopupAlert,
        dismissPopupAlert: () => setActivePopupAlert(null),
        requestTeacherHelp,
        resolveTeacherHelp,
        pausedStudentIds,
        toggleAiPause,
        sendDirectTeacherMessage,
        studentSignals,
        vivaByStudent,
        saveVivaSubmission,
        discussionPosts,
        addDiscussionPost,
        likeDiscussionPost,
        teacherCopilotMessages,
        isCopilotThinking,
        sendTeacherCopilotMessage,
        parentNotes,
        sendParentNote,
        exportStudentDataJson,
        deleteStudentData,
      }}
    >
      {children}
    </DaleelContext.Provider>
  );
};

export const useDaleel = () => {
  const ctx = useContext(DaleelContext);
  if (!ctx) throw new Error('useDaleel must be used within DaleelProvider');
  return ctx;
};
