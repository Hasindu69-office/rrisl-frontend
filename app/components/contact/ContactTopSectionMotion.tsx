'use client';

import type { ReactNode } from 'react';
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ContactTopSectionMotionProps {
  infoPanel: ReactNode;
  formPanel: ReactNode;
}

export default function ContactTopSectionMotion({
  infoPanel,
  formPanel,
}: ContactTopSectionMotionProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const infoRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (
      typeof window === 'undefined' ||
      !sectionRef.current ||
      !infoRef.current ||
      !formRef.current
    ) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const sectionNode = sectionRef.current;
    const infoNode = infoRef.current;
    const formNode = formRef.current;

    const context = gsap.context(() => {
      gsap.set([infoNode, formNode], { autoAlpha: 0, y: 30 });

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

          timeline.to(infoNode, {
            autoAlpha: 1,
            y: 0,
            duration: 0.76,
            clearProps: 'opacity,visibility,transform',
          });

          timeline.to(
            formNode,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              clearProps: 'opacity,visibility,transform',
            },
            '-=0.48'
          );
        },
      });

      ScrollTrigger.refresh();
    }, sectionNode);

    return () => context.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="grid gap-0 lg:grid-cols-3"
    >
      <div ref={infoRef} className="lg:col-span-1 lg:-ml-6 xl:-ml-8">
        {infoPanel}
      </div>

      <div ref={formRef} className="lg:col-span-2">
        {formPanel}
      </div>
    </div>
  );
}
