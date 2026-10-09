'use client';

import React, { useState } from 'react';
import { useOmniMesh } from '../../context/SnackLabContext';
import {
  ShieldCheck,
  Sparkles,
  HelpCircle,
  TrendingUp,
  MessageCircle,
  KeyRound,
  LogOut,
  CheckCircle2,
  BookOpen,
  ChevronDown,
  Check,
  Heart,
  Send,
  Calendar,
  Flame,
  Award,
  Users,
  Compass,
} from 'lucide-react';

export const ParentLedgerView: React.FC = () => {
  const {
    students,
    activeStudentId,
    setActiveStudentId,
    student,
    lastBatchLog,
    setIsParentPinModalOpen,
    setAuthenticatedParentStudent,
    setCurrentView,
  } = useOmniMesh();

  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState<boolean>(false);
  const [isNoteSent, setIsNoteSent] = useState<boolean>(false);
  const [encouragementText, setEncouragementText] = useState<string>('');

  const hasViolation =
    lastBatchLog?.hasViolation && student.id === 'samir-haddad';

  const handleLogout = () => {
    setAuthenticatedParentStudent(null);
    setCurrentView('student');
  };

  const handleSendEncouragement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!encouragementText.trim()) return;
    setIsNoteSent(true);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-3 px-2 sm:px-0">
      {/* 1. Header Banner with Hikaya Polish & Demo Student Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-b border-[#E8E6DF] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 font-mono">
              Daleel Guardian Growth Ledger
            </span>
          </div>

          <div className="flex items-center gap-3 mt-1.5">
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-[#18221B]">
              Growth Ledger for
            </h1>

            {/* Handcrafted Student Switcher Popover */}
            <div className="relative inline-block">
              <button
                type="button"
                onClick={() => setIsStudentDropdownOpen(!isStudentDropdownOpen)}
                className="flex items-center gap-2 font-serif text-2xl sm:text-3xl font-extrabold text-[#223528] bg-white hover:bg-stone-50 border border-stone-300 rounded-2xl px-4 py-1 shadow-2xs transition-all cursor-pointer"
              >
                <span>{student.name}</span>
                <ChevronDown className="h-5 w-5 text-stone-500" />
              </button>

              {/* Student Switcher Dropdown Menu */}
              {isStudentDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsStudentDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 z-40 w-80 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-stone-400 border-b border-stone-100">
                      Switch Student Profile
                    </div>
                    <div className="space-y-1 mt-1">
                      {students.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setActiveStudentId(s.id);
                            setIsStudentDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                            activeStudentId === s.id
                              ? 'bg-[#223528] text-white'
                              : 'hover:bg-stone-100 text-slate-800'
                          }`}
                        >
                          <div>
                            <span className="font-serif font-bold text-sm block">
                              {s.name}
                            </span>
                            <span
                              className={`text-[11px] ${
                                activeStudentId === s.id
                                  ? 'text-stone-300'
                                  : 'text-stone-500'
                              }`}
                            >
                              {s.grade} • {s.role}
                            </span>
                          </div>
                          {activeStudentId === s.id && (
                            <Check className="h-4 w-4 text-emerald-300 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <p className="text-xs text-stone-500 mt-1">
            Qualitative empirical development • Non-punitive documentation • Zero reductive letter grades
          </p>
        </div>

        {/* Switch / Sign Out Actions */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setIsParentPinModalOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 px-3.5 py-1.5 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <KeyRound className="h-3.5 w-3.5 text-stone-500" />
            <span>PIN Gate</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 px-3 py-1.5 text-xs font-medium shadow-2xs transition-colors cursor-pointer"
            title="Exit Guardian Portal"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Weekly Discovery Journey Timeline (Clean Stepper) */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-[#223528]" />
            <h3 className="font-serif text-sm font-bold text-slate-900">
              Weekly Incubator Progression
            </h3>
          </div>
          <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider font-semibold">
            Sprint 03 • Kitchen Chemistry
          </span>
        </div>

        {/* Stepper Track */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Day 1 */}
          <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-stone-200/80 space-y-1.5 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-stone-500 uppercase">
                  Mon • Stage 1
                </span>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Mastered
                </span>
              </div>
              <div className="font-serif font-bold text-sm text-slate-900">
                Consumer Research
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Surveyed 25 peer athletes on protein and low-glycemic energy bars.
              </p>
            </div>
          </div>

          {/* Day 2 */}
          <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-stone-200/80 space-y-1.5 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-stone-500 uppercase">
                  Tue • Stage 2
                </span>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Mastered
                </span>
              </div>
              <div className="font-serif font-bold text-sm text-slate-900">
                Macronutrient Spec
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Formulated 12g prebiotic fiber and organic rolled oats ratio.
              </p>
            </div>
          </div>

          {/* Day 3 (Current) */}
          <div className="p-4 rounded-2xl bg-white border-2 border-[#223528] shadow-xs space-y-1.5 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#223528] uppercase">
                  Wed • Stage 3
                </span>
                <span className="text-[10px] font-bold text-white bg-[#223528] px-2 py-0.5 rounded-full">
                  Active Lab
                </span>
              </div>
              <div className="font-serif font-bold text-sm text-slate-900">
                Kitchen Fair Test
              </div>
              <p className="text-[11px] text-stone-700 leading-relaxed">
                Isolating wild honey vs. date paste chewiness at 325°F in school oven.
              </p>
            </div>
          </div>

          {/* Day 4 */}
          <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-stone-200/80 space-y-1.5 flex flex-col justify-between opacity-80">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-stone-400 uppercase">
                  Thu • Stage 4
                </span>
                <span className="text-[10px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                  Upcoming
                </span>
              </div>
              <div className="font-serif font-bold text-sm text-slate-900">
                Unit Cost Pricing
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Co-solving cost equation C(x) = $0.88/bar with Jad Mansour.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Qualitative Growth Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: What the student mastered */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#223528] uppercase tracking-wider">
                <Sparkles className="h-4 w-4 text-[#223528]" />
                <span>What {student.name.split(' ')[0]} Mastered This Week</span>
              </div>
              <span className="text-[10px] font-mono bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-semibold">
                Science Agency
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-normal bg-[#FAFAF9] p-4 rounded-2xl border border-stone-200/70">
              {hasViolation
                ? `${student.name.split(' ')[0]} is developing authentic scientific discipline in the school test kitchen. After reviewing their initial batch chewiness, they learned to hold the oven temperature locked at 325°F while adjusting sweetener, proving direct cause-and-effect.`
                : `${student.name.split(' ')[0]} demonstrated clean empirical discipline this week. They successfully isolated the sweetener variable (swapping honey for date paste while keeping the oven constant at 325°F) to certify bar texture without guesswork.`}
            </p>
          </div>
          <span className="text-[10px] text-stone-500 block pt-1 border-t border-stone-100">
            Curriculum Standard: NGSS Physical Science (Controlled Variables)
          </span>
        </div>

        {/* Card 2: Where the student is growing */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-800 uppercase tracking-wider">
                <TrendingUp className="h-4 w-4 text-[#223528]" />
                <span>Collaborative Growth & Team Support</span>
              </div>
              <span className="text-[10px] font-mono bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-semibold">
                Peer Pods
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-normal bg-[#FAFAF9] p-4 rounded-2xl border border-stone-200/70">
              {student.name.split(' ')[0]} found multi-step unit costing algebra challenging when worked alone. In the Daleel incubator, they paired with Jad Mansour (Finance Lead) to model linear equations C(x) collaboratively, connecting gram weights to retail price.
            </p>
          </div>
          <span className="text-[10px] text-stone-500 block pt-1 border-t border-stone-100">
            Curriculum Standard: Common Core Mathematics (Linear Cost Functions)
          </span>
        </div>
      </div>

      {/* 4. Refined Family Conversation Starters (Solid White Card) */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-stone-100 flex items-center justify-center text-[#223528]">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-slate-900">
                Tonight&apos;s Family Conversation Starters
              </h3>
              <p className="text-[11px] text-stone-500">
                Open-ended prompts to discuss what your child formulated in the test kitchen:
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full font-semibold">
            Positive Dialogue
          </span>
        </div>

        <div className="space-y-3 pt-1">
          <div className="bg-[#FAFAF9] rounded-2xl p-4 border border-stone-200/80 text-xs text-slate-800 space-y-1">
            <strong className="text-slate-900 block font-semibold">
              Kitchen Science & Fair Testing:
            </strong>
            <p className="italic text-stone-600 leading-relaxed">
              &ldquo;Ask {student.name.split(' ')[0]} why they chose date paste instead of honey in today&apos;s trial. What happened to the texture when they locked the oven at 325°F?&rdquo;
            </p>
          </div>

          <div className="bg-[#FAFAF9] rounded-2xl p-4 border border-stone-200/80 text-xs text-slate-800 space-y-1">
            <strong className="text-slate-900 block font-semibold">
              Teamwork & Business Math:
            </strong>
            <p className="italic text-stone-600 leading-relaxed">
              &ldquo;Ask {student.name.split(' ')[0]} about collaborating with Jad on the bar economics. How does date paste keep the production cost at $0.88 while achieving a 71% profit margin?&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* 5. Clean Standards Mastery Trajectory */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#223528]" />
            <h3 className="font-serif text-sm font-bold text-slate-900">
              Curriculum Competency Trajectory
            </h3>
          </div>
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono">
            Longitudinal Progress
          </span>
        </div>

        <div className="space-y-4 text-xs">
          {/* Science Meter */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="font-semibold text-slate-800">
                Food Science: Controlled Variables (NGSS MS-PS1-2)
              </span>
              <span className="text-emerald-800 font-bold font-mono">
                {hasViolation ? 'In Progress (Isolating Variables)' : 'Mastered (Controlled Trial Certified)'}
              </span>
            </div>
            <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  hasViolation ? 'w-3/5 bg-amber-600' : 'w-11/12 bg-[#223528]'
                }`}
              />
            </div>
            <p className="text-[10px] text-stone-500">
              Evaluates the student&apos;s ability to isolate cause-and-effect rather than altering ingredients randomly.
            </p>
          </div>

          {/* Math Meter */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="font-semibold text-slate-800">
                Practical Mathematics: Unit Cost Equations (CCSS.MATH.HSA)
              </span>
              <span className="text-stone-700 font-semibold font-mono">
                78% Mastery (Growing with peer support)
              </span>
            </div>
            <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-[#223528] rounded-full" />
            </div>
            <p className="text-[10px] text-stone-500">
              Translates recipe gram measurements into realistic unit costs and margin projections.
            </p>
          </div>

          {/* Hands-on Focus Meter */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="font-semibold text-slate-800">
                Laboratory Concentration & Team Participation
              </span>
              <span className="text-emerald-800 font-bold font-mono">
                88% High Sustained Engagement
              </span>
            </div>
            <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full w-4/5 bg-[#223528] rounded-full" />
            </div>
            <p className="text-[10px] text-stone-500">
              Maintains over 50 continuous minutes of active focus and teamwork during kitchen lab formulations.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Guardian Encouragement Note to Student */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-[#223528]" />
            <h3 className="font-serif text-sm font-bold text-slate-900">
              Send an Encouragement Note to {student.name.split(' ')[0]}&apos;s Workbench
            </h3>
          </div>
          <span className="text-[10px] text-stone-400 font-mono">
            Direct Bench Messenger
          </span>
        </div>

        {isNoteSent ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              <span>
                Encouragement dispatched! It will greet {student.name.split(' ')[0]} on their kitchen workbench tomorrow morning.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsNoteSent(false);
                setEncouragementText('');
              }}
              className="text-[11px] underline text-emerald-800 font-bold cursor-pointer"
            >
              Write another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendEncouragement} className="space-y-3">
            <p className="text-xs text-stone-600">
              Your message will be displayed on {student.name.split(' ')[0]}&apos;s incubator workbench when they begin tomorrow&apos;s lab:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={encouragementText}
                onChange={(e) => setEncouragementText(e.target.value)}
                placeholder={`e.g. "Proud of your scientific formulation in the lab today, ${student.name.split(' ')[0]}!"`}
                className="flex-1 px-4 py-2.5 rounded-2xl border border-stone-200 bg-white text-xs text-slate-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#223528]"
              />
              <button
                type="submit"
                disabled={!encouragementText.trim()}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#223528] text-white text-xs font-bold hover:bg-[#18261D] disabled:opacity-40 transition-colors shadow-xs cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send Note</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 7. Faculty Philosophy Note to Guardians */}
      <div className="p-5 rounded-2xl bg-white border border-stone-200 text-xs text-stone-500 space-y-2">
        <span className="font-serif font-bold text-slate-900 block text-xs">
          A Note on Daleel&apos;s Qualitative Assessment Philosophy:
        </span>
        <p className="text-[11px] leading-relaxed">
          Traditional grading systems reduce a young person&apos;s multidimensional curiosity to a single punitive number. At Daleel, we document actual empirical problem solving, peer review reciprocity, and real-world entrepreneurial collaboration. When a student encounters a scientific roadblock, our system doesn&apos;t penalize them—it triggers socratic questions and peer scaffolding until mastery is achieved.
        </p>
      </div>
    </div>
  );
};
