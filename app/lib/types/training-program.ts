import type { AboutPageBreadcrumbItem, SectionHeader } from './shared';
import type { StrapiImage } from './strapi';

export interface TrainingProgramPageHero {
  id: number;
  PageTitle: string;
  backgroundImageAlt?: string | null;
  Breadcrumb?: AboutPageBreadcrumbItem[] | null;
  backgroundImage?: StrapiImage | null;
}

export interface TrainingProgramPoint {
  id: number;
  point: string;
  icon?: StrapiImage | null;
}

export interface TrainingProgramCard {
  id: number;
  programtitle: string;
  sortorder: number;
  points?: TrainingProgramPoint[] | null;
  imageright?: StrapiImage | null;
}

export interface TrainingProgramPage {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
  pagehero?: TrainingProgramPageHero | null;
  sectionheader?: SectionHeader | null;
  description?: string | null;
  trainingprogram?: TrainingProgramCard[] | null;
  backgroundimage?: StrapiImage | null;
}
