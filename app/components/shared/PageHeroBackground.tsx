'use client';

import { useState } from 'react';
import Image from 'next/image';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';

interface PageHeroBackgroundProps {
  src?: string;
  alt: string;
  fallbackSrc: string;
}

export default function PageHeroBackground({
  src,
  alt,
  fallbackSrc,
}: PageHeroBackgroundProps) {
  const resolvedSrc = src || fallbackSrc;
  const hasLocalhostUrl = isLocalhostAssetUrl(resolvedSrc);
  const [useFallback, setUseFallback] = useState(() => {
    if (typeof window !== 'undefined' && hasLocalhostUrl) {
      const hostname = window.location.hostname;
      return hostname !== 'localhost' && hostname !== '127.0.0.1';
    }

    return !src;
  });

  const activeSrc = useFallback ? fallbackSrc : resolvedSrc;
  const useUnoptimized = isLocalhostAssetUrl(activeSrc);

  if (useFallback) {
    return (
      <img
        src={activeSrc}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover object-center"
        onError={() => {
          console.error('Failed to load page hero fallback image:', activeSrc);
        }}
      />
    );
  }

  return (
    <Image
      src={activeSrc}
      alt={alt}
      fill
      className="object-cover object-center"
      priority
      unoptimized={useUnoptimized}
      onError={() => {
        console.error('Failed to load page hero image, using fallback:', activeSrc);
        setUseFallback(true);
      }}
    />
  );
}
