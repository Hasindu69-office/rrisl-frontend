import type { AboutPageBreadcrumbItem, SectionHeader } from './shared';
import type { StrapiImage } from './strapi';

export interface FaqPageHero {
  id: number;
  PageTitle: string;
  backgroundImageAlt?: string | null;
  Breadcrumb?: AboutPageBreadcrumbItem[] | null;
  backgroundImage?: StrapiImage | null;
}

export interface FaqPage {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
  pagehero?: FaqPageHero | null;
  sectionheader?: SectionHeader | null;
  leftimage?: StrapiImage | null;
}

export interface Faq {
  id: number;
  documentId?: string;
  question: string;
  answer: string;
  sortorder: number;
  locale?: string;
}
