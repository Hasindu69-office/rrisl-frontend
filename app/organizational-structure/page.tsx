import PageHero from '../components/shared/PageHero';
import { normalizeLocale } from '../lib/locale';
import { mapOrganizationalStructurePageData } from '../lib/organizational-structure/pageData';
import { getOrganizationStructurePage } from '../lib/strapi';
import InteractiveOrgChart from './InteractiveOrgChart';

interface OrganizationalStructureProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function OrganizationalStructure({
  searchParams,
}: OrganizationalStructureProps) {
  const params = await searchParams;
  const locale = normalizeLocale(params.locale);
  const [organizationStructurePage, fallbackOrganizationStructurePage] = await Promise.all([
    getOrganizationStructurePage(locale),
    locale === 'en' ? Promise.resolve(null) : getOrganizationStructurePage('en'),
  ]);
  const pageData = mapOrganizationalStructurePageData(
    organizationStructurePage,
    fallbackOrganizationStructurePage
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

      <section className="bg-white pb-56 pt-8 md:pb-28 lg:pb-64">
        <div className="mx-auto w-full max-w-[1920px] px-4 md:px-6">
          <div className="mx-auto max-w-[1746px]">
            <InteractiveOrgChart
              key={pageData.chart.chartUrl}
              chartUrl={pageData.chart.chartUrl}
              chartAlt={pageData.chart.chartAlt}
              fallbackUrl={pageData.chart.fallbackUrl}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
