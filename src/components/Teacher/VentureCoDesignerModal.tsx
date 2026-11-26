'use client';

import React, { useState } from 'react';
import { useOmniMesh } from '../../context/SnackLabContext';
import { GradeBand, VentureBlueprint } from '../../types/venture';
import { detectUnsupportedMediaWarnings } from '../../lib/modelRouter';
import {
  X,
  Sparkles,
  BookOpen,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Copy,
} from 'lucide-react';

export const VentureCoDesignerModal: React.FC = () => {
  const {
    isCoDesignerOpen,
    setIsCoDesignerOpen,
    activeBlueprint,
    availableBlueprints,
    activateBlueprint,
    addAndActivateBlueprint,
  } = useOmniMesh();

  const [mode, setMode] = useState<'architect' | 'remix'>('architect');
  const [gradeBand, setGradeBand] = useState<GradeBand>('9-12');
  const [standards, setStandards] = useState<string>('');
  const [classHours, setClassHours] = useState<number>(12);
  const [localContext, setLocalContext] = useState<string>('');
  const [sourceNotes, setSourceNotes] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [draftBlueprint, setDraftBlueprint] = useState<VentureBlueprint | null>(null);
  const [mediaWarnings, setMediaWarnings] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isCoDesignerOpen) return null;

  const handleSourceChange = (val: string) => {
    setSourceNotes(val);
    setMediaWarnings(detectUnsupportedMediaWarnings(val));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const resp = await fetch('/api/blueprint/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gradeBand,
          standards,
          classHours,
          localContext,
          sourceNotes,
        }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.blueprint) {
        throw new Error(data.error || 'Could not generate blueprint');
      }
      setDraftBlueprint(data.blueprint);
      if (Array.isArray(data.warnings)) {
        setMediaWarnings(data.warnings);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleDraftMilestone = (levelNum: number) => {
    if (!draftBlueprint) return;
    setDraftBlueprint({
      ...draftBlueprint,
      milestones: draftBlueprint.milestones.map((m) =>
        m.levelNumber === levelNum ? { ...m, enabled: !m.enabled } : m
      ),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-[#FAF9F5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#223528] text-amber-300 flex items-center justify-center shadow-xs">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
                Venture Co-Designer
              </h2>
              <p className="text-xs text-stone-500">
                Active Unit: <strong className="text-slate-800">{activeBlueprint.title}</strong> ({activeBlueprint.gradeBand})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCoDesignerOpen(false)}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="px-6 py-3 bg-white border-b border-stone-100 flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setMode('architect')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              mode === 'architect'
                ? 'bg-[#223528] text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Guided Architect Mode</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('remix')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              mode === 'remix'
                ? 'bg-[#223528] text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Remix &amp; Upload Library ({availableBlueprints.length})</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FBFBF9]">
          {mediaWarnings.length > 0 && (
            <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 space-y-1.5 text-xs text-amber-950">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>Unsupported Media Validation Notice</span>
              </div>
              {mediaWarnings.map((w, i) => (
                <p key={i} className="leading-relaxed pl-6">
                  {w}
                </p>
              ))}
            </div>
          )}

          {mode === 'architect' ? (
            <div className="space-y-6">
              <form onSubmit={handleGenerate} className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 block">1. Grade Band</label>
                    <select
                      value={gradeBand}
                      onChange={(e) => setGradeBand(e.target.value as GradeBand)}
                      className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-slate-900"
                    >
                      <option value="3-5">Grades 3–5 (Upper Elementary)</option>
                      <option value="6-8">Grades 6–8 (Middle School)</option>
                      <option value="9-12">Grades 9–12 (High School)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 block">2. Available Class Hours</label>
                    <input
                      type="number"
                      min={2}
                      max={60}
                      value={classHours}
                      onChange={(e) => setClassHours(Number(e.target.value))}
                      className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">
                    3. Target Standards or Syllabus Outcomes
                  </label>
                  <input
                    type="text"
                    value={standards}
                    onChange={(e) => setStandards(e.target.value)}
                    placeholder="e.g., NGSS HS-LS2-7 Human Impact on Biodiversity, or IB Economics Supply & Demand"
                    className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">
                    4. Local Community Context &amp; Deliverable Audience
                  </label>
                  <input
                    type="text"
                    value={localContext}
                    onChange={(e) => setLocalContext(e.target.value)}
                    placeholder="e.g., Neighborhood bakery waste reduction presented to local municipal council"
                    className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">
                    Optional: Attach Readings / Lab Guide Excerpts for Specialist Persona
                  </label>
                  <textarea
                    rows={2}
                    value={sourceNotes}
                    onChange={(e) => handleSourceChange(e.target.value)}
                    placeholder="Paste reading text or lab guidelines (video links will trigger a validation warning)..."
                    className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-slate-900"
                  />
                </div>

                {errorMsg && <p className="text-rose-600 font-semibold">{errorMsg}</p>}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#223528] text-white font-bold hover:bg-[#18261D] disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    <span>{isGenerating ? 'Generating Validated Blueprint...' : 'Generate Venture Blueprint'}</span>
                  </button>
                </div>
              </form>

              {draftBlueprint && (
                <div className="bg-white rounded-2xl border-2 border-emerald-500/40 p-5 space-y-4 text-xs animate-in fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                    <div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        <CheckCircle2 className="h-3 w-3" />
                        Schema Validated JSON
                      </span>
                      <h3 className="font-serif text-base font-bold text-slate-900 mt-1">
                        {draftBlueprint.title}
                      </h3>
                      <p className="text-stone-600 mt-0.5">{draftBlueprint.drivingQuestion}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        addAndActivateBlueprint(draftBlueprint);
                        setIsCoDesignerOpen(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shrink-0 cursor-pointer"
                    >
                      Activate for Class
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="font-bold text-slate-800 block">Specialist Persona</span>
                      <span className="text-stone-600">
                        {draftBlueprint.specialistPersona.name} — {draftBlueprint.specialistPersona.roleTitle}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="font-bold text-slate-800 block">Rubric Criteria</span>
                      <span className="text-stone-600">
                        {draftBlueprint.rubric.map((r) => `${r.criterion} (${r.weightPct}%)`).join(' • ')}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-slate-800 block">
                      Milestone Arc (Toggle stages on/off)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {draftBlueprint.milestones.map((m) => (
                        <button
                          key={m.levelNumber}
                          type="button"
                          onClick={() => toggleDraftMilestone(m.levelNumber)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            m.enabled
                              ? 'bg-emerald-50/60 border-emerald-300 text-slate-900'
                              : 'bg-stone-100 border-stone-200 text-stone-400 line-through'
                          }`}
                        >
                          <div className="font-bold">
                            Stage {m.levelNumber}: {m.title}
                          </div>
                          <div className="text-[10px] text-stone-500">
                            Gate: {m.verificationGate} • {m.curriculumCode}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {availableBlueprints.map((bp) => {
                const isActive = bp.id === activeBlueprint.id;
                return (
                  <div
                    key={bp.id}
                    className={`bg-white rounded-2xl border p-5 space-y-3 text-xs ${
                      isActive ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-stone-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif text-base font-bold text-slate-900">{bp.title}</h3>
                          <span className="text-[10px] font-mono bg-stone-100 px-2 py-0.5 rounded-full text-stone-700">
                            Grades {bp.gradeBand}
                          </span>
                          {isActive && (
                            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-stone-600 mt-1">{bp.drivingQuestion}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          activateBlueprint(bp);
                          setIsCoDesignerOpen(false);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#223528] hover:bg-[#18261D] text-white font-bold shrink-0 cursor-pointer"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        <span>{isActive ? 'Active Unit' : 'Clone & Activate'}</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 text-[11px] text-stone-500">
                      <span>Specialist: <strong>{bp.specialistPersona.name}</strong></span>
                      <span>•</span>
                      <span>{bp.milestones.filter((m) => m.enabled).length} Milestones</span>
                      <span>•</span>
                      <span>{bp.estimatedHours} hrs</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
