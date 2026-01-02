'use client';

import React from 'react';

interface StatisticItem {
  percentage: string;
  label: string;
}

interface HeroStatisticsProps {
  statistics?: StatisticItem[];
}

// Default static data
const defaultStatistics: StatisticItem[] = [
  { percentage: '89%', label: 'Your Insight' },
  { percentage: '89%', label: 'Your Insight' },
  { percentage: '89%', label: 'Your Insight' },
];

export default function HeroStatistics({ statistics = defaultStatistics }: HeroStatisticsProps) {
  return (
    <div className="flex items-center gap-4 md:gap-8 lg:gap-16">
      {statistics.map((stat, index) => (
        <div key={index} className="flex flex-col items-start">
          {/* Percentage Text */}
          <div 
            className="text-white font-bold text-[28px] md:text-[40px] lg:text-[70px]"
            style={{ 
              lineHeight: '128%'
            }}
          >
            {stat.percentage}
          </div>
          
          {/* Label Text */}
          <div 
            className="text-white text-[12px] md:text-[16px] lg:text-[25px]"
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




