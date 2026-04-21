import PageHero from '../components/shared/PageHero';
import ServicesSection from '../components/services/ServicesSection';

interface ServicesPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title="Services"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Services' },
        ]}
        backgroundImageAlt="Services background"
        locale={locale}
      />

      <ServicesSection />
    </div>
  );
}
