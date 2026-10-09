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
  } = useOmniMesh();

  const handleViewChange = (view: AppView) => {
    if (view === 'parent' && !authenticatedParentStudent) {
      setIsParentPinModalOpen(true);
      return;
    }
    setCurrentView(view);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/90 bg-[#FBFBF9]/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-8">
        {/* Left: Hikaya-Inspired Menu & Section Badge */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsArchitectureModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-stone-700 bg-stone-100 hover:bg-stone-200/70 border border-stone-200 px-3.5 py-2 rounded-full cursor-pointer transition-colors shadow-2xs"
            title="Open Pitch & Architecture Overview"
          >
            <Menu className="h-3.5 w-3.5 text-stone-600" />
            <span className="hidden sm:inline font-mono text-[11px]">MENU</span>
          </button>

          {/* Small button to join class discussion */}
          <button
            type="button"
            onClick={() => setIsClassDiscussionOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#182a1e] bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/80 px-3 py-2 rounded-full cursor-pointer transition-all shadow-2xs"
            title="Join Grade 9 Class Discussion"
          >
            <MessageSquare className="h-3.5 w-3.5 text-emerald-700" />
            <span className="font-sans font-bold text-[11px]">Class Discussion</span>
          </button>

          <div className="hidden md:flex items-center gap-1 bg-stone-100/90 p-1 rounded-full border border-stone-200">
            <button
              type="button"
              onClick={() => handleViewChange('student')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                currentView === 'student'
                  ? 'bg-[#223528] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Compass className="h-3 w-3" />
              <span>INCUBATOR LAB</span>
            </button>
            <button
              type="button"
              onClick={() => handleViewChange('teacher')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                currentView === 'teacher'
                  ? 'bg-[#223528] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Layers className="h-3 w-3" />
              <span>FACULTY MESH</span>
            </button>
          </div>
        </div>

        {/* Center: Daleel Artisanal Circular Emblem & Logo */}
        <div className="flex flex-col items-center justify-center cursor-pointer select-none">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#223528] to-[#1C2820] text-amber-200 shadow-sm border border-amber-500/30">
              <span className="font-serif text-lg font-bold tracking-tighter text-amber-300">د</span>
              <div className="absolute -inset-0.5 rounded-full border border-amber-400/20" />
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  DALEEL
                </span>
                <span className="text-[10px] bg-stone-100 text-stone-600 font-mono px-1.5 py-0.5 rounded border border-stone-200 font-bold">
                  دليل
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] tracking-widest uppercase text-stone-500 font-medium font-mono -mt-0.5">
                PROJECT-BASED SECONDARY INCUBATOR
              </p>
            </div>
          </div>
        </div>

        {/* Right: Clean Segmented Role Switcher */}
        <nav className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-100/90 p-1 shadow-xs">
          <button
            type="button"
            onClick={() => handleViewChange('student')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              currentView === 'student'
                ? 'bg-[#223528] text-white shadow-xs font-semibold'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-200/50'
            }`}
          >
            <Compass className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Student Studio</span>
            <span className="sm:hidden">Student</span>
          </button>

          <button
            type="button"
            onClick={() => handleViewChange('teacher')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              currentView === 'teacher'
                ? 'bg-[#223528] text-white shadow-xs font-semibold'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-200/50'
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Teacher Cockpit</span>
            <span className="sm:hidden">Teacher</span>
          </button>

          <button
            type="button"
            onClick={() => handleViewChange('parent')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              currentView === 'parent' && !!authenticatedParentStudent
                ? 'bg-[#223528] text-white shadow-xs font-semibold'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-200/50'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Parent Ledger</span>
            <span className="sm:hidden">Parent</span>
            {authenticatedParentStudent && (
              <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
