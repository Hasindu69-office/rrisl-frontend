import { Search, ChevronDown } from 'lucide-react';
import { vacancyCategories, type VacancyCategory } from './vacancyCategories';

interface VacancySearchBarProps {
  locale: string;
  selectedCategory?: string;
}

export default function VacancySearchBar({
  locale,
  selectedCategory = '',
}: VacancySearchBarProps) {
  const normalizedSelectedCategory = vacancyCategories.includes(selectedCategory as VacancyCategory)
    ? selectedCategory
    : '';

  return (
    <section className="relative bg-white px-4 pt-8 pb-6 md:px-6 md:pt-10 md:pb-8 lg:px-36 lg:pt-12">
      <div className="mx-auto flex w-full max-w-[1480px] justify-end">
        <form
          action="/vacancy"
          method="get"
          className="flex w-full max-w-[520px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-end"
        >
          <input type="hidden" name="locale" value={locale} />

          <label htmlFor="vacancy-category" className="sr-only">
            Search vacancies by category
          </label>

          <div className="relative min-w-0 flex-1">
            <select
              id="vacancy-category"
              name="category"
              defaultValue={normalizedSelectedCategory}
              className="h-[48px] w-full appearance-none border border-[#D9D9D9] bg-white px-4 pr-10 text-sm font-medium text-[#5E6470] outline-none transition focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/15"
              style={{ borderRadius: '12px 6px 6px 12px' }}
            >
              <option value="">Select Category</option>
              {vacancyCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>

          <button
            type="submit"
            className="inline-flex h-[48px] shrink-0 items-center justify-center gap-2 bg-[#2E7D32] px-6 text-sm font-semibold text-white transition hover:bg-[#256A2A] focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:ring-offset-2"
            style={{ borderRadius: '8px 16px 16px 8px' }}
          >
            <Search className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
            <span>Search Job</span>
          </button>
        </form>
      </div>
    </section>
  );
}
