'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';

export interface DepartmentServiceItem {
  number: string;
  title: string;
  description: string;
  iconSrc: string;
  iconAlt: string;
  imageSrc: string;
  imageAlt: string;
}

interface DepartmentServicesSectionProps {
  tagText: string;
  titlePart1: string | React.ReactNode;
  titlePart2: string | React.ReactNode;
  items: DepartmentServiceItem[];
  containerClassName?: string;
  enableTouchFlip?: boolean;
}

function ServiceNumberBadge({
  number,
  isBack = false,
}: {
  number: string;
  isBack?: boolean;
}) {
  return (
    <div
      className={[
        'absolute right-0 top-0 flex h-[64px] w-[56px] items-center justify-center rounded-bl-[20px] rounded-tr-[20px] md:h-[68px] md:w-[58px] xl:h-[74px] xl:w-[62px]',
        isBack ? 'bg-[#A1DF0A]' : 'bg-[#0F4B24]',
      ].join(' ')}
    >
      <span
        className={[
          'text-[20px] font-semibold leading-none tracking-[-0.04em] md:text-[22px] xl:text-[24px]',
          isBack ? 'text-[#0F4B24]' : 'text-[#A1DF0A]',
        ].join(' ')}
      >
        {number}
      </span>
    </div>
  );
}

function DepartmentServiceCard({
  item,
  isDesktop,
  isFlipped,
  onToggle,
}: {
  item: DepartmentServiceItem;
  isDesktop: boolean;
  isFlipped: boolean;
  onToggle: () => void;
}) {
  const useUnoptimizedIcon = isLocalhostAssetUrl(item.iconSrc);
  const useUnoptimizedImage = isLocalhostAssetUrl(item.imageSrc);

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
        className="relative h-[340px] w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] md:h-[356px] xl:h-[416px] xl:group-hover:[transform:rotateY(180deg)]"
        style={
          !isDesktop
            ? { transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }
            : undefined
        }
      >
        {/* FRONT SIDE - SOLID CARD WITH TITLE ONLY */}
        <div className="absolute inset-0 overflow-hidden rounded-[20px] bg-[rgba(161,223,10,0.11)] [backface-visibility:hidden]">
          <ServiceNumberBadge number={item.number} />

          <div className="flex h-full min-h-0 flex-col px-5 pb-8 pt-14 md:px-6 md:pb-9 md:pt-[58px] xl:px-6 xl:pb-10 xl:pt-16">
            <div className="mb-7 flex h-[48px] w-[48px] shrink-0 items-center justify-center md:mb-8 md:h-[52px] md:w-[52px] xl:mb-10 xl:h-[56px] xl:w-[56px]">
              <Image
                src={item.iconSrc}
                alt={item.iconAlt}
                width={56}
                height={56}
                className="h-full w-full object-contain"
                unoptimized={useUnoptimizedIcon}
                style={{
                  filter:
                    'brightness(0) saturate(100%) invert(16%) sepia(35%) saturate(921%) hue-rotate(88deg) brightness(95%) contrast(98%)',
                }}
              />
            </div>

            <div className="max-w-[275px] xl:max-w-[250px]">
              <h3 className="text-[16px] font-semibold leading-[1.45] text-[#2E7D32] md:text-[18px] xl:text-[18px]">
                {item.title}
              </h3>
            </div>
          </div>
        </div>

        {/* BACK SIDE - IMAGE CARD WITH FULL DESCRIPTION + SCROLLER */}
        <div className="absolute inset-0 overflow-hidden rounded-[20px] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <Image
            src={item.imageSrc}
            alt={item.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
            unoptimized={useUnoptimizedImage}
          />

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,75,36,0.45)_0%,rgba(8,40,18,0.88)_48%,rgba(8,40,18,0.96)_100%)]" />

          <ServiceNumberBadge number={item.number} isBack />

          <div className="relative z-10 flex h-full min-h-0 flex-col px-5 pb-7 pt-14 md:px-6 md:pb-8 md:pt-[58px] xl:px-6 xl:pb-9 xl:pt-16">
            <div className="mb-4 flex h-[40px] w-[40px] shrink-0 items-center justify-center md:h-[44px] md:w-[44px] xl:h-[48px] xl:w-[48px]">
              <Image
                src={item.iconSrc}
                alt={item.iconAlt}
                width={56}
                height={56}
                className="h-full w-full object-contain brightness-0 invert"
                unoptimized={useUnoptimizedIcon}
              />
            </div>

            <div className="flex min-h-0 max-w-[285px] flex-1 flex-col overflow-hidden xl:max-w-[260px]">
              <h3 className="text-[14px] font-semibold leading-[1.45] text-[#A1DF0A] md:text-[15px] xl:text-[16px]">
                {item.title}
              </h3>

              <div className="location-details-scroll mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-4">
                <p className="text-[13px] leading-[1.65] text-white/95 md:text-[13px] xl:text-[14px] xl:leading-[1.65]">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Reusable department services section with responsive flip cards for department pages.
 */
export default function DepartmentServicesSection({
  tagText,
  titlePart1,
  titlePart2,
  items,
  containerClassName = '',
  enableTouchFlip = true,
}: DepartmentServicesSectionProps) {
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

  const handleToggle = (number: string) => {
    if (isDesktop || !enableTouchFlip) return;

    setActiveCard((current) => (current === number ? null : number));
  };

  return (
    <section className="bg-[rgba(161,223,10,0.13)] py-16 md:py-20 lg:py-24">
      <div className={`mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8 ${containerClassName}`}>
        <div
          className="flex flex-col items-center text-center xl:items-end xl:text-right"
          data-department-reveal
        >
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
            className="mt-5 font-bold leading-[1.15] xl:text-right"
          />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 md:mt-12 md:grid-cols-2 md:gap-10 xl:grid-cols-3 xl:gap-12">
          {items.map((item) => (
            <DepartmentServiceCard
              key={item.number}
              item={item}
              isDesktop={isDesktop}
              isFlipped={activeCard === item.number}
              onToggle={() => handleToggle(item.number)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
