import type { AboutPageBreadcrumbItem, ErrorMessageContent } from './shared';
import type { StrapiImage, StrapiMedia } from './strapi';

export interface EPublicationsPageHero {
  id: number;
  PageTitle: string;
  backgroundImageAlt?: string | null;
  Breadcrumb?: AboutPageBreadcrumbItem[] | null;
  backgroundImage?: StrapiImage | null;
}

export interface PublicationCategoryRelation {
  id: number;
  documentId?: string;
  CategoryName?: string;
  Slug?: string;
  DisplayOrder?: number;
}

export interface PublicationCategory {
  id: number;
  documentId?: string;
  CategoryName: string;
  Slug?: string;
  DisplayOrder: number;
  IsActive?: boolean;
  publication_category?: PublicationCategoryRelation | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
}

export interface Publication {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  publication_categories?: PublicationCategoryRelation[] | null;
  CoverImage: StrapiImage | null;
  CoverImgAltText?: string | null;
  PublicationDocument: StrapiMedia | null;
  DisplayOrder: number;
  IsActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
}

export interface EPublicationsPage {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  LabelItems?: string | null;
  LabelFilterLibrary?: string | null;
  LabelResetButton?: string | null;
  LabelSearchLibrary?: string | null;
  LabelReadMore?: string | null;
  ErrorMessage?: ErrorMessageContent | null;
  pagehero?: EPublicationsPageHero | null;
}
