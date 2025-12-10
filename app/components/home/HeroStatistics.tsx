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
    <div className="flex items-center gap-8 md:gap-12 lg:gap-16">
      {statistics.map((stat, index) => (
        <div key={index} className="flex flex-col items-start">
          {/* Percentage Text */}
          <div 
            className="text-white font-bold"
            style={{ 
              fontSize: '70px',
              lineHeight: '128%'
            }}
          >
            {stat.percentage}
          </div>
          
          {/* Label Text */}
          <div 
            className="text-white"
            style={{ 
              fontSize: '25px',
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




