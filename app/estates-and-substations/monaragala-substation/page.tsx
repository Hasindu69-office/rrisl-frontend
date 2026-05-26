import PageHero from '../../components/shared/PageHero';
import EstateSubstationActivitiesSection from '../../components/estates/EstateSubstationActivitiesSection';
import EstateSubstationContactSection from '../../components/estates/EstateSubstationContactSection';
import EstateSubstationFacilitiesSection from '../../components/estates/EstateSubstationFacilitiesSection';
import EstateSubstationFeatureSection from '../../components/estates/EstateSubstationFeatureSection';
import EstateSubstationIntroSection from '../../components/estates/EstateSubstationIntroSection';
import { monaragalaSubstationActivitiesContent } from './activitiesSectionContent';
import { monaragalaContactSectionContent } from './contactSectionContent';
import { monaragalaSubstationFacilitiesContent } from './facilitiesSectionContent';
import { monaragalaSubstationIntroContent } from './introSectionContent';
import { monaragalaIntercroppingSectionContent } from './intercroppingSectionContent';

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

      <EstateSubstationFeatureSection
        content={monaragalaIntercroppingSectionContent}
      />

      <EstateSubstationContactSection
        content={monaragalaContactSectionContent}
      />
    </div>
  );
}
