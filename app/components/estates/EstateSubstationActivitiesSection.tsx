'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';
import {
  startTransition,
  type TouchEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';

gsap.registerPlugin(ScrollTrigger);

export interface EstateSubstationActivityCard {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export interface EstateSubstationActivitiesContent {
  eyebrow: string;
  title: string;
  description?: string;
  backgroundImageSrc: string;
  backgroundImageAlt: string;
  cards: EstateSubstationActivityCard[];
}

export interface EstateSubstationActivitiesSectionProps {
  content: EstateSubstationActivitiesContent;
}

type ResponsiveMode = 'desktop' | 'tablet' | 'mobile';

function PlusBadge() {
  return (
    <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[linear-gradient(180deg,#20C997_0%,#A1DF0A_100%)] shadow-[0_8px_18px_rgba(46,125,50,0.18)]">
      <span className="relative block h-3.5 w-3.5" aria-hidden="true">
        <span className="absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 rounded-full bg-white" />
        <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 rounded-full bg-white" />
      </span>
    </span>
  );
}

function ActivityRailCard({
  card,
  expanded,
  mode,
  onActivate,
  reduceMotion,
}: {
  card: EstateSubstationActivityCard;
  expanded: boolean;
  mode: ResponsiveMode;
  onActivate: () => void;
  reduceMotion: boolean;
}) {
  const isDesktop = mode === 'desktop';
  const isTablet = mode === 'tablet';
  const useUnoptimizedImage = isLocalhostAssetUrl(card.imageSrc);
  const transitionDuration = reduceMotion ? '0ms' : '700ms';
  const cardWidth = isDesktop
    ? expanded
      ? '420px'
      : '120px'
    : '100%';
  const cardHeight = isDesktop ? '630px' : isTablet ? '520px' : '460px';
  const contentPadding = isDesktop
    ? '36px 20px'
    : isTablet
      ? '28px 22px'
      : '24px 18px';
  const headingClassName = isDesktop
    ? 'max-w-[300px] text-[18px] leading-[1.3] md:text-[20px]'
    : isTablet
      ? 'max-w-[420px] text-[24px] leading-[1.18]'
      : 'max-w-[280px] text-[20px] leading-[1.22]';
  const descriptionClassName = isDesktop
    ? 'mt-4 max-w-[300px] text-[13px] leading-[1.9] text-white/92 md:text-[14px]'
    : isTablet
      ? 'mt-4 max-w-[420px] text-[14px] leading-[1.8] text-white/92'
      : 'mt-3.5 max-w-[280px] text-[13px] leading-[1.72] text-white/90';
  const sharedCardClasses =
    'relative overflow-hidden rounded-[12px] bg-white text-left outline-none focus-visible:ring-2 focus-visible:ring-[#A1DF0A] focus-visible:ring-offset-4 focus-visible:ring-offset-[#394E10]';
  const cardStyles = {
    width: cardWidth,
    height: cardHeight,
    transitionProperty: isDesktop
      ? 'width, box-shadow, transform, background-color, border-color'
      : 'box-shadow, transform',
    transitionDuration,
    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
    boxShadow: isDesktop
      ? expanded
        ? '0 18px 44px rgba(15, 63, 29, 0.18)'
        : '0 10px 24px rgba(15, 63, 29, 0.08)'
      : '0 18px 38px rgba(15, 63, 29, 0.16)',
  } as const;

  const cardInner = (
    <>
      <div className="absolute inset-0">
        <Image
          src={card.imageSrc}
          alt={card.imageAlt}
          fill
          className="object-cover"
          unoptimized={useUnoptimizedImage}
          sizes={
            isDesktop
              ? '(max-width: 767px) 78vw, (max-width: 1023px) 42vw, 420px'
              : '(max-width: 767px) 84vw, (max-width: 1023px) 72vw, 420px'
          }
        />
        <div
          className="absolute inset-0"
          style={{
            background: isDesktop
              ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, #2E7D32 100%)'
              : 'linear-gradient(180deg, rgba(23,55,19,0.08) 0%, rgba(46,125,50,0.92) 100%)',
            opacity: expanded ? 1 : 0,
            transition: `opacity ${transitionDuration} cubic-bezier(0.22, 1, 0.36, 1)`,
          }}
        />
      </div>

      {isDesktop ? (
        <div
          className="absolute inset-0 bg-white"
          style={{
            opacity: expanded ? 0 : 1,
            transition: `opacity ${transitionDuration} cubic-bezier(0.22, 1, 0.36, 1)`,
          }}
        />
      ) : null}

      <div
        className="relative z-10 flex h-full flex-col"
        style={{ padding: contentPadding }}
      >
        {isDesktop ? (
          <>
            <div
              className="flex justify-center"
              style={{
                opacity: expanded ? 0 : 1,
                transition: `opacity ${transitionDuration} cubic-bezier(0.22, 1, 0.36, 1)`,
              }}
            >
              <PlusBadge />
            </div>

            {expanded ? (
              <div
                className="mt-auto pr-2 text-white"
                style={{
                  opacity: expanded ? 1 : 0,
                  transform: expanded ? 'translateY(0)' : 'translateY(12px)',
                  transition: `opacity ${transitionDuration} cubic-bezier(0.22, 1, 0.36, 1), transform ${transitionDuration} cubic-bezier(0.22, 1, 0.36, 1)`,
                }}
              >
                <h3 className={headingClassName}>{card.title}</h3>
                <p className={descriptionClassName}>{card.description}</p>
              </div>
            ) : (
              <div className="mt-10 flex flex-1 items-center justify-center">
                <span
                  className="text-center text-[18px] font-medium leading-none text-[#4DD24C]"
                  style={{
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                  }}
                >
                  {card.title}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="mt-auto text-white">
            <h3 className={`mt-4 font-medium ${headingClassName}`}>{card.title}</h3>
            <p className={descriptionClassName}>{card.description}</p>
          </div>
        )}
      </div>
    </>
  );

  if (isDesktop) {
    return (
      <button
        type="button"
        aria-pressed={expanded}
        aria-label={`Show details for ${card.title}`}
        className={sharedCardClasses}
        style={cardStyles}
        onMouseEnter={onActivate}
        onFocus={onActivate}
      >
        {cardInner}
      </button>
    );
  }

  return (
    <article className={sharedCardClasses} style={cardStyles}>
      {cardInner}
    </article>
  );
}

export default function EstateSubstationActivitiesSection({
  content,
}: EstateSubstationActivitiesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState<ResponsiveMode>('desktop');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const useUnoptimizedBackground = isLocalhostAssetUrl(content.backgroundImageSrc);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const tabletQuery = window.matchMedia(
      '(min-width: 768px) and (max-width: 1023px)'
    );
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncViewport = () => {
      if (mobileQuery.matches) {
        setMode('mobile');
        return;
      }

      if (tabletQuery.matches) {
        setMode('tablet');
        return;
      }

      setMode('desktop');
    };

    const syncMotion = (event?: MediaQueryListEvent) => {
      setReduceMotion(event ? event.matches : motionQuery.matches);
    };

    syncViewport();
    syncMotion();

    mobileQuery.addEventListener('change', syncViewport);
    tabletQuery.addEventListener('change', syncViewport);
    motionQuery.addEventListener('change', syncMotion);

    return () => {
      mobileQuery.removeEventListener('change', syncViewport);
      tabletQuery.removeEventListener('change', syncViewport);
      motionQuery.removeEventListener('change', syncMotion);
    };
  }, []);

  useEffect(() => {
    const node = viewportRef.current;

    if (!node || mode === 'desktop') {
      return;
    }

    const updateWidth = () => {
      setViewportWidth(node.clientWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(node);

    return () => observer.disconnect();
  }, [mode]);

  useLayoutEffect(() => {
    if (
      typeof window === 'undefined' ||
      !sectionRef.current ||
      !introRef.current
    ) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const sectionNode = sectionRef.current;
    const introNode = introRef.current;
    const orderedCardNodes = cardRefs.current.filter(
      (node): node is HTMLDivElement => Boolean(node)
    );

    const context = gsap.context(() => {
      gsap.set(introNode, { autoAlpha: 0, y: 14 });

      if (orderedCardNodes.length > 0) {
        gsap.set(orderedCardNodes, { autoAlpha: 0, y: 24, x: 12 });
      }

      const timeline = gsap.timeline({
        paused: true,
        defaults: {
          ease: 'power3.out',
        },
      });

      timeline.to(introNode, {
        autoAlpha: 1,
        y: 0,
        duration: 0.78,
        clearProps: 'opacity,visibility,transform',
      });

      if (orderedCardNodes.length > 0) {
        timeline.to(
          orderedCardNodes,
          {
            autoAlpha: 1,
            y: 0,
            x: 0,
            duration: 0.9,
            stagger: 0.2,
            clearProps: 'opacity,visibility,transform',
          },
          '-=0.18'
        );
      }

      ScrollTrigger.create({
        trigger: sectionNode,
        start: 'top 84%',
        once: true,
        onEnter: () => timeline.play(0),
      });

      ScrollTrigger.refresh();
    }, sectionNode);

    return () => context.revert();
  }, [content.cards.length, mode]);

  const goToCard = (index: number) => {
    startTransition(() => {
      setActiveIndex(index);
    });
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (mode === 'desktop') {
      return;
    }

    touchStartXRef.current = event.touches[0]?.clientX ?? null;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (mode === 'desktop' || touchStartXRef.current === null) {
      return;
    }

    const currentX = event.touches[0]?.clientX ?? touchStartXRef.current;
    setDragOffset(currentX - touchStartXRef.current);
  };

  const handleTouchEnd = () => {
    if (mode === 'desktop') {
      return;
    }

    const cardWidth = mode === 'tablet'
      ? Math.min(640, Math.max(420, viewportWidth - 88))
      : Math.min(360, Math.max(260, viewportWidth - 28));
    const threshold = Math.max(40, cardWidth * 0.16);
    const nextOffset = dragOffset;

    setIsDragging(false);
    setDragOffset(0);
    touchStartXRef.current = null;

    if (nextOffset <= -threshold) {
      startTransition(() => {
        setActiveIndex((current) => (current + 1) % content.cards.length);
      });
      return;
    }

    if (nextOffset >= threshold) {
      startTransition(() => {
        setActiveIndex(
          (current) => (current - 1 + content.cards.length) % content.cards.length
        );
      });
    }
  };

  const isDesktop = mode === 'desktop';
  const responsiveGap = mode === 'tablet' ? 24 : 16;
  const responsiveCardWidth = isDesktop
    ? 0
    : mode === 'tablet'
      ? Math.min(640, Math.max(420, viewportWidth - 88))
      : Math.min(360, Math.max(260, viewportWidth - 28));
  const trackStep = responsiveCardWidth + responsiveGap;
  const trackTranslateX = isDesktop
    ? 0
    : -(activeIndex * trackStep) + dragOffset;

  cardRefs.current = [];

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={content.backgroundImageSrc}
          alt={content.backgroundImageAlt}
          fill
          className="object-cover object-center"
          sizes="100vw"
          unoptimized={useUnoptimizedBackground}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0) 0%, #394E10 100%)',
          }}
        />
      </div>

      <div className="relative z-10 px-4 py-12 md:px-6 md:py-16 lg:px-36 lg:py-24">
        <div className="mx-auto w-full max-w-[1440px]">
          <div ref={introRef} className="max-w-[720px] pt-1">
            <GradientTag
              text={content.eyebrow}
              backgroundColor="transparent"
              padding="px-4 py-1.5"
            />

            <GradientTitle
              part1=""
              part2={content.title}
              lineBreak={false}
              align="left"
              size="custom"
              customSize="clamp(2rem, 5vw, 3.5rem)"
              className="mt-4 leading-[1.08] tracking-[-0.02em] md:mt-5 md:leading-[1.1]"
            />
          </div>

          {isDesktop ? (
            <div className="mt-10 overflow-x-auto pb-2 md:mt-12 lg:mt-14 [scrollbar-color:rgba(255,255,255,0.24)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/30">
              <div className="flex min-w-max items-end justify-end gap-[42px] pl-1 md:pl-2 lg:ml-auto lg:w-full">
                {content.cards.map((card, index) => (
                  <div
                    key={`${card.title}-${index}`}
                    ref={(node) => {
                      cardRefs.current[index] = node;
                    }}
                  >
                    <ActivityRailCard
                      card={card}
                      expanded={index === activeIndex}
                      mode={mode}
                      onActivate={() => setActiveIndex(index)}
                      reduceMotion={reduceMotion}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              ref={viewportRef}
              className="mt-8 overflow-hidden md:mt-10"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
            >
              <div
                className="flex items-start"
                style={{
                  gap: `${responsiveGap}px`,
                  transform: `translateX(${trackTranslateX}px)`,
                  transition: isDragging
                    ? 'none'
                    : reduceMotion
                      ? 'transform 0ms linear'
                      : 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)',
                  willChange: 'transform',
                }}
              >
                {content.cards.map((card, index) => (
                  <div
                    key={`${card.title}-${index}`}
                    className="shrink-0"
                    style={{ width: `${responsiveCardWidth}px` }}
                    aria-hidden={index !== activeIndex}
                    ref={(node) => {
                      cardRefs.current[index] = node;
                    }}
                  >
                    <ActivityRailCard
                      card={card}
                      expanded
                      mode={mode}
                      onActivate={() => {}}
                      reduceMotion={reduceMotion}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isDesktop ? (
            <div className="mt-5 flex items-center justify-center md:mt-6">
              <div className="flex items-center justify-center gap-3">
                {content.cards.map((card, index) => (
                  <button
                    key={`${card.title}-dot`}
                    type="button"
                    onClick={() => goToCard(index)}
                    aria-label={`Show ${card.title}`}
                    aria-pressed={index === activeIndex}
                    className="h-2.5 w-2.5 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor:
                        index === activeIndex
                          ? 'rgba(161, 223, 10, 0.78)'
                          : 'rgba(255, 255, 255, 0.34)',
                      transform:
                        index === activeIndex ? 'scale(1.15)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
