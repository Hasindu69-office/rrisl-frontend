import type { AboutPageBreadcrumbItem, SectionHeader } from './shared';
import type { StrapiImage } from './strapi';

export interface ServicesPageHero {
  id: number;
  PageTitle: string;
  backgroundImageAlt?: string | null;
  Breadcrumb?: AboutPageBreadcrumbItem[] | null;
  backgroundImage?: StrapiImage | null;
}

export interface ServiceHighlight {
  id: number;
  title: string;
  description: string;
  icon?: StrapiImage | null;
}

export interface ServicesPage {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
  pagehero?: ServicesPageHero | null;
  sectionheader?: SectionHeader | null;
  description?: string | null;
  samplesubmissionpopupImage?: StrapiImage | null;
  servicehighlights?: ServiceHighlight[] | null;
  testingservicesheader?: SectionHeader | null;
  testingdescription?: string | null;
  numberlabel?: string | null;
  nameofthetestlabel?: string | null;
  ctatitle?: string | null;
  ctadescription?: string | null;
  ctabuttonlabel?: string | null;
  ctaurl?: string | null;
}

export interface TestingService {
  id: number;
  documentId?: string;
  servicename: string;
  sortorder: number;
  locale?: string;
}

export interface TestingServiceCategory {
  id: number;
  documentId?: string;
  categoryname: string;
  sortorder: number;
  locale?: string;
  testing_services?: TestingService[] | null;
}
