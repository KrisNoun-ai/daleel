'use client';

import React from 'react';
import { useOmniMesh } from '../../context/SnackLabContext';
import { AppView } from '../../types';
import {
  GraduationCap,
  ShieldCheck,
  Compass,
  Sparkles,
  Menu,
  Layers,
  Search,
  MessageSquare,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    authenticatedParentStudent,
    setIsParentPinModalOpen,
    setIsArchitectureModalOpen,
    setIsClassDiscussionOpen,
    setIsJoinModalOpen,
    classJoinCode,
  } = useOmniMesh();

  const handleViewChange = (view: AppView) => {
    if (view === 'parent' && !authenticatedParentStudent) {
      setIsParentPinModalOpen(true);
      return;
    }
    setCurrentView(view);
  };

  return (
    <header className="relative z-40 w-full border-b border-stone-200/90 bg-[#FBFBF9] shadow-xs">
      <div className="mx-auto max-w-7xl px-3 sm:px-8 py-2.5 sm:py-0">
        <div className="flex sm:h-20 items-center justify-between gap-2">
          {/* Left: Menu, Discussion & Join Code */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setIsArchitectureModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-stone-700 bg-stone-100 hover:bg-stone-200/70 border border-stone-200 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full cursor-pointer transition-colors shadow-2xs"
              title="Open Pitch & Architecture Overview"
            >
              <Menu className="h-3.5 w-3.5 text-stone-600" />
              <span className="hidden md:inline font-mono text-[11px]">MENU</span>
            </button>

            <button
              type="button"
              onClick={() => setIsClassDiscussionOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#182a1e] bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/80 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full cursor-pointer transition-all shadow-2xs"
              title="Join Grade 9 Class Discussion"
            >
              <MessageSquare className="h-3.5 w-3.5 text-emerald-700" />
              <span className="font-sans font-bold text-[11px] hidden sm:inline">Discussion</span>
            </button>

            <button
              type="button"
              onClick={() => setIsJoinModalOpen(true)}
              className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono font-bold text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2 sm:px-2.5 py-1.5 rounded-full cursor-pointer transition-all"
              title="Join Class by Code"
            >
              <span>{classJoinCode}</span>
            </button>
          </div>

          {/* Center: Daleel Circular Emblem & Logo */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer select-none">
            <div className="relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#223528] to-[#1C2820] text-amber-200 shadow-sm border border-amber-500/30">
              <span className="font-serif text-base sm:text-lg font-bold tracking-tighter text-amber-300">د</span>
              <div className="absolute -inset-0.5 rounded-full border border-amber-400/20" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-serif text-base sm:text-2xl font-bold tracking-tight text-slate-900">
                  DALEEL
                </span>
                <span className="text-[9px] sm:text-[10px] bg-stone-100 text-stone-600 font-mono px-1.5 py-0.5 rounded border border-stone-200 font-bold">
                  دليل
                </span>
              </div>
              <p className="hidden lg:block text-[9px] sm:text-[10px] tracking-widest uppercase text-stone-500 font-medium font-mono -mt-0.5">
                PROJECT-BASED SECONDARY INCUBATOR
              </p>
            </div>
          </div>

          {/* Desktop Role Switcher (md+) */}
          <nav className="hidden md:flex items-center gap-1 rounded-full border border-stone-200 bg-stone-100/90 p-1 shadow-xs">
            <button
              type="button"
              onClick={() => handleViewChange('student')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                currentView === 'student'
                  ? 'bg-[#223528] text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-slate-900 hover:bg-stone-200/50'
              }`}
            >
              <Compass className="h-3.5 w-3.5 text-emerald-400" />
              <span>Student Studio</span>
            </button>

            <button
              type="button"
              onClick={() => handleViewChange('teacher')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                currentView === 'teacher'
                  ? 'bg-[#223528] text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-slate-900 hover:bg-stone-200/50'
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5 text-emerald-400" />
              <span>Teacher Cockpit</span>
            </button>

            <button
              type="button"
              onClick={() => handleViewChange('parent')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                currentView === 'parent' && !!authenticatedParentStudent
                  ? 'bg-[#223528] text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-slate-900 hover:bg-stone-200/50'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Parent Ledger</span>
              {authenticatedParentStudent && (
                <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
          </nav>
        </div>

        {/* Mobile Role Switcher Row (< md) — fits 100% cleanly on 360px+ phones */}
        <nav className="md:hidden mt-2 grid grid-cols-3 gap-1 rounded-2xl border border-stone-200 bg-stone-100/90 p-1 shadow-xs">
          <button
            type="button"
            onClick={() => handleViewChange('student')}
            className={`flex items-center justify-center gap-1 rounded-xl py-1.5 text-[11px] font-semibold transition-all cursor-pointer ${
              currentView === 'student'
                ? 'bg-[#223528] text-white shadow-xs'
                : 'text-stone-600'
            }`}
          >
            <Compass className="h-3.5 w-3.5 text-emerald-400" />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => handleViewChange('teacher')}
            className={`flex items-center justify-center gap-1 rounded-xl py-1.5 text-[11px] font-semibold transition-all cursor-pointer ${
              currentView === 'teacher'
                ? 'bg-[#223528] text-white shadow-xs'
                : 'text-stone-600'
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5 text-emerald-400" />
            <span>Teacher</span>
          </button>

          <button
            type="button"
            onClick={() => handleViewChange('parent')}
            className={`flex items-center justify-center gap-1 rounded-xl py-1.5 text-[11px] font-semibold transition-all cursor-pointer ${
              currentView === 'parent' && !!authenticatedParentStudent
                ? 'bg-[#223528] text-white shadow-xs'
                : 'text-stone-600'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Parent</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
