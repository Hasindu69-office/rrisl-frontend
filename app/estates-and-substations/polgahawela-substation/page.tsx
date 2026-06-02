import PageHero from '../../components/shared/PageHero';
import EstateSubstationActivitiesSection from '../../components/estates/EstateSubstationActivitiesSection';
import EstateSubstationAnnualRainfallCard from '../../components/estates/EstateSubstationAnnualRainfallCard';
import EstateSubstationContactSection from '../../components/estates/EstateSubstationContactSection';
import EstateSubstationFacilitiesSection from '../../components/estates/EstateSubstationFacilitiesSection';
import EstateSubstationRainfallDistributionCard from '../../components/estates/EstateSubstationRainfallDistributionCard';
import EstateSubstationIntroSection from '../../components/estates/EstateSubstationIntroSection';
import EstateSubstationPerformanceSection from '../../components/estates/EstateSubstationPerformanceSection';
import EstateSubstationSectionShell from '../../components/estates/EstateSubstationSectionShell';
import { mapPolgahawelaSubstationPageData } from '../../lib/estates/polgahawelaPageData';
import {
  getContactPage,
  getEstateSubstationBySlug,
  getPolgahawelaAnnualRainfallValues,
  getPolgahawelaProductionCards,
  getPolgahawelaRainfallMonthValues,
} from '../../lib/strapi';

interface PolgahawelaSubstationPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function PolgahawelaSubstationPage({
  searchParams,
}: PolgahawelaSubstationPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';
  const [
    estate,
    contactPage,
    annualRainfallValues,
    rainfallMonthValues,
    productionCards,
  ] = await Promise.all([
    getEstateSubstationBySlug('polgahawela-substation', locale),
    getContactPage(locale),
    getPolgahawelaAnnualRainfallValues(),
    getPolgahawelaRainfallMonthValues(),
    getPolgahawelaProductionCards(),
  ]);
  const pageData = mapPolgahawelaSubstationPageData(
    estate,
    contactPage,
    annualRainfallValues,
    rainfallMonthValues,
    productionCards
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

      <EstateSubstationIntroSection content={pageData.intro} />

      <EstateSubstationFacilitiesSection content={pageData.facilities} />

      <EstateSubstationActivitiesSection content={pageData.activities} />

      {pageData.monitoring && pageData.rainfallDistribution && pageData.annualRainfall ? (
        <EstateSubstationSectionShell
          content={pageData.monitoring}
          contentClassName="px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-24 xl:px-10"
          containerClassName="max-w-none"
        >
          <div className="grid gap-4 md:gap-5 min-[960px]:grid-cols-2 min-[960px]:items-start xl:gap-6">
            <EstateSubstationRainfallDistributionCard content={pageData.rainfallDistribution} />
            <EstateSubstationAnnualRainfallCard content={pageData.annualRainfall} />
          </div>
        </EstateSubstationSectionShell>
      ) : null}

      {pageData.performance ? <EstateSubstationPerformanceSection content={pageData.performance} /> : null}

      <EstateSubstationContactSection content={pageData.contact} />
    </div>
  );
}
