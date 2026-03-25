'use client';

import { startTransition, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { addLocaleToUrl } from '@/app/lib/locale';

export interface MediaAlbumSlide {
  id: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
}

interface MediaAlbumSliderProps {
  slides: MediaAlbumSlide[];
  locale?: string;
}

const AUTOPLAY_DELAY_MS = 3600;
const ACTIVE_CARD_WIDTH = 350;
const ACTIVE_CARD_HEIGHT = 560;
const SIDE_CARD_WIDTH = 250;
const SIDE_CARD_HEIGHT = 400;
const SIDE_TOP = 74;
const FAR_CARD_SHIFT = 596;
const NEAR_CARD_SHIFT = 322;

type ResponsiveMode = 'desktop' | 'compact';

function getWrappedOffset(index: number, activeIndex: number, total: number) {
  let offset = index - activeIndex;

  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;

  return offset;
}

function getDesktopCardStyle(offset: number) {
  switch (offset) {
    case -2:
      return {
        left: `calc(50% - ${FAR_CARD_SHIFT}px)`,
        top: `${SIDE_TOP}px`,
        width: `${SIDE_CARD_WIDTH}px`,
        height: `${SIDE_CARD_HEIGHT}px`,
        opacity: 0.94,
        zIndex: 1,
      };
    case -1:
      return {
        left: `calc(50% - ${NEAR_CARD_SHIFT}px)`,
        top: `${SIDE_TOP}px`,
        width: `${SIDE_CARD_WIDTH}px`,
        height: `${SIDE_CARD_HEIGHT}px`,
        opacity: 1,
        zIndex: 2,
      };
    case 0:
      return {
        left: '50%',
        top: '0px',
        width: `${ACTIVE_CARD_WIDTH}px`,
        height: `${ACTIVE_CARD_HEIGHT}px`,
        opacity: 1,
        zIndex: 4,
      };
    case 1:
      return {
        left: `calc(50% + ${NEAR_CARD_SHIFT}px)`,
        top: `${SIDE_TOP}px`,
        width: `${SIDE_CARD_WIDTH}px`,
        height: `${SIDE_CARD_HEIGHT}px`,
        opacity: 1,
        zIndex: 2,
      };
    case 2:
      return {
        left: `calc(50% + ${FAR_CARD_SHIFT}px)`,
        top: `${SIDE_TOP}px`,
        width: `${SIDE_CARD_WIDTH}px`,
        height: `${SIDE_CARD_HEIGHT}px`,
        opacity: 0.94,
        zIndex: 1,
      };
    default:
      return {
        left: offset < 0 ? 'calc(50% - 920px)' : 'calc(50% + 920px)',
        top: `${SIDE_TOP}px`,
        width: `${SIDE_CARD_WIDTH}px`,
        height: `${SIDE_CARD_HEIGHT}px`,
        opacity: 0,
        zIndex: 0,
      };
  }
}

function MediaAlbumCard({
  slide,
  locale,
  compact,
  active,
}: {
  slide: MediaAlbumSlide;
  locale: string;
  compact: boolean;
  active: boolean;
}) {
  const href = addLocaleToUrl(slide.href, locale);

  return (
    <Link
      href={href}
      className="group relative block h-full w-full overflow-hidden rounded-[40px] bg-[#DDE6DD] focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:ring-offset-4"
      aria-label={`Open album ${slide.title}`}
    >
      <Image
        src={slide.imageSrc}
        alt={slide.imageAlt}
        fill
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        sizes={
          compact
            ? '(max-width: 767px) 78vw, 360px'
            : active
              ? '350px'
              : '250px'
        }
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,63,29,0)_38%,rgba(15,63,29,0.12)_62%,rgba(15,63,29,0.82)_100%)]" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-5 pb-5 pr-[88px]">
        <h3
          className={`max-w-[72%] font-semibold leading-tight text-white drop-shadow-[0_4px_14px_rgba(0,0,0,0.35)] ${
            active ? 'text-[17px] md:text-[18px]' : 'text-[13px] md:text-[14px]'
          }`}
        >
          {slide.title}
        </h3>
      </div>

      <span className="absolute bottom-0 right-0 flex h-[60px] w-[60px] items-center justify-center rounded-tl-[28px] bg-[#A1DF0A] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F3F1D] text-white">
          <ArrowRight className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
        </span>
      </span>
    </Link>
  );
}

export default function MediaAlbumSlider({
  slides,
  locale = 'en',
}: MediaAlbumSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState<ResponsiveMode>('desktop');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const desktopMedia = window.matchMedia('(min-width: 1280px)');
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateMode = () => {
      setMode(desktopMedia.matches ? 'desktop' : 'compact');
    };

    const updateMotionPreference = () => {
      setPrefersReducedMotion(motionMedia.matches);
    };

    updateMode();
    updateMotionPreference();

    desktopMedia.addEventListener('change', updateMode);
    motionMedia.addEventListener('change', updateMotionPreference);

    return () => {
      desktopMedia.removeEventListener('change', updateMode);
      motionMedia.removeEventListener('change', updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    if (mode !== 'compact') return;

    const node = viewportRef.current;
    if (!node) return;

    const updateWidth = () => {
      setViewportWidth(node.clientWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(node);

    return () => observer.disconnect();
  }, [mode]);

  useEffect(() => {
    if (
      slides.length <= 1 ||
      prefersReducedMotion ||
      isDragging ||
      isHovered
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      startTransition(() => {
        setActiveIndex((current) => (current + 1) % slides.length);
      });
    }, AUTOPLAY_DELAY_MS);

    return () => window.clearInterval(interval);
  }, [slides.length, prefersReducedMotion, isDragging, isHovered]);

  if (!slides.length) {
    return null;
  }

  const compactCardWidth = Math.min(350, Math.max(250, viewportWidth - 56));
  const compactCardHeight = Math.round((compactCardWidth / SIDE_CARD_WIDTH) * SIDE_CARD_HEIGHT);
  const compactGap = 20;
  const compactTrackTranslate = -(activeIndex * (compactCardWidth + compactGap)) + dragOffset;

  const goToSlide = (index: number) => {
    startTransition(() => {
      setActiveIndex(index);
    });
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (mode !== 'compact') return;

    touchStartXRef.current = event.touches[0]?.clientX ?? null;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (mode !== 'compact' || touchStartXRef.current === null) return;

    const currentX = event.touches[0]?.clientX ?? touchStartXRef.current;
    setDragOffset(currentX - touchStartXRef.current);
  };

  const handleTouchEnd = () => {
    if (mode !== 'compact') return;

    const threshold = Math.max(44, compactCardWidth * 0.16);
    const nextOffset = dragOffset;

    setDragOffset(0);
    setIsDragging(false);
    touchStartXRef.current = null;

    if (nextOffset <= -threshold) {
      startTransition(() => {
        setActiveIndex((current) => (current + 1) % slides.length);
      });
      return;
    }

    if (nextOffset >= threshold) {
      startTransition(() => {
        setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
      });
    }
  };

  return (
    <section className="bg-white px-4 py-14 md:px-6 md:py-[72px] lg:px-10 lg:py-20 xl:px-0 mb-56">
      <div
        className="mx-auto w-full max-w-[1480px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {mode === 'desktop' ? (
          <div className="relative h-[620px] overflow-hidden">
            {slides.map((slide, index) => {
              const offset = getWrappedOffset(index, activeIndex, slides.length);
              const styleConfig = getDesktopCardStyle(offset);
              const active = offset === 0;

              return (
                <article
                  key={slide.id}
                  className="absolute transition-[left,top,width,height,opacity,transform] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    left: styleConfig.left,
                    top: styleConfig.top,
                    width: styleConfig.width,
                    height: styleConfig.height,
                    opacity: styleConfig.opacity,
                    zIndex: styleConfig.zIndex,
                    transform: 'translateX(-50%)',
                    pointerEvents: Math.abs(offset) <= 2 ? 'auto' : 'none',
                    transitionDuration: prefersReducedMotion ? '0ms' : '800ms',
                  }}
                  aria-hidden={Math.abs(offset) > 2}
                >
                  <MediaAlbumCard
                    slide={slide}
                    locale={locale}
                    compact={false}
                    active={active}
                  />
                </article>
              );
            })}
          </div>
        ) : (
          <div
            ref={viewportRef}
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
            <div
              className="flex items-start"
              style={{
                gap: `${compactGap}px`,
                transform: `translateX(${compactTrackTranslate}px)`,
                transition: isDragging
                  ? 'none'
                  : prefersReducedMotion
                    ? 'transform 0ms linear'
                    : 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)',
                willChange: 'transform',
              }}
            >
              {slides.map((slide, index) => (
                <article
                  key={slide.id}
                  className="shrink-0"
                  style={{
                    width: `${compactCardWidth}px`,
                    height: `${index === activeIndex ? Math.max(compactCardHeight, 448) : compactCardHeight}px`,
                    paddingTop: index === activeIndex ? '0px' : '18px',
                    transition: prefersReducedMotion
                      ? 'none'
                      : 'height 500ms cubic-bezier(0.22, 1, 0.36, 1), padding-top 500ms cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  <MediaAlbumCard
                    slide={slide}
                    locale={locale}
                    compact
                    active={index === activeIndex}
                  />
                </article>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center gap-3">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Show ${slide.title}`}
                aria-pressed={index === activeIndex}
                className="h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: index === activeIndex ? '34px' : '10px',
                  backgroundColor:
                    index === activeIndex ? '#A1DF0A' : 'rgba(161, 223, 10, 0.28)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
