export interface RubberPriceEntry {
  id: string;
  date: string;
  imageSrc: string;
  imageAlt: string;
  status: 'latest' | 'recent' | 'archive';
  archiveYear: string;
}

const rubberPriceEntriesSource: Omit<RubberPriceEntry, 'archiveYear'>[] = [
  {
    id: 'rubber-price-2026-04-21',
    date: '2026-04-21',
    imageSrc: '/images/rubber-prices/2026-04-21.jpg',
    imageAlt: 'Rubber auction price sheet for April 21, 2026',
  },
  {
    id: 'rubber-price-2026-04-14',
    date: '2026-04-14',
    imageSrc: '/images/rubber-prices/2026-04-21.jpg',
    imageAlt: 'Rubber auction price sheet for April 14, 2026',
  },
  {
    id: 'rubber-price-2026-04-07',
    date: '2026-04-07',
    imageSrc: '/images/rubber-prices/2026-04-21.jpg',
    imageAlt: 'Rubber auction price sheet for April 7, 2026',
  },
  {
    id: 'rubber-price-2026-03-31',
    date: '2026-03-31',
    imageSrc: '/images/rubber-prices/2026-04-21.jpg',
    imageAlt: 'Rubber auction price sheet for March 31, 2026',
  },
  {
    id: 'rubber-price-2026-03-24',
    date: '2026-03-24',
    imageSrc: '/images/rubber-prices/2026-04-21.jpg',
    imageAlt: 'Rubber auction price sheet for March 24, 2026',
  },
  {
    id: 'rubber-price-2026-03-17',
    date: '2026-03-17',
    imageSrc: '/images/rubber-prices/2026-04-21.jpg',
    imageAlt: 'Rubber auction price sheet for March 17, 2026',
  },
  {
    id: 'rubber-price-2026-03-10',
    date: '2026-03-10',
    imageSrc: '/images/rubber-prices/2026-04-21.jpg',
    imageAlt: 'Rubber auction price sheet for March 10, 2026',
  },
  {
    id: 'rubber-price-2026-02-24',
    date: '2026-02-24',
    imageSrc: '/images/rubber-prices/2026-04-21.jpg',
    imageAlt: 'Rubber auction price sheet for February 24, 2026',
  },
  {
    id: 'rubber-price-2026-02-17',
    date: '2026-02-17',
    imageSrc: '/images/rubber-prices/2026-04-21.jpg',
    imageAlt: 'Rubber auction price sheet for February 17, 2026',
  },
  {
    id: 'rubber-price-2026-02-10',
    date: '2026-02-10',
    imageSrc: '/images/rubber-prices/2026-04-21.jpg',
    imageAlt: 'Rubber auction price sheet for February 10, 2026',
  },
  {
    id: 'rubber-price-2026-02-03',
    date: '2026-02-03',
    imageSrc: '/images/rubber-prices/2026-04-21.jpg',
    imageAlt: 'Rubber auction price sheet for February 3, 2026',
  },
  {
    id: 'rubber-price-2026-01-27',
    date: '2026-01-27',
    imageSrc: '/images/rubber-prices/2026-04-21.jpg',
    imageAlt: 'Rubber auction price sheet for January 27, 2026',
  },
  {
    id: 'rubber-price-2026-01-20',
    date: '2026-01-20',
    imageSrc: '/images/rubber-prices/2026-04-21.jpg',
    imageAlt: 'Rubber auction price sheet for January 20, 2026',
  },
  {
    id: 'rubber-price-2026-01-13',
    date: '2026-01-13',
    imageSrc: '/images/rubber-prices/2026-04-21.jpg',
    imageAlt: 'Rubber auction price sheet for January 13, 2026',
  },
  {
    id: 'rubber-price-2026-01-06',
    date: '2026-01-06',
    imageSrc: '/images/rubber-prices/2026-04-21.jpg',
    imageAlt: 'Rubber auction price sheet for January 6, 2026',
  },
  {
    id: 'rubber-price-2025-12-30',
    date: '2025-12-30',
    imageSrc: '/images/rubber-prices/2026-04-21.jpg',
    imageAlt: 'Rubber auction price sheet for December 30, 2025',
  },
  {
    id: 'rubber-price-2025-12-23',
    date: '2025-12-23',
    imageSrc: '/images/rubber-prices/2026-04-21.jpg',
    imageAlt: 'Rubber auction price sheet for December 23, 2025',
  },
  {
    id: 'rubber-price-2025-12-16',
    date: '2025-12-16',
    imageSrc: '/images/rubber-prices/2026-04-21.jpg',
    imageAlt: 'Rubber auction price sheet for December 16, 2025',
  },
  {
    id: 'rubber-price-2025-12-09',
    date: '2025-12-09',
    imageSrc: '/images/rubber-prices/2026-04-21.jpg',
    imageAlt: 'Rubber auction price sheet for December 9, 2025',
  },
];

export const rubberPriceEntries: RubberPriceEntry[] = [...rubberPriceEntriesSource]
  .sort((left, right) => right.date.localeCompare(left.date))
  .map((entry, index) => ({
    ...entry,
    status: index === 0 ? 'latest' : index < 4 ? 'recent' : 'archive',
    archiveYear: entry.date.slice(0, 4),
  }));

export const latestRubberPriceEntry = rubberPriceEntries[0] ?? null;

export const recentRubberPriceEntries = rubberPriceEntries.slice(0, 4);

export const rubberPriceArchiveYears = Array.from(
  new Set(rubberPriceEntries.map((entry) => entry.archiveYear)),
);

export const rubberPriceEntriesByYear = rubberPriceArchiveYears.reduce<
  Record<string, RubberPriceEntry[]>
>((accumulator, year) => {
  accumulator[year] = rubberPriceEntries.filter((entry) => entry.archiveYear === year);
  return accumulator;
}, {});
