'use client';

import React from 'react';
import { useDaleel } from '../../context/DaleelContext';
import { Bell, X, ArrowRight } from 'lucide-react';

export const TeacherNotificationPopup: React.FC = () => {
  const { activePopupAlert, dismissPopupAlert, setRole } = useDaleel();

  if (!activePopupAlert) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm w-[calc(100vw-2rem)]">
      <div className="bg-white border-2 border-amber-400 rounded-3xl p-4 shadow-2xl space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-amber-500 text-white flex items-center justify-center">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-amber-800">
                {activePopupAlert.priority === 'safeguarding' ? 'Safeguarding Alert' : 'Student Help Call'}
              </span>
              <h4 className="font-serif font-bold text-sm text-slate-900">
                {activePopupAlert.studentName}
              </h4>
            </div>
          </div>
          <button
            type="button"
            onClick={dismissPopupAlert}
            className="p-1 rounded-lg text-stone-400 hover:bg-stone-100 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-stone-700">{activePopupAlert.message}</p>
        <button
          type="button"
          onClick={() => {
            setRole('teacher');
            dismissPopupAlert();
          }}
          className="w-full flex items-center justify-center gap-1.5 bg-[#223528] text-white py-2 rounded-xl text-xs font-bold cursor-pointer"
        >
          <span>Open Teacher Cockpit</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
