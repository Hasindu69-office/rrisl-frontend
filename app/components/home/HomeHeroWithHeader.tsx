'use client';

import React from 'react';
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

  // Get background images
  const desktopBgUrl = hero.backgroundImageDesktop
    ? getOptimizedImageUrl(hero.backgroundImageDesktop, 'large') || getStrapiImageUrl(hero.backgroundImageDesktop)
    : null;
  const mobileBgUrl = hero.backgroundImageMobile
    ? getOptimizedImageUrl(hero.backgroundImageMobile, 'small') || getStrapiImageUrl(hero.backgroundImageMobile)
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

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background Images - Cover navigation bar and hero content area */}
      {desktopBgUrl && (
        <>
          <div className="hidden md:block absolute top-0 left-0 w-full h-full z-0">
            <Image
              src={desktopBgUrl}
              alt="Hero Background"
              fill
              className="object-cover object-top"
              priority
              unoptimized={isLocalhost}
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
          {mobileBgUrl && (
            <div className="block md:hidden absolute top-0 left-0 w-full h-full z-0">
              <Image
                src={mobileBgUrl}
                alt="Hero Background"
                fill
                className="object-cover object-top"
                priority
                unoptimized={isLocalhost}
              />
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black/40" />
            </div>
          )}
        </>
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
      <div className="flex-1 flex items-start relative z-10">
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
            </div>

            {/* Right Visual Area */}
            <div className="relative flex items-center justify-center lg:justify-end min-h-[400px] lg:min-h-[600px]">
              {/* Container for overlays */}
              <div className="relative w-full max-w-lg aspect-square">
                {/* Badge Overlay */}
                {hero.badges && (
                  <div className="absolute top-0 left-0 bg-white/10 backdrop-blur-md rounded-[30px] p-4 border border-white/20 z-20 shadow-lg flex items-center gap-6 w-[318px] h-[105px]">
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

                {/* Label Overlay - Bottom Right with connecting line */}
                {labelText && (
                  <div className={`absolute ${labelPosition === 'right' ? 'bottom-4 right-4' : 'bottom-4 left-4'} z-20`}>
                    {/* Connecting line */}
                    <div className={`absolute ${labelPosition === 'right' ? 'right-full top-1/2 -translate-y-1/2' : 'left-full top-1/2 -translate-y-1/2'} w-12 h-0.5 bg-green-400`}>
                      <div className={`absolute ${labelPosition === 'right' ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-400`} />
                    </div>
                    
                    {/* Label box */}
                    <div className="bg-green-900/90 backdrop-blur-md rounded-lg px-4 py-2 border border-green-500/40 shadow-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="text-white text-sm font-medium">{labelText}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

