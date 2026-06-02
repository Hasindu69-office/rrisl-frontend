export type StatisticsTabId =
  | 'production'
  | 'export'
  | 'price'
  | 'consumption'
  | 'plantation';

export type StatisticsChartType = 'bar' | 'trend';

export interface StatisticsPeriod {
  id: string;
  label: string;
  startYear: number;
  endYear: number;
}

export interface StatisticsPoint {
  year: number;
  value: number;
}

export interface StatisticsLine {
  label: string;
  color: string;
  points: StatisticsPoint[];
}

export interface StatisticsBarSeries {
  label: string;
  color: string;
  points: StatisticsPoint[];
}

export interface StatisticsBarDatum {
  label: string;
  value: number;
  color: string;
}

export interface StatisticsSummarySlice {
  label: string;
  value: number;
  color: string;
}

export interface StatisticsSummaryData {
  title?: string;
  description?: string;
  centerLabel: string;
  centerValue?: string;
  ariaLabel: string;
  slices: StatisticsSummarySlice[];
}

export interface StatisticsKpi {
  label: string;
  value: string;
  detail?: string;
}

export interface StatisticsSidePanelData {
  title: string;
  description?: string;
  items: StatisticsKpi[];
}

export interface StatisticsCardUiLabels {
  allYearsLabel?: string;
  atAGlanceLabel?: string;
  detailedDataLabel?: string;
  dataPointsLabel?: string;
  changeLabel?: string;
  latestValueLabel?: string;
  periodLabel?: string;
  snapshotYearLabel?: string;
  latestTotalLabel?: string;
  latestTotalDescription?: string;
  topCategoryLabel?: string;
  lowestCategoryLabel?: string;
  inLabel?: string;
  summaryTitle?: string;
  summaryDescription?: string;
  summaryCenterLabel?: string;
  summaryAriaLabel?: string;
}

export interface StatisticsChartCardData {
  title: string;
  subtitle?: string;
  primaryChartType: StatisticsChartType;
  xAxisLabel: string;
  yAxisLabel: string;
  valueDecimals?: number;
  downloadUrl?: string;
  downloadLabel?: string;
  downloadDescription?: string;
  contextLabel?: string;
  contextValue?: string;
  periods?: StatisticsPeriod[];
  defaultPeriodId?: string;
  line?: StatisticsLine;
  lines?: StatisticsLine[];
  barSeries?: StatisticsBarSeries[];
  bars?: StatisticsBarDatum[];
  shareSummary?: StatisticsSummaryData;
  sidePanel?: StatisticsSidePanelData;
  uiLabels?: StatisticsCardUiLabels;
  kpis: StatisticsKpi[];
}

export interface StatisticsTabData {
  id: StatisticsTabId;
  label: string;
  insightLabel: string;
  heading: string;
  description: string;
  primaryCard: StatisticsChartCardData;
}

export const statisticsTabs: Array<Pick<StatisticsTabData, 'id' | 'label'>> = [
  { id: 'production', label: 'Production' },
  { id: 'export', label: 'Export' },
  { id: 'price', label: 'Price' },
  { id: 'consumption', label: 'Consumption' },
  { id: 'plantation', label: 'Plantation' },
];

const years = [
  1980, 1982, 1984, 1986, 1988, 1990,
  1992, 1994, 1996, 1998, 2000,
  2002, 2004, 2006, 2008, 2010,
  2012, 2014, 2016, 2018, 2020,
];

const summaryPalette = ['#2AC669', '#0F9D58', '#8BCF5B', '#D7E870', '#FFB648', '#F27D42'];

function buildPoints(values: number[]): StatisticsPoint[] {
  return years.map((year, index) => ({
    year,
    value: values[index],
  }));
}

export function formatCompactValue(value: number) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return `${value}`;
}

export function formatDisplayValue(value: number, decimals: number = 1) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(decimals)}M`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(decimals)}K`;
  }

  return value.toFixed(decimals).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
}

function formatDeltaValue(delta: number, decimals: number = 1) {
  const sign = delta > 0 ? '+' : '';
  return `${sign}${formatDisplayValue(delta, decimals)}`;
}

export function createPeriodsFromYears(yearValues: number[]): StatisticsPeriod[] {
  const sortedYears = [...new Set(yearValues)].sort((first, second) => first - second);

  if (sortedYears.length < 2) {
    return [];
  }

  const firstYear = sortedYears[0];
  const lastYear = sortedYears[sortedYears.length - 1];
  const periods: StatisticsPeriod[] = [];

  for (let startYear = firstYear; startYear < lastYear; startYear += 10) {
    const endYear = Math.min(startYear + 10, lastYear);

    periods.push({
      id: `${startYear}-${endYear}`,
      label: `${startYear} - ${endYear}`,
      startYear,
      endYear,
    });
  }

  return periods;
}

function createRecentYearSummary(
  points: StatisticsPoint[],
  label: string,
  uiLabels?: StatisticsCardUiLabels,
): StatisticsSummaryData {
  const recentPoints = points.slice(-4);
  const total = recentPoints.reduce((sum, point) => sum + point.value, 0);

  return {
    title: uiLabels?.summaryTitle || `${label} recent share`,
    description: uiLabels?.summaryDescription || 'How the latest recorded years contribute to the recent total.',
    centerLabel: uiLabels?.summaryCenterLabel || 'Recent Total',
    centerValue: formatCompactValue(total),
    ariaLabel: uiLabels?.summaryAriaLabel || `${label} donut summary for the latest recorded years`,
    slices: recentPoints.map((point, index) => ({
      label: `${point.year}`,
      value: point.value,
      color: summaryPalette[index % summaryPalette.length],
    })),
  };
}

function createTrendKpis(points: StatisticsPoint[], decimals: number = 1): StatisticsKpi[] {
  const latest = points[points.length - 1];
  const previous = points[points.length - 2] ?? latest;
  const delta = latest.value - previous.value;

  return [
    {
      label: 'Latest value',
      value: formatDisplayValue(latest.value, decimals),
      detail: `${latest.year}`,
    },
    {
      label: 'Change',
      value: formatDeltaValue(delta, decimals),
      detail: `vs ${previous.year}`,
    },
    {
      label: 'Period',
      value: `${points[0].year} - ${latest.year}`,
      detail: `${points.length} data points`,
    },
  ];
}

export function createTrendStatisticsCard(
  title: string,
  subtitle: string | undefined,
  lineLabel: string,
  points: StatisticsPoint[],
  options?: {
    valueDecimals?: number;
    downloadUrl?: string;
    downloadLabel?: string;
    downloadDescription?: string;
    uiLabels?: StatisticsCardUiLabels;
  },
): StatisticsChartCardData {
  return {
    title,
    subtitle,
    primaryChartType: 'trend',
    xAxisLabel: 'Year',
    yAxisLabel: lineLabel,
    valueDecimals: options?.valueDecimals ?? 1,
    downloadUrl: options?.downloadUrl,
    downloadLabel: options?.downloadLabel,
    downloadDescription: options?.downloadDescription,
    periods: createPeriodsFromYears(points.map((point) => point.year)),
    line: {
      label: lineLabel,
      color: '#2AC669',
      points,
    },
    shareSummary: createRecentYearSummary(points, title, options?.uiLabels),
    uiLabels: options?.uiLabels,
    kpis: createTrendKpis(points, options?.valueDecimals ?? 1),
  };
}

export function createMultiLineTrendStatisticsCard(
  title: string,
  subtitle: string | undefined,
  yAxisLabel: string,
  lines: StatisticsLine[],
  options?: {
    valueDecimals?: number;
    downloadUrl?: string;
    downloadLabel?: string;
    downloadDescription?: string;
    sidePanel?: StatisticsSidePanelData;
    uiLabels?: StatisticsCardUiLabels;
  },
): StatisticsChartCardData {
  const yearValues = lines.flatMap((line) => line.points.map((point) => point.year));
  const latestByLine = lines.map((line) => ({
    label: line.label,
    latestPoint: line.points[line.points.length - 1],
  }));
  const latestYear = Math.max(...latestByLine.map((item) => item.latestPoint.year));

  return {
    title,
    subtitle,
    primaryChartType: 'trend',
    xAxisLabel: 'Year',
    yAxisLabel,
    valueDecimals: options?.valueDecimals ?? 2,
    downloadUrl: options?.downloadUrl,
    downloadLabel: options?.downloadLabel,
    downloadDescription: options?.downloadDescription,
    sidePanel: options?.sidePanel,
    uiLabels: options?.uiLabels,
    periods: createPeriodsFromYears(yearValues),
    lines,
    kpis: [
      ...latestByLine.map((item) => ({
        label: item.label,
        value: item.latestPoint.value.toLocaleString(),
        detail: `${item.latestPoint.year}`,
      })),
      {
        label: 'Period',
        value: `${Math.min(...yearValues)} - ${Math.max(...yearValues)}`,
        detail: `${latestYear} latest record`,
      },
    ],
  };
}

export function createProductionStatisticsCard(
  barSeries: StatisticsBarSeries[],
  options?: {
    downloadUrl?: string;
    title?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
    contextLabel?: string;
    downloadLabel?: string;
    downloadDescription?: string;
    summaryTitle?: string;
    summaryDescription?: string;
    summaryCenterLabel?: string;
    summaryAriaLabel?: string;
    uiLabels?: StatisticsCardUiLabels;
  },
): StatisticsChartCardData {
  const availableYears = barSeries.flatMap((series) => series.points.map((point) => point.year));
  const latestYear = Math.max(...availableYears);
  const bars: StatisticsBarDatum[] = barSeries.map((series) => {
    const latestPoint = series.points[series.points.length - 1];

    return {
      label: series.label,
      value: latestPoint.value,
      color: series.color,
    };
  });
  const totalProduction = bars.reduce((sum, item) => sum + item.value, 0);
  const topProduction = bars.reduce((best, current) =>
    current.value > best.value ? current : best,
  );
  const lowestProduction = bars.reduce((lowest, current) =>
    current.value < lowest.value ? current : lowest,
  );

  const productionSummary: StatisticsSummaryData = {
    title: options?.summaryTitle || 'Production mix',
    description: options?.summaryDescription || 'Latest recorded share across the six production categories.',
    centerLabel: options?.summaryCenterLabel || 'Latest Total',
    centerValue: formatCompactValue(totalProduction),
    ariaLabel: options?.summaryAriaLabel || 'Production donut summary by production category',
    slices: bars.map((bar) => ({
      label: bar.label,
      value: bar.value,
      color: bar.color,
    })),
  };

  return {
    title: options?.title || 'Latest production comparison',
    primaryChartType: 'bar',
    xAxisLabel: options?.xAxisLabel || 'Rubber type',
    yAxisLabel: options?.yAxisLabel || 'Production volume',
    downloadUrl: options?.downloadUrl,
    downloadLabel: options?.downloadLabel || 'Download production data (CSV)',
    downloadDescription: options?.downloadDescription || 'Includes year-by-year production by rubber type.',
    periods: createPeriodsFromYears(availableYears),
    contextLabel: options?.contextLabel || 'Snapshot year',
    contextValue: `${latestYear}`,
    barSeries,
    bars,
    shareSummary: productionSummary,
    uiLabels: options?.uiLabels,
    kpis: [
      {
        label: 'Latest total',
        value: formatCompactValue(totalProduction),
        detail: `Year ${latestYear} across all categories`,
      },
      {
        label: 'Top category',
        value: topProduction.label,
        detail: `${topProduction.value.toLocaleString()} in ${latestYear}`,
      },
      {
        label: 'Lowest category',
        value: lowestProduction.label,
        detail: `${lowestProduction.value.toLocaleString()} in ${latestYear}`,
      },
    ],
  };
}

const productionSeries = [
  {
    title: 'Sheet',
    values: [
      1200, 6500, 13800, 16500, 21200, 22500,
      26500, 24300, 31000, 29800, 33500,
      40100, 47200, 48500, 56600, 59800,
      72000, 69400, 73500, 91800, 104500,
    ],
  },
  {
    title: 'Sole Crepe',
    values: [
      900, 5400, 12900, 15700, 20500, 21900,
      25100, 23600, 28700, 27600, 32100,
      37800, 44600, 46000, 53900, 57100,
      69000, 67400, 72100, 90200, 101800,
    ],
  },
  {
    title: 'Scrap Crepe',
    values: [
      1500, 7200, 14500, 17800, 22800, 24100,
      28500, 26000, 33100, 31800, 35600,
      41800, 49200, 50500, 58900, 62400,
      74700, 72200, 76800, 94500, 106900,
    ],
  },
  {
    title: 'Latex Crepe',
    values: [
      1800, 7600, 14900, 18300, 23600, 24800,
      29700, 27200, 34500, 32900, 36600,
      42900, 50600, 52100, 60300, 63700,
      76000, 73400, 78100, 95900, 108700,
    ],
  },
  {
    title: 'T.S.R.',
    values: [
      1100, 6100, 14100, 16900, 21400, 22700,
      27600, 24800, 32200, 30700, 34300,
      40400, 47600, 49000, 57300, 60700,
      73500, 70900, 74800, 93400, 105900,
    ],
  },
  {
    title: 'Latex Other',
    values: [
      1300, 6800, 14300, 17100, 21600, 23100,
      28100, 25200, 32600, 31100, 34900,
      41200, 48700, 50000, 58400, 61900,
      74200, 71700, 75600, 94200, 106600,
    ],
  },
];

const productionBarSeries: StatisticsBarSeries[] = productionSeries.map((series, index) => ({
  label: series.title,
  color: summaryPalette[index % summaryPalette.length],
  points: buildPoints(series.values),
}));
export const defaultProductionCard = createProductionStatisticsCard(productionBarSeries);

const exportPoints = buildPoints([
  1200, 7800, 15800, 17600, 24300, 22800,
  31800, 30400, 37200, 36100, 40500,
  49800, 53100, 52500, 64800, 70900,
  82200, 87100, 89500, 90800, 88200,
]);

const pricePoints = buildPoints([
  2200, 9400, 14100, 16800, 21300, 24600,
  30200, 28900, 33400, 38600, 44200,
  49800, 54100, 61200, 68900, 74200,
  81600, 85400, 91300, 96800, 103400,
]);

const consumptionPoints = buildPoints([
  1600, 6200, 10900, 13400, 17200, 19800,
  24100, 25700, 28400, 31200, 35900,
  40200, 43800, 47100, 51800, 56300,
  61700, 65800, 70100, 74300, 78600,
]);

const plantationPoints = buildPoints([
  3100, 8200, 12700, 15600, 19800, 24100,
  27900, 30100, 34400, 37100, 41800,
  46200, 50500, 55100, 60300, 64800,
  69900, 74100, 79200, 84600, 90100,
]);

export const statisticsTabContent: Record<StatisticsTabId, StatisticsTabData> = {
  production: {
    id: 'production',
    label: 'Production',
    insightLabel: 'Production insight',
    heading: 'Production overview by rubber type',
    description:
      'Start with the latest production mix, then scan the strongest and weakest categories without decoding an overloaded pie chart.',
    primaryCard: defaultProductionCard,
  },
  export: {
    id: 'export',
    label: 'Export',
    insightLabel: 'Export insight',
    heading: 'Export performance over time',
    description:
      'Track year-over-year movement with a conventional left-to-right time-series view and a compact summary for the selected period.',
    primaryCard: createTrendStatisticsCard(
      'Export trend',
      undefined,
      'Export volume',
      exportPoints,
    ),
  },
  price: {
    id: 'price',
    label: 'Price',
    insightLabel: 'Price insight',
    heading: 'Price trend snapshot',
    description:
      'The primary chart prioritizes the current trajectory while keeping the selected range and recent change easy to read.',
    primaryCard: createTrendStatisticsCard(
      'Price trend',
      undefined,
      'Price index',
      pricePoints,
    ),
  },
  consumption: {
    id: 'consumption',
    label: 'Consumption',
    insightLabel: 'Consumption insight',
    heading: 'Consumption trend by year',
    description:
      'View the long-term pattern first, then narrow the range to compare shorter periods without losing context.',
    primaryCard: createTrendStatisticsCard(
      'Consumption trend',
      undefined,
      'Consumption volume',
      consumptionPoints,
    ),
  },
  plantation: {
    id: 'plantation',
    label: 'Plantation',
    insightLabel: 'Plantation insight',
    heading: 'Plantation activity trend',
    description:
      'This tab keeps the chart focused on the selected years and surfaces the latest value and change in a compact summary card.',
    primaryCard: createTrendStatisticsCard(
      'Plantation trend',
      undefined,
      'Plantation area',
      plantationPoints,
    ),
  },
};
