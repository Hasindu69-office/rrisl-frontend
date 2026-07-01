'use client';

import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';

gsap.registerPlugin(ScrollTrigger);

export interface EstateSubstationIntroContent {
  eyebrow: string;
  titlePart1: string;
  titlePart2: string;
  paragraphs: string[];
  imageSrc: string;
  imageAlt: string;
}

export interface EstateSubstationIntroSectionProps {
  content: EstateSubstationIntroContent;
}

export default function EstateSubstationIntroSection({
  content,
}: EstateSubstationIntroSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const useUnoptimizedImage = isLocalhostAssetUrl(content.imageSrc);

  useLayoutEffect(() => {
    if (
      typeof window === 'undefined' ||
      !sectionRef.current ||
      !contentRef.current ||
      !imageRef.current
    ) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const sectionNode = sectionRef.current;
    const contentNode = contentRef.current;
    const imageNode = imageRef.current;

    const context = gsap.context(() => {
      gsap.set(contentNode, {
        autoAlpha: 0,
        x: -44,
      });
      gsap.set(imageNode, {
        autoAlpha: 0,
        x: 52,
      });

      ScrollTrigger.create({
        trigger: sectionNode,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.to(contentNode, {
            autoAlpha: 1,
            x: 0,
            duration: 1.05,
            ease: 'power3.out',
            clearProps: 'opacity,visibility,transform',
          });
        },
      });

      ScrollTrigger.create({
        trigger: sectionNode,
        start: 'top 72%',
        once: true,
        onEnter: () => {
          gsap.to(imageNode, {
            autoAlpha: 1,
            x: 0,
            duration: 1.1,
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
      className="bg-white px-4 py-16 md:px-6 md:py-20 lg:px-36 lg:py-24"
    >
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,520px)] lg:items-center lg:gap-16 xl:gap-24">
        <div ref={contentRef} className="max-w-[720px]">
          <GradientTag
            text={content.eyebrow}
            backgroundColor="transparent"
            padding="px-4 py-1.5"
          />

          <GradientTitle
            part1=""
            part2={`${content.titlePart1}${content.titlePart2}`}
            lineBreak={false}
            align="left"
            size="custom"
            customSize="clamp(2.2rem, 3vw, 3.55rem)"
            className="mt-5 leading-[1.12] tracking-[-0.02em]"
          />

          <div className="mt-8 space-y-7 text-[15px] leading-[2] text-[#26362B] md:text-[16px] md:leading-[2.05]">
            {content.paragraphs.map((paragraph) => (
              <p key={paragraph} className="max-w-[700px] text-justify">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div
            ref={imageRef}
            className="relative w-full max-w-[320px] md:max-w-[420px] lg:max-w-[520px]"
          >
            <Image
              src={content.imageSrc}
              alt={content.imageAlt}
              width={1000}
              height={1000}
              className="h-auto w-full object-contain"
              unoptimized={useUnoptimizedImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
