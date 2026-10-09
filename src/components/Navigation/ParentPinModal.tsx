'use client';

import React, { useState, useEffect } from 'react';
import { useOmniMesh } from '../../context/SnackLabContext';
import { ShieldCheck, Lock, KeyRound, ArrowRight, X, AlertCircle } from 'lucide-react';

export const ParentPinModal: React.FC = () => {
  const {
    students,
    isParentPinModalOpen,
    setIsParentPinModalOpen,
    setAuthenticatedParentStudent,
    setCurrentView,
    setActiveStudentId,
  } = useOmniMesh();

  const [selectedStudentId, setSelectedStudentId] = useState<string>('samir-haddad');
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isParentPinModalOpen) {
      setPin('');
      setError(null);
    }
  }, [isParentPinModalOpen]);

  if (!isParentPinModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() !== '0000') {
      setError('Incorrect Access PIN. (Demo PIN: 0000)');
      return;
    }
    setError(null);
    setAuthenticatedParentStudent(selectedStudentId);
    setActiveStudentId(selectedStudentId);
    setIsParentPinModalOpen(false);
    setCurrentView('parent');
  };

  const handleDemoBypass = (studentId: string = 'samir-haddad') => {
    setError(null);
    setAuthenticatedParentStudent(studentId);
    setActiveStudentId(studentId);
    setIsParentPinModalOpen(false);
    setCurrentView('parent');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-100 text-stone-800">
              <ShieldCheck className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-slate-900">Guardian Verification</h3>
              <p className="text-[11px] text-stone-500">Daleel Growth Ledger Gate</p>
            </div>
          </div>
          <button
            onClick={() => setIsParentPinModalOpen(false)}
            className="rounded-full p-1.5 text-stone-400 hover:bg-stone-100 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="mt-4 rounded-xl bg-stone-50 p-3 text-xs text-stone-700 border border-stone-200/80 flex items-start gap-2">
          <Lock className="h-4 w-4 text-stone-600 shrink-0 mt-0.5" />
          <span className="leading-relaxed text-[11px]">
            Parent ledger reflects authentic classroom progress and scientific reasoning without letter grades.
          </span>
        </div>

        {/* PIN Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-2.5 text-xs text-red-700 border border-red-200 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Student Selector */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Student Profile
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 shadow-xs focus:ring-1 focus:ring-emerald-700"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.grade} • {s.role.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* PIN Input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700">Guardian PIN</label>
              <span className="text-[10px] text-stone-400 font-mono">Demo: 0000</span>
            </div>
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              className="w-full rounded-xl border border-stone-200 px-3.5 py-2 text-center text-sm font-mono tracking-widest text-slate-900 shadow-xs focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#223528] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#18261D] transition-colors cursor-pointer"
          >
            <span>Verify & Enter Ledger</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          {/* Fast Bypass Demo Action */}
          <div className="pt-2 border-t border-stone-100 text-center">
            <button
              type="button"
              onClick={() => handleDemoBypass(selectedStudentId)}
              className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
            >
              Demo Fast Bypass (Enter as Guardian)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
