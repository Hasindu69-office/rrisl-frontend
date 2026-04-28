import type { AboutPageBreadcrumbItem } from './shared';
import type { StrapiImage, StrapiMedia } from './strapi';

export interface BidNoticePageHero {
  id: number;
  PageTitle: string;
  backgroundImageAlt?: string | null;
  Breadcrumb?: AboutPageBreadcrumbItem[] | null;
  backgroundImage?: StrapiImage | null;
}

export interface Tender {
  id: number;
  documentId?: string;
  Title: string;
  TenderNumber: string;
  ClosingDate: string;
  PublishDate: string;
  State: 'Open' | 'Closed' | 'Archived';
  Document: StrapiMedia | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
}

export interface BidNoticePage {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  pagehero?: BidNoticePageHero | null;
  rrisllogo?: StrapiImage | null;
  LabelClosingDate?: string | null;
  LabelReadMore?: string | null;
  tenders?: Tender[] | null;
}
