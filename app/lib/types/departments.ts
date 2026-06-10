import type { AboutPageBreadcrumbItem, SectionHeader } from './shared';
import type { StrapiImage } from './strapi';

export interface DepartmentPageHero {
  id: number;
  PageTitle?: string | null;
  Breadcrumb?: AboutPageBreadcrumbItem[] | null;
  backgroundImage?: StrapiImage | null;
  backgroundImageAlt?: string | null;
}

export interface DepartmentPoint {
  id: number;
  point?: string | null;
  icon?: StrapiImage | null;
}

export interface DepartmentIntroductionSection {
  id: number;
  sectionheader?: SectionHeader | null;
  paragraph?: string | null;
  points?: DepartmentPoint[] | null;
  videotitle?: string | null;
  url?: string | null;
}

export interface DepartmentServiceCard {
  id: number;
  title?: string | null;
  description?: string | null;
  icon?: StrapiImage | null;
  image?: StrapiImage | null;
  sortorder?: number | null;
}

export interface DepartmentServiceSection {
  id: number;
  sectionheader?: SectionHeader | null;
  servicecards?: DepartmentServiceCard[] | null;
}

export interface DepartmentStaffEmail {
  id: number;
  email?: string | null;
}

export interface DepartmentStaffParagraph {
  id: number;
  paragraph?: string | null;
}

export interface DepartmentStaffCard {
  id: number;
  name?: string | null;
  departmenttitle?: string | null;
  education?: string | null;
  email?: DepartmentStaffEmail[] | null;
  paragraph?: DepartmentStaffParagraph[] | null;
  portrait?: StrapiImage | null;
}

export interface DepartmentResearchStaffSection {
  id: number;
  sectionheader?: SectionHeader | null;
  staff?: DepartmentStaffCard[] | null;
}

export interface DepartmentSingleTypePage {
  id: number;
  documentId?: string;
  departmenttitle?: string | null;
  slug?: string | null;
  locale?: string;
  servicesectionpresent?: boolean | null;
  researchstaffpresent?: boolean | null;
  pagehero?: DepartmentPageHero | null;
  introductionsection?: DepartmentIntroductionSection | null;
  servicesection?: DepartmentServiceSection | null;
  researchstaffsection?: DepartmentResearchStaffSection | null;
}
