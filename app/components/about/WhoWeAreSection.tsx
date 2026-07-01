'use client';

import React, { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';

gsap.registerPlugin(ScrollTrigger);

interface WhoWeAreSectionProps {
  tag: string;
  title: string;
  highlightedText: string;
  description: string;
  outlineLines: string[];
}

const WhoWeAreSection = ({
  tag,
  title,
  highlightedText,
  description,
  outlineLines,
}: WhoWeAreSectionProps) => {
  const [firstOutlineLine, secondOutlineLine] = outlineLines;
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const outlineRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (
      typeof window === 'undefined' ||
      !sectionRef.current ||
      !contentRef.current ||
      !outlineRef.current
    ) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const sectionNode = sectionRef.current;
    const contentNode = contentRef.current;
    const outlineNode = outlineRef.current;

    const context = gsap.context(() => {
      gsap.set(contentNode, {
        autoAlpha: 0,
        x: -44,
      });
      gsap.set(outlineNode, {
        autoAlpha: 0,
        x: 52,
      });

      ScrollTrigger.create({
        trigger: sectionNode,
        start: 'top 92%',
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
        start: 'top 68%',
        once: true,
        onEnter: () => {
          gsap.to(outlineNode, {
            autoAlpha: 0.82,
            x: 0,
            duration: 1.1,
            ease: 'power3.out',
            clearProps: 'transform',
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
      className="relative w-full min-h-[600px] md:min-h-[700px] lg:min-h-[1280px] overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/Aboutusimg1.png"
          alt="Who We Are background"
          fill
          className="object-cover object-top"
          priority
        />
        {/* Mobile/Tablet Gradient Overlay */}
        <div
          className="absolute inset-0 z-[1] lg:hidden"
          style={{
            background: 'linear-gradient(to top, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.07) 100%)'
          }}
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10 h-full">
        {/* Main content wrapper with relative positioning for elements */}
        <div className="relative w-full min-h-[600px] md:min-h-[700px] lg:min-h-[850px] pt-12 md:pt-20 lg:pt-24">

          {/* Left Column: Content (Top Left) */}
          <div ref={contentRef} className="flex flex-col gap-6 max-w-2xl items-start relative z-20">
            <GradientTag text={tag} />

            <GradientTitle
              part1={title}
              part2={highlightedText}
              size="lg"
              lineBreak={true}
              style={{ lineHeight: '130%' }}
            />

            <p className="text-[#000000] text-lg md:text-xl leading-relaxed max-w-xl text-justify">
              {description}
            </p>
          </div>

          {/* Right Column: Outline Text (Slightly bottom right) */}
          <div
            ref={outlineRef}
            className="absolute top-[55%] md:top-[40%] lg:top-[40%] right-0 md:right-4 lg:right-[-2%] z-10 select-none pointer-events-none"
          >
            <div className="transform translate-y-12">
              <svg
                width="900"
                height="450"
                viewBox="0 0 900 450"
                className="w-[300px] md:w-[500px] lg:w-[600px] h-auto"
              >
                <text
                  x="100%"
                  y="30%"
                  textAnchor="end"
                  dominantBaseline="middle"
                  fill="transparent"
                  stroke="#1047203D"
                  strokeWidth="1"
                  fontSize="90"
                  fontWeight="bold"
                  className="font-sans"
                >
                  {firstOutlineLine}
                </text>
                {secondOutlineLine ? (
                  <text
                    x="100%"
                    y="55%"
                    textAnchor="end"
                    dominantBaseline="middle"
                    fill="transparent"
                    stroke="#1047203D"
                    strokeWidth="1"
                    fontSize="90"
                    fontWeight="bold"
                    className="font-sans"
                  >
                    {secondOutlineLine}
                  </text>
                ) : null}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAreSection;
