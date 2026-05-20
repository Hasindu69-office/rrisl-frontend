import type { AboutPageBreadcrumbItem, ErrorMessageContent } from './shared';
import type { StrapiImage, StrapiMedia } from './strapi';

export type VacancyState = 'open' | 'closed' | 'archived';

export interface VacancyPageHero {
  id: number;
  PageTitle: string;
  backgroundImageAlt?: string | null;
  Breadcrumb?: AboutPageBreadcrumbItem[] | null;
  backgroundImage?: StrapiImage | null;
}

export interface VacancyPage {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
  pagehero?: VacancyPageHero | null;
  emptystate?: ErrorMessageContent | null;
  searchbuttonlabel?: string | null;
  searchcategorylabel?: string | null;
  jobdetailslabel?: string | null;
  applyjoblabel?: string | null;
  overviewtitle?: string | null;
  descriptiontitle?: string | null;
  responsibilitiestitle?: string | null;
  skillstitle?: string | null;
  downloadnoticetitle?: string | null;
  downloadbuttonlabel?: string | null;
  applyformtitle?: string | null;
  fullnamelabel?: string | null;
  emaillabel?: string | null;
  contactnumberlabel?: string | null;
  cvlabel?: string | null;
  submitlabel?: string | null;
  jobtitlelabel?: string | null;
  jobtypelabel?: string | null;
  categorylabel?: string | null;
  experiencelabel?: string | null;
  degreelabel?: string | null;
  offeredsalarylabel?: string | null;
  locationlabel?: string | null;
}

export interface Department {
  id: number;
  documentId?: string;
  departmentname: string;
  sortorder?: number | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
}

export interface VacancyListBlock {
  id?: number;
  text: string;
}

export interface Vacancy {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  department: Department | null;
  employmenttype: string;
  salaryrange?: string | null;
  location?: string | null;
  overviewlocation?: string | null;
  experience?: string | null;
  degree?: string | null;
  description: string;
  responsibilityblocks?: VacancyListBlock[] | null;
  skillsblocks?: VacancyListBlock[] | null;
  closingdate: string;
  openingdate: string;
  state: VacancyState;
  noticedocument: StrapiMedia | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
}
