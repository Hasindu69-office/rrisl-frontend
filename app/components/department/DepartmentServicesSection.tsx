'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';
import { addLocaleToUrl } from '@/app/lib/locale';
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

export interface DepartmentServiceCategoryItem {
  key: string;
  title: string;
  url: string;
}

export interface DepartmentServiceDetailItem {
  label: string;
  value: string;
}

export interface DepartmentStructuredServiceItem {
  key: string;
  title: string;
  description?: string;
  url?: string;
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
  categoryLinks?: DepartmentServiceCategoryItem[];
  serviceGroups?: DepartmentServiceGroupItem[];
  locale?: string;
  containerClassName?: string;
  enableTouchFlip?: boolean;
}

function localizeUrl(url: string, locale: string) {
  return url.startsWith('http') || url.startsWith('//') ? url : addLocaleToUrl(url, locale);
}

function ServiceMediaGallery({
  images,
  title,
  layout = 'section',
}: {
  images: DepartmentServiceMediaItem[];
  title: string;
  /** section = up to 4/row; item = max 2/row for card sub-items */
  layout?: 'section' | 'item';
}) {
  if (images.length === 0) return null;

  const columnClass =
    layout === 'item'
      ? images.length === 1
        ? 'max-w-[280px] grid-cols-1'
        : 'grid-cols-2'
      : images.length === 1
        ? 'max-w-[280px] grid-cols-1'
        : images.length === 2
          ? 'max-w-[560px] grid-cols-2'
          : 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4';

  const sizes =
    layout === 'item'
      ? '(max-width: 1023px) 42vw, 14vw'
      : '(max-width: 767px) 45vw, (max-width: 1279px) 30vw, 22vw';

  return (
    <div className={`grid w-full gap-3 ${columnClass}`} aria-label={`${title} gallery`}>
      {images.map((image) => (
        <div
          key={image.id}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-[14px] border border-[#DDE9D8] bg-[#EAF4E5] shadow-[0_8px_20px_rgba(15,63,29,0.06)]"
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

function CategoryDirectory({ categories, locale }: { categories: DepartmentServiceCategoryItem[]; locale: string }) {
  if (categories.length === 0) return null;

  return (
    <nav className="mt-10 md:mt-12" aria-label="Plant Science service categories">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category, index) => (
          <Link
            key={category.key}
            href={localizeUrl(category.url, locale)}
            className="group flex min-h-[112px] items-center justify-between gap-5 rounded-[20px] border border-[#DDEAD7] bg-white px-5 py-5 shadow-[0_14px_34px_rgba(15,63,29,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#B9DDA9] hover:shadow-[0_20px_44px_rgba(15,63,29,0.11)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-4 md:px-6"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF7DF] text-[13px] font-bold text-[#2E7D32]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-[16px] font-semibold leading-[1.45] text-[#173C22] md:text-[17px]">{category.title}</span>
            </div>
            <ArrowUpRight className="h-5 w-5 shrink-0 text-[#2E7D32] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </nav>
  );
}

function LaboratoryServiceCard({ item, locale, isOpen, onToggle }: { item: DepartmentStructuredServiceItem; locale: string; isOpen: boolean; onToggle: () => void }) {
  const panelId = `department-service-panel-${item.key}`;
  const triggerId = `department-service-trigger-${item.key}`;

  return (
    <article className="overflow-hidden rounded-[22px] border border-[#DCE9D5] bg-white shadow-[0_16px_40px_rgba(15,63,29,0.06)]">
      <button
        id={triggerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-5 px-5 py-5 text-left outline-none transition hover:bg-[#FAFCF8] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2E7D32] md:px-7 md:py-6"
      >
        <h4 className="text-[17px] font-semibold leading-[1.45] text-[#153C21] md:text-[20px]">{item.title}</h4>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFF8E9] text-[#2E7D32] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="h-5 w-5" aria-hidden="true" />
        </span>
      </button>

      <div id={panelId} role="region" aria-labelledby={triggerId} className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="border-t border-[#E7EFE2] px-5 py-6 md:px-7 md:py-7">
            {item.description ? <p className="mb-5 whitespace-pre-line text-[15px] leading-[1.8] text-[#35473A] md:text-[16px]">{item.description}</p> : null}
            {item.details.length > 0 ? (
              <dl className="grid gap-4 md:grid-cols-2">
                {item.details.map((detail) => (
                  <div key={`${item.key}-${detail.label}`} className="rounded-[16px] border border-[#E3EDDE] bg-[#F8FBF6] p-4 md:p-5">
                    <dt className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#2E7D32]">{detail.label}</dt>
                    <dd className="mt-2 whitespace-pre-line text-[14px] leading-[1.75] text-[#2F4034] md:text-[15px]">{detail.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {item.images.length > 0 ? (
              <div className="mt-6">
                <ServiceMediaGallery images={item.images} title={item.title} layout="item" />
              </div>
            ) : null}
            {item.url ? (
              <Link href={localizeUrl(item.url, locale)} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0F4B24] px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#2E7D32] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-2">
                View all testing services <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function StandardServiceCard({ item }: { item: DepartmentStructuredServiceItem }) {
  return (
    <article className="overflow-hidden rounded-[22px] border border-[#DDE9D8] bg-white p-5 shadow-[0_16px_38px_rgba(15,63,29,0.06)] md:p-6">
      <h4 className="text-[18px] font-semibold leading-[1.4] text-[#153C21] md:text-[20px]">{item.title}</h4>
      {item.description ? <p className="mt-4 whitespace-pre-line text-[15px] leading-[1.8] text-[#3D4E41]">{item.description}</p> : null}
      {item.images.length > 0 ? (
        <div className="mt-5">
          <ServiceMediaGallery images={item.images} title={item.title} layout="item" />
        </div>
      ) : null}
    </article>
  );
}

function StructuredServiceGroups({ groups, locale }: { groups: DepartmentServiceGroupItem[]; locale: string }) {
  const [openItems, setOpenItems] = useState<Set<string>>(() => new Set());

  return (
    <div className="mt-14 space-y-10 md:mt-16 md:space-y-12">
      {groups.map((group, groupIndex) => {
        const isLaboratoryGroup = group.key === 'laboratory-testing';
        return (
          <section key={group.key} id={`plant-science-service-${group.key}`} className={`scroll-mt-28 rounded-[28px] border px-5 py-7 md:px-8 md:py-9 lg:px-10 ${groupIndex % 2 === 0 ? 'border-[#DDEAD7] bg-[#F7FBF4]' : 'border-[#E2E9DF] bg-white'}`}>
            <div className="max-w-[940px]">
              <h3 className="text-[24px] font-bold leading-[1.25] text-[#0F3F1D] md:text-[30px]">{group.title}</h3>
              {group.description ? <p className="mt-5 whitespace-pre-line text-justify text-[15px] leading-[1.9] text-[#35473A] md:text-[16px]">{group.description}</p> : null}
            </div>
            {group.images.length > 0 ? <div className="mt-7"><ServiceMediaGallery images={group.images} title={group.title} /></div> : null}
            {group.items.length > 0 ? (
              <div className={`mt-7 ${isLaboratoryGroup ? 'space-y-4' : 'grid gap-5 lg:grid-cols-3'}`}>
                {group.items.map((item) => isLaboratoryGroup ? (
                  <LaboratoryServiceCard
                    key={item.key}
                    item={item}
                    locale={locale}
                    isOpen={openItems.has(item.key)}
                    onToggle={() => setOpenItems((current) => {
                      const next = new Set(current);
                      if (next.has(item.key)) next.delete(item.key); else next.add(item.key);
                      return next;
                    })}
                  />
                ) : <StandardServiceCard key={item.key} item={item} />)}
              </div>
            ) : null}
          </section>
        );
      })}
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
  items = [],
  categoryLinks = [],
  serviceGroups = [],
  locale = 'en',
  containerClassName = '',
  enableTouchFlip = true,
}: DepartmentServicesSectionProps) {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const hasStructuredServices = categoryLinks.length > 0 || serviceGroups.length > 0;

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
          ? 'bg-[#F5F9F2] py-16 md:py-20 lg:py-24'
          : 'bg-[rgba(161,223,10,0.13)] py-16 md:py-20 lg:py-24'
      }
    >
      <div className={`mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8 ${containerClassName}`}>
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
          <>
            <CategoryDirectory categories={categoryLinks} locale={locale} />
            <StructuredServiceGroups groups={serviceGroups} locale={locale} />
          </>
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
