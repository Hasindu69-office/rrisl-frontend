import PageHero from '../components/shared/PageHero';
import ResearchManagersSection from '../components/research-managers/ResearchManagersSection';

interface ResearchManagersPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function ResearchManagersPage({
  searchParams,
}: ResearchManagersPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title="Research managers"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Research managers' },
        ]}
        backgroundImageAlt="Research managers background"
        locale={locale}
      />

      <ResearchManagersSection />
    </div>
  );
}
