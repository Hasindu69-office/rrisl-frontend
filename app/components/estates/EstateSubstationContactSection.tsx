'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LocationCard from '../contact/LocationCard';
import type { LocationCardData } from '../contact/locationData';

gsap.registerPlugin(ScrollTrigger);

export type EstateSubstationContactSectionContent = LocationCardData;

export interface EstateSubstationContactSectionProps {
  content: EstateSubstationContactSectionContent;
  className?: string;
}

export default function EstateSubstationContactSection({
  content,
  className = '',
}: EstateSubstationContactSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (
      typeof window === 'undefined' ||
      !sectionRef.current ||
      !cardRef.current
    ) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const sectionNode = sectionRef.current;
    const cardNode = cardRef.current;

    const context = gsap.context(() => {
      gsap.set(cardNode, {
        autoAlpha: 0,
        y: 16,
      });

      ScrollTrigger.create({
        trigger: sectionNode,
        start: 'top 84%',
        once: true,
        onEnter: () => {
          gsap.to(cardNode, {
            autoAlpha: 1,
            y: 0,
            duration: 0.82,
            ease: 'power3.out',
            clearProps: 'opacity,visibility,transform',
          });
        },
      });

      ScrollTrigger.refresh();
    }, sectionNode);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`bg-white px-4 py-16 md:px-6 md:py-20 lg:px-36 lg:py-8 mb-48 lg:mb-78 ${className}`.trim()}
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div ref={cardRef} className="-mt-16 md:-mt-20">
          <LocationCard {...content} />
        </div>
      </div>
    </section>
  );
}
