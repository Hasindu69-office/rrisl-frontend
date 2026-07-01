'use client';

import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GradientTag from '@/app/components/ui/GradientTag';
import GradientTitle from '@/app/components/ui/GradientTitle';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';
import FaqAccordion from './FaqAccordion';
import type { FaqItemData } from './faqData';

gsap.registerPlugin(ScrollTrigger);

interface FaqIntroSectionProps {
  section: {
    eyebrow: string;
    title: {
      part1: string;
      part2: string;
      align?: 'left' | 'center' | 'right';
    };
    imageSrc: string;
    imageAlt: string;
  };
  items: FaqItemData[];
}

export default function FaqIntroSection({ section, items }: FaqIntroSectionProps) {
  const useUnoptimizedImage = isLocalhostAssetUrl(section.imageSrc);
  const sectionRef = useRef<HTMLElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const accordionRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (
      typeof window === 'undefined' ||
      !sectionRef.current ||
      !introRef.current ||
      !imageRef.current ||
      !accordionRef.current
    ) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const sectionNode = sectionRef.current;
    const introNode = introRef.current;
    const imageNode = imageRef.current;
    const accordionNode = accordionRef.current;
    const faqCardNodes = gsap.utils.toArray<HTMLElement>('[data-faq-card]', accordionNode);

    const context = gsap.context(() => {
      gsap.set(introNode, { autoAlpha: 0, y: 22 });
      gsap.set(imageNode, { autoAlpha: 0, y: 24 });
      gsap.set(accordionNode, { autoAlpha: 0, y: 20 });

      if (faqCardNodes.length > 0) {
        gsap.set(faqCardNodes, { autoAlpha: 0, y: 18 });
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

          timeline.to(introNode, {
            autoAlpha: 1,
            y: 0,
            duration: 0.74,
            clearProps: 'opacity,visibility,transform',
          });

          timeline.to(
            imageNode,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.76,
              clearProps: 'opacity,visibility,transform',
            },
            '-=0.46'
          );

          timeline.to(
            accordionNode,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.72,
              clearProps: 'opacity,visibility,transform',
            },
            '-=0.42'
          );

          if (faqCardNodes.length > 0) {
            timeline.to(
              faqCardNodes,
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.62,
                stagger: 0.08,
                clearProps: 'opacity,visibility,transform',
              },
              '-=0.4'
            );
          }
        },
      });

      ScrollTrigger.refresh();
    }, sectionNode);

    return () => context.revert();
  }, [items.length]);

  return (
    <section
      ref={sectionRef}
      className="mb-48 md:mb-36 bg-white px-4 py-14 md:px-6 md:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1920px] lg:w-[80%]">
        <div className="grid w-full items-start gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16">
          <div ref={introRef} className="flex flex-col items-start">
            <GradientTag
              text={section.eyebrow}
              className="mb-5 md:mb-6"
              backgroundColor="#ffffff"
              padding="px-12 py-2"
            />

            <GradientTitle
              part1={section.title.part1}
              part2={section.title.part2}
              size="custom"
              align={section.title.align}
              className="w-full max-w-full font-semibold text-[32px] md:text-[40px] lg:text-[50px]"
              style={{ lineHeight: '1.15' }}
            />

            <div
              ref={imageRef}
              className="relative mt-6 w-full max-w-[280px] self-center aspect-[420/565] md:mt-8 md:max-w-[360px] lg:max-w-[420px]"
            >
              <Image
                src={section.imageSrc}
                alt={section.imageAlt}
                fill
                className="object-contain object-center"
                priority
                unoptimized={useUnoptimizedImage}
              />
            </div>
          </div>

          <div ref={accordionRef} className="w-full lg:pt-4">
            <FaqAccordion items={items} />
          </div>
        </div>
      </div>
    </section>
  );
}
