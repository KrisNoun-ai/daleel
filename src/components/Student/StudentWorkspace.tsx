'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useDaleel } from '../../context/DaleelContext';
import { MilestoneStage } from '../../types/venture';
import { CandyCrushMap } from './CandyCrushMap';
import { VivaVoceModal } from './VivaVoceModal';
import { PortfolioExportModal } from './PortfolioExportModal';
import {
  Sparkles,
  Send,
  Hand,
  FlaskConical,
  Compass,
  ArrowLeft,
  Lock,
  AlertCircle,
  Mic,
  Award,
  CheckCircle2,
} from 'lucide-react';

export const StudentWorkspace: React.FC = () => {
  const {
    students,
    activeStudentId,
    setActiveStudentId,
    activeStudent,
    activeBlueprint,
    selectedLevelNumber,
    setSelectedLevelNumber,
    claimsByStudent,
    submitInitialClaim,
    completedLevelsByStudent,
    completeLevel,
    mentorMode,
    setMentorRoleMode,
    chatByLevel,
    isMentorThinking,
    sendMentorMessage,
    recommendTeacherCallByLevel,
    requestTeacherHelp,
    parentNotes,
    setIsPortfolioOpen,
  } = useDaleel();

  const [isDeskOpen, setIsDeskOpen] = useState(false);
  const [isVivaOpen, setIsVivaOpen] = useState(false);
  const [claimDraft, setClaimDraft] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [justRequestedHelp, setJustRequestedHelp] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const milestones = activeBlueprint.milestones.filter((m) => m.enabled);
  const activeMilestone =
    milestones.find((m) => m.levelNumber === selectedLevelNumber) || milestones[0];
  const submittedClaim = claimsByStudent[activeStudent.id]?.[activeMilestone.levelNumber];
  const completedLevels = completedLevelsByStudent[activeStudent.id] || [];
  const isCompleted = completedLevels.includes(activeMilestone.levelNumber);
  const messages = chatByLevel[activeMilestone.levelNumber] || [];
  const isStallEscalated = Boolean(recommendTeacherCallByLevel[activeMilestone.levelNumber]);
  const latestParentNote = parentNotes.find((n) => n.studentId === activeStudent.id);

  useEffect(() => {
    if (isDeskOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMentorThinking, isDeskOpen]);

  const handleSelectMilestone = (m: MilestoneStage) => {
    setSelectedLevelNumber(m.levelNumber);
    setIsDeskOpen(true);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isMentorThinking) return;
    const txt = chatInput;
    setChatInput('');
    await sendMentorMessage(txt);
  };

  const handleAskTeacher = () => {
    requestTeacherHelp();
    setJustRequestedHelp(true);
    setTimeout(() => setJustRequestedHelp(false), 4000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Clean Student Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E6DF] pb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-[#18221B]">
            Welcome,
          </h1>
          <select
            value={activeStudentId}
            onChange={(e) => setActiveStudentId(e.target.value)}
            className="font-serif text-xl sm:text-2xl font-extrabold text-[#223528] bg-white border border-stone-200 rounded-2xl px-3 py-1 cursor-pointer"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2.5 text-xs">
          <span className="font-mono text-stone-500">
            {activeStudent.grade} • {activeStudent.podName}
          </span>
          <button
            type="button"
            onClick={() => setIsPortfolioOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-stone-100 text-slate-800 font-bold border border-stone-200 cursor-pointer"
          >
            <Award className="h-3.5 w-3.5 text-emerald-700" />
            <span>Export Portfolio</span>
          </button>
        </div>
      </div>

      {latestParentNote && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs text-emerald-950 flex items-center justify-between gap-2">
          <span>
            <strong>Note from Home:</strong> &ldquo;{latestParentNote.text}&rdquo;
          </span>
          <span className="text-[10px] font-mono text-emerald-700 shrink-0">
            {latestParentNote.timestamp}
          </span>
        </div>
      )}

      {!isDeskOpen ? (
        <CandyCrushMap onSelectMilestone={handleSelectMilestone} />
      ) : (
        <div className="space-y-4">
          {/* Desk Header */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsDeskOpen(false)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Levels</span>
              </button>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-serif font-bold text-slate-900 text-base sm:text-lg">
                    Level {activeMilestone.levelNumber}: {activeMilestone.title}
                  </h2>
                  <span className="text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    {activeMilestone.curriculumCode}
                  </span>
                </div>
                <p className="text-xs text-stone-500">{activeMilestone.realWorldTask}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs">
              <button
                type="button"
                onClick={() => setMentorRoleMode('socratic')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold cursor-pointer ${
                  mentorMode === 'socratic'
                    ? 'bg-[#223528] text-white shadow-xs'
                    : 'text-stone-600'
                }`}
              >
                <Compass className="h-3.5 w-3.5" />
                <span>Socratic Mentor</span>
              </button>
              <button
                type="button"
                onClick={() => setMentorRoleMode('specialist')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold cursor-pointer ${
                  mentorMode === 'specialist'
                    ? 'bg-[#223528] text-white shadow-xs'
                    : 'text-stone-600'
                }`}
              >
                <FlaskConical className="h-3.5 w-3.5 text-emerald-400" />
                <span>{activeBlueprint.specialistPersona.name}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsVivaOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 cursor-pointer"
              >
                <Mic className="h-3.5 w-3.5 text-rose-600" />
                <span>Oral Defense</span>
              </button>
            </div>
          </div>

          {/* Claim-First Gate OR Unlocked Mentor Desk */}
          {!submittedClaim ? (
            <div className="bg-white rounded-3xl border-2 border-[#223528]/20 shadow-lg p-6 sm:p-8 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-2xl bg-[#223528] text-amber-300 flex items-center justify-center shrink-0">
                  <Lock className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                    AI-Free Claim First Gate
                  </span>
                  <h3 className="font-serif text-lg font-bold text-slate-900">
                    Commit Your Own Reasoning Before Unlocking the Mentor
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600">{activeMilestone.claimPrompt}</p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!claimDraft.trim()) return;
                  submitInitialClaim(activeMilestone.levelNumber, claimDraft);
                  setClaimDraft('');
                }}
                className="space-y-3"
              >
                <textarea
                  rows={3}
                  value={claimDraft}
                  onChange={(e) => setClaimDraft(e.target.value)}
                  placeholder={activeMilestone.claimPlaceholder}
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 p-4 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#223528]/20"
                />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-mono text-stone-400">
                    Gate: {activeMilestone.verificationGate}
                  </span>
                  <button
                    type="submit"
                    disabled={!claimDraft.trim()}
                    className="px-5 py-2.5 rounded-2xl bg-[#223528] text-white text-xs sm:text-sm font-bold disabled:opacity-40 cursor-pointer"
                  >
                    Lock Claim &amp; Unlock Mentor
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-stone-200 shadow-lg overflow-hidden flex flex-col min-h-[480px] max-h-[640px]">
              <div className="px-5 py-3 bg-[#FAF9F5] border-b border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-stone-600 truncate max-w-lg">
                  <strong>Your Claim:</strong> &ldquo;{submittedClaim.claimText}&rdquo;
                </span>
                <button
                  type="button"
                  onClick={() => completeLevel(activeMilestone.levelNumber)}
                  disabled={isCompleted}
                  className={`flex items-center gap-1 px-3 py-1 rounded-xl font-bold text-[11px] cursor-pointer ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-[#223528] text-white hover:bg-[#19271e]'
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{isCompleted ? 'Milestone Cleared' : 'Mark Milestone Complete'}</span>
                </button>
              </div>

              {isStallEscalated && (
                <div className="px-5 py-2.5 bg-amber-50 border-b border-amber-200 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-amber-950 font-medium">
                    <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Stuck after 3 turns? Bring your teacher directly to your pod.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      requestTeacherHelp(
                        `3-turn stall escalation in Level ${activeMilestone.levelNumber}: ${activeMilestone.title}`
                      )
                    }
                    className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] shrink-0 cursor-pointer"
                  >
                    Call Teacher to Pod
                  </button>
                </div>
              )}

              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-[#FBFBF9]/60">
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                      <span className="text-[10px] font-mono text-stone-400 mb-1">
                        {isUser
                          ? activeStudent.name.split(' ')[0]
                          : msg.isTeacherNote
                            ? 'Teacher'
                            : mentorMode === 'specialist'
                              ? activeBlueprint.specialistPersona.name
                              : 'Socratic Mentor'}{' '}
                        • {msg.timestamp}
                      </span>
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-xs sm:text-sm max-w-[85%] ${
                          isUser
                            ? 'bg-[#223528] text-white'
                            : msg.isTeacherNote
                              ? 'bg-amber-50 text-amber-950 border-2 border-amber-300 font-medium'
                              : 'bg-white text-slate-900 border border-stone-200'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}
                {isMentorThinking && (
                  <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-stone-200 text-xs text-stone-500 max-w-xs">
                    <Sparkles className="h-4 w-4 text-emerald-600 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="p-4 border-t border-stone-200 bg-white flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAskTeacher}
                  className={`flex items-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs font-bold shrink-0 cursor-pointer ${
                    justRequestedHelp
                      ? 'bg-amber-500 text-white'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300'
                  }`}
                >
                  <Hand className="h-4 w-4 text-amber-600" />
                  <span className="hidden sm:inline">
                    {justRequestedHelp ? 'Teacher Notified' : 'Ask Teacher'}
                  </span>
                </button>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Ask or test your reasoning for Level ${activeMilestone.levelNumber}...`}
                  disabled={isMentorThinking}
                  className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isMentorThinking}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#223528] text-white text-xs sm:text-sm font-semibold disabled:opacity-40 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      <VivaVoceModal
        isOpen={isVivaOpen}
        onClose={() => setIsVivaOpen(false)}
        levelNumber={activeMilestone.levelNumber}
      />
      <PortfolioExportModal />
    </div>
  );
};
