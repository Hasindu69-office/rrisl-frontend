import PageHero from '../components/shared/PageHero';
import VacancyListingsSection from '../components/vacancy/VacancyListingsSection';
import VacancySearchBar from '../components/vacancy/VacancySearchBar';
import { getVacancyDepartments, getVacancyPage, getVacancies } from '../lib/strapi';
import {
  mapVacancyCategories,
  mapVacancyPageData,
  mapVacancyToListItem,
} from '../lib/vacancy/pageData';

interface VacancyPageProps {
  searchParams: Promise<{ locale?: string; category?: string; page?: string }>;
}

const VACANCIES_PER_PAGE = 4;

export default async function VacancyPage({ searchParams }: VacancyPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';
  const parsedPage = Number.parseInt(params.page || '1', 10);
  const currentPage = Number.isNaN(parsedPage) ? 1 : parsedPage;
  const [vacancyPage, fallbackPage, departments, vacancyResponse] = await Promise.all([
    getVacancyPage(locale),
    locale === 'en' ? Promise.resolve(null) : getVacancyPage('en'),
    getVacancyDepartments(locale),
    getVacancies({
      category: params.category,
      locale,
      page: currentPage,
      pageSize: VACANCIES_PER_PAGE,
      state: 'open',
    }),
  ]);
  const pageData = mapVacancyPageData(vacancyPage, fallbackPage);
  const categories = mapVacancyCategories(departments);
  const totalPages = Math.max(1, vacancyResponse.pagination.pageCount || 1);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const finalVacancyResponse =
    safeCurrentPage === currentPage
      ? vacancyResponse
      : await getVacancies({
          category: params.category,
          locale,
          page: safeCurrentPage,
          pageSize: VACANCIES_PER_PAGE,
          state: 'open',
        });
  const jobs = finalVacancyResponse.items.map(mapVacancyToListItem);

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title={pageData.hero.title}
        breadcrumbItems={pageData.hero.breadcrumbItems}
        backgroundImage={pageData.hero.backgroundImage}
        backgroundImageAlt={pageData.hero.backgroundImageAlt}
        locale={locale}
      />

      <div className="relative mb-48">
        <VacancySearchBar
          categories={categories}
          locale={locale}
          searchButtonLabel={pageData.labels.searchButtonLabel}
          searchCategoryLabel={pageData.labels.searchCategoryLabel}
          selectedCategory={params.category}
        />
        <VacancyListingsSection
          currentPage={safeCurrentPage}
          emptyStateDescription={pageData.emptyState.description}
          emptyStateTitle={pageData.emptyState.title}
          jobs={jobs}
          jobDetailsLabel={pageData.labels.jobDetailsLabel}
          locale={locale}
          selectedCategory={params.category}
          totalPages={Math.max(1, finalVacancyResponse.pagination.pageCount || 1)}
        />
      </div>
    </div>
  );
}
