'use client';

import React from 'react';
import { useDaleel } from '../../context/DaleelContext';
import { X, Printer, Award, CheckCircle2 } from 'lucide-react';

export const PortfolioExportModal: React.FC = () => {
  const {
    isPortfolioOpen,
    setIsPortfolioOpen,
    activeStudent,
    activeBlueprint,
    claimsByStudent,
    vivaByStudent,
  } = useDaleel();

  if (!isPortfolioOpen) return null;

  const claims = Object.values(claimsByStudent[activeStudent.id] || {});
  const vivas = Object.entries(vivaByStudent[activeStudent.id] || {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200 bg-[#FAF9F5] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#223528] text-amber-300 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900">Venture Portfolio</h3>
              <p className="text-xs text-stone-500">Printable record of unassisted claims &amp; oral defenses</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#223528] text-white text-xs font-bold cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPortfolioOpen(false)}
              className="p-2 rounded-xl text-stone-400 hover:bg-stone-200/60 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-xs bg-white">
          <div className="border-b border-stone-200 pb-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-bold">
              Daleel Student Portfolio
            </span>
            <h1 className="font-serif text-2xl font-extrabold text-slate-900 mt-0.5">
              {activeStudent.name} — {activeBlueprint.title}
            </h1>
            <p className="text-stone-500 mt-0.5">
              {activeStudent.grade} • {activeStudent.podName} • {activeBlueprint.subjectArea}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <strong className="text-slate-900 block mb-1">Driving Question</strong>
            <p className="text-stone-700">{activeBlueprint.drivingQuestion}</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-slate-900">
              Unassisted Claims ({claims.length})
            </h4>
            {claims.length === 0 ? (
              <p className="text-stone-400 italic">No claims submitted yet.</p>
            ) : (
              claims.map((c) => (
                <div key={c.levelNumber} className="p-3.5 rounded-2xl border border-stone-200 bg-[#FAFAF9]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                      Level {c.levelNumber} Claim
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">{c.submittedAt}</span>
                  </div>
                  <p className="text-stone-700">{c.claimText}</p>
                </div>
              ))
            )}
          </div>

          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-slate-900">
              Oral Defense Evaluations ({vivas.length})
            </h4>
            {vivas.length === 0 ? (
              <p className="text-stone-400 italic">No oral defenses submitted yet.</p>
            ) : (
              vivas.map(([lvl, sub]) => (
                <div key={lvl} className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900">Level {lvl} ({sub.durationSeconds}s)</strong>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {sub.evaluation.overallReadiness}
                    </span>
                  </div>
                  <p className="text-stone-700 italic">&ldquo;{sub.transcript}&rdquo;</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
