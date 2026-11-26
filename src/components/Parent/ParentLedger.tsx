'use client';

import React, { useState } from 'react';
import { useDaleel } from '../../context/DaleelContext';
import { ShieldCheck, Sparkles, Heart, Send, CheckCircle2 } from 'lucide-react';

export const ParentLedger: React.FC = () => {
  const {
    students,
    activeStudentId,
    setActiveStudentId,
    activeStudent,
    activeBlueprint,
    completedLevelsByStudent,
    claimsByStudent,
    sendParentNote,
    exportStudentDataJson,
    deleteStudentData,
  } = useDaleel();

  const [encouragementText, setEncouragementText] = useState('');
  const [noteSent, setNoteSent] = useState(false);
  const [isGeneratingDigest, setIsGeneratingDigest] = useState(false);
  const [digest, setDigest] = useState<{
    headline: string;
    plainLanguageSummary: string;
    reasoningExcerpt: string;
    dinnerPrompts: string[];
  } | null>(null);
  const [deletedBanner, setDeletedBanner] = useState(false);

  const completed = completedLevelsByStudent[activeStudent.id] || [];
  const claims = Object.values(claimsByStudent[activeStudent.id] || {});

  const handleGenerateDigest = async () => {
    setIsGeneratingDigest(true);
    try {
      const resp = await fetch('/api/parent/digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: activeStudent.name,
          blueprintTitle: activeBlueprint.title,
          completedLevels: completed,
          claims,
        }),
      });
      const data = await resp.json();
      if (data.digest) setDigest(data.digest);
    } finally {
      setIsGeneratingDigest(false);
    }
  };

  const handleSendNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!encouragementText.trim()) return;
    sendParentNote(encouragementText);
    setNoteSent(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E6DF] pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 font-mono">
            Daleel Guardian Growth Ledger
          </span>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#18221B]">
              Growth Ledger for
            </h1>
            <select
              value={activeStudentId}
              onChange={(e) => setActiveStudentId(e.target.value)}
              className="font-serif text-xl sm:text-2xl font-extrabold text-[#223528] bg-white border border-stone-300 rounded-2xl px-3 py-1 cursor-pointer"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {activeBlueprint.title} • {completed.length} milestone(s) completed • {claims.length} unassisted claim(s)
          </p>
        </div>
      </div>

      {/* Weekly Plain-Language Digest */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div>
            <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-700" />
              <span>Weekly Plain-Language Growth Digest</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Generated from {activeStudent.name.split(' ')[0]}&apos;s real milestone artifacts
            </p>
          </div>
          <button
            type="button"
            onClick={handleGenerateDigest}
            disabled={isGeneratingDigest}
            className="px-4 py-2 rounded-2xl bg-[#223528] text-white text-xs font-bold disabled:opacity-50 cursor-pointer shrink-0"
          >
            {isGeneratingDigest ? 'Generating...' : 'Generate Weekly Digest'}
          </button>
        </div>

        {digest && (
          <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-stone-200 space-y-3 text-xs">
            <strong className="font-serif text-sm text-slate-900 block">{digest.headline}</strong>
            <p className="text-stone-700 leading-relaxed">{digest.plainLanguageSummary}</p>
            <div className="p-3 rounded-xl bg-white border border-stone-200">
              <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1">
                Student Reasoning Excerpt
              </span>
              <p className="text-slate-800 italic">{digest.reasoningExcerpt}</p>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold block mb-1">
                Dinner-Table Discussion Prompts
              </span>
              <ul className="list-disc pl-5 text-stone-700 space-y-1">
                {digest.dinnerPrompts.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Send Encouragement Note */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-3">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
          <Heart className="h-4 w-4 text-[#223528]" />
          <h3 className="font-serif text-sm font-bold text-slate-900">
            Send an Encouragement Note to {activeStudent.name.split(' ')[0]}
          </h3>
        </div>

        {noteSent ? (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              Sent! It now appears on {activeStudent.name.split(' ')[0]}&apos;s workspace.
            </span>
            <button
              type="button"
              onClick={() => {
                setNoteSent(false);
                setEncouragementText('');
              }}
              className="underline font-bold cursor-pointer"
            >
              Write another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendNote} className="flex items-center gap-2">
            <input
              type="text"
              value={encouragementText}
              onChange={(e) => setEncouragementText(e.target.value)}
              placeholder={`Write a supportive note for ${activeStudent.name.split(' ')[0]}...`}
              className="flex-1 px-4 py-2.5 rounded-2xl border border-stone-200 text-xs"
            />
            <button
              type="submit"
              disabled={!encouragementText.trim()}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#223528] text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send</span>
            </button>
          </form>
        )}
      </div>

      {/* Privacy & Compliance Controls */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-stone-600">
          <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
          <span>
            <strong>FERPA / COPPA / GDPR:</strong> Zero AI training on student data.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportStudentDataJson}
            className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 font-semibold cursor-pointer"
          >
            Export Data (JSON)
          </button>
          <button
            type="button"
            onClick={() => {
              deleteStudentData();
              setDeletedBanner(true);
            }}
            className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 font-semibold cursor-pointer"
          >
            Delete Student Data
          </button>
        </div>
      </div>
      {deletedBanner && (
        <p className="text-xs text-rose-700 font-semibold">
          Student artifacts and local drafts have been deleted.
        </p>
      )}
    </div>
  );
};
