import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays, ChevronRight, Newspaper } from 'lucide-react';
import DepartmentAnimatedSection from '../../components/department/DepartmentAnimatedSection';
import PageHero from '../../components/shared/PageHero';
import { addLocaleToUrl, normalizeLocale } from '../../lib/locale';
import { getAllNewsArticles, getNewsAndBlogPage, getNewsArticleBySlug } from '../../lib/strapi';
import { isLocalhostAssetUrl } from '../../lib/strapi';
import {
  formatArticleDate,
  getPrimaryCategory,
  getRelatedArticles,
  mapNewsArticle,
  mapNewsArticles,
  mapNewsPageData,
  NEWS_AND_BLOGS_ROUTE,
} from '../../lib/news/pageData';

interface NewsAndBlogsDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ locale?: string }>;
}

export async function generateStaticParams() {
  const articles = await getAllNewsArticles('en');
  return articles
    .map((article) => article?.slug?.trim())
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }));
}

export default async function NewsAndBlogsDetailPage({
  params,
  searchParams,
}: NewsAndBlogsDetailPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const locale = normalizeLocale(query.locale);

  const [
    page,
    fallbackPage,
    articleEntity,
    fallbackArticleEntity,
    localizedArticles,
    fallbackArticles,
  ] = await Promise.all([
    getNewsAndBlogPage(locale),
    locale !== 'en' ? getNewsAndBlogPage('en') : Promise.resolve(null),
    getNewsArticleBySlug(slug, locale),
    locale !== 'en' ? getNewsArticleBySlug(slug, 'en') : Promise.resolve(null),
    getAllNewsArticles(locale),
    locale !== 'en' ? getAllNewsArticles('en') : Promise.resolve([]),
  ]);

  const pageData = mapNewsPageData(page, fallbackPage, [], []);
  const article = mapNewsArticle(articleEntity || fallbackArticleEntity);
  const homeBreadcrumbItem = pageData.hero.breadcrumbItems[0] || { label: 'Home', href: '/' };
  const listingBreadcrumbItem = pageData.hero.breadcrumbItems[1] || {
    label: pageData.labels.title,
    href: NEWS_AND_BLOGS_ROUTE,
  };

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(
    article,
    mapNewsArticles(localizedArticles.length > 0 ? localizedArticles : fallbackArticles)
  );
  const backHref = addLocaleToUrl(NEWS_AND_BLOGS_ROUTE, locale);

  return (
    <div className="min-h-screen overflow-x-clip bg-white text-[#0F3F1D]">
      <PageHero
        title={pageData.labels.title}
        breadcrumbItems={[
          homeBreadcrumbItem,
          listingBreadcrumbItem.href
            ? listingBreadcrumbItem
            : { ...listingBreadcrumbItem, href: NEWS_AND_BLOGS_ROUTE },
          { label: pageData.labels.article },
        ]}
        backgroundImage={article.featuredImage}
        backgroundImageAlt={article.featuredImageAlt}
        locale={locale}
      />

      <DepartmentAnimatedSection y={28} duration={0.76} stagger={0.09}>
        <article className="mb-56 px-4 py-14 md:px-6 md:py-20 lg:px-36">
          <div className="mx-auto w-full max-w-[1480px]">
            <Link
              href={backHref}
              data-department-reveal
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#DCECCB] bg-white px-5 py-2.5 text-sm font-bold text-[#2E7D32] shadow-sm transition hover:border-[#A1DF0A]"
            >
              <ArrowLeft className="h-4 w-4" />
              {pageData.labels.backToAllArticles}
            </Link>

            <div className="grid min-w-0 gap-9 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className="min-w-0">
                <div
                  className="overflow-hidden rounded-[30px] bg-white shadow-[0_24px_70px_rgba(15,63,29,0.12)]"
                  data-department-reveal
                >
                  <div className="relative aspect-[16/9] min-h-[280px] overflow-hidden">
                    <Image
                      src={article.featuredImage}
                      alt={article.featuredImageAlt}
                      fill
                      priority
                      className="object-cover"
                      sizes="(min-width: 1768px) 1104px, (min-width: 1024px) calc(100vw - 18rem - 376px), 100vw"
                      unoptimized={isLocalhostAssetUrl(article.featuredImage)}
                    />
                    {getPrimaryCategory(article) ? (
                      <div className="absolute left-4 top-4 max-w-[calc(100%-2rem)] rounded-full bg-[#A1DF0A] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#0F3F1D] sm:left-6 sm:top-6 sm:tracking-[0.16em]">
                        {getPrimaryCategory(article)?.label}
                      </div>
                    ) : null}
                  </div>

                  <div className="min-w-0 p-6 md:p-10">
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-[#557062]">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-[#2E7D32]" />
                        {formatArticleDate(article.publishedDate)}
                      </span>
                      {getPrimaryCategory(article) ? (
                        <span className="inline-flex items-center gap-2">
                          <Newspaper className="h-4 w-4 text-[#2E7D32]" />
                          {getPrimaryCategory(article)?.label}
                        </span>
                      ) : null}
                    </div>

                    <h1 className="mt-6 [overflow-wrap:anywhere] text-3xl font-bold leading-tight text-[#0F3F1D] md:text-5xl">
                      {article.title}
                    </h1>
                    <p className="mt-5 [overflow-wrap:anywhere] border-l-4 border-[#A1DF0A] pl-5 text-lg leading-8 text-[#36543F]">
                      {article.summary}
                    </p>

                    <div className="mt-9 min-w-0 space-y-6 [overflow-wrap:anywhere] text-base leading-8 text-[#36543F] md:text-lg">
                      {article.content.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {article.galleryImages.length > 0 ? (
                  <section className="mt-10" data-department-reveal>
                    <h2 className="text-2xl font-bold text-[#0F3F1D]">
                      {pageData.labels.articleGallery}
                    </h2>
                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                      {article.galleryImages.map((image) => (
                        <div
                          key={image.src}
                          className="relative aspect-[4/3] overflow-hidden rounded-[24px] shadow-[0_18px_50px_rgba(15,63,29,0.1)]"
                        >
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className="object-cover"
                            sizes="(min-width: 768px) 50vw, 100vw"
                            unoptimized={isLocalhostAssetUrl(image.src)}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>

              <aside className="space-y-7 lg:sticky lg:top-8 lg:self-start" data-department-reveal>
                {relatedArticles.length > 0 ? (
                  <div className="rounded-[26px] border border-[#DCECCB] bg-white p-6 shadow-[0_18px_50px_rgba(15,63,29,0.08)]">
                    <h2 className="text-xl font-bold text-[#0F3F1D]">{pageData.labels.relatedArticles}</h2>
                    <div className="mt-5 space-y-4">
                      {relatedArticles.map((related) => (
                        <Link
                          key={related.slug}
                          href={addLocaleToUrl(`${NEWS_AND_BLOGS_ROUTE}/${related.slug}`, locale)}
                          className="group grid grid-cols-[86px_1fr] gap-4 rounded-[18px] p-2 transition hover:bg-[#F7FAF3]"
                        >
                          <div className="relative h-20 overflow-hidden rounded-[14px]">
                            <Image
                              src={related.featuredImage}
                              alt={related.featuredImageAlt}
                              fill
                              className="object-cover"
                              sizes="86px"
                              unoptimized={isLocalhostAssetUrl(related.featuredImage)}
                            />
                          </div>
                          <div>
                            {getPrimaryCategory(related) ? (
                              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#2E7D32]">
                                {getPrimaryCategory(related)?.label}
                              </p>
                            ) : null}
                            <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-[#0F3F1D] group-hover:text-[#2E7D32]">
                              {related.title}
                            </h3>
                            <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#2E7D32]">
                              {pageData.labels.read}
                              <ChevronRight className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </aside>
            </div>
          </div>
        </article>
      </DepartmentAnimatedSection>
    </div>
  );
}
