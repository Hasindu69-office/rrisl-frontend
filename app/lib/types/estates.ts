import type { AboutPageBreadcrumbItem, SectionHeader } from './shared';
import type { StrapiImage } from './strapi';

export interface EstateAndSubstationsPageHero {
  id: number;
  PageTitle: string;
  backgroundImageAlt?: string | null;
  Breadcrumb?: AboutPageBreadcrumbItem[] | null;
  backgroundImage?: StrapiImage | null;
}

export interface EstateAndSubstationsPage {
  id: number;
  documentId?: string;
  locale?: string;
  pagehero?: EstateAndSubstationsPageHero | null;
  sectionheader?: SectionHeader | null;
  readmorebuttonlabel?: string | null;
}

export interface EstateSubstationBulletPoint {
  id: number;
  label: string;
}

export interface EstateSubstationParagraph {
  id: number;
  paragraph: string;
}

export interface EstateSubstationIntroSectionData {
  id: number;
  sectionheader?: SectionHeader | null;
  paragraph?: EstateSubstationParagraph[] | null;
}

export interface EstateSubstationFacilityCard {
  id: number;
  title: string;
  description: string;
  icon?: StrapiImage | null;
}

export interface EstateSubstationFacilitiesSectionData {
  id: number;
  sectionheader?: SectionHeader | null;
  paragraph?: EstateSubstationParagraph[] | null;
  cards?: EstateSubstationFacilityCard[] | null;
}

export interface EstateSubstationActivityCard {
  id: number;
  title: string;
  description: string;
  image?: StrapiImage | null;
  imagealt?: string | null;
}

export interface EstateSubstationActivitiesSectionData {
  id: number;
  sectionheader?: SectionHeader | null;
  card?: EstateSubstationActivityCard[] | null;
}

export interface EstateSubstationFeatureCard {
  id: number;
  title: string;
  badge?: string | null;
  description: string;
  image?: StrapiImage | null;
  imagealt?: string | null;
}

export interface EstateSubstationFeatureSectionData {
  id: number;
  sectionheader?: SectionHeader | null;
  description?: string | null;
  cards?: EstateSubstationFeatureCard[] | null;
  featuresectionbackgroundimage?: StrapiImage | null;
  featuresectionbackgroundimagealt?: string | null;
}

export interface EstateSubstationYearData {
  id: number;
  year: string;
  data: number;
}

export interface EstateSubstationMonthData {
  id: number;
  month: string;
  data: number;
}

export interface EstateSubstationAnnualRainfallCardData {
  id: number;
  title: string;
  subtitle: string;
  highestrainfalllabel: string;
  dataperiodlabel: string;
  description: string;
  xaxislabel: string;
  yaxislabel: string;
  yearaveragelabel: string;
  yearlabel: string;
  lowestrainfalllabel: string;
  totallabel: string;
  variationrangelabel: string;
  footernote: string;
}

export interface EstateSubstationRainfallDistributionCardData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  summarybadgelabel: string;
  yaxislabel: string;
  xaxislabel: string;
  legendbarlabel: string;
  legendlinelabel: string;
  sourcenote: string;
  dryseasonlabel: string;
  southwestmonsoonlabel: string;
  northwestmonsoonlabel: string;
  peakannotationlabel: string;
  highestrainfalllabel: string;
  lowestrainfalllabel: string;
  annualaveragelabel: string;
  rainfallpatternlabel: string;
  rainfallpatternnamelabel: string;
  dataperiodlabel: string;
  footernote: string;
}

export interface EstateSubstationMonitoringSectionData {
  id: number;
  sectionheader?: SectionHeader | null;
  monitoringsectionbackgroundimage?: StrapiImage | null;
  monitoringsectionbackgroundimagealt?: string | null;
  rainfalldistribution?: EstateSubstationRainfallDistributionCardData | null;
  annualrainfalldistribution?: EstateSubstationAnnualRainfallCardData | null;
}

export interface EstateSubstationProductionTrendCardData {
  id: number;
  isvisible: boolean;
  title: string;
  metricunits: string;
  referenceyear: number;
  description: string;
}

export interface EstateSubstationYieldPerformanceCardData {
  id: number;
  isvisible: boolean;
  title: string;
  metricvalueofyear: number;
  metricunits: string;
  totalmetrivalueofyear: number;
  description: string;
  insight: string;
}

export interface EstateSubstationQualityGaugeCardData {
  id: number;
  isvisible: boolean;
  title: string;
  percentagevalue: string;
  percentagevaluelabel: string;
  description: string;
  insights: string;
}

export interface EstateSubstationBarChartValueData {
  id: number;
  label: string;
  value: number | string;
}

export interface EstateSubstationTapperProductionCardData {
  id: number;
  isvisible: boolean;
  title: string;
  metricvalue: string;
  averagevaluelabel: string;
  barchartvalues?: EstateSubstationBarChartValueData[] | null;
  description: string;
  metatag1: string;
  metatag2: string;
}

export interface EstateSubstationPerformanceSectionData {
  id: number;
  sectionheader?: SectionHeader | null;
  description: string;
  footernote: string;
  productiontrendcard?: EstateSubstationProductionTrendCardData | null;
  yieldperformancecard?: EstateSubstationYieldPerformanceCardData | null;
  qualityguagecard?: EstateSubstationQualityGaugeCardData | null;
  taperproductioncard?: EstateSubstationTapperProductionCardData | null;
}

export interface EstateSubstationPageHero {
  id: number;
  PageTitle: string;
  backgroundImageAlt?: string | null;
  Breadcrumb?: AboutPageBreadcrumbItem[] | null;
  backgroundImage?: StrapiImage | null;
}

export interface EstateSubstation {
  id: number;
  documentId?: string;
  locale?: string;
  title: string;
  slug: string;
  type: 'estate' | 'substation';
  sortorder: number;
  shortdescription: string;
  point?: EstateSubstationBulletPoint[] | null;
  pagehero?: EstateSubstationPageHero | null;
  introduction?: EstateSubstationIntroSectionData | null;
  introductionimage?: StrapiImage | null;
  imagealt?: string | null;
  facilitiessection?: EstateSubstationFacilitiesSectionData | null;
  facilitysectionimage?: StrapiImage | null;
  facilitysectionimgalt?: string | null;
  activitiessection?: EstateSubstationActivitiesSectionData | null;
  activitiessectionbgimage?: StrapiImage | null;
  activitiessectionbgimagealt?: string | null;
  hasfeaturesection?: boolean | null;
  featuressection?: EstateSubstationFeatureSectionData | null;
  hasmonitoringsection?: boolean | null;
  monitoringsection?: EstateSubstationMonitoringSectionData | null;
  hasperformancesection?: boolean | null;
  performancesection?: EstateSubstationPerformanceSectionData | null;
  contacttitlepart1?: string | null;
  contacttitlepart2?: string | null;
  contactverticaltext?: string | null;
  contactkey?: string | null;
}

export interface PolgahawelaAnnualRainfallValue {
  id: number;
  documentId?: string;
  yeardata?: EstateSubstationYearData[] | null;
}

export interface PolgahawelaRainfallMonthValue {
  id: number;
  documentId?: string;
  monthdata?: EstateSubstationMonthData[] | null;
}

export interface PolgahawelaProductionCard {
  id: number;
  documentId?: string;
  trendpoints?: EstateSubstationYearData[] | null;
}

