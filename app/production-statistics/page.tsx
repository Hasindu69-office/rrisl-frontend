import PageHero from '../components/shared/PageHero';
import ProductionStatisticsSection from '../components/production-statistics/ProductionStatisticsSection';

interface ProductionStatisticsPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function ProductionStatisticsPage({
  searchParams,
}: ProductionStatisticsPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title="Production Statistics"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Production Statistics' },
        ]}
        backgroundImageAlt="Production statistics background"
        locale={locale}
      />

      <ProductionStatisticsSection />
    </div>
  );
}
