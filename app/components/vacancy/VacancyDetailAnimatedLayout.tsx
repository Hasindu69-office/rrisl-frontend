'use client';

import { useLayoutEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface VacancyDetailAnimatedLayoutProps {
  children: ReactNode;
}

export default function VacancyDetailAnimatedLayout({
  children,
}: VacancyDetailAnimatedLayoutProps) {
  const layoutRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !layoutRef.current) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const layoutNode = layoutRef.current;

    const context = gsap.context(() => {
      const columns = gsap.utils.toArray<HTMLElement>('[data-vacancy-detail-column]');
      const revealItems = gsap.utils.toArray<HTMLElement>('[data-vacancy-detail-reveal]');

      if (columns.length > 0) {
        gsap.set(columns, {
          autoAlpha: 0,
          y: 32,
        });
      }

      if (revealItems.length > 0) {
        gsap.set(revealItems, {
          autoAlpha: 0,
          y: 26,
        });
      }

      const timeline = gsap.timeline({
        paused: true,
        defaults: {
          ease: 'power3.out',
        },
      });

      if (columns.length > 0) {
        timeline.to(columns, {
          autoAlpha: 1,
          y: 0,
          duration: 0.78,
          stagger: 0.12,
          clearProps: 'opacity,visibility,transform',
        });
      }

      if (revealItems.length > 0) {
        timeline.to(
          revealItems,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.68,
            stagger: 0.065,
            clearProps: 'opacity,visibility,transform',
          },
          columns.length > 0 ? '-=0.42' : 0
        );
      }

      ScrollTrigger.create({
        trigger: layoutNode,
        start: 'top 84%',
        once: true,
        onEnter: () => timeline.play(0),
      });

      ScrollTrigger.refresh();
    }, layoutNode);

    return () => context.revert();
  }, []);

  return (
    <div
      ref={layoutRef}
      className="mx-auto grid w-full max-w-[1480px] gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12"
    >
      {children}
    </div>
  );
}
