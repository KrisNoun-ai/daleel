'use client';

import React from 'react';
import { useOmniMesh } from '../../context/SnackLabContext';
import { CandyLevel } from '../../types';
import { Star, Check, Sparkles, Trophy, ChevronRight, Play } from 'lucide-react';

interface CandyCrushMapProps {
  onSelectLevel: (lvl: CandyLevel) => void;
}

export const CandyCrushMap: React.FC<CandyCrushMapProps> = ({ onSelectLevel }) => {
  const { levels, selectedLevelNumber, student } = useOmniMesh();

  // Winding horizontal path offsets to create the classic Candy Crush winding trail
  const getMeanderOffset = (index: number) => {
    const offsets = [
      'translate-x-0',                         // Lvl 1: Center-left
      'translate-x-16 sm:translate-x-32',     // Lvl 2: Curve Right
      'translate-x-24 sm:translate-x-48',     // Lvl 3: Peak Right
      'translate-x-10 sm:translate-x-20',     // Lvl 4: Transition
      '-translate-x-12 sm:-translate-x-24',   // Lvl 5: Peak Left
      '-translate-x-4 sm:-translate-x-8',     // Lvl 6: Curve Center
      'translate-x-16 sm:translate-x-36',     // Lvl 7: Final Peak Right (Crown)
    ];
    return offsets[index % offsets.length];
  };

  const getCandyColors = (colorName: string) => {
    switch (colorName) {
      case 'blue':
        return {
          gradient: 'from-[#38BDF8] via-[#0284C7] to-[#0369A1]',
          glow: 'shadow-[0_12px_24px_rgba(2,132,199,0.35)]',
          rim: 'border-[#7DD3FC]',
        };
      case 'green':
        return {
          gradient: 'from-[#4ADE80] via-[#16A34A] to-[#15803D]',
          glow: 'shadow-[0_12px_24px_rgba(22,163,74,0.35)]',
          rim: 'border-[#86EFAC]',
        };
      case 'purple':
        return {
          gradient: 'from-[#E879F9] via-[#A855F7] to-[#7E22CE]',
          glow: 'shadow-[0_12px_24px_rgba(168,85,247,0.4)]',
          rim: 'border-[#F0ABFC]',
        };
      case 'amber':
        return {
          gradient: 'from-[#FB923C] via-[#EA580C] to-[#C2410C]',
          glow: 'shadow-[0_12px_24px_rgba(234,88,12,0.35)]',
          rim: 'border-[#FDBA74]',
        };
      case 'gold':
        return {
          gradient: 'from-[#FACC15] via-[#EAB308] to-[#CA8A04]',
          glow: 'shadow-[0_12px_24px_rgba(234,179,8,0.35)]',
          rim: 'border-[#FEF08A]',
        };
      case 'teal':
        return {
          gradient: 'from-[#2DD4BF] via-[#0D9488] to-[#0F766E]',
          glow: 'shadow-[0_12px_24px_rgba(13,148,136,0.35)]',
          rim: 'border-[#99F6E4]',
        };
      case 'ruby':
      default:
        return {
          gradient: 'from-[#FB7185] via-[#E11D48] to-[#BE123C]',
          glow: 'shadow-[0_12px_24px_rgba(225,29,72,0.4)]',
          rim: 'border-[#FDA4AF]',
        };
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-[32px] bg-gradient-to-b from-[#DCFCE7] via-[#E0F2FE] to-[#FEF3C7] p-6 sm:p-12 border-2 border-[#E2E8F0] shadow-sm">


      {/* Intro Heading */}
      <div className="text-center mt-6 mb-12">
        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#18221B] tracking-tight">
          Level Journey
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto mt-1 font-medium">
          Select any level node to jump into the lab workshop and test your scientific formulation.
        </p>
      </div>

      {/* The Winding Peppermint Trail & Candy Nodes */}
      <div className="relative flex flex-col items-center gap-14 sm:gap-16 py-6 max-w-lg mx-auto">
        {/* Curving Striped Road SVG */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.06))' }}
        >
          {/* Broad white base ribbon */}
          <path
            d="M 240 20 Q 340 100 360 200 T 260 360 T 170 520 T 320 680"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="32"
            strokeLinecap="round"
          />
          {/* Candy cane green stripe ribbon */}
          <path
            d="M 240 20 Q 340 100 360 200 T 260 360 T 170 520 T 320 680"
            fill="none"
            stroke="#86EFAC"
            strokeWidth="16"
            strokeDasharray="20 16"
            strokeLinecap="round"
          />
        </svg>

        {levels.map((lvl, index) => {
          const colors = getCandyColors(lvl.colorName);
          const isSelected = selectedLevelNumber === lvl.levelNumber;
          const isActivePlayerLevel = lvl.levelNumber === student.activeLevel;
          const isCompleted = lvl.status === 'completed';
          const meanderClass = getMeanderOffset(index);

          return (
            <div
              key={lvl.levelNumber}
              className={`relative z-10 flex flex-col items-center ${meanderClass}`}
            >
              {/* Player Avatar Pin Standing on Active Level */}
              {isActivePlayerLevel && (
                <div className="absolute -top-11 flex items-center gap-2 bg-[#223528] text-white px-3.5 py-1 rounded-full shadow-lg border-2 border-white text-xs font-bold animate-bounce z-20">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{student.name.split(' ')[0]} is here!</span>
                </div>
              )}

              {/* 3D Glossy Candy Button */}
              <button
                type="button"
                onClick={() => onSelectLevel(lvl)}
                className={`group relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-b ${colors.gradient} ${colors.glow} ${colors.rim} border-4 text-white cursor-pointer candy-node select-none`}
              >
                {/* 3D Curved Gloss Specular Highlight */}
                <div className="absolute top-1.5 left-3 right-3 h-7 rounded-t-full bg-gradient-to-b from-white/75 via-white/30 to-transparent pointer-events-none" />

                {/* Inner Level Number & Status */}
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="font-black text-2xl sm:text-3xl tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                    {lvl.levelNumber}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/90 -mt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                    {isCompleted ? 'CLEAR' : isSelected ? 'OPEN' : 'PLAY'}
                  </span>
                </div>

                {/* Completion Check Badge */}
                {isCompleted && (
                  <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white border-2 border-white shadow-md">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                )}

                {/* Active Indicator Pulse */}
                {isSelected && (
                  <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-slate-900 border-2 border-white shadow-md">
                    <Play className="h-3 w-3 fill-current ml-0.5" />
                  </div>
                )}
              </button>

              {/* Gold Stars */}
              <div className="flex items-center gap-1 mt-2.5 bg-white/90 px-3 py-0.5 rounded-full shadow-2xs border border-white">
                {[1, 2, 3].map((starIdx) => (
                  <Star
                    key={starIdx}
                    className={`h-3 w-3 ${
                      starIdx <= lvl.stars
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>

              {/* Clean Level Title & Subtitle */}
              <div
                onClick={() => onSelectLevel(lvl)}
                className="mt-1.5 cursor-pointer text-center max-w-[170px] sm:max-w-[210px] group"
              >
                <span className="font-serif text-xs sm:text-sm font-bold text-slate-900 block group-hover:text-emerald-800 transition-colors">
                  {lvl.title}
                </span>
                <span className="text-[10px] text-stone-600 line-clamp-1 font-medium">
                  {lvl.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Banner */}
      <div className="mt-10 pt-6 border-t border-stone-300/60 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-700 gap-3">
        <span className="font-medium">
          Active Student Role: <strong className="text-slate-900">{student.role}</strong>
        </span>
        <button
          type="button"
          onClick={() => {
            const cur = levels.find((l) => l.levelNumber === student.activeLevel) || levels[2];
            onSelectLevel(cur);
          }}
          className="flex items-center gap-1.5 bg-[#223528] text-white px-5 py-2.5 rounded-full font-bold shadow-xs hover:bg-[#18261D] transition-colors"
        >
          <span>Continue Level {student.activeLevel} Mission</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
