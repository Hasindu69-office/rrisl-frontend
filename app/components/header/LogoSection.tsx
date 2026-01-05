'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { GlobalLayout } from '@/app/lib/types';
import { getStrapiImageUrl, getOptimizedImageUrl } from '@/app/lib/strapi';

interface LogoSectionProps {
  globalLayout: GlobalLayout | null;
}

export default function LogoSection({ globalLayout }: LogoSectionProps) {
  const logoAlt = globalLayout?.logoAlt || 'RRISL Logo';
  
  // Get logo from Strapi
  const logo = globalLayout?.logo;
  
  // Fallback logo image
  const fallbackLogo = '/images/rrisl_logo.png';
  
  // Get Strapi logo URLs (without fallback yet)
  const strapiDesktopUrl = getOptimizedImageUrl(logo, 'medium') || getStrapiImageUrl(logo);
  const strapiMobileUrl = getOptimizedImageUrl(logo, 'small') || getStrapiImageUrl(logo);

  // Check if Strapi URLs contain localhost
  const hasLocalhostUrl = strapiDesktopUrl?.includes('localhost') || strapiMobileUrl?.includes('localhost') || false;

  // Check if we're accessing from a non-localhost hostname (e.g., mobile device via port forwarding)
  // Initialize fallback state based on whether localhost URLs will be accessible
  const [useFallback, setUseFallback] = useState(() => {
    if (typeof window !== 'undefined' && hasLocalhostUrl) {
      const currentHostname = window.location.hostname;
      // If accessing from anything other than localhost/127.0.0.1, localhost URLs won't work
      // This includes IP addresses (192.168.x.x, 10.x.x.x, etc.) and domain names
      return currentHostname !== 'localhost' && currentHostname !== '127.0.0.1';
    }
    return false;
  });

  // Also handle dynamic changes (in case hostname changes, though unlikely)
  useEffect(() => {
    if (typeof window !== 'undefined' && hasLocalhostUrl) {
      const currentHostname = window.location.hostname;
      const isRemoteAccess = currentHostname !== 'localhost' && currentHostname !== '127.0.0.1';
      
      // If accessing remotely and Strapi URL is localhost, use fallback immediately
      if (isRemoteAccess) {
        setUseFallback(true);
      }
    }
  }, [hasLocalhostUrl]);

  // Get logo URLs - use fallback if Strapi URL is not available or if we're using fallback
  const desktopLogoUrl = (useFallback || !strapiDesktopUrl) ? fallbackLogo : strapiDesktopUrl;
  const mobileLogoUrl = (useFallback || !strapiMobileUrl) ? fallbackLogo : strapiMobileUrl;

  // Get dimensions from Strapi logo data, or use defaults for fallback
  const desktopWidth = logo?.formats?.medium?.width || logo?.width || 750;
  const desktopHeight = logo?.formats?.medium?.height || logo?.height || 122;
  const mobileWidth = logo?.formats?.small?.width || logo?.width || 500;
  const mobileHeight = logo?.formats?.small?.height || logo?.height || 81;

  // If no logo at all (neither Strapi nor fallback), return null
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
          className="hidden md:block object-contain w-[280px] md:w-[380px] lg:w-[496px] h-auto md:h-[55px] lg:h-[80px]"
          onError={() => console.error('Failed to load logo:', desktopLogoUrl)}
        />
        <img
          src={mobileLogoUrl}
          alt={logoAlt}
          className="block md:hidden object-contain h-auto max-h-10 sm:max-h-12 w-auto"
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
        className="hidden md:block object-contain w-[280px] md:w-[380px] lg:w-[496px] h-auto md:h-[55px] lg:h-[80px]"
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
        className="block md:hidden object-contain h-auto max-h-10 sm:max-h-12 w-auto"
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

