'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ResearchStationCard from './ResearchStationCard';
import ResearchNetworkMap from './ResearchNetworkMap';

interface ResearchStationData {
  id: string;
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

interface LocationMarker {
  id: string;
  label: string;
  position: { x: number; y: number };
}

/**
 * ResearchNetworkSection Component
 * Interactive section with research station details on left and map on right
 * Hovering over map markers changes the left panel content
 */
export default function ResearchNetworkSection() {
  // Sample data for research stations
  const researchStations: ResearchStationData[] = [
    {
      id: 'ratmalana',
      images: {
        leftVertical: '/images/section7_img2.jpg',
        topRight: '/images/section7_img1.jpg',
        bottomRight: '/images/section7_img3.png',
        rightVertical: '/images/section7_img4.jpg',
      },
      title: 'Ratmalana research station',
      description:
        'Our researchers are developing advanced planting materials, disease-resistant clones, and modern agronomic techniques to increase field productivity while minimizing environmental impact.',
      stats: [
        { value: '48,000', label: 'All Researches' },
        { value: '48,000', label: 'On-going' },
        { value: '48,000', label: 'Output' },
        { value: '48,000', label: 'Output' },
        { value: '48,000', label: 'Output' },
      ],
      actions: [
        'Field Experimentation & Trials',
        'Laboratory Facilities',
        'Laboratory Facilities',
        'Field Experimentation & Trials',
      ],
    },
    {
      id: 'location2',
      images: {
        leftVertical: '/images/section7_img2.jpg',
        topRight: '/images/section7_img1.jpg',
        bottomRight: '/images/section7_img3.png',
        rightVertical: '/images/section7_img4.jpg',
      },
      title: 'Second research station',
      description:
        'This research station focuses on advanced biotechnology and genetic research to develop superior rubber clones with enhanced yield and disease resistance.',
      stats: [
        { value: '35,000', label: 'All Researches' },
        { value: '12,000', label: 'On-going' },
        { value: '23,000', label: 'Output' },
        { value: '15,000', label: 'Output' },
        { value: '8,000', label: 'Output' },
      ],
      actions: [
        'Genetic Research',
        'Biotechnology Lab',
        'Field Testing',
        'Data Analysis',
      ],
    },
    {
      id: 'location3',
      images: {
        leftVertical: '/images/section7_img2.jpg',
        topRight: '/images/section7_img1.jpg',
        bottomRight: '/images/section7_img3.png',
        rightVertical: '/images/section7_img4.jpg',
      },
      title: 'Third research station',
      description:
        'Dedicated to sustainable farming practices and environmental conservation, this station develops eco-friendly cultivation methods.',
      stats: [
        { value: '28,000', label: 'All Researches' },
        { value: '10,000', label: 'On-going' },
        { value: '18,000', label: 'Output' },
        { value: '12,000', label: 'Output' },
        { value: '6,000', label: 'Output' },
      ],
      actions: [
        'Sustainability Research',
        'Environmental Studies',
        'Eco-friendly Methods',
        'Conservation Programs',
      ],
    },
  ];

  // Location markers on the map
  const locations: LocationMarker[] = [
    {
      id: 'ratmalana',
      label: 'Rathmalana',
      position: { x: 45, y: 60 }, // Adjust these percentages based on actual map positions
    },
    {
      id: 'location2',
      label: 'Research Station 2',
      position: { x: 50, y: 70 },
    },
    {
      id: 'location3',
      label: 'Research Station 3',
      position: { x: 55, y: 65 },
    },
  ];

  // State management
  const [activeStationId, setActiveStationId] = useState<string | null>(
    locations[0]?.id || null
  );

  // Find active station data
  const activeStation =
    researchStations.find((s) => s.id === activeStationId) || researchStations[0];

  const handleLocationHover = (id: string) => {
    setActiveStationId(id);
  };

  const handleLocationLeave = () => {
    // Keep the current station active until another is hovered
    // Or reset to default: setActiveStationId(locations[0]?.id || null);
  };

  return (
    <section className="relative w-full overflow-hidden py-16 md:py-24 bg-white">
      {/* Background Image - Behind content with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/section7_bg.png"
          alt="Forest background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Dark green semi-transparent overlay */}
        <div className="absolute inset-0 bg-[#0F3F1D]/70" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8" style={{ marginTop: '206px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Side - Research Station Card */}
          <div className="w-full">
            <ResearchStationCard
              key={activeStationId} // Key prop ensures smooth transition
              stationData={activeStation}
            />
          </div>

          {/* Right Side - Map */}
          <div className="w-full flex justify-center lg:justify-start">
            <ResearchNetworkMap
              buttonText="Our Research"
              titlePart1="Explore Our"
              titlePart2="Research Network"
              mapImage="/images/section7_SLmap.png"
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

