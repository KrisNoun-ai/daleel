'use client';

import React from 'react';
import { useOmniMesh } from '../../context/SnackLabContext';
import {
  X,
  Network,
  GitBranch,
  ShieldCheck,
  GraduationCap,
  Compass,
  CheckCircle2,
  TrendingUp,
  Brain,
  Award,
  Layers,
  Sparkles,
} from 'lucide-react';

export const ProjectOverviewModal: React.FC = () => {
  const { isArchitectureModalOpen, setIsArchitectureModalOpen } = useOmniMesh();

  if (!isArchitectureModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#FBFBF9] border border-stone-200 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-stone-200/90 bg-white/95 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#223528] text-amber-200 shadow-sm border border-amber-500/30">
              <span className="font-serif text-lg font-bold">د</span>
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Daleel Architecture & Project Guide
              </h3>
              <p className="text-xs text-stone-500">
                Secondary Project-Based Learning • Strict Relational State Architecture
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsArchitectureModalOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs text-slate-800">
          {/* 1. Core Thesis Card */}
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-emerald-700" />
              <span>Core Technological Thesis</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-700">
              Daleel proves that high school education should not be fragmented into isolated subject silos or graded with punitive letter scores. By immersing students in a real food incubator company, curriculum standards across <strong>Physical Science (NGSS)</strong>, <strong>Linear Algebra (CCSS)</strong>, and <strong>Cardiovascular Physiology (PE)</strong> are naturally co-dependent and self-reinforcing.
            </p>
          </div>

          {/* 2. Strict Relational Data Flow Diagram */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
            <h4 className="font-serif text-sm font-bold text-slate-900 flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-emerald-800" />
              <span>The Relational Ripple Architecture (Zero Isolated Mockups)</span>
            </h4>
            <p className="text-[11px] text-stone-500">
              A single classroom event ripples concurrently across three audience translations:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-[#FAFAF9] border border-stone-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <Compass className="h-4 w-4" />
                  <span>1. Student Action (Lab Event)</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Samir alters both Date Paste and Temperature (350°F) simultaneously in Level 3 test kitchen and logs Batch 03.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <GraduationCap className="h-4 w-4 text-blue-700" />
                  <span>2. Teacher Output (Data Mining)</span>
                </div>
                <p className="text-[11px] text-blue-950 leading-relaxed">
                  K-Means scatter plot flags a focus dip after 20 mins seated math; diagnostic desk generates peer prescription with Jad Mansour.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <ShieldCheck className="h-4 w-4 text-amber-700" />
                  <span>3. Parent Output (Narrative Growth)</span>
                </div>
                <p className="text-[11px] text-amber-950 leading-relaxed">
                  Translated into plain English: &ldquo;Samir is learning single-variable isolation. Tonight ask him why 325°F is locked.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* 3. The École 42 Pod Architecture */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
            <h4 className="font-serif text-sm font-bold text-slate-900 flex items-center gap-2">
              <Network className="h-4 w-4 text-emerald-800" />
              <span>Autonomous Peer Mesh Dynamics (Inspired by École 42)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <strong className="block text-slate-900 font-semibold">Zero Teacher Bottlenecks</strong>
                <p className="text-stone-600">
                  Students review each other&apos;s trial data before batch submission, maintaining 96.4% peer consensus.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <strong className="block text-slate-900 font-semibold">Agile Incubator Pods</strong>
                <p className="text-stone-600">
                  4 agile squads across 28 Grade 9 students: Operations, Unit Costing, Creative Packaging, and Sensory QA.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <strong className="block text-slate-900 font-semibold">Predictive Anomaly Mining</strong>
                <p className="text-stone-600">
                  Cognitive fatigue hazard modeling detects disengagement at minute 25, dispatching peer interventions proactively.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Unit Economics & ROI */}
          <div className="p-5 rounded-2xl bg-[#223528] text-white shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-serif text-sm font-bold text-amber-200">
                Student Enterprise Unit Economics
              </span>
              <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-stone-200">
                Batch Scale Model
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
              <div>
                <span className="block text-stone-400 text-[10px] uppercase">Raw Cost / Bar</span>
                <strong className="text-base text-white font-mono">$0.88</strong>
              </div>
              <div>
                <span className="block text-stone-400 text-[10px] uppercase">Retail Target</span>
                <strong className="text-base text-white font-mono">$2.75</strong>
              </div>
              <div>
                <span className="block text-stone-400 text-[10px] uppercase">Gross Margin</span>
                <strong className="text-base text-emerald-400 font-mono">68.0%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
