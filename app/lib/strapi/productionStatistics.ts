import type { StatisticsContentEntry } from '../types';
import { getStrapiMediaUrl } from './media';
import { fetchStrapi, unwrapCollection } from './client';
import type {
  StatisticsBarSeries,
  StatisticsChartCardData,
  StatisticsPoint,
} from '@/app/components/production-statistics/productionStatisticsData';
import {
  createProductionStatisticsCard,
  createMultiLineTrendStatisticsCard,
  createTrendStatisticsCard,
} from '@/app/components/production-statistics/productionStatisticsData';

const PRODUCTION_SERIES_DEFINITIONS = [
  { label: 'Sheet', color: '#2AC669' },
  { label: 'Sole Crepe', color: '#0F9D58' },
  { label: 'Scrap Crepe', color: '#8BCF5B' },
  { label: 'Latex Crepe', color: '#D7E870' },
  { label: 'T.S.R.', color: '#FFB648' },
  { label: 'Latex Other', color: '#F27D42' },
] as const;

type StatisticsContentRecord = Partial<StatisticsContentEntry> & {
  id?: number;
  attributes?: Partial<StatisticsContentEntry>;
};

type ParsedProductionRow = {
  year: number;
  values: Record<(typeof PRODUCTION_SERIES_DEFINITIONS)[number]['label'], number>;
};

type ParsedExportConsumptionRow = {
  year: number;
  exports: number;
  domesticConsumption: number;
};

type ParsedPriceRow = {
  year: number;
  exportFob: number;
  colomboRss: number;
};

export interface StatisticsPageCards {
  productionCard: StatisticsChartCardData | null;
  exportCard: StatisticsChartCardData | null;
  priceCard: StatisticsChartCardData | null;
  consumptionCard: StatisticsChartCardData | null;
}

function buildStatisticsQuery(): string {
  const params = new URLSearchParams();

  params.set('populate[productionstatistic]', 'true');
  params.set('populate[exportandconsumptionstats]', 'true');
  params.set('populate[pricetrendstat]', 'true');
  params.set('pagination[pageSize]', '100');
  params.set('sort[0]', 'publishedAt:desc');
  params.set('sort[1]', 'updatedAt:desc');

  return params.toString();
}

async function fetchStatisticsEntries(): Promise<StatisticsContentEntry[]> {
  const queryString = buildStatisticsQuery();
  const response = await fetchStrapi<unknown>(`/api/statistcs?${queryString}`);
  const items = unwrapCollection<StatisticsContentRecord>(response);

  return items.map((item) => {
    const attributes = item.attributes || item;

    return {
      id: item.id || attributes.id || 0,
      documentId: item.documentId || attributes.documentId,
      productionstatistic: attributes.productionstatistic || item.productionstatistic || null,
      exportandconsumptionstats:
        attributes.exportandconsumptionstats || item.exportandconsumptionstats || null,
      pricetrendstat: attributes.pricetrendstat || item.pricetrendstat || null,
      createdAt: attributes.createdAt || item.createdAt,
      updatedAt: attributes.updatedAt || item.updatedAt,
      publishedAt: attributes.publishedAt || item.publishedAt,
    };
  });
}

function normalizeHeaderCell(value: string): string {
  return value.replace(/\s+/g, ' ').replace(/^"|"$/g, '').trim().toLowerCase();
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

function parseNumericValue(value: string): number | null {
  const normalized = value.replace(/^"|"$/g, '').replace(/,/g, '').trim();

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}

function buildHeaderIndex(header: string[]): Map<string, number> {
  return new Map(
    header.map((cell, index) => [normalizeHeaderCell(cell), index]),
  );
}

function getRequiredProductionColumnIndexes(headerIndex: Map<string, number>) {
  const columnMap = {
    year: headerIndex.get('year'),
    Sheet: headerIndex.get('sheet'),
    'Sole Crepe': headerIndex.get('sole crepe'),
    'Scrap Crepe': headerIndex.get('scrap crepe'),
    'Latex Crepe': headerIndex.get('latex crepe'),
    'T.S.R.': headerIndex.get('t.s.r.'),
    'Latex Other': headerIndex.get('latex other'),
  } as const;

  const missingColumn = Object.entries(columnMap).find(([, value]) => value === undefined);

  if (missingColumn) {
    throw new Error(`Missing CSV column: ${missingColumn[0]}`);
  }

  return columnMap as Record<keyof typeof columnMap, number>;
}

function getRequiredExportConsumptionColumnIndexes(headerIndex: Map<string, number>) {
  const columnMap = {
    year: headerIndex.get('year'),
    exports: headerIndex.get('exports'),
    domesticConsumption: headerIndex.get('domestic consumption'),
  } as const;

  const missingColumn = Object.entries(columnMap).find(([, value]) => value === undefined);

  if (missingColumn) {
    throw new Error(`Missing export/consumption CSV column: ${missingColumn[0]}`);
  }

  return columnMap as Record<keyof typeof columnMap, number>;
}

function parseProductionRows(csvContent: string): ParsedProductionRow[] {
  const rows = parseCsvRows(csvContent);

  if (rows.length < 2) {
    throw new Error('Production statistics CSV does not contain enough rows');
  }

  const header = rows[0];
  const columnIndexes = getRequiredProductionColumnIndexes(buildHeaderIndex(header));
  const parsedRows: ParsedProductionRow[] = [];

  for (const row of rows.slice(1)) {
    const year = parseNumericValue(row[columnIndexes.year] ?? '');

    if (year === null) {
      continue;
    }

    const values = {
      Sheet: parseNumericValue(row[columnIndexes.Sheet] ?? ''),
      'Sole Crepe': parseNumericValue(row[columnIndexes['Sole Crepe']] ?? ''),
      'Scrap Crepe': parseNumericValue(row[columnIndexes['Scrap Crepe']] ?? ''),
      'Latex Crepe': parseNumericValue(row[columnIndexes['Latex Crepe']] ?? ''),
      'T.S.R.': parseNumericValue(row[columnIndexes['T.S.R.']] ?? ''),
      'Latex Other': parseNumericValue(row[columnIndexes['Latex Other']] ?? ''),
    };

    if (Object.values(values).some((value) => value === null)) {
      continue;
    }

    parsedRows.push({
      year,
      values: values as ParsedProductionRow['values'],
    });
  }

  if (parsedRows.length === 0) {
    throw new Error('Production statistics CSV did not produce any complete rows');
  }

  return parsedRows.sort((first, second) => first.year - second.year);
}

function parseExportConsumptionRows(csvContent: string): ParsedExportConsumptionRow[] {
  const rows = parseCsvRows(csvContent);

  if (rows.length < 3) {
    throw new Error('Export and consumption CSV does not contain enough rows');
  }

  const header = rows[0];
  const columnIndexes = getRequiredExportConsumptionColumnIndexes(buildHeaderIndex(header));
  const parsedRows: ParsedExportConsumptionRow[] = [];

  for (const row of rows.slice(2)) {
    const year = parseNumericValue(row[columnIndexes.year] ?? '');
    const exports = parseNumericValue(row[columnIndexes.exports] ?? '');
    const domesticConsumption = parseNumericValue(row[columnIndexes.domesticConsumption] ?? '');

    if (year === null || exports === null || domesticConsumption === null) {
      continue;
    }

    parsedRows.push({
      year,
      exports,
      domesticConsumption,
    });
  }

  if (parsedRows.length === 0) {
    throw new Error('Export and consumption CSV did not produce any complete rows');
  }

  return parsedRows.sort((first, second) => first.year - second.year);
}

function parsePriceRows(csvContent: string): ParsedPriceRow[] {
  const rows = parseCsvRows(csvContent);

  if (rows.length < 2) {
    throw new Error('Price CSV does not contain enough rows');
  }

  const header = rows[0];
  const yearColumns = header
    .map((cell, index) => ({
      index,
      year: parseNumericValue(cell),
    }))
    .filter((entry) => entry.year !== null) as Array<{ index: number; year: number }>;

  if (yearColumns.length === 0) {
    throw new Error('Price CSV does not contain year columns');
  }

  const exportRow = rows.find((row) => normalizeHeaderCell(row[0] ?? '') === '7.1 exports f.o.b');
  const rssRow = rows.find((row) => normalizeHeaderCell(row[0] ?? '') === '7.2 colombo rss');

  if (!exportRow || !rssRow) {
    throw new Error('Price CSV is missing required price rows');
  }

  const parsedRows = yearColumns.reduce<ParsedPriceRow[]>((accumulator, column) => {
    const exportFob = parseNumericValue(exportRow[column.index] ?? '');
    const colomboRss = parseNumericValue(rssRow[column.index] ?? '');

    if (exportFob === null || colomboRss === null) {
      return accumulator;
    }

    accumulator.push({
      year: column.year,
      exportFob,
      colomboRss,
    });

    return accumulator;
  }, []);

  if (parsedRows.length === 0) {
    throw new Error('Price CSV did not produce any complete rows');
  }

  return parsedRows.sort((first, second) => first.year - second.year);
}

function buildProductionSeries(rows: ParsedProductionRow[]): StatisticsBarSeries[] {
  return PRODUCTION_SERIES_DEFINITIONS.map(({ label, color }) => {
    const points: StatisticsPoint[] = rows.map((row) => ({
      year: row.year,
      value: row.values[label],
    }));

    return {
      label,
      color,
      points,
    };
  });
}

async function fetchStatisticsCsv(csvUrl: string): Promise<string> {
  const response = await fetch(csvUrl, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch statistics CSV: ${response.status}`);
  }

  return response.text();
}

function buildExportCard(
  rows: ParsedExportConsumptionRow[],
  csvUrl: string,
): StatisticsChartCardData {
  return createTrendStatisticsCard(
    'Export trend',
    'Use the period switcher to focus on a decade while keeping the latest direction visible.',
    'Export volume',
    rows.map((row) => ({
      year: row.year,
      value: row.exports,
    })),
    {
      downloadUrl: csvUrl,
      downloadLabel: 'Download export and consumption data (CSV)',
      downloadDescription: 'Includes year-by-year export and domestic consumption data.',
    },
  );
}

function buildConsumptionCard(
  rows: ParsedExportConsumptionRow[],
  csvUrl: string,
): StatisticsChartCardData {
  return createTrendStatisticsCard(
    'Consumption trend',
    'Segmented filters tighten the time window while preserving a stable chart layout.',
    'Consumption volume',
    rows.map((row) => ({
      year: row.year,
      value: row.domesticConsumption,
    })),
    {
      downloadUrl: csvUrl,
      downloadLabel: 'Download export and consumption data (CSV)',
      downloadDescription: 'Includes year-by-year export and domestic consumption data.',
    },
  );
}

function buildPriceCard(rows: ParsedPriceRow[], csvUrl: string): StatisticsChartCardData {
  const latestRow = rows[rows.length - 1];
  const priceGap = Math.abs(latestRow.exportFob - latestRow.colomboRss);
  const higherSeries = latestRow.exportFob >= latestRow.colomboRss
    ? 'Exports f.o.b'
    : 'Colombo RSS';

  return createMultiLineTrendStatisticsCard(
    'Price trend',
    'Track export and Colombo RSS prices together to compare market movement over time.',
    'Price (Rs/kg)',
    [
      {
        label: 'Exports f.o.b',
        color: '#2AC669',
        points: rows.map((row) => ({
          year: row.year,
          value: row.exportFob,
        })),
      },
      {
        label: 'Colombo RSS',
        color: '#0F9D58',
        points: rows.map((row) => ({
          year: row.year,
          value: row.colomboRss,
        })),
      },
    ],
    {
      downloadUrl: csvUrl,
      downloadLabel: 'Download price data (CSV)',
      downloadDescription: 'Includes Exports f.o.b and Colombo RSS yearly price data.',
      sidePanel: {
        title: 'Price summary',
        description: `Latest market snapshot for ${latestRow.year}.`,
        items: [
          {
            label: 'Latest Exports f.o.b',
            value: latestRow.exportFob.toLocaleString(),
            detail: `${latestRow.year}`,
          },
          {
            label: 'Latest Colombo RSS',
            value: latestRow.colomboRss.toLocaleString(),
            detail: `${latestRow.year}`,
          },
          {
            label: 'Price gap',
            value: priceGap.toLocaleString(),
            detail: `${higherSeries} is higher`,
          },
          {
            label: 'Higher series',
            value: higherSeries,
            detail: `Based on ${latestRow.year} prices`,
          },
        ],
      },
    },
  );
}

export async function getStatisticsPageCards(
  _locale: string = 'en',
): Promise<StatisticsPageCards> {
  const emptyCards: StatisticsPageCards = {
    productionCard: null,
    exportCard: null,
    priceCard: null,
    consumptionCard: null,
  };

  try {
    const entries = await fetchStatisticsEntries();
    const latestEntry = entries[0];

    if (!latestEntry) {
      return emptyCards;
    }

    const productionUrl = getStrapiMediaUrl(latestEntry.productionstatistic);
    const exportConsumptionUrl = getStrapiMediaUrl(latestEntry.exportandconsumptionstats);
    const priceTrendUrl = getStrapiMediaUrl(latestEntry.pricetrendstat);

    const [productionCard, exportCard, priceCard, consumptionCard] = await Promise.all([
      (async () => {
        if (!productionUrl) {
          return null;
        }

        const csvContent = await fetchStatisticsCsv(productionUrl);
        const parsedRows = parseProductionRows(csvContent);

        return createProductionStatisticsCard(buildProductionSeries(parsedRows), {
          downloadUrl: productionUrl,
        });
      })().catch((error) => {
        console.error('Failed to load production statistics from CSV', error);
        return null;
      }),
      (async () => {
        if (!exportConsumptionUrl) {
          return null;
        }

        const csvContent = await fetchStatisticsCsv(exportConsumptionUrl);
        const parsedRows = parseExportConsumptionRows(csvContent);

        return buildExportCard(parsedRows, exportConsumptionUrl);
      })().catch((error) => {
        console.error('Failed to load export statistics from CSV', error);
        return null;
      }),
      (async () => {
        if (!priceTrendUrl) {
          return null;
        }

        const csvContent = await fetchStatisticsCsv(priceTrendUrl);
        const parsedRows = parsePriceRows(csvContent);

        return buildPriceCard(parsedRows, priceTrendUrl);
      })().catch((error) => {
        console.error('Failed to load price statistics from CSV', error);
        return null;
      }),
      (async () => {
        if (!exportConsumptionUrl) {
          return null;
        }

        const csvContent = await fetchStatisticsCsv(exportConsumptionUrl);
        const parsedRows = parseExportConsumptionRows(csvContent);

        return buildConsumptionCard(parsedRows, exportConsumptionUrl);
      })().catch((error) => {
        console.error('Failed to load consumption statistics from CSV', error);
        return null;
      }),
    ]);

    return {
      productionCard,
      exportCard,
      priceCard,
      consumptionCard,
    };
  } catch (error) {
    console.error('Failed to load statistics page cards', error);
    return emptyCards;
  }
}

export async function getProductionStatisticsCard(
  locale: string = 'en',
): Promise<StatisticsChartCardData | null> {
  const cards = await getStatisticsPageCards(locale);
  return cards.productionCard;
}
