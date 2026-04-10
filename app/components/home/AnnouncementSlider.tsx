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
  label?: string;
}

function renderAnnouncementLabel(label: string): React.ReactNode {
  if (!label) {
    return null;
  }

  if (label.includes('\n')) {
    const lines = label.split('\n');
    return lines.map((line, index) => (
      <React.Fragment key={`${line}-${index}`}>
        {index > 0 && <br />}
        {line}
      </React.Fragment>
    ));
  }

  const words = label.trim().split(/\s+/);
  if (words.length <= 1) {
    return label;
  }

  const lastWord = words[words.length - 1];
  const firstLine = words.slice(0, -1).join(' ');

  return (
    <>
      {firstLine}
      <br />
      {lastWord}
    </>
  );
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
 * Limit title length without forcing manual line breaks.
 */
function formatTitle(title: string): string {
  if (!title) return '';
  const words = title.split(/\s+/).filter(word => word.length > 0);

  if (words.length > 8) {
    return words.slice(0, 8).join(' ') + '...';
  }

  return words.join(' ');
}

export default function AnnouncementSlider({
  announcements,
  label = 'Research & Institute Updates',
}: AnnouncementSliderProps) {
  const searchParams = useSearchParams();
  const currentLocale = searchParams.get('locale') || 'en';
  const [currentIndex, setCurrentIndex] = useState(() => announcements.length);
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window === 'undefined' ? 0 : window.innerWidth
  );
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  // Detect screen size for responsive calculations - only after mount to prevent hydration errors
  useEffect(() => {
    const updateWidth = () => {
      setWindowWidth(window.innerWidth);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const getAnnouncementsPageUrl = () => {
    return addLocaleToUrl('/announcements', currentLocale);
  };

  // Create a circular array for infinite loop - 3 sets are enough for jump logic
  const totalAnnouncements = announcements.length;
  const displayAnnouncements = [...announcements, ...announcements, ...announcements];

  // Handle seamless jump when reaching boundaries
  // This effect resets the index to the middle set without animation
  useEffect(() => {
    if (totalAnnouncements === 0) return;

    // Boundary check for end (completed transition into the third set)
    if (currentIndex >= totalAnnouncements * 2) {
      const timer = setTimeout(() => {
        setTransitionEnabled(false);
        setCurrentIndex(totalAnnouncements);
      }, 500); // Match transition duration
      return () => clearTimeout(timer);
    }

    // Boundary check for start (completed transition into the first set)
    if (currentIndex < totalAnnouncements) {
      const timer = setTimeout(() => {
        setTransitionEnabled(false);
        setCurrentIndex(totalAnnouncements * 2 - 1);
      }, 500); // Match transition duration
      return () => clearTimeout(timer);
    }

    // Re-enable transition after jump
    if (!transitionEnabled) {
      const timer = setTimeout(() => {
        setTransitionEnabled(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, totalAnnouncements, transitionEnabled]);

  // Auto-slide functionality
  useEffect(() => {
    if (totalAnnouncements === 0 || isHovered || !transitionEnabled) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalAnnouncements, isHovered, transitionEnabled]);

  // Calculate responsive values based on screen size
  // Use default desktop values during SSR to prevent hydration mismatch
  const isMobile = windowWidth > 0 && windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const isDesktop = windowWidth === 0 || windowWidth >= 1024;

  // Card dimensions
  const baseCardWidth = 303;
  const baseCardGap = 16;

  // Scale factors - reduced mobile scale to fit better in viewport
  const mobileScale = 0.4; // 40% of original size for mobile (smaller)
  const tabletScale = 0.7; // 70% of original size for tablet

  // Calculate scale and visible cards
  const scale = isMobile ? mobileScale : isTablet ? tabletScale : 1;
  const visibleCards = isMobile ? 1 : isTablet ? 2 : 3;

  // Calculate actual dimensions (scaled)
  const cardWidth = baseCardWidth * scale;
  const cardGap = baseCardGap * scale;

  // Calculate container width (based on scaled dimensions)
  const calculatedWidth = (cardWidth * visibleCards) + (cardGap * (visibleCards - 1));

  // For tablet, ensure container doesn't exceed available viewport space
  // Account for title section width, gaps, and padding
  const titleEstimatedWidth = isMobile ? 100 : isTablet ? 180 : 0;
  const gapAndPadding = isMobile ? 20 : isTablet ? 60 : 0;
  const maxAvailableWidth = isTablet && windowWidth > 0
    ? Math.max(0, windowWidth - titleEstimatedWidth - gapAndPadding)
    : calculatedWidth;

  // Use the smaller of calculated width or max available width (only for tablet)
  const containerWidth = isTablet
    ? Math.min(calculatedWidth, maxAvailableWidth)
    : calculatedWidth;

  // The transform value calculation is now simpler
  const transformValue = currentIndex * (cardWidth + cardGap);

  if (!announcements || announcements.length === 0) {
    return null;
  }

  return (
    <div
      className="w-full flex flex-row items-center gap-6 md:gap-6 lg:gap-18 max-[490px]:mt-[-125px] max-[550px]:mt-[-145px] max-[770px]:mt-[-650px] max-[825px]:mt-[-600px] max-[920px]:mt-[-650px]"
      style={{
        overflow: 'visible',
        position: 'relative',
        maxWidth: '100%',
        marginLeft: isMobile ? '-16px' : isDesktop ? '0' : '0', // Remove any container padding on mobile, keep desktop original
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left: Title Section */}
      <div
        className="flex flex-col gap-2 md:gap-3 lg:gap-4 flex-shrink-0 items-start ml-[100px] pl-0 max-[1024px]:ml-0 max-[1024px]:pl-6 max-[432px]:ml-8 max-[415px]:ml-6 max-[392px]:ml-4 max-[376px]:ml-2 max-[640px]:pl-0 max-[550px]:ml-16"
        style={{
          position: 'relative',
          zIndex: 10,
          transform: isMobile
            ? 'translateX(0) translateY(0)'
            : isTablet
              ? 'translateX(-20px) translateY(40px)'
              : 'translateX(-100px) translateY(100px)'
        }}
      >
        {/* Main Title with Gradient */}
        <h2
          className="font-semibold bg-gradient-to-r from-[#20C997] to-[#A1DF0A] bg-clip-text text-transparent text-[19px] md:text-[28px] lg:text-[40px] xl:text-[50px] md:ml-8 ml-0"
          style={{
            lineHeight: '130%',
          }}
        >
          {renderAnnouncementLabel(label)}
        </h2>
      </div>

      {/* Right: Slider Container - Responsive cards */}
      <div
        className="relative flex-shrink"
        style={{
          overflow: 'hidden',
          width: isMobile ? `${cardWidth + 12}px` : `${containerWidth}px`,
          maxWidth: isMobile ? 'calc(100vw - 80px)' : isTablet ? `${maxAvailableWidth}px` : 'none',
          minWidth: 0,
        }}
      >
        <div
          className={`flex ${transitionEnabled ? 'transition-transform duration-500 ease-in-out' : ''}`}
          style={{
            gap: `${cardGap}px`,
            transform: `translateX(-${transformValue}px)`,
            willChange: 'transform'
          }}
        >
          {displayAnnouncements.map((announcement, index) => {
            // Calculate which original announcement should be shown at this position
            const originalIndex = index % totalAnnouncements;
            const actualAnnouncement = announcements[originalIndex];

            // Leftmost card in current view is "selected"
            const isSelected = index === currentIndex;

            const imageUrl = actualAnnouncement?.image
              ? getOptimizedImageUrl(actualAnnouncement.image, 'medium') ||
              getStrapiImageUrl(actualAnnouncement.image)
              : null;
            const isLocalhost = imageUrl?.includes('localhost') || false;
            const summaryText = limitWords(extractTextFromSummary(actualAnnouncement?.summary || null), 25);

            return (
              <div
                key={`announcement-${originalIndex}-${index}`}
                className="flex-shrink-0"
                style={{
                  width: `${cardWidth}px`,
                  height: `${cardWidth * (307 / 303)}px`,
                }}
              >
                {/* Card with SVG Path Shape - Scale all content together */}
                <div
                  className="relative"
                  style={{
                    overflow: 'visible',
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    width: `${baseCardWidth}px`,
                    height: `${baseCardWidth * (307 / 303)}px`
                  }}
                >
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
                    className={`absolute top-0 right-0 z-20 flex items-center justify-center ${transitionEnabled ? 'transition-all duration-300' : ''} hover:opacity-90`}
                    style={{
                      transform: 'translate(1%, -1%)',
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
                      className={`w-full h-full pl-6 pr-6 pb-6 flex flex-col ${transitionEnabled ? 'transition-all duration-300' : ''} ${isSelected
                        ? 'bg-[#0F3F1D] text-white'
                        : 'bg-white text-[#0F3F1D]'
                        }`}
                      style={{
                        paddingTop: '50px',
                      }}
                    >
                      {/* Title */}
                      <div
                        className={`mb-2 overflow-hidden flex flex-col justify-start
                          w-[180px] min-h-[50px]
                          md:w-[180px] md:min-h-[60px]
                          lg:w-[201px] lg:min-h-[75px]
                          ${isSelected ? 'text-white' : 'text-[#0F3F1D]'}
                        `}
                      >
                        <h3
                          className="m-0 whitespace-pre-line break-words font-semibold
                            text-[24px] leading-[35px]
                            md:text-[22px] md:leading-[35px]
                            lg:text-[22px] lg:leading-[35px]"
                          style={{
                            whiteSpace: 'normal',
                            display: '-webkit-box',
                            WebkitLineClamp: isMobile ? 3 : isTablet ? 4 : 4,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {formatTitle(actualAnnouncement?.title || '')}
                        </h3>
                      </div>

                      {/* Summary */}
                      {summaryText && (
                        <p
                          className={`font-normal
                            text-[20px] leading-[35px]
                            md:text-[20px] md:leading-[35px]
                            lg:text-[18px] lg:leading-[35px]
                            ${isSelected ? 'text-white/90' : 'text-[#0F3F1D]/80'}
                          `}
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: isMobile ? 3 : isTablet ? 3 : 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {summaryText}
                        </p>
                      )}

                      {/* Image (optional) */}
                      {imageUrl && (
                        <div className="mt-4 w-full h-28 md:h-32 lg:h-32 rounded-lg overflow-hidden">
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
