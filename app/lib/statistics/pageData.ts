import type {
  StatisticsChartCardData,
  StatisticsTabData,
  StatisticsTabId,
} from '@/app/components/production-statistics/productionStatisticsData';
import { statisticsTabContent } from '@/app/components/production-statistics/productionStatisticsData';
import type {
  StatConsumptionTab,
  StatExportTab,
  StatPriceTab,
  StatProductionTab,
  StatisticsPage,
  StatisticsPageContent,
} from '@/app/lib/types';
import { mapStatisticsHero } from './hero';

type StatisticsPageLabelSet = Pick<
  StatisticsPageContent,
  'sectionTitle' | 'allYearsLabel' | 'atAGlanceLabel' | 'detailedDataLabel' | 'dataPointsLabel' | 'changeLabel'
>;

const STATISTICS_PAGE_LABEL_FALLBACKS: StatisticsPageLabelSet = {
  sectionTitle: 'Statistics',
  allYearsLabel: 'All years',
  atAGlanceLabel: 'At a glance',
  detailedDataLabel: 'Detailed data',
  dataPointsLabel: 'data points',
  changeLabel: 'Change',
};

function mapPageLabels(
  localizedPage: StatisticsPage | null | undefined,
  fallbackPage?: StatisticsPage | null,
): StatisticsPageLabelSet {
  const page = localizedPage || fallbackPage;

  return {
    sectionTitle: page?.statisticslabel || STATISTICS_PAGE_LABEL_FALLBACKS.sectionTitle,
    allYearsLabel: page?.allyearslabel || STATISTICS_PAGE_LABEL_FALLBACKS.allYearsLabel,
    atAGlanceLabel: page?.ataglancelabel || STATISTICS_PAGE_LABEL_FALLBACKS.atAGlanceLabel,
    detailedDataLabel: page?.detaileddatalabel || STATISTICS_PAGE_LABEL_FALLBACKS.detailedDataLabel,
    dataPointsLabel: page?.datapointslabel || STATISTICS_PAGE_LABEL_FALLBACKS.dataPointsLabel,
    changeLabel: page?.changelabel || STATISTICS_PAGE_LABEL_FALLBACKS.changeLabel,
  };
}

function applyPageLabelsToCard(
  card: StatisticsChartCardData,
  labels: StatisticsPageLabelSet,
): StatisticsChartCardData {
  return {
    ...card,
    uiLabels: {
      ...card.uiLabels,
      allYearsLabel: labels.allYearsLabel,
      atAGlanceLabel: labels.atAGlanceLabel,
      detailedDataLabel: labels.detailedDataLabel,
      dataPointsLabel: labels.dataPointsLabel,
      changeLabel: labels.changeLabel,
    },
  };
}

function buildProductionTab(
  productionCard: StatisticsChartCardData | null,
  pageLabels: StatisticsPageLabelSet,
  localizedTab: StatProductionTab | null | undefined,
  fallbackTab?: StatProductionTab | null,
): StatisticsTabData {
  const tab = localizedTab || fallbackTab;
  const labels = tab?.productionstatslabel;

  return {
    ...statisticsTabContent.production,
    label: labels?.statisticname || statisticsTabContent.production.label,
    insightLabel: labels?.statisticinsightlabel || statisticsTabContent.production.insightLabel,
    heading: labels?.statistictitle || statisticsTabContent.production.heading,
    description: labels?.statisticdescription || statisticsTabContent.production.description,
    primaryCard: applyPageLabelsToCard(
      productionCard ?? statisticsTabContent.production.primaryCard,
      pageLabels,
    ),
  };
}

function buildFallbackTab(
  tabId: Exclude<StatisticsTabId, 'production' | 'export' | 'price' | 'consumption'>,
  pageLabels: StatisticsPageLabelSet,
): StatisticsTabData {
  const tab = statisticsTabContent[tabId];

  return {
    ...tab,
    primaryCard: applyPageLabelsToCard(tab.primaryCard, pageLabels),
  };
}

function buildExportTab(
  exportCard: StatisticsChartCardData | null,
  pageLabels: StatisticsPageLabelSet,
  localizedTab: StatExportTab | null | undefined,
  fallbackTab?: StatExportTab | null,
): StatisticsTabData {
  const tab = localizedTab || fallbackTab;
  const labels = tab?.exportstatlabels;

  return {
    ...statisticsTabContent.export,
    label: labels?.statisticname || statisticsTabContent.export.label,
    insightLabel: labels?.statisticinsightlabel || statisticsTabContent.export.insightLabel,
    heading: labels?.statistictitle || statisticsTabContent.export.heading,
    description: labels?.statisticdescription || statisticsTabContent.export.description,
    primaryCard: applyPageLabelsToCard(
      exportCard ?? statisticsTabContent.export.primaryCard,
      pageLabels,
    ),
  };
}

function buildPriceTab(
  priceCard: StatisticsChartCardData | null,
  pageLabels: StatisticsPageLabelSet,
  localizedTab: StatPriceTab | null | undefined,
  fallbackTab?: StatPriceTab | null,
): StatisticsTabData {
  const tab = localizedTab || fallbackTab;
  const labels = tab?.pricetrendstatlabel;

  return {
    ...statisticsTabContent.price,
    label: labels?.statisticname || statisticsTabContent.price.label,
    insightLabel: labels?.statisticinsightlabel || statisticsTabContent.price.insightLabel,
    heading: labels?.statistictitle || statisticsTabContent.price.heading,
    description: labels?.statisticdescription || statisticsTabContent.price.description,
    primaryCard: applyPageLabelsToCard(
      priceCard ?? statisticsTabContent.price.primaryCard,
      pageLabels,
    ),
  };
}

function buildConsumptionTab(
  consumptionCard: StatisticsChartCardData | null,
  pageLabels: StatisticsPageLabelSet,
  localizedTab: StatConsumptionTab | null | undefined,
  fallbackTab?: StatConsumptionTab | null,
): StatisticsTabData {
  const tab = localizedTab || fallbackTab;
  const labels = tab?.consumptionstatlabel;

  return {
    ...statisticsTabContent.consumption,
    label: labels?.statisticname || statisticsTabContent.consumption.label,
    insightLabel: labels?.statisticinsightlabel || statisticsTabContent.consumption.insightLabel,
    heading: labels?.statistictitle || statisticsTabContent.consumption.heading,
    description: labels?.statisticdescription || statisticsTabContent.consumption.description,
    primaryCard: applyPageLabelsToCard(
      consumptionCard ?? statisticsTabContent.consumption.primaryCard,
      pageLabels,
    ),
  };
}

export function buildStatisticsPageContent({
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
}: {
  localizedPage: StatisticsPage | null;
  fallbackPage?: StatisticsPage | null;
  localizedProductionTab: StatProductionTab | null;
  fallbackProductionTab?: StatProductionTab | null;
  localizedExportTab: StatExportTab | null;
  fallbackExportTab?: StatExportTab | null;
  localizedPriceTab: StatPriceTab | null;
  fallbackPriceTab?: StatPriceTab | null;
  localizedConsumptionTab: StatConsumptionTab | null;
  fallbackConsumptionTab?: StatConsumptionTab | null;
  productionCard: StatisticsChartCardData | null;
  exportCard: StatisticsChartCardData | null;
  priceCard: StatisticsChartCardData | null;
  consumptionCard: StatisticsChartCardData | null;
}): StatisticsPageContent {
  const pageLabels = mapPageLabels(localizedPage, fallbackPage);

  return {
    hero: mapStatisticsHero(localizedPage, fallbackPage),
    ...pageLabels,
    productionCard,
    tabs: {
      production: buildProductionTab(
        productionCard,
        pageLabels,
        localizedProductionTab,
        fallbackProductionTab,
      ),
      export: buildExportTab(
        exportCard,
        pageLabels,
        localizedExportTab,
        fallbackExportTab,
      ),
      price: buildPriceTab(
        priceCard,
        pageLabels,
        localizedPriceTab,
        fallbackPriceTab,
      ),
      consumption: buildConsumptionTab(
        consumptionCard,
        pageLabels,
        localizedConsumptionTab,
        fallbackConsumptionTab,
      ),
      plantation: buildFallbackTab('plantation', pageLabels),
    },
  };
}

export { STATISTICS_PAGE_LABEL_FALLBACKS };
