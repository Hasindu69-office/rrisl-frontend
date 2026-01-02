'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeroAnnouncementItem } from '@/app/lib/types';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';
import { addLocaleToUrl } from '@/app/lib/locale';
import { useSearchParams } from 'next/navigation';

interface AnnouncementSliderProps {
  announcements: HeroAnnouncementItem[];
}

/**
 * Extract plain text from RichTextBlock array (for summary)
 */
function extractTextFromSummary(summary: string | null): string {
  if (!summary) return '';
  // If it's already a string, return it
  if (typeof summary === 'string') {
    // Remove HTML tags if present
    return summary.replace(/<[^>]*>/g, '').trim();
  }
  return '';
}

/**
 * Limit text to a specific number of words
 */
function limitWords(text: string, maxWords: number = 5): string {
  if (!text) return '';
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
}

/**
 * Format title to show 2 words per line, max 4 lines (8 words total)
 * If exceeds 8 words, show only first word with ellipsis
 */
function formatTitle(title: string): string {
  if (!title) return '';
  const words = title.split(/\s+/).filter(word => word.length > 0);
  
  // If more than 8 words, show only first word with ellipsis
  if (words.length > 8) {
    return words[0] + '...';
  }
  
  // Group words into pairs (2 words per line)
  const lines: string[] = [];
  for (let i = 0; i < words.length; i += 3) {
    const line = words.slice(i, i + 3).join(' ');
    lines.push(line);
  }
  
  return lines.join('\n');
}

export default function AnnouncementSlider({ announcements }: AnnouncementSliderProps) {
  const searchParams = useSearchParams();
  const currentLocale = searchParams.get('locale') || 'en';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Helper to preserve locale in links
  const getLocalizedUrl = (slug: string) => {
    return addLocaleToUrl(`/announcements/${slug}`, currentLocale);
  };

  const getAnnouncementsPageUrl = () => {
    return addLocaleToUrl('/announcements', currentLocale);
  };

  if (!announcements || announcements.length === 0) {
    return null;
  }

  // Create a circular array for infinite loop - duplicate announcements multiple times
  const totalAnnouncements = announcements.length;
  if (totalAnnouncements === 0) {
    return null;
  }

  // Create enough duplicates to ensure smooth infinite scrolling
  // We need at least 6 copies to allow smooth looping (3 visible + buffer)
  const displayAnnouncements = [];
  for (let i = 0; i < 6; i++) {
    displayAnnouncements.push(...announcements);
  }

  // Auto-slide functionality - infinite loop without reset
  // Pause when hovering
  useEffect(() => {
    if (totalAnnouncements === 0 || isHovered) return;
    
    // Always slide continuously - never reset to 0
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        // Keep incrementing forever - no reset
        // We'll use modulo when getting the actual announcement data
        return prev + 1;
      });
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [totalAnnouncements, isHovered]);

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1); // Keep incrementing
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => {
      // Wrap around to last announcement if going below 0
      if (prev <= 0) {
        return totalAnnouncements - 1;
      }
      return prev - 1;
    });
  };

  // Normalize currentIndex to prevent overflow - keeps it within valid range for display
  // This ensures the slider never goes blank and selection/dots work correctly
  const normalizedIndex = currentIndex % totalAnnouncements;
  // Use modulo on displayAnnouncements length for transform to keep it within rendered items range
  // This prevents the slider from going off-screen while maintaining smooth transitions
  const transformIndex = currentIndex % displayAnnouncements.length;

  return (
    <div 
      className="w-full flex items-center" 
      style={{ 
        overflow: 'visible',
        position: 'relative',
        gap: '80px' // Gap between title and slider - ADJUST THIS VALUE
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left: Title Section */}
      <div 
        className="flex flex-col gap-4 flex-shrink-0 items-start" 
        style={{ 
          transform: 'translateX(-100px) translateY(100px)', // Move title left and down - ADJUST translateY VALUE (positive = down, negative = up)
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Main Title with Gradient */}
        <h2 
          className="font-semibold bg-gradient-to-r from-[#20C997] to-[#A1DF0A] bg-clip-text text-transparent"
          style={{
            fontSize: '50px',
            lineHeight: '130%',
          }}
        >
          Research & Institute<br />
          Updates
        </h2>
      </div>

      {/* Right: Slider Container - Shows exactly 3 cards */}
      <div className="relative flex-shrink-0" style={{ overflow: 'hidden', width: `${(303 + 16) * 3 - 16}px` }}>
        <div 
          className="flex gap-4 transition-transform duration-500 ease-in-out"
          style={{ 
            transform: `translateX(-${transformIndex * (303 + 16)}px)`, // 303px card width + 16px gap (gap-4 = 16px)
            willChange: 'transform'
          }}
        >
          {displayAnnouncements.map((announcement, index) => {
            // Calculate relative position to transformIndex for proper card positioning
            const relativeIndex = index - transformIndex;
            
            // Calculate which original announcement should be shown at this position
            // Use modulo to get the actual announcement, creating seamless loop
            const displayIndex = transformIndex + relativeIndex;
            const originalIndex = displayIndex % totalAnnouncements;
            const actualAnnouncement = announcements[originalIndex];
            
            // Leftmost card (relativeIndex === 0) is always selected (green filled)
            const isSelected = relativeIndex === 0;
            
            // Render all cards - overflow:hidden on parent will clip them
            
            const imageUrl = actualAnnouncement?.image
              ? getOptimizedImageUrl(actualAnnouncement.image, 'medium') || 
                getStrapiImageUrl(actualAnnouncement.image)
              : null;
            const isLocalhost = imageUrl?.includes('localhost') || false;
            const summaryText = limitWords(extractTextFromSummary(actualAnnouncement?.summary || null), 10);

            return (
              <div
                key={`announcement-${originalIndex}-${index}`}
                className="flex-shrink-0"
                style={{ width: '303px', height: '307px' }}
              >
                {/* Card with SVG Path Shape */}
                <div className="relative w-full h-full" style={{ overflow: 'visible' }}>
                  {/* SVG Container with Path Shape */}
                  <svg
                    width="303"
                    height="307"
                    viewBox="0 0 303 307"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute inset-0 w-full h-full"
                  >
                    <defs>
                      <clipPath id={`announcement-clip-selected-${index}`}>
                        <path d="M302.356 120.082C304.387 106.195 301.886 93.9417 289.599 85.352C281.697 79.8071 272.557 80.5993 263.54 80.3765C240.23 79.8071 223.757 63.2467 222.915 39.9778C222.717 34.3339 224.203 28.4672 221.057 23.1451C217.812 11.4859 209.44 5.09934 198.565 1.2377C197.005 0.816884 195.419 0 193.859 0C140.279 0.0990163 86.7238 -0.272295 33.1935 0.66836C9.06641 1.06443 1.31305 10.2729 0.297439 34.4329C0.0992707 39.359 0.0744996 44.3098 0.0744996 49.2606C0.0249574 114.71 0.000186296 180.16 0.0249574 245.635C0.0249574 255.932 -0.197982 266.255 0.569921 276.503C1.9571 295.539 10.2059 303.906 29.1062 305.787C39.3367 306.802 49.6415 307.396 59.9215 306.01C101.19 307.446 142.459 307.025 183.727 305.936C213.329 307.396 242.93 307.371 272.507 305.812C293.166 304.698 302.108 295.588 302.356 274.226C302.951 222.836 302.43 171.447 302.356 120.082ZM39.9807 155.852C40.278 155.926 40.5257 156.025 40.7486 156.149C40.5009 156.099 40.2284 156 39.9807 155.852Z" />
                      </clipPath>
                      <clipPath id={`announcement-clip-unselected-${index}`}>
                        <path d="M193.859 0.5C194.558 0.500061 195.282 0.683772 196.056 0.936523C196.792 1.17674 197.623 1.49789 198.408 1.71191C209.184 5.54055 217.39 11.8328 220.576 23.2793L220.594 23.3428L220.627 23.3994C222.137 25.9553 222.546 28.6543 222.592 31.4492C222.614 32.8496 222.547 34.2617 222.484 35.6934C222.422 37.1189 222.365 38.562 222.416 39.9951V39.9961C223.267 63.5246 239.949 80.2998 263.527 80.876C272.487 81.0974 281.287 80.3498 288.948 85.5107L289.312 85.7617C295.37 89.9967 298.998 95.1195 300.871 100.885C302.747 106.66 302.87 113.112 301.861 120.01L301.856 120.046V120.083C301.931 171.453 302.451 222.835 301.856 274.22C301.733 284.844 299.447 292.311 294.724 297.267C290.149 302.066 283.202 304.598 273.434 305.255L272.48 305.312C242.921 306.871 213.336 306.896 183.752 305.437L183.733 305.436H183.715C142.451 306.525 101.193 306.945 59.9392 305.51L59.8962 305.509L59.8542 305.515C49.6339 306.893 39.3765 306.303 29.156 305.289C19.7634 304.354 13.1109 301.816 8.62866 297.229C4.14676 292.641 1.75746 285.926 1.06812 276.467V276.466L0.936279 274.548C0.329493 264.955 0.525145 255.303 0.525146 245.635C0.500375 180.16 0.525409 114.71 0.574951 49.2607L0.581787 45.5498C0.59803 41.8414 0.648364 38.1402 0.796631 34.4541C1.30335 22.3999 3.49148 14.2161 8.44214 8.98242C13.2286 3.92259 20.6974 1.51814 32.0867 1.19336L33.2019 1.16797C86.7268 0.227409 140.274 0.599023 193.859 0.5ZM40.1023 155.366L39.7234 156.28C40.023 156.46 40.3505 156.579 40.6511 156.639L40.991 155.712C40.7276 155.566 40.4392 155.45 40.1023 155.366Z" />
                      </clipPath>
                    </defs>
                    {/* Background Path */}
                    {isSelected ? (
                      <path
                        d="M302.356 120.082C304.387 106.195 301.886 93.9417 289.599 85.352C281.697 79.8071 272.557 80.5993 263.54 80.3765C240.23 79.8071 223.757 63.2467 222.915 39.9778C222.717 34.3339 224.203 28.4672 221.057 23.1451C217.812 11.4859 209.44 5.09934 198.565 1.2377C197.005 0.816884 195.419 0 193.859 0C140.279 0.0990163 86.7238 -0.272295 33.1935 0.66836C9.06641 1.06443 1.31305 10.2729 0.297439 34.4329C0.0992707 39.359 0.0744996 44.3098 0.0744996 49.2606C0.0249574 114.71 0.000186296 180.16 0.0249574 245.635C0.0249574 255.932 -0.197982 266.255 0.569921 276.503C1.9571 295.539 10.2059 303.906 29.1062 305.787C39.3367 306.802 49.6415 307.396 59.9215 306.01C101.19 307.446 142.459 307.025 183.727 305.936C213.329 307.396 242.93 307.371 272.507 305.812C293.166 304.698 302.108 295.588 302.356 274.226C302.951 222.836 302.43 171.447 302.356 120.082ZM39.9807 155.852C40.278 155.926 40.5257 156.025 40.7486 156.149C40.5009 156.099 40.2284 156 39.9807 155.852Z"
                        fill="#0F3F1D"
                      />
                    ) : (
                      <path
                        d="M193.859 0.5C194.558 0.500061 195.282 0.683772 196.056 0.936523C196.792 1.17674 197.623 1.49789 198.408 1.71191C209.184 5.54055 217.39 11.8328 220.576 23.2793L220.594 23.3428L220.627 23.3994C222.137 25.9553 222.546 28.6543 222.592 31.4492C222.614 32.8496 222.547 34.2617 222.484 35.6934C222.422 37.1189 222.365 38.562 222.416 39.9951V39.9961C223.267 63.5246 239.949 80.2998 263.527 80.876C272.487 81.0974 281.287 80.3498 288.948 85.5107L289.312 85.7617C295.37 89.9967 298.998 95.1195 300.871 100.885C302.747 106.66 302.87 113.112 301.861 120.01L301.856 120.046V120.083C301.931 171.453 302.451 222.835 301.856 274.22C301.733 284.844 299.447 292.311 294.724 297.267C290.149 302.066 283.202 304.598 273.434 305.255L272.48 305.312C242.921 306.871 213.336 306.896 183.752 305.437L183.733 305.436H183.715C142.451 306.525 101.193 306.945 59.9392 305.51L59.8962 305.509L59.8542 305.515C49.6339 306.893 39.3765 306.303 29.156 305.289C19.7634 304.354 13.1109 301.816 8.62866 297.229C4.14676 292.641 1.75746 285.926 1.06812 276.467V276.466L0.936279 274.548C0.329493 264.955 0.525145 255.303 0.525146 245.635C0.500375 180.16 0.525409 114.71 0.574951 49.2607L0.581787 45.5498C0.59803 41.8414 0.648364 38.1402 0.796631 34.4541C1.30335 22.3999 3.49148 14.2161 8.44214 8.98242C13.2286 3.92259 20.6974 1.51814 32.0867 1.19336L33.2019 1.16797C86.7268 0.227409 140.274 0.599023 193.859 0.5ZM40.1023 155.366L39.7234 156.28C40.023 156.46 40.3505 156.579 40.6511 156.639L40.991 155.712C40.7276 155.566 40.4392 155.45 40.1023 155.366Z"
                        fill="white"
                        stroke="#2E7D32"
                        strokeWidth="1"
                      />
                    )}
                  </svg>

                  {/* Circle Button - Top Right */}
                  <Link
                    href={getAnnouncementsPageUrl()}
                    className="absolute top-0 right-0 z-20 transition-all duration-300 hover:opacity-90 flex items-center justify-center"
                    style={{
                      transform: 'translate(1%, -1%)', // Center the circle on the corner
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      backgroundColor: isSelected ? '#0F3F1D' : 'white',
                      border: !isSelected ? '1px solid #2E7D32' : 'none',
                    }}
                  >
                    {/* Arrow Icon inside circle - pointing to top-right (northeast) */}
                    <svg
                      width="50"
                      height="50"
                      viewBox="0 0 70 70"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M25 45L45 25M45 25H35M45 25V35"
                        stroke={isSelected ? 'white' : '#2E7D32'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>

                  {/* Content Container - Clipped to SVG Path */}
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: isSelected 
                        ? `url(#announcement-clip-selected-${index})`
                        : `url(#announcement-clip-unselected-${index})`,
                    }}
                  >
                    <div
                      className={`w-full h-full pl-6 pr-6 pb-6 flex flex-col transition-all duration-300 ${
                        isSelected
                          ? 'bg-[#0F3F1D] text-white'
                          : 'bg-white text-[#0F3F1D]'
                      }`}
                      style={{
                        paddingTop: '50px',
                      }}
                    >
                      {/* Title */}
                      <div
                        className={`mb-3 ${
                          isSelected ? 'text-white' : 'text-[#0F3F1D]'
                        }`}
                        style={{
                          width: '201px',
                          height: '108px',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                        }}
                      >
                        <h3
                          style={{
                            fontSize: '20px',
                            lineHeight: '137%',
                            fontWeight: 600, // semi-bold
                            whiteSpace: 'pre-line',
                            wordBreak: 'break-word',
                            margin: 0,
                          }}
                        >
                          {formatTitle(actualAnnouncement?.title || '')}
                        </h3>
                      </div>

                      {/* Summary */}
                      {summaryText && (
                        <p
                          className={`flex-grow ${
                            isSelected ? 'text-white/90' : 'text-[#0F3F1D]/80'
                          }`}
                          style={{
                            fontSize: '18px',
                            lineHeight: '35px',
                            fontWeight: 400, // regular
                          }}
                        >
                          {summaryText}
                        </p>
                      )}

                      {/* Image (optional) */}
                      {imageUrl && (
                        <div className="mt-4 w-full h-32 rounded-lg overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={actualAnnouncement?.title || ''}
                            width={400}
                            height={200}
                            className="object-cover w-full h-full"
                            unoptimized={isLocalhost}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
