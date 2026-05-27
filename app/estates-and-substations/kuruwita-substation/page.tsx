import PageHero from '../../components/shared/PageHero';
import EstateSubstationActivitiesSection from '../../components/estates/EstateSubstationActivitiesSection';
import EstateSubstationContactSection from '../../components/estates/EstateSubstationContactSection';
import EstateSubstationFacilitiesSection from '../../components/estates/EstateSubstationFacilitiesSection';
import EstateSubstationIntroSection from '../../components/estates/EstateSubstationIntroSection';
import { kuruwitaSubstationActivitiesContent } from './activitiesSectionContent';
import { kuruwitaContactSectionContent } from './contactSectionContent';
import { kuruwitaSubstationFacilitiesContent } from './facilitiesSectionContent';
import { kuruwitaSubstationIntroContent } from './introSectionContent';

interface KuruwitaSubstationPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function KuruwitaSubstationPage({
  searchParams,
}: KuruwitaSubstationPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title="Kuruwita Sub-station"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Estates and substations', href: '/estates-and-substations' },
          { label: 'Kuruwita Sub-station' },
        ]}
        backgroundImage="/images/estateandsubstationsbgimage.webp"
        backgroundImageAlt="Kuruwita Sub-station background"
        locale={locale}
      />

      <EstateSubstationIntroSection content={kuruwitaSubstationIntroContent} />

      <EstateSubstationFacilitiesSection
        content={kuruwitaSubstationFacilitiesContent}
      />

      <EstateSubstationActivitiesSection
        content={kuruwitaSubstationActivitiesContent}
      />

      <EstateSubstationContactSection
        content={kuruwitaContactSectionContent}
      />
    </div>
  );
}
