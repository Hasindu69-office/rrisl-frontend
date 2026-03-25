import VacancyCard from './VacancyCard';
import VacancyPagination from './VacancyPagination';
import { vacancyJobs } from './vacancyData';

const VACANCIES_PER_PAGE = 4;

interface VacancyListingsSectionProps {
  locale: string;
  selectedCategory?: string;
  currentPage?: number;
}

export default function VacancyListingsSection({
  locale,
  selectedCategory,
  currentPage = 1,
}: VacancyListingsSectionProps) {
  const filteredJobs = selectedCategory
    ? vacancyJobs.filter((job) => job.category === selectedCategory)
    : vacancyJobs;

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / VACANCIES_PER_PAGE));
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const paginatedJobs = filteredJobs.slice(
    (safeCurrentPage - 1) * VACANCIES_PER_PAGE,
    safeCurrentPage * VACANCIES_PER_PAGE
  );

  return (
    <section className="bg-white px-4 pb-8 md:px-6 md:pb-10 lg:px-36">
      <div className="mx-auto w-full max-w-[1480px]">
        <div className="space-y-10">
          {paginatedJobs.length > 0 ? (
            paginatedJobs.map((job) => (
              <VacancyCard key={job.id} job={job} />
            ))
          ) : (
            <div className="rounded-[20px] border border-dashed border-[#C7D0D9] bg-[#F8FAF8] px-6 py-12 text-center">
              <p className="text-lg font-semibold text-[#111827]">
                No vacancies found for this category.
              </p>
              <p className="mt-2 text-sm text-[#667085]">
                Try another category to view more job postings.
              </p>
            </div>
          )}
        </div>

        <VacancyPagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          locale={locale}
          selectedCategory={selectedCategory}
        />
      </div>
    </section>
  );
}
