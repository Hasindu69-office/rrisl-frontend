import type { AboutPageBreadcrumbItem, SectionHeader } from './shared';
import type { StrapiImage } from './strapi';

export interface EventParagraph {
  id: number;
  paragraph?: string | null;
}

export interface EventCategory {
  id: number;
  documentId?: string;
  name?: string | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
}

export interface EventEntity {
  id: number;
  documentId?: string;
  title?: string | null;
  slug?: string | null;
  summary?: string | null;
  paragraph?: EventParagraph[] | null;
  dateandtime?: string | null;
  location?: string | null;
  featuredImage?: StrapiImage | null;
  galleryimages?: StrapiImage[] | null;
  event_categories?: EventCategory[] | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
}

export interface EventPageHero {
  id: number;
  PageTitle?: string | null;
  backgroundImageAlt?: string | null;
  Breadcrumb?: AboutPageBreadcrumbItem[] | null;
  backgroundImage?: StrapiImage | null;
}

export interface EventPage {
  id: number;
  documentId?: string;
  locale?: string;
  pagehero?: EventPageHero | null;
  sectionheader?: SectionHeader | null;
  locationlabel?: string | null;
  readdetailslabel?: string | null;
  alllabel?: string | null;
  pastlabel?: string | null;
  upcominglabel?: string | null;
  viewdetailslabel?: string | null;
  nextbuttonlabel?: string | null;
  previousbuttonlabel?: string | null;
  backtoalleventslabel?: string | null;
  detailslabel?: string | null;
  datelabel?: string | null;
  timelabel?: string | null;
  statuslabel?: string | null;
}
