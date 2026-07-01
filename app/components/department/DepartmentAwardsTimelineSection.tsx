'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
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

const DESKTOP_END_HOLD_VIEWPORT_COUNT = 1;

function TimelineBlock({
  block,
  compact = false,
}: {
  block: DepartmentTimelineBlock;
  compact?: boolean;
}) {
  if (block.variant === 'card') {
    return (
      <div
        className={`mx-auto flex w-full items-center justify-center bg-[#A1DF0A] text-center shadow-[0_18px_40px_rgba(82,122,8,0.16)] ${
          compact
            ? 'min-h-[144px] max-w-[260px] px-5 py-5 md:min-h-[160px] md:max-w-[300px] md:px-6'
            : 'min-h-[146px] max-w-[210px] px-5 py-6 md:max-w-[220px] lg:min-h-[128px] lg:max-w-[230px] lg:px-4 lg:py-5'
        }`}
        style={{
          borderTopLeftRadius: '50px',
          borderTopRightRadius: '0px',
          borderBottomRightRadius: '50px',
          borderBottomLeftRadius: '0px',
        }}
      >
        <p
          className={`font-medium text-[#111111] ${
            compact ? 'text-[14px] leading-[1.7] md:text-[15px]' : 'text-[15px] leading-[1.8] md:text-[16px]'
          }`}
        >
          {block.content}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`mx-auto flex w-full flex-col items-center justify-center text-center ${
        compact ? 'max-w-[280px] md:max-w-[320px]' : 'max-w-[320px]'
      }`}
    >
      {block.lines?.map((line, index) => (
        <p
          key={`${line}-${index}`}
          className={`text-[#2E7D32] ${block.italic ? 'italic' : ''} ${
            index === 0 ? 'font-medium' : 'font-normal'
          } ${compact ? 'text-[14px] leading-[1.6] md:text-[15px]' : 'text-[15px] leading-[1.75] md:text-[16px]'}`}
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
      <div className="h-full w-px border-l-2 border-dotted" style={{ borderColor: '#111111' }} />
    </div>
  );
}

export default function DepartmentAwardsTimelineSection({
  tagText,
  titlePart1,
  titlePart2,
  items,
  containerClassName = '',
  backgroundColor = 'rgba(161, 223, 10, 0.17)',
}: DepartmentAwardsTimelineSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stickyContainerRef = useRef<HTMLDivElement | null>(null);
  const timelineViewportRef = useRef<HTMLDivElement | null>(null);
  const desktopTrackRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const mobileSlideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const desktopActiveIndexRef = useRef(0);
  const [windowWidth, setWindowWidth] = useState(1440);
  const [timelineViewportWidth, setTimelineViewportWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

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

  const isDesktop = windowWidth >= 1024;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const visibleItemCount = getVisibleItemCount(windowWidth);
  const trackGap = getTrackGap(windowWidth);
  const desktopMaxStartIndex = Math.max(0, items.length - visibleItemCount);
  const hasPinnedDesktopTimeline = isDesktop && desktopMaxStartIndex > 0;
  const desktopCardWidth =
    timelineViewportWidth > 0
      ? (timelineViewportWidth - trackGap * Math.max(visibleItemCount - 1, 0)) / visibleItemCount
      : 0;
  const desktopTimelineLineWidth =
    desktopCardWidth > 0 && items.length > 1 ? (items.length - 1) * (desktopCardWidth + trackGap) : 0;
  const boundedActiveIndex = Math.min(activeIndex, Math.max(items.length - 1, 0));
  const mobileCardWidth = useMemo(() => {
    if (timelineViewportWidth <= 0) {
      return 0;
    }

    if (isTablet) {
      return Math.min(timelineViewportWidth * 0.7, 520);
    }

    return Math.max(timelineViewportWidth - 52, 260);
  }, [isTablet, timelineViewportWidth]);
  const mobileTimelineLineWidth =
    mobileCardWidth > 0 && items.length > 1 ? (items.length - 1) * (mobileCardWidth + trackGap) : 0;
  const mobileCarouselPadding = isTablet ? 56 : 32;

  const arrowColor = 'rgba(161, 223, 10, 1)';
  const totalMobileItems = items.length;
  const canGoPrevious = boundedActiveIndex > 0;
  const canGoNext = isDesktop
    ? boundedActiveIndex < desktopMaxStartIndex
    : boundedActiveIndex < totalMobileItems - 1;

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current || !isDesktop) {
      return;
    }

    const sectionNode = sectionRef.current;
    const desktopTrackNode = desktopTrackRef.current;

    if (!desktopTrackNode) {
      return;
    }

    const animatedProgress = { value: 0 };
    const targetProgress = { value: 0 };
    let animationFrameId = 0;
    let lastRenderedTranslate = -1;

    const renderProgress = (progress: number) => {
      const nextTranslate =
        desktopMaxStartIndex > 0 ? progress * desktopMaxStartIndex * (desktopCardWidth + trackGap) : 0;

      if (Math.abs(nextTranslate - lastRenderedTranslate) > 0.1) {
        desktopTrackNode.style.transform = `translate3d(-${nextTranslate}px, 0, 0)`;
        lastRenderedTranslate = nextTranslate;
      }

      const nextActiveIndex = Math.round(progress * desktopMaxStartIndex);

      if (nextActiveIndex !== desktopActiveIndexRef.current) {
        desktopActiveIndexRef.current = nextActiveIndex;
        setActiveIndex(nextActiveIndex);
      }
    };

    const animateTo = () => {
      if (animationFrameId !== 0) {
        return;
      }

      const tick = () => {
        animatedProgress.value += (targetProgress.value - animatedProgress.value) * 0.14;

        if (Math.abs(targetProgress.value - animatedProgress.value) < 0.001) {
          animatedProgress.value = targetProgress.value;
        }

        renderProgress(animatedProgress.value);

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
      const totalScrollDistance = Math.max(sectionNode.offsetHeight - window.innerHeight, 1);
      const endHoldDistance = window.innerHeight * DESKTOP_END_HOLD_VIEWPORT_COUNT;
      const horizontalScrollDistance = Math.max(totalScrollDistance - endHoldDistance, 1);

      targetProgress.value = Math.min(Math.max(-rect.top / horizontalScrollDistance, 0), 1);
      animateTo();
    };

    renderProgress(0);
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
  }, [desktopCardWidth, desktopMaxStartIndex, isDesktop, trackGap]);

  useEffect(() => {
    if (isDesktop) {
      return;
    }

    const carouselNode = carouselRef.current;

    if (!carouselNode) {
      return;
    }

    const visibleSlides = mobileSlideRefs.current.filter(Boolean) as HTMLDivElement[];

    if (visibleSlides.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let nextIndex = activeIndex;
        let bestRatio = 0;

        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const candidateIndex = Number((entry.target as HTMLElement).dataset.index ?? -1);

          if (candidateIndex >= 0 && entry.intersectionRatio >= bestRatio) {
            bestRatio = entry.intersectionRatio;
            nextIndex = candidateIndex;
          }
        });

        if (nextIndex !== activeIndex) {
          setActiveIndex(nextIndex);
        }
      },
      {
        root: carouselNode,
        threshold: [0.55, 0.7, 0.9],
      }
    );

    visibleSlides.forEach((slide) => observer.observe(slide));

    return () => {
      observer.disconnect();
    };
  }, [activeIndex, isDesktop, items.length]);

  const scrollToMobileSlide = (targetIndex: number) => {
    const slideNode = mobileSlideRefs.current[targetIndex];

    if (!slideNode) {
      return;
    }

    slideNode.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  };

  const handlePrevious = () => {
    if (isDesktop) {
      if (sectionRef.current && typeof window !== 'undefined') {
        const sectionTop = window.scrollY + sectionRef.current.getBoundingClientRect().top;
        const totalScrollDistance = Math.max(sectionRef.current.offsetHeight - window.innerHeight, 1);
        const endHoldDistance = window.innerHeight * DESKTOP_END_HOLD_VIEWPORT_COUNT;
        const horizontalScrollDistance = Math.max(totalScrollDistance - endHoldDistance, 1);
        const scrollStep = desktopMaxStartIndex > 0 ? horizontalScrollDistance / desktopMaxStartIndex : 0;
        const targetIndex = Math.max(boundedActiveIndex - 1, 0);

        window.scrollTo({
          top: sectionTop + targetIndex * scrollStep,
          behavior: 'smooth',
        });
      }

      return;
    }

    scrollToMobileSlide(Math.max(boundedActiveIndex - 1, 0));
  };

  const handleNext = () => {
    if (isDesktop) {
      if (sectionRef.current && typeof window !== 'undefined') {
        const sectionTop = window.scrollY + sectionRef.current.getBoundingClientRect().top;
        const totalScrollDistance = Math.max(sectionRef.current.offsetHeight - window.innerHeight, 1);
        const endHoldDistance = window.innerHeight * DESKTOP_END_HOLD_VIEWPORT_COUNT;
        const horizontalScrollDistance = Math.max(totalScrollDistance - endHoldDistance, 1);
        const scrollStep = desktopMaxStartIndex > 0 ? horizontalScrollDistance / desktopMaxStartIndex : 0;
        const targetIndex = Math.min(boundedActiveIndex + 1, desktopMaxStartIndex);

        window.scrollTo({
          top: sectionTop + targetIndex * scrollStep,
          behavior: 'smooth',
        });
      }

      return;
    }

    scrollToMobileSlide(Math.min(boundedActiveIndex + 1, totalMobileItems - 1));
  };

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-20 lg:py-24"
      style={{
        backgroundColor,
        minHeight: hasPinnedDesktopTimeline
          ? `${(desktopMaxStartIndex + 1 + DESKTOP_END_HOLD_VIEWPORT_COUNT) * 100}vh`
          : undefined,
      }}
    >
      <div className={`mx-auto w-full max-w-none px-4 md:px-8 xl:px-12 ${containerClassName}`}>
        <div className="flex justify-center text-center" data-department-reveal>
          <GradientTag
            text={tagText}
            backgroundColor="transparent"
            className="inline-block"
            padding="px-5 py-1.5"
          />
        </div>
      </div>

      <div
        ref={stickyContainerRef}
        className={`${hasPinnedDesktopTimeline ? 'sticky top-0 flex min-h-screen items-center py-5 xl:py-6' : ''}`}
      >
        <div className={`mx-auto w-full max-w-none px-4 md:px-8 xl:px-12 ${containerClassName}`}>
          <div className="flex flex-col items-center text-center" data-department-reveal>
            <GradientTitle
              part1={titlePart1}
              part2={titlePart2}
              lineBreak={false}
              part1Color="dark-green"
              size="custom"
              customSize="clamp(32px, 4vw, 58px)"
              align="center"
              className={`${hasPinnedDesktopTimeline ? 'lg:mt-0' : 'mt-4'} font-bold leading-[1.02] lg:text-[clamp(28px,3.7vw,54px)]`}
            />
          </div>

          <div
            ref={timelineViewportRef}
            data-department-reveal
            className={`relative mt-10 ${isDesktop ? 'overflow-hidden px-0 md:mt-12 lg:px-24 xl:px-28' : 'px-0 md:mt-12'}`}
          >
            {items.length > visibleItemCount ? (
              <>
                {canGoPrevious ? (
                  <button
                    type="button"
                    aria-label="Previous awards"
                    onClick={handlePrevious}
                    className="absolute left-2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_12px_28px_rgba(15,63,29,0.08)] transition hover:scale-[1.02] md:left-4 md:h-14 md:w-14 lg:left-6 lg:h-16 lg:w-16 lg:shadow-[0_18px_44px_rgba(15,63,29,0.1)] xl:left-8"
                    style={{ color: arrowColor, top: isDesktop ? '50%' : isTablet ? '32%' : '29%' }}
                  >
                    <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" strokeWidth={2.2} />
                  </button>
                ) : null}

                {canGoNext ? (
                  <button
                    type="button"
                    aria-label="Next awards"
                    onClick={handleNext}
                    className="absolute right-2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_12px_28px_rgba(15,63,29,0.08)] transition hover:scale-[1.02] md:right-4 md:h-14 md:w-14 lg:right-6 lg:h-16 lg:w-16 lg:shadow-[0_18px_44px_rgba(15,63,29,0.1)] xl:right-8"
                    style={{ color: arrowColor, top: isDesktop ? '50%' : isTablet ? '32%' : '29%' }}
                  >
                    <ChevronRight className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" strokeWidth={2.2} />
                  </button>
                ) : null}
              </>
            ) : null}

            {isDesktop ? (
              <div className="relative min-h-[340px] xl:min-h-[360px]">
                <div
                  ref={desktopTrackRef}
                  className="relative flex items-stretch will-change-transform"
                  style={{
                    gap: `${trackGap}px`,
                    transform: 'translate3d(0, 0, 0)',
                  }}
                >
                  {desktopTimelineLineWidth > 0 ? (
                    <div
                      className="pointer-events-none absolute top-1/2 h-px -translate-y-1/2 bg-[#111111]/35"
                      style={{
                        left: `${desktopCardWidth / 2}px`,
                        width: `${desktopTimelineLineWidth}px`,
                      }}
                      aria-hidden="true"
                    />
                  ) : null}

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
              <div className="relative pb-12">
                <div
                  ref={carouselRef}
                  className="relative flex snap-x snap-mandatory gap-5 overflow-x-auto px-8 pb-4 pt-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:gap-7 md:px-14"
                >
                  {mobileTimelineLineWidth > 0 ? (
                    <div
                      className="pointer-events-none absolute h-px -translate-y-1/2 bg-[#111111]/30"
                      style={{
                        left: `${mobileCarouselPadding + mobileCardWidth / 2}px`,
                        top: isTablet ? '31%' : '29.5%',
                        width: `${mobileTimelineLineWidth}px`,
                      }}
                      aria-hidden="true"
                    />
                  ) : null}

                  {items.map((item, index) => {
                    const markerActive = index === boundedActiveIndex;

                    return (
                      <div
                        key={item.id}
                        ref={(node) => {
                          mobileSlideRefs.current[index] = node;
                        }}
                        data-index={index}
                        className="shrink-0 snap-center"
                        style={{
                          width: mobileCardWidth > 0 ? `${mobileCardWidth}px` : undefined,
                          flexBasis: mobileCardWidth > 0 ? `${mobileCardWidth}px` : undefined,
                        }}
                      >
                        <article className="grid min-h-[300px] grid-rows-[auto_auto_auto] items-center justify-items-center gap-3 md:min-h-[340px] md:gap-4">
                          <div className="flex w-full items-end justify-center pb-2 md:pb-3">
                            {index % 2 === 0 ? (
                              <div className="flex w-full flex-col items-center justify-end">
                                <TimelineBlock block={item.top} compact />
                              </div>
                            ) : (
                              <div className="flex w-full flex-col items-center justify-end">
                                <TimelineBlock block={item.bottom} compact />
                              </div>
                            )}
                          </div>

                          <div className="relative flex w-full items-center justify-center">
                            <div
                              className="relative z-[1] rounded-full transition-all duration-300"
                              style={{
                                width: markerActive ? '18px' : '14px',
                                height: markerActive ? '18px' : '14px',
                                backgroundColor: markerActive ? '#A1DF0A' : '#FFFFFF',
                                boxShadow: markerActive
                                  ? '0 0 0 6px rgba(161,223,10,0.24)'
                                  : '0 0 0 4px rgba(255,255,255,0.12)',
                              }}
                            >
                              {markerActive ? (
                                <div className="absolute inset-[4px] rounded-full bg-white" />
                              ) : null}
                            </div>
                          </div>

                          <div className="flex w-full items-start justify-center pt-2 md:pt-3">
                            {index % 2 === 0 ? (
                              <div className="flex w-full flex-col items-center justify-start">
                                <TimelineBlock block={item.bottom} compact />
                              </div>
                            ) : (
                              <div className="flex w-full flex-col items-center justify-start">
                                <TimelineBlock block={item.top} compact />
                              </div>
                            )}
                          </div>
                        </article>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-2 flex items-center justify-center gap-2 md:hidden">
                  {items.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-label={`Go to award ${index + 1}`}
                      onClick={() => scrollToMobileSlide(index)}
                      className="h-2.5 rounded-full transition-all duration-300"
                      style={{
                        width: index === boundedActiveIndex ? '22px' : '10px',
                        backgroundColor: '#A1DF0A',
                        opacity: index === boundedActiveIndex ? 1 : 0.35,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
