import type { AboutPageBreadcrumbItem } from './shared';
import type { StrapiImage } from './strapi';

export interface AboutPageHero {
  id: number;
  PageTitle: string;
  backgroundImageAlt?: string | null;
  Breadcrumb?: AboutPageBreadcrumbItem[] | null;
  backgroundImage?: StrapiImage | null;
}

export interface AboutPageFirstContent {
  id: number;
  tag: string;
  title: string;
  hightlightedtext: string;
  description: string;
  outlinetext: string;
}

export interface AboutPageObjectiveSection {
  id: number;
  eyebrow: string;
  title: string;
  alignment?: 'left' | 'center' | 'right';
  hightlightedtext?: string;
}

export interface AboutPageObjective {
  id: number;
  objectivecontent: string;
  objectivenumber: string;
}

export interface AboutPage {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  vissionlabel: string;
  vision: string;
  missionlabel: string;
  mission: string;
  pagehero?: AboutPageHero | null;
  firstcontent?: AboutPageFirstContent | null;
  objectivesection?: AboutPageObjectiveSection | null;
  objectives?: AboutPageObjective[] | null;
  objectivebgimage?: StrapiImage | null;
}
