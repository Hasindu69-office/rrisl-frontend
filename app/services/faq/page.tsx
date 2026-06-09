import PageHero from '../../components/shared/PageHero';
import FaqIntroSection from '../../components/faq/FaqIntroSection';
import { mapFaqPageData } from '../../lib/faq/pageData';
import { normalizeLocale } from '../../lib/locale';
import { fetchFaqPageByLocale, fetchFaqsByLocale } from '../../lib/strapi';

interface FaqPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function FaqPage({ searchParams }: FaqPageProps) {
  const params = await searchParams;
  const locale = normalizeLocale(params.locale);
  const fallbackLocale = 'en';
  const shouldFetchFallback = locale !== fallbackLocale;

  const [localizedPage, localizedFaqs, fallbackPage, fallbackFaqs] = await Promise.all([
    fetchFaqPageByLocale(locale),
    fetchFaqsByLocale(locale),
    shouldFetchFallback ? fetchFaqPageByLocale(fallbackLocale) : Promise.resolve(null),
    shouldFetchFallback ? fetchFaqsByLocale(fallbackLocale) : Promise.resolve([]),
  ]);

  const pageData = mapFaqPageData(localizedPage, fallbackPage || localizedPage, localizedFaqs, fallbackFaqs);

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title={pageData.hero.title}
        breadcrumbItems={pageData.hero.breadcrumbItems}
        backgroundImage={pageData.hero.backgroundImage}
        backgroundImageAlt={pageData.hero.backgroundImageAlt}
        locale={locale}
      />

      <FaqIntroSection section={pageData.section} items={pageData.items} />
    </div>
  );
}
