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
import MobileMenu from '../header/MobileMenu';

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
      {/* Background Images - Fixed to cover entire viewport from top */}
      {desktopBgUrl && (
        <>
          <div className="hidden md:block fixed top-0 left-0 w-full h-screen z-0">
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
            <div className="block md:hidden fixed top-0 left-0 w-full h-screen z-0">
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
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Left: Logo Section */}
              <LogoSection globalLayout={globalLayout} />

              {/* Right: Actions (Buttons + Language Switcher) */}
              <HeaderActions menuItems={rightMenuItems} />
            </div>
          </div>

          {/* Bottom Section - Navigation */}
          <div className="container mx-auto px-4 pb-3">
            <div className="flex items-center justify-between">
              {/* Desktop Navigation */}
              <Navigation menuItems={leftMenuItems} />

              {/* Mobile Menu Button */}
              <MobileMenu 
                menuItems={leftMenuItems} 
                headerRightMenuItems={rightMenuItems}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Content Section */}
      <div className="flex-1 flex items-center relative z-10">
        <div className="container mx-auto px-4 py-16 md:py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-6 z-10">
              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                {hero.title}{' '}
                <span className="text-green-400">{hero.highlightedText}</span>
              </h1>

              {/* Description */}
              {descriptionText && (
                <p className="text-base md:text-lg lg:text-xl text-gray-200 leading-relaxed max-w-2xl">
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
                        size="lg"
                        className="text-lg px-8 py-4"
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
                        size="lg"
                        className="text-lg px-8 py-4"
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
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-green-900/90 backdrop-blur-md rounded-xl p-3 border border-green-500/40 z-20 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      {/* Avatar Images */}
                      {avatars.slice(0, 2).map((avatar, index) => {
                        const avatarUrl = getOptimizedImageUrl(avatar, 'thumbnail') || getStrapiImageUrl(avatar);
                        return avatarUrl ? (
                          <div
                            key={avatar.id || index}
                            className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-400 shadow-lg"
                          >
                            <Image
                              src={avatarUrl}
                              alt={`Avatar ${index + 1}`}
                              width={40}
                              height={40}
                              className="object-cover"
                              unoptimized={isLocalhost}
                            />
                          </div>
                        ) : null;
                      })}
                      {/* Plus Icon */}
                      {avatars.length > 2 && (
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                          +
                        </div>
                      )}
                    </div>
                    <div className="text-white">
                      <div className="text-xl font-bold text-green-400">{badgeTitle}</div>
                      <div className="text-xs text-white uppercase tracking-wider font-semibold">{badgeSubtitle}</div>
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

