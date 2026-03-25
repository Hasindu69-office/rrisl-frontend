import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface VacancyPaginationProps {
  currentPage: number;
  totalPages: number;
  locale: string;
  selectedCategory?: string;
}

function buildPaginationHref(page: number, locale: string, selectedCategory?: string) {
  const params = new URLSearchParams();

  if (selectedCategory) {
    params.set('category', selectedCategory);
  }

  if (page > 1) {
    params.set('page', String(page));
  }

  if (locale !== 'en') {
    params.set('locale', locale);
  }

  const query = params.toString();
  return `/vacancy${query ? `?${query}` : ''}`;
}

export default function VacancyPagination({
  currentPage,
  totalPages,
  locale,
  selectedCategory,
}: VacancyPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className="mt-10 flex flex-col items-center justify-center gap-4 pb-16 md:mt-12 md:flex-row md:justify-between"
      aria-label="Vacancy pagination"
    >
      <div className="flex justify-center md:w-[96px] md:justify-start">
        {currentPage > 1 ? (
          <Link
            href={buildPaginationHref(currentPage - 1, locale, selectedCategory)}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-[7px] border border-[#A9B1B8] bg-white px-4 text-sm font-medium text-[#6B7280] transition hover:border-[#2E7D32] hover:text-[#2E7D32]"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.8} />
            <span>Prev</span>
          </Link>
        ) : (
          <div className="h-9 md:w-[96px]" aria-hidden="true" />
        )}
      </div>

      <div className="flex items-center gap-4">
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;
          const active = page === currentPage;

          return (
            <Link
              key={page}
              href={buildPaginationHref(page, locale, selectedCategory)}
              aria-current={active ? 'page' : undefined}
              className={`inline-flex h-9 min-w-9 items-center justify-center rounded-[6px] border text-sm font-medium transition ${
                active
                  ? 'border-[#2E7D32] bg-[#2E7D32] px-3 text-white'
                  : 'border-[#A9B1B8] bg-white px-3 text-[#475467] hover:border-[#2E7D32] hover:text-[#2E7D32]'
              }`}
            >
              {page}
            </Link>
          );
        })}
      </div>

      <div className="flex justify-center md:w-[96px] md:justify-end">
        {currentPage < totalPages ? (
          <Link
            href={buildPaginationHref(currentPage + 1, locale, selectedCategory)}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-[7px] border border-[#A9B1B8] bg-white px-4 text-sm font-medium text-[#6B7280] transition hover:border-[#2E7D32] hover:text-[#2E7D32]"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" strokeWidth={1.8} />
          </Link>
        ) : (
          <div className="h-9 md:w-[96px]" aria-hidden="true" />
        )}
      </div>
    </nav>
  );
}
