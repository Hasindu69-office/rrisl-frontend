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
  contacttitlepart1?: string | null;
  contacttitlepart2?: string | null;
  contactverticaltext?: string | null;
  contactkey?: string | null;
}

