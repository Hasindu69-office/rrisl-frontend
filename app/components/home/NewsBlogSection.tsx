'use client';

import React from 'react';
import Image from 'next/image';
import GradientTag from '@/app/components/ui/GradientTag';
import FeaturedArticleCard from './FeaturedArticleCard';
import SmallArticleCard from './SmallArticleCard';

interface Article {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description?: string;
  author: string;
  date: string;
  link: string;
}

interface NewsBlogSectionProps {
  featuredArticle?: Article;
  smallArticles?: Article[];
}

/**
 * News & Blog Section Component
 * Features a light green background with pattern, white rounded container,
 * header with tag and title, featured article on left, and small articles on right
 */
export default function NewsBlogSection({
  featuredArticle,
  smallArticles = [],
}: NewsBlogSectionProps) {
  // Default data if not provided
  const defaultFeaturedArticle: Article = {
    imageSrc: '/images/section6_img1.png',
    imageAlt: 'Rooftop garden with city skyline',
    title: 'New Chemical Cocktail for Circular Leaf Spot Disease (Pestalotiopsis) in Rubber Plantations',
    description: 'Our researchers are developing advanced planting materials, disease-resistant clones, and modern agronomic techniques to increase field productivity while minimizing environmental impact.',
    author: 'Graphics.lk',
    date: 'August 23, 2025',
    link: '#',
  };

  const defaultSmallArticles: Article[] = [
    {
      imageSrc: '/images/section6_img2.png',
      imageAlt: 'Team members in front of greenhouse',
      title: 'Latex harvesting begins in the North-Central Province',
      author: 'Graphics.lk',
      date: 'August 23, 2025',
      link: '#',
    },
    {
      imageSrc: '/images/section6_img1.png',
      imageAlt: 'Rooftop garden with city skyline',
      title: 'Latex harvesting begins in the North-Central Province',
      author: 'Graphics.lk',
      date: 'August 23, 2025',
      link: '#',
    },
    {
      imageSrc: '/images/section6_img3.png',
      imageAlt: 'Beautiful landscaped garden with pond',
      title: 'Latex harvesting begins in the North-Central Province',
      author: 'Graphics.lk',
      date: 'August 23, 2025',
      link: '#',
    },
  ];

  const featured = featuredArticle || defaultFeaturedArticle;
  const articles = smallArticles.length > 0 ? smallArticles : defaultSmallArticles;

  return (
    <section className="relative pb-16 md:pb-24 overflow-hidden">
      {/* Background Image - Centered with 48px margins and 100px radius */}
      <div 
        className="absolute inset-y-0"
        style={{
          left: '48px',
          right: '48px',
          backgroundImage: 'url(/images/section6_bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat',
          borderRadius: '100px',
        }}
      >
        {/* Background overlay for better readability */}
        <div className="absolute inset-0 bg-[#E8F5E9]/30 rounded-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10" style={{ paddingTop: '52px' }}>
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-12">
          {/* News & Blog Tag */}
          <div className="mb-6">
            <GradientTag 
              text="News & Blog"
              className="inline-block"
              gradientFrom="#20C997"
              gradientTo="#A1DF0A"
              backgroundColor="transparent"
              textColor="#2E7D32"
            />
          </div>

          {/* Title */}
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
            style={{
              lineHeight: '130%',
            }}
          >
            <span className="text-[#0F3F1D]">Tips, Stories, and Updates from</span>
            <br />
            <span className="bg-gradient-to-r from-[#20C997] to-[#A1DF0A] bg-clip-text text-transparent">
              Our Research Institute
            </span>
          </h2>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Featured Article - Left Column */}
          <div>
            <FeaturedArticleCard
              imageSrc={featured.imageSrc}
              imageAlt={featured.imageAlt}
              title={featured.title}
              description={featured.description || ''}
              author={featured.author}
              date={featured.date}
              link={featured.link}
            />
          </div>

          {/* Small Articles - Right Column */}
          <div className="space-y-6">
            {articles.map((article, index) => (
              <SmallArticleCard
                key={index}
                imageSrc={article.imageSrc}
                imageAlt={article.imageAlt}
                title={article.title}
                author={article.author}
                date={article.date}
                link={article.link}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

