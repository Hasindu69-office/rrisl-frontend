'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VacancyCard from './VacancyCard';
import VacancyPagination from './VacancyPagination';
import type { VacancyListItemViewModel } from '@/app/lib/vacancy/pageData';

gsap.registerPlugin(ScrollTrigger);

interface VacancyListingsSectionProps {
  currentPage: number;
  emptyStateDescription: string;
  emptyStateTitle: string;
  jobs: VacancyListItemViewModel[];
  jobDetailsLabel: string;
  locale: string;
  selectedCategory?: string;
  totalPages: number;
}

export default function VacancyListingsSection({
  currentPage,
  emptyStateDescription,
  emptyStateTitle,
  jobs,
  jobDetailsLabel,
  locale,
  selectedCategory,
  totalPages,
}: VacancyListingsSectionProps) {
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const paginationRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (
      typeof window === 'undefined' ||
      !sectionRef.current ||
      !contentRef.current
    ) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const sectionNode = sectionRef.current;
    const contentNode = contentRef.current;
    const paginationNode = paginationRef.current;

    const context = gsap.context(() => {
      const revealItems = gsap.utils.toArray<HTMLElement>('[data-vacancy-reveal]');
      const animationTargets = revealItems.length > 0 ? revealItems : [contentNode];

      gsap.set(contentNode, {
        autoAlpha: 0,
        y: 32,
      });

      gsap.set(animationTargets, {
        autoAlpha: 0,
        y: 30,
      });

      if (paginationNode) {
        gsap.set(paginationNode, {
          autoAlpha: 0,
          y: 16,
        });
      }

      const timeline = gsap.timeline({
        paused: true,
        defaults: {
          ease: 'power3.out',
        },
      });

      timeline.to(contentNode, {
        autoAlpha: 1,
        y: 0,
        duration: 0.78,
        clearProps: 'opacity,visibility,transform',
      });

      timeline.to(
        animationTargets,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
          stagger: revealItems.length > 1 ? 0.07 : 0,
          clearProps: 'opacity,visibility,transform',
        },
        '-=0.44'
      );

      if (paginationNode) {
        timeline.to(
          paginationNode,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.58,
            clearProps: 'opacity,visibility,transform',
          },
          '-=0.28'
        );
      }

      ScrollTrigger.create({
        trigger: sectionNode,
        start: 'top 84%',
        once: true,
        onEnter: () => timeline.play(0),
      });

      ScrollTrigger.refresh();
    }, sectionNode);

    return () => context.revert();
  }, [jobs.length, safeCurrentPage, selectedCategory, totalPages]);

  return (
    <section
      ref={sectionRef}
      className="bg-white px-4 pb-8 md:px-6 md:pb-32 lg:px-36"
    >
      <div className="mx-auto w-full max-w-[1480px]">
        <div ref={contentRef} className="space-y-10">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} data-vacancy-reveal>
                <VacancyCard job={job} jobDetailsLabel={jobDetailsLabel} locale={locale} />
              </div>
            ))
          ) : (
            <div
              data-vacancy-reveal
              className="rounded-[20px] border border-dashed border-[#C7D0D9] bg-[#F8FAF8] px-6 py-12 text-center"
            >
              <p className="text-lg font-semibold text-[#111827]">{emptyStateTitle}</p>
              <p className="mt-2 text-sm text-[#667085]">{emptyStateDescription}</p>
            </div>
          )}
        </div>

        <div ref={paginationRef}>
          <VacancyPagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            locale={locale}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </section>
  );
}
