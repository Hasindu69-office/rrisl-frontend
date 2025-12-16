'use client';

import React from 'react';
import Image from 'next/image';
import LocationMarker from './LocationMarker';
import GradientTag from '@/app/components/ui/GradientTag';

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
    <div className={`flex flex-col gap-6 items-end w-full max-w-[800px] ${className}`}>
      {/* Our Research Button */}
      <div className="text-right">
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
      <h2
        className="mb-6 text-right"
        style={{
          fontSize: '50px',
          lineHeight: '130%',
          fontWeight: 'bold',
        }}
      >
        <span className="text-white">{titlePart1}</span>
        <br />
        <span className="bg-gradient-to-r from-[#20C997] to-[#A1DF0A] bg-clip-text text-transparent">
          {titlePart2}
        </span>
      </h2>

      {/* Map Container */}
      <div className="relative" style={{ width: '635px', height: '725px' }}>
        {/* Map Image */}
        <div className="relative w-full h-full rounded-lg" style={{ overflow: 'visible' }}>
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
  );
}

