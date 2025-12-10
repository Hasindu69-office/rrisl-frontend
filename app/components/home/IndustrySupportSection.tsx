'use client';

import React from 'react';
import Image from 'next/image';
import GradientTag from '@/app/components/ui/GradientTag';

/**
 * Industry Support Section Component
 * Features a dark background with plant image, "What We Do" tag, and title
 */
export default function IndustrySupportSection() {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: '1200px' }}>
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
          <h2 
            className="text-center mb-16 md:mb-20"
            style={{
              fontSize: '50px',
              lineHeight: '130%',
              fontWeight: 'bold',
            }}
          >
            <span className="text-white">How We </span>
            <span className="bg-gradient-to-r from-[#20C997] to-[#A1DF0A] bg-clip-text text-transparent">
              Support <br /> the Industry
            </span>
          </h2>

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
        </div>
      </div>
    </section>
  );
}

