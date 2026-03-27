'use client';

import React, { startTransition, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';

export interface DepartmentTimelineBlock {
  variant: 'text' | 'card';
  lines?: string[];
  content?: string;
  italic?: boolean;
}

export interface DepartmentAwardsTimelineItem {
  id: string;
  top: DepartmentTimelineBlock;
  bottom: DepartmentTimelineBlock;
}

interface DepartmentAwardsTimelineSectionProps {
  tagText: string;
  titlePart1: string | React.ReactNode;
  titlePart2: string | React.ReactNode;
  items: DepartmentAwardsTimelineItem[];
  containerClassName?: string;
  backgroundColor?: string;
}

function getVisibleItemCount(viewportWidth: number) {
  if (viewportWidth >= 1024) {
    return 3;
  }

  if (viewportWidth >= 768) {
    return 2;
  }

  return 1;
}

function getTrackGap(viewportWidth: number) {
  if (viewportWidth >= 1024) {
    return 48;
  }

  if (viewportWidth >= 768) {
    return 28;
  }

  return 20;
}

function TimelineBlock({ block }: { block: DepartmentTimelineBlock }) {
  if (block.variant === 'card') {
    return (
      <div
        className="mx-auto flex min-h-[146px] w-full max-w-[210px] items-center justify-center bg-[#A1DF0A] px-5 py-6 text-center shadow-[0_18px_40px_rgba(82,122,8,0.16)] md:max-w-[220px] lg:min-h-[128px] lg:max-w-[230px] lg:px-4 lg:py-5"
        style={{
          borderTopLeftRadius: '50px',
          borderTopRightRadius: '0px',
          borderBottomRightRadius: '50px',
          borderBottomLeftRadius: '0px',
        }}
      >
        <p className="text-[15px] font-medium leading-[1.8] text-[#111111] md:text-[16px]">
          {block.content}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[320px] flex-col items-center justify-center text-center">
      {block.lines?.map((line, index) => (
        <p
          key={`${line}-${index}`}
          className={`text-[15px] leading-[1.75] text-[#2E7D32] md:text-[16px] ${
            block.italic ? 'italic' : ''
          } ${index === 0 ? 'font-medium' : 'font-normal'}`}
        >
          {line}
        </p>
      ))}
    </div>
  );
}

function TimelineConnector({
  direction,
  active,
}: {
  direction: 'up' | 'down';
  active: boolean;
}) {
  if (!active) {
    return <div aria-hidden="true" className="h-16 w-px" />;
  }

  return (
    <div
      aria-hidden="true"
      className={`flex h-16 w-full justify-center ${direction === 'up' ? '-mt-6 items-end' : '-mb-6 items-start'}`}
    >
      <div
        className="h-full w-px border-l-2 border-dotted"
        style={{ borderColor: '#111111' }}
      />
    </div>
  );
}

/**
 * Reusable department awards timeline section.
 * Designed to support the current alternating upper/lower layout and future row refinements.
 */
export default function DepartmentAwardsTimelineSection({
  tagText,
  titlePart1,
  titlePart2,
  items,
  containerClassName = '',
  backgroundColor = 'rgba(161, 223, 10, 0.17)',
}: DepartmentAwardsTimelineSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const timelineViewportRef = useRef<HTMLDivElement | null>(null);
  const [windowWidth, setWindowWidth] = useState(1440);
  const [timelineViewportWidth, setTimelineViewportWidth] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [desktopScrollProgress, setDesktopScrollProgress] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const syncWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    syncWindowWidth();
    window.addEventListener('resize', syncWindowWidth);

    return () => {
      window.removeEventListener('resize', syncWindowWidth);
    };
  }, []);

  useEffect(() => {
    const node = timelineViewportRef.current;

    if (!node) {
      return;
    }

    const updateTimelineViewportWidth = () => {
      setTimelineViewportWidth(node.clientWidth);
    };

    updateTimelineViewportWidth();

    const observer = new ResizeObserver(() => {
      updateTimelineViewportWidth();
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  const visibleItemCount = getVisibleItemCount(windowWidth);
  const trackGap = getTrackGap(windowWidth);
  const maxStartIndex = Math.max(0, items.length - visibleItemCount);
  const isDesktop = windowWidth >= 1024;
  const boundedStartIndex = Math.min(startIndex, maxStartIndex);
  const visibleItems = items.slice(boundedStartIndex, boundedStartIndex + visibleItemCount);
  const arrowColor = 'rgba(161, 223, 10, 1)';
  const desktopCardWidth =
    timelineViewportWidth > 0
      ? (timelineViewportWidth - trackGap * Math.max(visibleItemCount - 1, 0)) / visibleItemCount
      : 0;
  const desktopTranslateX =
    maxStartIndex > 0 ? desktopScrollProgress * maxStartIndex * (desktopCardWidth + trackGap) : 0;
  const desktopActiveIndex = Math.round(desktopScrollProgress * maxStartIndex);
  const canGoPrevious = isDesktop ? desktopActiveIndex > 0 : boundedStartIndex > 0;
  const canGoNext = isDesktop ? desktopActiveIndex < maxStartIndex : boundedStartIndex < maxStartIndex;

  useEffect(() => {
    if (typeof window === 'undefined' || !isDesktop || !sectionRef.current) {
      return;
    }

    const sectionNode = sectionRef.current;
    const animatedProgress = { value: 0 };
    const targetProgress = { value: 0 };
    let animationFrameId = 0;

    const animateTo = () => {
      if (animationFrameId !== 0) {
        return;
      }

      const tick = () => {
        animatedProgress.value += (targetProgress.value - animatedProgress.value) * 0.14;

        if (Math.abs(targetProgress.value - animatedProgress.value) < 0.001) {
          animatedProgress.value = targetProgress.value;
        }

        setDesktopScrollProgress(animatedProgress.value);

        if (Math.abs(targetProgress.value - animatedProgress.value) >= 0.001) {
          animationFrameId = window.requestAnimationFrame(tick);
          return;
        }

        animationFrameId = 0;
      };

      animationFrameId = window.requestAnimationFrame(tick);
    };

    const syncDesktopProgress = () => {
      const rect = sectionNode.getBoundingClientRect();
      const scrollDistance = Math.max(sectionNode.offsetHeight - window.innerHeight, 1);
      targetProgress.value = Math.min(Math.max(-rect.top / scrollDistance, 0), 1);

      animateTo();
    };

    syncDesktopProgress();
    window.addEventListener('scroll', syncDesktopProgress, { passive: true });
    window.addEventListener('resize', syncDesktopProgress);

    return () => {
      window.removeEventListener('scroll', syncDesktopProgress);
      window.removeEventListener('resize', syncDesktopProgress);

      if (animationFrameId !== 0) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isDesktop, maxStartIndex]);

  const handlePrevious = () => {
    if (isDesktop && sectionRef.current && typeof window !== 'undefined') {
      const sectionTop = window.scrollY + sectionRef.current.getBoundingClientRect().top;
      const targetIndex = Math.max(desktopActiveIndex - 1, 0);

      window.scrollTo({
        top: sectionTop + targetIndex * window.innerHeight,
        behavior: 'smooth',
      });

      return;
    }

    startTransition(() => {
      setStartIndex((current) => Math.max(current - 1, 0));
    });
  };

  const handleNext = () => {
    if (isDesktop && sectionRef.current && typeof window !== 'undefined') {
      const sectionTop = window.scrollY + sectionRef.current.getBoundingClientRect().top;
      const targetIndex = Math.min(desktopActiveIndex + 1, maxStartIndex);

      window.scrollTo({
        top: sectionTop + targetIndex * window.innerHeight,
        behavior: 'smooth',
      });

      return;
    }

    startTransition(() => {
      setStartIndex((current) => Math.min(current + 1, maxStartIndex));
    });
  };

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-20 lg:py-24"
      style={{
        backgroundColor,
        minHeight: isDesktop ? `${(maxStartIndex + 1) * 100}vh` : undefined,
      }}
    >
      <div className={`${isDesktop ? 'sticky top-0 flex min-h-screen items-center py-5 xl:py-6' : ''}`}>
        <div className={`mx-auto w-full max-w-none px-4 md:px-8 xl:px-12 ${containerClassName}`}>
          <div className="flex flex-col items-center text-center">
            <GradientTag
              text={tagText}
              backgroundColor="transparent"
              className="inline-block"
              padding="px-5 py-1.5"
            />

            <GradientTitle
              part1={titlePart1}
              part2={titlePart2}
              lineBreak={false}
              part1Color="dark-green"
              size="custom"
              customSize="clamp(32px, 4vw, 58px)"
              align="center"
              className="mt-4 font-bold leading-[1.02] lg:text-[clamp(28px,3.7vw,54px)]"
            />
          </div>

          <div
            ref={timelineViewportRef}
            className="relative mt-10 overflow-hidden px-0 md:mt-12 lg:px-24 xl:px-28"
          >
            {items.length > visibleItemCount ? (
              <>
                <button
                  type="button"
                  aria-label="Previous awards"
                  onClick={handlePrevious}
                  disabled={!canGoPrevious}
                  className="absolute left-6 top-1/2 z-10 hidden h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_18px_44px_rgba(15,63,29,0.1)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 lg:flex xl:left-8"
                  style={{ color: arrowColor }}
                >
                  <ChevronLeft className="h-7 w-7" strokeWidth={2.2} />
                </button>

                <button
                  type="button"
                  aria-label="Next awards"
                  onClick={handleNext}
                  disabled={!canGoNext}
                  className="absolute right-6 top-1/2 z-10 hidden h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_18px_44px_rgba(15,63,29,0.1)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 lg:flex xl:right-8"
                  style={{ color: arrowColor }}
                >
                  <ChevronRight className="h-7 w-7" strokeWidth={2.2} />
                </button>
              </>
            ) : null}

            {isDesktop ? (
              <div className="relative min-h-[340px] xl:min-h-[360px]">
                <div
                  className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[#111111]/35"
                  aria-hidden="true"
                />

                <div
                  className="flex items-stretch transition-transform duration-500 ease-out will-change-transform"
                  style={{
                    gap: `${trackGap}px`,
                    transform: `translateX(-${desktopTranslateX}px)`,
                  }}
                >
                  {items.map((item) => (
                    <article
                      key={item.id}
                      className="grid min-h-[340px] shrink-0 grid-rows-[1fr_auto_1fr] items-center justify-items-center gap-4 xl:min-h-[360px]"
                      style={{
                        width: desktopCardWidth > 0 ? `${desktopCardWidth}px` : undefined,
                        flexBasis: desktopCardWidth > 0 ? `${desktopCardWidth}px` : undefined,
                      }}
                    >
                      <div className="flex h-full w-full items-end justify-center pb-1">
                        <div className="flex h-full w-full flex-col items-center justify-end">
                          <TimelineBlock block={item.top} />
                          <TimelineConnector direction="down" active={item.top.variant === 'card'} />
                        </div>
                      </div>

                      <div className="relative flex w-full items-center justify-center">
                        <div className="relative z-[1] h-4 w-4 rounded-full bg-white ring-[1px] ring-[#FFFFFF] shadow-[0_0_0_6px_rgba(255,255,255,0.12)]" />
                      </div>

                      <div className="flex h-full w-full items-start justify-center pt-1">
                        <div className="flex h-full w-full flex-col items-center justify-start">
                          <TimelineConnector direction="up" active={item.bottom.variant === 'card'} />
                          <TimelineBlock block={item.bottom} />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              <div className="relative">
                <div
                  className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[#111111]/35"
                  aria-hidden="true"
                />

                <div
                  className="grid gap-10 md:gap-12"
                  style={{ gridTemplateColumns: `repeat(${visibleItems.length}, minmax(0, 1fr))` }}
                >
                  {visibleItems.map((item) => (
                    <article
                      key={item.id}
                      className="grid min-h-[420px] grid-rows-[1fr_auto_1fr] items-center justify-items-center gap-8 md:min-h-[460px]"
                    >
                      <div className="flex h-full w-full items-end justify-center pb-2">
                        <div className="flex h-full w-full flex-col items-center justify-end">
                          <TimelineBlock block={item.top} />
                          <TimelineConnector direction="down" active={item.top.variant === 'card'} />
                        </div>
                      </div>

                      <div className="relative flex w-full items-center justify-center">
                        <div className="relative z-[1] h-4 w-4 rounded-full bg-white ring-[1px] ring-[#FFFFFF] shadow-[0_0_0_6px_rgba(255,255,255,0.12)]" />
                      </div>

                      <div className="flex h-full w-full items-start justify-center pt-2">
                        <div className="flex h-full w-full flex-col items-center justify-start">
                          <TimelineConnector direction="up" active={item.bottom.variant === 'card'} />
                          <TimelineBlock block={item.bottom} />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {items.length > visibleItemCount ? (
              <div className="mt-10 flex items-center justify-center gap-3 lg:hidden">
                <button
                  type="button"
                  aria-label="Previous awards"
                  onClick={handlePrevious}
                  disabled={!canGoPrevious}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_12px_28px_rgba(15,63,29,0.08)] disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ color: arrowColor }}
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
                </button>
                <button
                  type="button"
                  aria-label="Next awards"
                  onClick={handleNext}
                  disabled={!canGoNext}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_12px_28px_rgba(15,63,29,0.08)] disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ color: arrowColor }}
                >
                  <ChevronRight className="h-5 w-5" strokeWidth={2.2} />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
