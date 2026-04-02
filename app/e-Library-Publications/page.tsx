import PageHero from '../components/shared/PageHero';
import ELibrarySection from '../components/e-library/ELibrarySection';

interface ELibraryPublicationsPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function ELibraryPublicationsPage({
  searchParams,
}: ELibraryPublicationsPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title="e-Library/Publications"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'e-Library/Publications' },
        ]}
        backgroundImageAlt="e-Library/Publications background"
        locale={locale}
      />

      <ELibrarySection />
    </div>
  );
}
