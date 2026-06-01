import type { EstateSubstationAnnualRainfallCardContent } from '@/app/components/estates/EstateSubstationAnnualRainfallCard';
import type {
  EstateSubstationPerformanceCard,
  EstateSubstationPerformanceSectionContent,
  EstateSubstationProductivityBarPoint,
  EstateSubstationProductionTrendPoint,
} from '@/app/components/estates/EstateSubstationPerformanceSection';
import type { EstateSubstationRainfallDistributionCardContent } from '@/app/components/estates/EstateSubstationRainfallDistributionCard';
import type { EstateSubstationSectionShellContent } from '@/app/components/estates/EstateSubstationSectionShell';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';
import type {
  ContactPage,
  EstateSubstation,
  PolgahawelaAnnualRainfallValue,
  PolgahawelaProductionCard,
  PolgahawelaRainfallMonthValue,
  SectionHeader,
} from '@/app/lib/types';
import type { EstateDetailPageViewModel } from './pageData';
import { mapEstateDetailPageData } from './pageData';

export interface PolgahawelaSubstationPageViewModel extends EstateDetailPageViewModel {
  monitoring?: EstateSubstationSectionShellContent;
  annualRainfall?: EstateSubstationAnnualRainfallCardContent;
  rainfallDistribution?: EstateSubstationRainfallDistributionCardContent;
  performance?: EstateSubstationPerformanceSectionContent;
}

const MONTH_ORDER = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function combineSectionTitle(
  sectionHeader: SectionHeader | null | undefined,
  fallback: string
): string {
  const title = sectionHeader?.title?.trim() || '';
  const highlighted = sectionHeader?.hightlightedtext?.trim() || '';
  const combined = `${title}${highlighted ? ` ${highlighted}` : ''}`.trim();
  return combined || fallback;
}

function toNumber(value: number | string | null | undefined): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function formatInteger(value: number): string {
  return Math.round(value).toLocaleString();
}

function formatNumber(value: number): string {
  const isWholeNumber = Math.abs(value % 1) < 0.0001;
  return value.toLocaleString(undefined, {
    minimumFractionDigits: isWholeNumber ? 0 : 1,
    maximumFractionDigits: 1,
  });
}

function clampProgress(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(value, 100));
}

function normalizeYearLabel(value: string | null | undefined): string {
  const match = value?.match(/(\d{4})$/);
  return match ? match[1] : value?.trim() || '';
}

function getNiceStep(maxValue: number, targetTickCount: number): number {
  if (maxValue <= 0) {
    return 1;
  }

  const roughStep = maxValue / Math.max(1, targetTickCount);
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const normalized = roughStep / magnitude;

  if (normalized <= 1) {
    return magnitude;
  }

  if (normalized <= 2) {
    return 2 * magnitude;
  }

  if (normalized <= 5) {
    return 5 * magnitude;
  }

  return 10 * magnitude;
}

function buildTicks(maxValue: number, targetTickCount: number): { max: number; ticks: number[] } {
  const step = getNiceStep(maxValue, targetTickCount);
  const normalizedMax = Math.max(step, Math.ceil(maxValue / step) * step);
  const ticks: number[] = [];

  for (let value = 0; value <= normalizedMax; value += step) {
    ticks.push(value);
  }

  return { max: normalizedMax, ticks };
}

function getAnnualRainfallSeries(
  annualRainfallValues: PolgahawelaAnnualRainfallValue[]
): Array<{ year: string; rainfall: number }> {
  const record = annualRainfallValues[0];

  return [...(record?.yeardata || [])]
    .map((item) => ({
      year: normalizeYearLabel(item.year),
      rainfall: toNumber(item.data),
    }))
    .filter((item) => item.year)
    .sort((left, right) => Number(left.year) - Number(right.year));
}

function getMonthlyRainfallSeries(
  rainfallMonthValues: PolgahawelaRainfallMonthValue[]
): Array<{ month: string; rainfall: number; trend: number }> {
  const record = rainfallMonthValues[0];
  const monthIndex = new Map(MONTH_ORDER.map((month, index) => [month, index]));

  return [...(record?.monthdata || [])]
    .map((item) => {
      const month = item.month?.trim() || '';
      const rainfall = toNumber(item.data);

      return {
        month,
        rainfall,
        trend: rainfall,
      };
    })
    .filter((item) => monthIndex.has(item.month))
    .sort((left, right) => (monthIndex.get(left.month) || 0) - (monthIndex.get(right.month) || 0));
}

function getProductionTrendSeries(
  productionCards: PolgahawelaProductionCard[]
): EstateSubstationProductionTrendPoint[] {
  const record = productionCards[0];

  return [...(record?.trendpoints || [])]
    .map((item) => ({
      year: normalizeYearLabel(item.year),
      value: toNumber(item.data),
    }))
    .filter((item) => item.year)
    .sort((left, right) => Number(left.year) - Number(right.year));
}

function getMonitoringContent(
  estate: EstateSubstation | null | undefined
): EstateSubstationSectionShellContent | undefined {
  if (!estate?.hasmonitoringsection || !estate.monitoringsection) {
    return undefined;
  }

  return {
    eyebrow: estate.monitoringsection.sectionheader?.eyebrow?.trim() || 'Research Activities',
    title: combineSectionTitle(
      estate.monitoringsection.sectionheader,
      'Rainfall & Environmental Monitoring'
    ),
    backgroundImageSrc:
      getOptimizedImageUrl(estate.monitoringsection.monitoringsectionbackgroundimage, 'large') ||
      getOptimizedImageUrl(estate.monitoringsection.monitoringsectionbackgroundimage, 'medium') ||
      getStrapiImageUrl(estate.monitoringsection.monitoringsectionbackgroundimage) ||
      '/images/estateandsubstations/section4bgimg.jpg',
    backgroundImageAlt:
      estate.monitoringsection.monitoringsectionbackgroundimagealt ||
      estate.monitoringsection.monitoringsectionbackgroundimage?.alternativeText ||
      'Rainfall and environmental monitoring background',
  };
}

function getAnnualRainfallContent(
  estate: EstateSubstation | null | undefined,
  annualRainfallValues: PolgahawelaAnnualRainfallValue[]
): EstateSubstationAnnualRainfallCardContent | undefined {
  const card = estate?.monitoringsection?.annualrainfalldistribution;

  if (!estate?.hasmonitoringsection || !card) {
    return undefined;
  }

  const years = getAnnualRainfallSeries(annualRainfallValues);
  const values = years.map((item) => item.rainfall);
  const total = values.reduce((sum, value) => sum + value, 0);
  const average = values.length > 0 ? total / values.length : 0;
  const highest = years.reduce(
    (current, item) => (item.rainfall > current.rainfall ? item : current),
    years[0] || { year: '', rainfall: 0 }
  );
  const lowest = years.reduce(
    (current, item) => (item.rainfall < current.rainfall ? item : current),
    years[0] || { year: '', rainfall: 0 }
  );
  const variationRange = Math.max(0, highest.rainfall - lowest.rainfall);
  const tickConfig = buildTicks(highest.rainfall, 6);
  const dataPeriodLabel =
    years.length > 0 && years[0] && years[years.length - 1]
      ? `${years[0].year} - ${years[years.length - 1].year}`
      : card.subtitle;

  return {
    title: card.title,
    subtitle: card.subtitle,
    description: card.description,
    yAxisLabel: card.xaxislabel,
    xAxisLabel: card.yaxislabel,
    yAxisTicks: tickConfig.ticks,
    yAxisMax: tickConfig.max,
    averageLineValue: Math.round(average),
    averageLineLabel: `${formatInteger(average)} mm\n${card.yearaveragelabel}`,
    highestAnnotation: {
      year: highest.year,
      value: highest.rainfall,
      label: card.highestrainfalllabel,
    },
    summaryCards: [
      {
        label: card.highestrainfalllabel,
        value: `${formatInteger(highest.rainfall)} mm`,
        detail: highest.year ? `in ${highest.year}` : '',
        icon: 'highest',
        accent: 'green',
      },
      {
        label: card.dataperiodlabel,
        value: dataPeriodLabel,
        detail: years.length > 0 ? `${years.length} Years` : '',
        icon: 'period',
        accent: 'indigo',
      },
    ],
    years,
    insightCards: [
      {
        label: card.highestrainfalllabel,
        value: `${formatInteger(highest.rainfall)} mm`,
        detail: highest.year ? `${card.yearlabel} ${highest.year}` : '',
        icon: 'highest',
        accent: 'green',
      },
      {
        label: card.lowestrainfalllabel,
        value: `${formatInteger(lowest.rainfall)} mm`,
        detail: lowest.year ? `${card.yearlabel} ${lowest.year}` : '',
        icon: 'lowest',
        accent: 'blue',
      },
      {
        label: `${card.totallabel} (${years.length} Years)`,
        value: `${formatInteger(total)} mm`,
        detail: 'Cumulative Rainfall',
        icon: 'total',
        accent: 'teal',
      },
      {
        label: card.variationrangelabel,
        value: `${formatInteger(variationRange)} mm`,
        detail: `(${formatInteger(lowest.rainfall)} - ${formatInteger(highest.rainfall)} mm)`,
        icon: 'variation',
        accent: 'purple',
      },
    ],
    sourceNote: card.footernote,
  };
}

function getRainfallDistributionContent(
  estate: EstateSubstation | null | undefined,
  annualRainfallValues: PolgahawelaAnnualRainfallValue[],
  rainfallMonthValues: PolgahawelaRainfallMonthValue[]
): EstateSubstationRainfallDistributionCardContent | undefined {
  const card = estate?.monitoringsection?.rainfalldistribution;

  if (!estate?.hasmonitoringsection || !card) {
    return undefined;
  }

  const months = getMonthlyRainfallSeries(rainfallMonthValues);
  const annualYears = getAnnualRainfallSeries(annualRainfallValues);
  const annualAverage = months.reduce((sum, item) => sum + item.rainfall, 0);
  const highest = months.reduce(
    (current, item) => (item.rainfall > current.rainfall ? item : current),
    months[0] || { month: '', rainfall: 0, trend: 0 }
  );
  const lowest = months.reduce(
    (current, item) => (item.rainfall < current.rainfall ? item : current),
    months[0] || { month: '', rainfall: 0, trend: 0 }
  );
  const tickConfig = buildTicks(highest.rainfall, 5);
  const dataPeriodValue =
    annualYears.length > 0 ? `${annualYears.length} Years` : `${months.length} Months`;

  return {
    title: card.title,
    subtitle: card.subtitle,
    description: card.description,
    summaryBadge: {
      label: card.summarybadgelabel,
      value: `${formatInteger(annualAverage)} mm`,
    },
    yAxisLabel: card.yaxislabel,
    xAxisLabel: card.xaxislabel,
    yAxisTicks: tickConfig.ticks,
    yAxisMax: tickConfig.max,
    months,
    seasonBands: [
      {
        label: card.dryseasonlabel,
        icon: 'sun',
        startMonth: 'Jan',
        endMonth: 'Mar',
        fill: 'rgba(255, 191, 87, 0.08)',
        textColor: '#B37711',
      },
      {
        label: card.southwestmonsoonlabel,
        icon: 'southwest-monsoon',
        startMonth: 'Apr',
        endMonth: 'Aug',
        fill: 'rgba(76, 184, 139, 0.06)',
        textColor: '#2D8B67',
      },
      {
        label: card.northwestmonsoonlabel,
        icon: 'northeast-monsoon',
        startMonth: 'Sep',
        endMonth: 'Dec',
        fill: 'rgba(103, 160, 255, 0.06)',
        textColor: '#246BDE',
      },
    ],
    peakAnnotation: {
      month: highest.month,
      label: card.peakannotationlabel,
      value: highest.rainfall,
    },
    legend: {
      barLabel: card.legendbarlabel,
      lineLabel: card.legendlinelabel,
    },
    sourceNote: card.sourcenote,
    metricCards: [
      {
        label: card.highestrainfalllabel,
        value: highest.month,
        icon: 'highest',
        accent: 'green',
      },
      {
        label: card.lowestrainfalllabel,
        value: lowest.month,
        icon: 'lowest',
        accent: 'blue',
      },
      {
        label: card.annualaveragelabel,
        value: `${formatInteger(annualAverage)} mm`,
        icon: 'average',
        accent: 'mint',
      },
      {
        label: card.rainfallpatternlabel,
        value: card.rainfallpatternnamelabel,
        icon: 'pattern',
        accent: 'purple',
      },
      {
        label: card.dataperiodlabel,
        value: dataPeriodValue,
        icon: 'period',
        accent: 'amber',
      },
    ],
    footerNote: card.footernote,
  };
}

function buildTapperHighlight(description: string, highlightText: string): {
  prefix: string;
  text: string;
  suffix: string;
} {
  const normalizedDescription = description.trim();
  const normalizedHighlightText = highlightText.trim();

  if (!normalizedDescription) {
    return {
      prefix: '',
      text: normalizedHighlightText,
      suffix: '',
    };
  }

  if (!normalizedHighlightText) {
    return {
      prefix: normalizedDescription,
      text: '',
      suffix: '',
    };
  }

  const lowerDescription = normalizedDescription.toLowerCase();
  const lowerHighlightText = normalizedHighlightText.toLowerCase();
  const highlightIndex = lowerDescription.indexOf(lowerHighlightText);

  if (highlightIndex === -1) {
    return {
      prefix: normalizedDescription,
      text: '',
      suffix: '',
    };
  }

  return {
    prefix: normalizedDescription.slice(0, highlightIndex).trim(),
    text: normalizedDescription.slice(
      highlightIndex,
      highlightIndex + normalizedHighlightText.length
    ),
    suffix: normalizedDescription.slice(highlightIndex + normalizedHighlightText.length).trim(),
  };
}

function getPerformanceContent(
  estate: EstateSubstation | null | undefined,
  productionCards: PolgahawelaProductionCard[]
): EstateSubstationPerformanceSectionContent | undefined {
  const section = estate?.performancesection;

  if (!estate?.hasperformancesection || !section) {
    return undefined;
  }

  const cards: EstateSubstationPerformanceCard[] = [];
  const productionTrendSeries = getProductionTrendSeries(productionCards);

  if (section.productiontrendcard?.isvisible) {
    const referenceYear = String(section.productiontrendcard.referenceyear);
    const referencePoint =
      productionTrendSeries.find((point) => point.year === referenceYear) ||
      productionTrendSeries[productionTrendSeries.length - 1] || {
        year: referenceYear,
        value: 0,
      };

    cards.push({
      type: 'productionTrend',
      accent: 'green',
      title: section.productiontrendcard.title,
      value: formatInteger(referencePoint.value),
      unit: section.productiontrendcard.metricunits,
      description: section.productiontrendcard.description,
      badgeLabel: `Year ${referencePoint.year || referenceYear}`,
      chart: productionTrendSeries,
    });
  }

  if (section.yieldperformancecard?.isvisible) {
    const progress =
      section.yieldperformancecard.totalmetrivalueofyear > 0
        ? (section.yieldperformancecard.metricvalueofyear /
            section.yieldperformancecard.totalmetrivalueofyear) *
          100
        : 0;

    cards.push({
      type: 'yieldGauge',
      accent: 'green',
      title: section.yieldperformancecard.title,
      value: formatInteger(section.yieldperformancecard.metricvalueofyear),
      unit: section.yieldperformancecard.metricunits,
      progress: clampProgress(progress),
      description: section.yieldperformancecard.description,
      insight: section.yieldperformancecard.insight,
    });
  }

  if (section.qualityguagecard?.isvisible) {
    cards.push({
      type: 'qualityGauge',
      accent: 'gold',
      title: section.qualityguagecard.title,
      value: section.qualityguagecard.percentagevalue,
      supportingValue: section.qualityguagecard.percentagevaluelabel,
      progress: clampProgress(toNumber(section.qualityguagecard.percentagevalue.replace('%', ''))),
      description: section.qualityguagecard.description,
      insight: section.qualityguagecard.insights,
    });
  }

  if (section.taperproductioncard?.isvisible) {
    const chartValues: EstateSubstationProductivityBarPoint[] =
      section.taperproductioncard.barchartvalues?.map((item) => ({
        label: item.label,
        value: toNumber(item.value),
      })) || [];
    const highestValue = chartValues.reduce(
      (current, item) => (item.value > current ? item.value : current),
      0
    );
    const chart = chartValues.map((item) => ({
      ...item,
      highlight: item.value === highestValue && highestValue > 0,
    }));
    const highlight = buildTapperHighlight(
      section.taperproductioncard.description,
      section.taperproductioncard.metatag1
    );

    cards.push({
      type: 'productivityBars',
      accent: 'green',
      title: section.taperproductioncard.title,
      value: formatNumber(toNumber(section.taperproductioncard.metricvalue)),
      unit: 'kg',
      description: section.taperproductioncard.averagevaluelabel,
      highlightPrefix: highlight.prefix,
      highlightText: highlight.text,
      highlightSuffix: highlight.suffix,
      metadata: [section.taperproductioncard.metatag1, section.taperproductioncard.metatag2].filter(Boolean),
      chart,
    });
  }

  return {
    eyebrow: section.sectionheader?.eyebrow?.trim() || 'Gallery',
    title: combineSectionTitle(section.sectionheader, 'Production & Field Performance'),
    description: section.description,
    cards,
    footerNote: section.footernote,
    cta: {
      label: '',
      href: '#',
    },
  };
}

export function mapPolgahawelaSubstationPageData(
  estate: EstateSubstation | null | undefined,
  contactPage: ContactPage | null | undefined,
  annualRainfallValues: PolgahawelaAnnualRainfallValue[],
  rainfallMonthValues: PolgahawelaRainfallMonthValue[],
  productionCards: PolgahawelaProductionCard[]
): PolgahawelaSubstationPageViewModel {
  const basePageData = mapEstateDetailPageData(estate, contactPage);

  return {
    ...basePageData,
    monitoring: getMonitoringContent(estate),
    annualRainfall: getAnnualRainfallContent(estate, annualRainfallValues),
    rainfallDistribution: getRainfallDistributionContent(
      estate,
      annualRainfallValues,
      rainfallMonthValues
    ),
    performance: getPerformanceContent(estate, productionCards),
  };
}
