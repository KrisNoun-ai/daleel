'use client';

import React, { useState } from 'react';
import { useOmniMesh } from '../../context/SnackLabContext';
import { Users, X, Send, Calculator } from 'lucide-react';

export const TeamDispatchModal: React.FC = () => {
  const {
    student,
    isTeamDispatchOpen,
    setIsTeamDispatchOpen,
    teamMessages,
    sendTeamMessage,
  } = useOmniMesh();

  const [input, setInput] = useState<string>('');

  if (!isTeamDispatchOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendTeamMessage(input);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-3xl border border-stone-200 bg-white shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100 text-slate-800">
              <Users className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-slate-900">
                Team Operations Dispatch
              </h3>
              <p className="text-[11px] text-stone-500">
                Cross-Department Peer Sync: {student.name} ↔ Jad Mansour (Finance Lead)
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsTeamDispatchOpen(false)}
            className="p-1.5 rounded-full text-stone-400 hover:text-slate-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Math Standard Callout */}
        <div className="px-4 py-2.5 bg-emerald-50/60 border-b border-emerald-100 text-xs text-emerald-950 flex items-center gap-2">
          <Calculator className="h-4 w-4 text-emerald-700 shrink-0" />
          <span>
            <strong>Math Benchmark (CCSS.MATH.HSA.CED.A.2):</strong> Formulating linear cost equations and margin optimization through real ingredient pricing.
          </span>
        </div>

        {/* Messages Feed */}
        <div className="p-4 space-y-3 max-h-72 overflow-y-auto bg-[#FAFAF9]/60">
          {teamMessages.map((msg) => (
            <div
              key={msg.id}
              className="rounded-2xl border border-stone-200 bg-white p-3 space-y-1 shadow-xs"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-900">{msg.sender}</span>
                <span className="text-stone-400 font-mono text-[10px]">{msg.timestamp}</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                {msg.message}
              </p>
              {msg.mathTopic && (
                <div className="pt-1 flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  <span>Curriculum Link: {msg.mathTopic}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-stone-200 bg-white flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Jad about unit pricing or recipe yield math..."
            className="flex-1 rounded-xl border border-stone-300 px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-stone-50/40"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded-xl bg-[#223528] hover:bg-[#18261D] disabled:opacity-40 text-white px-4 py-2 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Transmit</span>
            <Send className="h-3 w-3" />
          </button>
        </form>
      </div>
    </div>
  );
};
