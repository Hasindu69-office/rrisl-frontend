import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHero from '../../components/shared/PageHero';
import VacancyDetailContent from '../../components/vacancy/VacancyDetailContent';
import VacancyOverviewPanel from '../../components/vacancy/VacancyOverviewPanel';
import { getVacancyJobById } from '../../components/vacancy/vacancyData';

interface VacancyDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ locale?: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const job = getVacancyJobById(id);

  return {
    title: job ? `${job.title} | Job Details` : 'Job Details',
  };
}

export default async function VacancyDetailPage({
  params,
  searchParams,
}: VacancyDetailPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const locale = query.locale || 'en';
  const job = getVacancyJobById(id);

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title="Job Details"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Vacancy Section', href: '/vacancy' },
          { label: 'Job Details' },
        ]}
        backgroundImageAlt="Job details background"
        locale={locale}
      />

      <section className="mb-72 bg-white px-4 py-12 md:px-6 md:py-16 lg:px-36 lg:py-20">
        <div className="mx-auto grid w-full max-w-[1480px] gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
          <VacancyDetailContent job={job} />
          <div className="hidden self-start lg:sticky lg:top-2 lg:block">
            <VacancyOverviewPanel job={job} />
          </div>
        </div>
      </section>
    </div>
  );
}
