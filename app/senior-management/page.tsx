import PageHero from '../components/shared/PageHero';
import SeniorManagementShowcaseSection from '../components/senior-management/SeniorManagementShowcaseSection';
import { normalizeLocale } from '../lib/locale';
import { seniorManagementShowcaseItems } from './showcaseData';

interface SeniorManagementPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function SeniorManagementPage({
  searchParams,
}: SeniorManagementPageProps) {
  const params = await searchParams;
  const locale = normalizeLocale(params.locale);

  return (
    <div className="min-h-screen bg-[#F9FBF6]">
      <PageHero
        title="Senior Management"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Senior Management' },
        ]}
        backgroundImage="/images/aboutus_heroimg.jpg"
        backgroundImageAlt="Senior management page background"
        locale={locale}
      />
      <div className="mb-72">
      <SeniorManagementShowcaseSection items={seniorManagementShowcaseItems} />
      </div>
    </div>
  );
}
