'use client';

import React from 'react';
import { useDaleel } from '../../context/DaleelContext';
import { MilestoneStage } from '../../types/venture';
import { Star, Check, ChevronRight, Play } from 'lucide-react';

interface CandyCrushMapProps {
  onSelectMilestone: (milestone: MilestoneStage) => void;
}

export const CandyCrushMap: React.FC<CandyCrushMapProps> = ({ onSelectMilestone }) => {
  const {
    activeBlueprint,
    selectedLevelNumber,
    activeStudent,
    completedLevelsByStudent,
  } = useDaleel();

  const milestones = activeBlueprint.milestones.filter((m) => m.enabled);
  const completedLevels = completedLevelsByStudent[activeStudent.id] || [];

  const getMeanderOffset = (index: number) => {
    const offsets = [
      'translate-x-0',
      'translate-x-4 sm:translate-x-32',
      'translate-x-6 sm:translate-x-48',
      'translate-x-2 sm:translate-x-20',
      '-translate-x-4 sm:-translate-x-24',
      '-translate-x-2 sm:-translate-x-8',
      'translate-x-5 sm:translate-x-36',
    ];
    return offsets[index % offsets.length];
  };

  const getCandyColors = (colorName: string) => {
    switch (colorName) {
      case 'blue':
        return { gradient: 'from-[#38BDF8] via-[#0284C7] to-[#0369A1]', glow: 'shadow-[0_12px_24px_rgba(2,132,199,0.35)]', rim: 'border-[#7DD3FC]' };
      case 'green':
        return { gradient: 'from-[#4ADE80] via-[#16A34A] to-[#15803D]', glow: 'shadow-[0_12px_24px_rgba(22,163,74,0.35)]', rim: 'border-[#86EFAC]' };
      case 'purple':
        return { gradient: 'from-[#E879F9] via-[#A855F7] to-[#7E22CE]', glow: 'shadow-[0_12px_24px_rgba(168,85,247,0.4)]', rim: 'border-[#F0ABFC]' };
      case 'amber':
        return { gradient: 'from-[#FB923C] via-[#EA580C] to-[#C2410C]', glow: 'shadow-[0_12px_24px_rgba(234,88,12,0.35)]', rim: 'border-[#FDBA74]' };
      case 'gold':
        return { gradient: 'from-[#FACC15] via-[#EAB308] to-[#CA8A04]', glow: 'shadow-[0_12px_24px_rgba(234,179,8,0.35)]', rim: 'border-[#FEF08A]' };
      case 'teal':
        return { gradient: 'from-[#2DD4BF] via-[#0D9488] to-[#0F766E]', glow: 'shadow-[0_12px_24px_rgba(13,148,136,0.35)]', rim: 'border-[#99F6E4]' };
      case 'ruby':
      default:
        return { gradient: 'from-[#FB7185] via-[#E11D48] to-[#BE123C]', glow: 'shadow-[0_12px_24px_rgba(225,29,72,0.4)]', rim: 'border-[#FDA4AF]' };
    }
  };

  const activeMilestone =
    milestones.find((m) => m.levelNumber === selectedLevelNumber) || milestones[0];

  return (
    <div className="relative w-full overflow-hidden rounded-[32px] bg-gradient-to-b from-[#DCFCE7] via-[#E0F2FE] to-[#FEF3C7] p-4 sm:p-12 border-2 border-[#E2E8F0] shadow-sm">
      <div className="text-center mt-4 mb-10">
        <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-900 bg-white/80 px-3 py-1 rounded-full border border-emerald-200 font-bold">
          {activeBlueprint.title}
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#18221B] tracking-tight mt-3">
          Level Journey
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto mt-1 font-medium">
          {activeBlueprint.drivingQuestion}
        </p>
      </div>

      <div className="relative flex flex-col items-center gap-14 sm:gap-16 py-6 max-w-lg mx-auto">
        <svg
          viewBox="0 0 400 1000"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.06))' }}
        >
          <path
            d="M 200 40 C 310 130, 340 220, 270 320 C 200 420, 120 500, 140 620 C 160 740, 260 820, 240 960"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="26"
            strokeLinecap="round"
          />
          <path
            d="M 200 40 C 310 130, 340 220, 270 320 C 200 420, 120 500, 140 620 C 160 740, 260 820, 240 960"
            fill="none"
            stroke="#86EFAC"
            strokeWidth="12"
            strokeDasharray="18 14"
            strokeLinecap="round"
          />
        </svg>

        {milestones.map((lvl, index) => {
          const colors = getCandyColors(lvl.colorName);
          const isSelected = selectedLevelNumber === lvl.levelNumber;
          const isCompleted = completedLevels.includes(lvl.levelNumber);
          const stars = isCompleted ? 3 : isSelected ? 1 : 0;
          const meanderClass = getMeanderOffset(index);

          return (
            <div
              key={lvl.levelNumber}
              className={`relative z-10 flex flex-col items-center ${meanderClass}`}
            >
              {isSelected && (
                <div className="absolute -top-11 flex items-center gap-2 bg-[#223528] text-white px-3.5 py-1 rounded-full shadow-lg border-2 border-white text-xs font-bold animate-bounce z-20">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{activeStudent.name.split(' ')[0]} is here</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => onSelectMilestone(lvl)}
                className={`candy-node group relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-b ${colors.gradient} border-4 ${colors.rim} ${colors.glow} text-white cursor-pointer select-none ${
                  isSelected ? 'ring-4 ring-white ring-offset-4 ring-offset-[#E0F2FE] scale-105' : ''
                }`}
              >
                <div className="absolute top-1.5 left-3 right-3 h-5 rounded-full bg-white/40 blur-[1px]" />

                <div className="flex flex-col items-center justify-center">
                  <span className="font-serif text-2xl sm:text-3xl font-extrabold drop-shadow-sm leading-none">
                    {lvl.levelNumber}
                  </span>
                  <span className="text-[9px] font-mono tracking-wider uppercase font-bold opacity-90 mt-0.5">
                    {isCompleted ? 'CLEAR' : isSelected ? 'OPEN' : 'PLAY'}
                  </span>
                </div>

                {isCompleted ? (
                  <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#16A34A] border-2 border-white shadow-md">
                    <Check className="h-4 w-4 text-white stroke-[3]" />
                  </div>
                ) : isSelected ? (
                  <div className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 border-2 border-white shadow-md animate-pulse">
                    <Play className="h-3.5 w-3.5 text-slate-900 fill-slate-900 ml-0.5" />
                  </div>
                ) : null}
              </button>

              <div className="flex items-center gap-0.5 mt-2 bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/90 shadow-xs">
                {[1, 2, 3].map((starIdx) => (
                  <Star
                    key={starIdx}
                    className={`h-3.5 w-3.5 ${
                      starIdx <= stars
                        ? 'text-amber-400 fill-amber-400 drop-shadow-2xs'
                        : 'text-stone-300 fill-stone-200'
                    }`}
                  />
                ))}
              </div>

              <div
                onClick={() => onSelectMilestone(lvl)}
                className="mt-1.5 text-center cursor-pointer group"
              >
                <span className="font-serif font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#16A34A] transition-colors block">
                  {lvl.title}
                </span>
                <span className="text-[10px] sm:text-[11px] text-stone-600 font-medium block max-w-[180px] leading-tight mt-0.5">
                  {lvl.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {activeMilestone && (
        <div className="mt-8 pt-4 border-t border-white/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-700">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            <span>
              Active Pod: <strong>{activeStudent.podName}</strong> • {completedLevels.length}/{milestones.length} Milestones Cleared
            </span>
          </div>
          <button
            type="button"
            onClick={() => onSelectMilestone(activeMilestone)}
            className="flex items-center gap-1.5 rounded-full bg-[#223528] text-white px-4 py-2 font-semibold shadow-sm hover:bg-[#1a291f] transition-colors cursor-pointer"
          >
            <span>Open Stage {activeMilestone.levelNumber}</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
