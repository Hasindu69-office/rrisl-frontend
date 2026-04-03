// Strapi API Response Types

export interface StrapiImage {
  id: number;
  documentId?: string;
  name: string;
  alternativeText?: string | null;
  caption?: string | null;
  width: number;
  height: number;
  formats?: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string | null;
  provider: string;
  provider_metadata?: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
}

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Global Layout Types
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

// Menu Types (from tree-menus plugin)
export interface MenuItem {
  id: string;
  title: string;
  url: string;
  target: '_self' | '_blank' | '_parent' | '_top';
  isProtected: boolean;
  children?: MenuItem[];
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

// Home Page Types
export interface RichTextBlock {
  type: string;
  children: Array<{
    text: string;
    type: string;
  }>;
}

export interface HeroBadge {
  id: number;
  title: string;
  subtitle: string;
  position: string | null;
  avatars?: StrapiImage[];
  icon?: StrapiImage | null;
}

export interface HeroLabel {
  id: number;
  text: string;
  position: string;
}

export interface HeroCta {
  id: number;
  label: string;
  linkType: 'internal' | 'external';
  url: string;
  variant: string;
  openInNewTab: boolean;
}

export interface SectionHeader {
  id: number;
  eyebrow: string;
  title: string;
  alignment?: 'left' | 'center' | 'right';
  hightlightedtext?: string;
}

export interface HeroNewsItem {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  publishedDate: string;
  featuredImage: StrapiImage | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
}

export interface HeroAnnouncementItem {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  summary: string | null;
  cta?: HeroCta | null;
  image: StrapiImage | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
}

export interface AnnouncementSection {
  id: number;
  showNewsCard?: boolean;
  newsCardTitle?: string;
  showAnnoucementCard?: boolean;
  announcementCardTitle?: string;
  annoucementlabel?: string;
  hero_annoucements_item?: HeroAnnouncementItem | null;
}

export interface AboutSection {
  id: number;
  body: RichTextBlock[];
  header: SectionHeader | null;
  primaryCta: HeroCta | null;
  imageTop: StrapiImage | null;
  imageBottom: StrapiImage | null;
}

export interface Hero {
  id: number;
  title: string;
  highlightedText: string;
  description: RichTextBlock[];
  overlayStyle: string;
  labels: HeroLabel | null;
  badges: HeroBadge | null;
  primaryCta: HeroCta | null;
  backgroundImageDesktop: StrapiImage[] | StrapiImage | null;
  backgroundImageMobile: StrapiImage[] | StrapiImage | null;
  showNewsCard?: boolean;
  newsCardTitle?: string;
  showAnnouncementCard?: boolean;
  announcementCardTitle?: string;
  hero_news_items?: HeroNewsItem[];
  hero_annoucements_items?: HeroAnnouncementItem;
}

export interface HomePage {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  hero: Hero | Hero[] | null;
  aboutSection?: AboutSection | null;
  Announcement?: AnnouncementSection | null;
}

