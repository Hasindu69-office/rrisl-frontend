import VacancyCard from './VacancyCard';
import VacancyPagination from './VacancyPagination';
import type { VacancyListItemViewModel } from '@/app/lib/vacancy/pageData';

interface VacancyListingsSectionProps {
  currentPage: number;
  emptyStateDescription: string;
  emptyStateTitle: string;
  jobs: VacancyListItemViewModel[];
  jobDetailsLabel: string;
  locale: string;
  selectedCategory?: string;
  totalPages: number;
}

export default function VacancyListingsSection({
  currentPage,
  emptyStateDescription,
  emptyStateTitle,
  jobs,
  jobDetailsLabel,
  locale,
  selectedCategory,
  totalPages,
}: VacancyListingsSectionProps) {
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  return (
    <section className="bg-white px-4 pb-8 md:px-6 md:pb-32 lg:px-36">
      <div className="mx-auto w-full max-w-[1480px]">
        <div className="space-y-10">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <VacancyCard key={job.id} job={job} jobDetailsLabel={jobDetailsLabel} locale={locale} />
            ))
          ) : (
            <div className="rounded-[20px] border border-dashed border-[#C7D0D9] bg-[#F8FAF8] px-6 py-12 text-center">
              <p className="text-lg font-semibold text-[#111827]">{emptyStateTitle}</p>
              <p className="mt-2 text-sm text-[#667085]">{emptyStateDescription}</p>
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
