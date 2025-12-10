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

interface HomeHeroWithHeaderProps {
  hero: Hero;
  globalLayout: GlobalLayout | null;
  leftMenuItems: MenuItem[];
  rightMenuItems: MenuItem[];
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
  rightMenuItems 
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

  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = Math.max(desktopBgImages.length, mobileBgImages.length);

  // Auto-play slider
  useEffect(() => {
    if (totalSlides <= 1) return; // Don't auto-play if only one slide

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [totalSlides]);

  // Get current slide images
  const currentDesktopImage = desktopBgImages[currentSlide] || null;
  const currentMobileImage = mobileBgImages[currentSlide] || null;

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

  // CTA
  const cta = hero.primaryCta;
  // Check for localhost in URLs
  const isLocalhost = desktopBgUrl?.includes('localhost') || mobileBgUrl?.includes('localhost') || false;

  // Navigation handler
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background Image Slider - Cover navigation bar and hero content area */}
      {totalSlides > 0 && (
        <div className="absolute top-0 left-0 w-full h-full z-0">
          {/* Desktop Slider */}
          <div className="hidden md:block absolute top-0 left-0 w-full h-full">
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

          {/* Mobile Slider */}
          <div className="block md:hidden absolute top-0 left-0 w-full h-full">
            {mobileBgImages.map((image, index) => {
              const imageUrl = getOptimizedImageUrl(image, 'small') || getStrapiImageUrl(image);
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
      <div className="flex-1 flex items-start relative z-10" style={{ marginTop: '120px' }}>
        <div className="container mx-auto px-4 pt-4 md:pt-6 pb-8 md:pb-12 w-[1440px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-6 z-10">
              {/* Title */}
              <h1 className="text-[40px] md:text-[56px] lg:text-[60px] font-semibold text-white" style={{ lineHeight: '128%' }}>
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
                <p className="text-[18px] font-normal text-[#FFFFFF] max-w-2xl" style={{ lineHeight: '35px' }}>
                  {descriptionText}
                </p>
              )}

              {/* CTA Button */}
              {cta && (
                <div className="pt-4">
                  {cta.linkType === 'internal' ? (
                    <Link href={getLocalizedUrl(cta.url)}>
                      <Button
                        variant="primary"
                        size="sm"
                        className="!w-[178px] !h-[56px] !rounded-[30px] !bg-[#2E7D32] hover:!bg-[#2E7D32]/90"
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
                        className="!w-[178px] !h-[56px] !rounded-[30px] !bg-[#2E7D32] hover:!bg-[#2E7D32]/90"
                      >
                        {cta.label}
                      </Button>
                    </a>
                  )}
                </div>
              )}

              {/* Statistics Section */}
              <div className="pt-[86px]">
                <HeroStatistics />
              </div>
            </div>

            {/* Right Visual Area */}
            <div className="relative flex items-start justify-center lg:justify-end min-h-[400px] lg:min-h-[600px]">
              {/* Container for overlays */}
              <div className="relative w-full max-w-lg aspect-square" style={{ marginTop: '-100px' }}>
                {/* Badge Overlay */}
                {hero.badges && (
                  <div className="absolute -top-4 -left-12 bg-white/10 backdrop-blur-md rounded-[30px] p-4 border border-white/20 z-20 shadow-lg flex items-center gap-6 w-[318px] h-[105px]">
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
                    {/* Label box */}
                    <div className='absolute bottom-31 right-4 z-10'>
                      <span className="text-white text-sm font-medium whitespace-nowrap">{labelText}</span>
                    </div>
                    
                    {/* L-shaped connecting line */}
                    <svg 
                      className="absolute left-full -top-64 pointer-events-none"
                      style={{ width: '300px', height: '120px' }}
                      viewBox="0 -150 200 150"
                      preserveAspectRatio="none"
                    >
                      {/* Horizontal line from label */}
                      <line 
                        x1="0" 
                        y1="0" 
                        x2="100" 
                        y2="0" 
                        stroke="white" 
                        strokeWidth="2"
                      />
                      {/* Vertical line going up */}
                      <line 
                        x1="100" 
                        y1="0" 
                        x2="100" 
                        y2="-120" 
                        stroke="white" 
                        strokeWidth="1"
                      />
                      {/* Horizontal line going right */}
                      
                    </svg>
                    
                    {/* Circular marker at the end of the line (top right) */}
                    <div 
                      className="absolute pointer-events-none"
                      style={{ 
                        left: '150px', 
                        top: '-235px',
                        transform: 'translateY(-50%)'
                      }}
                    >
                      {/* Outer translucent ring */}
                      <div className="absolute w-16 h-16 rounded-full bg-gray-300/30 border-gray-300/50 -translate-x-1/2 -translate-y-1/2" />
                      {/* Inner solid circle */}
                      <div className="absolute w-6 h-6 rounded-full bg-gray-300 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* White Curved Cutout at Bottom Right */}
      <div className="absolute bottom-0 right-0 z-40 pointer-events-none">
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

