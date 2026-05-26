import PageHero from '../../components/shared/PageHero';
import EstateSubstationActivitiesSection from '../../components/estates/EstateSubstationActivitiesSection';
import EstateSubstationAnnualRainfallCard from '../../components/estates/EstateSubstationAnnualRainfallCard';
import EstateSubstationFacilitiesSection from '../../components/estates/EstateSubstationFacilitiesSection';
import EstateSubstationRainfallDistributionCard from '../../components/estates/EstateSubstationRainfallDistributionCard';
import EstateSubstationIntroSection from '../../components/estates/EstateSubstationIntroSection';
import EstateSubstationPerformanceSection from '../../components/estates/EstateSubstationPerformanceSection';
import EstateSubstationSectionShell from '../../components/estates/EstateSubstationSectionShell';
import { polgahawelaSubstationActivitiesContent } from './activitiesSectionContent';
import { polgahawelaSubstationFacilitiesContent } from './facilitiesSectionContent';
import { polgahawelaSubstationIntroContent } from './introSectionContent';
import { polgahawelaAnnualRainfallContent } from './monitoringAnnualRainfallContent';
import { polgahawelaRainfallDistributionContent } from './monitoringRainfallDistributionContent';
import { polgahawelaSubstationMonitoringSectionContent } from './monitoringSectionContent';
import { polgahawelaPerformanceSectionContent } from './performanceSectionContent';

interface PolgahawelaSubstationPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function PolgahawelaSubstationPage({
  searchParams,
}: PolgahawelaSubstationPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title="Polgahawela Sub-station"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Estates and substations', href: '/estates-and-substations' },
          { label: 'Polgahawela Sub-station' },
        ]}
        backgroundImage="/images/estateandsubstationsbgimage.webp"
        backgroundImageAlt="Polgahawela Sub-station background"
        locale={locale}
      />

      <EstateSubstationIntroSection
        content={polgahawelaSubstationIntroContent}
      />

      <EstateSubstationFacilitiesSection
        content={polgahawelaSubstationFacilitiesContent}
      />

      <EstateSubstationActivitiesSection
        content={polgahawelaSubstationActivitiesContent}
      />

      <EstateSubstationSectionShell
        content={polgahawelaSubstationMonitoringSectionContent}
        contentClassName="px-4 py-16 md:px-6 md:py-20 lg:px-8 xl:px-10 lg:py-24"
        containerClassName="max-w-none"
      >
        <div className="grid gap-6 xl:grid-cols-2 xl:items-start">
          <EstateSubstationRainfallDistributionCard
            content={polgahawelaRainfallDistributionContent}
          />
          <EstateSubstationAnnualRainfallCard
            content={polgahawelaAnnualRainfallContent}
          />
        </div>
      </EstateSubstationSectionShell>

      <EstateSubstationPerformanceSection
        content={polgahawelaPerformanceSectionContent}
      />
    </div>
  );
}
