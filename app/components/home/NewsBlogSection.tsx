'use client';

import React, { useEffect, useRef, useState } from 'react';
import GradientTag from '@/app/components/ui/GradientTag';
import GradientTitle from '@/app/components/ui/GradientTitle';
import FeaturedArticleCard from './FeaturedArticleCard';
import SmallArticleCard from './SmallArticleCard';

interface Article {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description?: string;
  categoryLabel: string;
  date: string;
  link: string;
}

interface NewsBlogSectionProps {
  featuredArticle?: Article | null;
  smallArticles?: Article[];
  tagText?: string;
  titlePart1?: string;
  titlePart2?: string;
  readMoreLabel?: string;
}

/**
 * News & Blog Section Component
 * Features a light green background with pattern, white rounded container,
 * header with tag and title, featured article on left, and small articles on right
 */
export default function NewsBlogSection({
  featuredArticle,
  smallArticles = [],
  tagText = 'News and Blogs',
  titlePart1 = 'Tips, Stories, and Updates from',
  titlePart2 = 'Our Research Institute',
  readMoreLabel = 'Read more',
}: NewsBlogSectionProps) {
  const featured = featuredArticle || null;
  const articles = smallArticles;

  if (!featured && articles.length === 0) {
    return null;
  }

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
      {/* Background Image - Centered with responsive margins and radius */}
      <div
        className="absolute inset-y-0 left-4 right-4 xl:left-12 xl:right-12 rounded-[30px] xl:rounded-[100px]"
        style={{
          backgroundImage: 'url(/images/section6_bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat',
        }}
      >
        {/* Background overlay for better readability */}
        <div className="absolute inset-0 bg-[#E8F5E9]/30 rounded-[30px] xl:rounded-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-10 xl:pt-[52px]">
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-12">
          {/* News & Blog Tag */}
          <div className="mb-6">
            <GradientTag
              text={tagText}
              className="inline-block"
              gradientFrom="#20C997"
              gradientTo="#A1DF0A"
              backgroundColor="transparent"
              textColor="#2E7D32"
            />
          </div>

          {/* Title */}
          <GradientTitle
            part1={titlePart1}
            part2={titlePart2}
            part1Color="dark-green"
            size="md"
            align="center"
            className="font-bold"
            style={{ lineHeight: '130%' }}
          />
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-8 xl:px-12 2xl:px-16">
          {/* Featured Article - Left Column */}
          {featured ? (
            <div
              className="m-[30px] xl:m-0"
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
                categoryLabel={featured.categoryLabel}
                date={featured.date}
                link={featured.link}
                readMoreLabel={readMoreLabel}
              />
            </div>
          ) : (
            <div />
          )}

          {/* Small Articles - Right Column */}
          <div className="xl:space-y-8 xl:mt-1">
            {articles.map((article, index) => (
              <div
                key={index}
                className="m-[30px] xl:m-0"
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
                  categoryLabel={article.categoryLabel}
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

