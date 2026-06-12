import type {
  DepartmentRecommendationImageCard,
  DepartmentRecommendationSection,
  DepartmentRecommendationTableCard,
  DepartmentSingleTypePage,
} from '@/app/lib/types';
import {
  getOptimizedImageUrl,
  getStrapiImageUrl,
  getStrapiMediaUrl,
} from '@/app/lib/strapi';

export type DepartmentRecommendationBlock =
  | {
      type: 'bullets';
      id: string;
      title?: string;
      items: string[];
    }
  | {
      type: 'image';
      id: string;
      title: string;
      imageSrc: string;
      imageAlt: string;
      caption?: string;
    }
  | {
      type: 'table';
      id: string;
      title: string;
      columns: string[];
      rows: string[][];
      note?: string;
    };

export interface DepartmentRecommendationsContent {
  eyebrow: string;
  title: string;
  highlightedText: string;
  blocks: DepartmentRecommendationBlock[];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function splitCsvLine(line: string): string[] {
  const values: string[] = [];
  let currentValue = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      if (inQuotes && line[index + 1] === '"') {
        currentValue += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }

      continue;
    }

    if (character === ',' && !inQuotes) {
      values.push(currentValue);
      currentValue = '';
      continue;
    }

    currentValue += character;
  }

  values.push(currentValue);

  return values.map((value) => value.trim());
}

function parseCsvRows(csvContent: string): string[][] {
  const rows: string[][] = [];
  let currentRow = '';
  let inQuotes = false;

  for (let index = 0; index < csvContent.length; index += 1) {
    const character = csvContent[index];

    if (character === '"') {
      if (inQuotes && csvContent[index + 1] === '"') {
        currentRow += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
        currentRow += character;
      }

      continue;
    }

    if ((character === '\n' || character === '\r') && !inQuotes) {
      if (character === '\r' && csvContent[index + 1] === '\n') {
        index += 1;
      }

      if (currentRow.trim()) {
        rows.push(splitCsvLine(currentRow));
      }

      currentRow = '';
      continue;
    }

    currentRow += character;
  }

  if (currentRow.trim()) {
    rows.push(splitCsvLine(currentRow));
  }

  return rows;
}

async function fetchRecommendationCsv(csvUrl: string): Promise<string> {
  const response = await fetch(csvUrl, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch recommendation CSV: ${response.status}`);
  }

  return response.text();
}

function mapImageCard(card: DepartmentRecommendationImageCard): DepartmentRecommendationBlock | null {
  const title = card.title?.trim();
  const imageSrc =
    getOptimizedImageUrl(card.image, 'large') ||
    getOptimizedImageUrl(card.image, 'medium') ||
    getStrapiImageUrl(card.image);

  if (!title || !imageSrc) {
    return null;
  }

  return {
    type: 'image',
    id: `image-${card.id ? String(card.id) : slugify(title)}`,
    title,
    imageSrc,
    imageAlt: card.image?.alternativeText || title,
    caption: card.subtitle?.trim() || undefined,
  };
}

function mapPointCard(
  card: NonNullable<DepartmentRecommendationSection['points']>[number]
): DepartmentRecommendationBlock | null {
  const items =
    card.points
      ?.map((point) => point.paragraph?.trim())
      .filter((point): point is string => Boolean(point)) || [];

  if (items.length === 0) {
    return null;
  }

  const title = card.title?.trim();

  return {
    type: 'bullets',
    id: `bullets-${card.id ? String(card.id) : slugify(title || items[0])}`,
    title: title || undefined,
    items,
  };
}

async function mapTableCard(
  card: DepartmentRecommendationTableCard
): Promise<DepartmentRecommendationBlock | null> {
  const title = card.title?.trim();
  const csvUrl = getStrapiMediaUrl(card.csvfile);

  if (!title || !csvUrl) {
    return null;
  }

  try {
    const csvContent = await fetchRecommendationCsv(csvUrl);
    const parsedRows = parseCsvRows(csvContent);
    const columns = parsedRows[0]?.filter((column) => column.trim()) || [];
    const rows = parsedRows
      .slice(1)
      .map((row) => row.slice(0, columns.length))
      .filter((row) => row.some((cell) => cell.trim()));

    if (columns.length === 0 || rows.length === 0) {
      throw new Error('Recommendation CSV must include a header row and at least one data row');
    }

    return {
      type: 'table',
      id: `table-${card.id ? String(card.id) : slugify(title)}`,
      title,
      columns,
      rows,
      note: card.description?.trim() || undefined,
    };
  } catch (error) {
    console.error(`Failed to map recommendation table "${title}"`, error);
    return null;
  }
}

async function mapRecommendationBlocks(
  section: DepartmentRecommendationSection,
  fallbackSection: DepartmentRecommendationSection | null | undefined
): Promise<DepartmentRecommendationBlock[]> {
  const imageCards =
    section.applyimagecard === true
      ? section.imagecard?.length
        ? section.imagecard
        : fallbackSection?.imagecard || []
      : [];
  const pointCards =
    section.includepoints === true
      ? section.points?.length
        ? section.points
        : fallbackSection?.points || []
      : [];
  const tableCards =
    section.includetable === true
      ? section.tablecards?.length
        ? section.tablecards
        : fallbackSection?.tablecards || []
      : [];

  const imageBlocks = imageCards
    .map(mapImageCard)
    .filter((block): block is DepartmentRecommendationBlock => Boolean(block));
  const pointBlocks = pointCards
    .map(mapPointCard)
    .filter((block): block is DepartmentRecommendationBlock => Boolean(block));
  const tableBlocks = (
    await Promise.all(tableCards.map((card) => mapTableCard(card)))
  ).filter((block): block is DepartmentRecommendationBlock => Boolean(block));

  return [...imageBlocks, ...pointBlocks, ...tableBlocks];
}

export async function mapDepartmentRecommendations(
  localizedPage: DepartmentSingleTypePage | null | undefined,
  fallbackPage?: DepartmentSingleTypePage | null
): Promise<DepartmentRecommendationsContent | null> {
  const isPresent =
    localizedPage?.recommendationsectionpresent ?? fallbackPage?.recommendationsectionpresent;

  if (isPresent !== true) {
    return null;
  }

  const section = localizedPage?.recommendationsection || fallbackPage?.recommendationsection;

  if (!section) {
    return null;
  }

  const fallbackSection = fallbackPage?.recommendationsection;
  const blocks = await mapRecommendationBlocks(section, fallbackSection);

  if (blocks.length === 0) {
    return null;
  }

  const header = section.sectionheader || fallbackSection?.sectionheader;
  const title =
    header?.title && header.title.trim().length > 0
      ? header.title
      : 'Recommendations';
  const highlightedText =
    header?.hightlightedtext && header.hightlightedtext.trim().length > 0
      ? header.hightlightedtext
      : '';

  return {
    eyebrow: header?.eyebrow?.trim() || 'Recommendations',
    title,
    highlightedText,
    blocks,
  };
}
