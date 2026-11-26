'use client';

import React from 'react';
import { useDaleel, WorkspaceRole } from '../../context/DaleelContext';
import { GraduationCap, ShieldCheck, Compass, MessageSquare } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    setIsDiscussionOpen,
    setIsJoinModalOpen,
    joinCode,
  } = useDaleel();

  const tabs: Array<{ id: WorkspaceRole; label: string; short: string; icon: React.ReactNode }> = [
    { id: 'student', label: 'Student Studio', short: 'Student', icon: <Compass className="h-3.5 w-3.5 text-emerald-400" /> },
    { id: 'teacher', label: 'Teacher Cockpit', short: 'Teacher', icon: <GraduationCap className="h-3.5 w-3.5 text-emerald-400" /> },
    { id: 'parent', label: 'Parent Ledger', short: 'Parent', icon: <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> },
  ];

  return (
    <header className="relative z-40 w-full border-b border-stone-200/90 bg-[#FBFBF9] shadow-xs">
      <div className="mx-auto max-w-7xl px-3 sm:px-8 py-2.5 sm:py-0">
        <div className="flex sm:h-20 items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setIsDiscussionOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#182a1e] bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/80 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full cursor-pointer"
              title="Class Discussion"
            >
              <MessageSquare className="h-3.5 w-3.5 text-emerald-700" />
              <span className="font-sans font-bold text-[11px] hidden sm:inline">Discussion</span>
            </button>

            <button
              type="button"
              onClick={() => setIsJoinModalOpen(true)}
              className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono font-bold text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-1.5 rounded-full cursor-pointer"
              title="Join Class by Code"
            >
              <span>Join: {joinCode}</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 select-none">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#223528] text-amber-300 shadow-sm border border-amber-500/30">
              <span className="font-serif text-base sm:text-lg font-bold">د</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-slate-900">
                DALEEL
              </span>
              <span className="text-[9px] sm:text-[10px] bg-stone-100 text-stone-600 font-mono px-1.5 py-0.5 rounded border border-stone-200 font-bold">
                دليل
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 rounded-full border border-stone-200 bg-stone-100/90 p-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setRole(t.id)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium cursor-pointer ${
                  role === t.id ? 'bg-[#223528] text-white font-semibold' : 'text-stone-600 hover:text-slate-900'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <nav className="md:hidden mt-2 grid grid-cols-3 gap-1 rounded-2xl border border-stone-200 bg-stone-100/90 p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setRole(t.id)}
              className={`flex items-center justify-center gap-1 rounded-xl py-1.5 text-[11px] font-semibold cursor-pointer ${
                role === t.id ? 'bg-[#223528] text-white' : 'text-stone-600'
              }`}
            >
              {t.icon}
              <span>{t.short}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
