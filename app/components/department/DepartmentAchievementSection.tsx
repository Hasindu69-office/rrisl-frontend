'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';

export interface DepartmentAchievementCardItem {
  id: string;
  text: string;
}

interface DepartmentAchievementSectionProps {
  tagText: string;
  titlePart1?: string | React.ReactNode;
  titlePart2?: string | React.ReactNode;
  illustrationSrc: string;
  illustrationAlt: string;
  outlineText?: string;
  items?: DepartmentAchievementCardItem[];
  children?: React.ReactNode;
  containerClassName?: string;
}

const DESKTOP_BREAKPOINT = 1024;
const AUTO_SLIDE_INTERVAL_MS = 4500;

/**
 * Reusable department showcase shell for achievement-style sections.
 * Supports a simple paged slider with two cards on desktop.
 */
export default function DepartmentAchievementSection({
  tagText,
  titlePart1 = 'Our ',
  titlePart2 = 'Achievements',
  illustrationSrc,
  illustrationAlt,
  outlineText = 'Our Achievements',
  items = [],
  children,
  containerClassName = '',
}: DepartmentAchievementSectionProps) {
  const [visibleCount, setVisibleCount] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);

    const syncVisibleCount = (event?: MediaQueryListEvent) => {
      const nextVisibleCount = event?.matches ?? mediaQuery.matches ? 2 : 1;
      setVisibleCount(nextVisibleCount);
      setCurrentIndex((previousIndex) =>
        Math.min(previousIndex, Math.max(items.length - nextVisibleCount, 0))
      );
    };

    syncVisibleCount();
    mediaQuery.addEventListener('change', syncVisibleCount);

    return () => {
      mediaQuery.removeEventListener('change', syncVisibleCount);
    };
  }, [items.length]);

  const maxStartIndex = Math.max(items.length - visibleCount, 0);
  const safeCurrentIndex = Math.min(currentIndex, maxStartIndex);
  const canSlide = items.length > visibleCount;
  const isPreviousDisabled = safeCurrentIndex === 0;
  const isNextDisabled = safeCurrentIndex >= maxStartIndex;
  const trackTransform =
    visibleCount === 2
      ? `translateX(calc(-${safeCurrentIndex} * ((100% - 1.75rem) / 2 + 1.75rem)))`
      : `translateX(calc(-${safeCurrentIndex} * (100% + 1.5rem)))`;

  const handlePrevious = () => {
    if (!canSlide || isPreviousDisabled) {
      return;
    }

    setCurrentIndex((previousIndex) => Math.max(previousIndex - 1, 0));
  };

  const handleNext = () => {
    if (!canSlide || isNextDisabled) {
      return;
    }

    setCurrentIndex((previousIndex) => Math.min(previousIndex + 1, maxStartIndex));
  };

  useEffect(() => {
    if (!canSlide) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setCurrentIndex((previousIndex) =>
        previousIndex >= maxStartIndex ? 0 : previousIndex + 1
      );
    }, AUTO_SLIDE_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [canSlide, maxStartIndex]);

  return (
    <section className={`py-16 md:py-20 lg:py-24 px-4 md:px-6 lg:px-0 ${containerClassName}`}>
      <div className="mx-auto w-full max-w-[1920px]">
        <div className="flex justify-center" data-department-reveal>
          <div className="flex flex-col items-center text-center">
            <GradientTag
              text={tagText}
              backgroundColor="white"
              padding="px-5 py-1.5"
              className="inline-block"
            />

            <GradientTitle
              part1={titlePart1}
              part2={titlePart2}
              lineBreak={false}
              part1Color="dark-green"
              size="custom"
              customSize="clamp(30px, 4vw, 52px)"
              align="center"
              className="mt-5 font-bold leading-[1.12]"
            />
          </div>
        </div>

        <div className="relative mt-10 md:mt-12">
          <div data-department-reveal className="pointer-events-none absolute bottom-[72px] left-[-56px] z-[2] h-[300px] w-[220px] md:bottom-[56px] md:left-[-72px] md:h-[380px] md:w-[280px] lg:bottom-[72px] lg:left-[calc(9%-200px)] lg:h-[540px] lg:w-[400px]">
            <Image
              src={illustrationSrc}
              alt={illustrationAlt}
              fill
              priority={false}
              className="object-contain object-left-bottom opacity-10 md:opacity-45 lg:opacity-60"
              sizes="(max-width: 767px) 160px, (max-width: 1023px) 280px, 400px"
            />
          </div>

          <div className="mx-auto w-full md:w-[80%]" data-department-reveal>
            <div
              className="relative rounded-[40px] px-4 pb-8 pt-8 md:min-h-[420px] md:px-5 md:pb-10 md:pt-10 lg:min-h-[520px] lg:px-6 lg:pb-12 lg:pt-12"
              style={{
                background:
                  'linear-gradient(180deg, rgba(161, 223, 10, 0.2) 0%, rgba(255, 255, 255, 0.84) 100%)',
              }}
            >
              <div className="pointer-events-none absolute bottom-4 left-4 z-[1] md:bottom-8 md:left-5 lg:bottom-10 lg:left-6">
                <span
                  className="block text-[48px] font-semibold leading-[0.95] text-transparent md:text-[72px] lg:text-[100px]"
                  style={{
                    WebkitTextStroke: '1px #2E7D32',
                  }}
                >
                  {outlineText}
                </span>
              </div>

              <div className="relative z-[1] min-h-[280px] md:min-h-[320px] lg:min-h-[424px]">
                {(items.length > 0 || children) ? (
                  <div className="relative z-[1] mt-[36px] w-full pb-[74px] md:mt-[72px] md:pb-[120px] lg:mt-[100px] lg:pb-0">
                    {items.length > 0 ? (
                      <div className="overflow-hidden">
                        <div
                          className="flex gap-6 pb-3 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:gap-7 lg:pb-4"
                          style={{
                            transform: trackTransform,
                          }}
                        >
                          {items.map((item) => (
                          <article
                            key={item.id}
                            className="w-full shrink-0 rounded-[28px] bg-white px-6 py-6 shadow-[0_4px_4px_rgba(0,0,0,0.18)] md:px-7 md:py-7 lg:w-[calc((100%-1.75rem)/2)]"
                          >
                            <p className="text-[18px] leading-[1.8] text-black">
                              {item.text}
                            </p>
                          </article>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {children}

                    {canSlide ? (
                      <div className="mt-5 flex justify-end gap-3 md:mt-8 md:gap-4">
                        <button
                          type="button"
                          onClick={handlePrevious}
                          aria-label="Show previous achievements"
                          disabled={isPreviousDisabled}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F3F1D] text-white transition duration-300 hover:bg-[#145127] disabled:cursor-not-allowed disabled:opacity-45 md:h-12 md:w-12"
                        >
                          <ArrowLeft className="h-5 w-5" strokeWidth={2.2} />
                        </button>

                        <button
                          type="button"
                          onClick={handleNext}
                          aria-label="Show next achievements"
                          disabled={isNextDisabled}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F3F1D] text-white transition duration-300 hover:bg-[#145127] disabled:cursor-not-allowed disabled:opacity-45 md:h-12 md:w-12"
                        >
                          <ArrowRight className="h-5 w-5" strokeWidth={2.2} />
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
