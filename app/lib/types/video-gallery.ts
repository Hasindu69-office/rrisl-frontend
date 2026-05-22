import type { AboutPageBreadcrumbItem } from './shared';
import type { StrapiImage, StrapiMedia } from './strapi';

export interface VideoGalleryPageHero {
  id: number;
  PageTitle: string;
  backgroundImageAlt?: string | null;
  Breadcrumb?: AboutPageBreadcrumbItem[] | null;
  backgroundImage?: StrapiImage | null;
}

export interface VideoGalleryPage {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
  pagehero?: VideoGalleryPageHero | null;
  videoslabel?: string | null;
  albumvideoslabel?: string | null;
  albumlabel?: string | null;
}

export type VideoAlbumImage = StrapiImage;

export interface VideoItem {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
  videotitle: string;
  videodescription: string;
  thumbnailimage?: VideoAlbumImage | null;
  sourcetype?: 'youtube' | 'local' | null;
  videourl?: string | null;
  videofile?: StrapiMedia | null;
  duration?: string | null;
  sortorder: number;
}

export interface VideoAlbum {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
  videoalbumname: string;
  slug: string;
  videoalbumtitle?: string | null;
  videoalbumsummary: string;
  featuredimg?: VideoAlbumImage | null;
  video_items: VideoItem[];
}
