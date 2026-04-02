import PageHero from '../components/shared/PageHero';
import TrainingProgramsOverviewSection from '../components/training-program/TrainingProgramsOverviewSection';

interface TrainingProgramPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function TrainingProgramPage({
  searchParams,
}: TrainingProgramPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title="Training Program"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Training Program' },
        ]}
        backgroundImageAlt="Training program background"
        locale={locale}
      />

      <TrainingProgramsOverviewSection />
    </div>
  );
}
