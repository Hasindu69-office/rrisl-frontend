import React from 'react';
import Image from 'next/image';
import Header from '../header/Header';
import HeroCutout from './HeroCutout';
import { BreadcrumbItem } from './Breadcrumb';

interface PageHeroProps {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  backgroundImage?: string;
  backgroundImageAlt?: string;
  locale?: string;
}

export default async function PageHero({
  title,
  breadcrumbItems,
  backgroundImage = '/images/aboutus_heroimg.jpg',
  backgroundImageAlt = 'Page background',
  locale = 'en',
}: PageHeroProps) {
  return (
    <section className="relative min-h-[200px] sm:min-h-[250px] md:min-h-[350px] lg:min-h-[500px] xl:min-h-[600px] flex flex-col overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Image
          src={backgroundImage}
          alt={backgroundImageAlt}
          fill
          className="object-cover object-center"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, #042012 0%, #223A2D 100%)',
            opacity: 0.85,
          }}
        />
        <div className="absolute inset-0 bg-[#042012]/20" />
      </div>

      <div className="relative z-50">
        <Header locale={locale} />
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1440px] w-full pb-20 md:pb-24">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white">
              {title}
            </h1>
          </div>
        </div>
      </div>

      <HeroCutout breadcrumbItems={breadcrumbItems} />
    </section>
  );
}
