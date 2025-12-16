'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeroNewsItem } from '@/app/lib/types';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';
import { addLocaleToUrl } from '@/app/lib/locale';
import { useSearchParams } from 'next/navigation';

interface NewsCardProps {
  title: string;
  newsItems: HeroNewsItem[];
}

/**
 * Format date to readable format (e.g., "Fri, Jun 5, 2026")
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export default function NewsCard({ title, newsItems }: NewsCardProps) {
  const searchParams = useSearchParams();
  const currentLocale = searchParams.get('locale') || 'en';

  // Helper to preserve locale in links
  const getLocalizedUrl = (slug: string) => {
    return addLocaleToUrl(`/news/${slug}`, currentLocale);
  };

  if (!newsItems || newsItems.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl bg-green-900 border border-green-500/40 p-6 shadow-lg">
      {/* Title */}
      <h2 className="text-white text-xl font-bold mb-4">{title}</h2>

      {/* News Items List */}
      <div className="space-y-4">
        {newsItems.map((item) => {
          const imageUrl = item.featuredImage
            ? getOptimizedImageUrl(item.featuredImage, 'thumbnail') || 
              getStrapiImageUrl(item.featuredImage)
            : null;
          
          const isLocalhost = imageUrl?.includes('localhost') || false;
          const formattedDate = formatDate(item.publishedDate || item.publishedAt || '');

          return (
            <Link
              key={item.id}
              href={getLocalizedUrl(item.slug)}
              className="flex gap-3 hover:opacity-80 transition-opacity"
            >
              {/* Thumbnail Image */}
              {imageUrl && (
                <div className="flex-shrink-0 w-20 h-20 rounded overflow-hidden border border-green-500/30">
                  <Image
                    src={imageUrl}
                    alt={item.title}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                    unoptimized={isLocalhost}
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-green-300 text-xs">{formattedDate}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}















