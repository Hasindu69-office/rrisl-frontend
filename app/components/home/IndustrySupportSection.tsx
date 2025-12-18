'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import GradientTag from '@/app/components/ui/GradientTag';
import ServiceCard from './ServiceCard';
import GradientTitle from '@/app/components/ui/GradientTitle';

/**
 * Industry Support Section Component
 * Features a dark background with plant image, "What We Do" tag, and title
 */
export default function IndustrySupportSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);

  // Detect when the section scrolls into view
  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasEnteredView(true);
            observer.disconnect();
          }
        });
      },
      {
        root: null,
        threshold: 0.2,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const getCardAnimationStyle = (side: 'left' | 'right', order: number) => {
    const delay = 0.5 * order;
    const initialOffset = side === 'left' ? '-40px' : '40px';

    return {
      opacity: hasEnteredView ? 1 : 0,
      transform: hasEnteredView ? 'translateX(0)' : `translateX(${initialOffset})`,
      transition: 'opacity 600ms ease-out, transform 600ms ease-out',
      transitionDelay: `${delay}s`,
    } as React.CSSProperties;
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '1200px' }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/section3_bg.jpg"
          alt="Dark soil background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Optional dark overlay for better text contrast if needed */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 h-full">
        <div className="relative h-full flex flex-col items-center">
          {/* What We Do Tag */}
          <div style={{ marginTop: '75px', marginBottom: '14px' }}>
            <GradientTag 
              text="What We Do"
              className="inline-block"
              gradientFrom="#20C997"
              gradientTo="#A1DF0A"
              backgroundColor="transparent"
              textColor="white"
            />
          </div>

          {/* Title */}
          <div className="mb-16 md:mb-20">
            <GradientTitle
              part1="How We"
              part2="Support the Industry"
              part1Color="white"
              size="custom"
              customSize="50px"
              align="center"
              className="font-bold"
              style={{ lineHeight: '130%' }}
            />
          </div>

          {/* Central Plant Image - Absolutely positioned to center in section */}
          <div 
            className="absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '1080px',
              height: '1080px',
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src="/images/section3_plant.png"
                alt="Growing plant representing industry support"
                fill
                className="object-contain"
                priority
                quality={90}
              />
            </div>
          </div>

          {/* Service Cards - Positioned around the plant */}
          {/* Top Left - Research & Innovation (White) */}
          <div
            className="absolute left-[25%] top-[25%] z-30"
            style={getCardAnimationStyle('left', 0)}
          >
            <ServiceCard
              title="Research & Innovation"
              description="Advancing rubber science through multidisciplinary research."
              variant="white"
            />
          </div>

          {/* Middle Left - Training & Development (Green) */}
          <div
            className="absolute left-[20%] top-[50%] z-30"
            style={getCardAnimationStyle('left', 1)}
          >
            <ServiceCard
              title="Training & Development"
              description="Workshops and programs to boost industry knowledge."
              variant="green"
            />
          </div>

          {/* Bottom Left - Statistics & Market Insights (Green) */}
          <div
            className="absolute left-[20%] top-[77%] z-30"
            style={getCardAnimationStyle('left', 2)}
          >
            <ServiceCard
              title="Statistics & Market Insights"
              description="Trusted rubber production data and industry analysis."
              variant="green"
            />
          </div>

          {/* Top Right - Field Advisory Services (Green) */}
          <div
            className="absolute right-[22%] top-[30%] z-30"
            style={getCardAnimationStyle('right', 0)}
          >
            <ServiceCard
              title="Field Advisory Services"
              description="Providing expert, on-ground support for rubber growers."
              variant="green"
            />
          </div>

          {/* Middle Right - Laboratory Services (Green) */}
          <div
            className="absolute right-[18%] top-[58%] z-30"
            style={getCardAnimationStyle('right', 1)}
          >
            <ServiceCard
              title="Laboratory Services"
              description="Soil testing, plant diagnostics, and quality analysis."
              variant="green"
            />
          </div>

          {/* Bottom Right - Rubber Clone Development (Green) */}
          <div
            className="absolute right-[30%] top-[75%] z-30"
            style={getCardAnimationStyle('right', 2)}
          >
            <ServiceCard
              title="Rubber Clone Development"
              description="High-performing clones for sustainable cultivation."
              variant="green"
            />
          </div>

          {/* Vertical "What We Do" Text - Right side, rotated -90 degrees (reads bottom to top) */}
          <div 
            className="absolute top-1/2 z-20"
            style={{
              right: '-300px',
              transform: 'translateY(-50%) rotate(-90deg)',
              transformOrigin: 'center',
            }}
          >
            <svg
              width="400"
              height="600"
              viewBox="0 0 400 600"
              style={{
                overflow: 'visible',
              }}
            >
              <defs>
                <linearGradient id="textGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#20C997" />
                  <stop offset="100%" stopColor="#A1DF0A" />
                </linearGradient>
              </defs>
              <text
                x="200"
                y="300"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="transparent"
                stroke="url(#textGradient)"
                strokeWidth="1"
                fontSize="100"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                What We Do
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

