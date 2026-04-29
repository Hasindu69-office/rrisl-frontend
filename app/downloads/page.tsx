import PageHero from '../components/shared/PageHero';
import DownloadsSection from '../components/downloads/DownloadsSection';
import { getDownloadPage, getDownloads } from '../lib/strapi';
import { mapDownloadHero } from '../lib/downloads/hero';
import {
  getDownloadsEmptyState,
  getDownloadsReadMoreLabel,
  mapDownloadsItems,
} from '../components/downloads/downloadsData';

interface DownloadsPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function DownloadsPage({
  searchParams,
}: DownloadsPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';
  const [downloadPage, fallbackPage, downloads] = await Promise.all([
    getDownloadPage(locale),
    locale === 'en' ? Promise.resolve(null) : getDownloadPage('en'),
    getDownloads(locale),
  ]);
  const hero = mapDownloadHero(downloadPage, fallbackPage);
  const items = mapDownloadsItems(downloads);
  const readMoreLabel = getDownloadsReadMoreLabel(downloadPage, fallbackPage);
  const emptyState = getDownloadsEmptyState(downloadPage, fallbackPage);

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title={hero.title}
        breadcrumbItems={hero.breadcrumbItems}
        backgroundImage={hero.backgroundImage}
        backgroundImageAlt={hero.backgroundImageAlt}
        locale={locale}
      />

      <DownloadsSection
        items={items}
        buttonLabel={readMoreLabel}
        emptyStateTitle={emptyState.title}
        emptyStateDescription={emptyState.description}
      />
    </div>
  );
}
