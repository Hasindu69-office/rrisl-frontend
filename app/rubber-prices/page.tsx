import PageHero from '../components/shared/PageHero';
import RubberPricesSection from '../components/rubber-prices/RubberPricesSection';
import { mapRubberPricePageData } from '../lib/rubber-prices/pageData';
import { getRubberAuctionPrices, getRubberPricePage } from '../lib/strapi';

interface RubberPricesPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function RubberPricesPage({
  searchParams,
}: RubberPricesPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';
  const [localizedPage, fallbackPage, auctionPrices] = await Promise.all([
    getRubberPricePage(locale),
    locale !== 'en' ? getRubberPricePage('en') : Promise.resolve(null),
    getRubberAuctionPrices(),
  ]);
  const pageData = mapRubberPricePageData(
    localizedPage,
    fallbackPage,
    auctionPrices
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

      <RubberPricesSection
        content={pageData.content}
        entries={pageData.entries}
        latestEntry={pageData.latestEntry}
        recentEntries={pageData.recentEntries}
        archiveYears={pageData.archiveYears}
        entriesByYear={pageData.entriesByYear}
      />
    </div>
  );
}
