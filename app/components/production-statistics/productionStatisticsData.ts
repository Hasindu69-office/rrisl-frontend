export type StatisticsTabId =
  | 'production'
  | 'export'
  | 'price'
  | 'consumption'
  | 'plantation';

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

export interface StatisticsChartCardData {
  title: string;
  subtitle: string;
  xAxisLabel: string;
  periods: StatisticsPeriod[];
  defaultPeriodId: string;
  line: StatisticsLine;
}

export interface StatisticsTabData {
  id: StatisticsTabId;
  label: string;
  eyebrow: string;
  cards: StatisticsChartCardData[];
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

function buildPoints(values: number[]): StatisticsPoint[] {
  return years.map((year, index) => ({
    year,
    value: values[index],
  }));
}

const productionCards: StatisticsChartCardData[] = [
  {
    title: 'Sheet',
    subtitle: 'This is a subtitle',
    xAxisLabel: 'Sheet',
    periods: defaultPeriods,
    defaultPeriodId: '2010-2020',
    line: {
      label: 'Production',
      color: '#2AC669',
      points: buildPoints([
        1200, 6500, 13800, 16500, 21200, 22500,
        26500, 24300, 31000, 29800, 33500,
        40100, 47200, 48500, 56600, 59800,
        72000, 69400, 73500, 91800, 104500,
      ]),
    },
  },
  {
    title: 'Sole Crepe',
    subtitle: 'This is a subtitle',
    xAxisLabel: 'Sole Crepe',
    periods: defaultPeriods,
    defaultPeriodId: '2010-2020',
    line: {
      label: 'Production',
      color: '#2AC669',
      points: buildPoints([
        900, 5400, 12900, 15700, 20500, 21900,
        25100, 23600, 28700, 27600, 32100,
        37800, 44600, 46000, 53900, 57100,
        69000, 67400, 72100, 90200, 101800,
      ]),
    },
  },
  {
    title: 'Scrap Crepe',
    subtitle: 'This is a subtitle',
    xAxisLabel: 'Scrap Crepe',
    periods: defaultPeriods,
    defaultPeriodId: '2010-2020',
    line: {
      label: 'Production',
      color: '#2AC669',
      points: buildPoints([
        1500, 7200, 14500, 17800, 22800, 24100,
        28500, 26000, 33100, 31800, 35600,
        41800, 49200, 50500, 58900, 62400,
        74700, 72200, 76800, 94500, 106900,
      ]),
    },
  },
  {
    title: 'Latex Crepe',
    subtitle: 'This is a subtitle',
    xAxisLabel: 'Latex Crepe',
    periods: defaultPeriods,
    defaultPeriodId: '2010-2020',
    line: {
      label: 'Production',
      color: '#2AC669',
      points: buildPoints([
        1800, 7600, 14900, 18300, 23600, 24800,
        29700, 27200, 34500, 32900, 36600,
        42900, 50600, 52100, 60300, 63700,
        76000, 73400, 78100, 95900, 108700,
      ]),
    },
  },
  {
    title: 'T.S.R.',
    subtitle: 'This is a subtitle',
    xAxisLabel: 'Sheet',
    periods: defaultPeriods,
    defaultPeriodId: '2010-2020',
    line: {
      label: 'Production',
      color: '#2AC669',
      points: buildPoints([
        1100, 6100, 14100, 16900, 21400, 22700,
        27600, 24800, 32200, 30700, 34300,
        40400, 47600, 49000, 57300, 60700,
        73500, 70900, 74800, 93400, 105900,
      ]),
    },
  },
  {
    title: 'Latex Other',
    subtitle: 'This is a subtitle',
    xAxisLabel: 'Sheet',
    periods: defaultPeriods,
    defaultPeriodId: '2010-2020',
    line: {
      label: 'Production',
      color: '#2AC669',
      points: buildPoints([
        1300, 6800, 14300, 17100, 21600, 23100,
        28100, 25200, 32600, 31100, 34900,
        41200, 48700, 50000, 58400, 61900,
        74200, 71700, 75600, 94200, 106600,
      ]),
    },
  },
];

export const statisticsTabContent: Record<StatisticsTabId, StatisticsTabData> = {
  production: {
    id: 'production',
    label: 'Production',
    eyebrow: 'Statistics',
    cards: productionCards,
  },
  export: {
    id: 'export',
    label: 'Export',
    eyebrow: 'Statistics',
    cards: [],
  },
  price: {
    id: 'price',
    label: 'Price',
    eyebrow: 'Statistics',
    cards: [],
  },
  consumption: {
    id: 'consumption',
    label: 'Consumption',
    eyebrow: 'Statistics',
    cards: [],
  },
  plantation: {
    id: 'plantation',
    label: 'Plantation',
    eyebrow: 'Statistics',
    cards: [],
  },
};
