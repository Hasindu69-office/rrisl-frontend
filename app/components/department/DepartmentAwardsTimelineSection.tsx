'use client';

import Image from 'next/image';
import React from 'react';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';

export interface DepartmentAwardItem {
  id: string;
  title: string;
  officers?: string;
  details: string;
  year: number;
  imageSrc?: string;
  imageAlt?: string;
  sortorder?: number;
}

interface DepartmentAwardsTimelineSectionProps {
  tagText: string;
  titlePart1: string | React.ReactNode;
  titlePart2: string | React.ReactNode;
  items: DepartmentAwardItem[];
  containerClassName?: string;
}

function AwardLedgerRow({
  item,
  index,
}: {
  item: DepartmentAwardItem;
  index: number;
}) {
  const hasImage = Boolean(item.imageSrc);
  const useUnoptimizedImage = hasImage ? isLocalhostAssetUrl(item.imageSrc!) : false;
  const isOdd = index % 2 === 1;

  return (
    <article
      data-department-reveal
      className={`overflow-hidden rounded-[24px] border border-[#DCE9D5] ${
        isOdd ? 'bg-[#F5F9F2]' : 'bg-white'
      } shadow-[0_14px_34px_rgba(15,63,29,0.05)]`}
    >
      <div className="grid gap-5 p-5 md:grid-cols-[110px_minmax(0,1fr)] md:gap-6 md:p-6 lg:grid-cols-[120px_minmax(0,1fr)_200px] lg:items-stretch lg:gap-8 lg:p-7">
        <div className="flex items-start md:items-center">
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[20px] bg-[#0F4B24] md:h-[88px] md:w-[88px] lg:h-[96px] lg:w-full lg:max-w-[104px]">
            <span className="text-[22px] font-bold tracking-[-0.02em] text-[#A1DF0A] md:text-[26px] lg:text-[28px]">
              {item.year}
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="text-[18px] font-semibold leading-[1.4] text-[#153C21] md:text-[20px]">
            {item.title}
          </h3>

          {item.officers ? (
            <p className="mt-2 text-[13px] font-medium uppercase tracking-[0.08em] text-[#2E7D32] md:text-[12px] md:tracking-[0.12em]">
              {item.officers}
            </p>
          ) : null}

          <p className="mt-3 text-[14px] leading-[1.75] text-[#35473A] md:text-[15px] md:leading-[1.8]">
            {item.details}
          </p>
        </div>

        {hasImage ? (
          <div className="relative mx-auto aspect-[4/3] w-full max-w-[220px] overflow-hidden rounded-[18px] border border-[#DDE9D8] bg-[#EAF4E5] lg:mx-0 lg:max-w-none lg:self-center">
            <Image
              src={item.imageSrc!}
              alt={item.imageAlt || item.title}
              fill
              className="object-cover"
              sizes="(max-width: 1023px) 220px, 200px"
              unoptimized={useUnoptimizedImage}
            />
          </div>
        ) : (
          <div className="hidden lg:block" aria-hidden="true" />
        )}
      </div>
    </article>
  );
}

/**
 * Department awards as an always-open year-rail ledger (not accordion / not timeline).
 */
export default function DepartmentAwardsTimelineSection({
  tagText,
  titlePart1,
  titlePart2,
  items,
  containerClassName = '',
}: DepartmentAwardsTimelineSectionProps) {
  if (items.length === 0) {
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

        <div className="mt-10 space-y-4 md:mt-12 md:space-y-5">
          {items.map((item, index) => (
            <AwardLedgerRow key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
