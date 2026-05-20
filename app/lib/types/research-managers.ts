import type { AboutPageBreadcrumbItem, SectionHeader } from './shared';
import type { StrapiImage } from './strapi';

export interface ResearchManagersPageHero {
  id: number;
  PageTitle: string;
  backgroundImageAlt?: string | null;
  Breadcrumb?: AboutPageBreadcrumbItem[] | null;
  backgroundImage?: StrapiImage | null;
}

export interface ResearchManagerEmail {
  id?: number;
  email?: string | null;
}

export interface ResearchManagerProfilePoint {
  id?: number;
  text?: string | null;
}

export interface ResearchManager {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
  fullname: string;
  role: string;
  credentials: string;
  image?: StrapiImage | null;
  imagealt?: string | null;
  email?: ResearchManagerEmail[] | null;
  phonenumber: string;
  profilesummary: string;
  biography: string;
  profilepoints?: ResearchManagerProfilePoint[] | null;
  sortorder: number;
}

export interface ResearchManagersPage {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
  pagehero?: ResearchManagersPageHero | null;
  researchleadershipdetails?: SectionHeader | null;
  description?: string | null;
  leadershipprofilelabel?: string | null;
  viewfullprofilebuttonlabel?: string | null;
  primarycontactlabel?: string | null;
  directlinelabel?: string | null;
  researchmanagementlabel?: string | null;
  profileoverviewlabel?: string | null;
}
