'use client';

import React from 'react';
import GradientTag from '@/app/components/ui/GradientTag';

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
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            style={{
              lineHeight: '130%',
            }}
          >
            <span className="text-white">Real-Time Data &</span>
            <br />
            <span className="bg-gradient-to-r from-[#20C997] to-[#A1DF0A] bg-clip-text text-transparent">
              Insights
            </span>
          </h2>
        </div>
      </div>
    </section>
  );
}

