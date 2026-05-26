'use client';

import Image from 'next/image';
import type { KeyboardEvent } from 'react';
import { useEffect, useState } from 'react';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';

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
  isDesktop,
  onActivate,
  reduceMotion,
}: {
  card: EstateSubstationActivityCard;
  expanded: boolean;
  isDesktop: boolean;
  onActivate: () => void;
  reduceMotion: boolean;
}) {
  const interactiveProps = isDesktop
    ? {
        onMouseEnter: onActivate,
        onFocus: onActivate,
      }
    : {
        onClick: onActivate,
        onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onActivate();
          }
        },
      };

  const transitionDuration = reduceMotion ? '0ms' : '700ms';

  return (
    <button
      type="button"
      aria-pressed={expanded}
      aria-label={`Show details for ${card.title}`}
      className="relative overflow-hidden rounded-[12px] bg-white text-left outline-none focus-visible:ring-2 focus-visible:ring-[#A1DF0A] focus-visible:ring-offset-4 focus-visible:ring-offset-[#394E10]"
      style={{
        width: expanded ? '420px' : '120px',
        height: '630px',
        transitionProperty:
          'width, box-shadow, transform, background-color, border-color',
        transitionDuration,
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        boxShadow: expanded
          ? '0 18px 44px rgba(15, 63, 29, 0.18)'
          : '0 10px 24px rgba(15, 63, 29, 0.08)',
      }}
      {...interactiveProps}
    >
      <div className="absolute inset-0">
        <Image
          src={card.imageSrc}
          alt={card.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 767px) 78vw, (max-width: 1023px) 42vw, 420px"
        />
        <div
          className="absolute inset-0"
          style={{
            background: expanded
              ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, #2E7D32 100%)'
              : '#FFFFFF',
            opacity: expanded ? 1 : 0,
            transition: `opacity ${transitionDuration} cubic-bezier(0.22, 1, 0.36, 1)`,
          }}
        />
      </div>

      <div
        className="absolute inset-0 bg-white"
        style={{
          opacity: expanded ? 0 : 1,
          transition: `opacity ${transitionDuration} cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      />

      <div className="relative z-10 flex h-full flex-col px-5 py-9">
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
            <h3 className="max-w-[300px] text-[18px] font-medium leading-[1.3] md:text-[20px]">
              {card.title}
            </h3>
            <p className="mt-4 max-w-[300px] text-[13px] leading-[1.9] text-white/92 md:text-[14px]">
              {card.description}
            </p>
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
      </div>
    </button>
  );
}

export default function EstateSubstationActivitiesSection({
  content,
}: EstateSubstationActivitiesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncViewport = (event?: MediaQueryListEvent) => {
      setIsDesktop(event ? event.matches : desktopQuery.matches);
    };

    const syncMotion = (event?: MediaQueryListEvent) => {
      setReduceMotion(event ? event.matches : motionQuery.matches);
    };

    syncViewport();
    syncMotion();

    desktopQuery.addEventListener('change', syncViewport);
    motionQuery.addEventListener('change', syncMotion);

    return () => {
      desktopQuery.removeEventListener('change', syncViewport);
      motionQuery.removeEventListener('change', syncMotion);
    };
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={content.backgroundImageSrc}
          alt={content.backgroundImageAlt}
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0) 0%, #394E10 100%)',
          }}
        />
      </div>

      <div className="relative z-10 px-4 py-16 md:px-6 md:py-20 lg:px-36 lg:py-24">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="max-w-[720px] pt-1">
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
              customSize="clamp(2.2rem, 3vw, 3.5rem)"
              className="mt-5 leading-[1.1] tracking-[-0.02em]"
            />

            {content.description ? (
              <p className="mt-6 max-w-[430px] text-[15px] leading-[1.9] text-white/88 md:text-[16px]">
                {content.description}
              </p>
            ) : null}
          </div>

          <div className="mt-10 overflow-x-auto pb-2 md:mt-12 lg:mt-14 [scrollbar-color:rgba(255,255,255,0.24)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/30">
            <div className="flex min-w-max items-end justify-end gap-[42px] pl-1 md:pl-2 lg:ml-auto lg:w-full">
              {content.cards.map((card, index) => (
                <ActivityRailCard
                  key={`${card.title}-${index}`}
                  card={card}
                  expanded={index === activeIndex}
                  isDesktop={isDesktop}
                  onActivate={() => setActiveIndex(index)}
                  reduceMotion={reduceMotion}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
