'use client';

import { startTransition, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Building2 } from 'lucide-react';
import {
  estatesResearchSlides,
  type EstateResearchSlide,
} from './estatesResearchSlides';

const AUTOPLAY_DELAY_MS = 4500;
const DESKTOP_CARD_GAP = 56;
const COLLAPSED_CARD_WIDTH = 415;
const COLLAPSED_CARD_HEIGHT = 210;
const EXPANDED_CARD_WIDTH = 440;
const EXPANDED_CARD_HEIGHT = 460;
const SIDE_CARD_TOP = 126;
const CENTER_CARD_TOP = 0;
const SIDE_CARD_CENTER_OFFSET =
  EXPANDED_CARD_WIDTH / 2 + DESKTOP_CARD_GAP + COLLAPSED_CARD_WIDTH / 2;

function getWrappedOffset(index: number, activeIndex: number, total: number) {
  let offset = index - activeIndex;

  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;

  return offset;
}

function getMobileStyle(offset: number) {
  if (offset === 0) {
    return {
      left: '50%',
      top: '16px',
      width: `${EXPANDED_CARD_WIDTH}px`,
      height: `${EXPANDED_CARD_HEIGHT}px`,
      opacity: 1,
      zIndex: 3,
    };
  }

  return {
    left: offset < 0 ? '-20%' : '120%',
    top: '48px',
    width: `${EXPANDED_CARD_WIDTH}px`,
    height: `${EXPANDED_CARD_HEIGHT}px`,
    opacity: 0,
    zIndex: 1,
  };
}

function getDesktopStyle(offset: number) {
  switch (offset) {
    case -1:
      return {
        left: `calc(50% - ${SIDE_CARD_CENTER_OFFSET}px)`,
        top: `${SIDE_CARD_TOP}px`,
        width: `${COLLAPSED_CARD_WIDTH}px`,
        height: `${COLLAPSED_CARD_HEIGHT}px`,
        opacity: 1,
        zIndex: 2,
      };
    case 0:
      return {
        left: '50%',
        top: `${CENTER_CARD_TOP}px`,
        width: `${EXPANDED_CARD_WIDTH}px`,
        height: `${EXPANDED_CARD_HEIGHT}px`,
        opacity: 1,
        zIndex: 3,
      };
    case 1:
      return {
        left: `calc(50% + ${SIDE_CARD_CENTER_OFFSET}px)`,
        top: `${SIDE_CARD_TOP}px`,
        width: `${COLLAPSED_CARD_WIDTH}px`,
        height: `${COLLAPSED_CARD_HEIGHT}px`,
        opacity: 1,
        zIndex: 2,
      };
    default:
      return {
        left: offset < 0 ? 'calc(50% - 860px)' : 'calc(50% + 860px)',
        top: `${SIDE_CARD_TOP}px`,
        width: `${COLLAPSED_CARD_WIDTH}px`,
        height: `${COLLAPSED_CARD_HEIGHT}px`,
        opacity: 0,
        zIndex: 1,
      };
  }
}

function EstateSlideCard({
  slide,
  expanded,
  isLeft,
}: {
  slide: EstateResearchSlide;
  expanded: boolean;
  isLeft: boolean;
}) {
  return (
    <div
      className="relative h-full w-full overflow-visible border transition-[background-color,border-color,border-radius,box-shadow,padding] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{
        borderRadius: expanded ? '30px' : '24px',
        background: expanded
          ? 'linear-gradient(180deg, rgba(255, 252, 164, 1) 0%, rgba(250, 235, 105, 1) 100%)'
          : '#FFFFFF',
        borderColor: expanded ? 'rgba(250, 235, 105, 1)' : '#D7D7D7',
        borderBottom: expanded
          ? '7px solid rgba(199, 192, 6, 1)'
          : '5px solid #C7C006',
        boxShadow: expanded
          ? '0 18px 36px rgba(123, 118, 0, 0.16)'
          : '0 10px 24px rgba(15, 63, 29, 0.08)',
        padding: expanded ? '56px 28px 32px' : '64px 32px 32px',
        transformOrigin: expanded
          ? 'center center'
          : isLeft
            ? 'right center'
            : 'left center',
      }}
    >
      {!expanded ? (
        <div
          className="absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[8px] bg-[#D8C700] text-white shadow-[0_8px_16px_rgba(216,199,0,0.28)] transition-[width,height,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            width: '88px',
            height: '88px',
          }}
        >
          <Building2 className="h-9 w-9" strokeWidth={1.8} />
        </div>
      ) : null}

      <div className="flex h-full flex-col">
        <div
          className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            expanded
              ? 'text-center'
              : 'flex h-full flex-col items-center justify-center text-center'
          }`}
        >
          <h3
            className="font-semibold text-[#0F3F1D] transition-[font-size,line-height,margin] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              fontSize: expanded ? '26px' : '25px',
              lineHeight: expanded ? '1.2' : '1.35',
            }}
          >
            {slide.title}
          </h3>
          <div
            className="mx-auto mt-3 rounded-full bg-[#C7C006] transition-[width,margin] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              width: expanded ? '112px' : '92px',
              height: '3px',
            }}
          />
        </div>

        <div
          className="overflow-hidden transition-[max-height,opacity,margin,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            maxHeight: expanded ? '340px' : '0px',
            opacity: expanded ? 1 : 0,
            marginTop: expanded ? '24px' : '0px',
            transform: expanded ? 'translateY(0)' : 'translateY(16px)',
            pointerEvents: expanded ? 'auto' : 'none',
          }}
        >
          <p className="text-[15px] leading-[1.8] text-[#213A16]">
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

          <div className="mt-8 flex items-end justify-between gap-4">
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
    </div>
  );
}

export default function EstatesResearchSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

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
      startTransition(() => {
        setActiveIndex((current) => (current + 1) % slides.length);
      });
    }, AUTOPLAY_DELAY_MS);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  const positionedSlides = useMemo(
    () =>
      slides.map((slide, index) => ({
        slide,
        offset: getWrappedOffset(index, activeIndex, slides.length),
      })),
    [activeIndex, slides]
  );

  const goToSlide = (index: number) => {
    startTransition(() => {
      setActiveIndex(index);
    });
  };

  return (
    <div className="relative mt-10 pb-16 lg:mt-14 lg:pb-10">
      <div className="relative h-[500px] md:h-[540px] lg:h-[600px]">
        {positionedSlides.map(({ slide, offset }) => {
          const styleConfig = isMobile
            ? getMobileStyle(offset)
            : getDesktopStyle(offset);
          const expanded = offset === 0;
          const visible = isMobile ? expanded : Math.abs(offset) <= 1;

          return (
            <article
              key={slide.id}
              className="absolute transition-[left,top,width,height,opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                left: styleConfig.left,
                top: styleConfig.top,
                width: styleConfig.width,
                height: styleConfig.height,
                opacity: styleConfig.opacity,
                zIndex: styleConfig.zIndex,
                transform: 'translateX(-50%)',
                pointerEvents: visible ? 'auto' : 'none',
              }}
              aria-hidden={!visible}
            >
              <EstateSlideCard
                slide={slide}
                expanded={expanded}
                isLeft={offset < 0}
              />
            </article>
          );
        })}
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
