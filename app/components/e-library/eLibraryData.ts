import type { PublicationCardItem } from '../shared/PublicationCard';

export type ELibraryPublicationItem = PublicationCardItem;

export interface ELibraryFilterNode {
  id: string;
  label: string;
  publications?: ELibraryPublicationItem[];
  children?: ELibraryFilterNode[];
}

const sharedBookImage = '/images/departments/recommendationBook.webp';

function toPublicationSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function createPublication(id: string, title: string): ELibraryPublicationItem {
  return {
    id,
    title,
    imageSrc: sharedBookImage,
    imageAlt: title,
    readMoreHref: `/e-Library-Publications/${toPublicationSlug(id)}`,
  };
}

export const eLibraryFilterTree: ELibraryFilterNode[] = [
  {
    id: 'library',
    label: 'The Library',
    publications: [
      createPublication('library-1', 'Research Facilities for Higher Studies'),
      createPublication('library-2', 'Rubber Planting Advisory Guide'),
      createPublication('library-3', 'Laboratory Reference Collection'),
      createPublication('library-4', 'Plantation Management Manual'),
      createPublication('library-5', 'RRISL Extension Publications'),
      createPublication('library-6', 'Natural Rubber Knowledge Series'),
      createPublication('library-7', 'Reference Books for Crop Scientists'),
      createPublication('library-8', 'Library Archive Publications'),
    ],
  },
  {
    id: 'handbooks',
    label: 'Handbooks of Rubber',
    publications: [
      createPublication('handbooks-1', 'Handbook of Rubber Cultivation'),
      createPublication('handbooks-2', 'Guide to Nursery Management'),
      createPublication('handbooks-3', 'Rubber Tapping Field Handbook'),
      createPublication('handbooks-4', 'Soil Conservation in Plantations'),
      createPublication('handbooks-5', 'Smallholder Advisory Handbook'),
      createPublication('handbooks-6', 'Field Diagnostics for Rubber Trees'),
    ],
  },
  {
    id: 'major-annual-periodicals',
    label: 'Major Annual Periodicals',
    children: [
      {
        id: 'annual-report',
        label: 'Annual Report',
        publications: [
          createPublication('annual-report-1', 'Annual Report 2025'),
          createPublication('annual-report-2', 'Annual Report 2024'),
          createPublication('annual-report-3', 'Annual Report 2023'),
          createPublication('annual-report-4', 'Annual Report 2022'),
        ],
      },
      {
        id: 'annual-review',
        label: 'Annual Review',
        publications: [
          createPublication('annual-review-1', 'Annual Review 2025'),
          createPublication('annual-review-2', 'Annual Review 2024'),
          createPublication('annual-review-3', 'Annual Review 2023'),
          createPublication('annual-review-4', 'Annual Review 2022'),
        ],
      },
      {
        id: 'journal-of-rrisl',
        label: 'Journal of RRISL',
        publications: [
          createPublication('journal-1', 'Journal of RRISL Vol. 39'),
          createPublication('journal-2', 'Journal of RRISL Vol. 38'),
          createPublication('journal-3', 'Journal of RRISL Vol. 37'),
          createPublication('journal-4', 'Journal of RRISL Vol. 36'),
        ],
      },
      {
        id: 'bulletin-of-rrisl',
        label: 'Bulletin of RRISL',
        publications: [
          createPublication('bulletin-1', 'Bulletin of RRISL Issue 12'),
          createPublication('bulletin-2', 'Bulletin of RRISL Issue 11'),
          createPublication('bulletin-3', 'Bulletin of RRISL Issue 10'),
          createPublication('bulletin-4', 'Bulletin of RRISL Issue 09'),
        ],
      },
      {
        id: 'rubber-puwath',
        label: 'Rubber Puwath',
        publications: [
          createPublication('puwath-1', 'Rubber Puwath Edition 2025'),
          createPublication('puwath-2', 'Rubber Puwath Edition 2024'),
          createPublication('puwath-3', 'Rubber Puwath Edition 2023'),
          createPublication('puwath-4', 'Rubber Puwath Edition 2022'),
        ],
      },
    ],
  },
  {
    id: 'other',
    label: 'Other',
    children: [
      {
        id: 'other-publications',
        label: 'Other Publications',
        publications: [
          createPublication('other-publications-1', 'Rubber Technology Notes'),
          createPublication('other-publications-2', 'Proceedings of Research Symposium'),
          createPublication('other-publications-3', 'Training Manuals for Growers'),
          createPublication('other-publications-4', 'RRISL Technical Leaflets'),
        ],
      },
      {
        id: 'other-articles',
        label: 'Other Articles',
        publications: [
          createPublication('other-articles-1', 'Climate Adaptation in Rubber Lands'),
          createPublication('other-articles-2', 'Advances in Latex Processing'),
          createPublication('other-articles-3', 'Weed Management Field Article'),
          createPublication('other-articles-4', 'Improving Smallholder Productivity'),
        ],
      },
    ],
  },
];
