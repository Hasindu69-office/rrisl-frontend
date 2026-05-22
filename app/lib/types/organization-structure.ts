import type { AboutPageBreadcrumbItem } from './shared';
import type { StrapiImage } from './strapi';

export interface OrganizationStructurePageHero {
  id: number;
  PageTitle: string;
  backgroundImageAlt?: string | null;
  Breadcrumb?: AboutPageBreadcrumbItem[] | null;
  backgroundImage?: StrapiImage | null;
}

export interface OrganizationStructurePage {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
  pagehero?: OrganizationStructurePageHero | null;
  organizationstructureimg?: StrapiImage | null;
}
