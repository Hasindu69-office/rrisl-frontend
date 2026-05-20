import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHero from '../../components/shared/PageHero';
import VacancyDetailContent from '../../components/vacancy/VacancyDetailContent';
import VacancyOverviewPanel from '../../components/vacancy/VacancyOverviewPanel';
import { getVacancyBySlug, getVacancyPage } from '../../lib/strapi';
import { mapVacancyPageData, mapVacancyToDetailViewModel } from '../../lib/vacancy/pageData';

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
  const [vacancy, vacancyPage, fallbackPage] = await Promise.all([
    getVacancyBySlug(slug, locale),
    getVacancyPage(locale),
    locale === 'en' ? Promise.resolve(null) : getVacancyPage('en'),
  ]);

  if (!vacancy) {
    notFound();
  }

  const pageData = mapVacancyPageData(vacancyPage, fallbackPage);
  const job = mapVacancyToDetailViewModel(vacancy);

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title={pageData.labels.jobDetailsLabel}
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: pageData.hero.title, href: '/vacancy' },
          { label: pageData.labels.jobDetailsLabel },
        ]}
        backgroundImage={pageData.hero.backgroundImage}
        backgroundImageAlt={pageData.hero.backgroundImageAlt}
        locale={locale}
      />

      <section className="mb-72 bg-white px-4 py-12 md:px-6 md:py-16 lg:px-36 lg:py-20">
        <div className="mx-auto grid w-full max-w-[1480px] gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
          <VacancyDetailContent job={job} labels={pageData.labels} />
          <div className="hidden self-start lg:sticky lg:top-2 lg:block">
            <VacancyOverviewPanel
              heading={pageData.labels.overviewTitle}
              job={job}
              labels={pageData.labels.overviewItemLabels}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
