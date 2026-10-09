'use client';

import React, { useState } from 'react';
import { useOmniMesh } from '../../context/SnackLabContext';
import { Compass, X, Send, Lightbulb, Sparkles } from 'lucide-react';

export const SocraticSlideOver: React.FC = () => {
  const {
    student,
    isSocraticDrawerOpen,
    setIsSocraticDrawerOpen,
    socraticMessages,
    sendSocraticMessageToGemini,
    isGeminiThinking,
    markSocraticAsRead,
  } = useOmniMesh();

  const [input, setInput] = useState<string>('');

  if (!isSocraticDrawerOpen) return null;

  const handleClose = () => {
    markSocraticAsRead();
    setIsSocraticDrawerOpen(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGeminiThinking) return;
    const txt = input;
    setInput('');
    await sendSocraticMessageToGemini(txt);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-stone-200 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2E4034] text-white shadow-xs">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-slate-900">Socratic Inquiry Desk</h3>
                <p className="text-[10px] font-mono text-emerald-800 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Interactive Guidance • {student.name}</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-slate-700 hover:bg-stone-200/60 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Curriculum Learning Alert */}
          <div className="px-5 py-3 bg-emerald-50/70 border-b border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-2">
            <Lightbulb className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              <strong>Science Standard (NGSS MS-PS1-2):</strong> In controlled experiments, isolate exactly ONE independent variable. If you change two variables at once, you cannot attribute the outcome!
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-[#FAFAF9]/50">
            {socraticMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-semibold text-stone-400">
                    {msg.sender === 'user' ? `${student.name.split(' ')[0]} (You)` : 'Socratic Coach'}
                  </span>
                  <span className="text-[9px] text-stone-300">• {msg.timestamp}</span>
                </div>
                <div
                  className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed max-w-[90%] shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#2E4034] text-white rounded-br-xs'
                      : msg.isDispatchedHint
                      ? 'bg-amber-50 text-amber-950 border border-amber-200 rounded-bl-xs font-medium'
                      : 'bg-white text-slate-800 border border-stone-200 rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isGeminiThinking && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-stone-200 text-xs text-stone-500">
                <Sparkles className="h-4 w-4 text-emerald-600 animate-spin" />
                <span>Formulating socratic guidance...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-4 border-t border-stone-200 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question or explain your hypothesis..."
                disabled={isGeminiThinking}
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-stone-50/50"
              />
              <button
                type="submit"
                disabled={isGeminiThinking || !input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#223528] text-white disabled:opacity-40 hover:bg-[#18261D] transition-colors cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
