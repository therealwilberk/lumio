import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SubjectsSection } from '@/components/subjects/SubjectsSection';

export function SubjectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />
      
      {/* Hero Section for Subjects */}
      <div className="relative z-10 px-6 py-20 pt-24">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Explore All Subjects
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover a world of learning opportunities across different subjects designed for Grade 6 students.
          </p>
        </div>
      </div>

      {/* Subjects Section */}
      <SubjectsSection />
    </div>
  );
}
