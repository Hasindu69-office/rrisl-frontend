'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import GradientTag from '@/app/components/ui/GradientTag';
import GradientTitle from '@/app/components/ui/GradientTitle';
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

  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);

  // Detect when the section scrolls into view
  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasEnteredView(true);
            observer.disconnect();
          }
        });
      },
      {
        root: null,
        threshold: 0.2,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative pb-16 md:pb-24 overflow-hidden"
    >
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
          <GradientTitle
            part1="Tips, Stories, and Updates from"
            part2="Our Research Institute"
            part1Color="dark-green"
            size="md"
            align="center"
            className="font-bold"
            style={{ lineHeight: '130%' }}
          />
        </div>

        {/* Articles Grid */}
        <div className="pl-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Featured Article - Left Column */}
          <div
            style={{
              opacity: hasEnteredView ? 1 : 0,
              transform: hasEnteredView ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 600ms ease-out, transform 600ms ease-out',
              transitionDelay: '0.1s',
            }}
          >
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
          <div className="space-y-8 mt-1">
            {articles.map((article, index) => (
              <div
                key={index}
                style={{
                  opacity: hasEnteredView ? 1 : 0,
                  transform: hasEnteredView ? 'translateY(0)' : 'translateY(-25px)',
                  transition: 'opacity 600ms ease-out, transform 600ms ease-out',
                  transitionDelay: hasEnteredView ? `${0.4 + index * 0.2}s` : '0s',
                }}
              >
                <SmallArticleCard
                  imageSrc={article.imageSrc}
                  imageAlt={article.imageAlt}
                  title={article.title}
                  author={article.author}
                  date={article.date}
                  link={article.link}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

