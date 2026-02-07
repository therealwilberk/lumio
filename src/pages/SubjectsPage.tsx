import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SubjectsSection } from '@/components/subjects/SubjectsSection';

import { Spotlight } from '@/components/ui/spotlight';
import { Meteors } from '@/components/ui/meteors';

export function SubjectsPage() {
  return (
    <div className="min-h-screen bg-slate-950 antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* Spotlight effect */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      <Navbar />
      
      <div className="pt-24 relative z-10">
        <Meteors number={20} />
        {/* Subjects Section */}
        <SubjectsSection />
      </div>
    </div>
  );
}
