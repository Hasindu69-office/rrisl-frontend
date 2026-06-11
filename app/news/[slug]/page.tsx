import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays, ChevronRight, Newspaper, UserRound } from 'lucide-react';
import DepartmentAnimatedSection from '../../components/department/DepartmentAnimatedSection';
import PageHero from '../../components/shared/PageHero';
import { addLocaleToUrl } from '../../lib/locale';
import {
  formatArticleDate,
  getArticleBySlug,
  getRelatedArticles,
  newsArticles,
} from '../../lib/news/pageData';

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ locale?: string }>;
}

export function generateStaticParams() {
  return newsArticles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function NewsDetailPage({ params, searchParams }: NewsDetailPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const locale = query.locale || 'en';
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article);
  const backHref = addLocaleToUrl('/news', locale);

  return (
    <div className="min-h-screen overflow-x-clip bg-white text-[#0F3F1D]">
      <PageHero
        title="News & Blog"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'News & Blog', href: '/news' },
          { label: 'Article' },
        ]}
        backgroundImage={article.featuredImage}
        backgroundImageAlt={article.featuredImageAlt}
        locale={locale}
      />

      <DepartmentAnimatedSection y={28} duration={0.76} stagger={0.09}>
        <article className="mb-56 px-4 py-14 md:py-20">
          <div className="container mx-auto max-w-[1180px]">
            <Link
              href={backHref}
              data-department-reveal
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#DCECCB] bg-white px-5 py-2.5 text-sm font-bold text-[#2E7D32] shadow-sm transition hover:border-[#A1DF0A]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all articles
            </Link>

          <div className="grid min-w-0 gap-9 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0">
              <div className="overflow-hidden rounded-[30px] bg-white shadow-[0_24px_70px_rgba(15,63,29,0.12)]" data-department-reveal>
                <div className="relative aspect-[16/9] min-h-[280px] overflow-hidden">
                  <Image
                    src={article.featuredImage}
                    alt={article.featuredImageAlt}
                    fill
                    priority
                    className="object-cover"
                    sizes="(min-width: 1024px) 760px, 100vw"
                  />
                  <div className="absolute left-4 top-4 max-w-[calc(100%-2rem)] rounded-full bg-[#A1DF0A] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#0F3F1D] sm:left-6 sm:top-6 sm:tracking-[0.16em]">
                    {article.category}
                  </div>
                </div>

                <div className="min-w-0 p-6 md:p-10">
                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-[#557062]">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-[#2E7D32]" />
                      {formatArticleDate(article.publishedDate)}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <UserRound className="h-4 w-4 text-[#2E7D32]" />
                      {article.author}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Newspaper className="h-4 w-4 text-[#2E7D32]" />
                      {article.category}
                    </span>
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

              {article.galleryImages && article.galleryImages.length > 0 && (
                <section className="mt-10" data-department-reveal>
                  <h2 className="text-2xl font-bold text-[#0F3F1D]">Article gallery</h2>
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
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="space-y-7 lg:sticky lg:top-8 lg:self-start" data-department-reveal>
              {relatedArticles.length > 0 && (
                <div className="rounded-[26px] border border-[#DCECCB] bg-white p-6 shadow-[0_18px_50px_rgba(15,63,29,0.08)]">
                  <h2 className="text-xl font-bold text-[#0F3F1D]">Related articles</h2>
                  <div className="mt-5 space-y-4">
                    {relatedArticles.map((related) => (
                      <Link
                        key={related.slug}
                        href={addLocaleToUrl(`/news/${related.slug}`, locale)}
                        className="group grid grid-cols-[86px_1fr] gap-4 rounded-[18px] p-2 transition hover:bg-[#F7FAF3]"
                      >
                        <div className="relative h-20 overflow-hidden rounded-[14px]">
                          <Image
                            src={related.featuredImage}
                            alt={related.featuredImageAlt}
                            fill
                            className="object-cover"
                            sizes="86px"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#2E7D32]">
                            {related.category}
                          </p>
                          <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-[#0F3F1D] group-hover:text-[#2E7D32]">
                            {related.title}
                          </h3>
                          <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#2E7D32]">
                            Read
                            <ChevronRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
          </div>
        </article>
      </DepartmentAnimatedSection>
    </div>
  );
}
