'use client';

import Image from 'next/image';
import React, { startTransition, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';

export interface DepartmentCurrentProjectItem {
  id: string;
  title: string;
  href?: string;
  imageSrc: string;
  imageAlt: string;
  departmentName?: string;
}

interface DepartmentCurrentProjectsSectionProps {
  tagText: string;
  titlePart1: string | React.ReactNode;
  titlePart2: string | React.ReactNode;
  projects: DepartmentCurrentProjectItem[];
  containerClassName?: string;
  sectionId?: string;
  autoSlide?: boolean;
  autoSlideIntervalMs?: number;
}

const MOBILE_GAP = 20;
const TABLET_GAP = 24;
const DESKTOP_GAP = 28;
const DEFAULT_AUTO_SLIDE_INTERVAL_MS = 3000;

function getVisibleCardCount(viewportWidth: number) {
  if (viewportWidth >= 1024) {
    return 5;
  }

  if (viewportWidth >= 768) {
    return 2;
  }

  return 1;
}

function getTrackGap(viewportWidth: number) {
  if (viewportWidth >= 1024) {
    return DESKTOP_GAP;
  }

  if (viewportWidth >= 768) {
    return TABLET_GAP;
  }

  return MOBILE_GAP;
}

function ProjectCard({
  project,
  staggered,
}: {
  project: DepartmentCurrentProjectItem;
  staggered: boolean;
}) {
  const useUnoptimizedImage = isLocalhostAssetUrl(project.imageSrc);
  const cardContent = (
    <div className="relative h-full w-full">
      <Image
        src={project.imageSrc}
        alt={project.imageAlt}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        sizes="(max-width: 767px) 78vw, (max-width: 1279px) 44vw, 24vw"
        unoptimized={useUnoptimizedImage}
      />

      <div
        className="absolute inset-0 transition-opacity duration-500 ease-out group-hover:opacity-20"
        style={{
          background:
            'linear-gradient(180deg, rgba(161, 223, 10, 0) 0%, #093714 100%)',
        }}
      />

      <div className="absolute inset-0 flex items-end p-5 md:p-6">
        <div className="flex max-w-[18ch] flex-col gap-2">
          {project.departmentName ? (
            <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#D5F08B]">
              {project.departmentName}
            </span>
          ) : null}
          <h3 className="text-[16px] font-medium leading-[1.35] text-white">
            {project.title}
          </h3>
        </div>
      </div>
    </div>
  );

  return (
    <article
      className={`group relative shrink-0 overflow-hidden rounded-[28px] shadow-[0_18px_46px_rgba(15,63,29,0.12)] transition-shadow duration-500 ease-out hover:shadow-[0_24px_54px_rgba(15,63,29,0.16)] ${staggered ? 'lg:translate-y-14' : 'lg:translate-y-0'}`}
      style={{ height: 'min(64vw, 446px)' }}
    >
      {project.href ? (
        <a
          href={project.href}
          aria-label={`View ${project.title}`}
          className="block h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A1DF0A] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          {cardContent}
        </a>
      ) : (
        cardContent
      )}
    </article>
  );
}

/**
 * Reusable department projects slider with alternating card positions.
 * Default state prioritizes text readability; hover reveals the image beneath the gradient.
 */
export default function DepartmentCurrentProjectsSection({
  tagText,
  titlePart1,
  titlePart2,
  projects,
  containerClassName = '',
  sectionId,
  autoSlide = false,
  autoSlideIntervalMs = DEFAULT_AUTO_SLIDE_INTERVAL_MS,
}: DepartmentCurrentProjectsSectionProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [isAutoSlidePaused, setIsAutoSlidePaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const node = viewportRef.current;

    if (!node) {
      return;
    }

    const updateViewportWidth = () => {
      setViewportWidth(node.clientWidth);
    };

    updateViewportWidth();

    const observer = new ResizeObserver(() => {
      updateViewportWidth();
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  const visibleCardCount = getVisibleCardCount(viewportWidth);
  const effectiveVisibleCardCount = Math.max(
    1,
    Math.min(visibleCardCount, projects.length)
  );
  const trackGap = getTrackGap(viewportWidth);
  const maxIndex = Math.max(0, projects.length - effectiveVisibleCardCount);
  const boundedActiveIndex = Math.min(activeIndex, maxIndex);
  const canSlide = maxIndex > 0;
  const cardWidth =
    viewportWidth > 0
      ? (viewportWidth - trackGap * Math.max(effectiveVisibleCardCount - 1, 0)) /
        effectiveVisibleCardCount
      : 0;
  const translateX = canSlide ? boundedActiveIndex * (cardWidth + trackGap) : 0;

  const handlePrevious = () => {
    if (!canSlide) {
      return;
    }

    startTransition(() => {
      setActiveIndex(Math.max(boundedActiveIndex - 1, 0));
    });
  };

  const handleNext = () => {
    if (!canSlide) {
      return;
    }

    startTransition(() => {
      setActiveIndex(Math.min(boundedActiveIndex + 1, maxIndex));
    });
  };

  useEffect(() => {
    if (!autoSlide || typeof window === 'undefined') {
      return;
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotionPreference = (event?: MediaQueryListEvent) => {
      setPrefersReducedMotion(event ? event.matches : motionQuery.matches);
    };

    syncMotionPreference();
    motionQuery.addEventListener('change', syncMotionPreference);

    return () => {
      motionQuery.removeEventListener('change', syncMotionPreference);
    };
  }, [autoSlide]);

  useEffect(() => {
    if (
      !autoSlide ||
      !canSlide ||
      isAutoSlidePaused ||
      prefersReducedMotion ||
      autoSlideIntervalMs <= 0
    ) {
      return;
    }

    const intervalId = window.setInterval(() => {
      startTransition(() => {
        setActiveIndex((previousIndex) => {
          const safePreviousIndex = Math.min(previousIndex, maxIndex);

          return safePreviousIndex >= maxIndex ? 0 : safePreviousIndex + 1;
        });
      });
    }, autoSlideIntervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    autoSlide,
    autoSlideIntervalMs,
    canSlide,
    isAutoSlidePaused,
    maxIndex,
    prefersReducedMotion,
  ]);

  const handleAutoSlidePause = () => {
    if (!autoSlide) {
      return;
    }

    setIsAutoSlidePaused(true);
  };

  const handleAutoSlideResume = () => {
    if (!autoSlide) {
      return;
    }

    setIsAutoSlidePaused(false);
  };

  const handleAutoSlideBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      handleAutoSlideResume();
    }
  };

  return (
    <section id={sectionId} className="scroll-mt-28 bg-white py-16 md:py-20 lg:py-24">
      <div className={`mx-auto max-w-[1600px] px-4 md:px-6 xl:w-[80%] xl:px-0 ${containerClassName}`}>
        <div
          onMouseEnter={handleAutoSlidePause}
          onMouseLeave={handleAutoSlideResume}
          onFocus={handleAutoSlidePause}
          onBlur={handleAutoSlideBlur}
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-[760px]" data-department-reveal>
              <GradientTag
                text={tagText}
                backgroundColor="transparent"
                className="inline-block"
                padding="px-4 py-1"
              />

              <GradientTitle
                part1={titlePart1}
                part2={titlePart2}
                lineBreak={false}
                part1Color="dark-green"
                size="custom"
                customSize="clamp(30px, 4vw, 58px)"
                align="left"
                className="mt-5 font-bold leading-[1.12]"
              />
            </div>

            <div
              className={`hidden items-center gap-3 self-end lg:self-start ${
                canSlide ? 'lg:flex' : 'lg:hidden'
              }`}
              data-department-reveal
            >
              <button
                type="button"
                aria-label="Previous projects"
                onClick={handlePrevious}
                disabled={boundedActiveIndex === 0}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F4B1D] text-white transition duration-300 hover:bg-[#136127] disabled:cursor-not-allowed disabled:bg-[#DCE5D7] disabled:text-[#8BA191]"
              >
                <ArrowLeft className="h-5 w-5" strokeWidth={2.2} />
              </button>
              <button
                type="button"
                aria-label="Next projects"
                onClick={handleNext}
                disabled={boundedActiveIndex >= maxIndex}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F4B1D] text-white transition duration-300 hover:bg-[#136127] disabled:cursor-not-allowed disabled:bg-[#DCE5D7] disabled:text-[#8BA191]"
              >
                <ArrowRight className="h-5 w-5" strokeWidth={2.2} />
              </button>
            </div>
          </div>

          <div
            ref={viewportRef}
            data-department-reveal
            className="mt-12 overflow-x-hidden overflow-y-visible pt-2 pb-16 lg:pt-2 lg:pb-20"
          >
            <div
              className="flex items-start transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                gap: `${trackGap}px`,
                transform: `translateX(-${translateX}px)`,
              }}
            >
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="shrink-0"
                  style={{
                    width: cardWidth > 0 ? `${cardWidth}px` : undefined,
                    flexBasis: cardWidth > 0 ? `${cardWidth}px` : undefined,
                  }}
                >
                  <ProjectCard project={project} staggered={index % 2 === 1} />
                </div>
              ))}
            </div>
          </div>

          <div
            className={`mt-2 items-center justify-center gap-3 lg:hidden ${
              canSlide ? 'flex' : 'hidden'
            }`}
          >
            <button
              type="button"
              aria-label="Previous projects"
              onClick={handlePrevious}
              disabled={boundedActiveIndex === 0}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F4B1D] text-white transition duration-300 hover:bg-[#136127] disabled:cursor-not-allowed disabled:bg-[#DCE5D7] disabled:text-[#8BA191]"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={2.2} />
            </button>
            <button
              type="button"
              aria-label="Next projects"
              onClick={handleNext}
              disabled={boundedActiveIndex >= maxIndex}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F4B1D] text-white transition duration-300 hover:bg-[#136127] disabled:cursor-not-allowed disabled:bg-[#DCE5D7] disabled:text-[#8BA191]"
            >
              <ArrowRight className="h-5 w-5" strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
