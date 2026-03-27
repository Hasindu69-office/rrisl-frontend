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

const getArcPoint = (slotPosition: number, containerHeight: number) => {
  const angle = ((PATH_START_ANGLE + slotPosition * PATH_STEP_ANGLE) * Math.PI) / 180;
  const pathCenterY = containerHeight / 2;

  return {
    x: PATH_CENTER_X + Math.cos(angle) * PATH_RADIUS,
    y: pathCenterY + Math.sin(angle) * PATH_RADIUS,
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
  const [containerSize, setContainerSize] = useState({
    width: 1920,
    height: DESKTOP_MIN_HEIGHT,
  });

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

    media.add('(min-width: 1024px)', () => {
      const tween = gsap.to(state, {
        progress: maxProgress,
        ease: 'none',
        onUpdate: () => {
          setScrollProgress(state.progress);
        },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${Math.max(highlights.length * 700, 2800)}`,
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
    });

    return () => {
      media.revert();
    };
  }, [highlights.length]);

  useEffect(() => {
    if (typeof window === 'undefined' || highlights.length <= 1) {
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileOnly = window.matchMedia('(max-width: 1023px)');
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const syncPlayback = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }

      if (reducedMotion.matches || !mobileOnly.matches) {
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
  }, [highlights]);

  const mobileHighlight = highlights[mobileActiveIndex] ?? highlights[0];
  const desktopHeight = containerSize.height || DESKTOP_MIN_HEIGHT;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0C5A1D] py-16 md:min-h-[560px] md:py-20 lg:h-screen lg:min-h-[760px] lg:py-0"
      style={{
        width: '100vw',
        maxWidth: '100vw',
        marginLeft: 'calc(50% - 50vw)',
        marginRight: 'calc(50% - 50vw)',
      }}
    >
      <div
        ref={geometryRef}
        className="relative min-h-[420px] overflow-hidden md:min-h-[560px] lg:h-screen lg:min-h-[760px]"
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
            className="absolute top-1/2 hidden -translate-y-1/2 overflow-hidden rounded-full lg:block"
            style={{
              left: CIRCLE_LEFT,
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
            }}
          >
            <Image
              src={highlightImageSrc}
              alt={highlightImageAlt}
              fill
              className="object-cover"
              sizes="600px"
            />
          </div>

          <div className="absolute inset-0 hidden lg:block" aria-hidden="true">
            <div
              className="absolute rounded-full border-2 border-white/90"
              style={{
                left: PATH_CENTER_X - PATH_RADIUS,
                top: desktopHeight / 2 - PATH_RADIUS,
                width: PATH_RADIUS * 2,
                height: PATH_RADIUS * 2,
              }}
            />

            {highlights.map((item, index) => {
              const slotPosition =
                FOCUS_SLOT_INDEX +
                getWrappedOffset(index, scrollProgress, highlights.length);
              const point = getArcPoint(slotPosition, desktopHeight);
              const focusDistance = Math.abs(slotPosition - FOCUS_SLOT_INDEX);
              const emphasis = clamp(1 - focusDistance / 1.35, 0, 1);
              const visibility = slotPosition > -0.75 && slotPosition < 6.85 ? 1 : 0;
              const textX = point.x + 44 + clamp(slotPosition, 0, 6) * 8;
              const textWidth = 740;
              const fontSize = 16;
              const lineHeight = 1.33 - emphasis * 0.08;
              const dotSize = 12 + emphasis * 10;
              const ringSize = dotSize + 14;
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
            <div className="flex min-h-[420px] flex-col justify-between p-6 md:min-h-[560px] md:p-10 lg:h-screen lg:min-h-[760px] lg:p-12">
              <div className="flex justify-start lg:hidden">
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

              <div className="relative mt-8 overflow-hidden rounded-[28px] border border-white/15 bg-[rgba(6,58,18,0.38)] p-5 shadow-[0_18px_54px_rgba(0,0,0,0.12)] lg:hidden">
                <div className="pointer-events-none absolute -left-24 top-1/2 h-[240px] w-[240px] -translate-y-1/2 overflow-hidden rounded-full">
                  <Image
                    src={highlightImageSrc}
                    alt={highlightImageAlt}
                    fill
                    className="object-cover"
                    sizes="240px"
                  />
                </div>

                <div className="relative ml-20">
                  <div className="text-[12px] font-medium uppercase tracking-[0.22em] text-white/65">
                    Highlight {mobileActiveIndex + 1}
                  </div>
                  <p className="mt-3 text-[17px] font-semibold italic leading-[1.55] text-white">
                    {mobileHighlight?.text}
                  </p>
                </div>

                <div className="relative mt-6 flex items-center gap-2 pl-20">
                  {highlights.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-label={`Show highlight ${index + 1}`}
                      onClick={() => setMobileActiveIndex(index)}
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

              <div className="hidden lg:absolute lg:right-[80px] lg:top-[47%] lg:flex lg:-translate-y-1/2 lg:items-center lg:gap-2">
                <div className="pointer-events-none flex items-center gap-2">
                  <div className="overflow-visible py-3 rotate-180 whitespace-nowrap [writing-mode:vertical-rl]">
                    <span className="text-[72px] font-bold leading-[1] text-white">
                      {titlePart1}{' '}
                    </span>
                    <span
                      className="text-[72px] font-bold leading-[1] text-transparent"
                      style={{
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
