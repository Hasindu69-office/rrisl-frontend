import type { AboutPageBreadcrumbItem, SectionHeader } from './shared';
import type { StrapiImage } from './strapi';

export interface RubberPricePageHero {
  id: number;
  PageTitle: string;
  backgroundImageAlt?: string | null;
  Breadcrumb?: AboutPageBreadcrumbItem[] | null;
  backgroundImage?: StrapiImage | null;
}

export interface RubberPricePage {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
  description?: string | null;
  latestupdatelabel?: string | null;
  archivedyearslabel?: string | null;
  recentupdatelabel?: string | null;
  recentauctiondatelabel?: string | null;
  weeklyuploadslabel?: string | null;
  latestweeklyuploadlabel?: string | null;
  auctionpricelabel?: string | null;
  dateofauctionlabel?: string | null;
  openfullsheetbuttonlabel?: string | null;
  archiveddescription?: string | null;
  activearchivedlabel?: string | null;
  archivedyearlabel?: string | null;
  uploadslabel?: string | null;
  availabledateslabel?: string | null;
  newestdatashownlabel?: string | null;
  archivelabel?: string | null;
  inthisarchiveyearlabel?: string | null;
  previouslbuttonlabel?: string | null;
  nextbuttonlabel?: string | null;
  quickswitchlabel?: string | null;
  pagehero?: RubberPricePageHero | null;
  sectionheader?: SectionHeader | null;
  archivedbrowsertitle?: SectionHeader | null;
}

export interface RubberAuctionPrice {
  id: number;
  documentId?: string;
  date: string;
  price: StrapiImage | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface RubberPriceEntry {
  id: string;
  date: string;
  imageSrc: string;
  imageAlt: string;
  status: 'latest' | 'recent' | 'archive';
  archiveYear: string;
}

export interface RubberPricesHeroViewModel {
  title: string;
  breadcrumbItems: Array<{
    label: string;
    href?: string;
  }>;
  backgroundImage?: string;
  backgroundImageAlt: string;
}

export interface RubberPricesSectionContent {
  sectionTag: string;
  sectionTitlePart1: string;
  sectionTitlePart2: string;
  sectionDescription: string;
  latestUpdateLabel: string;
  archivedYearsLabel: string;
  recentUpdatesLabel: string;
  recentAuctionDateLabel: string;
  weeklyUploadsLabel: string;
  latestWeeklyUploadLabel: string;
  recentWeeklyUploadLabel: string;
  archiveEntryLabel: string;
  auctionPriceLabel: string;
  dateOfAuctionLabel: string;
  openFullSheetButtonLabel: string;
  archiveTag: string;
  archiveTitlePart1: string;
  archiveTitlePart2: string;
  archiveDescription: string;
  activeArchiveLabel: string;
  archiveYearLabel: string;
  uploadsLabel: string;
  availableDatesLabel: string;
  newestDataShownLabel: string;
  tapWeeklyDateLabel: string;
  quickSwitchLabel: string;
  inThisArchiveYearLabel: string;
  previousButtonLabel: string;
  nextButtonLabel: string;
  closeArchiveViewerLabel: string;
  archiveSuffixLabel: string;
  emptyStateTag: string;
  emptyStateTitlePart1: string;
  emptyStateTitlePart2: string;
  emptyStateDescription: string;
}

export interface RubberPricePageViewModel {
  hero: RubberPricesHeroViewModel;
  content: RubberPricesSectionContent;
  entries: RubberPriceEntry[];
  latestEntry: RubberPriceEntry | null;
  recentEntries: RubberPriceEntry[];
  archiveYears: string[];
  entriesByYear: Record<string, RubberPriceEntry[]>;
}
