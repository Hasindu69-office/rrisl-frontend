import PageHero from '../components/shared/PageHero';
import DownloadsSection from '../components/downloads/DownloadsSection';

interface DownloadsPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function DownloadsPage({
  searchParams,
}: DownloadsPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title="Downloads"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Downloads' },
        ]}
        backgroundImageAlt="Downloads background"
        locale={locale}
      />

      <DownloadsSection />
    </div>
  );
}
