import type { AboutPageBreadcrumbItem, SectionHeader } from './shared';
import type { StrapiImage } from './strapi';

export interface AdvisoryServicePageHero {
  id: number;
  PageTitle: string;
  backgroundImageAlt?: string | null;
  Breadcrumb?: AboutPageBreadcrumbItem[] | null;
  backgroundImage?: StrapiImage | null;
}

export interface AdvisoryServiceParagraph {
  id: number;
  paragraph: string;
}

export interface AdvisoryServicePage {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
  pagehero?: AdvisoryServicePageHero | null;
  sectionheader?: SectionHeader | null;
  description?: AdvisoryServiceParagraph[] | null;
  sectionimgleft?: StrapiImage | null;
  trainingprogrambgimg?: StrapiImage | null;
}

export interface TrainingProgramCategory {
  id: number;
  documentId?: string;
  categorytitle: string;
  sortorder: number;
  locale?: string;
}

export interface TrainingProgram {
  id: number;
  documentId?: string;
  programname: string;
  description: string;
  sortorder: number;
  locale?: string;
  image?: StrapiImage | null;
  training_program_category?: TrainingProgramCategory | null;
}
