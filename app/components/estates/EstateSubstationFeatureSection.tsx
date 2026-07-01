 'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';

gsap.registerPlugin(ScrollTrigger);

export interface EstateSubstationFeatureCard {
  title: string;
  badge: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export interface EstateSubstationFeatureSectionContent {
  eyebrow: string;
  titlePart1: string;
  titlePart2: string;
  description: string;
  backgroundImageSrc: string;
  backgroundImageAlt: string;
  cards?: EstateSubstationFeatureCard[];
}

export interface EstateSubstationFeatureSectionProps {
  content: EstateSubstationFeatureSectionContent;
}

function FeatureCard({
  title,
  badge,
  description,
  imageSrc,
  imageAlt,
}: EstateSubstationFeatureCard) {
  const useUnoptimizedImage = isLocalhostAssetUrl(imageSrc);

  return (
    <article className="relative overflow-hidden rounded-[18px] min-h-[320px] shadow-[0_18px_34px_rgba(33,72,24,0.12)] md:rounded-[22px] md:min-h-[360px] xl:rounded-[24px] xl:min-h-[410px]">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover"
        unoptimized={useUnoptimizedImage}
        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 48vw, 20vw"
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(13,38,17,0.12)_100%)]" />

      <div className="relative z-10 flex min-h-[320px] items-end p-3.5 md:min-h-[360px] md:p-4 xl:min-h-[410px] xl:p-5">
        <div className="flex min-h-[142px] w-full flex-col overflow-hidden rounded-[18px] bg-white px-4 py-3.5 shadow-[0_12px_24px_rgba(15,63,29,0.08)] md:min-h-[156px] md:rounded-[20px] md:px-5 md:py-4 xl:h-[170px] xl:rounded-[22px] xl:px-6 xl:py-5">
          <h3 className="text-[16px] font-semibold leading-[1.15] text-[#567184] md:text-[17px] xl:text-[18px]">
            {title}
          </h3>

          <div className="mt-2 inline-flex self-start rounded-full bg-[#9DE100] px-2.5 py-1 md:px-3 md:py-1.5">
            <span className="text-[11px] font-semibold leading-none text-white md:text-[12px] xl:text-[13px]">
              {badge}
            </span>
          </div>

          <p className="mt-2 max-w-[280px] overflow-hidden text-[12px] leading-[1.5] text-[#5E7280] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:5] md:max-w-[260px] md:text-[13px] md:leading-[1.46] md:[-webkit-line-clamp:4] xl:text-[13.5px] xl:leading-[1.42]">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function EstateSubstationFeatureSection({
  content,
}: EstateSubstationFeatureSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const useUnoptimizedBackground = isLocalhostAssetUrl(content.backgroundImageSrc);

  useLayoutEffect(() => {
    if (
      typeof window === 'undefined' ||
      !sectionRef.current ||
      !introRef.current
    ) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const sectionNode = sectionRef.current;
    const introNode = introRef.current;
    const orderedCardNodes = cardRefs.current.filter(
      (node): node is HTMLDivElement => Boolean(node)
    );

    const context = gsap.context(() => {
      gsap.set(introNode, {
        autoAlpha: 0,
        y: 14,
      });

      if (orderedCardNodes.length > 0) {
        gsap.set(orderedCardNodes, {
          autoAlpha: 0,
          y: 24,
        });
      }

      const timeline = gsap.timeline({
        paused: true,
        defaults: {
          ease: 'power3.out',
        },
      });

      timeline.to(introNode, {
        autoAlpha: 1,
        y: 0,
        duration: 0.78,
        clearProps: 'opacity,visibility,transform',
      });

      if (orderedCardNodes.length > 0) {
        timeline.to(
          orderedCardNodes,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.82,
            stagger: 0.16,
            clearProps: 'opacity,visibility,transform',
          },
          '-=0.18'
        );
      }

      ScrollTrigger.create({
        trigger: sectionNode,
        start: 'top 84%',
        once: true,
        onEnter: () => timeline.play(0),
      });

      ScrollTrigger.refresh();
    }, sectionNode);

    return () => context.revert();
  }, [content.cards?.length]);

  cardRefs.current = [];

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={content.backgroundImageSrc}
          alt={content.backgroundImageAlt}
          fill
          className="object-cover object-center"
          sizes="100vw"
          unoptimized={useUnoptimizedBackground}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.78)_38%,rgba(255,255,255,0.56)_100%)]" />
      </div>

      <div className="relative z-10 px-4 py-12 md:px-6 md:py-16 lg:px-36 lg:py-24">
        <div className="mx-auto w-full max-w-[1440px]">
          <div
            ref={introRef}
            className="grid gap-7 md:gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.85fr)] lg:items-start lg:gap-16"
          >
            <div className="max-w-[640px]">
              <GradientTag
                text={content.eyebrow}
                backgroundColor="transparent"
                padding="px-4 py-1.5"
              />

              <GradientTitle
                part1={content.titlePart1}
                part2={content.titlePart2}
                lineBreak
                align="left"
                size="custom"
                customSize="clamp(2rem, 5vw, 3.6rem)"
                className="mt-4 leading-[1.08] tracking-[-0.02em] md:mt-5 md:leading-[1.1]"
              />
            </div>

            <div className="max-w-[560px] justify-self-start lg:justify-self-end">
              <p className="text-justify text-[14px] leading-[1.82] text-[#5E7280] md:text-[15px] md:leading-[1.92] lg:text-[16px] lg:leading-[2.05]">
                {content.description}
              </p>
            </div>
          </div>

          {content.cards?.length ? (
            <div className="mt-8 md:mt-10 lg:mt-12 lg:relative lg:left-1/2 lg:w-screen lg:max-w-none lg:-translate-x-1/2 lg:px-8 xl:px-10">
              <div className="grid gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-5 xl:gap-6">
                {content.cards.map((card, index) => (
                  <div
                    key={`${card.title}-${card.badge}`}
                    ref={(node) => {
                      cardRefs.current[index] = node;
                    }}
                  >
                    <FeatureCard {...card} />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
