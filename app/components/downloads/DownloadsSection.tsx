'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PublicationCard from '../shared/PublicationCard';
import type { PublicationCardItem } from '../shared/PublicationCard';

gsap.registerPlugin(ScrollTrigger);

interface DownloadsSectionProps {
  items: PublicationCardItem[];
  buttonLabel?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
}

export default function DownloadsSection({
  items,
  buttonLabel = 'Read More',
  emptyStateTitle = 'Currently there are no downloads',
  emptyStateDescription = 'Please check back later for upcoming downloadable resources and publications.',
}: DownloadsSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (
      typeof window === 'undefined' ||
      !sectionRef.current ||
      !contentRef.current
    ) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const sectionNode = sectionRef.current;
    const contentNode = contentRef.current;

    const context = gsap.context(() => {
      const revealItems = gsap.utils.toArray<HTMLElement>('[data-downloads-reveal]');
      const animationTargets = revealItems.length > 0 ? revealItems : [contentNode];

      gsap.set(contentNode, {
        autoAlpha: 0,
        y: 30,
      });

      gsap.set(animationTargets, {
        autoAlpha: 0,
        y: 28,
      });

      const timeline = gsap.timeline({
        paused: true,
        defaults: {
          ease: 'power3.out',
        },
      });

      timeline.to(contentNode, {
        autoAlpha: 1,
        y: 0,
        duration: 0.78,
        clearProps: 'opacity,visibility,transform',
      });

      timeline.to(
        animationTargets,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
          stagger: revealItems.length > 1 ? 0.07 : 0,
          clearProps: 'opacity,visibility,transform',
        },
        '-=0.46'
      );

      ScrollTrigger.create({
        trigger: sectionNode,
        start: 'top 84%',
        once: true,
        onEnter: () => timeline.play(0),
      });

      ScrollTrigger.refresh();
    }, sectionNode);

    return () => context.revert();
  }, [items.length]);

  return (
    <section
      ref={sectionRef}
      className="bg-white px-4 pb-72 pt-14 md:px-6 md:pb-72 md:pt-16 lg:px-8 lg:pb-84 lg:pt-20"
    >
      <div ref={contentRef} className="mx-auto w-full max-w-[1440px]">
        {items.length === 0 ? (
          <div
            data-downloads-reveal
            className="mb-16 rounded-[24px] border border-[#DDE6D7] bg-[linear-gradient(135deg,#F7FBF6_0%,#EEF7EF_100%)] px-6 py-14 text-center shadow-[0_8px_24px_rgba(15,63,29,0.04)] md:px-10"
          >
            <div className="mx-auto max-w-2xl">
              <h2 className="text-2xl font-semibold text-[#16324F] md:text-3xl">{emptyStateTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-[#5B6470] md:text-base">{emptyStateDescription}</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto grid justify-center gap-6 sm:grid-cols-2 md:[grid-template-columns:repeat(2,246px)] xl:[grid-template-columns:repeat(4,246px)]">
            {items.map((item) => (
              <div key={item.id} data-downloads-reveal>
                <PublicationCard
                  item={item}
                  className="mx-auto w-full max-w-[246px]"
                  imageWrapperClassName="max-w-[210px] md:max-w-[220px]"
                  titleClassName="text-[14px] font-medium leading-[1.35]"
                  buttonLabel={buttonLabel}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
