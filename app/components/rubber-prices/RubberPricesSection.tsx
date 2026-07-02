'use client';

import type { ReactNode, RefObject } from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  FolderKanban,
  X,
} from 'lucide-react';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';
import Button from '@/app/components/ui/Button';
import GradientTag from '@/app/components/ui/GradientTag';
import GradientTitle from '@/app/components/ui/GradientTitle';
import type { RubberPriceEntry, RubberPricesSectionContent } from '@/app/lib/types';

gsap.registerPlugin(ScrollTrigger);

interface RubberPricesSectionProps {
  content: RubberPricesSectionContent;
  entries: RubberPriceEntry[];
  latestEntry: RubberPriceEntry | null;
  recentEntries: RubberPriceEntry[];
  archiveYears: string[];
  entriesByYear: Record<string, RubberPriceEntry[]>;
}

const VIEWER_TRANSITION_MS = 260;

function formatDisplayDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
}

function formatCompactDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
}

function getStatusLabel(entry: RubberPriceEntry) {
  if (entry.status === 'latest') {
    return 'latest';
  }

  if (entry.status === 'recent') {
    return 'recent';
  }

  return 'archive';
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      data-rubber-prices-stat
      className="rounded-[20px] border border-[#E4ECE0] bg-white/88 p-4 shadow-[0_18px_40px_rgba(15,63,29,0.05)] backdrop-blur sm:rounded-[22px] sm:p-5"
    >
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F1F8EB] text-[#1F6D31] sm:h-11 sm:w-11">
        {icon}
      </div>
      <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#7A8C82]">
        {label}
      </p>
      <p className="mt-2 text-[17px] font-semibold leading-tight text-[#12311D] sm:text-[18px]">
        {value}
      </p>
    </div>
  );
}

function RubberPricePreviewCard({
  entry,
  content,
}: {
  entry: RubberPriceEntry;
  content: RubberPricesSectionContent;
}) {
  const statusLabelMap = {
    latest: content.latestWeeklyUploadLabel,
    recent: content.recentWeeklyUploadLabel,
    archive: content.archiveEntryLabel,
  } as const;
  const useUnoptimizedImage = isLocalhostAssetUrl(entry.imageSrc);

  return (
    <article className="overflow-hidden rounded-[24px] border border-[#E1EBDD] bg-white shadow-[0_26px_80px_rgba(15,63,29,0.10)] sm:rounded-[28px] lg:rounded-[30px]">
      <div className="border-b border-[#E5EEE1] bg-[radial-gradient(circle_at_top_right,_rgba(161,223,10,0.16),_transparent_32%),linear-gradient(135deg,#F7FBF4_0%,#EEF6EA_100%)] px-4 py-5 sm:px-6 sm:py-6 md:px-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="inline-flex items-center rounded-full border border-[#D6E5CF] bg-white/90 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#1E6B2F]">
              {statusLabelMap[getStatusLabel(entry)]}
            </div>
            <h3 className="mt-4 text-[24px] font-semibold leading-tight text-[#10341B] sm:text-[28px] md:text-[34px]">
              {content.auctionPriceLabel}
            </h3>
            <p className="mt-2 text-[14px] leading-7 text-[#566A5F] sm:text-[15px] md:text-[16px]">
              {content.dateOfAuctionLabel} {formatDisplayDate(entry.date)}
            </p>
          </div>

          <a
            href={entry.imageSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start"
          >
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="min-h-11 gap-2 !rounded-full !bg-[#0F3F1D] px-4 py-3 text-sm font-semibold sm:px-5"
            >
              <span className="inline-flex items-center gap-2">
                <span>{content.openFullSheetButtonLabel}</span>
                <ExternalLink className="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
              </span>
            </Button>
          </a>
        </div>
      </div>

      <div className="bg-[linear-gradient(180deg,#F5F8F1_0%,#FFFFFF_100%)] p-3 sm:p-4 md:p-6">
        <div className="rounded-[22px] border border-[#E1EBDD] bg-white p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] sm:rounded-[24px] sm:p-3 md:rounded-[26px] md:p-5">
          <div className="rounded-[18px] border border-dashed border-[#D7E4D1] bg-[#FAFCF8] p-2.5 sm:rounded-[20px] sm:p-3 md:rounded-[22px] md:p-4">
            <div className="relative mx-auto aspect-[454/391] w-full max-w-[860px] overflow-hidden rounded-[16px] bg-white shadow-[0_18px_40px_rgba(15,63,29,0.08)]">
              <Image
                src={entry.imageSrc}
                alt={entry.imageAlt}
                fill
                className="object-contain"
                sizes="(max-width: 767px) 100vw, (max-width: 1279px) 90vw, 860px"
                priority
                unoptimized={useUnoptimizedImage}
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function RubberPriceDateChip({
  entry,
  active,
  onSelect,
  compact = false,
}: {
  entry: RubberPriceEntry;
  active: boolean;
  onSelect: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`group inline-flex cursor-pointer items-center rounded-full border text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-2 ${
        compact ? 'min-h-10 w-full gap-2 px-3 py-2.5' : 'min-h-11 min-w-max gap-3 px-4 py-3'
      } ${
        active
          ? 'border-[#2E7D32] bg-[#2E7D32] text-white shadow-[0_18px_34px_rgba(46,125,50,0.22)]'
          : 'border-[#D7E3D3] bg-white text-[#16311F] hover:border-[#BFD4B8] hover:bg-[#F7FBF4]'
      }`}
    >
      <span
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition ${
          compact ? 'h-8 w-8' : 'h-9 w-9'
        } ${
          active
            ? 'bg-white/18 text-white'
            : 'bg-[#F2F7ED] text-[#2E7D32] group-hover:bg-[#E7F2DF]'
        }`}
      >
        <CalendarDays className="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
      </span>
      <span className={`${compact ? 'text-[12px]' : 'text-sm'} font-semibold`}>
        {formatCompactDate(entry.date)}
      </span>
    </button>
  );
}

function RubberPriceArchiveNav({
  content,
  archiveYears,
  entriesByYear,
  activeYear,
  expandedMobileYear,
  activeEntryId,
  desktopListRef,
  onYearSelect,
  onMobileYearToggle,
  onEntrySelect,
}: {
  content: RubberPricesSectionContent;
  archiveYears: string[];
  entriesByYear: Record<string, RubberPriceEntry[]>;
  activeYear: string;
  expandedMobileYear: string | null;
  activeEntryId: string;
  desktopListRef: RefObject<HTMLDivElement | null>;
  onYearSelect: (year: string) => void;
  onMobileYearToggle: (year: string) => void;
  onEntrySelect: (entryId: string) => void;
}) {
  return (
    <section
      data-rubber-prices-archive
      className="mt-12 overflow-x-hidden rounded-[24px] border border-[#E3EBDD] bg-white p-4 shadow-[0_24px_70px_rgba(15,63,29,0.08)] sm:rounded-[26px] sm:p-5 md:mt-14 md:p-6 lg:rounded-[30px] lg:p-10"
    >
      <div
        data-rubber-prices-archive-header
        className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between"
      >
        <div className="max-w-[720px] min-w-0">
          <GradientTag
            text={content.archiveTag}
            className="inline-block"
            gradientFrom="#20C997"
            gradientTo="#A1DF0A"
          />

          <div className="mt-6">
            <GradientTitle
              part1={content.archiveTitlePart1}
              part2={content.archiveTitlePart2}
              lineBreak={false}
              part1Color="dark-green"
              size="custom"
              customSize="clamp(1.7rem,3.4vw,3.4rem)"
              className="leading-[1.08]"
            />
          </div>

          <p className="mt-4 text-[14px] leading-7 text-[#5A6B61] sm:mt-5 sm:text-[15px] md:text-[16px] md:leading-8">
            {content.archiveDescription}
          </p>
        </div>

        <div className="inline-flex self-start rounded-full border border-[#E6EEE2] bg-[#F7FBF5] px-4 py-2.5 text-sm text-[#4E6358] lg:hidden">
          <span className="font-semibold text-[#11351D]">{content.archiveYearLabel}:</span>{' '}
          {activeYear}
        </div>

        <div className="hidden rounded-[24px] border border-[#E6EEE2] bg-[#F7FBF5] px-5 py-4 text-sm text-[#4E6358] lg:block">
          <span className="font-semibold text-[#11351D]">{content.activeArchiveLabel}:</span>{' '}
          {activeYear}
        </div>
      </div>

        <div className="mt-8 hidden min-w-0 gap-8 lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="space-y-3">
            {archiveYears.map((year) => {
              const isActive = year === activeYear;
            const yearEntries = entriesByYear[year] ?? [];

            return (
              <button
                key={year}
                type="button"
                onClick={() => onYearSelect(year)}
                aria-pressed={isActive}
                data-rubber-prices-year-card
                className={`w-full cursor-pointer rounded-[24px] border p-5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-2 ${
                  isActive
                    ? 'border-[#2E7D32] bg-[#0F3F1D] text-white shadow-[0_20px_44px_rgba(15,63,29,0.20)]'
                    : 'border-[#E0E9DC] bg-[#F8FBF6] text-[#16311F] hover:border-[#C5D9BE] hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={`text-[12px] font-semibold uppercase tracking-[0.14em] ${isActive ? 'text-[#BFEA8B]' : 'text-[#759081]'}`}>
                      {content.archiveYearLabel}
                    </p>
                    <p className="mt-2 text-[28px] font-semibold leading-none">
                      {year}
                    </p>
                    <p className={`mt-3 text-sm ${isActive ? 'text-white/78' : 'text-[#5E7268]'}`}>
                      {yearEntries.length} {content.uploadsLabel.toLowerCase()}
                    </p>
                  </div>
                  <span className={`mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full ${isActive ? 'bg-white/14 text-white' : 'bg-white text-[#2E7D32]'}`}>
                    <FolderKanban className="h-5 w-5" strokeWidth={2.1} aria-hidden="true" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div
          ref={desktopListRef}
          data-rubber-prices-desktop-list
          className="rounded-[26px] border border-[#E5EEE1] bg-[#F8FBF6] p-5 md:p-6"
        >
          <div
            data-rubber-prices-desktop-copy
            className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#7A8C82]">
                {content.availableDatesLabel}
              </p>
              <p className="mt-2 text-[24px] font-semibold text-[#12311D]">
                {activeYear} {content.weeklyUploadsLabel.toLowerCase()}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-sm font-medium text-[#436055]">
              <Clock3 className="h-4 w-4 text-[#2E7D32]" strokeWidth={2.1} aria-hidden="true" />
              <span>{content.newestDataShownLabel}</span>
            </div>
          </div>

          <div data-rubber-prices-date-chips className="mt-6 flex flex-wrap gap-3">
            {(entriesByYear[activeYear] ?? []).map((entry) => (
              <RubberPriceDateChip
                key={entry.id}
                entry={entry}
                active={entry.id === activeEntryId}
                onSelect={() => onEntrySelect(entry.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3 lg:hidden">
        {archiveYears.map((year) => {
          const isActive = year === activeYear;
          const isExpanded = year === expandedMobileYear;
          const yearEntries = entriesByYear[year] ?? [];

          return (
            <div
              key={year}
              data-rubber-prices-mobile-year
              className={`overflow-hidden rounded-[22px] border transition ${
                isExpanded
                  ? 'border-[#2E7D32] bg-[#F8FBF6] shadow-[0_18px_36px_rgba(15,63,29,0.08)]'
                  : 'border-[#E2EADF] bg-white'
              }`}
            >
              <button
                type="button"
                onClick={() => onMobileYearToggle(year)}
                aria-expanded={isExpanded}
                className="flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-inset"
              >
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#759081]">
                    {content.archiveYearLabel}
                  </p>
                  <p className="mt-2 text-[24px] font-semibold leading-none text-[#16311F]">
                    {year}
                  </p>
                  <p className={`mt-2 text-sm ${isActive ? 'text-[#2E7D32]' : 'text-[#5E7268]'}`}>
                    {yearEntries.length} {content.uploadsLabel.toLowerCase()}
                  </p>
                </div>
                <span
                  className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${
                    isExpanded ? 'bg-[#0F3F1D] text-white' : 'bg-[#F3F8EF] text-[#2E7D32]'
                  }`}
                >
                  <ChevronDown
                    className={`h-5 w-5 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180' : 'rotate-0'
                    }`}
                    strokeWidth={2.1}
                    aria-hidden="true"
                  />
                </span>
              </button>

              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div
                    className={`border-t border-[#E5EEE1] px-4 pb-4 pt-4 transition-[opacity,transform] duration-250 ease-out ${
                      isExpanded
                        ? 'translate-y-0 opacity-100'
                        : '-translate-y-1 opacity-0'
                    }`}
                  >
                  <div className="flex items-center gap-2 text-sm font-medium text-[#436055]">
                    <Clock3 className="h-4 w-4 text-[#2E7D32]" strokeWidth={2.1} aria-hidden="true" />
                    <span>{content.tapWeeklyDateLabel}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {yearEntries.map((entry) => (
                      <RubberPriceDateChip
                        key={entry.id}
                        entry={entry}
                        active={entry.id === activeEntryId}
                        onSelect={() => onEntrySelect(entry.id)}
                      />
                    ))}
                  </div>
                </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function RubberPriceViewerModal({
  content,
  entry,
  activeYearEntries,
  isVisible,
  onClose,
  onSelectEntry,
}: {
  content: RubberPricesSectionContent;
  entry: RubberPriceEntry | null;
  activeYearEntries: RubberPriceEntry[];
  isVisible: boolean;
  onClose: () => void;
  onSelectEntry: (entryId: string) => void;
}) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!entry) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const currentIndex = activeYearEntries.findIndex(
      (activeYearEntry) => activeYearEntry.id === entry.id,
    );

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }

      if (activeYearEntries.length > 1 && event.key === 'ArrowLeft') {
        const previousEntry =
          activeYearEntries[
            (currentIndex - 1 + activeYearEntries.length) % activeYearEntries.length
          ];
        if (previousEntry) {
          onSelectEntry(previousEntry.id);
        }
      }

      if (activeYearEntries.length > 1 && event.key === 'ArrowRight') {
        const nextEntry =
          activeYearEntries[(currentIndex + 1) % activeYearEntries.length];
        if (nextEntry) {
          onSelectEntry(nextEntry.id);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeYearEntries, entry, onClose, onSelectEntry]);

  useLayoutEffect(() => {
    if (!entry) {
      return;
    }

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [entry]);

  if (!entry) {
    return null;
  }

  const currentIndex = activeYearEntries.findIndex(
    (activeYearEntry) => activeYearEntry.id === entry.id,
  );
  const previousEntry =
    currentIndex >= 0
      ? activeYearEntries[
          (currentIndex - 1 + activeYearEntries.length) % activeYearEntries.length
        ]
      : null;
  const nextEntry =
    currentIndex >= 0
      ? activeYearEntries[(currentIndex + 1) % activeYearEntries.length]
      : null;
  const useUnoptimizedImage = isLocalhostAssetUrl(entry.imageSrc);

  return (
    <div
      className={`fixed inset-0 z-[130] flex min-h-dvh items-end justify-center bg-[#03100A]/88 px-0 py-0 backdrop-blur-[8px] transition-[opacity,backdrop-filter] duration-300 ease-out md:items-center md:px-4 md:py-4 lg:px-6 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`rubber-price-viewer-title-${entry.id}`}
      onClick={onClose}
    >
      <div
        className={`relative flex h-[100dvh] w-full max-w-[1320px] flex-col overflow-hidden rounded-none border-0 bg-[#F8FBF6] shadow-[0_40px_120px_rgba(0,0,0,0.34)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:h-auto md:max-h-[96dvh] md:rounded-[28px] md:border md:border-white/12 lg:max-h-[94dvh] lg:rounded-[30px] ${
          isVisible
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-8 scale-[0.995] opacity-0 md:translate-y-4 md:scale-[0.985]'
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-20 border-b border-[#E0E9DC] bg-[radial-gradient(circle_at_top_right,_rgba(161,223,10,0.18),_transparent_26%),linear-gradient(135deg,#F7FBF4_0%,#EEF6EA_100%)] px-4 py-4 backdrop-blur md:px-6 md:py-5 lg:px-7 lg:py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 pr-2 md:pr-4">
              <h3
                id={`rubber-price-viewer-title-${entry.id}`}
                className="text-[20px] font-semibold leading-tight text-[#10341B] sm:text-[22px] md:text-[26px] lg:text-[30px]"
              >
                {content.auctionPriceLabel} - {formatDisplayDate(entry.date)}
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#D7E3D3] bg-white text-[#15341F] transition hover:border-[#BFD4B8] hover:bg-[#F4FAF0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-2"
              aria-label={content.closeArchiveViewerLabel}
            >
              <X className="h-5 w-5" strokeWidth={2.1} aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <a
              href={entry.imageSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="min-h-11 w-full gap-2 !rounded-full !bg-[#0F3F1D] px-5 py-3 text-sm font-semibold sm:w-auto"
              >
                <span className="inline-flex items-center gap-2">
                  <span>{content.openFullSheetButtonLabel}</span>
                  <ExternalLink className="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
                </span>
              </Button>
            </a>

            <div className="inline-flex items-center gap-2 rounded-full border border-[#D6E5CF] bg-white/85 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#1E6B2F]">
              <Clock3 className="h-3.5 w-3.5" strokeWidth={2.1} aria-hidden="true" />
              <span>{entry.archiveYear} {content.archiveSuffixLabel}</span>
            </div>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="min-h-0 flex-1 overflow-y-auto bg-[linear-gradient(180deg,#F6F9F3_0%,#FFFFFF_100%)] p-3 sm:p-4 md:p-5 lg:p-7"
        >
          <div className="grid gap-4 lg:gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="rounded-[22px] border border-[#E1EBDD] bg-white p-2.5 shadow-[0_18px_40px_rgba(15,63,29,0.08)] sm:rounded-[24px] sm:p-3 md:rounded-[26px] md:p-4 lg:rounded-[28px] lg:p-5">
              <div className="rounded-[18px] border border-dashed border-[#D7E4D1] bg-[#FAFCF8] p-2.5 sm:rounded-[20px] sm:p-3 md:rounded-[22px] md:p-4">
                <div className="relative mx-auto h-[clamp(280px,42dvh,420px)] w-full overflow-hidden rounded-[16px] bg-white shadow-[0_18px_40px_rgba(15,63,29,0.08)] sm:h-[min(56dvh,520px)] sm:rounded-[18px] lg:h-[min(58dvh,620px)] xl:h-[min(54dvh,560px)]">
                  <Image
                    src={entry.imageSrc}
                    alt={entry.imageAlt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1279px) 100vw, 900px"
                    priority
                    unoptimized={useUnoptimizedImage}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 xl:hidden">
              {activeYearEntries.length > 1 ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => previousEntry && onSelectEntry(previousEntry.id)}
                    className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-[16px] border border-[#D7E3D3] bg-[#F8FBF6] px-4 py-3 text-sm font-semibold text-[#16311F] transition hover:border-[#BFD4B8] hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-2"
                  >
                    <ChevronLeft className="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
                    <span>{content.previousButtonLabel}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => nextEntry && onSelectEntry(nextEntry.id)}
                    className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-[16px] border border-[#D7E3D3] bg-[#F8FBF6] px-4 py-3 text-sm font-semibold text-[#16311F] transition hover:border-[#BFD4B8] hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-2"
                  >
                    <span>{content.nextButtonLabel}</span>
                    <ChevronRight className="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
                  </button>
                </div>
              ) : null}

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A8C82]">
                  {content.quickSwitchLabel}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {activeYearEntries.map((activeYearEntry) => (
                    <RubberPriceDateChip
                      key={activeYearEntry.id}
                      entry={activeYearEntry}
                      active={activeYearEntry.id === entry.id}
                      compact
                      onSelect={() => onSelectEntry(activeYearEntry.id)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <aside className="hidden rounded-[28px] border border-[#E1EBDD] bg-white p-5 shadow-[0_18px_40px_rgba(15,63,29,0.06)] xl:block">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#7A8C82]">
                {content.inThisArchiveYearLabel}
              </p>
              <p className="mt-2 text-[24px] font-semibold text-[#10341B]">
                {entry.archiveYear}
              </p>
              <p className="mt-3 text-[14px] leading-7 text-[#5A6B61]">
                {activeYearEntries.length} {content.weeklyUploadsLabel.toLowerCase()}.
              </p>

              {activeYearEntries.length > 1 ? (
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => previousEntry && onSelectEntry(previousEntry.id)}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[18px] border border-[#D7E3D3] bg-[#F8FBF6] px-4 py-3 text-sm font-semibold text-[#16311F] transition hover:border-[#BFD4B8] hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-2"
                  >
                    <ChevronLeft className="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
                    <span>{content.previousButtonLabel}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => nextEntry && onSelectEntry(nextEntry.id)}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[18px] border border-[#D7E3D3] bg-[#F8FBF6] px-4 py-3 text-sm font-semibold text-[#16311F] transition hover:border-[#BFD4B8] hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-2"
                  >
                    <span>{content.nextButtonLabel}</span>
                    <ChevronRight className="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
                  </button>
                </div>
              ) : null}

              <div className="mt-6 border-t border-[#E8EFE3] pt-6">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#7A8C82]">
                  {content.quickSwitchLabel}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {activeYearEntries.map((activeYearEntry) => (
                    <RubberPriceDateChip
                      key={activeYearEntry.id}
                      entry={activeYearEntry}
                      active={activeYearEntry.id === entry.id}
                      compact
                      onSelect={() => onSelectEntry(activeYearEntry.id)}
                    />
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="hidden sticky bottom-0 z-20 border-t border-[#E0E9DC] bg-white/96 px-4 py-4 backdrop-blur md:px-5 xl:hidden">
          {activeYearEntries.length > 1 ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => previousEntry && onSelectEntry(previousEntry.id)}
                className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-[16px] border border-[#D7E3D3] bg-[#F8FBF6] px-4 py-3 text-sm font-semibold text-[#16311F] transition hover:border-[#BFD4B8] hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-2"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
                <span>{content.previousButtonLabel}</span>
              </button>
              <button
                type="button"
                onClick={() => nextEntry && onSelectEntry(nextEntry.id)}
                className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-[16px] border border-[#D7E3D3] bg-[#F8FBF6] px-4 py-3 text-sm font-semibold text-[#16311F] transition hover:border-[#BFD4B8] hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-2"
              >
                <span>{content.nextButtonLabel}</span>
                <ChevronRight className="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
              </button>
            </div>
          ) : null}

          <div className="mt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A8C82]">
              {content.quickSwitchLabel}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {activeYearEntries.map((activeYearEntry) => (
                <RubberPriceDateChip
                  key={activeYearEntry.id}
                  entry={activeYearEntry}
                  active={activeYearEntry.id === entry.id}
                  compact
                  onSelect={() => onSelectEntry(activeYearEntry.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RubberPricesSection({
  content,
  entries,
  latestEntry,
  recentEntries,
  archiveYears,
  entriesByYear,
}: RubberPricesSectionProps) {
  const defaultYear = latestEntry?.archiveYear ?? archiveYears[0] ?? '';
  const hasContent = Boolean(latestEntry) && entries.length > 0;
  const [activeYear, setActiveYear] = useState<string>(defaultYear);
  const [expandedMobileYear, setExpandedMobileYear] = useState<string | null>(defaultYear);
  const [viewerEntryId, setViewerEntryId] = useState<string | null>(null);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const topGridRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const recentPanelRef = useRef<HTMLDivElement | null>(null);
  const previewCardRef = useRef<HTMLDivElement | null>(null);
  const archiveDesktopListRef = useRef<HTMLDivElement | null>(null);
  const hasAnimatedArchiveDesktopStateRef = useRef(false);

  useLayoutEffect(() => {
    if (
      typeof window === 'undefined' ||
      !hasContent ||
      !sectionRef.current ||
      !topGridRef.current ||
      !introRef.current ||
      !recentPanelRef.current ||
      !previewCardRef.current
    ) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const sectionNode = sectionRef.current;
    const topGridNode = topGridRef.current;
    const introNode = introRef.current;
    const recentPanelNode = recentPanelRef.current;
    const previewCardNode = previewCardRef.current;

    const context = gsap.context(() => {
      const statCards = gsap.utils.toArray<HTMLElement>('[data-rubber-prices-stat]', introNode);
      const archiveSection = sectionNode.querySelector<HTMLElement>('[data-rubber-prices-archive]');
      const archiveHeader = sectionNode.querySelector<HTMLElement>('[data-rubber-prices-archive-header]');
      const yearCards = gsap.utils.toArray<HTMLElement>('[data-rubber-prices-year-card]', sectionNode);
      const desktopList = sectionNode.querySelector<HTMLElement>('[data-rubber-prices-desktop-list]');
      const mobileYears = gsap.utils.toArray<HTMLElement>('[data-rubber-prices-mobile-year]', sectionNode);

      gsap.set([introNode, recentPanelNode, previewCardNode], { autoAlpha: 0, y: 28 });

      if (statCards.length > 0) {
        gsap.set(statCards, { autoAlpha: 0, y: 24 });
      }

      ScrollTrigger.create({
        trigger: topGridNode,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          const timeline = gsap.timeline({
            defaults: {
              ease: 'power3.out',
            },
          });

          timeline.to(introNode, {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            clearProps: 'opacity,visibility,transform',
          });

          if (statCards.length > 0) {
            timeline.to(
              statCards,
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.58,
                stagger: 0.08,
                clearProps: 'opacity,visibility,transform',
              },
              '-=0.34'
            );
          }

          timeline.to(
            recentPanelNode,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.62,
              clearProps: 'opacity,visibility,transform',
            },
            '-=0.3'
          );

          timeline.to(
            previewCardNode,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.76,
              clearProps: 'opacity,visibility,transform',
            },
            '-=0.58'
          );
        },
      });

      if (archiveSection && archiveHeader) {
        gsap.set(archiveHeader, { autoAlpha: 0, y: 26 });

        if (yearCards.length > 0) {
          gsap.set(yearCards, { autoAlpha: 0, y: 22 });
        }

        if (desktopList) {
          gsap.set(desktopList, { autoAlpha: 0, y: 22 });
        }

        if (mobileYears.length > 0) {
          gsap.set(mobileYears, { autoAlpha: 0, y: 20 });
        }

        ScrollTrigger.create({
          trigger: archiveSection,
          start: 'top 84%',
          once: true,
          onEnter: () => {
            const timeline = gsap.timeline({
              defaults: {
                ease: 'power3.out',
              },
            });

            timeline.to(archiveHeader, {
              autoAlpha: 1,
              y: 0,
              duration: 0.72,
              clearProps: 'opacity,visibility,transform',
            });

            if (yearCards.length > 0) {
              timeline.to(
                yearCards,
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.84,
                  stagger: 0.14,
                  clearProps: 'opacity,visibility,transform',
                },
                '-=0.36'
              );
            }

            if (desktopList) {
              timeline.to(
                desktopList,
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.9,
                  clearProps: 'opacity,visibility,transform',
                },
                '-=0.18'
              );
            }

            if (mobileYears.length > 0) {
              timeline.to(
                mobileYears,
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.48,
                  stagger: 0.06,
                  clearProps: 'opacity,visibility,transform',
                },
                '-=0.46'
              );
            }
          },
        });
      }

      ScrollTrigger.refresh();
    }, sectionNode);

    return () => context.revert();
  }, [archiveYears.length, hasContent]);

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !hasContent || !archiveDesktopListRef.current) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    if (!hasAnimatedArchiveDesktopStateRef.current) {
      hasAnimatedArchiveDesktopStateRef.current = true;
      return;
    }

    const desktopListNode = archiveDesktopListRef.current;
    const copyNode = desktopListNode.querySelector<HTMLElement>('[data-rubber-prices-desktop-copy]');
    const chipsNode = desktopListNode.querySelector<HTMLElement>('[data-rubber-prices-date-chips]');

    const context = gsap.context(() => {
      if (copyNode) {
        gsap.fromTo(
          copyNode,
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.62,
            ease: 'power2.out',
            clearProps: 'opacity,visibility,transform',
          },
        );
      }

      if (chipsNode) {
        gsap.fromTo(
          chipsNode,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            ease: 'power3.out',
            clearProps: 'opacity,visibility,transform',
          },
        );
      }
    }, desktopListNode);

    return () => context.revert();
  }, [activeYear, hasContent]);

  if (!latestEntry || entries.length === 0) {
    return (
      <section className="bg-white px-4 py-16 md:px-6 md:py-20 lg:px-36 lg:py-24">
        <div className="mx-auto w-full max-w-[1480px] rounded-[30px] border border-[#E3EBDD] bg-[#F8FBF6] px-6 py-14 text-center shadow-[0_18px_50px_rgba(15,63,29,0.06)] md:px-10">
          <GradientTag
            text={content.emptyStateTag}
            className="inline-block"
            gradientFrom="#20C997"
            gradientTo="#A1DF0A"
          />
          <div className="mt-6">
            <GradientTitle
              part1={content.emptyStateTitlePart1}
              part2={content.emptyStateTitlePart2}
              lineBreak={false}
              part1Color="dark-green"
              size="custom"
              customSize="clamp(2rem,3.6vw,3.5rem)"
              className="leading-[1.08]"
            />
          </div>
          <p className="mx-auto mt-5 max-w-[680px] text-[16px] leading-8 text-[#5A6B61]">
            {content.emptyStateDescription}
          </p>
        </div>
      </section>
    );
  }

  const handleYearSelect = (year: string) => {
    setActiveYear(year);
  };

  const handleMobileYearToggle = (year: string) => {
    setActiveYear(year);
    setExpandedMobileYear((currentYear) => (currentYear === year ? null : year));
  };

  const handleViewerEntrySelect = (entryId: string) => {
    const selectedEntry = entries.find((entry) => entry.id === entryId);
    if (!selectedEntry) {
      return;
    }

    setActiveYear(selectedEntry.archiveYear);
    setExpandedMobileYear(selectedEntry.archiveYear);
    setViewerEntryId(entryId);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setIsViewerVisible(true);
      });
    });
  };

  const handleCloseViewer = () => {
    setIsViewerVisible(false);
    window.setTimeout(() => {
      setViewerEntryId(null);
    }, VIEWER_TRANSITION_MS);
  };

  const viewerEntry =
    viewerEntryId === null
      ? null
      : entries.find((entry) => entry.id === viewerEntryId) ?? null;
  const viewerYearEntries = viewerEntry ? entriesByYear[viewerEntry.archiveYear] ?? [] : [];

  return (
    <section
      ref={sectionRef}
      className="overflow-x-hidden bg-white px-4 pb-56 pt-12 md:px-6 md:pb-48 md:pt-16 lg:px-36 lg:pb-80 lg:pt-22"
    >
      <div className="mx-auto w-full max-w-[1480px] min-w-0">
        <div
          ref={topGridRef}
          className="grid gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(420px,1fr)] lg:items-start"
        >
          <div ref={introRef} className="min-w-0">
            <GradientTag
              text={content.sectionTag}
              className="inline-block"
              gradientFrom="#20C997"
              gradientTo="#A1DF0A"
            />

            <div className="mt-6 max-w-[820px]">
              <GradientTitle
                part1={content.sectionTitlePart1}
                part2={content.sectionTitlePart2}
                lineBreak={false}
                part1Color="dark-green"
                size="custom"
                customSize="clamp(1.9rem,4vw,4rem)"
                className="leading-[1.06]"
              />
            </div>

            <p className="mt-4 max-w-[740px] text-[15px] leading-7 text-[#5A6B61] md:mt-5 md:text-[16px] md:leading-8 lg:text-[17px]">
              {content.sectionDescription}
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
              <StatCard
                icon={<CalendarDays className="h-5 w-5" strokeWidth={2.1} aria-hidden="true" />}
                label={content.latestUpdateLabel}
                value={formatCompactDate(latestEntry.date)}
              />
              <StatCard
                icon={<FolderKanban className="h-5 w-5" strokeWidth={2.1} aria-hidden="true" />}
                label={content.archivedYearsLabel}
                value={`${archiveYears.length}`}
              />
            </div>

            <div
              ref={recentPanelRef}
              className="mt-8 rounded-[22px] border border-[#E3EBDD] bg-[#F8FBF6] p-4 sm:rounded-[24px] sm:p-5 md:mt-10 md:rounded-[28px] md:p-6"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#7A8C82]">
                    {content.recentUpdatesLabel}
                  </p>
                  <h3 className="mt-2 text-[20px] font-semibold text-[#12311D] sm:text-[22px] md:text-[24px]">
                    {content.recentAuctionDateLabel}
                  </h3>
                  <p className="mt-2 text-[14px] leading-6 text-[#5E7268] md:hidden">
                    {content.tapWeeklyDateLabel}
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 text-sm font-medium text-[#2E7D32]">
                  <span>{content.weeklyUploadsLabel}</span>
                  <ChevronRight className="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
                </div>
              </div>

              <div className="mt-5 flex max-w-full gap-3 overflow-x-auto pb-1 [scrollbar-color:rgba(46,125,50,0.24)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[rgba(46,125,50,0.24)]">
                {recentEntries.map((entry) => (
                  <RubberPriceDateChip
                    key={entry.id}
                    entry={entry}
                    active={entry.id === (viewerEntry?.id ?? latestEntry.id)}
                    onSelect={() => handleViewerEntrySelect(entry.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div ref={previewCardRef}>
            <RubberPricePreviewCard entry={latestEntry} content={content} />
          </div>
        </div>

        <RubberPriceArchiveNav
          content={content}
          archiveYears={archiveYears}
          entriesByYear={entriesByYear}
          activeYear={activeYear}
          expandedMobileYear={expandedMobileYear}
          activeEntryId={viewerEntry?.id ?? latestEntry.id}
          desktopListRef={archiveDesktopListRef}
          onYearSelect={handleYearSelect}
          onMobileYearToggle={handleMobileYearToggle}
          onEntrySelect={handleViewerEntrySelect}
        />
      </div>

      <RubberPriceViewerModal
        content={content}
        entry={viewerEntry}
        activeYearEntries={viewerYearEntries}
        isVisible={isViewerVisible}
        onClose={handleCloseViewer}
        onSelectEntry={handleViewerEntrySelect}
      />
    </section>
  );
}
