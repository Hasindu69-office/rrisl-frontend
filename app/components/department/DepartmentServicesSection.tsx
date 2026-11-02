'use client';

import Image from 'next/image';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
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

export interface DepartmentServiceMediaItem {
  id: string;
  src: string;
  alt: string;
}

export interface DepartmentServiceDetailItem {
  label: string;
  value: string;
}

export interface DepartmentStructuredServiceItem {
  key: string;
  title: string;
  description?: string;
  images: DepartmentServiceMediaItem[];
  details: DepartmentServiceDetailItem[];
}

export interface DepartmentServiceGroupItem {
  key: string;
  title: string;
  description?: string;
  images: DepartmentServiceMediaItem[];
  items: DepartmentStructuredServiceItem[];
}

interface DepartmentServicesSectionProps {
  tagText: string;
  titlePart1: string | React.ReactNode;
  titlePart2: string | React.ReactNode;
  items?: DepartmentServiceItem[];
  serviceGroups?: DepartmentServiceGroupItem[];
  locale?: string;
  containerClassName?: string;
  enableTouchFlip?: boolean;
}

function groupHasContent(group: DepartmentServiceGroupItem) {
  return Boolean(group.description) || group.images.length > 0 || group.items.length > 0;
}

function itemHasDetails(item: DepartmentStructuredServiceItem) {
  return Boolean(item.description) || item.details.length > 0 || item.images.length > 0;
}

function ServiceMediaGallery({
  images,
  title,
  layout = 'section',
}: {
  images: DepartmentServiceMediaItem[];
  title: string;
  layout?: 'section' | 'item';
}) {
  if (images.length === 0) return null;

  const columnClass =
    layout === 'item'
      ? images.length === 1
        ? 'max-w-[160px] grid-cols-1'
        : images.length === 2
          ? 'max-w-[340px] grid-cols-2'
          : images.length === 3
            ? 'max-w-[520px] grid-cols-3'
            : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
      : images.length === 1
        ? 'max-w-full grid-cols-1 sm:max-w-[280px]'
        : images.length === 2
          ? 'max-w-full grid-cols-1 sm:grid-cols-2 sm:max-w-[560px]'
          : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4';

  const sizes =
    layout === 'item'
      ? '(max-width: 639px) 42vw, (max-width: 767px) 28vw, 14vw'
      : '(max-width: 639px) 90vw, (max-width: 767px) 45vw, (max-width: 1279px) 30vw, 22vw';

  return (
    <div className={`grid w-full min-w-0 gap-2 sm:gap-3 ${columnClass}`} aria-label={`${title} gallery`}>
      {images.map((image) => (
        <div
          key={image.id}
          className={`relative aspect-[4/3] w-full min-w-0 overflow-hidden border border-[#DDE9D8] bg-[#EAF4E5] shadow-[0_8px_20px_rgba(15,63,29,0.06)] ${
            layout === 'item' ? 'rounded-[10px]' : 'rounded-[14px]'
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover transition duration-500 hover:scale-[1.02]"
            sizes={sizes}
            unoptimized={isLocalhostAssetUrl(image.src)}
          />
        </div>
      ))}
    </div>
  );
}

function ServiceDetailTable({ details }: { details: DepartmentServiceDetailItem[] }) {
  if (details.length === 0) return null;

  return (
    <div className="location-details-scroll -mx-1 max-w-full overflow-x-auto overscroll-x-contain rounded-[12px] border border-[#D8E6D3] sm:mx-0">
      <table className="w-full min-w-[560px] border-collapse text-left text-[13px] text-[#263A2C] sm:min-w-[640px] md:text-[15px]">
        <thead className="bg-[#EAF4E4] text-[#10341B]">
          <tr>
            {details.map((detail) => (
              <th
                key={detail.label}
                scope="col"
                className="border-b border-[#D8E6D3] px-3 py-2.5 font-semibold sm:px-4 sm:py-3"
              >
                {detail.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="even:bg-[#F8FBF6]">
            {details.map((detail) => (
              <td
                key={`${detail.label}-value`}
                className="border-t border-[#E4EEE0] px-3 py-2.5 align-top whitespace-pre-line sm:px-4 sm:py-3"
              >
                {detail.value}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function NestedServiceItem({ item }: { item: DepartmentStructuredServiceItem }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDetails = itemHasDetails(item);
  const detailsId = `department-service-nested-${item.key}`;
  const triggerId = `department-service-nested-trigger-${item.key}`;

  if (!hasDetails) {
    return (
      <li className="flex gap-3 text-[14px] leading-7 text-[#263A2C] sm:text-[15px] md:text-[16px]">
        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2E7D32]" aria-hidden="true" />
        <span className="min-w-0 break-words">{item.title}</span>
      </li>
    );
  }

  return (
    <article
      className={`w-full min-w-0 overflow-hidden rounded-[14px] border bg-white transition-[border-color] duration-300 sm:rounded-[16px] ${
        isExpanded ? 'border-[#B9DDA9]' : 'border-[#DCE9D5]'
      }`}
    >
      <div className="px-3.5 pt-3.5 sm:px-4 sm:pt-4 md:px-5 md:pt-5">
        <h4 className="break-words text-[15px] font-semibold leading-[1.45] text-[#153C21] sm:text-[16px] md:text-[17px]">
          {item.title}
        </h4>
      </div>

      <button
        id={triggerId}
        type="button"
        onClick={() => setIsExpanded((current) => !current)}
        aria-expanded={isExpanded}
        aria-controls={detailsId}
        className="mt-3 flex w-full cursor-pointer items-center justify-between gap-3 border-t border-[#E7EFE2] bg-[#F8FBF6] px-3.5 py-3 text-left text-[13px] font-semibold text-[#205C2E] outline-none transition-colors hover:bg-[#EEF7E8] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2E7D32] sm:px-4 md:px-5"
      >
        <span>{isExpanded ? 'Hide details' : 'View details'}</span>
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        id={detailsId}
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!isExpanded}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="min-w-0 space-y-4 border-t border-[#E7EFE2] px-3.5 py-4 sm:px-4 md:px-5 md:py-5">
            {item.description ? (
              <p className="break-words whitespace-pre-line text-[13px] leading-[1.8] text-[#35473A] sm:text-[14px] md:text-[15px]">
                {item.description}
              </p>
            ) : null}
            <ServiceDetailTable details={item.details} />
            {item.images.length > 0 ? (
              <ServiceMediaGallery images={item.images} title={item.title} layout="item" />
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function ServiceTopicContent({ group }: { group: DepartmentServiceGroupItem }) {
  const hasContent = groupHasContent(group);
  const titleOnlyItems = group.items.filter((item) => !itemHasDetails(item));
  const detailedItems = group.items.filter((item) => itemHasDetails(item));

  if (!hasContent) {
    return (
      <div className="rounded-[20px] border border-dashed border-[#D5E4CE] bg-[#FBFDF9] px-6 py-10 text-center">
        <p className="text-[15px] leading-[1.8] text-[#66756C] md:text-[16px]">
          Detailed information for this service will be added soon.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-5 md:space-y-6">
      {group.description ? (
        <p className="break-words whitespace-pre-line text-[14px] leading-[1.85] text-[#35473A] sm:text-[15px] md:text-[16px]">
          {group.description}
        </p>
      ) : null}

      {group.images.length > 0 ? (
        <ServiceMediaGallery images={group.images} title={group.title} />
      ) : null}

      {titleOnlyItems.length > 0 ? (
        <ul className="space-y-3 rounded-[16px] border border-[#DCE9D5] bg-[#FBFDF9] p-4 sm:rounded-[18px] sm:p-5 md:p-6">
          {titleOnlyItems.map((item) => (
            <NestedServiceItem key={item.key} item={item} />
          ))}
        </ul>
      ) : null}

      {detailedItems.length > 0 ? (
        <div className="w-full min-w-0 space-y-3">
          {detailedItems.map((item) => (
            <NestedServiceItem key={item.key} item={item} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function TopicOptionButton({
  group,
  index,
  isActive,
  onSelect,
}: {
  group: DepartmentServiceGroupItem;
  index: number;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      className={`flex w-full min-w-0 cursor-pointer items-center gap-3 rounded-[14px] border px-3.5 py-3 text-left transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-2 sm:px-4 sm:py-3.5 md:rounded-[16px] ${
        isActive
          ? 'border-[#B9DDA9] bg-[#123B20] text-white shadow-[0_14px_34px_rgba(15,63,29,0.18)]'
          : 'border-[#DDEAD7] bg-white text-[#173C22] hover:border-[#B9DDA9] hover:bg-[#F7FBF4]'
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold sm:h-9 sm:w-9 sm:text-[12px] ${
          isActive ? 'bg-[#A1DF0A] text-[#0F3F1D]' : 'bg-[#EAF7DF] text-[#2E7D32]'
        }`}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="min-w-0 flex-1 break-words text-[13px] font-semibold leading-[1.4] sm:text-[14px] md:text-[15px]">
        {group.title}
      </span>
    </button>
  );
}

function ServiceDirectoryPanel({ groups }: { groups: DepartmentServiceGroupItem[] }) {
  const firstContentKey = useMemo(
    () => groups.find((group) => groupHasContent(group))?.key || groups[0]?.key || null,
    [groups]
  );
  const [activeKey, setActiveKey] = useState<string | null>(firstContentKey);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobilePickerRef = useRef<HTMLDivElement>(null);
  const contentPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!groups.some((group) => group.key === activeKey)) {
      setActiveKey(firstContentKey);
    }
  }, [activeKey, firstContentKey, groups]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (mobilePickerRef.current && target && !mobilePickerRef.current.contains(target)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileMenuOpen]);

  const activeGroup = useMemo(
    () => groups.find((group) => group.key === activeKey) ?? groups[0] ?? null,
    [activeKey, groups]
  );

  const activeIndex = useMemo(
    () => (activeGroup ? groups.findIndex((group) => group.key === activeGroup.key) : 0),
    [activeGroup, groups]
  );

  const handleSelectTopic = (key: string, options?: { fromMobileMenu?: boolean }) => {
    setActiveKey(key);

    if (options?.fromMobileMenu) {
      setIsMobileMenuOpen(false);
      window.requestAnimationFrame(() => {
        contentPanelRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      });
    }
  };

  if (!activeGroup) {
    return null;
  }

  return (
    <div className="mt-10 w-full min-w-0 md:mt-12 lg:mt-14">
      {/* Mobile / tablet: compact picker keeps content directly under the choice */}
      <div className="lg:hidden" ref={mobilePickerRef}>
        <div className="relative z-20">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="department-services-topic-menu"
            className="flex w-full cursor-pointer items-center gap-3 rounded-[16px] border border-[#B9DDA9] bg-[#123B20] px-4 py-3.5 text-left text-white shadow-[0_14px_34px_rgba(15,63,29,0.18)] outline-none transition focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-2"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#A1DF0A] text-[12px] font-bold text-[#0F3F1D]">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-medium uppercase tracking-[0.1em] text-white/65">
                Choose a service
              </span>
              <span className="mt-0.5 block break-words text-[15px] font-semibold leading-[1.35] sm:text-[16px]">
                {activeGroup.title}
              </span>
            </span>
            <ChevronDown
              aria-hidden="true"
              className={`h-5 w-5 shrink-0 text-[#A1DF0A] transition-transform duration-300 ${
                isMobileMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          <div
            id="department-services-topic-menu"
            className={`absolute left-0 right-0 top-[calc(100%+8px)] origin-top overflow-hidden rounded-[18px] border border-[#DCE9D5] bg-white shadow-[0_22px_48px_rgba(15,63,29,0.16)] transition-[opacity,transform] duration-200 ${
              isMobileMenuOpen
                ? 'pointer-events-auto translate-y-0 opacity-100'
                : 'pointer-events-none -translate-y-1 opacity-0'
            }`}
          >
            <div className="location-details-scroll max-h-[min(60vh,420px)] space-y-2 overflow-y-auto overscroll-contain p-3 pr-2">
              {groups.map((group, index) => (
                <TopicOptionButton
                  key={group.key}
                  group={group}
                  index={index}
                  isActive={group.key === activeGroup.key}
                  onSelect={() => handleSelectTopic(group.key, { fromMobileMenu: true })}
                />
              ))}
            </div>
          </div>
        </div>

        {isMobileMenuOpen ? (
          <button
            type="button"
            aria-label="Close service menu"
            className="fixed inset-0 z-10 cursor-default bg-black/20"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        ) : null}
      </div>

      <div className="mt-4 grid w-full min-w-0 gap-5 md:mt-5 md:gap-6 lg:mt-0 lg:grid-cols-[minmax(220px,300px)_minmax(0,1fr)] lg:gap-8 xl:gap-10">
        {/* Desktop: persistent topic list beside the panel */}
        <aside className="hidden w-full min-w-0 lg:sticky lg:top-28 lg:block lg:self-start">
          <div className="space-y-2">
            {groups.map((group, index) => (
              <TopicOptionButton
                key={group.key}
                group={group}
                index={index}
                isActive={group.key === activeGroup.key}
                onSelect={() => handleSelectTopic(group.key)}
              />
            ))}
          </div>
        </aside>

        <div
          ref={contentPanelRef}
          className="w-full min-w-0 overflow-hidden rounded-[20px] border border-[#DCE9D5] bg-white p-4 shadow-[0_18px_48px_rgba(15,63,29,0.06)] sm:rounded-[24px] sm:p-5 md:rounded-[28px] md:p-7 lg:p-8"
          aria-live="polite"
        >
          <div className="mb-5 border-b border-[#E7EFE2] pb-4 md:mb-6 md:pb-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#4B8B52]">
              {String(activeIndex + 1).padStart(2, '0')} / {String(groups.length).padStart(2, '0')}
            </p>
            <h3 className="mt-2 break-words text-[22px] font-bold leading-[1.25] text-[#0F3F1D] sm:text-[24px] md:text-[30px]">
              {activeGroup.title}
            </h3>
          </div>

          <div className="w-full min-w-0">
            <ServiceTopicContent group={activeGroup} />
          </div>
        </div>
      </div>
    </div>
  );
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
 * Department services: topic directory + in-page detail panel.
 * Nested View details only for sub-items. Legacy flip cards remain for other departments.
 */
export default function DepartmentServicesSection({
  tagText,
  titlePart1,
  titlePart2,
  items = [],
  serviceGroups = [],
  containerClassName = '',
  enableTouchFlip = true,
}: DepartmentServicesSectionProps) {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const hasStructuredServices = serviceGroups.length > 0;

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
    <section
      className={
        hasStructuredServices
          ? 'overflow-x-clip bg-[#F5F9F2] py-16 md:py-20 lg:py-24'
          : 'bg-[rgba(161,223,10,0.13)] py-16 md:py-20 lg:py-24'
      }
    >
      <div className={`mx-auto w-full max-w-[1440px] min-w-0 px-4 md:px-6 lg:px-8 ${containerClassName}`}>
        <div
          className={
            hasStructuredServices
              ? 'text-center'
              : 'flex flex-col items-center text-center xl:items-end xl:text-right'
          }
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
            className={`mt-5 font-bold leading-[1.15] ${
              hasStructuredServices ? '' : 'xl:text-right'
            }`}
          />
        </div>

        {hasStructuredServices ? (
          <ServiceDirectoryPanel groups={serviceGroups} />
        ) : (
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
        )}
      </div>
    </section>
  );
}
