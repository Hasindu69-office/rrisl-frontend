'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GlobalLayout } from '@/app/lib/types';
import { getStrapiImageUrl, getOptimizedImageUrl } from '@/app/lib/strapi';

interface LogoSectionProps {
  globalLayout: GlobalLayout | null;
}

export default function LogoSection({ globalLayout }: LogoSectionProps) {
  const [useFallback, setUseFallback] = useState(false);

  const logoAlt = globalLayout?.logoAlt || 'RRISL Logo';
  
  // Get logo from Strapi
  const logo = globalLayout?.logo;
  
  if (!logo) {
    return null;
  }

  // Get logo URLs - use medium for desktop, small for mobile
  const desktopLogoUrl = getOptimizedImageUrl(logo, 'medium') || getStrapiImageUrl(logo);
  const mobileLogoUrl = getOptimizedImageUrl(logo, 'small') || getStrapiImageUrl(logo);

  // Get dimensions from Strapi logo data
  const desktopWidth = logo.formats?.medium?.width || logo.width || 750;
  const desktopHeight = logo.formats?.medium?.height || logo.height || 122;
  const mobileWidth = logo.formats?.small?.width || logo.width || 500;
  const mobileHeight = logo.formats?.small?.height || logo.height || 81;

  if (!desktopLogoUrl || !mobileLogoUrl) {
    return null;
  }

  // Use unoptimized for localhost to avoid Next.js image optimization issues
  // Check if URL contains localhost (works in both SSR and client)
  const isLocalhost = desktopLogoUrl?.includes('localhost') || mobileLogoUrl?.includes('localhost') || false;

  // If using fallback (regular img tag)
  if (useFallback) {
    return (
      <div className="flex items-center">
        <img
          src={desktopLogoUrl}
          alt={logoAlt}
          className="hidden md:block object-contain h-auto max-h-16 w-auto"
          onError={() => console.error('Failed to load logo:', desktopLogoUrl)}
        />
        <img
          src={mobileLogoUrl}
          alt={logoAlt}
          className="block md:hidden object-contain h-auto max-h-12 w-auto"
          onError={() => console.error('Failed to load logo:', mobileLogoUrl)}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {/* Desktop Logo */}
      <Image
        src={desktopLogoUrl}
        alt={logoAlt}
        width={desktopWidth}
        height={desktopHeight}
        className="hidden md:block object-contain h-auto max-h-16 w-auto"
        priority
        unoptimized={isLocalhost}
        onError={() => {
          console.error('Next.js Image failed, using fallback for:', desktopLogoUrl);
          setUseFallback(true);
        }}
      />
      {/* Mobile Logo */}
      <Image
        src={mobileLogoUrl}
        alt={logoAlt}
        width={mobileWidth}
        height={mobileHeight}
        className="block md:hidden object-contain h-auto max-h-12 w-auto"
        priority
        unoptimized={isLocalhost}
        onError={() => {
          console.error('Next.js Image failed, using fallback for:', mobileLogoUrl);
          setUseFallback(true);
        }}
      />
    </div>
  );
}

