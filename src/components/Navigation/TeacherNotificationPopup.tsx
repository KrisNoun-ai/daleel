'use client';

import React from 'react';
import { useOmniMesh } from '../../context/SnackLabContext';
import {
  Bell,
  X,
  ArrowRight,
  Sparkles,
  UserCheck,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const TeacherNotificationPopup: React.FC = () => {
  const {
    activeTeacherNotification,
    dismissTeacherNotification,
    setCurrentView,
    setTeacherViewMode,
    setTeacherDeepDiveStudent,
    dispatchSocraticHint,
  } = useOmniMesh();

  if (!activeTeacherNotification) return null;

  const handleInspect = () => {
    setCurrentView('teacher');
    setTeacherViewMode('deep_dive');
    setTeacherDeepDiveStudent(activeTeacherNotification.studentId);
    dismissTeacherNotification();
  };

  const handleDispatchHint = () => {
    dispatchSocraticHint();
    dismissTeacherNotification();
  };

  return (
    <div className="fixed top-24 right-4 sm:right-8 z-50 max-w-md w-[calc(100vw-2rem)] animate-in slide-in-from-top-4 duration-300">
      <div className="bg-white border-2 border-amber-400 rounded-3xl p-5 shadow-2xl relative overflow-hidden ring-4 ring-amber-400/20">
        {/* Animated accent gradient top bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 animate-pulse" />

        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md">
              <Bell className="h-5 w-5 animate-bounce" />
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-rose-500 border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono uppercase tracking-wider font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                  LIVE STUDENT CALL
                </span>
                <span className="text-[10px] text-stone-400 font-mono">
                  {activeTeacherNotification.timestamp}
                </span>
              </div>
              <h3 className="font-serif font-bold text-slate-900 text-sm mt-0.5">
                {activeTeacherNotification.studentName} requested help
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={dismissTeacherNotification}
            className="p-1 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Message body */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 mb-4 text-xs text-amber-950 space-y-1">
          <div className="font-semibold flex items-center gap-1.5 text-amber-900">
            <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <span>{activeTeacherNotification.levelTitle}</span>
          </div>
          <p className="text-amber-900/90 leading-relaxed font-sans pl-5">
            {activeTeacherNotification.message}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleInspect}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#223528] hover:bg-[#1b2b20] text-white py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <span>Inspect Workbench</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={handleDispatchHint}
            className="flex items-center justify-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 py-2.5 px-3 rounded-xl text-xs font-bold transition-all border border-amber-300 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-700" />
            <span>Dispatch Hint</span>
          </button>
        </div>
      </div>
    </div>
  );
};
