'use client';

import React from 'react';
import GradientTag from '@/app/components/ui/GradientTag';
import GradientTitle from '@/app/components/ui/GradientTitle';

/**
 * Data Insights Section Component
 * Features a dark green background with gradient tag and title
 * Placeholder section for future data visualization widgets
 */
export default function DataInsightsSection() {
  return (
    <section 
      className="relative w-full overflow-hidden flex items-center justify-center pb-16 md:pb-24"
      style={{ 
        height: '1080px',
        backgroundColor: '#042012',
      }}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* Header Section - Centered */}
        <div className="text-center">
          {/* Our Library Tag */}
          <div className="mb-6">
            <GradientTag 
              text="Our Library"
              className="inline-block"
              gradientFrom="#20C997"
              gradientTo="#A1DF0A"
              backgroundColor="#FFFFFF"
              textColor="#2E7D32"
            />
          </div>

          {/* Title */}
          <GradientTitle
            part1="Real-Time Data &"
            part2="Insights"
            part1Color="white"
            size="lg"
            align="center"
            className="font-bold"
            style={{ lineHeight: '130%' }}
          />
        </div>
      </div>
    </section>
  );
}

