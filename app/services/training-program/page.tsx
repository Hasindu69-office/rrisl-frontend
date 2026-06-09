import PageHero from '../../components/shared/PageHero';
import TrainingProgramsOverviewSection from '../../components/training-program/TrainingProgramsOverviewSection';
import { mapTrainingProgramPageData } from '../../lib/training-program/pageData';
import { normalizeLocale } from '../../lib/locale';
import { fetchTrainingProgramPageByLocale } from '../../lib/strapi';

interface TrainingProgramPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function TrainingProgramPage({
  searchParams,
}: TrainingProgramPageProps) {
  const params = await searchParams;
  const locale = normalizeLocale(params.locale);
  const fallbackLocale = 'en';
  const shouldFetchFallback = locale !== fallbackLocale;

  const [localizedPage, fallbackPage] = await Promise.all([
    fetchTrainingProgramPageByLocale(locale),
    shouldFetchFallback
      ? fetchTrainingProgramPageByLocale(fallbackLocale)
      : Promise.resolve(null),
  ]);

  const pageData = mapTrainingProgramPageData(
    localizedPage,
    fallbackPage || localizedPage
  );

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title={pageData.hero.title}
        breadcrumbItems={pageData.hero.breadcrumbItems}
        backgroundImage={pageData.hero.backgroundImage}
        backgroundImageAlt={pageData.hero.backgroundImageAlt}
        locale={locale}
      />

      <TrainingProgramsOverviewSection pageData={pageData} />
    </div>
  );
}
