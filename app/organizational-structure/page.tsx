import PageHero from '../components/shared/PageHero';

interface OrganizationalStructureProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function OrganizationalStructure({
  searchParams,
}: OrganizationalStructureProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      {/* Page Hero Section */}
      <PageHero
        title="Organizational Structure"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Organizational Structure' },
        ]}
        backgroundImageAlt="Organizational Structure background"
        locale={locale}
      />

      {/* Organizational Chart Section */}
      <section className="py-20 md:py-28">
        
        
      </section>
    </div>
  );
}
