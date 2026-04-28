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

export interface StatisticsChartCardData {
  title: string;
  subtitle: string;
  primaryChartType: StatisticsChartType;
  xAxisLabel: string;
  yAxisLabel: string;
  contextLabel?: string;
  contextValue?: string;
  periods?: StatisticsPeriod[];
  defaultPeriodId?: string;
  line?: StatisticsLine;
  barSeries?: StatisticsBarSeries[];
  bars?: StatisticsBarDatum[];
  shareSummary?: StatisticsSummaryData;
  kpis: StatisticsKpi[];
}

export interface StatisticsTabData {
  id: StatisticsTabId;
  label: string;
  eyebrow: string;
  heading: string;
  description: string;
  primaryCard: StatisticsChartCardData;
}

export const statisticsTabs: Array<Pick<StatisticsTabData, 'id' | 'label' | 'eyebrow'>> = [
  { id: 'production', label: 'Production', eyebrow: 'Statistics' },
  { id: 'export', label: 'Export', eyebrow: 'Statistics' },
  { id: 'price', label: 'Price', eyebrow: 'Statistics' },
  { id: 'consumption', label: 'Consumption', eyebrow: 'Statistics' },
  { id: 'plantation', label: 'Plantation', eyebrow: 'Statistics' },
];

const defaultPeriods: StatisticsPeriod[] = [
  { id: '1980-1990', label: '1980 - 1990', startYear: 1980, endYear: 1990 },
  { id: '1990-2000', label: '1990 - 2000', startYear: 1990, endYear: 2000 },
  { id: '2000-2010', label: '2000 - 2010', startYear: 2000, endYear: 2010 },
  { id: '2010-2020', label: '2010 - 2020', startYear: 2010, endYear: 2020 },
];

const years = [
  1980, 1982, 1984, 1986, 1988, 1990,
  1992, 1994, 1996, 1998, 2000,
  2002, 2004, 2006, 2008, 2010,
  2012, 2014, 2016, 2018, 2020,
];

const summaryPalette = ['#2AC669', '#0F9D58', '#8BCF5B', '#D7E870', '#FFB648', '#F27D42'];
const latestRecordedYear = years[years.length - 1];

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

function formatDeltaValue(delta: number) {
  const sign = delta > 0 ? '+' : '';
  return `${sign}${formatCompactValue(delta)}`;
}

function createRecentYearSummary(
  points: StatisticsPoint[],
  label: string,
): StatisticsSummaryData {
  const recentPoints = points.slice(-4);
  const total = recentPoints.reduce((sum, point) => sum + point.value, 0);

  return {
    title: `${label} recent share`,
    description: 'How the latest recorded years contribute to the recent total.',
    centerLabel: 'Recent Total',
    centerValue: formatCompactValue(total),
    ariaLabel: `${label} donut summary for the latest recorded years`,
    slices: recentPoints.map((point, index) => ({
      label: `${point.year}`,
      value: point.value,
      color: summaryPalette[index % summaryPalette.length],
    })),
  };
}

function createTrendKpis(points: StatisticsPoint[]): StatisticsKpi[] {
  const latest = points[points.length - 1];
  const previous = points[points.length - 2] ?? latest;
  const delta = latest.value - previous.value;

  return [
    {
      label: 'Latest value',
      value: latest.value.toLocaleString(),
      detail: `${latest.year}`,
    },
    {
      label: 'Change',
      value: formatDeltaValue(delta),
      detail: `vs ${previous.year}`,
    },
    {
      label: 'Period',
      value: `${points[0].year} - ${latest.year}`,
      detail: `${points.length} data points`,
    },
  ];
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

const productionBars: StatisticsBarDatum[] = productionBarSeries.map((series) => ({
  label: series.label,
  value: series.points[series.points.length - 1].value,
  color: series.color,
}));

const totalProduction = productionBars.reduce((sum, item) => sum + item.value, 0);
const topProduction = productionBars.reduce((best, current) =>
  current.value > best.value ? current : best,
);
const lowestProduction = productionBars.reduce((lowest, current) =>
  current.value < lowest.value ? current : lowest,
);

const productionSummary: StatisticsSummaryData = {
  title: 'Production mix',
  description: 'Latest recorded share across the six production categories.',
  centerLabel: 'Latest Total',
  centerValue: formatCompactValue(totalProduction),
  ariaLabel: 'Production donut summary by production category',
  slices: productionBars.map((bar) => ({
    label: bar.label,
    value: bar.value,
    color: bar.color,
  })),
};

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

function createTrendCard(
  title: string,
  subtitle: string,
  lineLabel: string,
  points: StatisticsPoint[],
): StatisticsChartCardData {
  return {
    title,
    subtitle,
    primaryChartType: 'trend',
    xAxisLabel: 'Year',
    yAxisLabel: lineLabel,
    periods: defaultPeriods,
    line: {
      label: lineLabel,
      color: '#2AC669',
      points,
    },
    shareSummary: createRecentYearSummary(points, title),
    kpis: createTrendKpis(points),
  };
}

export const statisticsTabContent: Record<StatisticsTabId, StatisticsTabData> = {
  production: {
    id: 'production',
    label: 'Production',
    eyebrow: 'Statistics',
    heading: 'Production overview by rubber type',
    description:
      'Start with the latest production mix, then scan the strongest and weakest categories without decoding an overloaded pie chart.',
    primaryCard: {
      title: 'Latest production comparison',
      subtitle: 'A bar-first view makes category differences easier to compare at a glance.',
      primaryChartType: 'bar',
      xAxisLabel: 'Rubber type',
      yAxisLabel: 'Production volume',
      periods: defaultPeriods,
      contextLabel: 'Snapshot year',
      contextValue: `${latestRecordedYear}`,
      barSeries: productionBarSeries,
      bars: productionBars,
      shareSummary: productionSummary,
      kpis: [
        {
          label: 'Latest total',
          value: formatCompactValue(totalProduction),
          detail: `Year ${latestRecordedYear} across all categories`,
        },
        {
          label: 'Top category',
          value: topProduction.label,
          detail: `${topProduction.value.toLocaleString()} in ${latestRecordedYear}`,
        },
        {
          label: 'Lowest category',
          value: lowestProduction.label,
          detail: `${lowestProduction.value.toLocaleString()} in ${latestRecordedYear}`,
        },
      ],
    },
  },
  export: {
    id: 'export',
    label: 'Export',
    eyebrow: 'Statistics',
    heading: 'Export performance over time',
    description:
      'Track year-over-year movement with a conventional left-to-right time-series view and a compact summary for the selected period.',
    primaryCard: createTrendCard(
      'Export trend',
      'Use the period switcher to focus on a decade while keeping the latest direction visible.',
      'Export volume',
      exportPoints,
    ),
  },
  price: {
    id: 'price',
    label: 'Price',
    eyebrow: 'Statistics',
    heading: 'Price trend snapshot',
    description:
      'The primary chart prioritizes the current trajectory while keeping the selected range and recent change easy to read.',
    primaryCard: createTrendCard(
      'Price trend',
      'The summary updates with the selected period so the trend and the key numbers stay aligned.',
      'Price index',
      pricePoints,
    ),
  },
  consumption: {
    id: 'consumption',
    label: 'Consumption',
    eyebrow: 'Statistics',
    heading: 'Consumption trend by year',
    description:
      'View the long-term pattern first, then narrow the range to compare shorter periods without losing context.',
    primaryCard: createTrendCard(
      'Consumption trend',
      'Segmented filters tighten the time window while preserving a stable chart layout.',
      'Consumption volume',
      consumptionPoints,
    ),
  },
  plantation: {
    id: 'plantation',
    label: 'Plantation',
    eyebrow: 'Statistics',
    heading: 'Plantation activity trend',
    description:
      'This tab keeps the chart focused on the selected years and surfaces the latest value and change in a compact summary card.',
    primaryCard: createTrendCard(
      'Plantation trend',
      'The chart reads from left to right, with summary metrics that mirror the active range.',
      'Plantation area',
      plantationPoints,
    ),
  },
};
