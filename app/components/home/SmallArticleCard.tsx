'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';

interface SmallArticleCardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  categoryLabel: string;
  date: string;
  link: string;
}

/**
 * Small Article Card Component
 * Used for displaying smaller article previews in the News & Blog section
 * Features: date above image, image, title, and metadata bar with category label
 */
export default function SmallArticleCard({
  imageSrc,
  imageAlt,
  title,
  categoryLabel,
  date,
  link,
}: SmallArticleCardProps) {
  return (
    <Link href={link} className="block group w-full">
      <div
        className="bg-white overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col xl:flex-row mb-4"
        style={{
          border: '1px solid #A1DF0A',
          borderRadius: '30px',
        }}
      >
        {/* Image - Top on mobile, Left on desktop */}
        <div className="relative w-full xl:w-[276px] h-32 xl:h-[200px] flex-shrink-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized={isLocalhostAssetUrl(imageSrc)}
            style={{
              borderTopLeftRadius: '30px',
              borderTopRightRadius: '30px',
              borderBottomLeftRadius: '0px',
            }}
          />
          {/* Reset border radius for desktop view via utility classes or conditional logic if necessary, 
              but since we use style object for border, let's stick to a clean approach */}
          <div className="hidden xl:block absolute inset-0">
            <div className="relative w-full h-full">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized={isLocalhostAssetUrl(imageSrc)}
                style={{
                  borderTopLeftRadius: '30px',
                  borderBottomLeftRadius: '30px',
                  borderTopRightRadius: '0px',
                }}
              />
            </div>
          </div>
        </div>

        {/* Content - Bottom on mobile, Right on desktop */}
        <div className="flex-1 flex flex-col p-3 xl:p-6 justify-center">
          {/* Date */}
          <div className="mb-1 xl:mb-2">
            <div className="flex items-center gap-2 text-[#2E7D32]">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className="font-bold text-[12px] xl:text-[18px]"
                style={{
                  lineHeight: '1.5',
                }}
              >
                {date}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3
            className="text-[#0F3F1D] font-bold line-clamp-2 group-hover:text-[#2E7D32] transition-colors mb-1 xl:mb-2 text-[14px] xl:text-[18px]"
            style={{
              lineHeight: '1.4',
            }}
          >
            {title}
          </h3>

          {/* Dotted Line */}
          <div
            className="mb-2 xl:mb-3"
            style={{
              width: '100%',
              height: '1px',
              borderTop: '1px dashed #2E7D32',
            }}
          ></div>

          {/* Metadata Bar */}
          <div className="flex items-center gap-3 xl:gap-4 text-[#2E7D32]">
            <div className="flex items-center gap-2">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20M4 19.5C4 20.163 4.26339 20.7989 4.73223 21.2678C5.20107 21.7366 5.83696 22 6.5 22H20C20.663 22 21.2989 21.7366 21.7678 21.2678C22.2366 20.7989 22.5 20.163 22.5 19.5V9.5C22.5 8.83696 22.2366 8.20107 21.7678 7.73223C21.2989 7.26339 20.663 7 20 7H6.5C5.83696 7 5.20107 7.26339 4.73223 7.73223C4.26339 8.20107 4 8.83696 4 9.5V19.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-bold text-[12px] xl:text-[18px]">{categoryLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

