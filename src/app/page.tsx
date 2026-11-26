'use client';

import React from 'react';
import { DaleelProvider, useDaleel } from '../context/DaleelContext';
import { Navbar } from '../components/Navigation/Navbar';
import { TeacherNotificationPopup } from '../components/Navigation/TeacherNotificationPopup';
import { ClassDiscussionModal } from '../components/Navigation/ClassDiscussionModal';
import { JoinClassModal } from '../components/Navigation/JoinClassModal';
import { StudentWorkspace } from '../components/Student/StudentWorkspace';
import { TeacherStudio } from '../components/Teacher/TeacherStudio';
import { ParentLedger } from '../components/Parent/ParentLedger';

const MainContent: React.FC = () => {
  const { role } = useDaleel();

  return (
    <div className="min-h-screen bg-[#F9F8F5] flex flex-col font-sans text-[#18221B]">
      <Navbar />
      <TeacherNotificationPopup />

      <main className="flex-1 mx-auto w-full max-w-6xl px-3 sm:px-6 py-6 sm:py-8">
        {role === 'student' && <StudentWorkspace />}
        {role === 'teacher' && <TeacherStudio />}
        {role === 'parent' && <ParentLedger />}
      </main>

      <ClassDiscussionModal />
      <JoinClassModal />

      <footer className="border-t border-[#E8E6DF] bg-white/70 py-6 mt-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#223528] text-amber-300 font-serif font-bold text-[11px]">
              د
            </div>
            <span className="font-serif font-bold text-slate-900">Daleel</span>
            <span className="text-stone-400">•</span>
            <span>Project-Based Learning Engine</span>
          </div>
          <span className="font-mono text-[11px] text-stone-400">Grades 3–12</span>
        </div>
      </footer>
    </div>
  );
};

export default function Home() {
  return (
    <DaleelProvider>
      <MainContent />
    </DaleelProvider>
  );
}
