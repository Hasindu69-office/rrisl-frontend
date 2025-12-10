'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GradientTag from '@/app/components/ui/GradientTag';
import Button from '@/app/components/ui/Button';

interface ContentSectionProps {
  // Image props
  imageSrc: string;
  imageAlt: string;
  
  // Gradient tag props
  tagText: string;
  gradientFrom?: string;
  gradientTo?: string;
  
  // Title props
  titlePart1: string; // "Advancing Rubber" - dark green
  titlePart2: string; // "Research for Sri Lanka's Future" - lime green
  
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
  gradientFrom = '#20C997',
  gradientTo = '#A1DF0A',
  titlePart1,
  titlePart2,
  description,
  buttonText = 'Read More',
  buttonLink = '#',
}: ContentSectionProps) {
  return (
    <section className="relative bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left Side - Image */}
          <div className="flex-shrink-0 w-full lg:w-1/2">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="flex-1 w-full lg:w-1/2 flex flex-col gap-6">
            {/* Gradient Tag */}
            <div>
              <GradientTag 
                text={tagText}
                className="inline-block"
                gradientFrom={gradientFrom}
                gradientTo={gradientTo}
              />
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
              <span className="text-[#0F3F1D]">{titlePart1}</span>
              <br />
              <span className="text-[#A1DF0A]">{titlePart2}</span>
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl">
              {description}
            </p>

            {/* Read More Button */}
            <div className="pt-2">
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

