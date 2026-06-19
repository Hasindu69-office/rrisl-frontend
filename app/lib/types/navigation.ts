import type { StrapiImage } from './strapi';

export interface GlobalLayout {
  id: number;
  siteName: string;
  logo: StrapiImage | null;
  favicon: StrapiImage | null;
  logoAlt?: string;
  headerLeftMenuSlug: string;
  headerRightMenuSlug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

export interface MenuItem {
  id: string;
  title: string;
  url: string;
  target: '_self' | '_blank' | '_parent' | '_top';
  isProtected: boolean;
  children?: MenuItem[];
}

export interface HeaderCtaItem {
  title: string;
  url: string;
  target: MenuItem['target'];
}

export interface Menu {
  id: number;
  title: string;
  slug: string;
  items: MenuItem[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}
