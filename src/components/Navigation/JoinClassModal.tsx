'use client';

import React, { useState } from 'react';
import { useOmniMesh } from '../../context/SnackLabContext';
import { X, KeyRound, ArrowRight } from 'lucide-react';

export const JoinClassModal: React.FC = () => {
  const {
    isJoinModalOpen,
    setIsJoinModalOpen,
    classJoinCode,
    joinClassWithCode,
    activeBlueprint,
  } = useOmniMesh();

  const [code, setCode] = useState(classJoinCode);
  const [name, setName] = useState('Samir Haddad');
  const [error, setError] = useState<string | null>(null);

  if (!isJoinModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = joinClassWithCode(code, name);
    if (!res.ok) {
      setError(res.error || 'Could not join class.');
    } else {
      setError(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200 shadow-2xl p-6 space-y-5">
        <div className="flex items-start justify-between border-b border-stone-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#223528] text-amber-300 flex items-center justify-center">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900">Join Classroom Venture</h3>
              <p className="text-xs text-stone-500">{activeBlueprint.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsJoinModalOpen(false)}
            className="p-1.5 rounded-full text-stone-400 hover:bg-stone-100 hover:text-slate-700 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block">6-Character Class Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g., DALEEL9"
              className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3.5 py-2.5 font-mono text-sm uppercase tracking-widest text-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block">Your Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-slate-900"
            />
          </div>

          {error && <p className="text-rose-600 font-semibold">{error}</p>}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-[#223528] hover:bg-[#19271e] text-white font-bold text-sm cursor-pointer"
          >
            <span>Enter Student Studio</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-2 text-[11px]">
          <button
            type="button"
            onClick={() => joinClassWithCode(classJoinCode, 'Samir Haddad')}
            className="py-2 px-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 font-semibold text-slate-700 cursor-pointer"
          >
            Continue with Google SSO
          </button>
          <button
            type="button"
            onClick={() => joinClassWithCode(classJoinCode, 'Yara Khoury')}
            className="py-2 px-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 font-semibold text-slate-700 cursor-pointer"
          >
            Continue with Microsoft
          </button>
        </div>
      </div>
    </div>
  );
};
