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
    <div className={`flex flex-col gap-4 md:gap-6 items-center xl:items-end w-full max-w-[800px] ${className}`}>
      {/* Our Research Button */}
      <div className="xl:text-right">
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
          className="font-bold text-[28px] md:text-[40px] xl:text-[50px] xl:text-right"
          style={{ lineHeight: '130%' }}
        />
      </div>

      {/* Map Container - Responsive sizing */}
      <div className="relative w-full max-w-[400px] md:max-w-[500px] xl:w-[635px] aspect-[635/725] md:h-auto xl:h-[725px]">
        {/* Map Image */}
        <div className="relative w-full h-full rounded-lg overflow-hidden">
          <Image
            src={mapImage}
            alt="Sri Lanka Research Network Map"
            fill
            className="object-contain object-center"
            priority
            quality={90}
          />
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

