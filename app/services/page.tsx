import PageHero from '../components/shared/PageHero';
import ServicesSection from '../components/services/ServicesSection';
import { normalizeLocale } from '../lib/locale';
import { mapServicesPageData } from '../lib/services/pageData';
import {
  fetchServicesPageByLocale,
  fetchTestingServiceCategoriesByLocale,
} from '../lib/strapi';

interface ServicesPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const params = await searchParams;
  const locale = normalizeLocale(params.locale);
  const fallbackLocale = 'en';
  const shouldFetchFallback = locale !== fallbackLocale;

  const [
    localizedPage,
    localizedCategories,
    fallbackPage,
    fallbackCategories,
  ] = await Promise.all([
    fetchServicesPageByLocale(locale),
    fetchTestingServiceCategoriesByLocale(locale),
    shouldFetchFallback ? fetchServicesPageByLocale(fallbackLocale) : Promise.resolve(null),
    shouldFetchFallback
      ? fetchTestingServiceCategoriesByLocale(fallbackLocale)
      : Promise.resolve([]),
  ]);

  const pageData = mapServicesPageData(
    localizedPage,
    fallbackPage || localizedPage,
    localizedCategories,
    fallbackCategories,
    locale
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

      <ServicesSection
        locale={locale}
        section={pageData.section}
        testing={pageData.testing}
        cta={pageData.cta}
        sampleSubmissionPopup={pageData.sampleSubmissionPopup}
      />
    </div>
  );
}
