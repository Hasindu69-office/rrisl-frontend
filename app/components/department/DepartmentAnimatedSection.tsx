'use client';

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface DepartmentAnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
}

export default function DepartmentAnimatedSection({
  children,
  className = '',
  y = 42,
  duration = 0.82,
  stagger = 0.12,
  start = 'top 82%',
}: DepartmentAnimatedSectionProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current || typeof window === 'undefined') {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const sectionNode = sectionRef.current;

    const context = gsap.context(() => {
      const revealItems = gsap.utils.toArray<HTMLElement>('[data-department-reveal]');

      gsap.fromTo(
        sectionNode,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration,
          ease: 'power3.out',
          clearProps: 'opacity,visibility,transform',
          scrollTrigger: {
            trigger: sectionNode,
            start,
            once: true,
          },
        }
      );

      if (revealItems.length > 0) {
        gsap.fromTo(
          revealItems,
          { autoAlpha: 0, y: Math.min(y, 28) },
          {
            autoAlpha: 1,
            y: 0,
            duration: Math.max(duration - 0.1, 0.55),
            ease: 'power3.out',
            stagger,
            clearProps: 'opacity,visibility,transform',
            scrollTrigger: {
              trigger: sectionNode,
              start,
              once: true,
            },
          }
        );
      }
    }, sectionNode);

    return () => context.revert();
  }, [duration, stagger, start, y]);

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  );
}
