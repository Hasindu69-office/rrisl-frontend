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
  closingparagraph?: string | null;
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

export interface DepartmentServiceDetail {
  id: number;
  label?: string | null;
  value?: string | null;
  sortorder?: number | null;
}

export interface DepartmentStructuredServiceItem {
  id: number;
  servicekey?: string | null;
  title?: string | null;
  description?: string | null;
  images?: StrapiImage[] | null;
  details?: DepartmentServiceDetail[] | null;
  sortorder?: number | null;
}

export interface DepartmentServiceGroup {
  id: number;
  servicekey?: string | null;
  title?: string | null;
  description?: string | null;
  images?: StrapiImage[] | null;
  items?: DepartmentStructuredServiceItem[] | null;
  sortorder?: number | null;
}

export interface DepartmentServiceSection {
  id: number;
  sectionheader?: SectionHeader | null;
  servicecards?: DepartmentServiceCard[] | null;
  servicegroups?: DepartmentServiceGroup[] | null;
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

export interface DepartmentTechnicalStaffMember {
  id: number;
  name?: string | null;
  qualifications?: string | null;
}

export interface DepartmentTechnicalStaffGroup {
  id: number;
  title?: string | null;
  members?: DepartmentTechnicalStaffMember[] | null;
}

export interface DepartmentResearchStaffSection {
  id: number;
  sectionheader?: SectionHeader | null;
  staff?: DepartmentStaffCard[] | null;
  technicalstaffgroups?: DepartmentTechnicalStaffGroup[] | null;
}

export interface DepartmentResearchHighlightCard {
  id: number;
  title?: string | null;
  description?: string | null;
  researchteam?: string | null;
  image?: StrapiImage | null;
  sortorder?: number | null;
}

export interface DepartmentResearchHighlightsSection {
  id: number;
  verticaltext?: string | null;
  researchhighlightcards?: DepartmentResearchHighlightCard[] | null;
}

export interface DepartmentCurrentResearchProjectCard {
  id: number;
  title?: string | null;
  description?: string | null;
  researchteam?: string | null;
  image?: StrapiImage | null;
  galleryimages?: StrapiImage[] | null;
  sortorder?: number | null;
  includeinhomepage?: boolean | null;
}

export interface DepartmentCurrentResearchProjectSection {
  id: number;
  sectionheader?: SectionHeader | null;
  researchprojects?: DepartmentCurrentResearchProjectCard[] | null;
}

export interface DepartmentPublicationCard {
  id: number;
  title?: string | null;
  points?: DepartmentStaffParagraph[] | null;
  sortorder?: number | null;
}

export interface DepartmentPublicationsSection {
  id: number;
  sectiontitle?: string | null;
  rightimage?: StrapiImage | null;
  publications?: DepartmentPublicationCard[] | null;
}

export interface DepartmentAchievementSection {
  id: number;
  sectiontitle?: string | null;
  rightimage?: StrapiImage | null;
  categories?: DepartmentPublicationCard[] | null;
}

export interface DepartmentRecommendationItem {
  id: number;
  title?: string | null;
  description?: string | null;
  sortorder?: number | null;
}

export interface DepartmentRecommendationGroup {
  id: number;
  title?: string | null;
  items?: DepartmentRecommendationItem[] | null;
  sortorder?: number | null;
}

export interface DepartmentRecommendationSection {
  id: number;
  sectionheader?: SectionHeader | null;
  recommendationgroups?: DepartmentRecommendationGroup[] | null;
}

export interface DepartmentSingleTypePage {
  id: number;
  documentId?: string;
  departmenttitle?: string | null;
  slug?: string | null;
  locale?: string;
  servicesectionpresent?: boolean | null;
  researchstaffpresent?: boolean | null;
  researchhighlightspresent?: boolean | null;
  currentprojectpresent?: boolean | null;
  publicationspresent?: boolean | null;
  achievementspresent?: boolean | null;
  recommendationsectionpresent?: boolean | null;
  pagehero?: DepartmentPageHero | null;
  introductionsection?: DepartmentIntroductionSection | null;
  servicesection?: DepartmentServiceSection | null;
  researchstaffsection?: DepartmentResearchStaffSection | null;
  researchhighlightssection?: DepartmentResearchHighlightsSection | null;
  currentresearchprojectsection?: DepartmentCurrentResearchProjectSection | null;
  publicationssection?: DepartmentPublicationsSection | null;
  achievementssection?: DepartmentAchievementSection | null;
  recommendationsection?: DepartmentRecommendationSection | null;
}
