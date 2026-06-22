import type { StrapiImage } from './strapi';

export interface RichTextBlock {
  type: string;
  children: Array<{
    text: string;
    type: string;
  }>;
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

export interface AboutPageBreadcrumbItem {
  id: number;
  label: string;
  href?: string | null;
}

export interface AboutSection {
  id: number;
  body: RichTextBlock[];
  header: SectionHeader | null;
  primaryCta: HeroCta | null;
  annoucementlabel?: string;
  imageTop: StrapiImage | null;
  imageBottom: StrapiImage | null;
}

export interface ErrorMessageContent {
  id: number;
  title?: string;
  description?: string;
  Title?: string;
  Description?: string;
}
