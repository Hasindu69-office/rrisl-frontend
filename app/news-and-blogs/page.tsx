import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, ChevronRight, Newspaper, PenLine } from 'lucide-react';
import DepartmentAnimatedSection from '../components/department/DepartmentAnimatedSection';
import NewsArticleGrid from '../components/news/NewsArticleGrid';
import PageHero from '../components/shared/PageHero';
import { addLocaleToUrl, normalizeLocale } from '../lib/locale';
import {
  getAllNewsArticles,
  getNewsAndBlogPage,
  getNewsCategories,
} from '../lib/strapi';
import { isLocalhostAssetUrl } from '../lib/strapi';
import {
  filterArticlesByCategory,
  formatArticleDate,
  getFeaturedArticle,
  getNewsEmptyState,
  getPrimaryCategory,
  mapNewsArticles,
  mapNewsPageData,
  NEWS_AND_BLOGS_ROUTE,
} from '../lib/news/pageData';

interface NewsAndBlogsPageProps {
  searchParams: Promise<{ locale?: string; category?: string; page?: string }>;
}

const NEWS_PAGE_SIZE = 6;
const NEWS_SECTION_ID = 'all-news';

function articleHref(slug: string, locale: string) {
  return addLocaleToUrl(`${NEWS_AND_BLOGS_ROUTE}/${slug}`, locale);
}

function categoryHref(categorySlug: string, locale: string) {
  const base =
    categorySlug === 'all'
      ? NEWS_AND_BLOGS_ROUTE
      : `${NEWS_AND_BLOGS_ROUTE}?category=${encodeURIComponent(categorySlug)}`;
  return addLocaleToUrl(base, locale);
}

function paginationHref(
  page: number,
  locale: string,
  selectedCategory: string
) {
  const params = new URLSearchParams();

  if (selectedCategory !== 'all') {
    params.set('category', selectedCategory);
  }

  if (page > 1) {
    params.set('page', `${page}`);
  }

  const queryString = params.toString();
  const base = queryString ? `${NEWS_AND_BLOGS_ROUTE}?${queryString}` : NEWS_AND_BLOGS_ROUTE;
  return `${addLocaleToUrl(base, locale)}#${NEWS_SECTION_ID}`;
}

function ArticleMeta({
  categoryLabel,
  publishedDate,
  light = false,
}: {
  categoryLabel?: string;
  publishedDate: string;
  light?: boolean;
}) {
  const textColor = light ? 'text-white/85' : 'text-[#557062]';

  return (
    <div className={`flex flex-wrap items-center gap-3 text-sm ${textColor}`}>
      {categoryLabel ? (
        <span className="inline-flex items-center gap-1.5">
          <Newspaper className="h-4 w-4" />
          {categoryLabel}
        </span>
      ) : null}
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className="h-4 w-4" />
        {formatArticleDate(publishedDate)}
      </span>
    </div>
  );
}

export default async function NewsAndBlogsPage({ searchParams }: NewsAndBlogsPageProps) {
  const params = await searchParams;
  const locale = normalizeLocale(params.locale);
  const selectedCategory = params.category || 'all';
  const rawPage = Number.parseInt(params.page || '1', 10);

  const [
    page,
    fallbackPage,
    localizedCategories,
    fallbackCategories,
    localizedArticles,
    fallbackArticles,
  ] = await Promise.all([
    getNewsAndBlogPage(locale),
    locale !== 'en' ? getNewsAndBlogPage('en') : Promise.resolve(null),
    getNewsCategories(locale),
    locale !== 'en' ? getNewsCategories('en') : Promise.resolve([]),
    getAllNewsArticles(locale),
    locale !== 'en' ? getAllNewsArticles('en') : Promise.resolve([]),
  ]);

  const pageData = mapNewsPageData(page, fallbackPage, localizedCategories, fallbackCategories);
  const emptyState = getNewsEmptyState(page || fallbackPage);
  const articles = mapNewsArticles(localizedArticles.length > 0 ? localizedArticles : fallbackArticles);
  const featuredArticle = getFeaturedArticle(articles);
  const filteredArticles = filterArticlesByCategory(articles, selectedCategory);
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / NEWS_PAGE_SIZE));
  const currentPage = Number.isNaN(rawPage) ? 1 : Math.min(Math.max(rawPage, 1), totalPages);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * NEWS_PAGE_SIZE,
    currentPage * NEWS_PAGE_SIZE
  );

  return (
    <div className="min-h-screen bg-white text-[#0F3F1D]">
      <PageHero
        title={pageData.hero.title}
        breadcrumbItems={pageData.hero.breadcrumbItems}
        backgroundImage={pageData.hero.backgroundImage}
        backgroundImageAlt={pageData.hero.backgroundImageAlt}
        locale={locale}
      />

      <DepartmentAnimatedSection y={30} duration={0.78} stagger={0.08}>
        <section className="relative mb-56 overflow-hidden px-4 py-16 md:px-6 md:py-24 lg:px-36">
          <div className="absolute inset-x-0 top-0 h-80 bg-white" />
          <div className="relative mx-auto w-full max-w-[1480px]">
            <div
              className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
              data-department-reveal
            >
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#A1DF0A]/70 bg-white px-4 py-2 text-sm font-bold text-[#2E7D32] shadow-sm">
                  <PenLine className="h-4 w-4" />
                  {pageData.labels.latestFromRrisl}
                </span>
                <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-tight text-[#0F3F1D] md:text-5xl">
                  {pageData.labels.topic}
                </h1>
              </div>
            </div>

            {featuredArticle ? (
              <Link
                href={articleHref(featuredArticle.slug, locale)}
                data-department-reveal
                className="group grid overflow-hidden rounded-[30px] bg-[#0F3F1D] shadow-[0_28px_80px_rgba(15,63,29,0.2)] lg:grid-cols-[1.05fr_0.95fr]"
              >
                <div className="relative min-h-[320px] overflow-hidden lg:min-h-[470px]">
                  <Image
                    src={featuredArticle.featuredImage}
                    alt={featuredArticle.featuredImageAlt}
                    fill
                    priority
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(min-width: 1768px) 777px, (min-width: 1024px) calc(52.5vw - 151px), 100vw"
                    unoptimized={isLocalhostAssetUrl(featuredArticle.featuredImage)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F3F1D]/55 to-transparent lg:hidden" />
                </div>
                <div className="flex flex-col justify-center p-7 md:p-10 lg:p-12">
                  <span className="mb-5 w-fit rounded-full bg-[#A1DF0A] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#0F3F1D]">
                    {pageData.labels.featured}
                  </span>
                  <ArticleMeta
                    categoryLabel={getPrimaryCategory(featuredArticle)?.label}
                    publishedDate={featuredArticle.publishedDate}
                    light
                  />
                  <h2 className="mt-5 text-3xl font-bold leading-tight text-white md:text-4xl">
                    {featuredArticle.title}
                  </h2>
                  <p className="mt-5 text-base leading-8 text-white/78">{featuredArticle.summary}</p>
                  <div className="mt-8 flex items-center gap-3 text-base font-bold text-[#A1DF0A]">
                    {pageData.labels.readFeaturedArticle}
                    <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ) : null}

            <div
              id={NEWS_SECTION_ID}
              className="mt-14 scroll-mt-32"
              data-department-reveal
            >
              <div className="flex flex-wrap gap-3">
                {pageData.categories.map((category) => {
                  const isActive = selectedCategory === category.slug;

                  return (
                    <Link
                      key={category.slug}
                      href={categoryHref(category.slug, locale)}
                      scroll={false}
                      className={`rounded-full border px-5 py-2.5 text-sm font-bold transition ${
                        isActive
                          ? 'border-[#2E7D32] bg-[#2E7D32] text-white shadow-[0_10px_24px_rgba(46,125,50,0.22)]'
                          : 'border-[#DCECCB] bg-white text-[#2E7D32] hover:border-[#A1DF0A]'
                      }`}
                    >
                      {category.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <NewsArticleGrid
              articles={paginatedArticles}
              locale={locale}
              selectedCategory={selectedCategory}
              readArticleLabel={pageData.labels.readArticle}
              emptyTitle={emptyState.title}
              emptyDescription={emptyState.description}
            />

            {filteredArticles.length > NEWS_PAGE_SIZE ? (
              <div
                className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm text-[#667085]"
                data-department-reveal
              >
                <Link
                  href={paginationHref(currentPage - 1, locale, selectedCategory)}
                  aria-disabled={currentPage === 1}
                  className={`flex items-center gap-2 transition ${
                    currentPage === 1
                      ? 'pointer-events-none opacity-40'
                      : 'hover:text-[#0F3F1D]'
                  }`}
                >
                  Previous
                </Link>

                {Array.from({ length: totalPages }, (_, index) => {
                  const page = index + 1;

                  return (
                    <Link
                      key={page}
                      href={paginationHref(page, locale, selectedCategory)}
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                        currentPage === page
                          ? 'bg-[#2E7D32] font-semibold text-white shadow-[0_8px_20px_rgba(46,125,50,0.25)]'
                          : 'text-[#98A2B3] hover:bg-[#F1F8F1] hover:text-[#0F3F1D]'
                      }`}
                    >
                      {page}
                    </Link>
                  );
                })}

                <Link
                  href={paginationHref(currentPage + 1, locale, selectedCategory)}
                  aria-disabled={currentPage === totalPages}
                  className={`flex items-center gap-2 transition ${
                    currentPage === totalPages
                      ? 'pointer-events-none opacity-40'
                      : 'hover:text-[#0F3F1D]'
                  }`}
                >
                  Next
                </Link>
              </div>
            ) : null}
          </div>
        </section>
      </DepartmentAnimatedSection>
    </div>
  );
}
