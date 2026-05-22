import PageHero from '../components/shared/PageHero';
import ELibrarySection from '../components/e-library/ELibrarySection';
import { normalizeLocale } from '../lib/locale';
import {
  getEPublicationsPage,
  getPublicationCategories,
  getPublications,
} from '../lib/strapi';
import { mapEPublicationsPageData } from '../lib/e-publications/pageData';

interface ELibraryPublicationsPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function ELibraryPublicationsPage({
  searchParams,
}: ELibraryPublicationsPageProps) {
  const params = await searchParams;
  const locale = normalizeLocale(params.locale);
  const [page, fallbackPage, categories, publications] = await Promise.all([
    getEPublicationsPage(locale),
    locale !== 'en' ? getEPublicationsPage('en') : Promise.resolve(null),
    getPublicationCategories(locale),
    getPublications(locale),
  ]);
  const pageData = mapEPublicationsPageData(page, fallbackPage, categories, publications);

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title={pageData.hero.title}
        breadcrumbItems={pageData.hero.breadcrumbItems}
        backgroundImage={pageData.hero.backgroundImage}
        backgroundImageAlt={pageData.hero.backgroundImageAlt}
        locale={locale}
      />

      <ELibrarySection
        filters={pageData.filters}
        itemLabel={pageData.itemLabel}
        filterLibraryLabel={pageData.filterLibraryLabel}
        resetButtonLabel={pageData.resetButtonLabel}
        searchLibraryLabel={pageData.searchLibraryLabel}
        readMoreLabel={pageData.readMoreLabel}
        emptyState={pageData.emptyState}
      />
    </div>
  );
}
