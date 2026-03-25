'use client';

import { startTransition, useEffect, useMemo, useState } from 'react';
import { useRef } from 'react';
import { ArrowRight, Building2 } from 'lucide-react';
import gsap from 'gsap';
import {
  estatesResearchSlides,
  type EstateResearchSlide,
} from './estatesResearchSlides';

const AUTOPLAY_DELAY_MS = 4500;
const DESKTOP_CARD_GAP = 56;
const SLIDE_TRAVEL_PX = 72;

function getWrappedOffset(index: number, activeIndex: number, total: number) {
  let offset = index - activeIndex;

  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;

  return offset;
}

function getSlideStyle(offset: number, isMobile: boolean) {
  if (isMobile) {
    if (offset === 0) {
      return {
        left: '50%',
        top: '24px',
        opacity: 1,
        zIndex: 3,
        scale: 1,
      };
    }

    return {
      left: offset < 0 ? '-10%' : '110%',
      top: '48px',
      opacity: 0,
      zIndex: 1,
      scale: 0.9,
    };
  }

  switch (offset) {
    case -1:
      return {
        left: '-12%',
        top: '128px',
        opacity: 0,
        zIndex: 1,
        scale: 0.92,
      };
    case 0:
      return {
        left: '50%',
        top: '16px',
        opacity: 1,
        zIndex: 3,
        scale: 1,
      };
    case 1:
      return {
        left: '112%',
        top: '128px',
        opacity: 0,
        zIndex: 1,
        scale: 0.92,
      };
    default:
      return {
        left: offset < 0 ? '-12%' : '112%',
        top: '128px',
        opacity: 0,
        zIndex: 1,
        scale: 0.92,
      };
  }
}

function EstateCollapsedCard({
  title,
  isLeft,
}: {
  title: string;
  isLeft: boolean;
}) {
  return (
    <div
      className={`relative h-[210px] w-[415px] shrink-0 rounded-[24px] border border-[#D7D7D7] bg-white px-8 pb-8 pt-16 shadow-[0_10px_24px_rgba(15,63,29,0.08)] transition-all duration-500 ${
        isLeft ? 'origin-right' : 'origin-left'
      }`}
      style={{ borderBottom: '5px solid #C7C006' }}
    >
      <div className="absolute left-1/2 top-0 flex h-[88px] w-[88px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[8px] bg-[#D8C700] shadow-[0_8px_16px_rgba(216,199,0,0.28)]">
        <Building2 className="h-9 w-9 text-white" strokeWidth={1.8} />
      </div>

      <div className="flex h-full flex-col items-center justify-center text-center">
        <h3 className="text-[25px] font-semibold leading-[1.35] text-[#174726]">
          {title}
        </h3>
        <div className="mt-3 h-[3px] w-[92px] rounded-full bg-[#C7C006]" />
      </div>
    </div>
  );
}

function EstateExpandedCard({ slide }: { slide: EstateResearchSlide }) {
  return (
    <div
      className="relative min-h-[420px] w-[440px] shrink-0 rounded-[30px] px-5 pb-8 pt-14 shadow-[0_18px_36px_rgba(123,118,0,0.16)] transition-all duration-500 md:px-7"
      style={{
        background:
          'linear-gradient(180deg, rgba(255, 252, 164, 1) 0%, rgba(250, 235, 105, 1) 100%)',
        borderBottom: '7px solid rgba(199, 192, 6, 1)',
      }}
    >
      <div className="absolute left-1/2 top-0 flex h-[88px] w-[88px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[8px] bg-[#D8C700] shadow-[0_8px_16px_rgba(216,199,0,0.28)]">
        <Building2 className="h-9 w-9 text-white" strokeWidth={1.8} />
      </div>

      <div className="flex h-full flex-col">
        <div className="text-center">
          <h3 className="text-[26px] font-semibold leading-tight text-[#0F3F1D]">
            {slide.title}
          </h3>
          <div className="mx-auto mt-2 h-[3px] w-[92px] rounded-full bg-[#C7C006]" />
        </div>

        <p className="mt-6 text-[15px] leading-[1.8] text-[#213A16]">
          {slide.description}
        </p>

        <ul className="mt-4 space-y-3">
          {slide.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-2 text-[15px] leading-[1.5] text-[#7E9B23]"
            >
              <span className="mt-[5px] h-0 w-0 border-y-[5px] border-l-[6px] border-y-transparent border-l-[#C7C006]" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-4 pt-8">
          <div className="h-px flex-1 border-t border-dotted border-[#C7C006]" />
          <button
            type="button"
            className="inline-flex items-center gap-3 text-[18px] font-medium text-[#0F3F1D]"
            aria-label={`Read more about ${slide.title}`}
          >
            <span>Read More</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F3F1D] text-white">
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EstatesResearchSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const desktopTrackRef = useRef<HTMLDivElement | null>(null);
  const mobileTrackRef = useRef<HTMLDivElement | null>(null);

  const slides = estatesResearchSlides;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const updateViewport = () => setIsMobile(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);

    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setDirection(1);
      startTransition(() => {
        setActiveIndex((current) => (current + 1) % slides.length);
      });
    }, AUTOPLAY_DELAY_MS);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    const target = isMobile ? mobileTrackRef.current : desktopTrackRef.current;
    if (!target) return;

    const cards = Array.from(target.children);
    if (!cards.length) return;

    const context = gsap.context(() => {
      gsap.killTweensOf(cards);
      gsap.fromTo(
        cards,
        {
          x: direction > 0 ? SLIDE_TRAVEL_PX : -SLIDE_TRAVEL_PX,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'power3.out',
          stagger: isMobile ? 0 : 0.08,
          clearProps: 'transform,opacity',
        }
      );
    }, target);

    return () => context.revert();
  }, [activeIndex, direction, isMobile]);

  const positionedSlides = useMemo(
    () =>
      slides.map((slide, index) => ({
        slide,
        offset: getWrappedOffset(index, activeIndex, slides.length),
      })),
    [activeIndex, slides]
  );

  const goToSlide = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    startTransition(() => {
      setActiveIndex(index);
    });
  };

  const goPrevious = () => {
    setDirection(-1);
    startTransition(() => {
      setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
    });
  };

  const goNext = () => {
    setDirection(1);
    startTransition(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    });
  };

  return (
    <div className="relative mt-10 pb-16 lg:mt-14 lg:pb-10">
      <div className="relative h-[430px] md:h-[470px] lg:h-[560px]">
        {isMobile ? (
          <div ref={mobileTrackRef} className="absolute inset-0">
            {positionedSlides.map(({ slide, offset }) => {
              const styleConfig = getSlideStyle(offset, true);
              const isActive = offset === 0;

              return (
                <article
                  key={slide.id}
                  className="absolute transition-[left,top,opacity,transform] duration-700 ease-out"
                  style={{
                    left: styleConfig.left,
                    top: styleConfig.top,
                    opacity: styleConfig.opacity,
                    zIndex: styleConfig.zIndex,
                    transform: `translateX(-50%) scale(${styleConfig.scale})`,
                    pointerEvents: isActive ? 'auto' : 'none',
                  }}
                  aria-hidden={!isActive}
                >
                  {isActive ? <EstateExpandedCard slide={slide} /> : null}
                </article>
              );
            })}
          </div>
        ) : (
          <div
            ref={desktopTrackRef}
            className="absolute left-1/2 top-4 flex -translate-x-1/2 items-start gap-[56px] overflow-visible"
          >
            <div className="pt-[126px]">
              <EstateCollapsedCard
                title={slides[(activeIndex - 1 + slides.length) % slides.length].title}
                isLeft
              />
            </div>

            <EstateExpandedCard slide={slides[activeIndex]} />

            <div className="pt-[126px]">
              <EstateCollapsedCard
                title={slides[(activeIndex + 1) % slides.length].title}
                isLeft={false}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center lg:mt-1">
        <div className="flex items-center justify-center gap-3">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Show ${slide.title}`}
              aria-pressed={index === activeIndex}
              className="h-2.5 w-2.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor:
                  index === activeIndex
                    ? 'rgba(161, 223, 10, 0.63)'
                    : 'rgba(161, 223, 10, 0.28)',
                transform: index === activeIndex ? 'scale(1.15)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
