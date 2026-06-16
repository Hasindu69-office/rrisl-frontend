'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';
import ResearchStationCard from './ResearchStationCard';
import ResearchNetworkMap from './ResearchNetworkMap';
import type { ResearchNetworkSectionViewModel } from '@/app/lib/home/researchNetworkSection';

type ViewportKind = 'mobile' | 'tablet' | 'desktop';

/**
 * ResearchNetworkSection Component
 * Interactive section with research station details on left and map on right
 * Hovering over map markers changes the left panel content
 */
interface ResearchNetworkSectionProps {
  section: ResearchNetworkSectionViewModel;
}

export default function ResearchNetworkSection({
  section,
}: ResearchNetworkSectionProps) {
  const hasLocalhostBackground = isLocalhostAssetUrl(section.backgroundImage);
  const getViewportKind = (): ViewportKind => {
    if (typeof window === 'undefined') {
      return 'desktop';
    }

    if (window.innerWidth < 768) {
      return 'mobile';
    }

    if (window.innerWidth < 1280) {
      return 'tablet';
    }

    return 'desktop';
  };

  const [viewportKind, setViewportKind] = useState<ViewportKind>(getViewportKind);
  const [useFallbackBackground, setUseFallbackBackground] = useState(() => {
    if (typeof window !== 'undefined' && hasLocalhostBackground) {
      const hostname = window.location.hostname;
      return hostname !== 'localhost' && hostname !== '127.0.0.1';
    }

    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setViewportKind(getViewportKind());
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const locations = section.locations.map((station) => ({
    id: station.id,
    label: station.label,
    position:
      viewportKind === 'mobile'
        ? station.positions.mobile
        : viewportKind === 'tablet'
          ? station.positions.tablet
          : station.positions.desktop,
  }));

  // State management
  const [activeStationId, setActiveStationId] = useState<string | null>(
    locations[0]?.id || null
  );

  // Find active station data
  const activeStation =
    section.locations.find((station) => station.id === activeStationId) ||
    section.locations[0];

  if (!activeStation) {
    return null;
  }

  const handleLocationHover = (id: string) => {
    setActiveStationId(id);
  };

  const handleLocationLeave = () => {
    // Keep the current station active until another is hovered
    // Or reset to default: setActiveStationId(locations[0]?.id || null);
  };

  return (
    <section className="relative w-full overflow-hidden py-12 md:py-24 bg-white">
      {/* Background Image - Behind content with overlay */}
      <div className="absolute inset-0 z-0">
        {useFallbackBackground ? (
          <img
            src={section.backgroundImage}
            alt={section.backgroundImageAlt}
            className="absolute inset-0 h-full w-full object-cover object-center"
            onError={() => {
              console.error(
                'Failed to load research network section background image:',
                section.backgroundImage
              );
            }}
          />
        ) : (
          <Image
            src={section.backgroundImage}
            alt={section.backgroundImageAlt}
            fill
            className="object-cover object-center"
            priority
            quality={90}
            unoptimized={hasLocalhostBackground}
            onError={() => {
              console.error(
                'Next.js Image failed for research network section background, falling back to img:',
                section.backgroundImage
              );
              setUseFallbackBackground(true);
            }}
          />
        )}
        {/* Dark green -> black vertical gradient overlay (using RGBA) */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(15, 63, 29, 0.6), rgba(0, 0, 0, 0.6))',
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 xl:px-8 mt-10 md:mt-20 mb-[200px] md:mb-[150px] lg:mb-[175px] xl:mb-[0px]">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-12 xl:gap-16 items-start">
          {/* Left Side - Research Station Card */}
          <div className="w-full order-2 xl:order-1">
            <ResearchStationCard
              key={activeStationId} // Key prop ensures smooth transition
              stationData={activeStation}
            />
          </div>

          {/* Right Side - Map */}
          <div className="w-full flex justify-center xl:justify-start order-1 xl:order-2">
            <ResearchNetworkMap
              buttonText={section.buttonText}
              titlePart1={section.titlePart1}
              titlePart2={section.titlePart2}
              mapImage={section.mapImage}
              locations={locations}
              activeLocationId={activeStationId}
              onLocationHover={handleLocationHover}
              onLocationLeave={handleLocationLeave}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

