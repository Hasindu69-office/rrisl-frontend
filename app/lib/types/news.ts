import type { AboutPageBreadcrumbItem, ErrorMessageContent } from './shared';
import type { StrapiImage } from './strapi';

export interface NewsParagraph {
  id: number;
  paragraph?: string | null;
}

export interface NewsCategory {
  id: number;
  documentId?: string;
  name?: string | null;
  slug?: string | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
  locale?: string;
}

export interface NewsArticleEntity {
  id: number;
  documentId?: string;
  title?: string | null;
  slug?: string | null;
  summary?: string | null;
  paragraph?: NewsParagraph[] | null;
  featuredImage?: StrapiImage | null;
  gallelryImages?: StrapiImage[] | null;
  isFeatured?: boolean | null;
  news_categories?: NewsCategory[] | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
}

export interface NewsAndBlogPageHero {
  id: number;
  PageTitle?: string | null;
  backgroundImageAlt?: string | null;
  Breadcrumb?: AboutPageBreadcrumbItem[] | null;
  backgroundImage?: StrapiImage | null;
}

export interface NewsAndBlogPage {
  id: number;
  documentId?: string;
  locale?: string;
  pagehero?: NewsAndBlogPageHero | null;
  topic?: string | null;
  latestfromrrisllabel?: string | null;
  featuredlabel?: string | null;
  readfeaturedarticlebuttonlabel?: string | null;
  readarticlelabel?: string | null;
  Backtoallarticleslabel?: string | null;
  relatedarticleslabel?: string | null;
  readlabel?: string | null;
  articlelabel?: string | null;
  alllabel?: string | null;
  articlegallerylabel?: string | null;
  ErrorMessage?: ErrorMessageContent | null;
}
