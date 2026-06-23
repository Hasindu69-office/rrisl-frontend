'use client';

import DepartmentCurrentProjectsSection from '@/app/components/department/DepartmentCurrentProjectsSection';
import type { HomeResearchSectionViewModel } from '@/app/lib/home/currentResearchSection';

interface ResearchSectionProps {
  section: HomeResearchSectionViewModel;
}

export default function ResearchSection({ section }: ResearchSectionProps) {
  return (
    <DepartmentCurrentProjectsSection
      tagText={section.tagText}
      titlePart1={section.titlePart1}
      titlePart2={section.titlePart2}
      projects={section.projects}
      autoSlide
    />
  );
}
