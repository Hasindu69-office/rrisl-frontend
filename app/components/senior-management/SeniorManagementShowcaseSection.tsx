'use client';

import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { startTransition, useEffect, useRef, useState } from 'react';
import type { SeniorManagementShowcaseItem } from '../../senior-management/showcaseData';

interface SeniorManagementShowcaseSectionProps {
  items: SeniorManagementShowcaseItem[];
}

type NavigationDirection = 'next' | 'previous';

interface ShowcaseMetrics {
  sectionHeight: number;
  outlineTop: number;
  outlineFontSize: string;
  outlineWidth: string;
  activeTop: number;
  activeWidth: number;
  activeHeight: number;
  thumbSize: number;
  thumbTop: number;
  cardTop: number;
  cardWidth: number;
  cardHeight: number;
    sidePositions: {
      farLeft: string;
      left: string;
      center: string;
      right: string;
    farRight: string;
    hiddenLeft: string;
    hiddenRight: string;
  };
}

interface SlideVisualStyle {
  left: string;
  top: number;
  width: number;
  height: number;
  opacity: number;
  scale: number;
  zIndex: number;
  grayscale: boolean;
}

interface FadeVisualStyle {
  left: string;
  opacity: number;
  translateX: number;
  scale: number;
  zIndex: number;
}

const AUTO_ADVANCE_INTERVAL_MS = 4500;

function getSafeIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

function getWrappedOffset(index: number, activeIndex: number, total: number) {
  let offset = index - activeIndex;

  if (offset > total / 2) {
    offset -= total;
  }

  if (offset < -total / 2) {
    offset += total;
  }

  return offset;
}

function getShowcaseMetrics(viewportWidth: number): ShowcaseMetrics {
  if (viewportWidth >= 1280) {
    return {
      sectionHeight: 605,
      outlineTop: 48,
      outlineFontSize: 'clamp(88px, 9vw, 132px)',
      outlineWidth: '100%',
      activeTop: 58,
      activeWidth: 430,
      activeHeight: 455,
      thumbSize: 118,
      thumbTop: 315,
      cardTop: 336,
      cardWidth: 390,
      cardHeight: 264,
      sidePositions: {
        farLeft: '6%',
        left: '27%',
        center: '50%',
        right: '73%',
        farRight: '94%',
        hiddenLeft: '-16%',
        hiddenRight: '116%',
      },
    };
  }

  if (viewportWidth >= 1024) {
    return {
      sectionHeight: 568,
      outlineTop: 50,
      outlineFontSize: 'clamp(76px, 8.8vw, 116px)',
      outlineWidth: '108%',
      activeTop: 70,
      activeWidth: 380,
      activeHeight: 420,
      thumbSize: 108,
      thumbTop: 310,
      cardTop: 336,
      cardWidth: 370,
      cardHeight: 256,
      sidePositions: {
        farLeft: '7%',
        left: '25%',
        center: '50%',
        right: '75%',
        farRight: '93%',
        hiddenLeft: '-16%',
        hiddenRight: '116%',
      },
    };
  }

  if (viewportWidth >= 768) {
    return {
      sectionHeight: 625,
      outlineTop: 56,
      outlineFontSize: 'clamp(78px, 11.8vw, 118px)',
      outlineWidth: '132%',
      activeTop: 70,
      activeWidth: 320,
      activeHeight: 360,
      thumbSize: 94,
      thumbTop: 315,
      cardTop: 356,
      cardWidth: 345,
      cardHeight: 262,
      sidePositions: {
        farLeft: '8%',
        left: '24%',
        center: '50%',
        right: '76%',
        farRight: '92%',
        hiddenLeft: '-18%',
        hiddenRight: '118%',
      },
    };
  }

  return {
    sectionHeight: 584,
    outlineTop: 62,
    outlineFontSize: 'clamp(64px, 17vw, 104px)',
    outlineWidth: '182%',
    activeTop: 68,
    activeWidth: 255,
    activeHeight: 300,
    thumbSize: 76,
    thumbTop: 295,
    cardTop: 328,
    cardWidth: 310,
    cardHeight: 250,
    sidePositions: {
      farLeft: '-18%',
      left: '15%',
      center: '50%',
      right: '85%',
      farRight: '118%',
      hiddenLeft: '-22%',
      hiddenRight: '122%',
    },
  };
}

function getImageStyle(
  metrics: ShowcaseMetrics,
  offset: number,
  direction: NavigationDirection,
  mobileOnlyThreeUp: boolean
): SlideVisualStyle {
  const { sidePositions } = metrics;

  if (mobileOnlyThreeUp && Math.abs(offset) > 1) {
    return {
      left: offset < 0 ? sidePositions.hiddenLeft : sidePositions.hiddenRight,
      top: metrics.thumbTop,
      width: metrics.thumbSize,
      height: metrics.thumbSize,
      opacity: 0,
      scale: 0.72,
      zIndex: 0,
      grayscale: true,
    };
  }

  switch (offset) {
    case -2:
      return {
        left: sidePositions.farLeft,
        top: metrics.thumbTop,
        width: metrics.thumbSize,
        height: metrics.thumbSize,
        opacity: 0.45,
        scale: 0.82,
        zIndex: 1,
        grayscale: true,
      };
    case -1:
      return {
        left: sidePositions.left,
        top: metrics.thumbTop,
        width: metrics.thumbSize,
        height: metrics.thumbSize,
        opacity: 0.86,
        scale: 1,
        zIndex: 2,
        grayscale: true,
      };
    case 0:
      return {
        left: sidePositions.center,
        top: metrics.activeTop,
        width: metrics.activeWidth,
        height: metrics.activeHeight,
        opacity: 1,
        scale: 1,
        zIndex: 4,
        grayscale: false,
      };
    case 1:
      return {
        left: sidePositions.right,
        top: metrics.thumbTop,
        width: metrics.thumbSize,
        height: metrics.thumbSize,
        opacity: 0.86,
        scale: 1,
        zIndex: 2,
        grayscale: true,
      };
    case 2:
      return {
        left: sidePositions.farRight,
        top: metrics.thumbTop,
        width: metrics.thumbSize,
        height: metrics.thumbSize,
        opacity: 0.45,
        scale: 0.82,
        zIndex: 1,
        grayscale: true,
      };
    default:
      return {
        left: offset < 0 || direction === 'previous'
          ? sidePositions.hiddenLeft
          : sidePositions.hiddenRight,
        top: metrics.thumbTop,
        width: metrics.thumbSize,
        height: metrics.thumbSize,
        opacity: 0,
        scale: 0.72,
        zIndex: 0,
        grayscale: true,
      };
  }
}

function getCardStyle(
  metrics: ShowcaseMetrics,
  offset: number,
  direction: NavigationDirection
): FadeVisualStyle {
  const { sidePositions } = metrics;

  switch (offset) {
    case 0:
      return {
        left: sidePositions.center,
        opacity: 1,
        translateX: -50,
        scale: 1,
        zIndex: 5,
      };
    case -1:
      return {
        left: sidePositions.center,
        opacity: 0,
        translateX: -62,
        scale: 0.96,
        zIndex: 3,
      };
    case 1:
      return {
        left: sidePositions.center,
        opacity: 0,
        translateX: -38,
        scale: 0.96,
        zIndex: 3,
      };
    default:
      return {
        left:
          direction === 'previous'
            ? sidePositions.hiddenLeft
            : sidePositions.hiddenRight,
        opacity: 0,
        translateX: -50,
        scale: 0.94,
        zIndex: 0,
      };
  }
}

function getOutlineStyle(
  metrics: ShowcaseMetrics,
  offset: number,
  direction: NavigationDirection
): FadeVisualStyle {
  const { sidePositions } = metrics;

  switch (offset) {
    case 0:
      return {
        left: sidePositions.center,
        opacity: 1,
        translateX: -50,
        scale: 1,
        zIndex: 0,
      };
    case -1:
      return {
        left: sidePositions.center,
        opacity: 0,
        translateX: -62,
        scale: 0.97,
        zIndex: 0,
      };
    case 1:
      return {
        left: sidePositions.center,
        opacity: 0,
        translateX: -38,
        scale: 0.97,
        zIndex: 0,
      };
    default:
      return {
        left:
          direction === 'previous'
            ? sidePositions.hiddenLeft
            : sidePositions.hiddenRight,
        opacity: 0,
        translateX: -50,
        scale: 0.95,
        zIndex: 0,
      };
  }
}

export default function SeniorManagementShowcaseSection({
  items,
}: SeniorManagementShowcaseSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const autoplayTimeoutRef = useRef<number | null>(null);
  const descriptionRefs = useRef<
    Record<string, HTMLParagraphElement | null>
  >({});

  const [viewportWidth, setViewportWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [navigationDirection, setNavigationDirection] =
    useState<NavigationDirection>('next');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [overflowingItemIds, setOverflowingItemIds] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const node = sectionRef.current;

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

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateMotionPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updateMotionPreference();
    mediaQuery.addEventListener('change', updateMotionPreference);

    return () => {
      mediaQuery.removeEventListener('change', updateMotionPreference);
    };
  }, []);

  const clearAutoplay = () => {
    if (autoplayTimeoutRef.current !== null) {
      window.clearTimeout(autoplayTimeoutRef.current);
      autoplayTimeoutRef.current = null;
    }
  };

  const moveToIndex = (nextIndex: number, direction: NavigationDirection) => {
    clearAutoplay();
    setNavigationDirection(direction);

    startTransition(() => {
      setActiveIndex(nextIndex);
    });
  };

  const goToPrevious = () => {
    if (items.length <= 1) {
      return;
    }

    moveToIndex(getSafeIndex(activeIndex - 1, items.length), 'previous');
  };

  const goToNext = () => {
    if (items.length <= 1) {
      return;
    }

    moveToIndex(getSafeIndex(activeIndex + 1, items.length), 'next');
  };

  const toggleExpandedItem = (itemId: string) => {
    setExpandedItemId((current) => (current === itemId ? null : itemId));
  };

  useEffect(() => {
    if (typeof window === 'undefined' || items.length <= 1) {
      return;
    }

    clearAutoplay();

    autoplayTimeoutRef.current = window.setTimeout(() => {
      setNavigationDirection('next');
      startTransition(() => {
        setActiveIndex((currentIndex) =>
          getSafeIndex(currentIndex + 1, items.length)
        );
      });
    }, AUTO_ADVANCE_INTERVAL_MS);

    return () => {
      clearAutoplay();
    };
  }, [activeIndex, items.length]);

  useEffect(() => {
    setExpandedItemId(null);
  }, [activeIndex]);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const nextOverflowingState: Record<string, boolean> = {};

      items.forEach((item) => {
        const node = descriptionRefs.current[item.id];

        if (!node) {
          nextOverflowingState[item.id] = false;
          return;
        }

        nextOverflowingState[item.id] =
          node.scrollHeight - node.clientHeight > 1;
      });

      setOverflowingItemIds(nextOverflowingState);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [items, viewportWidth, activeIndex, expandedItemId]);

  if (items.length === 0) {
    return null;
  }

  const metrics = getShowcaseMetrics(viewportWidth);
  const isMobileViewport = viewportWidth < 768;
  const expandedMobileSectionHeight =
    isMobileViewport && expandedItemId ? metrics.sectionHeight + 180 : metrics.sectionHeight;
  const transitionDuration = prefersReducedMotion ? '180ms' : '760ms';

  return (
    <section
      ref={sectionRef}
      className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-white"
      style={{
        height: `${expandedMobileSectionHeight}px`,
      }}
    >
      <div className="relative mx-auto h-full w-full max-w-[1920px]">
        {items.map((item, index) => {
          const offset = getWrappedOffset(index, activeIndex, items.length);
          const mobileOnlyThreeUp = viewportWidth < 768;
          const imageStyle = getImageStyle(
            metrics,
            offset,
            navigationDirection,
            mobileOnlyThreeUp
          );
          const outlineStyle = getOutlineStyle(
            metrics,
            offset,
            navigationDirection
          );
          const cardStyle = getCardStyle(metrics, offset, navigationDirection);
          const isVisible = mobileOnlyThreeUp
            ? Math.abs(offset) <= 1
            : Math.abs(offset) <= 2;
          const isActive = offset === 0;
          const isExpanded = expandedItemId === item.id;
          const isMobileExpandedCard = isMobileViewport && isActive && isExpanded;
          const shouldShowReadMore =
            isExpanded || (overflowingItemIds[item.id] ?? false);

          return (
            <div key={item.id}>
              <div
                className="pointer-events-none absolute select-none whitespace-nowrap font-semibold leading-none text-transparent transition-[left,opacity,transform] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  left: outlineStyle.left,
                  top: `${metrics.outlineTop}px`,
                  width: metrics.outlineWidth,
                  height: '1.1em',
                  opacity: outlineStyle.opacity,
                  zIndex: outlineStyle.zIndex,
                  fontSize: metrics.outlineFontSize,
                  transform: `translateX(${outlineStyle.translateX}%) scale(${outlineStyle.scale})`,
                  transitionDuration,
                }}
                aria-hidden="true"
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 1200 220"
                  preserveAspectRatio="xMidYMid meet"
                  className="overflow-visible"
                >
                  <defs>
                    <linearGradient
                      id={`senior-management-outline-${item.id}`}
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#20C997" />
                      <stop offset="100%" stopColor="#A1DF0A" />
                    </linearGradient>
                  </defs>
                  <text
                    x="50%"
                    y="56%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="transparent"
                    stroke={`url(#senior-management-outline-${item.id})`}
                    strokeWidth="0.8"
                    paintOrder="stroke"
                    style={{
                      fontSize: 'inherit',
                      fontWeight: 600,
                      fontFamily: 'inherit',
                    }}
                  >
                    {item.role}
                  </text>
                </svg>
              </div>

              <div
                className="absolute overflow-hidden transition-[left,top,width,height,opacity,transform,filter,border-radius,box-shadow] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  left: imageStyle.left,
                  top: `${imageStyle.top}px`,
                  width: `${imageStyle.width}px`,
                  height: `${imageStyle.height}px`,
                  opacity: imageStyle.opacity,
                  zIndex: imageStyle.zIndex,
                  borderRadius: isActive ? '0px' : '9999px',
                  boxShadow: isActive
                    ? 'none'
                    : '0 22px 60px rgba(15, 63, 29, 0.08)',
                  transform: `translateX(-50%) scale(${imageStyle.scale})`,
                  filter: imageStyle.grayscale
                    ? 'grayscale(100%)'
                    : 'grayscale(0%)',
                  transitionDuration,
                  pointerEvents: isVisible ? 'auto' : 'none',
                }}
                aria-hidden={!isVisible}
              >
                <Image
                  src={item.imageSrc}
                  alt={isActive ? item.imageAlt : ''}
                  fill
                  priority={index === activeIndex}
                  className={isActive ? 'object-contain object-bottom' : 'object-cover object-top'}
                  sizes={
                    isActive
                      ? '(max-width: 767px) 255px, (max-width: 1023px) 320px, (max-width: 1279px) 380px, 430px'
                      : `${metrics.thumbSize}px`
                  }
                  style={{
                    transform: isActive ? 'scale(1.01)' : 'scale(1.2)',
                    transformOrigin: isActive ? 'center bottom' : 'center top',
                  }}
                />
              </div>

              <div
                className="absolute transition-[left,opacity,transform] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  left: cardStyle.left,
                  top: `${metrics.cardTop}px`,
                  width: `${metrics.cardWidth}px`,
                  opacity: cardStyle.opacity,
                  zIndex: cardStyle.zIndex,
                  transform: `translateX(${cardStyle.translateX}%) scale(${cardStyle.scale})`,
                  transitionDuration,
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
                aria-hidden={!isActive}
              >
                <article
                  className="flex rounded-[12px] bg-[#F5F5F5] px-7 py-5"
                  style={{
                    minHeight: `${metrics.cardHeight}px`,
                    height: isMobileExpandedCard ? 'auto' : `${metrics.cardHeight}px`,
                  }}
                >
                  <div className="flex min-h-0 flex-1 flex-col">
                    <p className="text-[15px] font-normal leading-[1.25] text-[#111111]">
                      {item.role}
                    </p>

                    <h2 className="mt-1 text-[14px] font-medium leading-[1.35] text-[#2E7D32]">
                      {item.name}
                    </h2>

                    <div
                      className={`mt-5 ${
                        isMobileExpandedCard ? '' : 'min-h-0 flex-1'
                      }`}
                    >
                      <p
                        ref={(node) => {
                          descriptionRefs.current[item.id] = node;
                        }}
                        className={`text-[13px] leading-[1.9] text-[#2B2B2B] text-justify ${
                          isExpanded
                            ? isMobileExpandedCard
                              ? ''
                              : 'location-details-scroll h-full overflow-y-auto pr-2'
                            : 'overflow-hidden'
                        }`}
                        style={
                          isExpanded
                            ? undefined
                            : {
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 4,
                              }
                        }
                      >
                        {item.description}
                      </p>

                      {shouldShowReadMore ? (
                        <button
                          type="button"
                          onClick={() => toggleExpandedItem(item.id)}
                          onTouchEnd={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            toggleExpandedItem(item.id);
                          }}
                          onPointerUp={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                          }}
                          className="relative z-10 mt-2 touch-manipulation text-[12px] font-medium text-[#2E7D32] transition hover:text-[#1F5C25]"
                        >
                          {isExpanded ? 'Read less' : 'Read more'}
                        </button>
                      ) : null}
                    </div>

                    <div className="mt-5 flex justify-end gap-3">
                      <button
                        type="button"
                        aria-label="Show previous senior management profile"
                        onClick={goToPrevious}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#053D1B] text-white transition duration-300 hover:bg-[#0A5729] disabled:cursor-not-allowed disabled:opacity-45"
                        disabled={items.length <= 1}
                      >
                        <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
                      </button>

                      <button
                        type="button"
                        aria-label="Show next senior management profile"
                        onClick={goToNext}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#053D1B] text-white transition duration-300 hover:bg-[#0A5729] disabled:cursor-not-allowed disabled:opacity-45"
                        disabled={items.length <= 1}
                      >
                        <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
