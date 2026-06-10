import PageHero from '../../components/shared/PageHero';
import AdvisoryServicesOverviewSection from '../../components/services/AdvisoryServicesOverviewSection';
import AdvisoryServicesProgramsSliderSection from '../../components/services/AdvisoryServicesProgramsSliderSection';
import { mapAdvisoryServicesPageData } from '../../lib/advisory-services/pageData';
import { normalizeLocale } from '../../lib/locale';
import {
  fetchAdvisoryServicePageByLocale,
  fetchTrainingProgramCategoriesByLocale,
  fetchTrainingProgramsByLocale,
} from '../../lib/strapi';

interface AdvisoryServicesPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function AdvisoryServicesPage({
  searchParams,
}: AdvisoryServicesPageProps) {
  const params = await searchParams;
  const locale = normalizeLocale(params.locale);
  const fallbackLocale = 'en';
  const shouldFetchFallback = locale !== fallbackLocale;

  const [
    localizedPage,
    localizedCategories,
    localizedPrograms,
    fallbackPage,
    fallbackCategories,
    fallbackPrograms,
  ] = await Promise.all([
    fetchAdvisoryServicePageByLocale(locale),
    fetchTrainingProgramCategoriesByLocale(locale),
    fetchTrainingProgramsByLocale(locale),
    shouldFetchFallback
      ? fetchAdvisoryServicePageByLocale(fallbackLocale)
      : Promise.resolve(null),
    shouldFetchFallback
      ? fetchTrainingProgramCategoriesByLocale(fallbackLocale)
      : Promise.resolve([]),
    shouldFetchFallback
      ? fetchTrainingProgramsByLocale(fallbackLocale)
      : Promise.resolve([]),
  ]);

  const pageData = mapAdvisoryServicesPageData(
    localizedPage,
    fallbackPage || localizedPage,
    localizedCategories,
    fallbackCategories,
    localizedPrograms,
    fallbackPrograms
  );

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <PageHero
        title={pageData.hero.title}
        breadcrumbItems={pageData.hero.breadcrumbItems}
        backgroundImage={pageData.hero.backgroundImage}
        backgroundImageAlt={pageData.hero.backgroundImageAlt}
        locale={locale}
      />

      <AdvisoryServicesOverviewSection overview={pageData.overview} />
      <AdvisoryServicesProgramsSliderSection
        categories={pageData.programs.categories}
        backgroundImage={pageData.programs.backgroundImage}
        backgroundImageAlt={pageData.programs.backgroundImageAlt}
      />
    </div>
  );
}
