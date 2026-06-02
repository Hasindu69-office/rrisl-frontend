import { buildStatisticsPageContent } from '@/app/lib/statistics/pageData';
import type {
  StatConsumptionTab,
  StatExportTab,
  StatPriceTab,
  StatProductionTab,
  StatisticsContentEntry,
  StatisticsPage,
  StatisticsPageContent,
} from '../types';
import { getStrapiMediaUrl } from './media';
import { fetchStrapi, unwrapCollection, unwrapSingleEntity, withLocaleFallback } from './client';
import type {
  StatisticsBarSeries,
  StatisticsChartCardData,
  StatisticsCardUiLabels,
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

type ProductionSeriesLabel = (typeof PRODUCTION_SERIES_DEFINITIONS)[number]['label'];

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

function buildStatisticsDatasetQuery(): string {
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
  const queryString = buildStatisticsDatasetQuery();
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

function buildStatisticsPageQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[pagehero][populate][backgroundImage]', 'true');
  params.set('populate[pagehero][populate][Breadcrumb]', 'true');

  return params.toString();
}

async function fetchStatisticsPage(locale: string): Promise<StatisticsPage | null> {
  const queryString = buildStatisticsPageQuery(locale);
  const url = queryString ? `/api/statistics-page?${queryString}` : '/api/statistics-page';
  const response = await fetchStrapi<unknown>(url);
  return unwrapSingleEntity<StatisticsPage>(response);
}

function buildStatProductionTabQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[productionstatslabel][populate]', '*');
  params.set('populate[productiondonutchart][populate]', '*');

  return params.toString();
}

async function fetchStatProductionTab(locale: string): Promise<StatProductionTab | null> {
  const queryString = buildStatProductionTabQuery(locale);
  const url = queryString ? `/api/stat-production-tab?${queryString}` : '/api/stat-production-tab';
  const response = await fetchStrapi<unknown>(url);
  return unwrapSingleEntity<StatProductionTab>(response);
}

function buildStatExportTabQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[exportstatlabels][populate]', '*');
  params.set('populate[exportdonutchart][populate]', '*');

  return params.toString();
}

async function fetchStatExportTab(locale: string): Promise<StatExportTab | null> {
  const queryString = buildStatExportTabQuery(locale);
  const url = queryString ? `/api/stat-export-tab?${queryString}` : '/api/stat-export-tab';
  const response = await fetchStrapi<unknown>(url);
  return unwrapSingleEntity<StatExportTab>(response);
}

function buildStatPriceTabQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[pricetrendstatlabel][populate]', '*');

  return params.toString();
}

async function fetchStatPriceTab(locale: string): Promise<StatPriceTab | null> {
  const queryString = buildStatPriceTabQuery(locale);
  const url = queryString ? `/api/stat-price-tab?${queryString}` : '/api/stat-price-tab';
  const response = await fetchStrapi<unknown>(url);
  return unwrapSingleEntity<StatPriceTab>(response);
}

function buildStatConsumptionTabQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[consumptionstatlabel][populate]', '*');
  params.set('populate[consumptiondonutchart][populate]', '*');

  return params.toString();
}

async function fetchStatConsumptionTab(locale: string): Promise<StatConsumptionTab | null> {
  const queryString = buildStatConsumptionTabQuery(locale);
  const url = queryString ? `/api/stat-consumption-tab?${queryString}` : '/api/stat-consumption-tab';
  const response = await fetchStrapi<unknown>(url);
  return unwrapSingleEntity<StatConsumptionTab>(response);
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

function buildProductionSeries(
  rows: ParsedProductionRow[],
  labelOverrides?: Partial<Record<ProductionSeriesLabel, string>>,
): StatisticsBarSeries[] {
  return PRODUCTION_SERIES_DEFINITIONS.map(({ label, color }) => {
    const points: StatisticsPoint[] = rows.map((row) => ({
      year: row.year,
      value: row.values[label],
    }));

    return {
      label: labelOverrides?.[label] || label,
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
  exportTab?: StatExportTab | null,
  statisticsPage?: StatisticsPage | null,
): StatisticsChartCardData {
  const exportTabLabels = exportTab?.exportstatlabels;
  const exportDonutLabels = exportTab?.exportdonutchart;
  const yAxisLabel = exportTabLabels?.yaxislabel || exportTab?.exportvolumelabel || 'Export volume';

  return createTrendStatisticsCard(
    exportTabLabels?.statisticcharttitle || 'Export trend',
    undefined,
    yAxisLabel,
    rows.map((row) => ({
      year: row.year,
      value: row.exports,
    })),
    {
      valueDecimals: 1,
      downloadUrl: csvUrl,
      downloadLabel:
        exportTabLabels?.statisticdownloadbuttonlabel || 'Download export and consumption data (CSV)',
      downloadDescription:
        exportTabLabels?.statisticdownloaddescription ||
        'Includes year-by-year export and domestic consumption data.',
      uiLabels: {
        allYearsLabel: statisticsPage?.allyearslabel,
        atAGlanceLabel: statisticsPage?.ataglancelabel,
        detailedDataLabel: statisticsPage?.detaileddatalabel,
        dataPointsLabel: statisticsPage?.datapointslabel,
        changeLabel: statisticsPage?.changelabel,
        latestValueLabel: exportTab?.latestvaluelabel,
        summaryTitle: exportDonutLabels?.title,
        summaryDescription: exportDonutLabels?.description,
        summaryCenterLabel: exportDonutLabels?.middlevalue,
      },
    },
  );
}

function buildConsumptionCard(
  rows: ParsedExportConsumptionRow[],
  csvUrl: string,
  consumptionTab?: StatConsumptionTab | null,
  statisticsPage?: StatisticsPage | null,
): StatisticsChartCardData {
  const consumptionTabLabels = consumptionTab?.consumptionstatlabel;
  const consumptionDonutLabels = consumptionTab?.consumptiondonutchart;
  const yAxisLabel =
    consumptionTabLabels?.yaxislabel || consumptionTab?.consumptionvolumelabel || 'Consumption volume';

  return createTrendStatisticsCard(
    consumptionTabLabels?.statisticcharttitle || 'Consumption trend',
    undefined,
    yAxisLabel,
    rows.map((row) => ({
      year: row.year,
      value: row.domesticConsumption,
    })),
    {
      valueDecimals: 1,
      downloadUrl: csvUrl,
      downloadLabel:
        consumptionTabLabels?.statisticdownloadbuttonlabel || 'Download export and consumption data (CSV)',
      downloadDescription:
        consumptionTabLabels?.statisticdownloaddescription ||
        'Includes year-by-year export and domestic consumption data.',
      uiLabels: {
        allYearsLabel: statisticsPage?.allyearslabel,
        atAGlanceLabel: statisticsPage?.ataglancelabel,
        detailedDataLabel: statisticsPage?.detaileddatalabel,
        dataPointsLabel: statisticsPage?.datapointslabel,
        changeLabel: statisticsPage?.changelabel,
        latestValueLabel: consumptionTab?.latestvaluelabel,
        summaryTitle: consumptionDonutLabels?.title,
        summaryDescription: consumptionDonutLabels?.description,
        summaryCenterLabel: consumptionDonutLabels?.middlevalue,
      },
    },
  );
}

function buildPriceCard(
  rows: ParsedPriceRow[],
  csvUrl: string,
  priceTab?: StatPriceTab | null,
  statisticsPage?: StatisticsPage | null,
): StatisticsChartCardData {
  const priceTabLabels = priceTab?.pricetrendstatlabel;
  const latestRow = rows[rows.length - 1];
  const priceGap = Math.abs(latestRow.exportFob - latestRow.colomboRss);
  const exportFobLabel = priceTab?.exportfoblabel || 'Exports f.o.b';
  const colomboRssLabel = priceTab?.colomborsslabel || 'Colombo RSS';
  const higherSeries = latestRow.exportFob >= latestRow.colomboRss
    ? exportFobLabel
    : colomboRssLabel;

  return createMultiLineTrendStatisticsCard(
    priceTabLabels?.statisticcharttitle || 'Price trend',
    undefined,
    priceTabLabels?.yaxislabel || 'Price (Rs/kg)',
    [
      {
        label: exportFobLabel,
        color: '#2AC669',
        points: rows.map((row) => ({
          year: row.year,
          value: row.exportFob,
        })),
      },
      {
        label: colomboRssLabel,
        color: '#0F9D58',
        points: rows.map((row) => ({
          year: row.year,
          value: row.colomboRss,
        })),
      },
    ],
    {
      valueDecimals: 2,
      downloadUrl: csvUrl,
      downloadLabel:
        priceTabLabels?.statisticdownloadbuttonlabel || 'Download price data (CSV)',
      downloadDescription:
        priceTabLabels?.statisticdownloaddescription ||
        'Includes Exports f.o.b and Colombo RSS yearly price data.',
      sidePanel: {
        title: priceTab?.pricesummarylabel || 'Price summary',
        description: priceTab?.pricesummarydescription || `Latest market snapshot for ${latestRow.year}.`,
        items: [
          {
            label: `${priceTab?.latestlabel || 'Latest'} ${exportFobLabel}`,
            value: latestRow.exportFob.toLocaleString(),
            detail: `${latestRow.year}`,
          },
          {
            label: `${priceTab?.latestlabel || 'Latest'} ${colomboRssLabel}`,
            value: latestRow.colomboRss.toLocaleString(),
            detail: `${latestRow.year}`,
          },
          {
            label: priceTab?.pricegaplabel || 'Price gap',
            value: priceGap.toLocaleString(),
            detail: `${higherSeries} ${priceTab?.ishigherlabel || 'is higher'}`,
          },
          {
            label: priceTab?.higherserieslabel || 'Higher series',
            value: higherSeries,
            detail: `${priceTab?.basedonlabel || 'Based on'} ${latestRow.year} ${priceTab?.priceslabel || 'prices'}`,
          },
        ],
      },
      uiLabels: {
        allYearsLabel: statisticsPage?.allyearslabel,
        atAGlanceLabel: statisticsPage?.ataglancelabel,
        detailedDataLabel: statisticsPage?.detaileddatalabel,
        dataPointsLabel: statisticsPage?.datapointslabel,
        changeLabel: statisticsPage?.changelabel,
      },
    },
  );
}

function buildProductionSeriesLabelOverrides(
  productionTab?: StatProductionTab | null,
): Partial<Record<ProductionSeriesLabel, string>> | undefined {
  if (!productionTab) {
    return undefined;
  }

  return {
    Sheet: productionTab.sheetlabel,
    'Sole Crepe': productionTab.solecrepelabel,
    'Scrap Crepe': productionTab.scrapecrepelabel,
    'Latex Crepe': productionTab.latexcrepelabel,
    'T.S.R.': productionTab.tsrlabel,
    'Latex Other': productionTab.latexotherlabel,
  };
}

function buildProductionCardUiLabels(
  productionTab?: StatProductionTab | null,
  statisticsPage?: StatisticsPage | null,
): StatisticsCardUiLabels | undefined {
  if (!productionTab && !statisticsPage) {
    return undefined;
  }

  return {
    allYearsLabel: statisticsPage?.allyearslabel,
    atAGlanceLabel: statisticsPage?.ataglancelabel,
    detailedDataLabel: statisticsPage?.detaileddatalabel,
    dataPointsLabel: statisticsPage?.datapointslabel,
    changeLabel: statisticsPage?.changelabel,
    snapshotYearLabel: productionTab?.snapshotyearlabel,
    latestTotalLabel: productionTab?.latesttotallabel,
    latestTotalDescription: productionTab?.latesttotaldescription,
    topCategoryLabel: productionTab?.topcategorylabel,
    lowestCategoryLabel: productionTab?.lowestcategorylabel,
    inLabel: productionTab?.inlabel,
  };
}

async function buildProductionCard(
  latestEntry: StatisticsContentEntry,
  productionTab?: StatProductionTab | null,
  statisticsPage?: StatisticsPage | null,
): Promise<StatisticsChartCardData | null> {
  const productionUrl = getStrapiMediaUrl(latestEntry.productionstatistic);

  if (!productionUrl) {
    return null;
  }

  const csvContent = await fetchStatisticsCsv(productionUrl);
  const parsedRows = parseProductionRows(csvContent);
  const productionTabLabels = productionTab?.productionstatslabel;
  const productionDonutLabels = productionTab?.productiondonutchart;

  return createProductionStatisticsCard(
    buildProductionSeries(parsedRows, buildProductionSeriesLabelOverrides(productionTab)),
    {
      title: productionTabLabels?.statisticcharttitle,
      xAxisLabel: productionTabLabels?.xaxislabel,
      yAxisLabel: productionTabLabels?.yaxislabel,
      contextLabel: productionTab?.snapshotyearlabel,
      downloadUrl: productionUrl,
      downloadLabel: productionTabLabels?.statisticdownloadbuttonlabel,
      downloadDescription: productionTabLabels?.statisticdownloaddescription,
      summaryTitle: productionDonutLabels?.title,
      summaryDescription: productionDonutLabels?.description,
      summaryCenterLabel: productionDonutLabels?.middlevalue,
      uiLabels: buildProductionCardUiLabels(productionTab, statisticsPage),
    },
  );
}

export async function getStatisticsPage(
  locale: string = 'en',
): Promise<StatisticsPage | null> {
  return withLocaleFallback({
    locale,
    label: 'statistics page',
    fetcher: fetchStatisticsPage,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export async function getStatProductionTab(
  locale: string = 'en',
): Promise<StatProductionTab | null> {
  return withLocaleFallback({
    locale,
    label: 'statistics production tab',
    fetcher: fetchStatProductionTab,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export async function getStatExportTab(
  locale: string = 'en',
): Promise<StatExportTab | null> {
  return withLocaleFallback({
    locale,
    label: 'statistics export tab',
    fetcher: fetchStatExportTab,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export async function getStatPriceTab(
  locale: string = 'en',
): Promise<StatPriceTab | null> {
  return withLocaleFallback({
    locale,
    label: 'statistics price tab',
    fetcher: fetchStatPriceTab,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export async function getStatConsumptionTab(
  locale: string = 'en',
): Promise<StatConsumptionTab | null> {
  return withLocaleFallback({
    locale,
    label: 'statistics consumption tab',
    fetcher: fetchStatConsumptionTab,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export async function getStatisticsPageCards(
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

    const exportConsumptionUrl = getStrapiMediaUrl(latestEntry.exportandconsumptionstats);
    const priceTrendUrl = getStrapiMediaUrl(latestEntry.pricetrendstat);

    const [productionCard, exportCard, priceCard, consumptionCard] = await Promise.all([
      buildProductionCard(latestEntry).catch((error) => {
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

export async function getProductionStatisticsCard(): Promise<StatisticsChartCardData | null> {
  const cards = await getStatisticsPageCards();
  return cards.productionCard;
}

export async function getStatisticsPageData(
  locale: string = 'en',
): Promise<StatisticsPageContent> {
  const [
    localizedPage,
    fallbackPage,
    localizedProductionTab,
    fallbackProductionTab,
    localizedExportTab,
    fallbackExportTab,
    localizedPriceTab,
    fallbackPriceTab,
    localizedConsumptionTab,
    fallbackConsumptionTab,
  ] = await Promise.all([
    fetchStatisticsPage(locale).catch((error) => {
      console.error(`Failed to fetch statistics page for locale "${locale}"`, error);
      return null;
    }),
    locale === 'en'
      ? Promise.resolve(null)
      : fetchStatisticsPage('en').catch((error) => {
        console.error('Failed to fetch fallback statistics page', error);
        return null;
      }),
    fetchStatProductionTab(locale).catch((error) => {
      console.error(`Failed to fetch statistics production tab for locale "${locale}"`, error);
      return null;
    }),
    locale === 'en'
      ? Promise.resolve(null)
      : fetchStatProductionTab('en').catch((error) => {
        console.error('Failed to fetch fallback statistics production tab', error);
        return null;
      }),
    fetchStatExportTab(locale).catch((error) => {
      console.error(`Failed to fetch statistics export tab for locale "${locale}"`, error);
      return null;
    }),
    locale === 'en'
      ? Promise.resolve(null)
      : fetchStatExportTab('en').catch((error) => {
        console.error('Failed to fetch fallback statistics export tab', error);
        return null;
      }),
    fetchStatPriceTab(locale).catch((error) => {
      console.error(`Failed to fetch statistics price tab for locale "${locale}"`, error);
      return null;
    }),
    locale === 'en'
      ? Promise.resolve(null)
      : fetchStatPriceTab('en').catch((error) => {
        console.error('Failed to fetch fallback statistics price tab', error);
        return null;
      }),
    fetchStatConsumptionTab(locale).catch((error) => {
      console.error(`Failed to fetch statistics consumption tab for locale "${locale}"`, error);
      return null;
    }),
    locale === 'en'
      ? Promise.resolve(null)
      : fetchStatConsumptionTab('en').catch((error) => {
        console.error('Failed to fetch fallback statistics consumption tab', error);
        return null;
      }),
  ]);

  let productionCard: StatisticsChartCardData | null = null;
  let exportCard: StatisticsChartCardData | null = null;
  let priceCard: StatisticsChartCardData | null = null;
  let consumptionCard: StatisticsChartCardData | null = null;

  try {
    const entries = await fetchStatisticsEntries();
    const latestEntry = entries[0];

    if (latestEntry) {
      [productionCard, exportCard, priceCard, consumptionCard] = await Promise.all([
        buildProductionCard(
          latestEntry,
          localizedProductionTab || fallbackProductionTab,
          localizedPage || fallbackPage,
        ),
        (async () => {
          const exportConsumptionUrl = getStrapiMediaUrl(latestEntry.exportandconsumptionstats);

          if (!exportConsumptionUrl) {
            return null;
          }

          const csvContent = await fetchStatisticsCsv(exportConsumptionUrl);
          const parsedRows = parseExportConsumptionRows(csvContent);

          return buildExportCard(
            parsedRows,
            exportConsumptionUrl,
            localizedExportTab || fallbackExportTab,
            localizedPage || fallbackPage,
          );
        })(),
        (async () => {
          const priceTrendUrl = getStrapiMediaUrl(latestEntry.pricetrendstat);

          if (!priceTrendUrl) {
            return null;
          }

          const csvContent = await fetchStatisticsCsv(priceTrendUrl);
          const parsedRows = parsePriceRows(csvContent);

          return buildPriceCard(
            parsedRows,
            priceTrendUrl,
            localizedPriceTab || fallbackPriceTab,
            localizedPage || fallbackPage,
          );
        })(),
        (async () => {
          const exportConsumptionUrl = getStrapiMediaUrl(latestEntry.exportandconsumptionstats);

          if (!exportConsumptionUrl) {
            return null;
          }

          const csvContent = await fetchStatisticsCsv(exportConsumptionUrl);
          const parsedRows = parseExportConsumptionRows(csvContent);

          return buildConsumptionCard(
            parsedRows,
            exportConsumptionUrl,
            localizedConsumptionTab || fallbackConsumptionTab,
            localizedPage || fallbackPage,
          );
        })(),
      ]);
    }
  } catch (error) {
    console.error('Failed to build statistics page cards', error);
  }

  return buildStatisticsPageContent({
    localizedPage,
    fallbackPage,
    localizedProductionTab,
    fallbackProductionTab,
    localizedExportTab,
    fallbackExportTab,
    localizedPriceTab,
    fallbackPriceTab,
    localizedConsumptionTab,
    fallbackConsumptionTab,
    productionCard,
    exportCard,
    priceCard,
    consumptionCard,
  });
}
