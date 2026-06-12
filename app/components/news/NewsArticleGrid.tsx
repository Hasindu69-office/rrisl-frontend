'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { addLocaleToUrl } from '@/app/lib/locale';
import { formatArticleDate, type NewsArticle } from '@/app/lib/news/pageData';

interface NewsArticleGridProps {
  articles: NewsArticle[];
  locale: string;
  selectedCategory: string;
}

function articleHref(slug: string, locale: string) {
  return addLocaleToUrl(`/news/${slug}`, locale);
}

function ArticleCard({ article, locale }: { article: NewsArticle; locale: string }) {
  return (
    <Link
      href={articleHref(article.slug, locale)}
      data-news-filter-item
      className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-[#DCECCB] bg-white shadow-[0_18px_50px_rgba(15,63,29,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,63,29,0.14)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={article.featuredImage}
          alt={article.featuredImageAlt}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <span className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#2E7D32]">
          {article.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-[#557062]">
          <CalendarDays className="h-4 w-4 text-[#2E7D32]" />
          {formatArticleDate(article.publishedDate)}
        </div>
        <h2 className="text-xl font-bold leading-snug text-[#0F3F1D] transition group-hover:text-[#2E7D32]">
          {article.title}
        </h2>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#557062]">{article.summary}</p>
        <div className="mt-6 flex items-center justify-between border-t border-dashed border-[#A1DF0A]/70 pt-5 text-sm font-bold text-[#2E7D32]">
          <span>Read article</span>
          <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

export default function NewsArticleGrid({
  articles,
  locale,
  selectedCategory,
}: NewsArticleGridProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const articleKey = useMemo(
    () => articles.map((article) => article.slug).join('|'),
    [articles]
  );

  useLayoutEffect(() => {
    if (!panelRef.current || typeof window === 'undefined') {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const panel = panelRef.current;

    const context = gsap.context(() => {
      gsap.set(panel, {
        autoAlpha: 0,
        y: 40,
      });

      gsap.fromTo(
        panel,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.62,
          ease: 'power3.out',
          overwrite: 'auto',
          clearProps: 'opacity,visibility,transform',
        }
      );
    }, panel);

    return () => context.revert();
  }, [articleKey, selectedCategory]);

  return (
    <div ref={panelRef} key={selectedCategory}>
      {articles.length > 0 ? (
        <div className="mt-9 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} locale={locale} />
          ))}
        </div>
      ) : (
        <div
          className="mt-9 rounded-[26px] border border-dashed border-[#A1DF0A] bg-white p-10 text-center"
          data-news-filter-item
        >
          <h2 className="text-2xl font-bold text-[#0F3F1D]">No articles found</h2>
          <p className="mt-3 text-[#557062]">Try another category to explore more updates.</p>
        </div>
      )}
    </div>
  );
}
