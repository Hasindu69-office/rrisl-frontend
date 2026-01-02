'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GradientTag from '@/app/components/ui/GradientTag';
import Button from '@/app/components/ui/Button';
import GradientTitle from '@/app/components/ui/GradientTitle';

interface ContentSectionProps {
  // Image props
  imageSrc: string;
  imageAlt: string;
  
  // Gradient tag props
  tagText: string; // Text inside the gradient tag (changeable)
  
  // Title props
  titlePart1: string; // "Advancing Rubber" - dark green
  titlePart2: string; // "Research for Sri Lanka's Future" - with gradient
  
  // Content props
  description: string;
  
  // Button props
  buttonText?: string;
  buttonLink?: string;
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
  buttonText = 'Read More',
  buttonLink = '#',
}: ContentSectionProps) {
  return (
    <section className="relative bg-white py-16 md:py-24 overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center w-full">
        {/* Left Side - Image (Full Width, extends to left edge) */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-start lg:ml-8">
          <div 
            className="relative lg:ml-18"
            style={{
              width: '700px',
              height: '700px',
              maxWidth: '100%',
              aspectRatio: '1 / 1',
            }}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={854}
              height={854}
              className="object-cover rounded-lg w-full h-full"
              priority
            />
          </div>
        </div>

        {/* Right Side - Content (Left-aligned with image) */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 px-4 lg:px-0 lg:-ml-8 xl:-ml-12">
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
            <div className="mt-6">
              <GradientTitle
                part1={titlePart1}
                part2={titlePart2}
                part1Color="dark-green"
                size="custom"
                customSize="50px"
                className="font-bold"
                style={{ lineHeight: '130%' }}
              />
            </div>

            {/* Description */}
            <p 
              className="text-gray-700 mt-6 max-w-2xl"
              style={{
                fontSize: '18px',
                fontWeight: 400, // regular
                lineHeight: '35px',
              }}
            >
              {description}
            </p>

            {/* Read More Button */}
            <div className="pt-2 mt-6">
              <Link href={buttonLink}>
                <Button variant="primary" size="md">
                  {buttonText}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

