import PageHero from '../../components/shared/PageHero';
import EstateSubstationActivitiesSection from '../../components/estates/EstateSubstationActivitiesSection';
import EstateSubstationContactSection from '../../components/estates/EstateSubstationContactSection';
import EstateSubstationFacilitiesSection from '../../components/estates/EstateSubstationFacilitiesSection';
import EstateSubstationIntroSection from '../../components/estates/EstateSubstationIntroSection';
import { nivitigalakeleSubstationActivitiesContent } from './activitiesSectionContent';
import { nivitigalakeleContactSectionContent } from './contactSectionContent';
import { nivitigalakeleSubstationFacilitiesContent } from './facilitiesSectionContent';
import { nivitigalakeleSubstationIntroContent } from './introSectionContent';

interface NivitigalakeleSubstationPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function NivitigalakeleSubstationPage({
  searchParams,
}: NivitigalakeleSubstationPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title="Nivitigalakele Sub-station"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Estates and substations', href: '/estates-and-substations' },
          { label: 'Nivitigalakele Sub-station' },
        ]}
        backgroundImage="/images/estateandsubstationsbgimage.webp"
        backgroundImageAlt="Nivitigalakele Sub-station background"
        locale={locale}
      />

      <EstateSubstationIntroSection
        content={nivitigalakeleSubstationIntroContent}
      />

      <EstateSubstationFacilitiesSection
        content={nivitigalakeleSubstationFacilitiesContent}
      />

      <EstateSubstationActivitiesSection
        content={nivitigalakeleSubstationActivitiesContent}
      />

      <EstateSubstationContactSection
        content={nivitigalakeleContactSectionContent}
      />
    </div>
  );
}
