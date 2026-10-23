'use client';

import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import React, { useId, useState } from 'react';
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
}

function HighlightImage({
  item,
  className,
  sizes,
}: {
  item: DepartmentResearchHighlightItem;
  className: string;
  sizes: string;
}) {
  if (!item.imageSrc) {
    return <div className="absolute inset-0 bg-[rgba(161,223,10,0.11)]" />;
  }

  return (
    <Image
      src={item.imageSrc}
      alt={item.imageAlt || item.title}
      fill
      className={className}
      sizes={sizes}
      unoptimized={isLocalhostAssetUrl(item.imageSrc)}
    />
  );
}

function ResearchHighlightCard({
  item,
  isExpanded,
  onToggle,
}: {
  item: DepartmentResearchHighlightItem;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const detailsId = useId();
  const hasImage = Boolean(item.imageSrc);

  return (
    <article data-department-reveal className="mx-auto w-full max-w-[420px] md:max-w-none">
      {/* Mobile and tablet: explicit disclosure with content in normal document flow. */}
      <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_18px_46px_rgba(15,63,29,0.12)] xl:hidden">
        <div className="relative h-[280px] overflow-hidden md:h-[300px]">
          <HighlightImage
            item={item}
            className="object-cover"
            sizes="(max-width: 767px) 100vw, 50vw"
          />
          {hasImage ? (
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,55,20,0.04)_20%,rgba(9,55,20,0.94)_100%)]" />
          ) : null}

          <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-6">
            <h3
              className={`max-w-[26ch] text-[17px] font-semibold leading-[1.4] md:text-[18px] ${
                hasImage ? 'text-white' : 'text-[#2E7D32]'
              }`}
            >
              {item.title}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isExpanded}
          aria-controls={detailsId}
          className="flex w-full cursor-pointer items-center justify-between gap-4 bg-white px-5 py-4 text-left text-[14px] font-semibold text-[#205C2E] outline-none transition-colors hover:bg-[#F4F9EE] focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-inset motion-reduce:transition-none md:px-6"
        >
          <span>{isExpanded ? 'Hide details' : 'View details'}</span>
          <ChevronDown
            aria-hidden="true"
            className={`h-5 w-5 shrink-0 transition-transform duration-300 motion-reduce:transition-none ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        <div
          id={detailsId}
          aria-hidden={!isExpanded}
          className={`grid bg-[#0B3B1B] transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
            isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="px-5 pb-6 pt-5 md:px-6 md:pb-7 md:pt-6">
              <p className="text-[14px] leading-[1.7] text-white/95 md:text-[15px]">
                {item.description}
              </p>

              {item.researchTeam ? (
                <div className="mt-6 border-t border-white/20 pt-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#D5F08B]">
                    Research Team
                  </p>
                  <p className="mt-2 text-[14px] leading-[1.6] text-white md:text-[15px]">
                    {item.researchTeam}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: hover or keyboard focus reveals the back face. */}
      <div
        tabIndex={0}
        aria-label={`${item.title}. Focus or hover to view details.`}
        className="group hidden rounded-[28px] outline-none [perspective:1600px] focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-4 xl:block"
      >
        <div
          className="relative h-[400px] w-full transform-gpu transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus:[transform:rotateY(180deg)] motion-reduce:transition-none"
          style={{ WebkitTransformStyle: 'preserve-3d' }}
        >
          <div
            className="absolute inset-0 isolate overflow-hidden rounded-[28px] shadow-[0_18px_46px_rgba(15,63,29,0.12)]"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
            }}
          >
            <HighlightImage
              item={item}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-focus:scale-105 motion-reduce:transition-none"
              sizes="33vw"
            />
            {hasImage ? (
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(161,223,10,0)_0%,#093714_100%)]" />
            ) : null}

            <div className="relative z-10 flex h-full flex-col justify-end p-6">
              <h3
                className={`max-w-[22ch] text-[17px] font-semibold leading-[1.35] ${
                  hasImage ? 'text-white' : 'text-[#2E7D32]'
                }`}
              >
                {item.title}
              </h3>
            </div>
          </div>

          <div
            className="absolute inset-0 isolate overflow-hidden rounded-[28px] shadow-[0_18px_46px_rgba(15,63,29,0.12)]"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg) translateZ(0)',
            }}
          >
            <HighlightImage item={item} className="object-cover" sizes="33vw" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,75,36,0.45)_0%,rgba(8,40,18,0.88)_48%,rgba(8,40,18,0.96)_100%)]" />

            <div className="relative z-10 flex h-full min-h-0 flex-col px-6 pb-7 pt-7">
              <h3 className="shrink-0 text-[16px] font-semibold leading-[1.4] text-[#A1DF0A]">
                {item.title}
              </h3>

              <div className="location-details-scroll mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-3">
                <p className="text-[14px] leading-[1.65] text-white/95">{item.description}</p>
              </div>

              {item.researchTeam ? (
                <div className="mt-5 shrink-0 border-t border-white/20 pt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#D5F08B]">
                    Research Team
                  </p>
                  <p className="mt-2 text-[14px] leading-[1.5] text-white">
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
 * Department research highlights as disclosures on touch layouts and flip tiles on desktop.
 */
export default function DepartmentResearchHighlightsSection({
  tagText,
  titlePart1,
  titlePart2,
  highlights,
  containerClassName = '',
}: DepartmentResearchHighlightsSectionProps) {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const handleToggle = (id: string) => {
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
              isExpanded={activeCard === item.id}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
