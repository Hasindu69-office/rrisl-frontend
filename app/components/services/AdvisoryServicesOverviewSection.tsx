'use client';

import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';
import type { AdvisoryServicesOverviewViewModel } from '@/app/lib/advisory-services/pageData';

gsap.registerPlugin(ScrollTrigger);

interface AdvisoryServicesOverviewSectionProps {
  overview: AdvisoryServicesOverviewViewModel;
}

export default function AdvisoryServicesOverviewSection({
  overview,
}: AdvisoryServicesOverviewSectionProps) {
  const useUnoptimizedImage = isLocalhostAssetUrl(overview.imageSrc);
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (
      typeof window === 'undefined' ||
      !sectionRef.current ||
      !imageRef.current ||
      !contentRef.current
    ) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const sectionNode = sectionRef.current;
    const imageNode = imageRef.current;
    const contentNode = contentRef.current;
    const paragraphNodes = gsap.utils.toArray<HTMLElement>(
      '[data-advisory-overview-paragraph]',
      contentNode
    );

    const context = gsap.context(() => {
      gsap.set(imageNode, {
        autoAlpha: 0,
        x: -34,
        y: 20,
      });
      gsap.set(contentNode, {
        autoAlpha: 0,
        y: 26,
      });

      if (paragraphNodes.length > 0) {
        gsap.set(paragraphNodes, {
          autoAlpha: 0,
          y: 18,
        });
      }

      const timeline = gsap.timeline({
        paused: true,
        defaults: {
          ease: 'power3.out',
        },
      });

      timeline.to(imageNode, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        duration: 0.9,
        clearProps: 'opacity,visibility,transform',
      });

      timeline.to(
        contentNode,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.78,
          clearProps: 'opacity,visibility,transform',
        },
        '-=0.6'
      );

      if (paragraphNodes.length > 0) {
        timeline.to(
          paragraphNodes,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.68,
            stagger: 0.1,
            clearProps: 'opacity,visibility,transform',
          },
          '-=0.38'
        );
      }

      ScrollTrigger.create({
        trigger: sectionNode,
        start: 'top 82%',
        once: true,
        onEnter: () => timeline.play(0),
      });

      ScrollTrigger.refresh();
    }, sectionNode);

    return () => context.revert();
  }, [overview.paragraphs.length]);

  return (
    <section
      ref={sectionRef}
      className="bg-white px-4 py-16 md:px-6 md:py-20 lg:px-36 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(360px,500px)] lg:items-center lg:gap-16 xl:gap-24">
          <div ref={contentRef} className="max-w-[760px]">
            <GradientTag
              text={overview.tag}
              backgroundColor="transparent"
              padding="px-4 py-1.5"
            />

            <GradientTitle
              part1={overview.title}
              part2=""
              lineBreak={false}
              size="custom"
              className="mt-5 max-w-[680px] text-[34px] leading-[1.14] tracking-[-0.02em] md:text-[42px] lg:text-[54px]"
              align="left"
            />

            <div className="mt-8 flex max-w-[700px] flex-col gap-6 text-[15px] leading-[1.95] text-[#26362B] md:gap-7 md:text-[16px] md:leading-[2.02]">
              {overview.paragraphs.map((paragraph, index) => (
                <p
                  key={`${paragraph}-${index}`}
                  data-advisory-overview-paragraph
                  className="text-justify"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div
              ref={imageRef}
              className="relative w-full max-w-[340px] md:max-w-[420px] lg:max-w-[500px]"
            >
              <div className="absolute inset-4 rounded-[28px] bg-[linear-gradient(180deg,rgba(161,223,10,0.12)_0%,rgba(46,125,50,0.03)_100%)] blur-2xl" />
              <div className="relative overflow-hidden rounded-[28px] border border-[#E3ECDC] bg-[#F8FBF5] p-2.5 shadow-[0_22px_56px_rgba(15,63,29,0.1)] md:rounded-[30px] md:p-3">
                <div className="relative overflow-hidden rounded-[22px] bg-white">
                  <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(15,63,29,0.08)_100%)]" />
                  <div className="relative aspect-[4/4.8] min-h-[320px] sm:min-h-[400px] lg:min-h-[520px]">
                    <Image
                      src={overview.imageSrc}
                      alt={overview.imageAlt}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 420px, 500px"
                      priority
                      unoptimized={useUnoptimizedImage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
