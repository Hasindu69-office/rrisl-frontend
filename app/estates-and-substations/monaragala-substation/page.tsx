import PageHero from '../../components/shared/PageHero';
import EstateSubstationActivitiesSection from '../../components/estates/EstateSubstationActivitiesSection';
import EstateSubstationFacilitiesSection from '../../components/estates/EstateSubstationFacilitiesSection';
import EstateSubstationIntroSection from '../../components/estates/EstateSubstationIntroSection';
import { monaragalaSubstationActivitiesContent } from './activitiesSectionContent';
import { monaragalaSubstationFacilitiesContent } from './facilitiesSectionContent';
import { monaragalaSubstationIntroContent } from './introSectionContent';

interface MonaragalaSubstationPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function MonaragalaSubstationPage({
  searchParams,
}: MonaragalaSubstationPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title="Monaragala Sub-Station"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Estates and substations', href: '/estates-and-substations' },
          { label: 'Monaragala Sub-Station' },
        ]}
        backgroundImage="/images/estateandsubstationsbgimage.webp"
        backgroundImageAlt="Monaragala Sub-Station background"
        locale={locale}
      />

      <EstateSubstationIntroSection
        content={monaragalaSubstationIntroContent}
      />

      <EstateSubstationFacilitiesSection
        content={monaragalaSubstationFacilitiesContent}
      />

      <EstateSubstationActivitiesSection
        content={monaragalaSubstationActivitiesContent}
      />
    </div>
  );
}
