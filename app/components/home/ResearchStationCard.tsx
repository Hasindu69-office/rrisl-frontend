'use client';

import React from 'react';
import Image from 'next/image';
import StatBox from './StatBox';

// Gradient-stroke MapPinCheck icon (provided SVG)
function MapPinCheckGradientIcon() {
  return (
    <svg
      width="41"
      height="41"
      viewBox="0 0 41 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="pinGradientProvided" x1="6.83334" y1="20.4996" x2="37.5833" y2="20.4996" gradientUnits="userSpaceOnUse">
          <stop offset="0.0288462" stopColor="#20C997" />
          <stop offset="1" stopColor="#A1DF0A" />
        </linearGradient>
      </defs>
      <path
        d="M33.1929 22.0971C33.8028 20.4452 34.1667 18.7573 34.1667 17.0832C34.1667 13.4585 32.7268 9.98238 30.1638 7.41938C27.6008 4.85638 24.1246 3.4165 20.5 3.4165C16.8754 3.4165 13.3992 4.85638 10.8362 7.41938C8.27322 9.98238 6.83334 13.4585 6.83334 17.0832C6.83334 25.6129 16.2958 34.4962 19.4733 37.2398C19.7693 37.4624 20.1296 37.5827 20.5 37.5827C20.8704 37.5827 21.2307 37.4624 21.5267 37.2398C21.9967 36.8331 22.4597 36.4185 22.9156 35.9961M27.3333 30.7498L30.75 34.1665L37.5833 27.3332M25.625 17.0832C25.625 19.9136 23.3305 22.2082 20.5 22.2082C17.6696 22.2082 15.375 19.9136 15.375 17.0832C15.375 14.2527 17.6696 11.9582 20.5 11.9582C23.3305 11.9582 25.625 14.2527 25.625 17.0832Z"
        stroke="url(#pinGradientProvided)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface ResearchStationData {
  images: {
    leftVertical: string;
    topRight: string;
    bottomRight: string;
    rightVertical: string;
  };
  title: string;
  description: string;
  stats: Array<{
    value: string;
    label: string;
  }>;
  actions: string[];
}

interface ResearchStationCardProps {
  stationData: ResearchStationData;
  className?: string;
}

/**
 * ResearchStationCard Component
 * Displays research station information with images, stats, and actions
 * Features smooth transitions when data changes
 */
export default function ResearchStationCard({
  stationData,
  className = '',
}: ResearchStationCardProps) {
  return (
    <div
      className={`relative rounded-2xl p-6 md:p-8 ${className}`}
      style={{
        width: '925px',
        height: '990px',
        transition: 'opacity 0.4s ease-in-out',
        background: 'transparent', // IMPORTANT: keep fill transparent
      }}
    >
      {/* Gradient Border (only border visible) */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          padding: '2px', // border thickness
          background: 'linear-gradient(135deg, #20C997, #A1DF0A)',
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          borderRadius: '16px',
        }}
      />

      {/* Image Grid - Top Section */}
      <div className="relative mb-[60px]" style={{ minHeight: '350px' }}>
        {/* Left Vertical Image - Positioned absolutely */}
        <div
          key={`left-${stationData.images.leftVertical}`}
          className="absolute overflow-hidden"
          style={{
            left: '85px',
            top: '40px',
            width: '206px',
            height: '310px',
            borderRadius: '30px',
            animation: 'fadeIn 0.5s ease-in-out',
          }}
        >
          <Image
            src={stationData.images.leftVertical}
            alt={`${stationData.title} left vertical image`}
            width={206}
            height={310}
            className="object-cover"
            style={{
              borderRadius: '30px',
              width: '100%',
              height: '100%',
            }}
          />
        </div>

        {/* Middle Column - Two stacked images */}
        <div
          className="absolute flex flex-col"
          style={{ left: '301px', top: '47px', gap: '25px' }}
        >
          {/* Top Right Image */}
          <div
            key={`top-${stationData.images.topRight}`}
            className="relative overflow-hidden"
            style={{
              borderRadius: '30px',
              width: '281px',
              height: '139px',
              animation: 'fadeIn 0.5s ease-in-out',
            }}
          >
            <Image
              src={stationData.images.topRight}
              alt={`${stationData.title} top right image`}
              width={281}
              height={139}
              className="object-cover"
              style={{
                borderRadius: '30px',
                width: '100%',
                height: '100%',
              }}
            />
          </div>

          {/* Bottom Right Image */}
          <div
            key={`bottom-${stationData.images.bottomRight}`}
            className="relative overflow-hidden"
            style={{
              borderRadius: '30px',
              width: '281px',
              height: '139px',
              animation: 'fadeIn 0.5s ease-in-out',
            }}
          >
            <Image
              src={stationData.images.bottomRight}
              alt={`${stationData.title} bottom right image`}
              width={281}
              height={139}
              className="object-cover"
              style={{
                borderRadius: '30px',
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        </div>

        {/* Right Vertical Image */}
        <div
          key={`right-${stationData.images.rightVertical}`}
          className="absolute overflow-hidden"
          style={{
            left: '592px',
            top: '40px',
            width: '206px',
            height: '310px',
            borderRadius: '30px',
            animation: 'fadeIn 0.5s ease-in-out',
          }}
        >
          <Image
            src={stationData.images.rightVertical}
            alt={`${stationData.title} right vertical image`}
            width={206}
            height={310}
            className="object-cover"
            style={{
              borderRadius: '30px',
              width: '100%',
              height: '100%',
            }}
          />
        </div>
      </div>

      <div style={{ paddingLeft: '50px' }}>
        {/* Title with Icon */}
        <div className="flex items-center gap-3 mb-4">
          <MapPinCheckGradientIcon />
          <h3
            className="text-white font-semibold"
            style={{
              fontSize: '30px',
              lineHeight: '128%',
            }}
          >
            {stationData.title}
          </h3>
        </div>

        {/* Description */}
        <p
          className="text-white/80 mb-6"
          style={{
            fontSize: '18px',
            lineHeight: '35px',
            fontWeight: 400,
          }}
        >
          {stationData.description}
        </p>
      </div>

      {/* Stats Grid - 5 boxes (16px gap) */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {stationData.stats.map((stat, index) => (
          <StatBox key={index} value={stat.value} label={stat.label} />
        ))}
      </div>

      {/* Action Buttons/Labels - auto width based on text */}
      <div className="flex flex-wrap gap-[10px]" style={{ marginLeft: '20px', marginTop: '40px' }}>
        {stationData.actions.map((action, index) => (
          <div
            key={index}
            className="relative rounded-[30px] px-4 py-3 text-center transition-all duration-300 hover:bg-[#20C997]/10"
          >
            {/* Gradient Border */}
            <div
              className="pointer-events-none absolute inset-0 rounded-[30px]"
              style={{
                padding: '1.5px', // border thickness
                background: 'linear-gradient(135deg, #20C997, #A1DF0A)',
                WebkitMask:
                  'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />

            {/* Button Text */}
            <span
              className="relative text-white text-sm font-medium"
              style={{
                fontSize: '14px',
                lineHeight: '130%',
              }}
            >
              {action}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
