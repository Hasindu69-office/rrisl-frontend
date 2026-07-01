'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import GradientTag from '@/app/components/ui/GradientTag';
import Button from '@/app/components/ui/Button';
import GradientTitle from '@/app/components/ui/GradientTitle';
import { addLocaleToUrl } from '@/app/lib/locale';
import type { HeroCta } from '@/app/lib/types';

gsap.registerPlugin(ScrollTrigger);

interface RubberAnnouncementProps {
  tagText: string;
  titlePart1: string;
  titlePart2: string;
  description: string;
  cta?: HeroCta | null;
}

export default function RubberAnnouncement({
  tagText,
  titlePart1,
  titlePart2,
  description,
  cta,
}: RubberAnnouncementProps) {
  const desktopSectionRef = useRef<HTMLElement | null>(null);
  const desktopVisualRef = useRef<HTMLDivElement | null>(null);
  const desktopCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const mobilePinRef = useRef<HTMLDivElement | null>(null);
  const mobileVisualRef = useRef<HTMLDivElement | null>(null);
  const mobileCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const searchParams = useSearchParams();
  const currentLocale = searchParams.get('locale') || 'en';
  const href = cta?.linkType === 'internal' && cta.url
    ? addLocaleToUrl(cta.url, currentLocale)
    : cta?.url || '#';

  useEffect(() => {
    const frameCount = 278;
    const getFrameSrc = (index: number) => {
      const frameNumber = String(index).padStart(5, '0');
      return `/animations/RubberPlant_${frameNumber}.webp`;
    };

    const images: HTMLImageElement[] = [];
    const redrawCallbacks = new Set<() => void>();

    ScrollTrigger.config({
      ignoreMobileResize: true,
    });

    for (let i = 0; i < frameCount; i++) {
      const img = new window.Image();
      img.decoding = 'async';
      img.src = getFrameSrc(i);
      img.onerror = () => {
        console.error('Failed to load frame:', img.src);
      };
      images.push(img);
    }

    images[0].onload = () => {
      redrawCallbacks.forEach((redraw) => redraw());
      ScrollTrigger.refresh();
    };

    const setupSequence = ({
      trigger,
      visual,
      canvas,
      mode,
      scrollDistance,
    }: {
      trigger: HTMLElement;
      visual: HTMLDivElement;
      canvas: HTMLCanvasElement;
      mode: 'desktop' | 'mobile';
      scrollDistance: number;
    }) => {
      const context = canvas.getContext('2d');
      if (!context) return undefined;

      const state = { frame: 0 };
      let animationFrameId: number | null = null;

      const setCanvasSize = () => {
        const rect = visual.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        context.setTransform(1, 0, 0, 1, 0, 0);
        context.scale(dpr, dpr);
      };

      const drawFrame = () => {
        const img = images[state.frame];
        if (!img || !img.complete) return;

        const rect = visual.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;

        context.clearRect(0, 0, w, h);

        const isTablet = w >= 640;
        const mobileScale = 2.1;
        const mobileXOffset = 0.42;
        const mobileYOffset = -0.18;
        const tabletScale = 2.0;
        const tabletXOffset = 0.42;
        const tabletYOffset = -0.1;
        const responsiveScale = isTablet ? tabletScale : mobileScale;
        const responsiveXOffset = isTablet ? tabletXOffset : mobileXOffset;
        const responsiveYOffset = isTablet ? tabletYOffset : mobileYOffset;
        const scale = mode === 'desktop'
          ? Math.min(w / img.width, h / img.height) * 1.6
          : Math.min(w / img.width, h / img.height) * responsiveScale;
        const drawWidth = img.width * scale;
        const drawHeight = img.height * scale;

        const x = mode === 'desktop' ? -20 : (w - drawWidth) / 2 + (w * responsiveXOffset);
        const y = mode === 'desktop' ? h - drawHeight + 60 : h - drawHeight + (h * responsiveYOffset);

        context.drawImage(img, x, y, drawWidth, drawHeight);
      };

      const requestDrawFrame = () => {
        if (animationFrameId !== null) return;

        animationFrameId = window.requestAnimationFrame(() => {
          animationFrameId = null;
          drawFrame();
        });
      };

      const redraw = () => {
        setCanvasSize();
        drawFrame();
      };

      redrawCallbacks.add(redraw);
      redraw();

      const tween = gsap.to(state, {
        frame: frameCount - 1,
        snap: 'frame',
        ease: 'none',
        onUpdate: requestDrawFrame,
        scrollTrigger: {
          trigger,
          start: 'top top',
          end: `+=${scrollDistance}`,
          scrub: mode === 'mobile' ? 0.45 : true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const handleResize = () => {
        redraw();
        ScrollTrigger.refresh();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        redrawCallbacks.delete(redraw);
        if (animationFrameId !== null) {
          window.cancelAnimationFrame(animationFrameId);
        }
        tween.kill();
        window.removeEventListener('resize', handleResize);
      };
    };

    const media = gsap.matchMedia();

    media.add('(min-width: 1024px)', () => {
      const section = desktopSectionRef.current;
      const visual = desktopVisualRef.current;
      const canvas = desktopCanvasRef.current;

      if (!section || !visual || !canvas) return undefined;

      return setupSequence({
        trigger: section,
        visual,
        canvas,
        mode: 'desktop',
        scrollDistance: 1800,
      });
    });

    media.add('(max-width: 1023px)', () => {
      const trigger = mobilePinRef.current;
      const visual = mobileVisualRef.current;
      const canvas = mobileCanvasRef.current;

      if (!trigger || !visual || !canvas) return undefined;

      return setupSequence({
        trigger,
        visual,
        canvas,
        mode: 'mobile',
        scrollDistance: 1500,
      });
    });

    return () => {
      media.revert();
      redrawCallbacks.clear();
    };
  }, []);

  const renderAnnouncementContent = () => (
    <>
      <div>
        <GradientTag
          text={tagText}
          className="inline-block"
          gradientFrom="#20C997"
          gradientTo="#A1DF0A"
        />
      </div>

      <div className="mt-6">
        <GradientTitle
          part1={titlePart1}
          part2={titlePart2}
          part1Color="dark-green"
          size="custom"
          className="font-bold text-[28px] md:text-[40px] lg:text-[50px]"
          style={{ lineHeight: '130%' }}
        />
      </div>

      <p
        className="text-gray-700 mt-6 max-w-2xl text-[14px] md:text-[16px] lg:text-[16px] leading-[1.6] lg:leading-[35px] text-justify"
        style={{ fontWeight: 400 }}
      >
        {description}
      </p>

      {cta && (
        <div className="pt-2 mt-6">
          {cta.linkType === 'internal' ? (
            <Link href={href}>
              <Button
                variant="primary"
                size="sm"
              >
                {cta.label}
              </Button>
            </Link>
          ) : (
            <a
              href={href}
              target={cta.openInNewTab ? '_blank' : '_self'}
              rel={cta.openInNewTab ? 'noopener noreferrer' : undefined}
            >
              <Button
                variant="primary"
                size="sm"
                className="!w-[150px] !h-[48px] md:!w-[178px] md:!h-[56px] !rounded-[30px] !text-sm md:!text-base"
              >
                {cta.label}
              </Button>
            </a>
          )}
        </div>
      )}
    </>
  );

  return (
    <>
      <section
        ref={desktopSectionRef}
        className="relative hidden lg:block overflow-hidden h-screen"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/Bgimg5.jpg"
            alt="Rubber announcement background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-white/25" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-8 xl:px-16">
          <div className="grid grid-cols-2 items-center h-screen">
            <div
              ref={desktopVisualRef}
              className="relative h-[75vh] w-full"
            >
              <canvas
                ref={desktopCanvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
            </div>

            <div className="pl-10 xl:pl-16">
              {renderAnnouncementContent()}
            </div>
          </div>
        </div>
      </section>

      <section className="relative lg:hidden overflow-hidden bg-white">
        <div
          ref={mobilePinRef}
          className="relative h-screen overflow-hidden"
        >
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/Bgimg5.jpg"
              alt="Rubber announcement background"
              fill
              className="object-cover object-[35%_center]"
              priority
            />
            <div className="absolute inset-0 bg-white/25" />
          </div>

          <div
            ref={mobileVisualRef}
            className="relative z-10 h-screen w-full"
          >
            <canvas
              ref={mobileCanvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />
          </div>
        </div>

        <div className="px-4 md:px-8 pt-10 md:pt-16 pb-12 md:pb-20">
          <div className="mx-auto max-w-2xl">
            {renderAnnouncementContent()}
          </div>
        </div>
      </section>
    </>
  );
}
