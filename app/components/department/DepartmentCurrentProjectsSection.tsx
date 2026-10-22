'use client';

import Image from 'next/image';
import React, { startTransition, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';

export interface DepartmentCurrentProjectGalleryItem {
  id: string;
  src: string;
  alt: string;
}

export interface DepartmentCurrentProjectItem {
  id: string;
  title: string;
  href?: string;
  description?: string;
  objectives?: string;
  site?: string;
  startDate?: string;
  endDate?: string;
  principalInvestigator?: string;
  coInvestigators?: string;
  imageSrc?: string;
  imageAlt?: string;
  gallery?: DepartmentCurrentProjectGalleryItem[];
  departmentName?: string;
}

interface DepartmentCurrentProjectsSectionProps {
  tagText: string;
  titlePart1: string | React.ReactNode;
  titlePart2: string | React.ReactNode;
  projects: DepartmentCurrentProjectItem[];
  containerClassName?: string;
  sectionId?: string;
  layout?: 'slider' | 'list';
  autoSlide?: boolean;
  autoSlideIntervalMs?: number;
}

const MOBILE_GAP = 20;
const TABLET_GAP = 24;
const DESKTOP_GAP = 28;
const DEFAULT_AUTO_SLIDE_INTERVAL_MS = 3000;

function getVisibleCardCount(viewportWidth: number) {
  if (viewportWidth >= 1024) {
    return 5;
  }

  if (viewportWidth >= 768) {
    return 2;
  }

  return 1;
}

function getTrackGap(viewportWidth: number) {
  if (viewportWidth >= 1024) {
    return DESKTOP_GAP;
  }

  if (viewportWidth >= 768) {
    return TABLET_GAP;
  }

  return MOBILE_GAP;
}

function formatProjectDate(value?: string) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function ProjectCard({
  project,
  staggered,
}: {
  project: DepartmentCurrentProjectItem & { imageSrc: string };
  staggered: boolean;
}) {
  const useUnoptimizedImage = isLocalhostAssetUrl(project.imageSrc);
  const cardContent = (
    <div className="relative h-full w-full">
      <Image
        src={project.imageSrc}
        alt={project.imageAlt || project.title}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        sizes="(max-width: 767px) 78vw, (max-width: 1279px) 44vw, 24vw"
        unoptimized={useUnoptimizedImage}
      />

      <div
        className="absolute inset-0 transition-opacity duration-500 ease-out group-hover:opacity-20"
        style={{
          background:
            'linear-gradient(180deg, rgba(161, 223, 10, 0) 0%, #093714 100%)',
        }}
      />

      <div className="absolute inset-0 flex items-end p-5 md:p-6">
        <div className="flex max-w-[18ch] flex-col gap-2">
          {project.departmentName ? (
            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#D5F08B]">
              {project.departmentName}
            </span>
          ) : null}
          <h3 className="text-[14px] font-medium leading-[1.35] text-white">
            {project.title}
          </h3>
        </div>
      </div>
    </div>
  );

  return (
    <article
      className={`group relative shrink-0 overflow-hidden rounded-[28px] shadow-[0_18px_46px_rgba(15,63,29,0.12)] transition-shadow duration-500 ease-out hover:shadow-[0_24px_54px_rgba(15,63,29,0.16)] ${staggered ? 'lg:translate-y-14' : 'lg:translate-y-0'}`}
      style={{ height: 'min(64vw, 446px)' }}
    >
      {project.href ? (
        <a
          href={project.href}
          aria-label={`View ${project.title}`}
          className="block h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A1DF0A] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          {cardContent}
        </a>
      ) : (
        cardContent
      )}
    </article>
  );
}

function ProjectGallery({
  images,
  title,
}: {
  images: DepartmentCurrentProjectGalleryItem[];
  title: string;
}) {
  if (images.length === 0) {
    return null;
  }

  const columnClass =
    images.length === 1
      ? 'max-w-[280px] grid-cols-1'
      : images.length === 2
        ? 'max-w-[560px] grid-cols-2'
        : 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4';

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
            sizes="(max-width: 767px) 45vw, (max-width: 1279px) 30vw, 22vw"
            unoptimized={isLocalhostAssetUrl(image.src)}
          />
        </div>
      ))}
    </div>
  );
}

function ProjectDetailListItem({
  project,
  isOpen,
  onToggle,
}: {
  project: DepartmentCurrentProjectItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelId = `department-project-panel-${project.id}`;
  const triggerId = `department-project-trigger-${project.id}`;
  const detailItems = [
    { label: 'Objectives', value: project.objectives },
    { label: 'Site', value: project.site },
    { label: 'Date of commencing', value: formatProjectDate(project.startDate) },
    { label: 'Expected date of end', value: formatProjectDate(project.endDate) },
    { label: 'Principal Investigator (PI)', value: project.principalInvestigator },
    { label: 'Co-Investigators (CoI)', value: project.coInvestigators },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  const galleryImages = [
    ...(project.imageSrc
      ? [
          {
            id: `${project.id}-cover`,
            src: project.imageSrc,
            alt: project.imageAlt || project.title,
          },
        ]
      : []),
    ...(project.gallery || []),
  ];

  const hasPanelContent =
    Boolean(project.description) || detailItems.length > 0 || galleryImages.length > 0;

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
        <h4 className="text-[17px] font-semibold leading-[1.45] text-[#153C21] md:text-[20px]">
          {project.title}
        </h4>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFF8E9] text-[#2E7D32] transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <ChevronDown className="h-5 w-5" aria-hidden="true" />
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[#E7EFE2] px-5 py-6 md:px-7 md:py-7">
            {hasPanelContent ? (
              <>
                {project.description ? (
                  <p className="mb-5 whitespace-pre-line text-[15px] leading-[1.8] text-[#35473A] md:text-[16px]">
                    {project.description}
                  </p>
                ) : null}

                {detailItems.length > 0 ? (
                  <dl className="grid gap-4 md:grid-cols-2">
                    {detailItems.map((detail) => (
                      <div
                        key={`${project.id}-${detail.label}`}
                        className="rounded-[16px] border border-[#E3EDDE] bg-[#F8FBF6] p-4 md:p-5"
                      >
                        <dt className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#2E7D32]">
                          {detail.label}
                        </dt>
                        <dd className="mt-2 whitespace-pre-line text-[14px] leading-[1.75] text-[#2F4034] md:text-[15px]">
                          {detail.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                {galleryImages.length > 0 ? (
                  <div className={detailItems.length > 0 || project.description ? 'mt-6' : ''}>
                    <ProjectGallery images={galleryImages} title={project.title} />
                  </div>
                ) : null}
              </>
            ) : (
              <p className="text-[15px] leading-[1.8] text-[#5A6B5F]">
                Project details will be added soon.
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function ProjectsListLayout({
  tagText,
  titlePart1,
  titlePart2,
  projects,
  containerClassName,
  sectionId,
}: {
  tagText: string;
  titlePart1: string | React.ReactNode;
  titlePart2: string | React.ReactNode;
  projects: DepartmentCurrentProjectItem[];
  containerClassName: string;
  sectionId?: string;
}) {
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);

  return (
    <section id={sectionId} className="scroll-mt-28 bg-[#F5F9F2] py-16 md:py-20 lg:py-24">
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

        <div className="mt-10 space-y-4 md:mt-12 md:space-y-5" data-department-reveal>
          {projects.map((project) => (
            <ProjectDetailListItem
              key={project.id}
              project={project}
              isOpen={openProjectId === project.id}
              onToggle={() =>
                setOpenProjectId((current) => (current === project.id ? null : project.id))
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Department / homepage current projects.
 * `layout="slider"` keeps the image carousel; `layout="list"` shows expandable project details.
 */
export default function DepartmentCurrentProjectsSection({
  tagText,
  titlePart1,
  titlePart2,
  projects,
  containerClassName = '',
  sectionId,
  layout = 'slider',
  autoSlide = false,
  autoSlideIntervalMs = DEFAULT_AUTO_SLIDE_INTERVAL_MS,
}: DepartmentCurrentProjectsSectionProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [isAutoSlidePaused, setIsAutoSlidePaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const sliderProjects = projects.filter(
    (project): project is DepartmentCurrentProjectItem & { imageSrc: string } =>
      Boolean(project.imageSrc)
  );

  useEffect(() => {
    if (layout !== 'slider') {
      return;
    }

    const node = viewportRef.current;

    if (!node) {
      return;
    }

    const updateViewportWidth = () => {
      setViewportWidth(node.clientWidth);
    };

    updateViewportWidth();

    const observer = new ResizeObserver(() => {
      updateViewportWidth();
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [layout]);

  const visibleCardCount = getVisibleCardCount(viewportWidth);
  const effectiveVisibleCardCount = Math.max(
    1,
    Math.min(visibleCardCount, sliderProjects.length)
  );
  const trackGap = getTrackGap(viewportWidth);
  const maxIndex = Math.max(0, sliderProjects.length - effectiveVisibleCardCount);
  const boundedActiveIndex = Math.min(activeIndex, maxIndex);
  const canSlide = maxIndex > 0;
  const cardWidth =
    viewportWidth > 0
      ? (viewportWidth - trackGap * Math.max(effectiveVisibleCardCount - 1, 0)) /
        effectiveVisibleCardCount
      : 0;
  const translateX = canSlide ? boundedActiveIndex * (cardWidth + trackGap) : 0;

  const handlePrevious = () => {
    if (!canSlide) {
      return;
    }

    startTransition(() => {
      setActiveIndex(Math.max(boundedActiveIndex - 1, 0));
    });
  };

  const handleNext = () => {
    if (!canSlide) {
      return;
    }

    startTransition(() => {
      setActiveIndex(Math.min(boundedActiveIndex + 1, maxIndex));
    });
  };

  useEffect(() => {
    if (layout !== 'slider' || !autoSlide || typeof window === 'undefined') {
      return;
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotionPreference = (event?: MediaQueryListEvent) => {
      setPrefersReducedMotion(event ? event.matches : motionQuery.matches);
    };

    syncMotionPreference();
    motionQuery.addEventListener('change', syncMotionPreference);

    return () => {
      motionQuery.removeEventListener('change', syncMotionPreference);
    };
  }, [autoSlide, layout]);

  useEffect(() => {
    if (
      layout !== 'slider' ||
      !autoSlide ||
      !canSlide ||
      isAutoSlidePaused ||
      prefersReducedMotion ||
      autoSlideIntervalMs <= 0
    ) {
      return;
    }

    const intervalId = window.setInterval(() => {
      startTransition(() => {
        setActiveIndex((previousIndex) => {
          const safePreviousIndex = Math.min(previousIndex, maxIndex);

          return safePreviousIndex >= maxIndex ? 0 : safePreviousIndex + 1;
        });
      });
    }, autoSlideIntervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    autoSlide,
    autoSlideIntervalMs,
    canSlide,
    isAutoSlidePaused,
    layout,
    maxIndex,
    prefersReducedMotion,
  ]);

  if (layout === 'list') {
    if (projects.length === 0) {
      return null;
    }

    return (
      <ProjectsListLayout
        tagText={tagText}
        titlePart1={titlePart1}
        titlePart2={titlePart2}
        projects={projects}
        containerClassName={containerClassName}
        sectionId={sectionId}
      />
    );
  }

  if (sliderProjects.length === 0) {
    return null;
  }

  const handleAutoSlidePause = () => {
    if (!autoSlide) {
      return;
    }

    setIsAutoSlidePaused(true);
  };

  const handleAutoSlideResume = () => {
    if (!autoSlide) {
      return;
    }

    setIsAutoSlidePaused(false);
  };

  const handleAutoSlideBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      handleAutoSlideResume();
    }
  };

  return (
    <section id={sectionId} className="scroll-mt-28 bg-white py-16 md:py-20 lg:py-24">
      <div className={`mx-auto max-w-[1600px] px-4 md:px-6 xl:w-[80%] xl:px-0 ${containerClassName}`}>
        <div
          onMouseEnter={handleAutoSlidePause}
          onMouseLeave={handleAutoSlideResume}
          onFocus={handleAutoSlidePause}
          onBlur={handleAutoSlideBlur}
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-[760px]" data-department-reveal>
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
                customSize="clamp(30px, 4vw, 58px)"
                align="left"
                className="mt-5 font-bold leading-[1.12]"
              />
            </div>

            <div
              className={`hidden items-center gap-3 self-end lg:self-start ${
                canSlide ? 'lg:flex' : 'lg:hidden'
              }`}
              data-department-reveal
            >
              <button
                type="button"
                aria-label="Previous projects"
                onClick={handlePrevious}
                disabled={boundedActiveIndex === 0}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F4B1D] text-white transition duration-300 hover:bg-[#136127] disabled:cursor-not-allowed disabled:bg-[#DCE5D7] disabled:text-[#8BA191]"
              >
                <ArrowLeft className="h-5 w-5" strokeWidth={2.2} />
              </button>
              <button
                type="button"
                aria-label="Next projects"
                onClick={handleNext}
                disabled={boundedActiveIndex >= maxIndex}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F4B1D] text-white transition duration-300 hover:bg-[#136127] disabled:cursor-not-allowed disabled:bg-[#DCE5D7] disabled:text-[#8BA191]"
              >
                <ArrowRight className="h-5 w-5" strokeWidth={2.2} />
              </button>
            </div>
          </div>

          <div
            ref={viewportRef}
            data-department-reveal
            className="mt-12 overflow-x-hidden overflow-y-visible pt-2 pb-16 lg:pt-2 lg:pb-20"
          >
            <div
              className="flex items-start transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                gap: `${trackGap}px`,
                transform: `translateX(-${translateX}px)`,
              }}
            >
              {sliderProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="shrink-0"
                  style={{
                    width: cardWidth > 0 ? `${cardWidth}px` : undefined,
                    flexBasis: cardWidth > 0 ? `${cardWidth}px` : undefined,
                  }}
                >
                  <ProjectCard project={project} staggered={index % 2 === 1} />
                </div>
              ))}
            </div>
          </div>

          <div
            className={`mt-2 items-center justify-center gap-3 lg:hidden ${
              canSlide ? 'flex' : 'hidden'
            }`}
          >
            <button
              type="button"
              aria-label="Previous projects"
              onClick={handlePrevious}
              disabled={boundedActiveIndex === 0}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F4B1D] text-white transition duration-300 hover:bg-[#136127] disabled:cursor-not-allowed disabled:bg-[#DCE5D7] disabled:text-[#8BA191]"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={2.2} />
            </button>
            <button
              type="button"
              aria-label="Next projects"
              onClick={handleNext}
              disabled={boundedActiveIndex >= maxIndex}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F4B1D] text-white transition duration-300 hover:bg-[#136127] disabled:cursor-not-allowed disabled:bg-[#DCE5D7] disabled:text-[#8BA191]"
            >
              <ArrowRight className="h-5 w-5" strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
