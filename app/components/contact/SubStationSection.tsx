'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SubStationCard from './SubStationCard';
import type { SubStationCardData } from './subStationData';

gsap.registerPlugin(ScrollTrigger);

interface SubStationSectionProps {
  titlePart1: string;
  titlePart2: string;
  cards: SubStationCardData[];
}

export default function SubStationSection({
  titlePart1,
  titlePart2,
  cards,
}: SubStationSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (
      typeof window === 'undefined' ||
      !sectionRef.current ||
      !headingRef.current ||
      !gridRef.current
    ) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const sectionNode = sectionRef.current;
    const headingNode = headingRef.current;
    const gridNode = gridRef.current;

    const context = gsap.context(() => {
      const cardNodes = gsap.utils.toArray<HTMLElement>('[data-substation-card]', gridNode);

      gsap.set(headingNode, { autoAlpha: 0, y: 24 });

      if (cardNodes.length > 0) {
        gsap.set(cardNodes, { autoAlpha: 0, y: 24 });
      }

      ScrollTrigger.create({
        trigger: sectionNode,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          const timeline = gsap.timeline({
            defaults: {
              ease: 'power3.out',
            },
          });

          timeline.to(headingNode, {
            autoAlpha: 1,
            y: 0,
            duration: 0.74,
            clearProps: 'opacity,visibility,transform',
          });

          if (cardNodes.length > 0) {
            timeline.to(
              cardNodes,
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.68,
                stagger: 0.1,
                clearProps: 'opacity,visibility,transform',
              },
              '-=0.34'
            );
          }
        },
      });

      ScrollTrigger.refresh();
    }, sectionNode);

    return () => context.revert();
  }, [cards.length]);

  return (
    <section ref={sectionRef} className="mt-20">
      <h2
        ref={headingRef}
        className="text-[34px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#0F3F1D] md:text-[48px]"
      >
        {titlePart1}{' '}
        <span
          className="inline-block bg-clip-text text-transparent"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(32, 201, 151, 1), rgba(161, 223, 10, 1))',
          }}
        >
          {titlePart2}
        </span>
      </h2>

      <div
        ref={gridRef}
        className="mt-10 grid gap-8 md:grid-cols-2 md:gap-10 xl:gap-x-20 xl:gap-y-16"
      >
        {cards.map((card) => (
          <SubStationCard key={card.name} {...card} />
        ))}
      </div>
    </section>
  );
}
