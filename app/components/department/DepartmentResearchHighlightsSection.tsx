'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';

export interface DepartmentResearchHighlightItem {
  id: string;
  title: string;
  description: string;
  researchTeam?: string;
  imageSrc?: string;
  imageAlt?: string;
}

interface DepartmentResearchHighlightsSectionProps {
  tagText: string;
  titlePart1: string | React.ReactNode;
  titlePart2: string | React.ReactNode;
  highlights: DepartmentResearchHighlightItem[];
  containerClassName?: string;
  enableTouchFlip?: boolean;
}

function ResearchHighlightCard({
  item,
  isDesktop,
  isFlipped,
  onToggle,
}: {
  item: DepartmentResearchHighlightItem;
  isDesktop: boolean;
  isFlipped: boolean;
  onToggle: () => void;
}) {
  const hasImage = Boolean(item.imageSrc);
  const useUnoptimizedImage = hasImage ? isLocalhostAssetUrl(item.imageSrc!) : false;

  const interactiveProps = isDesktop
    ? {}
    : {
        onClick: onToggle,
        onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onToggle();
          }
        },
        role: 'button' as const,
        tabIndex: 0,
        'aria-pressed': isFlipped,
      };

  return (
    <article
      data-department-reveal
      className="group mx-auto w-full max-w-[360px] cursor-pointer [perspective:1600px] md:max-w-none xl:cursor-default"
      {...interactiveProps}
    >
      <div
        className="relative h-[340px] w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] md:h-[356px] xl:h-[400px] xl:group-hover:[transform:rotateY(180deg)]"
        style={
          !isDesktop
            ? { transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }
            : undefined
        }
      >
        {/* FRONT */}
        <div className="absolute inset-0 overflow-hidden rounded-[28px] shadow-[0_18px_46px_rgba(15,63,29,0.12)] [backface-visibility:hidden]">
          {hasImage ? (
            <>
              <Image
                src={item.imageSrc!}
                alt={item.imageAlt || item.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                unoptimized={useUnoptimizedImage}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(161, 223, 10, 0) 0%, #093714 100%)',
                }}
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-[rgba(161,223,10,0.11)]" />
          )}

          <div className="relative z-10 flex h-full min-h-0 flex-col justify-end p-5 md:p-6">
            <h3
              className={`max-w-[22ch] text-[15px] font-semibold leading-[1.35] md:text-[16px] xl:text-[17px] ${
                hasImage ? 'text-white' : 'text-[#2E7D32]'
              }`}
            >
              {item.title}
            </h3>
          </div>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 overflow-hidden rounded-[28px] shadow-[0_18px_46px_rgba(15,63,29,0.12)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {hasImage ? (
            <>
              <Image
                src={item.imageSrc!}
                alt={item.imageAlt || item.title}
                fill
                className="object-cover"
                sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                unoptimized={useUnoptimizedImage}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,75,36,0.45)_0%,rgba(8,40,18,0.88)_48%,rgba(8,40,18,0.96)_100%)]" />
            </>
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#0F4B24_0%,#082812_100%)]" />
          )}

          <div className="relative z-10 flex h-full min-h-0 flex-col px-5 pb-6 pt-6 md:px-6 md:pb-7 md:pt-7">
            <h3 className="shrink-0 text-[14px] font-semibold leading-[1.4] text-[#A1DF0A] md:text-[15px] xl:text-[16px]">
              {item.title}
            </h3>

            <div className="location-details-scroll mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-3">
              <p className="text-[13px] leading-[1.65] text-white/95 md:text-[13px] xl:text-[14px]">
                {item.description}
              </p>

              {item.researchTeam ? (
                <div className="mt-5 border-t border-white/15 pt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#D5F08B]">
                    Research Team
                  </p>
                  <p className="mt-2 text-[13px] leading-[1.5] text-white md:text-[13px] xl:text-[14px]">
                    {item.researchTeam}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Department research highlights as flip tiles (front title / back description + team).
 */
export default function DepartmentResearchHighlightsSection({
  tagText,
  titlePart1,
  titlePart2,
  highlights,
  containerClassName = '',
  enableTouchFlip = true,
}: DepartmentResearchHighlightsSectionProps) {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1280px)');

    const updateIsDesktop = (event?: MediaQueryListEvent) => {
      const matches = event ? event.matches : mediaQuery.matches;
      setIsDesktop(matches);
      if (matches) {
        setActiveCard(null);
      }
    };

    updateIsDesktop();
    mediaQuery.addEventListener('change', updateIsDesktop);

    return () => mediaQuery.removeEventListener('change', updateIsDesktop);
  }, []);

  const handleToggle = (id: string) => {
    if (isDesktop || !enableTouchFlip) {
      return;
    }

    setActiveCard((current) => (current === id ? null : id));
  };

  if (highlights.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16 md:py-20 lg:py-24">
      <div className={`mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8 ${containerClassName}`}>
        <div className="text-center" data-department-reveal>
          <GradientTag
            text={tagText}
            backgroundColor="transparent"
            className="inline-block"
            padding="px-4 py-1"
          />

          <GradientTitle
            part1={titlePart1}
            part2={titlePart2}
            lineBreak={false}
            part1Color="dark-green"
            size="custom"
            customSize="clamp(28px, 4vw, 50px)"
            align="center"
            className="mt-5 font-bold leading-[1.15]"
          />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 md:mt-12 md:grid-cols-2 md:gap-10 xl:grid-cols-3 xl:gap-12">
          {highlights.map((item) => (
            <ResearchHighlightCard
              key={item.id}
              item={item}
              isDesktop={isDesktop}
              isFlipped={activeCard === item.id}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
