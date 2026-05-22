import type {
  DataInsightsSection,
  HomepageStatisticsSectionItem,
  HeroCta,
} from '@/app/lib/types';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';

export interface DataInsightsChartItem {
  label: string;
  value: number;
}

export interface DataInsightsSectionViewModel {
  statisticsLabel: string;
  statisticsTitle: string;
  yearLabel: string;
  year: number;
  eyebrow: string;
  title: string;
  highlightedText: string;
  descriptionParagraphs: string[];
  backgroundImageSrc: string;
  backgroundImageAlt: string;
  cta: HeroCta | null;
  chartData: DataInsightsChartItem[];
}

const DATA_INSIGHTS_FALLBACK: DataInsightsSectionViewModel = {
  statisticsLabel: 'Statistics',
  statisticsTitle: 'Rubber Production by Different Types',
  yearLabel: 'Year',
  year: 2024,
  eyebrow: 'Data & Insights',
  title: 'Real-Time',
  highlightedText: 'Data & Insights',
  descriptionParagraphs: [
    'This section presents a detailed year-to-year comparison of growth across major rubber product categories, including Sheet, Sole Crepe, Scrap Crepe, Latex Crepe, T.S.R., and Latex Other. It allows users to analyze annual performance by examining changes in production volumes and identifying patterns of growth, decline, or stability over time. Through clear visualization and structured data presentation, the section supports easy comparison between years and product types, helping users understand both short-term fluctuations and long-term industry trends.',
    'The information is particularly useful for researchers, policymakers, rubber growers, exporters, and industry stakeholders who require reliable insights for planning and evaluation. By observing year-on-year movements, users can assess how market demand, production conditions, and policy or environmental factors may influence different product segments.',
  ],
  backgroundImageSrc: '/images/datainsightsbackground.jpg',
  backgroundImageAlt: 'Data insights background',
  cta: {
    id: 0,
    label: 'View Data',
    linkType: 'internal',
    url: '/production-statistics',
    variant: 'primary',
    openInNewTab: false,
  },
  chartData: [
    { label: 'Production', value: 12799 },
    { label: 'Plantation', value: 12799 },
    { label: 'Price', value: 15000 },
    { label: 'Price', value: 17000 },
    { label: 'Other', value: 10000 },
  ],
};

function mapDescriptionParagraphs(description: string | null | undefined): string[] {
  if (!description) {
    return DATA_INSIGHTS_FALLBACK.descriptionParagraphs;
  }

  const paragraphs = description
    .split('|')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return paragraphs.length > 0 ? paragraphs : DATA_INSIGHTS_FALLBACK.descriptionParagraphs;
}

function mapChartData(
  statistics: HomepageStatisticsSectionItem[] | null | undefined
): DataInsightsChartItem[] {
  if (!Array.isArray(statistics)) {
    return [];
  }

  return statistics
    .filter((item): item is HomepageStatisticsSectionItem => Boolean(item))
    .map((item) => ({
      label: item.label || '',
      value: typeof item.value === 'number' ? item.value : 0,
    }))
    .filter((item) => item.label && item.value > 0);
}

export function mapDataInsightsSection(
  section: DataInsightsSection | null | undefined,
  statistics: HomepageStatisticsSectionItem[] | null | undefined
): DataInsightsSectionViewModel {
  const image = section?.backgroundimage;
  const chartData = mapChartData(statistics);

  return {
    statisticsLabel: section?.statisticslabel || DATA_INSIGHTS_FALLBACK.statisticsLabel,
    statisticsTitle: section?.statisticstitle || DATA_INSIGHTS_FALLBACK.statisticsTitle,
    yearLabel: section?.yearlabel || DATA_INSIGHTS_FALLBACK.yearLabel,
    year: section?.year || DATA_INSIGHTS_FALLBACK.year,
    eyebrow:
      section?.statisticsrightheader?.eyebrow || DATA_INSIGHTS_FALLBACK.eyebrow,
    title:
      section?.statisticsrightheader?.title || DATA_INSIGHTS_FALLBACK.title,
    highlightedText:
      section?.statisticsrightheader?.hightlightedtext ||
      DATA_INSIGHTS_FALLBACK.highlightedText,
    descriptionParagraphs: mapDescriptionParagraphs(section?.description),
    backgroundImageSrc:
      getOptimizedImageUrl(image, 'large') ||
      getOptimizedImageUrl(image, 'medium') ||
      getStrapiImageUrl(image) ||
      DATA_INSIGHTS_FALLBACK.backgroundImageSrc,
    backgroundImageAlt:
      image?.alternativeText || DATA_INSIGHTS_FALLBACK.backgroundImageAlt,
    cta: section?.viewdatabutton || DATA_INSIGHTS_FALLBACK.cta,
    chartData: chartData.length > 0 ? chartData : DATA_INSIGHTS_FALLBACK.chartData,
  };
}
