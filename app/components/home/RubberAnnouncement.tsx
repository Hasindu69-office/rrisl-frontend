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
  const sectionRef = useRef<HTMLElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const searchParams = useSearchParams();
  const currentLocale = searchParams.get('locale') || 'en';
  const href = cta?.linkType === 'internal' && cta.url
    ? addLocaleToUrl(cta.url, currentLocale)
    : cta?.url || '#';

  useEffect(() => {
    const section = sectionRef.current;
    const visual = visualRef.current;
    const canvas = canvasRef.current;

    if (!section || !visual || !canvas) return;

    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    if (!mediaQuery.matches) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // IMPORTANT:
    // Change these to match your real files
    const frameCount = 278;

    const getFrameSrc = (index: number) => {
      const frameNumber = String(index).padStart(5, '0');
      return `/animations/RubberPlant_${frameNumber}.webp`;
    };

    const images: HTMLImageElement[] = [];
    const state = { frame: 0 };

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

      // Make plant large and anchored to bottom-left
      const scale = Math.min(w / img.width, h / img.height) * 1.6;
      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;

      const x = -20;
      const y = h - drawHeight + 60;

      context.drawImage(img, x, y, drawWidth, drawHeight);
    };

    let firstLoaded = false;

    for (let i = 0; i < frameCount; i++) {
      const img = new window.Image();
      img.src = getFrameSrc(i);
      img.onload = () => {
        if (!firstLoaded) {
          firstLoaded = true;
          setCanvasSize();
          drawFrame();
        }
      };
      img.onerror = () => {
        console.error('Failed to load frame:', img.src);
      };
      images.push(img);
    }

    const tween = gsap.to(state, {
      frame: frameCount - 1,
      snap: 'frame',
      ease: 'none',
      onUpdate: drawFrame,
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=1800',
        scrub: true,
        pin: true,
        anticipatePin: 1,
      },
    });

    const handleResize = () => {
      setCanvasSize();
      drawFrame();
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      tween.kill();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative hidden lg:block overflow-hidden h-screen"
    >
      {/* Full section background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/Bgimg5.jpg"
          alt="Rubber announcement background"
          fill
          className="object-cover"
          priority
        />
        {/* soft white overlay for readability */}
        <div className="absolute inset-0 bg-white/25" />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-8 xl:px-16">
        <div className="grid grid-cols-2 items-center h-screen">
          {/* Left visual area */}
          <div
            ref={visualRef}
            className="relative h-[75vh] w-full"
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />
          </div>

          {/* Right content area */}
          <div className="pl-10 xl:pl-16">
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
                className="font-bold text-[50px]"
                style={{ lineHeight: '130%' }}
              />
            </div>

            <p
              className="text-gray-700 mt-6 max-w-2xl text-[16px] leading-[35px] text-justify"
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
                      className="!w-[178px] !h-[56px] !rounded-[30px] !text-base"
                    >
                      {cta.label}
                    </Button>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
