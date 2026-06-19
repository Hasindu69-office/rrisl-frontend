import type { AboutPageBreadcrumbItem } from './shared';
import type { StrapiImage } from './strapi';

export interface SeniorManagementPageHero {
  id: number;
  PageTitle: string;
  backgroundImageAlt?: string | null;
  Breadcrumb?: AboutPageBreadcrumbItem[] | null;
  backgroundImage?: StrapiImage | null;
}

export interface SeniorManagementPage {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
  pagehero?: SeniorManagementPageHero | null;
}

export interface SeniorManagementMember {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
  name: string;
  position: string;
  description: string;
  image?: StrapiImage | null;
  imagealt?: string | null;
  sortorder: number;
}
