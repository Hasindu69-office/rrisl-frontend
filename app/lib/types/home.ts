import type { AboutSection, ErrorMessageContent, HeroCta, RichTextBlock } from './shared';
import type { SectionHeader } from './shared';
import type { StrapiImage } from './strapi';
import type { EstateSubstation } from './estates';

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

export type HomeUpdateSliderItem =
  | {
      id: string;
      kind: 'announcement';
      title: string;
      summary: string;
      publishedAt?: string;
      slug: string;
    }
  | {
      id: string;
      kind: 'article';
      title: string;
      summary: string;
      publishedAt?: string;
      slug: string;
    };

export interface AnnouncementSection {
  id: number;
  showNewsCard?: boolean;
  newsCardTitle?: string;
  showAnnoucementCard?: boolean;
  announcementCardTitle?: string;
  annoucementlabel?: string;
  hero_annoucements_item?: HeroAnnouncementItem | null;
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

export interface HomePageStat {
  id: number;
  percentage: string;
  label: string;
}

export interface IndustrySupportCard {
  id: number;
  title: string;
  description: string;
  sortorder?: number | null;
  url?: string | null;
}

export interface IndustrySupportSection {
  id: number;
  supporttheindustrysection: SectionHeader | null;
  supporttheindustrycard: IndustrySupportCard[] | null;
  outlinetext: string;
  backgroundImage: StrapiImage | null;
  plantimage: StrapiImage | null;
}

export interface HomepageStatisticsSectionItem {
  id: number;
  documentId?: string;
  label: string;
  value: number;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
}

export interface DataInsightsSection {
  id: number;
  statisticslabel: string;
  statisticstitle: string;
  yearlabel: string;
  year: number;
  statisticsrightheader: SectionHeader | null;
  description: string;
  viewdatabutton: HeroCta | null;
  backgroundimage: StrapiImage | null;
}

export interface CurrentResearchSection {
  id: number;
  sectionheader?: SectionHeader | null;
}

export interface HomeResearchNetworkSection {
  id: number;
  sectionheader?: SectionHeader | null;
  backgroundimage?: StrapiImage | null;
}

export interface HomeEventsAndProgramsSection {
  id: number;
  sectionheader?: SectionHeader | null;
  noupcomingeventserrormessage?: ErrorMessageContent | null;
  pasteventsandprogramslabel?: string | null;
  noeventslabel?: string | null;
}

export interface HomeQuickLink {
  id: number;
  title: string;
  icon?: StrapiImage | null;
  url: string;
  sortorder?: number | null;
  openinnewtab: boolean;
}

export interface HomeQuickLinksSection {
  id: number;
  quicklinks?: HomeQuickLink[] | null;
}

export type HomepageResearchNetworkLocationMapmark =
  | 'dartonfield-group'
  | 'kuruwita-substation'
  | 'nivitigalakele-substation'
  | 'monaragala-substation'
  | 'polgahawela-substation';

export interface HomepageResearchNetworkLocation {
  id: number;
  documentId?: string;
  mapmark: HomepageResearchNetworkLocationMapmark;
  estate_substation?: EstateSubstation | null;
}

export interface HomePage {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  hero: Hero | Hero[] | null;
  stats?: HomePageStat[] | null;
  aboutSection?: AboutSection | null;
  industrysupportsection?: IndustrySupportSection | null;
  currentresearchsection?: CurrentResearchSection | null;
  datainsightssection?: DataInsightsSection | null;
  newssectionheader?: SectionHeader | null;
  researchnetworksection?: HomeResearchNetworkSection | null;
  eventsandprogramssection?: HomeEventsAndProgramsSection | null;
  quicklinkssection?: HomeQuickLinksSection | null;
  Announcement?: AnnouncementSection | null;
}
