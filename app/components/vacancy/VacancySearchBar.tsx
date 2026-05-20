import { Search, ChevronDown } from 'lucide-react';

interface VacancySearchBarProps {
  categories: string[];
  locale: string;
  searchButtonLabel: string;
  searchCategoryLabel: string;
  selectedCategory?: string;
}

export default function VacancySearchBar({
  categories,
  locale,
  searchButtonLabel,
  searchCategoryLabel,
  selectedCategory = '',
}: VacancySearchBarProps) {
  const normalizedSelectedCategory = categories.includes(selectedCategory) ? selectedCategory : '';

  return (
    <section className="relative bg-white px-4 pt-8 pb-6 md:px-6 md:pt-10 md:pb-16 lg:px-36 lg:pt-12">
      <div className="mx-auto flex w-full max-w-[1480px] justify-end">
        <form
          action="/vacancy"
          method="get"
          className="flex w-full max-w-[430px] flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-end"
        >
          <input type="hidden" name="locale" value={locale} />

          <label htmlFor="vacancy-category" className="sr-only">
            {searchCategoryLabel}
          </label>

          <div className="relative min-w-0 flex-1 bg-white sm:-mr-px">
            <select
              id="vacancy-category"
              name="category"
              defaultValue={normalizedSelectedCategory}
              className="h-[60px] w-full appearance-none border-0 bg-white px-5 pr-12 text-base font-medium text-[#7A7A7A] outline-none focus:ring-0"
              style={{ borderRadius: '18px 0 0 18px' }}
            >
              <option value="">{searchCategoryLabel}</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <ChevronDown
              className="pointer-events-none absolute right-4 top-1/2 h-[22px] w-[22px] -translate-y-1/2 text-[#6B7280]"
              strokeWidth={2}
              aria-hidden="true"
            />
          </div>

          <button
            type="submit"
            className="inline-flex h-[60px] shrink-0 items-center justify-center gap-3 rounded-[22px] bg-[#2E7D32] px-7 text-[18px] font-semibold text-white transition hover:bg-[#256A2A] focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:ring-offset-2 sm:rounded-l-none sm:rounded-r-[22px]"
          >
            <Search className="h-5 w-5" strokeWidth={2.4} aria-hidden="true" />
            <span>{searchButtonLabel}</span>
          </button>
        </form>
      </div>
    </section>
  );
}
