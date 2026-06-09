import PageHero from '../../components/shared/PageHero';
import type { BreadcrumbItem } from '../../components/shared/Breadcrumb';
import AdvisoryServicesOverviewSection from '../../components/services/AdvisoryServicesOverviewSection';
import AdvisoryServicesProgramsSliderSection from '../../components/services/AdvisoryServicesProgramsSliderSection';
import { normalizeLocale } from '../../lib/locale';

interface AdvisoryServicesPageProps {
  searchParams: Promise<{ locale?: string }>;
}

const HERO_CONTENT = {
  title: 'Advisory Services',
  breadcrumbItems: [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Advisory Services' },
  ] as BreadcrumbItem[],
  backgroundImage: '/images/aboutus_heroimg.jpg',
  backgroundImageAlt: 'Advisory services background',
};

export default async function AdvisoryServicesPage({
  searchParams,
}: AdvisoryServicesPageProps) {
  const params = await searchParams;
  const locale = normalizeLocale(params.locale);

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <PageHero
        title={HERO_CONTENT.title}
        breadcrumbItems={HERO_CONTENT.breadcrumbItems}
        backgroundImage={HERO_CONTENT.backgroundImage}
        backgroundImageAlt={HERO_CONTENT.backgroundImageAlt}
        locale={locale}
      />

      <AdvisoryServicesOverviewSection />
      <AdvisoryServicesProgramsSliderSection />
    </div>
  );
}
