import PageHero from '../../components/shared/PageHero';
import EstateSubstationActivitiesSection from '../../components/estates/EstateSubstationActivitiesSection';
import EstateSubstationFacilitiesSection from '../../components/estates/EstateSubstationFacilitiesSection';
import EstateSubstationRainfallDistributionCard from '../../components/estates/EstateSubstationRainfallDistributionCard';
import EstateSubstationIntroSection from '../../components/estates/EstateSubstationIntroSection';
import EstateSubstationSectionShell from '../../components/estates/EstateSubstationSectionShell';
import { polgahawelaSubstationActivitiesContent } from './activitiesSectionContent';
import { polgahawelaSubstationFacilitiesContent } from './facilitiesSectionContent';
import { polgahawelaSubstationIntroContent } from './introSectionContent';
import { polgahawelaRainfallDistributionContent } from './monitoringRainfallDistributionContent';
import { polgahawelaSubstationMonitoringSectionContent } from './monitoringSectionContent';

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
      >
        <EstateSubstationRainfallDistributionCard
          content={polgahawelaRainfallDistributionContent}
        />
      </EstateSubstationSectionShell>
    </div>
  );
}
