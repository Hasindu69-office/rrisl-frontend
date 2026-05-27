import PageHero from '../../components/shared/PageHero';
import EstateSubstationActivitiesSection from '../../components/estates/EstateSubstationActivitiesSection';
import EstateSubstationContactSection from '../../components/estates/EstateSubstationContactSection';
import EstateSubstationFacilitiesSection from '../../components/estates/EstateSubstationFacilitiesSection';
import EstateSubstationIntroSection from '../../components/estates/EstateSubstationIntroSection';
import { dartonfieldGroupActivitiesContent } from './activitiesSectionContent';
import { dartonfieldGroupContactSectionContent } from './contactSectionContent';
import { dartonfieldGroupFacilitiesContent } from './facilitiesSectionContent';
import { dartonfieldGroupIntroContent } from './introSectionContent';

interface DartonfieldGroupPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function DartonfieldGroupPage({
  searchParams,
}: DartonfieldGroupPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title="Dartonfield Group"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Estates and substations', href: '/estates-and-substations' },
          { label: 'Dartonfield Group' },
        ]}
        backgroundImage="/images/estateandsubstationsbgimage.webp"
        backgroundImageAlt="Dartonfield Group background"
        locale={locale}
      />

      <EstateSubstationIntroSection content={dartonfieldGroupIntroContent} />

      <EstateSubstationFacilitiesSection
        content={dartonfieldGroupFacilitiesContent}
      />

      <EstateSubstationActivitiesSection
        content={dartonfieldGroupActivitiesContent}
      />

      <EstateSubstationContactSection
        content={dartonfieldGroupContactSectionContent}
      />
    </div>
  );
}
