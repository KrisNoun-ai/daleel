'use client';

import React, { useState } from 'react';
import { useOmniMesh } from '../../context/SnackLabContext';
import { CandyLevel, SweetenerType } from '../../types';
import {
  X,
  Compass,
  Send,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  FlaskConical,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Calculator,
  Smile,
  Shield,
  Palette,
  Mic,
  Sliders,
  Hand,
} from 'lucide-react';

interface LevelWorkbenchModalProps {
  level: CandyLevel;
  isOpen: boolean;
  onClose: () => void;
}

export const LevelWorkbenchModal: React.FC<LevelWorkbenchModalProps> = ({
  level,
  isOpen,
  onClose,
}) => {
  const {
    student,
    sweetener,
    setSweetener,
    tempF,
    setTempF,
    ruleChecked,
    setRuleChecked,
    lastBatchLog,
    logBatch,
    resetDemoToViolation,
    resetDemoToValid,
    socraticMessages,
    sendSocraticMessageToGemini,
    isGeminiThinking,
    setIsTeamDispatchOpen,
    requestTeacherHelp,
  } = useOmniMesh();

  const [inputQuestion, setInputQuestion] = useState('');

  // Interactive local states for other levels
  const [level1Segment, setLevel1Segment] = useState<'athletes' | 'vegetarians' | 'busy_students'>('athletes');
  const [level2Oats, setLevel2Oats] = useState(180);
  const [level4Chewiness, setLevel4Chewiness] = useState(8.5);
  const [level5BatchSize, setLevel5BatchSize] = useState(100);
  const [level6WrapperTheme, setLevel6WrapperTheme] = useState<'sage' | 'amber' | 'berry'>('sage');

  if (!isOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim() || isGeminiThinking) return;
    const text = inputQuestion;
    setInputQuestion('');
    await sendSocraticMessageToGemini(text);
  };

  const isMultivariate = sweetener !== 'Honey' && tempF !== 325;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#FBFBF9] border border-stone-200 shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-stone-200/90 bg-white/95 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${level.bgGradient} text-white font-black text-xl shadow-md border-2 border-white`}
            >
              {level.levelNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  {level.title}
                </h3>
                <span className="text-[11px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Level {level.levelNumber} of 7
                </span>
              </div>
              <p className="text-xs text-stone-500">{level.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => requestTeacherHelp()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="Request Dr. Wissam Sammouri assistance"
            >
              <Hand className="h-3.5 w-3.5 text-rose-600" />
              <span>Teacher Help</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Curriculum Standard Ribbon */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded">
                    {level.curriculumCode}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    {level.curriculumTopic}
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-1">
                  <strong>Key Scientific Inquiry:</strong> &ldquo;{level.keyQuestion}&rdquo;
                </p>
              </div>
            </div>
            <div className="text-right text-[11px] text-stone-500 sm:border-l sm:border-stone-200 sm:pl-4">
              <span>Task: <strong>{level.realWorldTask}</strong></span>
            </div>
          </div>

          {/* Dual Panel Layout: Interactive Activity (Left) + Gemini Socratic Dialog (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Interactive Mission Tool (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h4 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-emerald-700" />
                    <span>In-App Mission Tool: {level.inAppTool}</span>
                  </h4>
                  <span className="text-[11px] font-mono text-stone-500">
                    Active Student: <strong>{student.name.split(' ')[0]}</strong>
                  </span>
                </div>

                {/* LEVEL 3 WORKBENCH (The Fair Test Lab) */}
                {level.levelNumber === 3 && (
                  <div className="space-y-5">
                    {/* Fair test deviation notice */}
                    {isMultivariate && (
                      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-semibold">
                            Fair Test Deviation Detected (2 Variables Changed)
                          </strong>
                          <span>
                            You altered Sweetener (Honey → {sweetener}) and Temperature (325°F → {tempF}°F) simultaneously.
                            In physical science, you cannot isolate which variable caused the texture change!
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Step A: Sweetener Variable */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Variable A: Binder & Sweetener Chemistry
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setSweetener('Honey')}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            sweetener === 'Honey'
                              ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                              : 'border-stone-200 hover:border-stone-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">Raw Wild Honey</span>
                            {sweetener === 'Honey' && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                          </div>
                          <p className="text-[10px] text-stone-500 mt-1">
                            Standard baseline. High in monosaccharides; hygroscopic moisture attraction.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSweetener('Date Paste')}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            sweetener === 'Date Paste'
                              ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                              : 'border-stone-200 hover:border-stone-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">Organic Date Paste</span>
                            {sweetener === 'Date Paste' && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                          </div>
                          <p className="text-[10px] text-stone-500 mt-1">
                            Experimental variable. High soluble pectin & cellulose fiber matrix.
                          </p>
                        </button>
                      </div>
                    </div>

                    {/* Step B: Thermal Kinetic Slider */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <Flame className="h-3.5 w-3.5 text-orange-500" />
                          <span>Controlled Parameter: Oven Temperature</span>
                        </label>
                        <span className="font-mono font-bold text-slate-900 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                          {tempF}°F {tempF === 325 ? '(Fair Test Constant)' : '(Variable Altered!)'}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="300"
                        max="375"
                        step="25"
                        value={tempF}
                        onChange={(e) => setTempF(Number(e.target.value))}
                        className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                      />
                      <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                        <span>300°F (Under-baked)</span>
                        <span className="font-bold text-emerald-700">325°F (Controlled Baseline)</span>
                        <span>350°F (High Maillard)</span>
                        <span>375°F (Caramelized)</span>
                      </div>
                    </div>

                    {/* Step C: Rule Checkbox */}
                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200/80 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={ruleChecked}
                        onChange={(e) => setRuleChecked(e.target.checked)}
                        className="h-4 w-4 rounded border-stone-300 text-emerald-700 focus:ring-emerald-500"
                      />
                      <span className="text-stone-700">
                        I certify I am following NGSS MS-PS1-2 by holding rolled oats (180g) and bake time (18 mins) constant.
                      </span>
                    </label>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={resetDemoToViolation}
                          className="px-3 py-1.5 rounded-lg border border-stone-300 text-[11px] font-medium text-stone-600 hover:bg-stone-50 transition-colors"
                        >
                          Simulate 2-Variable Flaw
                        </button>
                        <button
                          type="button"
                          onClick={resetDemoToValid}
                          className="px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 transition-colors"
                        >
                          Simulate Controlled Fair Test
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={logBatch}
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#223528] text-white text-xs font-bold shadow-xs hover:bg-[#18261D] transition-colors cursor-pointer"
                      >
                        <FlaskConical className="h-3.5 w-3.5" />
                        <span>Log Batch Trial</span>
                      </button>
                    </div>

                    {/* Batch Log Output */}
                    {lastBatchLog && (
                      <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800">
                            Latest Log: {lastBatchLog.batchId} ({lastBatchLog.sweetener} @ {lastBatchLog.tempF}°F)
                          </span>
                          <span
                            className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              lastBatchLog.hasViolation
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            }`}
                          >
                            {lastBatchLog.hasViolation ? 'VIOLATION' : 'FAIR TEST PASS'}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600">{lastBatchLog.scienceObservation}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* LEVEL 1 WORKBENCH */}
                {level.levelNumber === 1 && (
                  <div className="space-y-4 text-xs">
                    <p className="text-stone-600">Select target customer persona from your survey data:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {(['athletes', 'vegetarians', 'busy_students'] as const).map((seg) => (
                        <button
                          key={seg}
                          type="button"
                          onClick={() => setLevel1Segment(seg)}
                          className={`p-3 rounded-xl border text-center font-bold capitalize transition-all ${
                            level1Segment === seg
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600'
                              : 'border-stone-200 bg-white text-stone-700'
                          }`}
                        >
                          {seg.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                      <strong className="block text-slate-900">Validated Persona Card:</strong>
                      <p className="text-stone-600 text-[11px]">
                        Target segment: <strong>{level1Segment.toUpperCase()}</strong>. Core demand: 12g sustained plant protein, low glycemic index, zero artificial binders.
                      </p>
                    </div>
                  </div>
                )}

                {/* LEVEL 2 WORKBENCH */}
                {level.levelNumber === 2 && (
                  <div className="space-y-4 text-xs">
                    <div className="space-y-2">
                      <div className="flex justify-between font-semibold">
                        <span>Rolled Oats Base:</span>
                        <span className="font-mono text-emerald-800">{level2Oats}g</span>
                      </div>
                      <input
                        type="range"
                        min="120"
                        max="240"
                        value={level2Oats}
                        onChange={(e) => setLevel2Oats(Number(e.target.value))}
                        className="w-full h-2 bg-stone-200 rounded-lg accent-emerald-700"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                      <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                        <span className="block text-stone-400">Protein</span>
                        <strong className="text-slate-800">{(level2Oats * 0.13).toFixed(1)}g</strong>
                      </div>
                      <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                        <span className="block text-stone-400">Dietary Fiber</span>
                        <strong className="text-slate-800">{(level2Oats * 0.10).toFixed(1)}g</strong>
                      </div>
                      <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                        <span className="block text-stone-400">Estimated aw</span>
                        <strong className="text-emerald-700">0.56 aw</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* LEVEL 4 WORKBENCH */}
                {level.levelNumber === 4 && (
                  <div className="space-y-4 text-xs">
                    <p className="text-stone-600">Blind taste test score out of 10 from 10 peer tasters:</p>
                    <div className="space-y-2">
                      <div className="flex justify-between font-semibold">
                        <span>Chewiness & Moisture Score:</span>
                        <span className="font-mono text-emerald-800">{level4Chewiness} / 10</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="10"
                        step="0.5"
                        value={level4Chewiness}
                        onChange={(e) => setLevel4Chewiness(Number(e.target.value))}
                        className="w-full h-2 bg-stone-200 rounded-lg accent-emerald-700"
                      />
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px]">
                      <strong>Microbiological Check:</strong> Water activity test registers at <strong>0.58 aw</strong> (Below 0.60 safety threshold; zero mold proliferation risk).
                    </div>
                  </div>
                )}

                {/* LEVEL 5 WORKBENCH */}
                {level.levelNumber === 5 && (
                  <div className="space-y-4 text-xs">
                    <div className="space-y-2">
                      <div className="flex justify-between font-semibold">
                        <span>Production Batch Scale (x):</span>
                        <span className="font-mono text-emerald-800">{level5BatchSize} snack bars</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="200"
                        step="10"
                        value={level5BatchSize}
                        onChange={(e) => setLevel5BatchSize(Number(e.target.value))}
                        className="w-full h-2 bg-stone-200 rounded-lg accent-emerald-700"
                      />
                    </div>
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 font-mono text-slate-800 space-y-1">
                      <div className="flex justify-between">
                        <span>Linear Equation C(x):</span>
                        <strong className="text-slate-900">C(x) = $15.00 + 0.72(x)</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Production Cost:</span>
                        <strong>${(15 + 0.72 * level5BatchSize).toFixed(2)}</strong>
                      </div>
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Effective Cost Per Bar:</span>
                        <span>${((15 + 0.72 * level5BatchSize) / level5BatchSize).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* LEVEL 6 WORKBENCH */}
                {level.levelNumber === 6 && (
                  <div className="space-y-4 text-xs">
                    <p className="text-stone-600">Select biodegradable wrapper aesthetic palette:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {(['sage', 'amber', 'berry'] as const).map((pal) => (
                        <button
                          key={pal}
                          type="button"
                          onClick={() => setLevel6WrapperTheme(pal)}
                          className={`p-3 rounded-xl border font-bold capitalize transition-all ${
                            level6WrapperTheme === pal
                              ? 'border-emerald-700 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-700'
                              : 'border-stone-200 bg-white text-stone-600'
                          }`}
                        >
                          {pal} Eco
                        </button>
                      ))}
                    </div>
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-800 to-stone-900 text-white shadow-md text-center py-6">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400">
                        Daleel Prototype Wrapper
                      </span>
                      <h5 className="font-serif text-xl font-bold tracking-tight mt-1">TRAILSPARK BIO-BAR</h5>
                      <p className="text-[10px] text-stone-300 mt-0.5">
                        Clean Plant Fuel • Zero Added Cane Sugar • 12g Protein
                      </p>
                    </div>
                  </div>
                )}

                {/* LEVEL 7 WORKBENCH */}
                {level.levelNumber === 7 && (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                      <strong className="text-slate-900 block">Investor Pitch Outline:</strong>
                      <ol className="list-decimal list-inside space-y-1 text-stone-600 text-[11px]">
                        <li>Customer Problem: Classmate survey revealed 76% desire low-sugar bars.</li>
                        <li>Scientific Rigor: Controlled fair test proved date paste retains 0.58 aw moisture.</li>
                        <li>Unit Economics: Scaled cost of $0.88 enables 68% gross margin at $2.75 retail.</li>
                      </ol>
                    </div>
                    <button
                      type="button"
                      onClick={() => sendSocraticMessageToGemini("Act as a tough venture capital investor evaluating our snack bar startup. Ask me one challenging question about our ingredient costs and science.")}
                      className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors text-xs flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Simulate Investor Pitch Defense</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Socratic Mentor Desk (5 cols) */}
            <div className="lg:col-span-5 flex flex-col h-[520px] rounded-2xl bg-white border border-stone-200 shadow-xs overflow-hidden">
              {/* Chat Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 bg-stone-50/80">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#223528] text-white">
                    <Compass className="h-4 w-4 text-emerald-300" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Socratic Mentor Desk</h5>
                    <span className="text-[10px] font-mono text-emerald-800 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Active • Scientific Inquiry Guide</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FCFCFA]">
                {socraticMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#223528] text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-stone-200 shadow-2xs rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-stone-400 mt-1 px-1">{msg.timestamp}</span>
                  </div>
                ))}

                {isGeminiThinking && (
                  <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-stone-200 text-xs text-stone-500">
                    <Sparkles className="h-4 w-4 text-emerald-600 animate-spin" />
                    <span>Formulating socratic guidance...</span>
                  </div>
                )}
              </div>

              {/* Quick Prompt Chips */}
              <div className="px-3 py-2 bg-stone-50/90 border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto text-[10px]">
                <button
                  type="button"
                  onClick={() =>
                    sendSocraticMessageToGemini('Why is changing only one variable essential in science?')
                  }
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-emerald-800 hover:border-emerald-300 transition-colors"
                >
                  Fair test rule?
                </button>
                <button
                  type="button"
                  onClick={() =>
                    sendSocraticMessageToGemini('What is the difference between date paste and honey?')
                  }
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-emerald-800 hover:border-emerald-300 transition-colors"
                >
                  Pectin vs Sugar?
                </button>
                <button
                  type="button"
                  onClick={() =>
                    sendSocraticMessageToGemini('How does water activity keep food safe without preservatives?')
                  }
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-emerald-800 hover:border-emerald-300 transition-colors"
                >
                  Water activity aw?
                </button>
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 border-t border-stone-200 bg-white flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputQuestion}
                  onChange={(e) => setInputQuestion(e.target.value)}
                  placeholder="Ask your Socratic coach anything..."
                  className="flex-1 text-xs px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-stone-50/50"
                  disabled={isGeminiThinking}
                />
                <button
                  type="submit"
                  disabled={isGeminiThinking || !inputQuestion.trim()}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#223528] text-white disabled:opacity-40 hover:bg-[#18261D] transition-colors cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
