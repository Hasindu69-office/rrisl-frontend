'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Hero, GlobalLayout, MenuItem } from '@/app/lib/types';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';
import { addLocaleToUrl } from '@/app/lib/locale';
import Button from '../ui/Button';
import LogoSection from '../header/LogoSection';
import Navigation from '../header/Navigation';
import HeaderActions from '../header/HeaderActions';
import HeroStatistics from './HeroStatistics';
import AnnouncementSlider from './AnnouncementSlider';
import { HeroAnnouncementItem } from '@/app/lib/types';

interface HomeHeroWithHeaderProps {
  hero: Hero;
  globalLayout: GlobalLayout | null;
  leftMenuItems: MenuItem[];
  rightMenuItems: MenuItem[];
  announcements?: HeroAnnouncementItem[];
}

/**
 * Extract plain text from RichTextBlock array
 */
function extractTextFromBlocks(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return '';
  
  return blocks
    .map((block) => {
      if (block.children && Array.isArray(block.children)) {
        return block.children
          .map((child: any) => child.text || '')
          .join('');
      }
      return '';
    })
    .join(' ');
}

export default function HomeHeroWithHeader({ 
  hero, 
  globalLayout, 
  leftMenuItems, 
  rightMenuItems,
  announcements = []
}: HomeHeroWithHeaderProps) {
  const searchParams = useSearchParams();
  const currentLocale = searchParams.get('locale') || 'en';

  // Extract description text
  const descriptionText = extractTextFromBlocks(hero.description || []);

  // Helper to preserve locale in links
  const getLocalizedUrl = (url: string) => {
    // Only preserve locale for internal links
    if (url.startsWith('http') || url.startsWith('//')) {
      return url;
    }
    return addLocaleToUrl(url, currentLocale);
  };

  // Get background images - handle both array (multiple) and single image formats
  const desktopBgImages = hero.backgroundImageDesktop
    ? Array.isArray(hero.backgroundImageDesktop)
      ? hero.backgroundImageDesktop
      : [hero.backgroundImageDesktop]
    : [];
  const mobileBgImages = hero.backgroundImageMobile
    ? [hero.backgroundImageMobile]
    : [];

  // Check if mobile images are valid (can produce URLs)
  const hasValidMobileImages = mobileBgImages.length > 0 && 
    mobileBgImages.some(img => {
      const url = getOptimizedImageUrl(img, 'small') || getStrapiImageUrl(img);
      return url !== null;
    });

  // Use desktop images as fallback for mobile if mobile images are not available or invalid
  const effectiveMobileImages = hasValidMobileImages ? mobileBgImages : desktopBgImages;

  // Slider state - ensure we have slides if desktop images exist
  const [currentSlide, setCurrentSlide] = useState(0);
  // Use the maximum of desktop and effective mobile images, but prioritize desktop if it exists
  const totalSlides = desktopBgImages.length > 0 
    ? Math.max(desktopBgImages.length, effectiveMobileImages.length)
    : effectiveMobileImages.length;

  // Auto-play slider
  useEffect(() => {
    if (totalSlides <= 1) return; // Don't auto-play if only one slide

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 9000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [totalSlides]);

  // Get current slide images
  const currentDesktopImage = desktopBgImages[currentSlide] || null;
  const currentMobileImage = effectiveMobileImages[currentSlide] || null;

  const desktopBgUrl = currentDesktopImage
    ? getOptimizedImageUrl(currentDesktopImage, 'large') || getStrapiImageUrl(currentDesktopImage)
    : null;
  const mobileBgUrl = currentMobileImage
    ? getOptimizedImageUrl(currentMobileImage, 'small') || getStrapiImageUrl(currentMobileImage)
    : null;

  // Get badge avatars
  const avatars = hero.badges?.avatars || [];
  const badgeTitle = hero.badges?.title || '';
  const badgeSubtitle = hero.badges?.subtitle || '';

  // Get label
  const labelText = hero.labels?.text || '';
  const labelPosition = hero.labels?.position || 'right';

  // Animation state for label section - triggers on each slide change
  const [animationKey, setAnimationKey] = useState(0);

  // Reset animation when slide changes
  useEffect(() => {
    // Increment key to force re-render and restart animations
    setAnimationKey(prev => prev + 1);
  }, [currentSlide]);

  // CTA
  const cta = hero.primaryCta;
  // Check for localhost in URLs
  const isLocalhost = desktopBgUrl?.includes('localhost') || mobileBgUrl?.includes('localhost') || false;

  // Navigation handler
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Background Image Slider - Cover navigation bar and hero content area */}
      {totalSlides > 0 && (
        <div className="absolute top-0 left-0 w-full h-full z-0">
          {/* Desktop Slider */}
          <div className="hidden lg:block absolute top-0 left-0 w-full h-full">
            {desktopBgImages.map((image, index) => {
              const imageUrl = getOptimizedImageUrl(image, 'large') || getStrapiImageUrl(image);
              if (!imageUrl) return null;
              
              return (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <Image
                    src={imageUrl}
                    alt={`Hero Background ${index + 1}`}
                    fill
                    className="object-cover object-top"
                    priority={index === 0}
                    unoptimized={imageUrl.includes('localhost')}
                  />
                  {/* Dark overlay for better text readability */}
                  <div className="absolute inset-0 bg-black/40" />
                </div>
              );
            })}
          </div>

          {/* Tablet Slider - Extended to cover content but still smaller than desktop */}
          <div className="hidden md:block lg:hidden absolute top-0 left-0 w-full z-0" style={{ height: '85%', minHeight: '600px' }}>
            {desktopBgImages.map((image, index) => {
              const imageUrl = getOptimizedImageUrl(image, 'large') || getStrapiImageUrl(image);
              if (!imageUrl) return null;
              
              return (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <Image
                    src={imageUrl}
                    alt={`Hero Background ${index + 1}`}
                    fill
                    className="object-cover object-top"
                    priority={index === 0}
                    unoptimized={imageUrl.includes('localhost')}
                  />
                  {/* Dark overlay for better text readability */}
                  <div className="absolute inset-0 bg-black/40" />
                </div>
              );
            })}
          </div>

          {/* Mobile Slider - Extended to cover content but still smaller than desktop */}
          <div className="block md:hidden absolute top-0 left-0 w-full z-0" style={{ height: '80%', minHeight: '500px' }}>
            {effectiveMobileImages.map((image, index) => {
              // Use 'small' optimization for mobile, but if using desktop images as fallback, use 'large' for better quality
              const imageUrl = getOptimizedImageUrl(image, hasValidMobileImages ? 'small' : 'large') || getStrapiImageUrl(image);
              if (!imageUrl) return null;
              
              return (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <Image
                    src={imageUrl}
                    alt={`Hero Background ${index + 1}`}
                    fill
                    className="object-cover object-top"
                    priority={index === 0}
                    unoptimized={imageUrl.includes('localhost')}
                  />
                  {/* Dark overlay for better text readability */}
                  <div className="absolute inset-0 bg-black/40" />
                </div>
              );
            })}
          </div>

          {/* Slider Navigation Dots - Right Side */}
          {totalSlides > 1 && (
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-30 flex flex-col gap-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-white h-8'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Header Section */}
      <div className="relative z-50 bg-transparent">
        <div className="relative z-10">
          {/* Top Section - Logo and Actions */}
          <div className="container mx-auto px-3 sm:px-4 md:px-5 lg:px-8 py-2 sm:py-3 md:py-3 max-w-[1440px] w-full">
            <div className="flex items-center justify-between">
              {/* Left: Logo Section */}
              <LogoSection globalLayout={globalLayout} />

              {/* Right: Actions (Buttons + Language Switcher + Hamburger) */}
              <HeaderActions menuItems={rightMenuItems} leftMenuItems={leftMenuItems} />
            </div>
          </div>

          {/* Bottom Section - Navigation (Tablet and Desktop) */}
          <div className="hidden md:block container mx-auto px-3 sm:px-4 md:px-5 lg:px-8 pb-2 sm:pb-3 md:pb-3 max-w-[1440px] w-full mt-[10px]">
            <div className="flex items-center justify-between">
              {/* Desktop Navigation */}
              <Navigation menuItems={leftMenuItems} />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Content Section */}
      <div className="flex-1 flex items-start relative z-10 mt-16 md:mt-24 lg:mt-[120px]">
        <div className="container mx-auto px-4 pt-4 md:pt-6 pb-8 md:pb-12 w-full max-w-[1440px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-4 md:space-y-6 z-10 relative">
              {/* Badge Overlay - Mobile/Tablet: Positioned on right side of left content */}
              {hero.badges && (
                <div className="lg:hidden absolute bottom-12 right-0 md:top-0 md:bottom-auto md:right-12 bg-white/10 backdrop-blur-md rounded-[20px] md:rounded-[25px] p-3 md:p-3.5 border border-white/20 z-20 shadow-lg floating-badge
                  flex flex-col items-center gap-2 md:gap-3
                  w-[calc(100%-1rem)] md:w-[150px] 
                  max-w-[calc(40%-1rem)] md:max-w-[280px]
                  h-auto min-h-[60px] md:min-h-[60px]">
                  {/* Avatar Images - Top */}
                  <div className="flex items-center justify-center -space-x-2 md:-space-x-3">
                    {avatars.slice(0, 2).map((avatar, index) => {
                      const avatarUrl = getOptimizedImageUrl(avatar, 'thumbnail') || getStrapiImageUrl(avatar);
                      return avatarUrl ? (
                        <div
                          key={avatar.id || index}
                          className="w-10 h-10 md:w-11 md:h-11 rounded-full overflow-hidden shadow-lg relative"
                          style={{ zIndex: index + 1 }}
                        >
                          <Image
                            src={avatarUrl}
                            alt={`Avatar ${index + 1}`}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                            unoptimized={isLocalhost}
                          />
                          {/* Star badge on first avatar */}
                          {index === 0 && (
                            <div className="absolute -bottom-0.5 -right-0.5 md:-bottom-1 md:-right-1 w-4 h-4 md:w-5 md:h-5 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center z-20">
                              <span className="text-white text-[8px] md:text-[10px]">★</span>
                            </div>
                          )}
                        </div>
                      ) : null;
                    })}
                    {/* Plus Icon - Dark Green Circle */}
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#2E7D32] flex items-center justify-center text-white text-lg md:text-xl font-bold shadow-lg relative z-10">
                      + 
                    </div>
                  </div>
                  
                  {/* Text - Bottom */}
                  <div className="text-white text-center w-full">
                    <div className="text-[12px] md:text-[14px] font-normal text-[#FFFFFF] leading-tight">{badgeTitle}</div>
                    <div className="text-[12px] md:text-[14px] font-normal text-[#FFFFFF] leading-tight">{badgeSubtitle}</div>
                  </div>
                </div>
              )}

              {/* Title */}
              <h1 className="text-[28px] md:text-[40px] lg:text-[60px] font-semibold text-white" style={{ lineHeight: '128%' }}>
                {/* First Line - White */}
                <div className="block">
                  {hero.title}
                </div>
                
                {/* Second Line - Gradient with Indentation */}
                <div className="block bg-gradient-to-r from-[#20C997] to-[#A1DF0A] bg-clip-text text-transparent">
                  {hero.highlightedText}
                </div>
              </h1>

              {/* Description */}
              {descriptionText && (
                <p className="text-[14px] md:text-[16px] lg:text-[18px] font-normal text-[#FFFFFF] max-w-2xl" style={{ lineHeight: '1.5' }}>
                  {descriptionText}
                </p>
              )}

              {/* CTA Button */}
              {cta && (
                <div className="pt-2 md:pt-4">
                  {cta.linkType === 'internal' ? (
                    <Link href={getLocalizedUrl(cta.url)}>
                      <Button
                        variant="primary"
                        size="sm"
                        className="!w-[150px] !h-[48px] md:!w-[178px] md:!h-[56px] !rounded-[30px] !bg-[#2E7D32] hover:!bg-[#2E7D32]/90 !text-sm md:!text-base"
                      >
                        {cta.label}
                      </Button>
                    </Link>
                  ) : (
                    <a
                      href={cta.url}
                      target={cta.openInNewTab ? '_blank' : '_self'}
                      rel={cta.openInNewTab ? 'noopener noreferrer' : undefined}
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        className="!w-[150px] !h-[48px] md:!w-[178px] md:!h-[56px] !rounded-[30px] !bg-[#2E7D32] hover:!bg-[#2E7D32]/90 !text-sm md:!text-base"
                      >
                        {cta.label}
                      </Button>
                    </a>
                  )}
                </div>
              )}

              {/* Statistics Section */}
              <div className="pt-8 md:pt-12 lg:pt-[86px]">
                <HeroStatistics />
              </div>
            </div>

            {/* Right Visual Area */}
            <div className="relative flex items-start justify-center lg:justify-end min-h-[400px] lg:min-h-[600px]">
              {/* Container for overlays */}
              <div className="relative w-full max-w-lg aspect-square" style={{ marginTop: '-100px' }}>
                {/* Badge Overlay - Desktop: Keep original position */}
                {hero.badges && (
                  <div className="hidden lg:flex absolute -top-4 -left-12 bg-white/10 backdrop-blur-md rounded-[30px] p-4 border border-white/20 z-20 shadow-lg items-center gap-6 w-[318px] h-[105px] floating-badge">
                    {/* Avatar Images - Left Side */}
                    <div className="flex items-center -space-x-3">
                      {avatars.slice(0, 2).map((avatar, index) => {
                        const avatarUrl = getOptimizedImageUrl(avatar, 'thumbnail') || getStrapiImageUrl(avatar);
                        return avatarUrl ? (
                          <div
                            key={avatar.id || index}
                            className="w-12 h-12 rounded-full overflow-hidden shadow-lg relative"
                            style={{ zIndex: index + 1 }}
                          >
                            <Image
                              src={avatarUrl}
                              alt={`Avatar ${index + 1}`}
                              width={48}
                              height={48}
                              className="object-cover"
                              unoptimized={isLocalhost}
                            />
                            {/* Star badge on first avatar */}
                            {index === 0 && (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center z-20">
                                <span className="text-white text-[10px]">★</span>
                              </div>
                            )}
                          </div>
                        ) : null;
                      })}
                      {/* Plus Icon - Dark Green Circle */}
                      <div className="w-12 h-12 rounded-full bg-[#2E7D32] flex items-center justify-center text-white text-xl font-bold shadow-lg relative z-10">
                        + 
                      </div>
                    </div>
                    
                    {/* Text - Right Side */}
                    <div className="text-white">
                      <div className="text-[18px] font-normal text-[#FFFFFF]" style={{ lineHeight: '30px' }}>{badgeTitle}</div>
                      <div className="text-[18px] font-normal text-[#FFFFFF]" style={{ lineHeight: '30px' }}>{badgeSubtitle}</div>
                    </div>
                  </div>
                )}

                {/* Label Overlay - Bottom Left with L-shaped connecting line to top right marker */}
                {labelText && (
                  <div className="absolute bottom-12 left-0 z-20">
                    {/* CSS Animations */}
                    <style jsx>{`
                      @keyframes circleFadeIn {
                        0% { opacity: 0; transform: scale(0.5); }
                        100% { opacity: 1; transform: scale(1); }
                      }
                      
                      @keyframes ripplePulse {
                        0% { transform: scale(1); opacity: 0.6; }
                        50% { transform: scale(1.4); opacity: 0.3; }
                        100% { transform: scale(1.8); opacity: 0; }
                      }
                      
                      @keyframes drawVerticalLine {
                        0% { stroke-dashoffset: 120; }
                        100% { stroke-dashoffset: 0; }
                      }
                      
                      @keyframes drawHorizontalLine {
                        0% { stroke-dashoffset: 100; }
                        100% { stroke-dashoffset: 0; }
                      }
                      
                      @keyframes labelFadeIn {
                        0% { opacity: 0; transform: translateX(-10px); }
                        100% { opacity: 1; transform: translateX(0); }
                      }
                      
                      .circle-inner {
                        opacity: 0;
                      }
                      
                      .circle-outer {
                        opacity: 0;
                      }
                      
                      .circle-ripple {
                        opacity: 0;
                      }
                      
                      .vertical-line {
                        stroke-dasharray: 120;
                        stroke-dashoffset: 120;
                      }
                      
                      .horizontal-line {
                        stroke-dasharray: 100;
                        stroke-dashoffset: 100;
                      }
                      
                      .label-text {
                        opacity: 0;
                      }
                      
                      /* Animated states */
                      .animate .circle-inner {
                        animation: circleFadeIn 0.5s ease-out forwards;
                      }
                      
                      .animate .circle-outer {
                        animation: circleFadeIn 0.5s ease-out forwards;
                      }
                      
                      .animate .circle-ripple {
                        animation: circleFadeIn 0.3s ease-out 0.3s forwards,
                                   ripplePulse 1.5s ease-out 0.6s infinite;
                      }
                      
                      .animate .vertical-line {
                        animation: drawVerticalLine 0.5s ease-out 0.8s forwards;
                      }
                      
                      .animate .horizontal-line {
                        animation: drawHorizontalLine 0.4s ease-out 1.3s forwards;
                      }
                      
                      .animate .label-text {
                        animation: labelFadeIn 0.4s ease-out 1.7s forwards;
                      }
                    `}</style>
                    
                    <div key={animationKey} className="animate">
                      {/* Label box */}
                      <div className='absolute bottom-31 right-4 z-10'>
                        <span className="label-text text-white text-sm font-medium whitespace-nowrap">{labelText}</span>
                      </div>
                      
                      {/* L-shaped connecting line */}
                      <svg 
                        className="absolute left-full -top-64 pointer-events-none"
                        style={{ width: '300px', height: '120px' }}
                        viewBox="0 -150 200 150"
                        preserveAspectRatio="none"
                      >
                        {/* Vertical line going up (draws from top to bottom, visually from circle down) */}
                        <line 
                          className="vertical-line"
                          x1="100" 
                          y1="-120" 
                          x2="100" 
                          y2="0" 
                          stroke="white" 
                          strokeWidth="1"
                        />
                        {/* Horizontal line from vertical to label (draws from right to left) */}
                        <line 
                          className="horizontal-line"
                          x1="100" 
                          y1="0" 
                          x2="0" 
                          y2="0" 
                          stroke="white" 
                          strokeWidth="2"
                        />
                      </svg>
                      
                      {/* Circular marker at the end of the line (top right) */}
                      <div 
                        className="absolute pointer-events-none flex items-center justify-center"
                        style={{ 
                          left: '150px', 
                          top: '-235px',
                          width: '80px',
                          height: '80px',
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        {/* Ripple ring (animated pulse) - emanates from center */}
                        <div className="circle-ripple absolute w-20 h-20 rounded-full bg-gray-300/20" />
                        {/* Outer translucent ring */}
                        <div className="circle-outer absolute w-16 h-16 rounded-full bg-gray-300/30" />
                        {/* Inner solid circle - centered in outer ring */}
                        <div className="circle-inner absolute w-6 h-6 rounded-full bg-gray-300" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Announcement Slider Section - Bottom Right Above White Curved Cutout */}
      {announcements && announcements.length > 0 && (
        <div className="absolute -bottom-54 -right-20 z-30 pointer-events-auto pr-8" style={{ overflow: 'visible' }}>
          <div className="flex justify-end" style={{ overflow: 'visible' }}>
            <AnnouncementSlider
              announcements={announcements}
            />
          </div>
        </div>
      )}

      {/* White Curved Cutout at Bottom Right */}
      <div className="absolute bottom-0 right-0 z-20 pointer-events-none">
        <svg
          width="1077"
          height="151"
          viewBox="0 0 1077 151"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block"
        >
          <g clipPath="url(#clip0_251_42)">
            <path
              d="M0 151.831C5.29879 151.288 10.641 150.204 15.9181 150.312C32.8785 150.681 45.8866 143.631 55.1812 129.834C73.9441 101.98 92.2076 73.8003 111.144 46.0763C115.661 39.4599 119.874 32.5615 124.5 26.0101C136.009 9.67516 154.816 0 174.817 0H1077V154C1071.64 154 1066.01 154 1060.41 154"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_251_42">
              <rect width="1077" height="154" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </section>
  );
}

