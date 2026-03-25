import PageHero from '../components/shared/PageHero';
import VacancyListingsSection from '../components/vacancy/VacancyListingsSection';
import VacancySearchBar from '../components/vacancy/VacancySearchBar';

interface VacancyPageProps {
  searchParams: Promise<{ locale?: string; category?: string; page?: string }>;
}

export default async function VacancyPage({ searchParams }: VacancyPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';
  const parsedPage = Number.parseInt(params.page || '1', 10);
  const currentPage = Number.isNaN(parsedPage) ? 1 : parsedPage;

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title="Vacancy Section"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Vacancy Section' },
        ]}
        backgroundImageAlt="Vacancy section background"
        locale={locale}
      />

      <div className="relative mb-48">
        <VacancySearchBar locale={locale} selectedCategory={params.category} />
        <VacancyListingsSection
          locale={locale}
          selectedCategory={params.category}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}
