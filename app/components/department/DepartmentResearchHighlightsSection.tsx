'use client';

import Image from 'next/image';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GradientTitle from '../ui/GradientTitle';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface DepartmentResearchHighlightItem {
  id: string;
  text: string;
  imageSrc?: string;
  imageAlt?: string;
}

interface DepartmentResearchHighlightsSectionProps {
  tagText: string;
  titlePart1: string | React.ReactNode;
  titlePart2: string | React.ReactNode;
  backgroundImageSrc: string;
  backgroundImageAlt: string;
  highlights: DepartmentResearchHighlightItem[];
  highlightImageSrc?: string;
  highlightImageAlt?: string;
  containerClassName?: string;
}

const DESKTOP_MIN_HEIGHT = 760;
const CIRCLE_SIZE = 600;
const CIRCLE_LEFT = -280;
const IMAGE_RADIUS = CIRCLE_SIZE / 2;
const PATH_CENTER_X = CIRCLE_LEFT + IMAGE_RADIUS;
const PATH_RADIUS = IMAGE_RADIUS + 80 ;
const PATH_START_ANGLE = -94;
const PATH_STEP_ANGLE = 31;
const FOCUS_SLOT_INDEX = 3;
const DOT_COLOR = '#A1DF0A';
const TABLET_MIN_HEIGHT = 640;
const TABLET_CIRCLE_SIZE = 420;
const TABLET_CIRCLE_LEFT = -170;
const TABLET_IMAGE_RADIUS = TABLET_CIRCLE_SIZE / 2;
const TABLET_PATH_CENTER_X = TABLET_CIRCLE_LEFT + TABLET_IMAGE_RADIUS;
const TABLET_PATH_RADIUS = TABLET_IMAGE_RADIUS + 54;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const getWrappedOffset = (index: number, progress: number, total: number) => {
  if (total <= 1) {
    return index - progress;
  }

  let offset = index - progress;
  const half = total / 2;

  while (offset <= -half) {
    offset += total;
  }

  while (offset > half) {
    offset -= total;
  }

  return offset;
};

const getArcPoint = (
  slotPosition: number,
  containerHeight: number,
  pathCenterX: number,
  pathRadius: number
) => {
  const angle = ((PATH_START_ANGLE + slotPosition * PATH_STEP_ANGLE) * Math.PI) / 180;
  const pathCenterY = containerHeight / 2;

  return {
    x: pathCenterX + Math.cos(angle) * pathRadius,
    y: pathCenterY + Math.sin(angle) * pathRadius,
  };
};

interface HighlightImageState {
  alt: string;
  key: string;
  src: string;
}

const resolveHighlightImage = (
  item: DepartmentResearchHighlightItem | undefined,
  fallbackSrc: string,
  fallbackAlt: string
): HighlightImageState => {
  const src = item?.imageSrc ?? fallbackSrc;
  const alt = item?.imageAlt ?? fallbackAlt;

  return {
    src,
    alt,
    key: `${item?.id ?? 'fallback'}:${src}`,
  };
};

/**
 * Department research highlights section with a pinned desktop scroll animation
 * and a lighter autoplay fallback for smaller screens.
 */
export default function DepartmentResearchHighlightsSection({
  titlePart1,
  titlePart2,
  backgroundImageSrc,
  backgroundImageAlt,
  highlights,
  highlightImageSrc = '/images/aboutusRubber.jpg',
  highlightImageAlt = 'Research highlight visual',
  containerClassName = '',
}: DepartmentResearchHighlightsSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const geometryRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mobileAutoplayEnabled, setMobileAutoplayEnabled] = useState(true);
  const [containerSize, setContainerSize] = useState({
    width: 1920,
    height: DESKTOP_MIN_HEIGHT,
  });
  const initialImage = resolveHighlightImage(highlights[0], highlightImageSrc, highlightImageAlt);
  const [currentImage, setCurrentImage] = useState<HighlightImageState>(initialImage);
  const [previousImage, setPreviousImage] = useState<HighlightImageState | null>(null);
  const [isImageTransitionActive, setIsImageTransitionActive] = useState(false);

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !geometryRef.current) {
      return;
    }

    const element = geometryRef.current;

    const updateSize = () => {
      const rect = element.getBoundingClientRect();

      setContainerSize((current) => {
        const nextWidth = Math.round(rect.width);
        const nextHeight = Math.round(rect.height);

        if (current.width === nextWidth && current.height === nextHeight) {
          return current;
        }

        return {
          width: nextWidth,
          height: nextHeight,
        };
      });
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const tabletQuery = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncMediaState = () => {
      const desktopMatches = desktopQuery.matches;
      const tabletMatches = tabletQuery.matches;

      setIsDesktop(desktopMatches);
      setIsTablet(tabletMatches);
      setPrefersReducedMotion(reducedMotionQuery.matches);

      if (desktopMatches || tabletMatches) {
        setMobileAutoplayEnabled(true);
      }
    };

    syncMediaState();
    desktopQuery.addEventListener('change', syncMediaState);
    tabletQuery.addEventListener('change', syncMediaState);
    reducedMotionQuery.addEventListener('change', syncMediaState);

    return () => {
      desktopQuery.removeEventListener('change', syncMediaState);
      tabletQuery.removeEventListener('change', syncMediaState);
      reducedMotionQuery.removeEventListener('change', syncMediaState);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) {
      return;
    }

    const maxProgress = Math.max(highlights.length - 1, 1);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      return;
    }

    const media = gsap.matchMedia();
    const state = { progress: 0 };

    media.add(
      {
        isDesktop: '(min-width: 1024px)',
        isTablet: '(min-width: 768px) and (max-width: 1023px)',
      },
      (context) => {
        const desktopMode = context.conditions?.isDesktop ?? false;
        const tabletMode = context.conditions?.isTablet ?? false;

        if (!desktopMode && !tabletMode) {
          return undefined;
        }

        const tween = gsap.to(state, {
          progress: maxProgress,
          ease: 'none',
          onUpdate: () => {
            setScrollProgress(state.progress);
          },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: `+=${desktopMode ? Math.max(highlights.length * 700, 2800) : Math.max(highlights.length * 480, 2200)}`,
            scrub: 1.15,
            snap:
              highlights.length > 1
                ? {
                    snapTo: (value: number) =>
                      Math.round(value * maxProgress) / maxProgress,
                    duration: { min: 0.14, max: 0.24 },
                    delay: 0,
                    ease: 'power1.inOut',
                  }
                : undefined,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          tween.kill();
        };
      }
    );

    return () => {
      media.revert();
    };
  }, [highlights.length]);

  useEffect(() => {
    if (typeof window === 'undefined' || highlights.length <= 1) {
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileOnly = window.matchMedia('(max-width: 767px)');
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const syncPlayback = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }

      if (reducedMotion.matches || !mobileOnly.matches || !mobileAutoplayEnabled) {
        return;
      }

      intervalId = setInterval(() => {
        setMobileActiveIndex((current) => (current + 1) % highlights.length);
      }, 3200);
    };

    syncPlayback();
    mobileOnly.addEventListener('change', syncPlayback);
    reducedMotion.addEventListener('change', syncPlayback);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }

      mobileOnly.removeEventListener('change', syncPlayback);
      reducedMotion.removeEventListener('change', syncPlayback);
    };
  }, [highlights, mobileAutoplayEnabled]);

  const mobileHighlight = highlights[mobileActiveIndex] ?? highlights[0];
  const desktopActiveIndex =
    highlights.length > 0 ? clamp(Math.round(scrollProgress), 0, highlights.length - 1) : 0;
  const usesArcLayout = isDesktop || isTablet;
  const activeHighlightIndex = usesArcLayout ? desktopActiveIndex : mobileActiveIndex;
  const layoutHeight = containerSize.height || (isTablet ? TABLET_MIN_HEIGHT : DESKTOP_MIN_HEIGHT);
  const circleSize = isTablet ? TABLET_CIRCLE_SIZE : CIRCLE_SIZE;
  const circleLeft = isTablet ? TABLET_CIRCLE_LEFT : CIRCLE_LEFT;
  const pathCenterX = isTablet ? TABLET_PATH_CENTER_X : PATH_CENTER_X;
  const pathRadius = isTablet ? TABLET_PATH_RADIUS : PATH_RADIUS;
  const textBaseX = isTablet ? 30 : 44;
  const textStepX = isTablet ? 4 : 8;
  const textWidth = isTablet ? 420 : 740;
  const titleRight = isTablet ? 28 : 80;
  const titleSize = isTablet ? 54 : 72;

  useEffect(() => {
    const nextImage = resolveHighlightImage(
      highlights[activeHighlightIndex],
      highlightImageSrc,
      highlightImageAlt
    );

    if (nextImage.key === currentImage.key) {
      return;
    }

    if (prefersReducedMotion) {
      const reducedMotionFrameId = window.requestAnimationFrame(() => {
        setPreviousImage(null);
        setCurrentImage(nextImage);
        setIsImageTransitionActive(false);
      });

      return () => {
        window.cancelAnimationFrame(reducedMotionFrameId);
      };
    }

    const swapFrameId = window.requestAnimationFrame(() => {
      setIsImageTransitionActive(false);
      setPreviousImage(currentImage);
      setCurrentImage(nextImage);
    });

    const transitionFrameId = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setIsImageTransitionActive(true);
      });
    });

    const timeoutId = window.setTimeout(() => {
      setPreviousImage(null);
      setIsImageTransitionActive(false);
    }, 700);

    return () => {
      window.cancelAnimationFrame(swapFrameId);
      window.cancelAnimationFrame(transitionFrameId);
      window.clearTimeout(timeoutId);
    };
  }, [
    activeHighlightIndex,
    currentImage,
    highlightImageAlt,
    highlightImageSrc,
    highlights,
    prefersReducedMotion,
  ]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0C5A1D] py-0 md:h-screen md:min-h-[640px] md:py-0 lg:min-h-[760px]"
      style={{
        width: '100vw',
        maxWidth: '100vw',
        marginLeft: 'calc(50% - 50vw)',
        marginRight: 'calc(50% - 50vw)',
      }}
    >
      <div
        ref={geometryRef}
        className="relative min-h-[420px] overflow-hidden md:h-screen md:min-h-[640px] lg:min-h-[760px]"
      >
          <div className="absolute inset-0">
            <Image
              src={backgroundImageSrc}
              alt={backgroundImageAlt}
              fill
              className="object-cover object-center"
              priority={false}
              sizes="100vw"
            />
          </div>

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,98,26,0.12)_0%,rgba(7,98,26,0.02)_100%)]" />

          <div
            className="absolute top-1/2 hidden -translate-y-1/2 overflow-hidden rounded-full md:block"
            style={{
              left: circleLeft,
              width: circleSize,
              height: circleSize,
            }}
          >
            {previousImage ? (
              <Image
                key={`desktop-previous-${previousImage.key}`}
                src={previousImage.src}
                alt={previousImage.alt}
                fill
                className="object-cover transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                sizes={isTablet ? '420px' : '600px'}
                style={{ opacity: isImageTransitionActive ? 0 : 1 }}
              />
            ) : null}
            <Image
              key={`desktop-current-${currentImage.key}`}
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              className="object-cover transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              sizes={isTablet ? '420px' : '600px'}
              style={{ opacity: previousImage ? (isImageTransitionActive ? 1 : 0) : 1 }}
            />
          </div>

          <div className="absolute inset-0 hidden md:block" aria-hidden="true">
            <div
              className="absolute rounded-full border-2 border-white/90"
              style={{
                left: pathCenterX - pathRadius,
                top: layoutHeight / 2 - pathRadius,
                width: pathRadius * 2,
                height: pathRadius * 2,
              }}
            />

            {highlights.map((item, index) => {
              const slotPosition =
                FOCUS_SLOT_INDEX +
                getWrappedOffset(index, scrollProgress, highlights.length);
              const point = getArcPoint(slotPosition, layoutHeight, pathCenterX, pathRadius);
              const focusDistance = Math.abs(slotPosition - FOCUS_SLOT_INDEX);
              const emphasis = clamp(1 - focusDistance / 1.35, 0, 1);
              const visibility = slotPosition > -0.75 && slotPosition < 6.85 ? 1 : 0;
              const textX = point.x + textBaseX + clamp(slotPosition, 0, 6) * textStepX;
              const fontSize = isTablet ? 14 : 16;
              const lineHeight = 1.5 - emphasis * 0.08;
              const dotSize = (isTablet ? 10 : 12) + emphasis * (isTablet ? 8 : 10);
              const ringSize = dotSize + (isTablet ? 10 : 14);
              const dotOffset = ringSize / 2;

              return (
                <React.Fragment key={item.id}>
                  <div
                    className="absolute rounded-full border-[3px] border-transparent"
                    style={{
                      left: point.x - dotOffset,
                      top: point.y - dotOffset,
                      width: ringSize,
                      height: ringSize,
                      opacity: visibility,
                      backgroundColor: emphasis > 0.72 ? DOT_COLOR : 'transparent',
                      borderColor: emphasis > 0.72 ? DOT_COLOR : 'transparent',
                      transform: emphasis > 0.72 ? 'scale(1)' : 'scale(0.92)',
                    }}
                  >
                    {emphasis > 0.72 ? (
                      <div className="absolute inset-[4px] rounded-full bg-white" />
                    ) : (
                      <div className="absolute inset-0 rounded-full" style={{ backgroundColor: DOT_COLOR }} />
                    )}
                  </div>

                  <div
                    className="absolute max-w-none py-3 text-white"
                    style={{
                      left: textX,
                      top: point.y,
                      width: textWidth,
                      opacity: clamp(0.5 + emphasis * 0.75, 0, 1) * visibility,
                      fontSize,
                      lineHeight,
                      fontWeight: emphasis > 0.72 ? 600 : 500,
                      transform: `translateY(calc(-50% - ${emphasis * 2}px)) scale(${1 + emphasis * 0.04})`,
                      transformOrigin: 'left center',
                    }}
                  >
                    {item.text}
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          <div className={`relative z-10 mx-auto w-full max-w-[1920px] px-4 md:px-6 lg:px-8 ${containerClassName}`}>
            <div className="flex min-h-[420px] flex-col p-6 md:h-screen md:min-h-[640px] md:justify-between md:p-10 lg:min-h-[760px] lg:p-12">
              <div className="flex justify-start md:hidden">
                <div className="flex flex-col items-start gap-4">
                  <GradientTitle
                    part1={titlePart1}
                    part2={titlePart2}
                    lineBreak={false}
                    part1Color="white"
                    size="custom"
                    customSize="clamp(28px, 4vw, 44px)"
                    align="left"
                    className="font-bold leading-[1.05] text-white"
                  />
                </div>
              </div>

              <div className="mt-8 md:hidden">
                <div className="relative flex h-[520px] flex-col overflow-hidden rounded-[28px] border border-white/15 bg-[rgba(6,58,18,0.18)] shadow-[0_18px_54px_rgba(0,0,0,0.12)]">
                  <div className="relative h-[248px] overflow-hidden">
                    {previousImage ? (
                      <Image
                        key={`mobile-previous-${previousImage.key}`}
                        src={previousImage.src}
                        alt={previousImage.alt}
                        fill
                        className="object-cover transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        sizes="(max-width: 767px) 100vw"
                        style={{ opacity: isImageTransitionActive ? 0 : 1 }}
                      />
                    ) : null}
                    <Image
                      key={`mobile-current-${currentImage.key}`}
                      src={currentImage.src}
                      alt={currentImage.alt}
                      fill
                      className="object-cover transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      sizes="(max-width: 767px) 100vw"
                      style={{ opacity: previousImage ? (isImageTransitionActive ? 1 : 0) : 1 }}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,90,29,0.04)_0%,rgba(12,90,29,0.28)_100%)]" />
                  </div>

                  <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
                    <div className="text-[12px] font-medium uppercase tracking-[0.22em] text-white/65">
                      Highlight {mobileActiveIndex + 1}
                    </div>
                    <p className="mt-3 line-clamp-7 text-[17px] font-semibold leading-[1.6] text-white">
                      {mobileHighlight?.text}
                    </p>

                    <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
                      {highlights.map((item, index) => (
                        <button
                          key={item.id}
                          type="button"
                          aria-label={`Show highlight ${index + 1}`}
                          onClick={() => {
                            setMobileAutoplayEnabled(false);
                            setMobileActiveIndex(index);
                          }}
                          className="h-3 w-3 rounded-full transition-transform"
                          style={{
                            backgroundColor: DOT_COLOR,
                            opacity: index === mobileActiveIndex ? 1 : 0.35,
                            transform: index === mobileActiveIndex ? 'scale(1.35)' : 'scale(1)',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="hidden md:absolute md:top-[47%] md:flex md:-translate-y-1/2 md:items-center md:gap-2"
                style={{ right: titleRight }}
              >
                <div className="pointer-events-none flex items-center gap-2">
                  <div className="overflow-visible py-3 rotate-180 whitespace-nowrap [writing-mode:vertical-rl]">
                    <span className="font-bold leading-[1] text-white" style={{ fontSize: titleSize }}>
                      {titlePart1}{' '}
                    </span>
                    <span
                      className="font-bold leading-[1] text-transparent"
                      style={{
                        fontSize: titleSize,
                        backgroundImage: 'linear-gradient(180deg, #20C997 0%, #A1DF0A 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                      }}
                    >
                      {titlePart2}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </section>
  );
}
