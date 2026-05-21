'use client';

import { startTransition, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { addLocaleToUrl } from '@/app/lib/locale';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';

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

type ResponsiveMode = 'desktop' | 'tablet' | 'mobile';
type CardPresentation =
  | 'desktop-active'
  | 'desktop-side'
  | 'tablet-active'
  | 'tablet-side'
  | 'mobile-active';

const AUTOPLAY_DELAY_MS = 3600;

const DESKTOP_ACTIVE = { width: 350, height: 560 };
const DESKTOP_SIDE = { width: 250, height: 400 };
const DESKTOP_SIDE_TOP = 74;
const DESKTOP_NEAR_SHIFT = 322;
const DESKTOP_FAR_SHIFT = 596;

const TABLET_ACTIVE = { width: 300, height: 480 };
const TABLET_SIDE = { width: 210, height: 336 };
const TABLET_SIDE_TOP = 72;
const TABLET_SIDE_SHIFT = 279;

const MOBILE_MIN_WIDTH = 280;
const MOBILE_MAX_WIDTH = 350;
const MOBILE_GAP = 16;
const MOBILE_PEEK = 56;

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
        left: `calc(50% - ${DESKTOP_FAR_SHIFT}px)`,
        top: `${DESKTOP_SIDE_TOP}px`,
        width: `${DESKTOP_SIDE.width}px`,
        height: `${DESKTOP_SIDE.height}px`,
        opacity: 0.94,
        zIndex: 1,
      };
    case -1:
      return {
        left: `calc(50% - ${DESKTOP_NEAR_SHIFT}px)`,
        top: `${DESKTOP_SIDE_TOP}px`,
        width: `${DESKTOP_SIDE.width}px`,
        height: `${DESKTOP_SIDE.height}px`,
        opacity: 1,
        zIndex: 2,
      };
    case 0:
      return {
        left: '50%',
        top: '0px',
        width: `${DESKTOP_ACTIVE.width}px`,
        height: `${DESKTOP_ACTIVE.height}px`,
        opacity: 1,
        zIndex: 4,
      };
    case 1:
      return {
        left: `calc(50% + ${DESKTOP_NEAR_SHIFT}px)`,
        top: `${DESKTOP_SIDE_TOP}px`,
        width: `${DESKTOP_SIDE.width}px`,
        height: `${DESKTOP_SIDE.height}px`,
        opacity: 1,
        zIndex: 2,
      };
    case 2:
      return {
        left: `calc(50% + ${DESKTOP_FAR_SHIFT}px)`,
        top: `${DESKTOP_SIDE_TOP}px`,
        width: `${DESKTOP_SIDE.width}px`,
        height: `${DESKTOP_SIDE.height}px`,
        opacity: 0.94,
        zIndex: 1,
      };
    default:
      return {
        left: offset < 0 ? 'calc(50% - 920px)' : 'calc(50% + 920px)',
        top: `${DESKTOP_SIDE_TOP}px`,
        width: `${DESKTOP_SIDE.width}px`,
        height: `${DESKTOP_SIDE.height}px`,
        opacity: 0,
        zIndex: 0,
      };
  }
}

function getTabletCardStyle(offset: number) {
  switch (offset) {
    case -1:
      return {
        left: `calc(50% - ${TABLET_SIDE_SHIFT}px)`,
        top: `${TABLET_SIDE_TOP}px`,
        width: `${TABLET_SIDE.width}px`,
        height: `${TABLET_SIDE.height}px`,
        opacity: 0.96,
        zIndex: 2,
      };
    case 0:
      return {
        left: '50%',
        top: '0px',
        width: `${TABLET_ACTIVE.width}px`,
        height: `${TABLET_ACTIVE.height}px`,
        opacity: 1,
        zIndex: 4,
      };
    case 1:
      return {
        left: `calc(50% + ${TABLET_SIDE_SHIFT}px)`,
        top: `${TABLET_SIDE_TOP}px`,
        width: `${TABLET_SIDE.width}px`,
        height: `${TABLET_SIDE.height}px`,
        opacity: 0.96,
        zIndex: 2,
      };
    default:
      return {
        left: offset < 0 ? 'calc(50% - 720px)' : 'calc(50% + 720px)',
        top: `${TABLET_SIDE_TOP}px`,
        width: `${TABLET_SIDE.width}px`,
        height: `${TABLET_SIDE.height}px`,
        opacity: 0,
        zIndex: 0,
      };
  }
}

function getCardPresentation(
  mode: ResponsiveMode,
  active: boolean
): CardPresentation {
  if (mode === 'desktop') {
    return active ? 'desktop-active' : 'desktop-side';
  }

  if (mode === 'tablet') {
    return active ? 'tablet-active' : 'tablet-side';
  }

  return 'mobile-active';
}

function MediaAlbumCard({
  slide,
  locale,
  presentation,
}: {
  slide: MediaAlbumSlide;
  locale: string;
  presentation: CardPresentation;
}) {
  const href = addLocaleToUrl(slide.href, locale);
  const isActive =
    presentation === 'desktop-active' || presentation === 'tablet-active';
  const isMobile = presentation === 'mobile-active';
  const titleClass = isMobile
    ? 'text-[18px] md:text-[20px]'
    : isActive
      ? 'text-[17px] md:text-[18px]'
      : 'text-[13px] md:text-[14px]';
  const titleWidth = isMobile ? 'max-w-[68%]' : 'max-w-[72%]';
  const titleRightPadding = isMobile ? 'pr-[92px]' : 'pr-[88px]';
  const actionSize = isMobile ? 'h-[64px] w-[64px]' : 'h-[60px] w-[60px]';
  const actionRadius = isMobile ? 'rounded-tl-[30px]' : 'rounded-tl-[28px]';
  const useUnoptimizedImage = isLocalhostAssetUrl(slide.imageSrc);

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
        unoptimized={useUnoptimizedImage}
        sizes={
          presentation === 'desktop-active'
            ? '350px'
            : presentation === 'desktop-side'
              ? '250px'
              : presentation === 'tablet-active'
                ? '300px'
                : presentation === 'tablet-side'
                  ? '210px'
                  : '(max-width: 767px) 80vw, 350px'
        }
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,63,29,0)_38%,rgba(15,63,29,0.12)_62%,rgba(15,63,29,0.82)_100%)]" />

      <div
        className={`absolute inset-x-0 bottom-0 flex items-end px-5 pb-5 ${titleRightPadding}`}
      >
        <h3
          className={`${titleWidth} font-semibold leading-tight text-white drop-shadow-[0_4px_14px_rgba(0,0,0,0.35)] ${titleClass}`}
        >
          {slide.title}
        </h3>
      </div>

      <span
        className={`absolute bottom-0 right-0 flex ${actionSize} items-center justify-center ${actionRadius} bg-[#A1DF0A] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5`}
      >
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
    const tabletMedia = window.matchMedia(
      '(min-width: 768px) and (max-width: 1279px)'
    );
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateMode = () => {
      if (desktopMedia.matches) {
        setMode('desktop');
        return;
      }

      if (tabletMedia.matches) {
        setMode('tablet');
        return;
      }

      setMode('mobile');
    };

    const updateMotionPreference = () => {
      setPrefersReducedMotion(motionMedia.matches);
    };

    updateMode();
    updateMotionPreference();

    desktopMedia.addEventListener('change', updateMode);
    tabletMedia.addEventListener('change', updateMode);
    motionMedia.addEventListener('change', updateMotionPreference);

    return () => {
      desktopMedia.removeEventListener('change', updateMode);
      tabletMedia.removeEventListener('change', updateMode);
      motionMedia.removeEventListener('change', updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    if (mode !== 'mobile') return;

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

  const mobileCardWidth = Math.min(
    MOBILE_MAX_WIDTH,
    Math.max(MOBILE_MIN_WIDTH, viewportWidth - MOBILE_PEEK)
  );
  const mobileCardHeight = Math.round(
    (mobileCardWidth / DESKTOP_ACTIVE.width) * DESKTOP_ACTIVE.height
  );
  const mobileStep = mobileCardWidth + MOBILE_GAP;
  const mobileTrackTranslate = -(activeIndex * mobileStep) + dragOffset;

  const goToSlide = (index: number) => {
    startTransition(() => {
      setActiveIndex(index);
    });
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (mode !== 'mobile') return;

    touchStartXRef.current = event.touches[0]?.clientX ?? null;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (mode !== 'mobile' || touchStartXRef.current === null) return;

    const currentX = event.touches[0]?.clientX ?? touchStartXRef.current;
    setDragOffset(currentX - touchStartXRef.current);
  };

  const handleTouchEnd = () => {
    if (mode !== 'mobile') return;

    const threshold = Math.max(44, mobileCardWidth * 0.16);
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
        setActiveIndex(
          (current) => (current - 1 + slides.length) % slides.length
        );
      });
    }
  };

  return (
    <section className="mb-56 bg-white px-4 py-16 md:px-6 md:py-[72px] lg:px-10 lg:py-20 xl:px-0 p">
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

              return (
                <article
                  key={slide.id}
                  className="absolute transition-[left,top,width,height,opacity] ease-[cubic-bezier(0.22,1,0.36,1)]"
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
                    presentation={getCardPresentation(mode, offset === 0)}
                  />
                </article>
              );
            })}
          </div>
        ) : mode === 'tablet' ? (
          <div className="relative mx-auto h-[520px] max-w-[860px] overflow-hidden">
            {slides.map((slide, index) => {
              const offset = getWrappedOffset(index, activeIndex, slides.length);
              const styleConfig = getTabletCardStyle(offset);

              return (
                <article
                  key={slide.id}
                  className="absolute transition-[left,top,width,height,opacity] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    left: styleConfig.left,
                    top: styleConfig.top,
                    width: styleConfig.width,
                    height: styleConfig.height,
                    opacity: styleConfig.opacity,
                    zIndex: styleConfig.zIndex,
                    transform: 'translateX(-50%)',
                    pointerEvents: Math.abs(offset) <= 1 ? 'auto' : 'none',
                    transitionDuration: prefersReducedMotion ? '0ms' : '700ms',
                  }}
                  aria-hidden={Math.abs(offset) > 1}
                >
                  <MediaAlbumCard
                    slide={slide}
                    locale={locale}
                    presentation={getCardPresentation(mode, offset === 0)}
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
                gap: `${MOBILE_GAP}px`,
                transform: `translateX(${mobileTrackTranslate}px)`,
                transition: isDragging
                  ? 'none'
                  : prefersReducedMotion
                    ? 'transform 0ms linear'
                    : 'transform 520ms cubic-bezier(0.22, 1, 0.36, 1)',
                willChange: 'transform',
              }}
            >
              {slides.map((slide) => (
                <article
                  key={slide.id}
                  className="shrink-0"
                  style={{
                    width: `${mobileCardWidth}px`,
                    height: `${mobileCardHeight}px`,
                  }}
                >
                  <MediaAlbumCard
                    slide={slide}
                    locale={locale}
                    presentation="mobile-active"
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
