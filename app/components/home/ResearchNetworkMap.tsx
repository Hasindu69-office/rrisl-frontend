'use client';

import React from 'react';
import Image from 'next/image';
import LocationMarker from './LocationMarker';
import GradientTag from '@/app/components/ui/GradientTag';
import GradientTitle from '@/app/components/ui/GradientTitle';

interface LocationMarker {
  id: string;
  label: string;
  position: { x: number; y: number };
}

interface ResearchNetworkMapProps {
  buttonText: string;
  titlePart1: string;
  titlePart2: string;
  mapImage: string;
  locations: LocationMarker[];
  activeLocationId: string | null;
  onLocationHover: (id: string) => void;
  onLocationLeave?: () => void;
  className?: string;
}

/**
 * ResearchNetworkMap Component
 * Interactive map with location markers that trigger hover events
 * Features: "Our Research" button, title, and clickable map markers
 */
export default function ResearchNetworkMap({
  buttonText,
  titlePart1,
  titlePart2,
  mapImage,
  locations,
  activeLocationId,
  onLocationHover,
  onLocationLeave,
  className = '',
}: ResearchNetworkMapProps) {
  return (
    <div className={`flex flex-col gap-4 md:gap-6 items-center lg:items-end w-full max-w-[800px] ${className}`}>
      {/* Our Research Button */}
      <div className="lg:text-right">
        <GradientTag
          text={buttonText}
          className="inline-block"
          gradientFrom="#20C997"
          gradientTo="#A1DF0A"
          backgroundColor="#FFFFFF"
          textColor="#2E7D32"
        />
      </div>

      {/* Title */}
      <div className="mb-4 lg:mb-6">
        <GradientTitle
          part1={titlePart1}
          part2={titlePart2}
          part1Color="white"
          size="custom"
          align="center"
          className="font-bold text-[28px] md:text-[40px] lg:text-[50px] lg:text-right"
          style={{ lineHeight: '130%' }}
        />
      </div>

      {/* Map Container - Responsive sizing */}
      <div className="relative w-full max-w-[400px] md:max-w-[500px] lg:w-[635px] aspect-[635/725] md:h-auto lg:h-[725px] lg:translate-x-0 -translate-x-[19%]">
        {/* Map Image */}
        <div className="relative w-full h-full lg:w-[80%] rounded-lg" style={{ overflow: 'visible' }}>
          <div
            className="absolute"
            style={{
              top: '-10%',
              left: '-1%',
              width: '140%',
              height: '120%',
            }}
          >
            <Image
              src={mapImage}
              alt="Sri Lanka Research Network Map"
              fill
              className="object-contain"
              priority
              quality={90}
            />
          </div>
        </div>

        {/* Location Markers */}
        <div className="absolute inset-0">
          {locations.map((location) => (
            <LocationMarker
              key={location.id}
              id={location.id}
              label={location.label}
              position={location.position}
              isActive={activeLocationId === location.id}
              onMouseEnter={onLocationHover}
              onMouseLeave={onLocationLeave}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

