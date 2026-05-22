import type { AboutPageBreadcrumbItem } from './shared';
import type { StrapiImage } from './strapi';

export interface PhotoGalleryPageHero {
  id: number;
  PageTitle: string;
  backgroundImageAlt?: string | null;
  Breadcrumb?: AboutPageBreadcrumbItem[] | null;
  backgroundImage?: StrapiImage | null;
}

export interface PhotoGalleryPage {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
  pagehero?: PhotoGalleryPageHero | null;
  photoslabel?: string | null;
  albumphotoslabel?: string | null;
  albumlabel?: string | null;
}

export type AlbumImage = StrapiImage;

export interface Album {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
  albumname: string;
  slug: string;
  albumtitle?: string | null;
  albumsummary: string;
  featuredimg?: AlbumImage | null;
  images: AlbumImage[];
}
