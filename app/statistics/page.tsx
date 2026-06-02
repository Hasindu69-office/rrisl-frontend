import PageHero from '../components/shared/PageHero';
import ProductionStatisticsSection from '../components/production-statistics/ProductionStatisticsSection';
import { getStatisticsPageData } from '../lib/strapi';

interface ProductionStatisticsPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function ProductionStatisticsPage({
  searchParams,
}: ProductionStatisticsPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';
  const statisticsPage = await getStatisticsPageData(locale);

  return (
    <div className="min-h-screen bg-[#F6F8F3] mb-64">
      <PageHero
        title={statisticsPage.hero.title}
        breadcrumbItems={statisticsPage.hero.breadcrumbItems}
        backgroundImage={statisticsPage.hero.backgroundImage}
        backgroundImageAlt={statisticsPage.hero.backgroundImageAlt}
        locale={locale}
      />

      <ProductionStatisticsSection
        sectionTitle={statisticsPage.sectionTitle}
        tabs={statisticsPage.tabs}
        productionCard={statisticsPage.productionCard}
      />
    </div>
  );
}
