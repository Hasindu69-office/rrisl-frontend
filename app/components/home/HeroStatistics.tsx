'use client';

import React from 'react';
import type { HeroStatisticItem } from '@/app/lib/home/stats';

interface HeroStatisticsProps {
  statistics?: HeroStatisticItem[];
}

// Default static data
const defaultStatistics: HeroStatisticItem[] = [
  { percentage: '89%', label: 'Your Insight' },
  { percentage: '89%', label: 'Your Insight' },
  { percentage: '89%', label: 'Your Insight' },
];

export default function HeroStatistics({ statistics = defaultStatistics }: HeroStatisticsProps) {
  return (
    <div className="flex items-center gap-6 md:gap-8 lg:gap-12">
      {statistics.map((stat, index) => (
        <div key={index} className="flex flex-col items-start max-w-[70px] md:max-w-[90px] lg:max-w-[150px]">
          {/* Percentage Text */}
          <div 
            className="text-white font-bold text-[28px] md:text-[40px] lg:text-[50px]"
            style={{ 
              lineHeight: '128%'
            }}
          >
            {stat.percentage}
          </div>
          
          {/* Label Text */}
          <div 
            className="text-white text-[12px] md:text-[16px] lg:text-[25px] whitespace-normal break-words"
            style={{ 
              lineHeight: '120%'
            }}
          >
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}




