'use client';

import React, { useState } from 'react';
import { useDaleel } from '../../context/DaleelContext';
import { VentureCoDesignerModal } from './VentureCoDesignerModal';
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  Send,
  Sparkles,
  GraduationCap,
  Activity,
  User,
  PauseCircle,
  PlayCircle,
  BookOpen,
  Mic,
} from 'lucide-react';

export const TeacherStudio: React.FC = () => {
  const {
    students,
    activeBlueprint,
    setIsCoDesignerOpen,
    helpRequests,
    resolveTeacherHelp,
    pausedStudentIds,
    toggleAiPause,
    sendDirectTeacherMessage,
    studentSignals,
    claimsByStudent,
    completedLevelsByStudent,
    vivaByStudent,
    teacherCopilotMessages,
    isCopilotThinking,
    sendTeacherCopilotMessage,
  } = useDaleel();

  const [viewMode, setViewMode] = useState<'overview' | 'inspect'>('overview');
  const [inspectStudentId, setInspectStudentId] = useState<string>(students[0]?.id || 'student-1');
  const [search, setSearch] = useState('');
  const [directMsg, setDirectMsg] = useState('');
  const [copilotInput, setCopilotInput] = useState('');

  const targetStudent = students.find((s) => s.id === inspectStudentId) || students[0];
  const pendingHelp = helpRequests.filter((r) => r.status === 'pending');
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const misconceptionCount = Object.values(studentSignals).filter((s) => Boolean(s.misconceptionTag)).length;
  const confidentMisconceptions = Object.values(studentSignals).filter(
    (s) => s.confidenceTag === 'confident_misconception'
  ).length;
  const hesitantAccurate = Object.values(studentSignals).filter(
    (s) => s.confidenceTag === 'hesitant_accurate'
  ).length;

  const handleCopilotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotInput.trim() || isCopilotThinking) return;
    const txt = copilotInput;
    setCopilotInput('');
    await sendTeacherCopilotMessage(txt);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E6DF] pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 font-mono">
            Daleel Classroom Studio • Grades {activeBlueprint.gradeBand}
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-[#18221B] mt-0.5">
            {activeBlueprint.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCoDesignerOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs font-bold cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-700" />
            <span>Venture Co-Designer</span>
          </button>

          <div className="flex items-center gap-1 rounded-2xl border border-stone-200 bg-stone-100 p-1 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('overview')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-medium cursor-pointer ${
                viewMode === 'overview'
                  ? 'bg-[#223528] text-white font-bold'
                  : 'text-stone-600'
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Classroom</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('inspect')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-medium cursor-pointer ${
                viewMode === 'inspect'
                  ? 'bg-[#223528] text-white font-bold'
                  : 'text-stone-600'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>Student Inspect</span>
            </button>
          </div>
        </div>
      </div>

      <VentureCoDesignerModal />

      {pendingHelp.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-ping" />
              <h3 className="font-serif font-bold text-sm text-amber-950">
                Live Help Queue ({pendingHelp.length})
              </h3>
            </div>
            <span className="text-[10px] font-mono text-amber-800 uppercase font-semibold">
              Cross-Device Sync
            </span>
          </div>

          <div className="space-y-2">
            {pendingHelp.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl p-3.5 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-xs">{req.studentName}</span>
                    <span className="text-[10px] font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                      {req.levelTitle}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">{req.timestamp}</span>
                  </div>
                  <p className="text-xs text-stone-700">{req.message}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setInspectStudentId(req.studentId);
                      setViewMode('inspect');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#223528] text-white text-xs font-bold cursor-pointer"
                  >
                    Inspect
                  </button>
                  <button
                    type="button"
                    onClick={() => resolveTeacherHelp(req.id)}
                    className="px-2.5 py-1.5 rounded-xl text-stone-500 hover:bg-stone-100 text-xs font-medium cursor-pointer"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-stone-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">
                Active Milestones
              </span>
              <div className="text-2xl font-bold font-serif text-[#18221B] mt-1">
                {activeBlueprint.milestones.filter((m) => m.enabled).length} Stages
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Specialist: {activeBlueprint.specialistPersona.name}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">
                Misconception Clustering
              </span>
              <div className="text-2xl font-bold font-serif text-amber-700 mt-1">
                {misconceptionCount} Flagged Pod(s)
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Confident Misconception: {confidentMisconceptions} • Hesitant Accurate: {hesitantAccurate}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">
                CASE / Standards Alignment
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {activeBlueprint.competencies.map((c) => (
                  <span
                    key={c.code}
                    className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold"
                  >
                    {c.code}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-3 gap-3">
              <div>
                <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-800" />
                  <span>Class Roster ({students.length} Active Students)</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Inspect student claims, pause AI mentor, or send direct guidance
                </p>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student..."
                className="w-full sm:w-56 px-3 py-1.5 rounded-xl border border-stone-200 text-xs bg-stone-50"
              />
            </div>

            <div className="overflow-x-auto rounded-2xl border border-stone-100">
              <table className="w-full min-w-[540px] text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50/70 text-[10px] font-mono uppercase text-stone-500">
                    <th className="py-2.5 px-3 font-semibold">Student</th>
                    <th className="py-2.5 px-2 font-semibold">Pod</th>
                    <th className="py-2.5 px-2 font-semibold">Cleared</th>
                    <th className="py-2.5 px-2 font-semibold">AI Mentor</th>
                    <th className="py-2.5 px-2 font-semibold">Status</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredStudents.map((s) => {
                    const isPaused = Boolean(pausedStudentIds[s.id]);
                    const sig = studentSignals[s.id];
                    const hasIssue = Boolean(sig?.misconceptionTag);
                    const doneCount = (completedLevelsByStudent[s.id] || []).length;

                    return (
                      <tr key={s.id} className="hover:bg-stone-50/80">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{s.name}</td>
                        <td className="py-2.5 px-2 text-stone-600">{s.podName}</td>
                        <td className="py-2.5 px-2 font-mono text-slate-700">{doneCount} stages</td>
                        <td className="py-2.5 px-2">
                          <button
                            type="button"
                            onClick={() => toggleAiPause(s.id)}
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full cursor-pointer ${
                              isPaused
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {isPaused ? (
                              <>
                                <PlayCircle className="h-3 w-3" /> Paused
                              </>
                            ) : (
                              <>
                                <PauseCircle className="h-3 w-3" /> Active
                              </>
                            )}
                          </button>
                        </td>
                        <td className="py-2.5 px-2">
                          {hasIssue ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                              <AlertTriangle className="h-3 w-3" />
                              Needs Check-In
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="h-3 w-3" />
                              On Track
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setInspectStudentId(s.id);
                              setViewMode('inspect');
                            }}
                            className="text-[11px] text-emerald-800 font-bold hover:underline cursor-pointer"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'inspect' && targetStudent && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-slate-900">{targetStudent.name}</h2>
              <p className="text-xs text-stone-500">
                {targetStudent.grade} • {targetStudent.podName} • Cleared:{' '}
                {(completedLevelsByStudent[targetStudent.id] || []).join(', ') || 'None yet'}
              </p>
            </div>
            <select
              value={targetStudent.id}
              onChange={(e) => setInspectStudentId(e.target.value)}
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-semibold text-slate-900"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-3xl border border-stone-200 p-5 space-y-3 text-xs">
              <div className="flex items-center gap-2 font-serif font-bold text-sm text-slate-900">
                <BookOpen className="h-4 w-4 text-emerald-800" />
                <span>Unassisted Claim-First Artifacts</span>
              </div>
              {Object.values(claimsByStudent[targetStudent.id] || {}).length === 0 ? (
                <p className="text-stone-400 italic">No claims submitted yet.</p>
              ) : (
                Object.values(claimsByStudent[targetStudent.id] || {}).map((c) => (
                  <div key={c.levelNumber} className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <div className="font-bold text-slate-800">
                      Level {c.levelNumber} ({c.submittedAt})
                    </div>
                    <p className="text-stone-700 mt-1">{c.claimText}</p>
                  </div>
                ))
              )}
            </div>

            <div className="bg-white rounded-3xl border border-stone-200 p-5 space-y-3 text-xs">
              <div className="flex items-center gap-2 font-serif font-bold text-sm text-slate-900">
                <Mic className="h-4 w-4 text-rose-600" />
                <span>Oral Defense (Viva Voce)</span>
              </div>
              {Object.entries(vivaByStudent[targetStudent.id] || {}).length === 0 ? (
                <p className="text-stone-400 italic">No oral defenses submitted yet.</p>
              ) : (
                Object.entries(vivaByStudent[targetStudent.id] || {}).map(([lvl, sub]) => (
                  <div key={lvl} className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <strong>Level {lvl} ({sub.evaluation.overallReadiness}):</strong>
                    <p className="text-stone-700 italic mt-0.5">&ldquo;{sub.transcript}&rdquo;</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-800">Human Override Controls</span>
              <button
                type="button"
                onClick={() => toggleAiPause(targetStudent.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold cursor-pointer ${
                  pausedStudentIds[targetStudent.id]
                    ? 'bg-rose-600 text-white'
                    : 'bg-stone-100 text-slate-800 border border-stone-300'
                }`}
              >
                {pausedStudentIds[targetStudent.id] ? 'Resume AI Mentor' : 'Pause AI Mentor'}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={directMsg}
                onChange={(e) => setDirectMsg(e.target.value)}
                placeholder={`Send a direct message to ${targetStudent.name}...`}
                className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (!directMsg.trim()) return;
                  sendDirectTeacherMessage(targetStudent.id, directMsg);
                  setDirectMsg('');
                }}
                disabled={!directMsg.trim()}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                Send Direct
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="bg-white rounded-3xl border border-stone-200 p-5 space-y-3">
        <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
          <div className="h-8 w-8 rounded-xl bg-[#223528] text-amber-300 flex items-center justify-center">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-slate-900">Faculty Copilot</h3>
            <p className="text-[11px] text-stone-500">
              Ask for a targeted 5-minute mini-lesson or peer-pairing plan
            </p>
          </div>
        </div>

        <div className="space-y-2.5 max-h-56 overflow-y-auto bg-[#FAFAF9] p-3.5 rounded-2xl border border-stone-100">
          {teacherCopilotMessages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#223528] text-white ml-auto max-w-[85%]'
                  : 'bg-white border border-stone-200 text-slate-800 max-w-[90%]'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
            </div>
          ))}
          {isCopilotThinking && (
            <div className="text-xs text-stone-500 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-spin" />
              <span>Synthesizing classroom data...</span>
            </div>
          )}
        </div>

        <form onSubmit={handleCopilotSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={copilotInput}
            onChange={(e) => setCopilotInput(e.target.value)}
            placeholder="Ask for a 5-minute mini-lesson or student intervention..."
            className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs"
          />
          <button
            type="submit"
            disabled={!copilotInput.trim() || isCopilotThinking}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#223528] text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Ask</span>
          </button>
        </form>
      </section>
    </div>
  );
};
