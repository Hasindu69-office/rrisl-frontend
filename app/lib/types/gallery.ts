import type { AboutPageBreadcrumbItem, SectionHeader } from './shared';
import type { StrapiImage } from './strapi';

export interface GalleryPageHero {
  id: number;
  PageTitle: string;
  backgroundImageAlt?: string | null;
  Breadcrumb?: AboutPageBreadcrumbItem[] | null;
  backgroundImage?: StrapiImage | null;
}

export interface GalleryAlbumCard {
  id: number;
  albumlabel: string;
  albumtitle: string;
  albumdescription: string;
  viewalbumlabel: string;
  url: string;
  albumimg?: StrapiImage | null;
}

export interface GalleryPage {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
  pagehero?: GalleryPageHero | null;
  sectionheader?: SectionHeader | null;
  description?: string | null;
  photogallery?: GalleryAlbumCard | null;
  videogallery?: GalleryAlbumCard | null;
}
