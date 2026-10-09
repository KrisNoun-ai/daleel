'use client';

import React from 'react';
import { OmniMeshProvider, useOmniMesh } from '../context/SnackLabContext';
import { Navbar } from '../components/Navigation/Navbar';
import { ProjectOverviewModal } from '../components/Navigation/ProjectOverviewModal';
import { ParentPinModal } from '../components/Navigation/ParentPinModal';
import { TeacherNotificationPopup } from '../components/Navigation/TeacherNotificationPopup';
import { ClassDiscussionModal } from '../components/Navigation/ClassDiscussionModal';
import { StudentView } from '../components/Student/StudentView';
import { TeacherView } from '../components/Teacher/TeacherView';
import { ParentLedgerView } from '../components/Parent/ParentLedgerView';

const MainContent: React.FC = () => {
  const { currentView } = useOmniMesh();

  return (
    <div className="min-h-screen bg-[#F9F8F5] flex flex-col font-sans text-[#18221B]">
      {/* 1. Hikaya-Inspired Global Navigation */}
      <Navbar />

      {/* 2. Real-Time Teacher Alert Popup */}
      <TeacherNotificationPopup />

      {/* 3. Main Page Surface */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-3 sm:px-6 py-4 sm:py-8 overflow-x-hidden">
        {currentView === 'student' && <StudentView />}
        {currentView === 'teacher' && <TeacherView />}
        {currentView === 'parent' && <ParentLedgerView />}
      </main>

      {/* 4. Global Modals: Class Discussion, Parent Gate, Architecture */}
      <ClassDiscussionModal />
      <ParentPinModal />
      <ProjectOverviewModal />

      {/* 4. Hikaya-Inspired Artisanal Footer */}
      <footer className="border-t border-[#E8E6DF] bg-white/70 py-8 mt-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#223528] text-amber-300 font-serif font-bold text-xs shadow-2xs">
              د
            </div>
            <div>
              <span className="font-serif font-bold text-slate-900 text-sm">Daleel</span>
              <span className="text-stone-400 mx-2">•</span>
              <span className="text-stone-600 font-medium">Secondary Project-Based Learning Platform</span>
            </div>
          </div>
          <div className="text-stone-400 text-center sm:text-right font-mono text-[11px]">
            Grade 9 Multidisciplinary Incubator • Beirut, Lebanon
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function Home() {
  return (
    <OmniMeshProvider>
      <MainContent />
    </OmniMeshProvider>
  );
}
