'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';

export interface DepartmentPublicationSectionItem {
  id: string;
  label: string;
  entries: string[];
}

interface DepartmentPublicationsSectionProps {
  tagText?: string;
  titlePart1?: string | React.ReactNode;
  titlePart2?: string | React.ReactNode;
  /** @deprecated Prefer tagText + title parts; kept for transitional callers */
  title?: string;
  sections: DepartmentPublicationSectionItem[];
  containerClassName?: string;
  sectionId?: string;
}

function PublicationCategoryItem({
  section,
  isOpen,
  onToggle,
}: {
  section: DepartmentPublicationSectionItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelId = `department-publication-panel-${section.id}`;
  const triggerId = `department-publication-trigger-${section.id}`;

  return (
    <article className="overflow-hidden rounded-[22px] border border-[#DCE9D5] bg-white shadow-[0_16px_40px_rgba(15,63,29,0.06)]">
      <button
        id={triggerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-5 px-5 py-5 text-left outline-none transition hover:bg-[#FAFCF8] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2E7D32] md:px-7 md:py-6"
      >
        <h4 className="min-w-0 break-words text-[17px] font-semibold leading-[1.45] text-[#153C21] md:text-[20px]">
          {section.label}
        </h4>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFF8E9] text-[#2E7D32] transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <ChevronDown className="h-5 w-5" aria-hidden="true" />
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-[#E7EFE2] px-5 py-6 md:px-7 md:py-7">
            {section.entries.length > 0 ? (
              <ul className="location-details-scroll max-h-[min(60vh,420px)] space-y-4 overflow-y-auto overscroll-contain pr-2">
                {section.entries.map((entry) => (
                  <li
                    key={entry}
                    className="flex gap-3 text-[14px] leading-[1.8] text-[#35473A] md:text-[15px] md:leading-[1.85]"
                  >
                    <span
                      className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2E7D32]"
                      aria-hidden="true"
                    />
                    <span className="min-w-0 break-words">{entry}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[15px] leading-[1.8] text-[#5A6B5F]">
                Publication details will be added soon.
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Publications list: category topics expand like current research projects.
 */
export default function DepartmentPublicationsSection({
  tagText = 'Publications',
  titlePart1,
  titlePart2,
  title = 'Publications',
  sections,
  containerClassName = '',
  sectionId,
}: DepartmentPublicationsSectionProps) {
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);

  if (sections.length === 0) {
    return null;
  }

  const resolvedTitlePart1 = titlePart1 ?? 'Our';
  const resolvedTitlePart2 = titlePart2 ?? title;

  return (
    <section id={sectionId} className="scroll-mt-28 bg-white py-16 md:py-20 lg:py-24">
      <div className={`mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8 ${containerClassName}`}>
        <div className="text-center" data-department-reveal>
          <GradientTag
            text={tagText}
            backgroundColor="transparent"
            className="inline-block"
            padding="px-4 py-1"
          />

          <GradientTitle
            part1={resolvedTitlePart1}
            part2={resolvedTitlePart2}
            lineBreak={false}
            part1Color="dark-green"
            size="custom"
            customSize="clamp(28px, 4vw, 50px)"
            align="center"
            className="mt-5 font-bold leading-[1.15]"
          />
        </div>

        <div className="mt-10 space-y-4 md:mt-12 md:space-y-5" data-department-reveal>
          {sections.map((section) => (
            <PublicationCategoryItem
              key={section.id}
              section={section}
              isOpen={openSectionId === section.id}
              onToggle={() =>
                setOpenSectionId((current) => (current === section.id ? null : section.id))
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
