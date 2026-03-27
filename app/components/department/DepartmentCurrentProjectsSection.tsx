'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { startTransition, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';

export interface DepartmentCurrentProjectItem {
  id: string;
  title: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
}

interface DepartmentCurrentProjectsSectionProps {
  tagText: string;
  titlePart1: string | React.ReactNode;
  titlePart2: string | React.ReactNode;
  projects: DepartmentCurrentProjectItem[];
  containerClassName?: string;
}

const MOBILE_GAP = 20;
const TABLET_GAP = 24;
const DESKTOP_GAP = 28;

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

function ProjectCard({
  project,
  staggered,
}: {
  project: DepartmentCurrentProjectItem;
  staggered: boolean;
}) {
  const cardContent = (
    <div className="relative h-full w-full">
      <Image
        src={project.imageSrc}
        alt={project.imageAlt}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        sizes="(max-width: 767px) 78vw, (max-width: 1279px) 44vw, 24vw"
      />

      <div
        className="absolute inset-0 transition-opacity duration-500 ease-out group-hover:opacity-20"
        style={{
          background:
            'linear-gradient(180deg, rgba(161, 223, 10, 0) 0%, #093714 100%)',
        }}
      />

      <div className="absolute inset-0 flex items-end p-5 md:p-6">
        <h3 className="max-w-[16ch] text-[16px] font-medium leading-[1.35] text-white">
          {project.title}
        </h3>
      </div>
    </div>
  );

  return (
    <article
      className={`group relative shrink-0 overflow-hidden rounded-[28px] shadow-[0_18px_46px_rgba(15,63,29,0.12)] transition-shadow duration-500 ease-out hover:shadow-[0_24px_54px_rgba(15,63,29,0.16)] ${staggered ? 'lg:translate-y-14' : 'lg:translate-y-0'}`}
      style={{ height: 'min(64vw, 446px)' }}
    >
      <Link
        href={project.href}
        className="block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#20C997] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
        aria-label={project.title}
      >
        {cardContent}
      </Link>
    </article>
  );
}

/**
 * Reusable department projects slider with alternating card positions.
 * Default state prioritizes text readability; hover reveals the image beneath the gradient.
 */
export default function DepartmentCurrentProjectsSection({
  tagText,
  titlePart1,
  titlePart2,
  projects,
  containerClassName = '',
}: DepartmentCurrentProjectsSectionProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
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
  }, []);

  const visibleCardCount = getVisibleCardCount(viewportWidth);
  const trackGap = getTrackGap(viewportWidth);
  const maxIndex = Math.max(0, projects.length - visibleCardCount);
  const boundedActiveIndex = Math.min(activeIndex, maxIndex);
  const cardWidth =
    viewportWidth > 0
      ? (viewportWidth - trackGap * Math.max(visibleCardCount - 1, 0)) / visibleCardCount
      : 0;
  const translateX = boundedActiveIndex * (cardWidth + trackGap);

  const handlePrevious = () => {
    startTransition(() => {
      setActiveIndex(Math.max(boundedActiveIndex - 1, 0));
    });
  };

  const handleNext = () => {
    startTransition(() => {
      setActiveIndex(Math.min(boundedActiveIndex + 1, maxIndex));
    });
  };

  return (
    <section className="bg-white py-16 md:py-20 lg:py-24">
      <div className={`mx-auto max-w-[1600px] px-4 md:px-6 xl:w-[80%] xl:px-0 ${containerClassName}`}>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-[760px]">
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

          <div className="hidden items-center gap-3 self-end lg:flex lg:self-start">
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
          className="mt-12 overflow-x-hidden overflow-y-visible pt-2 pb-16 lg:pt-2 lg:pb-20"
        >
          <div
            className="flex items-start transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              gap: `${trackGap}px`,
              transform: `translateX(-${translateX}px)`,
            }}
          >
            {projects.map((project, index) => (
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

        <div className="mt-2 flex items-center justify-center gap-3 lg:hidden">
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
    </section>
  );
}
