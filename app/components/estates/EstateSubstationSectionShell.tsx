'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';
import type { ReactNode } from 'react';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';

gsap.registerPlugin(ScrollTrigger);

export interface EstateSubstationSectionShellContent {
  eyebrow: string;
  title: string;
  backgroundImageSrc: string;
  backgroundImageAlt: string;
}

export interface EstateSubstationSectionShellProps {
  content: EstateSubstationSectionShellContent;
  className?: string;
  contentClassName?: string;
  containerClassName?: string;
  children?: ReactNode;
}

export default function EstateSubstationSectionShell({
  content,
  className = '',
  contentClassName = '',
  containerClassName = 'max-w-[1440px]',
  children,
}: EstateSubstationSectionShellProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const childrenRef = useRef<HTMLDivElement | null>(null);
  const hasLocalhostUrl = isLocalhostAssetUrl(content.backgroundImageSrc);
  const [useFallbackImage, setUseFallbackImage] = useState(() => {
    if (typeof window !== 'undefined' && hasLocalhostUrl) {
      const hostname = window.location.hostname;
      return hostname !== 'localhost' && hostname !== '127.0.0.1';
    }

    return false;
  });
  const useUnoptimizedImage = isLocalhostAssetUrl(content.backgroundImageSrc);

  useLayoutEffect(() => {
    if (
      typeof window === 'undefined' ||
      !sectionRef.current ||
      !headingRef.current
    ) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const sectionNode = sectionRef.current;
    const headingNode = headingRef.current;
    const childrenNode = childrenRef.current;

    const context = gsap.context(() => {
      gsap.set(headingNode, {
        autoAlpha: 0,
        y: 14,
      });

      const panelNodes = childrenNode
        ? Array.from(childrenNode.children).filter(
            (node): node is HTMLElement => node instanceof HTMLElement
          )
        : [];

      if (panelNodes.length > 0) {
        gsap.set(panelNodes, {
          autoAlpha: 0,
          y: 24,
        });
      } else if (childrenNode) {
        gsap.set(childrenNode, {
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

      timeline.to(headingNode, {
        autoAlpha: 1,
        y: 0,
        duration: 0.78,
        clearProps: 'opacity,visibility,transform',
      });

      if (panelNodes.length > 0) {
        timeline.to(
          panelNodes,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.82,
            stagger: 0.16,
            clearProps: 'opacity,visibility,transform',
          },
          '-=0.16'
        );
      } else if (childrenNode) {
        timeline.to(
          childrenNode,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.82,
            clearProps: 'opacity,visibility,transform',
          },
          '-=0.16'
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
  }, [children]);

  return (
    <section ref={sectionRef} className={`relative overflow-hidden ${className}`.trim()}>
      <div className="absolute inset-0">
        {useFallbackImage ? (
          <img
            src={content.backgroundImageSrc}
            alt={content.backgroundImageAlt}
            className="absolute inset-0 h-full w-full object-cover object-center"
            onError={() => {
              console.error(
                'Failed to load estate substation section background image:',
                content.backgroundImageSrc
              );
            }}
          />
        ) : (
          <Image
            src={content.backgroundImageSrc}
            alt={content.backgroundImageAlt}
            fill
            className="object-cover object-center"
            sizes="100vw"
            unoptimized={useUnoptimizedImage}
            onError={() => {
              console.error(
                'Next.js Image failed for estate substation section background, falling back to img:',
                content.backgroundImageSrc
              );
              setUseFallbackImage(true);
            }}
          />
        )}
      </div>

      <div
        className={`relative z-10 px-4 py-12 md:px-6 md:py-16 lg:px-36 lg:py-24 ${contentClassName}`.trim()}
      >
        <div className={`mx-auto flex w-full justify-center ${containerClassName}`.trim()}>
          <div className="flex w-full flex-col items-center">
            <div
              ref={headingRef}
              className="flex max-w-[980px] flex-col items-center text-center"
            >
              <GradientTag
                text={content.eyebrow}
                backgroundColor="transparent"
                padding="px-4 py-1.5"
              />

              <GradientTitle
                part1=""
                part2={content.title}
                lineBreak={false}
                align="center"
                size="custom"
                customSize="clamp(2rem, 5.2vw, 3.85rem)"
                className="mt-4 leading-[1.08] tracking-[-0.02em] md:mt-5 md:leading-[1.12]"
              />
            </div>

            {children ? (
              <div ref={childrenRef} className="mt-8 w-full md:mt-10 lg:mt-12">
                {children}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
