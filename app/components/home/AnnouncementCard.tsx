'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeroAnnouncementItem } from '@/app/lib/types';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';
import { addLocaleToUrl } from '@/app/lib/locale';
import { useSearchParams } from 'next/navigation';

interface AnnouncementCardProps {
  title: string;
  announcement: HeroAnnouncementItem | null;
}

export default function AnnouncementCard({ title, announcement }: AnnouncementCardProps) {
  const searchParams = useSearchParams();
  const currentLocale = searchParams.get('locale') || 'en';
  const [currentIndex, setCurrentIndex] = useState(0);

  // For now, we have a single announcement, but structure supports multiple
  const announcements = announcement ? [announcement] : [];

  // Helper to preserve locale in links
  const getLocalizedUrl = (slug: string) => {
    return addLocaleToUrl(`/announcements/${slug}`, currentLocale);
  };

  if (!announcement || announcements.length === 0) {
    return null;
  }

  const currentAnnouncement = announcements[currentIndex];
  const imageUrl = currentAnnouncement.image
    ? getOptimizedImageUrl(currentAnnouncement.image, 'medium') || 
      getStrapiImageUrl(currentAnnouncement.image)
    : null;

  const isLocalhost = imageUrl?.includes('localhost') || false;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : announcements.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < announcements.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="rounded-xl bg-white border border-green-500/40 p-6 shadow-lg">
      {/* Title */}
      <h2 className="text-gray-900 text-xl font-bold mb-4">{title}</h2>

      {/* Announcement Content */}
      <div className="space-y-4">
        {/* Image */}
        {imageUrl && (
          <div className="w-full h-48 rounded-lg overflow-hidden border border-green-500/20">
            <Image
              src={imageUrl}
              alt={currentAnnouncement.title}
              width={800}
              height={400}
              className="object-cover w-full h-full"
              unoptimized={isLocalhost}
            />
          </div>
        )}

        {/* Summary Text */}
        {currentAnnouncement.summary && (
          <p className="text-gray-700 text-sm leading-relaxed">
            {currentAnnouncement.summary}
          </p>
        )}

        {/* Navigation Arrows */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={handlePrevious}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={announcements.length <= 1}
            aria-label="Previous announcement"
          >
            <svg
              className="w-4 h-4 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={announcements.length <= 1}
            aria-label="Next announcement"
          >
            <svg
              className="w-4 h-4 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}














