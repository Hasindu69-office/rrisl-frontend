import type { AboutPageBreadcrumbItem, ErrorMessageContent } from './shared';
import type { StrapiImage, StrapiMedia } from './strapi';

export interface DownloadPageHero {
  id: number;
  PageTitle: string;
  backgroundImageAlt?: string | null;
  Breadcrumb?: AboutPageBreadcrumbItem[] | null;
  backgroundImage?: StrapiImage | null;
}

export interface Download {
  id: number;
  documentId?: string;
  Title: string;
  documentimage: StrapiImage | null;
  document: StrapiMedia | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
}

export interface DownloadPage {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  LabelReadMore?: string | null;
  ErrrorMessage?: ErrorMessageContent | null;
  pagehero?: DownloadPageHero | null;
}
