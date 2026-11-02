'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';
import type {
  DepartmentRecommendationBriefItem,
  DepartmentRecommendationGroupView,
  DepartmentRecommendationsContent,
} from '@/app/lib/departments/recommendationsData';

interface DepartmentRecommendationsSectionProps {
  content: DepartmentRecommendationsContent;
  containerClassName?: string;
}

function RecommendationBriefCard({
  item,
  index,
}: {
  item: DepartmentRecommendationBriefItem;
  index: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDescription = Boolean(item.description);
  const detailsId = `department-recommendation-details-${item.id}`;
  const triggerId = `department-recommendation-details-trigger-${item.id}`;

  return (
    <article
      data-department-reveal
      className={`flex w-full flex-col overflow-hidden rounded-[24px] border bg-white shadow-[0_14px_34px_rgba(15,63,29,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#B9DDA9] hover:shadow-[0_20px_44px_rgba(15,63,29,0.1)] ${
        isExpanded ? 'border-[#B9DDA9]' : 'border-[#DCE9D5]'
      }`}
    >
      <div className="flex flex-1 gap-4 p-5 md:gap-5 md:p-6">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#A1DF0A] text-[14px] font-bold text-[#0F3F1D] md:h-12 md:w-12 md:text-[15px]">
          {String(index + 1).padStart(2, '0')}
        </span>

        <div className="min-w-0 flex-1">
          <h4 className="text-[16px] font-semibold leading-[1.4] text-[#153C21] md:text-[18px]">
            {item.title}
          </h4>
        </div>
      </div>

      {hasDescription ? (
        <>
          <button
            id={triggerId}
            type="button"
            onClick={() => setIsExpanded((current) => !current)}
            aria-expanded={isExpanded}
            aria-controls={detailsId}
            className="flex w-full cursor-pointer items-center justify-between gap-4 border-t border-[#E7EFE2] bg-[#F8FBF6] px-5 py-3.5 text-left text-[14px] font-semibold text-[#205C2E] outline-none transition-colors hover:bg-[#EEF7E8] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2E7D32] md:px-6"
          >
            <span>{isExpanded ? 'Hide details' : 'View details'}</span>
            <ChevronDown
              aria-hidden="true"
              className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>

          <div
            id={detailsId}
            role="region"
            aria-labelledby={triggerId}
            aria-hidden={!isExpanded}
            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
              isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="border-t border-[#E7EFE2] px-5 pb-5 pt-4 md:px-6 md:pb-6 md:pt-5">
                <p className="text-[14px] leading-[1.75] text-[#3D4E41] md:text-[15px] md:leading-[1.8]">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </article>
  );
}

function RecommendationGroupsLayout({
  groups,
}: {
  groups: DepartmentRecommendationGroupView[];
}) {
  return (
    <div className="mt-10 space-y-10 md:mt-12 md:space-y-12">
      {groups.map((group) => (
        <div key={group.id} data-department-reveal>
          <div className="mb-5 flex items-center gap-3 md:mb-6">
            <span className="inline-flex items-center rounded-full bg-[#EEF7E8] px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#2E7D32]">
              {group.title}
            </span>
            <span className="h-px flex-1 bg-[linear-gradient(90deg,#C9DFBE_0%,rgba(201,223,190,0)_100%)]" />
          </div>

          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 md:gap-5 lg:gap-6">
            {group.items.map((item, index) => (
              <RecommendationBriefCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Department recommendations: numbered title tiles with optional View details
 * expand for described items.
 */
export default function DepartmentRecommendationsSection({
  content,
  containerClassName = 'w-[80%]',
}: DepartmentRecommendationsSectionProps) {
  return (
    <section className="bg-[linear-gradient(180deg,#F7FBF4_0%,#FFFFFF_100%)] px-4 py-16 md:px-6 md:py-20 lg:px-0 lg:py-24">
      <div className={`mx-auto max-w-[1280px] ${containerClassName}`} data-department-reveal>
        <div className="text-center">
          <GradientTag
            text={content.eyebrow}
            backgroundColor="white"
            padding="px-5 py-1.5"
            className="inline-block"
          />

          <GradientTitle
            part1={content.title}
            part2={content.highlightedText}
            lineBreak={false}
            part1Color="dark-green"
            size="custom"
            customSize="clamp(30px, 4vw, 52px)"
            align="center"
            className="mt-5 font-bold leading-[1.12]"
          />
        </div>

        <RecommendationGroupsLayout groups={content.groups} />
      </div>
    </section>
  );
}
