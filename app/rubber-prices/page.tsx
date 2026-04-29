import PageHero from '../components/shared/PageHero';
import RubberPricesSection from '../components/rubber-prices/RubberPricesSection';
import {
  latestRubberPriceEntry,
  recentRubberPriceEntries,
  rubberPriceArchiveYears,
  rubberPriceEntries,
  rubberPriceEntriesByYear,
} from '../components/rubber-prices/rubberPricesData';

interface RubberPricesPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function RubberPricesPage({
  searchParams,
}: RubberPricesPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title="Rubber Prices"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Rubber Prices' },
        ]}
        backgroundImageAlt="Rubber prices background"
        locale={locale}
      />

      <RubberPricesSection
        entries={rubberPriceEntries}
        latestEntry={latestRubberPriceEntry}
        recentEntries={recentRubberPriceEntries}
        archiveYears={rubberPriceArchiveYears}
        entriesByYear={rubberPriceEntriesByYear}
      />
    </div>
  );
}
