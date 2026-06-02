import PageHero from '../../components/shared/PageHero';
import EstateSubstationActivitiesSection from '../../components/estates/EstateSubstationActivitiesSection';
import EstateSubstationContactSection from '../../components/estates/EstateSubstationContactSection';
import EstateSubstationFacilitiesSection from '../../components/estates/EstateSubstationFacilitiesSection';
import EstateSubstationIntroSection from '../../components/estates/EstateSubstationIntroSection';
import { getContactPage, getEstateSubstationBySlug } from '../../lib/strapi';
import { mapEstateDetailPageData } from '../../lib/estates/pageData';

interface DartonfieldGroupPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function DartonfieldGroupPage({
  searchParams,
}: DartonfieldGroupPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';
  const [estate, contactPage] = await Promise.all([
    getEstateSubstationBySlug('dartonfield-group', locale),
    getContactPage(locale),
  ]);
  const pageData = mapEstateDetailPageData(estate, contactPage);

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

      <EstateSubstationFacilitiesSection
        content={pageData.facilities}
      />

      <EstateSubstationActivitiesSection
        content={pageData.activities}
      />

      <EstateSubstationContactSection
        content={pageData.contact}
      />
    </div>
  );
}
