'use client';

import Image from 'next/image';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';

export interface DepartmentResearchHighlightSectionBlock {
  id: string;
  heading?: string;
  body?: string;
  items?: string[];
  images?: DepartmentResearchHighlightImage[];
}

export interface DepartmentResearchHighlightImage {
  src: string;
  alt: string;
  title?: string;
}

export interface DepartmentResearchHighlightItem {
  id: string;
  summary: string;
  details?: string;
  sections?: DepartmentResearchHighlightSectionBlock[];
  image?: DepartmentResearchHighlightImage;
  iconSrc?: string;
  iconAlt?: string;
}

interface DepartmentResearchHighlightsSectionProps {
  tagText: string;
  titlePart1: string | React.ReactNode;
  titlePart2: string | React.ReactNode;
  backgroundImageSrc?: string;
  backgroundImageAlt?: string;
  highlights: DepartmentResearchHighlightItem[];
  containerClassName?: string;
}

const DEFAULT_BACKGROUND = '/images/departments/researchhighlightsbgnew.jpg';
const DEFAULT_BACKGROUND_ALT = 'Research highlights background';
const DESKTOP_SCROLL_HEIGHT = '620px';
const TABLET_SCROLL_HEIGHT = '680px';
const MOBILE_SCROLL_HEIGHT = '72dvh';
const TIMELINE_ICON = '/images/departments/iconresearchhighlight.png';
const GALLERY_TRANSITION_MS = 260;
const SCROLL_BOUNDARY_TOLERANCE = 2;
type ResponsiveMode = 'mobile' | 'tablet' | 'desktop';

function formatHighlightItem(entry: string) {
  const index = entry.indexOf('(');

  if (index === -1) {
    return <span className="font-semibold text-[#111111]">{entry}</span>;
  }

  const prefix = entry.substring(0, index).trim();
  const suffix = entry.substring(index);

  return (
    <>
      <span className="font-semibold text-[#111111]">{prefix}</span>
      {suffix ? ` ${suffix}` : ''}
    </>
  );
}

function hasSectionImages(section: DepartmentResearchHighlightSectionBlock) {
  return Boolean(section.images && section.images.length > 0);
}

function HighlightGalleryStack({
  images,
  heading,
  onOpen,
}: {
  images: DepartmentResearchHighlightImage[];
  heading?: string;
  onOpen: () => void;
}) {
  const previewImage = images[0];
  const extraCount = images.length - 1;

  if (!previewImage) {
    return null;
  }

  const useUnoptimizedImage = isLocalhostAssetUrl(previewImage.src);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group mt-4 block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-2"
      aria-label={`Open image gallery${heading ? ` for ${heading}` : ''}`}
    >
      <div className="relative mx-auto w-full max-w-[320px] pt-4 sm:max-w-[340px] md:max-w-[300px] lg:max-w-[360px] lg:pt-6">
        {images.length > 1 ? (
          <>
            <div className="absolute right-2 top-0 h-[80%] w-[84%] rounded-[16px] border border-[#2E7D32]/10 bg-white/80 shadow-[0_10px_22px_rgba(17,17,17,0.04)] transition-transform duration-300 group-hover:-translate-y-0.5 sm:rounded-[18px] md:shadow-[0_12px_26px_rgba(17,17,17,0.05)] lg:group-hover:-translate-y-1" />
            <div className="absolute right-1 top-2 h-[84%] w-[90%] rounded-[16px] border border-[#2E7D32]/10 bg-white/92 shadow-[0_14px_28px_rgba(17,17,17,0.05)] transition-transform duration-300 group-hover:-translate-y-1 sm:top-3 sm:rounded-[18px] md:shadow-[0_16px_30px_rgba(17,17,17,0.06)] lg:group-hover:-translate-y-1.5" />
          </>
        ) : null}

        <div className="relative z-[1] overflow-hidden rounded-[16px] border border-[#2E7D32]/10 bg-white shadow-[0_14px_28px_rgba(17,17,17,0.08)] sm:rounded-[18px] sm:shadow-[0_18px_40px_rgba(17,17,17,0.09)]">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={previewImage.src}
              alt={previewImage.alt}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 30vw"
              unoptimized={useUnoptimizedImage}
            />
          </div>

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,63,29,0)_42%,rgba(15,63,29,0.48)_100%)]" />

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
            <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.12em] text-white sm:text-[11px] sm:tracking-[0.14em]">
              View image
            </span>
            {extraCount > 0 ? (
              <span className="inline-flex shrink-0 items-center rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#0F3F1D] sm:px-3 sm:text-[11px] sm:tracking-[0.08em]">
                +{extraCount} more
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </button>
  );
}

function HighlightContent({
  item,
  onOpenGallery,
}: {
  item: DepartmentResearchHighlightItem;
  onOpenGallery: (
    images: DepartmentResearchHighlightImage[],
    title?: string,
    initialIndex?: number
  ) => void;
}) {
  const hasStructuredSections = item.sections && item.sections.length > 0;
  const hasSectionLevelImages = Boolean(item.sections?.some(hasSectionImages));
  const hasImage = Boolean(item.image) && !hasSectionLevelImages;

  if (!item.details && !hasStructuredSections && !hasImage) {
    return null;
  }

  return (
    <div className="rounded-[10px] bg-[#E2EDE1] px-4 py-5 sm:px-5 md:px-6 md:py-6 lg:px-7">
      {item.details ? (
        <p className="text-[14px] leading-[1.8] text-[#2D5E2F] md:text-[15px]">
          {item.details}
        </p>
      ) : null}

      {hasStructuredSections ? (
        hasSectionLevelImages ? (
          <div
            className={`grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3 ${
              item.details ? 'mt-5' : ''
            }`}
          >
            {item.sections?.map((section) => {
              const sectionHasImages = hasSectionImages(section);

              return (
                <div
                  key={section.id}
                  className={`rounded-[14px] border px-4 py-4 sm:px-5 ${
                    sectionHasImages
                      ? 'border-[#D4E5D2] bg-white shadow-[0_14px_34px_rgba(17,17,17,0.05)]'
                      : 'border-[#DCE8DB] bg-[#F4F8F2]'
                  }`}
                >
                  {section.heading ? (
                    <h4 className="text-[15px] font-medium leading-[1.4] text-[#2E7D32] md:text-[16px]">
                      {section.heading}
                    </h4>
                  ) : null}

                  {section.body ? (
                    <p className="mt-3 text-[14px] leading-[1.8] text-[#2D5E2F] md:text-[15px]">
                      {section.body}
                    </p>
                  ) : null}

                  {section.items && section.items.length > 0 ? (
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[14px] leading-[1.45] text-[#111111] md:text-[15px]">
                      {section.items.map((entry) => (
                        <li key={entry} className="marker:text-[#111111]">
                          {formatHighlightItem(entry)}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {sectionHasImages ? (
                    <HighlightGalleryStack
                      images={section.images ?? []}
                      heading={section.heading}
                      onOpen={() =>
                        onOpenGallery(section.images ?? [], section.heading, 0)
                      }
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              item.sections && item.sections.length > 1 ? 'xl:grid-cols-2' : 'grid-cols-1'
            } ${item.details ? 'mt-5' : ''}`}
          >
            {item.sections?.map((section) => (
              <div key={section.id}>
                {section.heading ? (
                  <h4 className="text-[15px] font-medium leading-[1.4] text-[#2E7D32] md:text-[16px]">
                    {section.heading}
                  </h4>
                ) : null}

                {section.body ? (
                  <p className="mt-3 text-[14px] leading-[1.8] text-[#2D5E2F] md:text-[15px]">
                    {section.body}
                  </p>
                ) : null}

                {section.items && section.items.length > 0 ? (
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[14px] leading-[1.45] text-[#111111] md:text-[15px]">
                    {section.items.map((entry) => (
                      <li key={entry} className="marker:text-[#111111]">
                        {formatHighlightItem(entry)}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        )
      ) : null}

      {item.image ? (
        <div className={item.details || hasStructuredSections ? 'mt-6' : ''}>
          <div className="overflow-hidden rounded-[14px] bg-white shadow-[0_12px_28px_rgba(17,17,17,0.08)]">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 767px) 100vw, (max-width: 1279px) 70vw, 42vw"
                unoptimized={isLocalhostAssetUrl(item.image.src)}
              />
            </div>

            {item.image.title ? (
              <div className="border-t border-[#2E7D32]/12 px-4 py-3 md:px-5">
                <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-[#2E7D32] md:text-[14px]">
                  {item.image.title}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function HighlightGalleryModal({
  images,
  activeIndex,
  title,
  isVisible,
  onClose,
  onNavigate,
  onSelectIndex,
}: {
  images: DepartmentResearchHighlightImage[];
  activeIndex: number;
  title?: string;
  isVisible: boolean;
  onClose: () => void;
  onNavigate: (direction: 'previous' | 'next') => void;
  onSelectIndex: (index: number) => void;
}) {
  const activeImage = images[activeIndex];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }

      if (images.length > 1 && event.key === 'ArrowLeft') {
        onNavigate('previous');
      }

      if (images.length > 1 && event.key === 'ArrowRight') {
        onNavigate('next');
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [images.length, onClose, onNavigate]);

  if (!activeImage) {
    return null;
  }

  const useUnoptimizedActiveImage = isLocalhostAssetUrl(activeImage.src);

  return (
    <div
      className={`fixed inset-0 z-[130] flex min-h-dvh items-end justify-center bg-[#03100A]/88 px-0 py-0 backdrop-blur-[8px] transition-[opacity,backdrop-filter] duration-300 ease-out md:items-center md:px-4 md:py-4 lg:px-6 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="research-highlight-gallery-title"
      onClick={onClose}
    >
      <div
        className={`relative flex h-[100dvh] w-full max-w-[1240px] flex-col overflow-hidden rounded-none border-0 bg-[#F8FBF6] shadow-[0_40px_120px_rgba(0,0,0,0.34)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:h-auto md:max-h-[94dvh] md:rounded-[24px] md:border md:border-white/12 md:shadow-[0_30px_90px_rgba(0,0,0,0.30)] lg:max-h-[94dvh] lg:rounded-[30px] ${
          isVisible
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-8 scale-[0.995] opacity-0 md:translate-y-4 md:scale-[0.985]'
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-20 border-b border-[#E0E9DC] bg-[radial-gradient(circle_at_top_right,_rgba(161,223,10,0.18),_transparent_26%),linear-gradient(135deg,#F7FBF4_0%,#EEF6EA_100%)] px-4 py-3.5 backdrop-blur sm:px-5 sm:py-4 md:px-6 md:py-4 lg:px-7 lg:py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 pr-2 md:pr-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2E7D32]">
                Research highlight image
              </p>
              <h3
                id="research-highlight-gallery-title"
                className="mt-2 text-[18px] font-semibold leading-tight text-[#10341B] sm:text-[20px] md:text-[22px] lg:text-[26px]"
              >
                {title || activeImage.title || 'Image preview'}
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#D7E3D3] bg-white text-[#15341F] transition hover:border-[#BFD4B8] hover:bg-[#F4FAF0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-2"
              aria-label="Close image viewer"
            >
              <X className="h-5 w-5" strokeWidth={2.1} aria-hidden="true" />
            </button>
          </div>

          {images.length > 1 ? (
            <div className="mt-4 inline-flex items-center rounded-full border border-[#D6E5CF] bg-white/85 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#1E6B2F]">
              Image {activeIndex + 1} of {images.length}
            </div>
          ) : null}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[linear-gradient(180deg,#F6F9F3_0%,#FFFFFF_100%)] p-3 sm:p-4 md:p-4 lg:p-7">
          <div className="grid gap-4 lg:gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-[22px] border border-[#E1EBDD] bg-white p-2.5 shadow-[0_18px_40px_rgba(15,63,29,0.08)] sm:rounded-[24px] sm:p-3 md:rounded-[26px] md:p-4 lg:rounded-[28px] lg:p-5">
              <div className="rounded-[18px] border border-dashed border-[#D7E4D1] bg-[#FAFCF8] p-2.5 sm:rounded-[20px] sm:p-3 md:rounded-[22px] md:p-4">
                <div className="relative mx-auto h-[clamp(260px,38dvh,360px)] w-full overflow-hidden rounded-[16px] bg-white shadow-[0_18px_40px_rgba(15,63,29,0.08)] sm:h-[min(50dvh,460px)] sm:rounded-[18px] md:h-[min(52dvh,500px)] lg:h-[min(58dvh,620px)]">
                  <Image
                    src={activeImage.src}
                    alt={activeImage.alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1279px) 100vw, 880px"
                    priority
                    unoptimized={useUnoptimizedActiveImage}
                  />
                </div>
              </div>
            </div>

            <aside className="rounded-[24px] border border-[#E1EBDD] bg-white p-4 shadow-[0_18px_40px_rgba(15,63,29,0.06)] sm:p-5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#7A8C82]">
                Gallery
              </p>
              <p className="mt-2 text-[20px] font-semibold text-[#10341B] sm:text-[22px]">
                {title || 'Research highlight'}
              </p>

              {activeImage.title ? (
                <p className="mt-3 text-[14px] leading-7 text-[#5A6B61]">
                  {activeImage.title}
                </p>
              ) : null}

              {images.length > 1 ? (
                <>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => onNavigate('previous')}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[18px] border border-[#D7E3D3] bg-[#F8FBF6] px-4 py-3 text-sm font-semibold text-[#16311F] transition hover:border-[#BFD4B8] hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-2"
                    >
                      <ChevronLeft className="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
                      <span>Previous</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('next')}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[18px] border border-[#D7E3D3] bg-[#F8FBF6] px-4 py-3 text-sm font-semibold text-[#16311F] transition hover:border-[#BFD4B8] hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-2"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-6 border-t border-[#E8EFE3] pt-6">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#7A8C82]">
                      Quick switch
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {images.map((image, index) => (
                        <button
                          key={`${image.src}-${index}`}
                          type="button"
                          onClick={() => onSelectIndex(index)}
                          className={`overflow-hidden rounded-[18px] border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-2 ${
                            index === activeIndex
                              ? 'border-[#2E7D32] shadow-[0_10px_24px_rgba(46,125,50,0.16)]'
                              : 'border-[#D7E3D3] hover:border-[#BFD4B8]'
                          }`}
                          aria-label={`Show image ${index + 1}`}
                        >
                          <div className="relative aspect-[4/3] w-full bg-[#F3F8EF]">
                            <Image
                              src={image.src}
                              alt={image.alt}
                              fill
                              className="object-cover"
                              sizes="160px"
                              unoptimized={isLocalhostAssetUrl(image.src)}
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DepartmentResearchHighlightsSection({
  tagText,
  titlePart1,
  titlePart2,
  backgroundImageSrc = DEFAULT_BACKGROUND,
  backgroundImageAlt = DEFAULT_BACKGROUND_ALT,
  highlights,
  containerClassName = '',
}: DepartmentResearchHighlightsSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const previousTouchYRef = useRef<number | null>(null);
  const [openItemId, setOpenItemId] = useState('');
  const [responsiveMode, setResponsiveMode] = useState<ResponsiveMode>('desktop');
  const [galleryState, setGalleryState] = useState<{
    images: DepartmentResearchHighlightImage[];
    activeIndex: number;
    title?: string;
  } | null>(null);
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const useUnoptimizedBackground = isLocalhostAssetUrl(backgroundImageSrc);

  const effectiveOpenItemId =
    openItemId === '' || highlights.some((item) => item.id === openItemId)
      ? openItemId
      : highlights[0]?.id ?? '';

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const tabletQuery = window.matchMedia(
      '(min-width: 768px) and (max-width: 1023px)'
    );

    const syncResponsiveMode = () => {
      if (mobileQuery.matches) {
        setResponsiveMode('mobile');
        return;
      }

      if (tabletQuery.matches) {
        setResponsiveMode('tablet');
        return;
      }

      setResponsiveMode('desktop');
    };

    syncResponsiveMode();
    mobileQuery.addEventListener('change', syncResponsiveMode);
    tabletQuery.addEventListener('change', syncResponsiveMode);

    return () => {
      mobileQuery.removeEventListener('change', syncResponsiveMode);
      tabletQuery.removeEventListener('change', syncResponsiveMode);
    };
  }, []);

  const sectionHeight = useMemo(() => {
    if (responsiveMode === 'desktop') {
      return highlights.length > 4 ? DESKTOP_SCROLL_HEIGHT : undefined;
    }

    if (responsiveMode === 'tablet') {
      return highlights.length > 5 ? TABLET_SCROLL_HEIGHT : undefined;
    }

    return highlights.length > 4 ? MOBILE_SCROLL_HEIGHT : undefined;
  }, [highlights.length, responsiveMode]);

  useEffect(() => {
    if (responsiveMode !== 'mobile' || !sectionHeight) {
      previousTouchYRef.current = null;
      return;
    }

    const scrollNode = scrollContainerRef.current;

    if (!scrollNode) {
      return;
    }

    const shouldHandOffScroll = (deltaY: number) => {
      if (deltaY === 0) {
        return false;
      }

      const { scrollTop, scrollHeight, clientHeight } = scrollNode;
      const isAtTop = scrollTop <= SCROLL_BOUNDARY_TOLERANCE;
      const isAtBottom =
        scrollTop + clientHeight >= scrollHeight - SCROLL_BOUNDARY_TOLERANCE;

      return (deltaY < 0 && isAtTop) || (deltaY > 0 && isAtBottom);
    };

    const handOffScroll = (event: Event, deltaY: number) => {
      if (!shouldHandOffScroll(deltaY)) {
        return;
      }

      if (event.cancelable) {
        event.preventDefault();
      }

      window.scrollBy(0, deltaY);
    };

    const handleTouchStart = (event: TouchEvent) => {
      previousTouchYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const currentTouchY = event.touches[0]?.clientY;
      const previousTouchY = previousTouchYRef.current;

      if (currentTouchY === undefined || previousTouchY === null) {
        previousTouchYRef.current = currentTouchY ?? null;
        return;
      }

      const deltaY = previousTouchY - currentTouchY;
      previousTouchYRef.current = currentTouchY;
      handOffScroll(event, deltaY);
    };

    const handleTouchEnd = () => {
      previousTouchYRef.current = null;
    };

    const handleWheel = (event: WheelEvent) => {
      handOffScroll(event, event.deltaY);
    };

    const passiveOptions: AddEventListenerOptions = { passive: false };

    scrollNode.addEventListener('touchstart', handleTouchStart, passiveOptions);
    scrollNode.addEventListener('touchmove', handleTouchMove, passiveOptions);
    scrollNode.addEventListener('touchend', handleTouchEnd);
    scrollNode.addEventListener('touchcancel', handleTouchEnd);
    scrollNode.addEventListener('wheel', handleWheel, passiveOptions);

    return () => {
      previousTouchYRef.current = null;
      scrollNode.removeEventListener('touchstart', handleTouchStart);
      scrollNode.removeEventListener('touchmove', handleTouchMove);
      scrollNode.removeEventListener('touchend', handleTouchEnd);
      scrollNode.removeEventListener('touchcancel', handleTouchEnd);
      scrollNode.removeEventListener('wheel', handleWheel);
    };
  }, [responsiveMode, sectionHeight]);

  const openGallery = (
    images: DepartmentResearchHighlightImage[],
    title?: string,
    initialIndex = 0
  ) => {
    if (!images.length) {
      return;
    }

    setGalleryState({
      images,
      activeIndex: initialIndex,
      title,
    });
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setIsGalleryVisible(true);
      });
    });
  };

  const closeGallery = () => {
    setIsGalleryVisible(false);
    window.setTimeout(() => {
      setGalleryState(null);
    }, GALLERY_TRANSITION_MS);
  };

  const navigateGallery = (direction: 'previous' | 'next') => {
    setGalleryState((current) => {
      if (!current || current.images.length <= 1) {
        return current;
      }

      const nextIndex =
        direction === 'previous'
          ? (current.activeIndex - 1 + current.images.length) % current.images.length
          : (current.activeIndex + 1) % current.images.length;

      return {
        ...current,
        activeIndex: nextIndex,
      };
    });
  };

  const selectGalleryIndex = (index: number) => {
    setGalleryState((current) => {
      if (!current || index < 0 || index >= current.images.length) {
        return current;
      }

      return {
        ...current,
        activeIndex: index,
      };
    });
  };

  return (
    <>
      <section
        className="relative overflow-hidden py-14 md:py-16 lg:py-24"
        style={{
          width: '100vw',
          maxWidth: '100vw',
          marginLeft: 'calc(50% - 50vw)',
          marginRight: 'calc(50% - 50vw)',
        }}
      >
        <div className="absolute inset-0">
          <Image
            src={backgroundImageSrc}
            alt={backgroundImageAlt}
            fill
            className="object-cover object-center"
            sizes="100vw"
            unoptimized={useUnoptimizedBackground}
          />
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(37,93,9,0.88)_0%,rgba(110,181,10,0.74)_22%,rgba(154,213,36,0.3)_50%,rgba(58,113,14,0.78)_100%)]" />

        <div className="absolute inset-y-0 right-0 w-[42%] bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.22),transparent_55%)]" />

        <div className={`relative z-10 mx-auto max-w-[1600px] px-4 md:px-6 lg:px-8 ${containerClassName}`}>
          <div className="flex flex-col gap-6 md:gap-7 lg:grid lg:grid-cols-[86px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[96px_minmax(0,1fr)] xl:gap-9">
            <div className="flex flex-col items-start" data-department-reveal>
              <span className="sr-only">{tagText}</span>

              <div className="w-full lg:hidden">
                <div className="max-w-[780px]">
                  <span className="text-[30px] font-bold leading-[1.02] text-white sm:text-[34px] md:text-[42px]">
                    {titlePart1}
                    {titlePart2}
                  </span>
                </div>
              </div>

              <div className="hidden lg:-ml-6 lg:flex lg:min-h-[620px] lg:items-center xl:-ml-8">
                <div className="whitespace-nowrap text-left lg:rotate-180 lg:[writing-mode:vertical-rl]">
                  <span className="text-[56px] font-bold leading-none text-white xl:text-[64px]">
                    {titlePart1}
                    {titlePart2}
                  </span>
                </div>
              </div>
            </div>

            <div className="min-w-0 md:pt-1 lg:pt-4 xl:pt-5" data-department-reveal>
              <div
                ref={scrollContainerRef}
                className={`relative ${
                  sectionHeight
                    ? 'location-details-scroll overflow-y-auto overscroll-y-auto pr-1 sm:pr-2 md:pr-3'
                    : 'space-y-4'
                }`}
                style={
                  sectionHeight
                    ? {
                        height: sectionHeight,
                        maxHeight: sectionHeight,
                      }
                    : undefined
                }
              >
                <div
                  className={`relative w-full ${
                    responsiveMode === 'desktop'
                      ? 'space-y-6 xl:space-y-7'
                      : 'space-y-4 md:space-y-5'
                  }`}
                >
                  {responsiveMode === 'desktop' && highlights.length > 1 ? (
                    <div
                      className="pointer-events-none absolute left-[32px] top-[42px] bottom-[42px] z-0 w-px border-l border-dotted border-white/90 xl:left-[36px]"
                      aria-hidden="true"
                    />
                  ) : null}

                  {highlights.map((item, index) => {
                    const isOpen = item.id === effectiveOpenItemId;
                    const panelId = `research-highlight-panel-${item.id}`;
                    const iconSrc = item.iconSrc || TIMELINE_ICON;
                    const iconAlt = item.iconAlt || '';

                    const isExpandable = Boolean(
                      item.details ||
                        item.image ||
                        (item.sections && item.sections.length > 0)
                    );

                    return (
                      <div
                        key={item.id}
                        data-department-reveal
                        className="relative z-[1] grid grid-cols-1 items-start gap-2 sm:grid-cols-[48px_minmax(0,1fr)] sm:gap-4 md:grid-cols-[52px_minmax(0,1fr)] lg:grid-cols-[64px_minmax(0,1fr)] lg:gap-5 xl:grid-cols-[72px_minmax(0,1fr)]"
                      >
                        <div className="relative flex w-full justify-center">
                          <div className="relative z-[2] flex h-[38px] w-[38px] items-center justify-center rounded-full border border-[#2E7D32]/15 bg-white text-[16px] font-semibold leading-none text-[#7FCB19] shadow-[0_8px_18px_rgba(18,76,21,0.12)] sm:mt-[13px] sm:h-10 sm:w-10 sm:text-[17px] md:mt-[14px] md:h-[42px] md:w-[42px] md:text-[18px] lg:mt-[21px] lg:h-[40px] lg:w-[40px] xl:mt-[22px] xl:h-[42px] xl:w-[42px]">
                            {String(index + 1).padStart(2, '0')}
                          </div>

                          <div className="absolute right-0 top-[14px] hidden h-10 w-px border-l border-dotted border-white/55 md:block lg:hidden" />
                        </div>

                        <article className="rounded-[18px] bg-white px-3.5 py-4 shadow-[0_16px_36px_rgba(17,17,17,0.08)] transition-all duration-300 ease-out hover:translate-x-1 hover:shadow-[0_20px_42px_rgba(17,17,17,0.12)] sm:px-4 md:px-5 lg:rounded-[16px] lg:px-6 xl:px-7 xl:py-4">
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            onClick={() => {
                              if (isExpandable) {
                                setOpenItemId((current) => (current === item.id ? '' : item.id));
                              }
                            }}
                            className="flex min-h-11 w-full items-start gap-3 text-left sm:gap-4 md:gap-4 lg:gap-5"
                          >
                            <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#EFF4EC] sm:h-[46px] sm:w-[46px] md:h-[50px] md:w-[50px] lg:h-[54px] lg:w-[54px]">
                              <Image
                                src={iconSrc}
                                alt={iconAlt}
                                width={26}
                                height={26}
                                className="h-5 w-5 object-contain sm:h-[22px] sm:w-[22px] md:h-6 md:w-6 lg:h-[26px] lg:w-[26px]"
                                aria-hidden="true"
                                unoptimized={isLocalhostAssetUrl(iconSrc)}
                                style={{
                                  filter:
                                    'brightness(0) saturate(100%) invert(39%) sepia(18%) saturate(1744%) hue-rotate(75deg) brightness(91%) contrast(87%)',
                                }}
                              />
                            </div>

                            <div className="min-w-0 flex-1 pt-0.5 sm:pt-1">
                              <h3 className="text-[14px] font-medium leading-[1.7] text-[#2E7D32] sm:text-[15px] md:text-[16px] md:leading-[1.65] lg:text-[15px] lg:leading-[1.55] xl:text-[16px] [text-wrap:pretty]">
                                {item.summary}
                              </h3>
                            </div>

                            {isExpandable ? (
                              <div
                                className={`flex h-9 w-9 min-h-9 shrink-0 items-center justify-center rounded-full border border-[#DDEBD5] bg-[#F5FAF1] text-[#6FC109] shadow-[0_8px_18px_rgba(46,125,50,0.08)] transition-[background-color,border-color,color,transform] duration-300 hover:border-[#BFDDB5] hover:bg-white lg:h-8 lg:w-8 lg:min-h-8 ${
                                  isOpen ? 'rotate-180 border-[#A1DF0A] bg-white text-[#2E7D32]' : 'rotate-0'
                                }`}
                              >
                                <ChevronDown className="h-5 w-5" strokeWidth={2.15} />
                              </div>
                            ) : null}
                          </button>

                          {isExpandable ? (
                            <div
                              id={panelId}
                              className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${
                                isOpen
                                  ? 'mt-4 grid-rows-[1fr] opacity-100'
                                  : 'grid-rows-[0fr] opacity-0'
                              }`}
                            >
                              <div className="overflow-hidden">
                                <HighlightContent item={item} onOpenGallery={openGallery} />
                              </div>
                            </div>
                          ) : null}
                        </article>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {galleryState ? (
        <HighlightGalleryModal
          images={galleryState.images}
          activeIndex={galleryState.activeIndex}
          title={galleryState.title}
          isVisible={isGalleryVisible}
          onClose={closeGallery}
          onNavigate={navigateGallery}
          onSelectIndex={selectGalleryIndex}
        />
      ) : null}
    </>
  );
}
