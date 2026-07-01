import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHero from '../../components/shared/PageHero';
import VacancyDetailAnimatedLayout from '../../components/vacancy/VacancyDetailAnimatedLayout';
import VacancyDetailContent from '../../components/vacancy/VacancyDetailContent';
import VacancyOverviewPanel from '../../components/vacancy/VacancyOverviewPanel';
import { getVacancyBySlug, getVacancyDetailsPage, getVacancyPage } from '../../lib/strapi';
import {
  mapVacancyDetailLabelsData,
  mapVacancyPageData,
  mapVacancyToDetailViewModel,
} from '../../lib/vacancy/pageData';

interface VacancyDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ locale?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: VacancyDetailPageProps): Promise<Metadata> {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const locale = query.locale || 'en';
  const [vacancy, page, fallbackPage] = await Promise.all([
    getVacancyBySlug(slug, locale),
    getVacancyPage(locale),
    locale === 'en' ? Promise.resolve(null) : getVacancyPage('en'),
  ]);
  const pageData = mapVacancyPageData(page, fallbackPage);

  return {
    title: vacancy ? `${vacancy.title} | ${pageData.labels.jobDetailsLabel}` : pageData.labels.jobDetailsLabel,
  };
}

export default async function VacancyDetailPage({
  params,
  searchParams,
}: VacancyDetailPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const locale = query.locale || 'en';
  const [vacancy, vacancyPage, fallbackPage, vacancyDetailsPage, fallbackDetailsPage] = await Promise.all([
    getVacancyBySlug(slug, locale),
    getVacancyPage(locale),
    locale === 'en' ? Promise.resolve(null) : getVacancyPage('en'),
    getVacancyDetailsPage(locale),
    locale === 'en' ? Promise.resolve(null) : getVacancyDetailsPage('en'),
  ]);

  if (!vacancy) {
    notFound();
  }

  const pageData = mapVacancyPageData(vacancyPage, fallbackPage);
  const detailLabels = mapVacancyDetailLabelsData(vacancyDetailsPage, fallbackDetailsPage);
  const job = mapVacancyToDetailViewModel(vacancy);
  const detailBreadcrumbItems = [
    ...pageData.hero.breadcrumbItems.map((item, index, items) =>
      index === items.length - 1
        ? {
            ...item,
            href: item.href || '/vacancy',
          }
        : item
    ),
    { label: pageData.labels.jobDetailsLabel },
  ];

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title={pageData.labels.jobDetailsLabel}
        breadcrumbItems={detailBreadcrumbItems}
        backgroundImage={pageData.hero.backgroundImage}
        backgroundImageAlt={pageData.hero.backgroundImageAlt}
        locale={locale}
      />

      <section className="mb-72 bg-white px-4 py-12 md:px-6 md:py-16 lg:px-36 lg:py-20">
        <VacancyDetailAnimatedLayout>
          <div data-vacancy-detail-column>
            <VacancyDetailContent job={job} labels={pageData.labels} detailLabels={detailLabels} />
          </div>
          <div
            className="hidden self-start lg:sticky lg:top-2 lg:block"
            data-vacancy-detail-column
          >
            <VacancyOverviewPanel
              heading={pageData.labels.overviewTitle}
              job={job}
              labels={pageData.labels.overviewItemLabels}
            />
          </div>
        </VacancyDetailAnimatedLayout>
      </section>
    </div>
  );
}
