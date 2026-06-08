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
  activeTop: number;
  activeWidth: number;
  activeHeight: number;
  thumbSize: number;
  thumbTop: number;
  cardTop: number;
  cardWidth: number;
  cardMinHeight: number;
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
      sectionHeight: 575,
      outlineTop: 38,
      outlineFontSize: 'clamp(105px, 10.5vw, 158px)',
      activeTop: 58,
      activeWidth: 430,
      activeHeight: 455,
      thumbSize: 118,
      thumbTop: 315,
      cardTop: 312,
      cardWidth: 390,
      cardMinHeight: 188,
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
      sectionHeight: 540,
      outlineTop: 42,
      outlineFontSize: 'clamp(88px, 10vw, 132px)',
      activeTop: 70,
      activeWidth: 380,
      activeHeight: 420,
      thumbSize: 108,
      thumbTop: 310,
      cardTop: 315,
      cardWidth: 370,
      cardMinHeight: 180,
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
      sectionHeight: 505,
      outlineTop: 48,
      outlineFontSize: 'clamp(70px, 11vw, 108px)',
      activeTop: 88,
      activeWidth: 320,
      activeHeight: 360,
      thumbSize: 94,
      thumbTop: 315,
      cardTop: 325,
      cardWidth: 345,
      cardMinHeight: 172,
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
    sectionHeight: 455,
    outlineTop: 54,
    outlineFontSize: 'clamp(48px, 15vw, 78px)',
    activeTop: 92,
    activeWidth: 255,
    activeHeight: 300,
    thumbSize: 76,
    thumbTop: 295,
    cardTop: 285,
    cardWidth: 310,
    cardMinHeight: 165,
    sidePositions: {
      farLeft: '10%',
      left: '24%',
      center: '50%',
      right: '76%',
      farRight: '90%',
      hiddenLeft: '-22%',
      hiddenRight: '122%',
    },
  };
}

function getImageStyle(
  metrics: ShowcaseMetrics,
  offset: number,
  direction: NavigationDirection
): SlideVisualStyle {
  const { sidePositions } = metrics;

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

  const [viewportWidth, setViewportWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [navigationDirection, setNavigationDirection] =
    useState<NavigationDirection>('next');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

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

  if (items.length === 0) {
    return null;
  }

  const metrics = getShowcaseMetrics(viewportWidth);
  const transitionDuration = prefersReducedMotion ? '180ms' : '760ms';

  return (
    <section
      ref={sectionRef}
      className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-white"
      style={{
        height: `${metrics.sectionHeight}px`,
      }}
    >
      <div className="relative mx-auto h-full w-full max-w-[1920px]">
        {items.map((item, index) => {
          const offset = getWrappedOffset(index, activeIndex, items.length);
          const imageStyle = getImageStyle(
            metrics,
            offset,
            navigationDirection
          );
          const outlineStyle = getOutlineStyle(
            metrics,
            offset,
            navigationDirection
          );
          const cardStyle = getCardStyle(metrics, offset, navigationDirection);
          const isVisible = Math.abs(offset) <= 2;
          const isActive = offset === 0;

          return (
            <div key={item.id}>
              <div
                className="pointer-events-none absolute select-none whitespace-nowrap font-semibold leading-none text-transparent transition-[left,opacity,transform] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  left: outlineStyle.left,
                  top: `${metrics.outlineTop}px`,
                  opacity: outlineStyle.opacity,
                  zIndex: outlineStyle.zIndex,
                  fontSize: metrics.outlineFontSize,
                  transform: `translateX(${outlineStyle.translateX}%) scale(${outlineStyle.scale})`,
                  transitionDuration,
                  WebkitTextStroke: '1px rgba(46, 125, 50, 0.22)',
                }}
                aria-hidden="true"
              >
                {item.role}
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
                    transform: isActive ? 'scale(1.08)' : 'scale(1.2)',
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
                  className="rounded-[12px] bg-white px-7 py-5 shadow-[0_22px_70px_rgba(15,63,29,0.10)]"
                  style={{
                    minHeight: `${metrics.cardMinHeight}px`,
                  }}
                >
                  <p className="text-[15px] font-normal leading-[1.25] text-[#111111]">
                    {item.role}
                  </p>

                  <h2 className="mt-1 text-[14px] font-medium leading-[1.35] text-[#2E7D32]">
                    {item.name}
                  </h2>

                  <p className="mt-5 text-[13px] leading-[1.9] text-[#2B2B2B]">
                    {item.description}
                  </p>

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
                </article>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
