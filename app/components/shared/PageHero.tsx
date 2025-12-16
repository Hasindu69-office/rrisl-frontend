import React from 'react';
import Image from 'next/image';
import Header from '../header/Header';
import Breadcrumb from './Breadcrumb';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  backgroundImage: string;
  backgroundImageAlt?: string;
  locale?: string;
}

export default async function PageHero({
  title,
  breadcrumbItems,
  backgroundImage,
  backgroundImageAlt = 'Page background',
  locale = 'en',
}: PageHeroProps) {

  return (
    <section className="relative min-h-[500px] md:min-h-[600px] flex flex-col">
      {/* Background Image with Radial Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Image
          src={backgroundImage}
          alt={backgroundImageAlt}
          fill
          className="object-cover object-center"
          priority
        />
        {/* Radial Gradient Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, #042012 0%, #223A2D 100%)',
            opacity: 0.85,
          }}
        />
        {/* Additional subtle pattern overlay if needed */}
        <div className="absolute inset-0 bg-[#042012]/20" />
      </div>

      {/* Header Section */}
      <div className="relative z-50">
        <Header locale={locale} />
      </div>

      {/* Hero Content Section */}
      <div className="flex-1 flex items-center justify-center relative z-10 mt-20 md:mt-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1440px] w-full">
          <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
            {/* Page Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white">
              {title}
            </h1>

            {/* Breadcrumb */}
            <div className="mt-2">
              <Breadcrumb items={breadcrumbItems} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

