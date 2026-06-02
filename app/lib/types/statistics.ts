import type {
  StatisticsChartCardData,
  StatisticsTabData,
  StatisticsTabId,
} from '@/app/components/production-statistics/productionStatisticsData';
import type { AboutPageBreadcrumbItem } from './shared';
import type { StrapiImage, StrapiMedia } from './strapi';

export interface StatisticsPageHero {
  id: number;
  PageTitle: string;
  backgroundImageAlt?: string | null;
  Breadcrumb?: AboutPageBreadcrumbItem[] | null;
  backgroundImage?: StrapiImage | null;
}

export interface StatisticsPage {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
  pagehero?: StatisticsPageHero | null;
  statisticslabel: string;
  allyearslabel: string;
  ataglancelabel: string;
  detaileddatalabel: string;
  datapointslabel: string;
  changelabel: string;
}

export interface StatisticsTabLabels {
  id: number;
  statisticname: string;
  statisticinsightlabel: string;
  statistictitle: string;
  statisticdescription: string;
  statisticcharttitle: string;
  statisticdownloaddescription: string;
  statisticdownloadbuttonlabel: string;
  yaxislabel: string;
  xaxislabel: string;
}

export interface StatisticsDonutChartLabels {
  id: number;
  title: string;
  description: string;
  middlevalue: string;
}

export interface StatProductionTab {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
  productionstatslabel?: StatisticsTabLabels | null;
  productiondonutchart?: StatisticsDonutChartLabels | null;
  snapshotyearlabel: string;
  latesttotallabel: string;
  latesttotaldescription: string;
  topcategorylabel: string;
  inlabel: string;
  lowestcategorylabel: string;
  sheetlabel: string;
  solecrepelabel: string;
  scrapecrepelabel: string;
  latexcrepelabel: string;
  tsrlabel: string;
  latexotherlabel: string;
}

export interface StatExportTab {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
  exportstatlabels?: StatisticsTabLabels | null;
  exportdonutchart?: StatisticsDonutChartLabels | null;
  exportvolumelabel: string;
  latestvaluelabel: string;
}

export interface StatPriceTab {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
  pricetrendstatlabel?: StatisticsTabLabels | null;
  exportfoblabel: string;
  colomborsslabel: string;
  pricesummarylabel: string;
  pricesummarydescription: string;
  latestlabel: string;
  pricegaplabel: string;
  ishigherlabel: string;
  higherserieslabel: string;
  basedonlabel: string;
  priceslabel: string;
}

export interface StatConsumptionTab {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
  consumptionstatlabel?: StatisticsTabLabels | null;
  consumptiondonutchart?: StatisticsDonutChartLabels | null;
  consumptionvolumelabel: string;
  latestvaluelabel: string;
}

export interface StatisticsContentEntry {
  id: number;
  documentId?: string;
  productionstatistic: StrapiMedia | null;
  exportandconsumptionstats: StrapiMedia | null;
  pricetrendstat: StrapiMedia | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface StatisticsHeroContent {
  title: string;
  breadcrumbItems: Array<{
    label: string;
    href?: string;
  }>;
  backgroundImage?: string;
  backgroundImageAlt: string;
}

export interface StatisticsPageContent {
  hero: StatisticsHeroContent;
  sectionTitle: string;
  allYearsLabel: string;
  atAGlanceLabel: string;
  detailedDataLabel: string;
  dataPointsLabel: string;
  changeLabel: string;
  productionCard: StatisticsChartCardData | null;
  tabs: Record<StatisticsTabId, StatisticsTabData>;
}
