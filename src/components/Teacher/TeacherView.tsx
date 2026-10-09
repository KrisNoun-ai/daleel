'use client';

import React, { useState } from 'react';
import { useOmniMesh } from '../../context/SnackLabContext';
import { LearnerCluster } from '../../types';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ComposedChart,
  Legend,
} from 'recharts';
import {
  Brain,
  Send,
  CheckCircle2,
  Users,
  User,
  Sparkles,
  TrendingUp,
  Activity,
  BookOpen,
  AlertTriangle,
  GraduationCap,
  Layers,
  Network,
  GitBranch,
  Filter,
  ArrowUpRight,
  Award,
  Zap,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Sliders,
  DollarSign,
} from 'lucide-react';

// 1. Class Distribution Across the 7 Enterprise Milestones
const MILESTONE_PROGRESS_DATA = [
  { milestone: 'L1 Research', students: 28, fullLabel: 'Level 1: Market Research', target: 28 },
  { milestone: 'L2 Nutrition', students: 28, fullLabel: 'Level 2: Nutrition Spec', target: 28 },
  { milestone: 'L3 Recipe Lab', students: 23, fullLabel: 'Level 3: Kitchen Formulation', target: 28 },
  { milestone: 'L4 Unit Cost', students: 3, fullLabel: 'Level 4: Unit Economics', target: 28 },
  { milestone: 'L5 Packaging', students: 2, fullLabel: 'Level 5: Moisture & Packaging', target: 28 },
  { milestone: 'L6 Batch Test', students: 0, fullLabel: 'Level 6: Taste Testing', target: 28 },
  { milestone: 'L7 Final Pitch', students: 0, fullLabel: 'Level 7: Investor Pitch', target: 28 },
];

// 2. Core Curriculum Standards Mastery
const SUBJECT_MASTERY_DATA = [
  { subject: 'Science & Fair Testing', mastery: 88, target: 80, standard: 'NGSS MS-PS1-2' },
  { subject: 'Unit Cost & Algebra', mastery: 74, target: 75, standard: 'CCSS.MATH.HSA' },
  { subject: 'Nutrition & Labeling', mastery: 92, target: 85, standard: 'FDA Standards' },
  { subject: 'Peer Collaboration', mastery: 85, target: 70, standard: 'Pod Reviews' },
];

// 3. 60-Minute Classroom Activity Flow
const CLASSROOM_FLOW_DATA = [
  { time: '0m', labWork: 15, collaboration: 10, teacherGuidance: 75 },
  { time: '15m', labWork: 65, collaboration: 20, teacherGuidance: 15 },
  { time: '30m', labWork: 75, collaboration: 20, teacherGuidance: 5 },
  { time: '45m', labWork: 70, collaboration: 25, teacherGuidance: 5 },
  { time: '60m', labWork: 40, collaboration: 45, teacherGuidance: 15 },
];

// 4. Recipe Lab Fair-Test Accuracy Across Batches
const TRIAL_ACCURACY_DATA = [
  { batch: 'Batch 01', fairTests: 12, flaggedDualVariables: 16 },
  { batch: 'Batch 02', fairTests: 19, flaggedDualVariables: 9 },
  { batch: 'Batch 03', fairTests: 24, flaggedDualVariables: 4 },
  { batch: 'Batch 04', fairTests: 26, flaggedDualVariables: 2 },
];

export const TeacherView: React.FC = () => {
  const {
    students,
    teacherViewMode,
    setTeacherViewMode,
    teacherDeepDiveStudent,
    setTeacherDeepDiveStudent,
    dispatchSocraticHint,
    isHintDispatched,
    scatterPoints,
    radarData,
    lastBatchLog,
    teacherCopilotMessages,
    sendTeacherCopilotMessageToGemini,
    isTeacherCopilotThinking,
    podNodes,
    resetDemoToViolation,
    resetDemoToValid,
    teacherHelpRequests,
    resolveTeacherHelp,
  } = useOmniMesh();

  const [copilotInput, setCopilotInput] = useState('');
  const [selectedClusterFilter, setSelectedClusterFilter] = useState<string>('all');
  const [rosterSearch, setRosterSearch] = useState<string>('');

  const targetStudent =
    students.find((s) => s.id === teacherDeepDiveStudent) || students[0];
  const hasViolation =
    lastBatchLog?.hasViolation && targetStudent.id === 'samir-haddad';

  const handleCopilotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotInput.trim() || isTeacherCopilotThinking) return;
    const txt = copilotInput;
    setCopilotInput('');
    await sendTeacherCopilotMessageToGemini(txt);
  };

  const filteredScatterPoints =
    selectedClusterFilter === 'all'
      ? scatterPoints
      : scatterPoints.filter((p) => p.cluster === selectedClusterFilter);

  const getClusterColor = (cluster: LearnerCluster) => {
    switch (cluster) {
      case 'Empirical Builders':
        return '#059669'; // Emerald
      case 'Algorithmic Modelers':
        return '#2563EB'; // Blue
      case 'Creative Catalysts':
        return '#9333EA'; // Purple
      case 'Systems Optimizers':
        return '#EA580C'; // Orange
      default:
        return '#64748B';
    }
  };

  // Longitudinal Batch Evolution for Student Deep Dive
  const longitudinalBatchData = [
    {
      batch: 'Batch 01',
      stage: 'Raw Baseline',
      grossMargin: 38,
      errorRisk: 52,
      sensoryScore: 6.2,
      notes: 'Uncontrolled sweetness variables',
    },
    {
      batch: 'Batch 02',
      stage: 'Thermal Isolation',
      grossMargin: 54,
      errorRisk: 32,
      sensoryScore: 7.4,
      notes: 'Temperature locked at 325°F',
    },
    {
      batch: 'Batch 03',
      stage: hasViolation ? 'Multivariate (Flagged)' : 'Fair Test (Clean)',
      grossMargin: hasViolation ? 62 : 71,
      errorRisk: hasViolation ? 48 : 8,
      sensoryScore: hasViolation ? 5.8 : 8.8,
      notes: hasViolation
        ? 'Altered sweetener & heat simultaneously'
        : 'Sweetener isolated; chewiness certified',
    },
    {
      batch: 'Batch 04',
      stage: 'Scale Production',
      grossMargin: 76,
      errorRisk: 4,
      sensoryScore: 9.3,
      notes: 'Optimized $0.88 cost, zero errors',
    },
  ];

  // Filter roster for the cohort table
  const filteredRoster = scatterPoints.filter((s) =>
    s.studentName.toLowerCase().includes(rosterSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-3 px-2 sm:px-0">
      {/* 1. Refined Teacher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-[#E8E6DF] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 font-mono">
              Daleel Faculty Studio
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18221B] mt-1">
            Teacher Dashboard
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time classroom progress, student lab trials, and curriculum standards mastery
          </p>
        </div>

        {/* Primary View Switcher */}
        <div className="flex items-center gap-1 rounded-2xl border border-stone-200 bg-stone-100 p-1 text-xs shadow-xs">
          <button
            type="button"
            onClick={() => setTeacherViewMode('overview')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
              teacherViewMode === 'overview'
                ? 'bg-[#223528] text-white shadow-xs font-bold'
                : 'text-stone-600 hover:text-slate-900'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Class Overview (28 Students)</span>
          </button>
          <button
            type="button"
            onClick={() => setTeacherViewMode('deep_dive')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
              teacherViewMode === 'deep_dive'
                ? 'bg-[#223528] text-white shadow-xs font-bold'
                : 'text-stone-600 hover:text-slate-900'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Student Deep Dive</span>
          </button>
        </div>
      </div>

      {/* Real-time Student Assistance Requests Ribbon */}
      {teacherHelpRequests.filter((r) => r.status === 'pending').length > 0 && (
        <div className="bg-amber-50/90 border-2 border-amber-300 rounded-3xl p-5 shadow-xs space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <h3 className="font-serif font-bold text-sm text-amber-950">
                Live Student Assistance Calls ({teacherHelpRequests.filter((r) => r.status === 'pending').length})
              </h3>
            </div>
            <span className="text-[10px] font-mono text-amber-800 uppercase tracking-wider font-semibold">
              Real-Time Push
            </span>
          </div>

          <div className="space-y-2">
            {teacherHelpRequests
              .filter((r) => r.status === 'pending')
              .map((req) => (
                <div
                  key={req.id}
                  className="bg-white/95 rounded-2xl p-3.5 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-xs text-slate-900">
                        {req.studentName}
                      </span>
                      <span className="text-[10px] font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                        {req.levelTitle}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {req.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed font-sans">
                      {req.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setTeacherViewMode('deep_dive');
                        setTeacherDeepDiveStudent(req.studentId);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#223528] text-white hover:bg-[#1b2b20] text-xs font-bold transition-all shadow-2xs cursor-pointer"
                    >
                      Inspect Workbench
                    </button>
                    <button
                      type="button"
                      onClick={() => dispatchSocraticHint()}
                      className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-950 hover:bg-amber-200 border border-amber-300 text-xs font-bold transition-all cursor-pointer"
                    >
                      Dispatch Hint
                    </button>
                    <button
                      type="button"
                      onClick={() => resolveTeacherHelp(req.id)}
                      className="px-2.5 py-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 text-xs font-medium transition-all cursor-pointer"
                      title="Mark as resolved"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 1: COHORT PREDICTIVE DATA MINING & TELEMETRY */}
      {/* ============================================================== */}
      {teacherViewMode === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Executive Analytics KPI Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs relative overflow-hidden">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">
                Active Cohort
              </span>
              <div className="text-2xl font-bold font-serif text-[#18221B] mt-1 flex items-baseline gap-2">
                28
                <span className="text-xs font-sans font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  Students
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">4 Collaborative Pod Teams</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs relative overflow-hidden">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">
                Pacing & Progress
              </span>
              <div className="text-2xl font-bold font-serif text-[#223528] mt-1 flex items-baseline gap-2">
                82%
                <span className="text-xs font-sans font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  On Track
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">23 formulating Level 3</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs relative overflow-hidden">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">
                Needs Guidance
              </span>
              <div className="text-2xl font-bold font-serif text-amber-700 mt-1 flex items-baseline gap-2">
                2
                <span className="text-xs font-sans font-medium text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-md">
                  Flagged
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">Dual-variable fair test alerts</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs relative overflow-hidden">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">
                Avg Formulation Score
              </span>
              <div className="text-2xl font-bold font-serif text-[#223528] mt-1 flex items-baseline gap-2">
                8.6
                <span className="text-xs font-sans font-medium text-stone-500">
                  / 10
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">Certified texture & nutrition</p>
            </div>
          </div>

          {/* ROW 1: PRACTICAL CLASSROOM PROGRESS & MASTERY GRAPHS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* GRAPH 1: STUDENT DISTRIBUTION ACROSS MILESTONES */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-800" />
                    <span>Student Progress Across Milestones</span>
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Distribution of 28 students across the 7 enterprise incubator levels
                  </p>
                </div>
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                  23 at Level 3
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={MILESTONE_PROGRESS_DATA}
                    margin={{ top: 10, right: 15, bottom: 20, left: -10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis
                      dataKey="milestone"
                      tick={{ fill: '#64748B', fontSize: 10 }}
                      interval={0}
                    />
                    <YAxis
                      domain={[0, 30]}
                      tick={{ fill: '#64748B', fontSize: 10 }}
                      unit=" sts"
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="rounded-xl border border-stone-200 bg-white p-2.5 shadow-md text-xs space-y-1">
                              <div className="font-bold text-slate-900">{data.fullLabel}</div>
                              <div className="text-emerald-800 font-semibold">
                                Active Students: <strong>{data.students} / 28</strong>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="students"
                      name="Students at Level"
                      fill="#223528"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-[11px] text-stone-500 flex items-center justify-between pt-2 border-t border-stone-100">
                <span>Current class focus: Level 3 Kitchen Formulation</span>
                <span className="font-semibold text-emerald-800">5 students advancing</span>
              </div>
            </div>

            {/* GRAPH 2: CORE SUBJECT STANDARDS MASTERY */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                    <Award className="h-4 w-4 text-emerald-800" />
                    <span>Curriculum Standards Mastery</span>
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Cohort average performance vs. grade-level proficiency benchmarks
                  </p>
                </div>
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  Class Avg: 84.8%
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={SUBJECT_MASTERY_DATA}
                    margin={{ top: 10, right: 15, bottom: 20, left: -10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis
                      dataKey="subject"
                      tick={{ fill: '#64748B', fontSize: 10 }}
                      interval={0}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fill: '#64748B', fontSize: 10 }}
                      unit="%"
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="rounded-xl border border-stone-200 bg-white p-2.5 shadow-md text-xs space-y-1">
                              <div className="font-bold text-slate-900">{data.subject}</div>
                              <div className="text-[10px] text-stone-400">{data.standard}</div>
                              <div className="text-emerald-800 font-semibold">
                                Class Mastery: <strong>{data.mastery}%</strong>
                              </div>
                              <div className="text-stone-500">
                                Target Standard: <strong>{data.target}%</strong>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar
                      dataKey="mastery"
                      name="Cohort Mastery %"
                      fill="#059669"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="target"
                      name="Proficiency Target %"
                      fill="#CBD5E1"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-[11px] text-stone-500 flex items-center justify-between pt-2 border-t border-stone-100">
                <span>Aligned to NGSS MS-PS1-2 and Common Core Algebra</span>
                <span className="font-semibold text-emerald-800">All Above Target</span>
              </div>
            </div>
          </div>

          {/* ROW 2: CLASSROOM LAB FLOW & FAIR-TEST ACCURACY */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* GRAPH 3: CLASSROOM TIME FLOW */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-emerald-800" />
                    <span>60-Minute Classroom Engagement Flow</span>
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Active kitchen formulating vs. peer collaboration vs. teacher guidance
                  </p>
                </div>
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  85% Hands-On
                </span>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={CLASSROOM_FLOW_DATA}
                    margin={{ top: 10, right: 15, bottom: 20, left: -15 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis
                      dataKey="time"
                      tick={{ fill: '#64748B', fontSize: 10 }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fill: '#64748B', fontSize: 10 }}
                      unit="%"
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="rounded-xl border border-stone-200 bg-white p-2.5 shadow-md text-xs space-y-1">
                              <div className="font-bold">Period Time: {data.time}</div>
                              <div className="text-emerald-700">Kitchen Experimentation: {data.labWork}%</div>
                              <div className="text-blue-700">Peer Collaboration: {data.collaboration}%</div>
                              <div className="text-stone-500">Teacher Guidance: {data.teacherGuidance}%</div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Area
                      type="monotone"
                      dataKey="labWork"
                      name="Kitchen Experimentation"
                      stackId="1"
                      stroke="#059669"
                      fill="#D1FAE5"
                    />
                    <Area
                      type="monotone"
                      dataKey="collaboration"
                      name="Peer Collaboration"
                      stackId="1"
                      stroke="#2563EB"
                      fill="#DBEAFE"
                    />
                    <Area
                      type="monotone"
                      dataKey="teacherGuidance"
                      name="Teacher Guidance"
                      stackId="1"
                      stroke="#78716C"
                      fill="#F5F5F4"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600">
                <p className="text-[11px] leading-relaxed">
                  <strong>Classroom Insight:</strong> Students spend over 40 continuous minutes engaged in active, hands-on food experimentation with near-zero lecture fatigue.
                </p>
              </div>
            </div>

            {/* GRAPH 4: FAIR-TEST ACCURACY ACROSS TRIALS */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-800" />
                    <span>Scientific Fair-Testing Accuracy</span>
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Students learning to isolate a single variable across recipe trials
                  </p>
                </div>
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  93% Success by Batch 4
                </span>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={TRIAL_ACCURACY_DATA}
                    margin={{ top: 10, right: 15, bottom: 20, left: -10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis
                      dataKey="batch"
                      tick={{ fill: '#64748B', fontSize: 10 }}
                    />
                    <YAxis
                      domain={[0, 28]}
                      tick={{ fill: '#64748B', fontSize: 10 }}
                      unit=" sts"
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="rounded-xl border border-stone-200 bg-white p-2.5 shadow-md text-xs space-y-1">
                              <div className="font-bold">{data.batch}</div>
                              <div className="text-emerald-700 font-semibold">
                                Correct Single-Variable Tests: {data.fairTests} students
                              </div>
                              <div className="text-amber-700 font-semibold">
                                Changed Multiple Variables: {data.flaggedDualVariables} students
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar
                      dataKey="fairTests"
                      name="Controlled Single-Variable Tests"
                      fill="#059669"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="flaggedDualVariables"
                      name="Changed Multiple Variables"
                      fill="#F59E0B"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600">
                <p className="text-[11px] leading-relaxed">
                  <strong>Learning Growth:</strong> By Batch 04, 26 out of 28 students instinctively isolate one variable at a time (holding oven temperature constant while adjusting sweetener).
                </p>
              </div>
            </div>
          </div>

          {/* ROW 3: 42-STYLE PEER-TO-PEER POD MESH DENSITY */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                  <Network className="h-4 w-4 text-emerald-800" />
                  <span>École 42 Peer-to-Peer Pod Mesh Density & Knowledge Transfer</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Real-time synchronization across 4 cross-disciplinary Grade 9 student pods
                </p>
              </div>
              <span className="text-[10px] font-mono bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-full font-bold">
                Zero Teacher Silos
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {podNodes.map((pod) => (
                <div
                  key={pod.podName}
                  className="p-4 rounded-2xl bg-[#FAFAF9] border border-stone-200/90 space-y-2 text-xs flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 line-clamp-1">{pod.podName}</span>
                      <span className="font-mono text-emerald-800 font-bold text-[11px]">
                        {pod.exchangeVelocity}%
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Lead: <strong className="text-slate-800">{pod.leadStudent}</strong> ({pod.membersCount} peers)
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#223528] rounded-full transition-all duration-500"
                        style={{ width: `${pod.exchangeVelocity}%` }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-1 text-[9px] text-stone-500 pt-1">
                      {pod.crossSubjectIntegrations.map((sub) => (
                        <span key={sub} className="bg-white border border-stone-200 px-1.5 py-0.5 rounded">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ROW 4: COHORT ROSTER & REAL-TIME ANOMALY RADAR (ALL 28 STUDENTS) */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-3 gap-3">
              <div>
                <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-800" />
                  <span>Grade 9 Cohort Telemetry Matrix (N=28 Lebanese Students)</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Click any student to inspect individual 360° radar and longitudinal batches
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={rosterSearch}
                  onChange={(e) => setRosterSearch(e.target.value)}
                  placeholder="Filter student name..."
                  className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs bg-stone-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-100 text-[10px] font-mono uppercase text-stone-400">
                    <th className="pb-2.5 font-semibold">Student</th>
                    <th className="pb-2.5 font-semibold">Learner Cluster</th>
                    <th className="pb-2.5 font-semibold">PE Stamina</th>
                    <th className="pb-2.5 font-semibold">Focus Mins</th>
                    <th className="pb-2.5 font-semibold">Peer Reviews</th>
                    <th className="pb-2.5 font-semibold">Telemetry Status</th>
                    <th className="pb-2.5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredRoster.map((s) => {
                    const isTarget = s.studentName === targetStudent.name;
                    const studentAnomaly =
                      s.studentName === 'Samir Haddad' && hasViolation;

                    return (
                      <tr
                        key={s.id}
                        className={`hover:bg-stone-50/80 transition-colors ${
                          isTarget ? 'bg-emerald-50/40 font-semibold' : ''
                        }`}
                      >
                        <td className="py-2.5 text-slate-900 flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: getClusterColor(s.cluster) }}
                          />
                          <span>{s.studentName}</span>
                          {isTarget && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 text-stone-600">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200">
                            {s.cluster}
                          </span>
                        </td>
                        <td className="py-2.5 font-mono text-slate-700">
                          {s.peStaminaIndex}/100
                        </td>
                        <td className="py-2.5 font-mono text-emerald-800">
                          {s.focusDurationMins} min
                        </td>
                        <td className="py-2.5 font-mono text-purple-700">
                          {s.peerReviews} reviews
                        </td>
                        <td className="py-2.5">
                          {studentAnomaly ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                              <AlertTriangle className="h-3 w-3" />
                              Fair Test Deviation
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="h-3 w-3" />
                              Optimal Mesh
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              const match = students.find((st) => st.name === s.studentName);
                              if (match) setTeacherDeepDiveStudent(match.id);
                              setTeacherViewMode('deep_dive');
                            }}
                            className="text-[11px] text-emerald-800 font-bold hover:underline cursor-pointer"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: STUDENT DEEP DIVE & LONGITUDINAL BATCH PROGRESS */}
      {/* ============================================================== */}
      {teacherViewMode === 'deep_dive' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Lebanese Student Selector Bar */}
          <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="font-serif font-bold text-slate-900 text-sm">
                Select Grade 9 Student to Inspect:
              </span>
              <span className="text-xs text-stone-500">
                Active Department: <strong className="text-slate-900">{targetStudent.department}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {students.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setTeacherDeepDiveStudent(s.id)}
                  className={`p-3 rounded-2xl text-left transition-all border cursor-pointer ${
                    teacherDeepDiveStudent === s.id
                      ? 'bg-[#223528] text-white border-[#223528] shadow-xs'
                      : 'bg-white hover:bg-stone-50 text-slate-800 border-stone-200'
                  }`}
                >
                  <span className="font-serif font-bold text-xs block">
                    {s.name}
                  </span>
                  <span
                    className={`text-[10px] block mt-0.5 line-clamp-1 ${
                      teacherDeepDiveStudent === s.id ? 'text-stone-300' : 'text-stone-500'
                    }`}
                  >
                    {s.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* DUAL DIAGNOSTIC GRAPHS: 360 RADAR & LONGITUDINAL BATCH MARGIN */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* GRAPH 5: 360° SKILL HEXAGRAM */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-900">
                    360° Multidisciplinary Skill Hexagram
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    {targetStudent.name} (Green) vs. Cohort Average (Dashed Slate)
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {targetStudent.cluster}
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis
                      dataKey="axis"
                      tick={{ fill: '#334155', fontSize: 10, fontWeight: 600 }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#CBD5E1" />
                    <Radar
                      name={targetStudent.name}
                      dataKey="studentScore"
                      stroke="#059669"
                      strokeWidth={2.5}
                      fill="#059669"
                      fillOpacity={0.25}
                    />
                    <Radar
                      name="Cohort Average"
                      dataKey="classAverage"
                      stroke="#64748B"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      fill="#64748B"
                      fillOpacity={0.05}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                <span>Empirical Variable Isolation:</span>
                <span className="font-mono font-bold text-slate-900">
                  {hasViolation ? '58% (Flagged Multivariate)' : '94% (Mastered)'}
                </span>
              </div>
            </div>

            {/* GRAPH 6: LONGITUDINAL BATCH MARGIN & ERROR RISK CURVE */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-800" />
                    <span>Longitudinal Batch Evolution: Margin vs. Error Risk</span>
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Gross Margin % expansion as scientific trial errors collapse (Batches 01 to 04)
                  </p>
                </div>
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  Unit Econ + Science
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={longitudinalBatchData}
                    margin={{ top: 10, right: 15, bottom: 20, left: -10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis
                      dataKey="batch"
                      tick={{ fill: '#64748B', fontSize: 10 }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fill: '#64748B', fontSize: 10 }}
                      unit="%"
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="rounded-xl border border-stone-200 bg-white p-2.5 shadow-md text-xs space-y-1">
                              <div className="font-bold text-slate-900">{data.batch} • {data.stage}</div>
                              <div className="text-emerald-800 font-semibold">
                                Gross Margin: <strong>{data.grossMargin}%</strong>
                              </div>
                              <div className="text-rose-600 font-semibold">
                                Variable Error Risk: <strong>{data.errorRisk}%</strong>
                              </div>
                              <div className="text-stone-500 text-[10px]">
                                Sensory Score: {data.sensoryScore}/10 • {data.notes}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                    <Bar
                      dataKey="grossMargin"
                      name="Gross Margin %"
                      fill="#059669"
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      type="monotone"
                      dataKey="errorRisk"
                      name="Variable Error Risk %"
                      stroke="#DC2626"
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                <span>Direct proof: Rigorous variable isolation drives product margin to 71%</span>
                <span className="font-mono font-bold text-emerald-800">C(x) = $0.88/bar</span>
              </div>
            </div>
          </div>

          {/* DIAGNOSTIC SYNTHESIS & REAL-TIME PRESCRIPTION CARD */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-emerald-800" />
                <h3 className="font-serif text-base font-bold text-slate-900">
                  Predictive Diagnostic Synthesis & Algorithmic Prescriptions
                </h3>
              </div>
              <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                Live Relational Event
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Status Flag */}
              <div
                className={`p-4 rounded-2xl border ${
                  hasViolation
                    ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                    : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  {hasViolation ? (
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  )}
                  <span>
                    {hasViolation
                      ? 'Bottleneck: Fair Test Violation'
                      : 'Scientific Inquiry Verified'}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed mt-1">
                  {hasViolation
                    ? `Samir changed both Sweetener (Honey -> Date Paste) and Oven Temperature (325°F -> 350°F) simultaneously in Batch 03. Analytical focus dropped after 20 mins.`
                    : `Controlled single-variable inquiry maintained. Samir isolated the sweetener while holding 325°F constant. Focus stamina sustained for 52 mins.`}
                </p>
              </div>

              {/* 42-Mesh Reciprocity */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-stone-700 space-y-1">
                <strong className="block text-slate-900 font-semibold">
                  42-Style Peer Mesh Dynamics:
                </strong>
                <p className="text-[11px] leading-relaxed">
                  {targetStudent.name} has completed <strong>{targetStudent.peerReviewsCompleted} peer reviews</strong> with a collaborative velocity of <strong>{targetStudent.collaborativeVelocity}%</strong> across Grade 9 pods.
                </p>
                <span className="text-[10px] text-stone-400 block pt-1">
                  Pod Partner: Jad Mansour (Unit Economics Lead)
                </span>
              </div>

              {/* Algorithmic Nudge Recommendation */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 text-blue-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <Brain className="h-3.5 w-3.5 text-blue-700" />
                  <span>Pedagogical Recommendation (Confidence: 94%)</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Trigger peer-guided unit-costing handoff. Matching {targetStudent.name} with <strong>Leo Santos</strong> for variable isolation will reduce predictive dropout hazard by <strong>42%</strong> and optimize bar margin by <strong>+$0.12</strong>.
                </p>
              </div>
            </div>

            {/* Socratic Hint Dispatch Button */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-500">
                {isHintDispatched ? 'Socratic Guidance Dispatched to Samir\'s Workbench.' : 'Teacher Intervention:'}
              </span>
              <button
                type="button"
                onClick={dispatchSocraticHint}
                disabled={isHintDispatched}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#223528] text-white text-xs font-bold hover:bg-[#18261D] disabled:opacity-50 transition-colors cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>
                  {isHintDispatched ? 'Guidance Dispatched' : 'Dispatch Socratic Note to Student'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. FACULTY DIAGNOSTIC INQUIRY DESK */}
      {/* ============================================================== */}
      <section className="bg-white rounded-3xl border border-stone-200 shadow-md p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-4 gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#223528] text-amber-300 shadow-xs">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Faculty Diagnostic Inquiry Desk
                </h3>
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Cohort Telemetry
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Inquire about cohort cognitive stamina correlations, cross-pod handoffs, or individual learner trajectories
              </p>
            </div>
          </div>

          <div className="text-xs text-stone-500 sm:text-right">
            <span>Context: <strong>Grade 9 Cohort & {targetStudent.name}</strong></span>
          </div>
        </div>

        {/* Message Stream */}
        <div className="h-64 overflow-y-auto p-4 rounded-2xl bg-[#FCFCFA] border border-stone-200/80 space-y-3 text-xs">
          {teacherCopilotMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[10px] font-semibold text-stone-400">
                <span>{msg.sender === 'user' ? 'Faculty Lead' : 'Diagnostic Desk'}</span>
                <span>• {msg.timestamp}</span>
              </div>
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-2xs whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-[#223528] text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-stone-200 rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTeacherCopilotThinking && (
            <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-stone-200 text-xs text-stone-500">
              <Sparkles className="h-4 w-4 text-emerald-600 animate-spin" />
              <span>Consulting cohort data mining archives and longitudinal metrics...</span>
            </div>
          )}
        </div>

        {/* Prompt Suggestions */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] pt-1">
          <button
            type="button"
            onClick={() =>
              sendTeacherCopilotMessageToGemini(
                'Explain the financial ROI of the 42-style peer mesh vs. traditional lecture.'
              )
            }
            className="whitespace-nowrap px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors font-medium cursor-pointer"
          >
            Explain financial ROI of peer mesh
          </button>
          <button
            type="button"
            onClick={() =>
              sendTeacherCopilotMessageToGemini(
                'Predict the dropout probability if we don\'t intervene at the 25-minute cognitive threshold.'
              )
            }
            className="whitespace-nowrap px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors font-medium cursor-pointer"
          >
            Analyze 25-min cognitive threshold
          </button>
          <button
            type="button"
            onClick={() =>
              sendTeacherCopilotMessageToGemini(
                `Generate a cross-functional intervention plan for ${targetStudent.name} combining PE stamina and Math.`
              )
            }
            className="whitespace-nowrap px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors font-medium cursor-pointer"
          >
            Cross-functional intervention plan
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleCopilotSubmit} className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={copilotInput}
            onChange={(e) => setCopilotInput(e.target.value)}
            placeholder={`Inquire about ${targetStudent.name}'s stamina index or pod handoffs...`}
            className="flex-1 px-4 py-2.5 rounded-2xl border border-stone-200 bg-[#FAFAF9] text-xs text-slate-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#223528]"
          />
          <button
            type="submit"
            disabled={!copilotInput.trim() || isTeacherCopilotThinking}
            className="flex items-center justify-center h-10 w-10 rounded-2xl bg-[#223528] text-white hover:bg-[#18261D] disabled:opacity-40 transition-colors shadow-xs cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </section>
    </div>
  );
};
