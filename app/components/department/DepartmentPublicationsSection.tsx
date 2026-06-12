'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';

export interface DepartmentPublicationSectionItem {
  id: string;
  label: string;
  entries: string[];
}

interface DepartmentPublicationsSectionProps {
  title?: string;
  leftBackgroundImageSrc: string;
  leftBackgroundImageAlt: string;
  rightBackgroundImageSrc: string;
  rightBackgroundImageAlt: string;
  sections: DepartmentPublicationSectionItem[];
}

/**
 * Reusable department publications section shell.
 * This initial version matches the two-panel background treatment from the design
 * and leaves the left content area ready for the publication list UI in the next step.
 */
export default function DepartmentPublicationsSection({
  title = 'Our Publications',
  leftBackgroundImageSrc,
  leftBackgroundImageAlt,
  rightBackgroundImageSrc,
  rightBackgroundImageAlt,
  sections,
}: DepartmentPublicationsSectionProps) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(1440);
  const accordionViewportRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const useUnoptimizedLeftImage = isLocalhostAssetUrl(leftBackgroundImageSrc);
  const useUnoptimizedRightImage = isLocalhostAssetUrl(rightBackgroundImageSrc);

  const handleToggle = (sectionId: string) => {
    setActiveSectionId((currentId) => (currentId === sectionId ? null : sectionId));
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const syncWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    syncWindowWidth();
    window.addEventListener('resize', syncWindowWidth);

    return () => {
      window.removeEventListener('resize', syncWindowWidth);
    };
  }, []);

  const isDesktop = windowWidth >= 1024;

  useEffect(() => {
    if (!activeSectionId) {
      return;
    }

    const viewportNode = accordionViewportRef.current;
    const activeSectionNode = sectionRefs.current[activeSectionId];

    if (!viewportNode || !activeSectionNode) {
      return;
    }

    const animationFrameId = window.requestAnimationFrame(() => {
      const viewportRect = viewportNode.getBoundingClientRect();
      const sectionRect = activeSectionNode.getBoundingClientRect();
      const currentScrollTop = viewportNode.scrollTop;
      const topOffset = sectionRect.top - viewportRect.top;
      const bottomOffset = sectionRect.bottom - viewportRect.bottom;

      if (topOffset < 0) {
        viewportNode.scrollTo({
          top: Math.max(currentScrollTop + topOffset - 12, 0),
          behavior: 'smooth',
        });
        return;
      }

      if (bottomOffset > 0) {
        viewportNode.scrollTo({
          top: currentScrollTop + bottomOffset + 12,
          behavior: 'smooth',
        });
      }
    });

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [activeSectionId]);

  return (
    <section>
      <div className="grid overflow-hidden lg:grid-cols-2">
        <div className="order-2 relative min-h-[320px] overflow-hidden md:min-h-[420px] lg:order-1 lg:min-h-[520px]">
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, #577905 0%, #A1DF0A 100%)',
            }}
          />

          <Image
            src={leftBackgroundImageSrc}
            alt={leftBackgroundImageAlt}
            fill
            className="object-cover opacity-25 mix-blend-screen"
            sizes="(max-width: 1023px) 100vw, 50vw"
            priority={false}
            unoptimized={useUnoptimizedLeftImage}
          />

          <div className="relative z-[1] flex h-full w-full items-center justify-center px-4 py-8 md:px-6 md:py-10 lg:p-10">
            <div className="w-full max-w-[640px] lg:max-w-[500px]" data-department-reveal>
              <div
                ref={accordionViewportRef}
                className={`overflow-y-auto pr-2 [scrollbar-color:#A1DF0A_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#A1DF0A] [&::-webkit-scrollbar-track]:bg-transparent ${
                  isDesktop ? 'max-h-[380px]' : 'max-h-[360px] md:max-h-[420px]'
                }`}
              >
                <div className="space-y-4 md:space-y-5 lg:space-y-6">
                {sections.map((section) => {
                  const isActive = section.id === activeSectionId;
                  const buttonId = `publication-trigger-${section.id}`;
                  const panelId = `publication-panel-${section.id}`;

                  return (
                    <article
                      key={section.id}
                      data-department-reveal
                      ref={(node) => {
                        sectionRefs.current[section.id] = node;
                      }}
                      className={`overflow-hidden rounded-[30px] border transition-[background-color,border-color,box-shadow] duration-300 ${
                        isActive
                          ? 'border-transparent bg-white text-black shadow-[0_14px_40px_rgba(49,81,4,0.16)]'
                          : 'border-[0.5px] border-white bg-transparent text-white hover:border-[#0F3F1D]'
                      }`}
                    >
                      <button
                        id={buttonId}
                        type="button"
                        onClick={() => handleToggle(section.id)}
                        aria-expanded={isActive}
                        aria-controls={panelId}
                        className={`flex w-full items-center justify-between px-5 py-3.5 text-left transition duration-300 md:px-6 md:py-4 ${
                          isActive ? 'text-black' : 'text-white'
                        }`}
                      >
                        <span className="text-[15px] font-semibold leading-none md:text-[16px]">
                          {section.label}
                        </span>

                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full shadow-[0_6px_16px_rgba(50,82,4,0.16)] md:h-8 md:w-8 ${
                            isActive ? 'bg-[#F4F8EC] text-[#7E8C66]' : 'bg-white text-[#6C9808]'
                          }`}
                        >
                          {isActive ? (
                            <Minus className="h-4 w-4" strokeWidth={2.5} />
                          ) : (
                            <Plus className="h-4 w-4" strokeWidth={2.5} />
                          )}
                        </span>
                      </button>

                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        aria-hidden={!isActive}
                        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                          isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="px-5 pb-4 text-black md:px-7 md:pb-5">
                            <div className="border-t border-[#E6E6E6]" />

                            <div className="mt-4 max-h-[180px] overflow-y-auto pr-3 [scrollbar-color:#A1DF0A_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#A1DF0A] [&::-webkit-scrollbar-track]:bg-transparent md:max-h-[220px] lg:max-h-[132px]">
                              <ul className="space-y-1.5">
                                {section.entries.map((entry) => (
                                  <li
                                    key={entry}
                                    className="ml-5 list-disc text-[13px] leading-[1.85] md:text-[15px] md:leading-[1.9]"
                                  >
                                    {entry}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 relative min-h-[240px] overflow-hidden md:min-h-[320px] lg:order-2 lg:min-h-[520px]">
          <Image
            src={rightBackgroundImageSrc}
            alt={rightBackgroundImageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1023px) 100vw, 50vw"
            unoptimized={useUnoptimizedRightImage}
          />

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.34)_100%)]" />

          <div className="relative z-[1] flex h-full items-end px-4 pb-5 md:px-6 md:pb-7 lg:px-7 lg:pb-7" data-department-reveal>
            <h2 className="mb-0 max-w-[14ch] text-[30px] font-bold leading-[1.02] text-white md:text-[38px] lg:mb-[80px] lg:text-[50px]">
              {title}
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
