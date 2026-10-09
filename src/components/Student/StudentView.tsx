'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useOmniMesh } from '../../context/SnackLabContext';
import { CandyLevel } from '../../types';
import { CandyCrushMap } from './CandyCrushMap';
import {
  Sparkles,
  Send,
  Hand,
  FlaskConical,
  Compass,
  ChevronDown,
  Check,
  ArrowLeft,
} from 'lucide-react';

export const StudentView: React.FC = () => {
  const {
    students,
    activeStudentId,
    setActiveStudentId,
    student,
    levels,
    selectedLevelNumber,
    setSelectedLevelNumber,
    socraticMessages,
    sendSocraticMessageToGemini,
    isGeminiThinking,
    activeMentorPersona,
    setActiveMentorPersona,
    requestTeacherHelp,
    openLevelSocraticDesk,
  } = useOmniMesh();

  // Mode: 'map' (Candy Crush Map) or 'desk' (Direct Socratic Mentor Desk)
  const [isDeskOpen, setIsDeskOpen] = useState<boolean>(false);
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [justRequestedHelp, setJustRequestedHelp] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeLevelObj =
    levels.find((l) => l.levelNumber === selectedLevelNumber) || levels[2];

  useEffect(() => {
    if (isDeskOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [socraticMessages, isGeminiThinking, isDeskOpen]);

  const handleSelectLevel = (lvl: CandyLevel) => {
    setSelectedLevelNumber(lvl.levelNumber);
    openLevelSocraticDesk(lvl.levelNumber);
    setIsDeskOpen(true);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGeminiThinking) return;
    const txt = input;
    setInput('');
    await sendSocraticMessageToGemini(txt);
  };

  const handleQuickPrompt = async (promptText: string) => {
    if (isGeminiThinking) return;
    await sendSocraticMessageToGemini(promptText);
  };

  const handleRequestTeacher = () => {
    requestTeacherHelp();
    setJustRequestedHelp(true);
    setTimeout(() => setJustRequestedHelp(false), 4000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* 1. Clean, Clutter-Free Student Header (No pills, no tabs, no clutter) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E6DF] pb-5">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18221B]">
            Welcome back,
          </h1>

          {/* Student Persona Switcher */}
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => setIsStudentDropdownOpen(!isStudentDropdownOpen)}
              className="flex items-center gap-2 font-serif text-2xl sm:text-3xl font-extrabold text-[#223528] hover:text-[#2e4735] transition-colors cursor-pointer"
            >
              <span>{student.name}</span>
              <ChevronDown className="h-5 w-5 text-stone-400" />
            </button>

            {isStudentDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsStudentDropdownOpen(false)}
                />
                <div className="absolute left-0 mt-2 z-40 w-72 rounded-2xl border border-stone-200 bg-white p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-stone-400 border-b border-stone-100">
                    Switch Demo Student
                  </div>
                  <div className="space-y-1 mt-1 max-h-60 overflow-y-auto">
                    {students.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setActiveStudentId(s.id);
                          setIsStudentDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                          activeStudentId === s.id
                            ? 'bg-[#223528] text-white'
                            : 'hover:bg-stone-100 text-slate-800'
                        }`}
                      >
                        <div>
                          <span className="font-serif font-bold text-xs block">
                            {s.name}
                          </span>
                          <span
                            className={`text-[10px] ${
                              activeStudentId === s.id
                                ? 'text-stone-300'
                                : 'text-stone-500'
                            }`}
                          >
                            {s.role}
                          </span>
                        </div>
                        {activeStudentId === s.id && (
                          <Check className="h-3.5 w-3.5 text-emerald-300" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-600 font-mono">
          <span>{student.grade}</span>
          <span className="text-stone-300">•</span>
          <span className="font-semibold text-[#223528]">{student.role}</span>
        </div>
      </div>

      {/* 2. Main Content: Candy Crush Map OR Socratic Mentor Desk */}
      {!isDeskOpen ? (
        /* Candy Crush Level Journey Map (Gives direct access to Socratic Mentor Desk on click) */
        <div className="space-y-6 animate-in fade-in duration-200">
          <CandyCrushMap onSelectLevel={handleSelectLevel} />
        </div>
      ) : (
        /* Direct Socratic Mentor Desk for the Selected Level */
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Socratic Desk Top Bar */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={() => setIsDeskOpen(false)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all cursor-pointer"
                title="Return to Candy Crush Level Map"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Levels</span>
              </button>

              <div className="h-6 w-px bg-stone-200 hidden sm:block" />

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif font-bold text-slate-900 text-base sm:text-lg">
                    Level {activeLevelObj.levelNumber}: {activeLevelObj.title}
                  </h2>
                  <span className="text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    {activeLevelObj.curriculumCode}
                  </span>
                </div>
                <p className="text-xs text-stone-500 line-clamp-1">
                  {activeLevelObj.curriculumTopic} • {activeLevelObj.subtitle}
                </p>
              </div>
            </div>

            {/* Field Professional Selector: Socratic Mentor vs Dr. Wissam Sammouri */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs">
              <button
                type="button"
                onClick={() => setActiveMentorPersona('socratic')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  activeMentorPersona === 'socratic'
                    ? 'bg-[#223528] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Compass className="h-3.5 w-3.5" />
                <span>Socratic Mentor</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMentorPersona('biochemist')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  activeMentorPersona === 'biochemist'
                    ? 'bg-[#223528] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <FlaskConical className="h-3.5 w-3.5 text-emerald-400" />
                <span>Dr. Wissam Sammouri</span>
              </button>
            </div>
          </div>

          {/* Dr. Wissam Sammouri Bio Banner (When Selected as Field Professional) */}
          {activeMentorPersona === 'biochemist' && (
            <div className="bg-teal-50/80 border border-teal-200 rounded-3xl p-4 flex items-start gap-3 text-xs text-teal-950 animate-in fade-in">
              <div className="h-8 w-8 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                <FlaskConical className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-sm text-teal-950">
                    Dr. Wissam Sammouri
                  </span>
                  <span className="text-[10px] font-mono bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-semibold">
                    Field Professional • Food Science & Biochemistry
                  </span>
                </div>
                <p className="text-teal-900/90 text-xs leading-relaxed">
                  Advising on polysaccharide pectin hydration, moisture binding, Maillard browning kinetics, and shelf-life water activity (Aw &lt; 0.60).
                </p>
              </div>
            </div>
          )}

          {/* Conversational Mentor Surface */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden flex flex-col min-h-[520px] max-h-[680px]">
            {/* Header info bar */}
            <div className="px-6 py-3.5 bg-[#FAF9F5] border-b border-stone-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-slate-800">
                  {activeMentorPersona === 'biochemist'
                    ? 'Consulting Dr. Wissam Sammouri (Field Professional)'
                    : `Socratic Mentor Desk (Level ${activeLevelObj.levelNumber})`}
                </span>
              </div>
              <span className="text-[11px] font-mono text-stone-400">
                Inquiry: &ldquo;{activeLevelObj.keyQuestion}&rdquo;
              </span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-[#FBFBF9]/60">
              {socraticMessages.map((msg) => {
                const isUser = msg.sender === 'user';
                const isDispatched = msg.isDispatchedHint;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in fade-in duration-150`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] text-stone-400 font-mono">
                      <span>
                        {isUser
                          ? `${student.name.split(' ')[0]} (Student)`
                          : isDispatched
                          ? 'Teacher Guidance'
                          : activeMentorPersona === 'biochemist'
                          ? 'Dr. Wissam Sammouri'
                          : 'Socratic Mentor'}
                      </span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed max-w-[85%] shadow-2xs ${
                        isUser
                          ? 'bg-[#223528] text-white rounded-br-xs'
                          : isDispatched
                          ? 'bg-amber-50 text-amber-950 border-2 border-amber-300 rounded-bl-xs font-medium'
                          : 'bg-white text-slate-900 border border-stone-200/90 rounded-bl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                  </div>
                );
              })}

              {isGeminiThinking && (
                <div className="flex items-center gap-2.5 p-3.5 bg-white rounded-2xl border border-stone-200 text-xs text-stone-600 max-w-xs shadow-2xs animate-pulse">
                  <Sparkles className="h-4 w-4 text-emerald-600 animate-spin shrink-0" />
                  <span>Formulating guidance...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Starter Chips */}
            <div className="px-6 py-2.5 bg-white border-t border-stone-100 flex items-center gap-2 overflow-x-auto text-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 shrink-0">
                Suggested:
              </span>
              <button
                type="button"
                onClick={() =>
                  handleQuickPrompt(
                    activeMentorPersona === 'biochemist'
                      ? 'How does Date Paste pectin structurally bind moisture compared to raw wild honey?'
                      : activeLevelObj.keyQuestion
                  )
                }
                className="px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium truncate max-w-md transition-colors cursor-pointer shrink-0"
              >
                &ldquo;
                {activeMentorPersona === 'biochemist'
                  ? 'How does Date Paste pectin bind moisture?'
                  : activeLevelObj.keyQuestion}
                &rdquo;
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickPrompt(
                    'What is the scientific rule for isolating independent variables?'
                  )
                }
                className="px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium truncate max-w-md transition-colors cursor-pointer shrink-0"
              >
                &ldquo;What is the fair-test rule?&rdquo;
              </button>
            </div>

            {/* Input Composer with In-Chat Teacher Help Button */}
            <form
              onSubmit={handleSend}
              className="p-4 border-t border-stone-200 bg-white flex items-center gap-2.5"
            >
              {/* In-chat button to request help from teacher */}
              <button
                type="button"
                onClick={handleRequestTeacher}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  justRequestedHelp
                    ? 'bg-amber-500 text-white animate-pulse'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300'
                }`}
                title="Request Help from Teacher (Triggers real-time notification popup)"
              >
                <Hand className="h-4 w-4 text-amber-600" />
                <span className="hidden sm:inline">
                  {justRequestedHelp ? 'Alert Dispatched!' : 'Ask Teacher'}
                </span>
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask a question or explain your hypothesis for Level ${activeLevelObj.levelNumber}...`}
                disabled={isGeminiThinking}
                className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#223528]/20 focus:border-[#223528] transition-all"
              />

              <button
                type="submit"
                disabled={!input.trim() || isGeminiThinking}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#223528] text-white hover:bg-[#19271e] disabled:opacity-40 disabled:hover:bg-[#223528] text-xs sm:text-sm font-semibold shadow-xs cursor-pointer transition-all"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
