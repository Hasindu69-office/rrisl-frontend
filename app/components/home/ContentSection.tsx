'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import GradientTag from '@/app/components/ui/GradientTag';
import Button from '@/app/components/ui/Button';
import GradientTitle from '@/app/components/ui/GradientTitle';
import { addLocaleToUrl } from '@/app/lib/locale';
import type { HeroCta } from '@/app/lib/types';

interface ContentSectionProps {
  imageSrc: string;
  imageAlt: string;
  tagText: string;
  titlePart1: string;
  titlePart2: string;
  description: string;
  cta?: HeroCta | null;
}

/**
 * Reusable content section component with image on left and content on right
 * Based on the announcement section design
 */
export default function ContentSection({
  imageSrc,
  imageAlt,
  tagText,
  titlePart1,
  titlePart2,
  description,
  cta,
}: ContentSectionProps) {
  const searchParams = useSearchParams();
  const currentLocale = searchParams.get('locale') || 'en';

  const href = cta?.linkType === 'internal' && cta.url
    ? addLocaleToUrl(cta.url, currentLocale)
    : cta?.url || '#';

  return (
    <section className="relative bg-white pt-0 md:pt-24 lg:pt-24 pb-8 md:pb-24 lg:pb-24">
      <div className="flex flex-col lg:flex-row items-center w-full">
        {/* Left Side - Image (Full Width, extends to left edge) */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-start lg:ml-8 relative">
          {/* Spacer for mobile/tablet to maintain height since image is absolute */}
          <div className="w-full pt-[100%] lg:pt-0 lg:hidden"></div>

          <div
            className="absolute lg:relative top-0 left-0 w-full lg:w-auto h-full lg:h-auto lg:ml-8 xl:ml-18 mt-[-115px] md:mt-[-250px] lg:mt-2 xl:mt-[0px] z-10"
            style={{
              // Mobile/Tablet: Absolute positioning logic handled by classes above
              // Desktop: Keep original sizing
            }}
          >
            <div
              className="relative w-full h-full lg:w-[90%] xl:w-[600px] lg:max-w-full lg:aspect-square"
            >
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={854}
                height={854}
                className="object-cover rounded-lg w-full h-full lg:w-full lg:h-full"
                priority
              />
            </div>
          </div>
        </div>

        {/* Right Side - Content (Left-aligned with image) */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 px-4 lg:px-0 lg:-ml-8 xl:-ml-12 mt-[-50px] md:mt-[-200px] lg:mt-[0px] xl:mt-0">
          <div className="w-full">
            {/* Gradient Tag - Gradient is constant (#20C997 to #A1DF0A), only text changes */}
            <div>
              <GradientTag
                text={tagText}
                className="inline-block"
                gradientFrom="#20C997"
                gradientTo="#A1DF0A"
              />
            </div>

            {/* Title */}
            {/* Title */}
            <div className="mt-6">
              <GradientTitle
                part1={titlePart1}
                part2={titlePart2}
                part1Color="dark-green"
                size="custom"
                className="font-bold text-[28px] md:text-[40px] lg:text-[50px]"
                style={{ lineHeight: '130%' }}
              />
            </div>

            {/* Description */}
            <p
              className="text-gray-700 mt-6 max-w-2xl text-[14px] md:text-[16px] lg:text-[18px] leading-[1.5] lg:leading-[35px]"
              style={{
                fontWeight: 400, // regular
              }}
            >
              {description}
            </p>

            {/* Read More Button */}
            {cta && (
              <div className="pt-2 mt-6">
                {cta.linkType === 'internal' ? (
                  <Link href={href}>
                    <Button
                      variant="primary"
                      size="sm"
                      className="!w-[150px] !h-[48px] md:!w-[178px] md:!h-[56px] !rounded-[30px] !text-sm md:!text-base"
                    >
                      {cta.label}
                    </Button>
                  </Link>
                ) : (
                  <a
                    href={href}
                    target={cta.openInNewTab ? '_blank' : '_self'}
                    rel={cta.openInNewTab ? 'noopener noreferrer' : undefined}
                  >
                    <Button
                      variant="primary"
                      size="sm"
                      className="!w-[150px] !h-[48px] md:!w-[178px] md:!h-[56px] !rounded-[30px] !text-sm md:!text-base"
                    >
                      {cta.label}
                    </Button>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

