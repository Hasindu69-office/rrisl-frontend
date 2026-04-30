import type { AboutPageBreadcrumbItem, ErrorMessageContent } from './shared';
import type { StrapiImage } from './strapi';

export interface ManagementBoardPageHero {
  id: number;
  PageTitle: string;
  backgroundImageAlt?: string | null;
  Breadcrumb?: AboutPageBreadcrumbItem[] | null;
  backgroundImage?: StrapiImage | null;
}

export interface HighlightedTitle {
  id: number;
  Title: string;
  HighlightedText: string;
}

export interface ManagementBoardPage {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  pagehero?: ManagementBoardPageHero | null;
  LabelMemberBoard?: HighlightedTitle | null;
  LabelInAttendance?: HighlightedTitle | null;
  ErrorMessage?: ErrorMessageContent | null;
}

export interface BoardMemberOrganizationLine {
  id: number;
  Text?: string | null;
}

export interface BoardMember {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  FullName: string;
  slug?: string | null;
  Position: string;
  ProfileImage?: StrapiImage | null;
  ImageAlt?: string | null;
  MemberType: 'Member Board' | 'In Attendance';
  DisplayOrder?: number | null;
  IsActive: boolean;
  OrganizationLines?: BoardMemberOrganizationLine[] | null;
}
