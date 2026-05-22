import type { BreadcrumbItem } from '@/app/components/shared/Breadcrumb';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';
import type { ResearchManager, ResearchManagersPage, SectionHeader } from '@/app/lib/types';

export interface ResearchManagersHeroViewModel {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  backgroundImage?: string;
  backgroundImageAlt: string;
}

export interface ResearchManagersLabelsViewModel {
  leadershipProfileLabel: string;
  viewFullProfileButtonLabel: string;
  primaryContactLabel: string;
  directLineLabel: string;
  researchManagementLabel: string;
  profileOverviewLabel: string;
  emptyStateTitle: string;
  emptyStateDescription: string;
}

export interface ResearchManagersSectionViewModel {
  eyebrow: string;
  title: {
    part1: string;
    part2: string;
    align: 'left' | 'center' | 'right';
  };
  description: string;
}

export interface ResearchManagerProfileViewModel {
  id: string;
  name: string;
  role: string;
  credentials: string;
  imageSrc: string;
  imageAlt: string;
  primaryEmail?: string;
  emails: string[];
  phone: string;
  profileSummary: string;
  biography: string[];
  profilePoints: string[];
}

export interface ResearchManagersPageViewModel {
  hero: ResearchManagersHeroViewModel;
  section: ResearchManagersSectionViewModel;
  labels: ResearchManagersLabelsViewModel;
  profiles: ResearchManagerProfileViewModel[];
}

const RESEARCH_MANAGERS_FALLBACK: ResearchManagersPageViewModel = {
  hero: {
    title: 'Research managers',
    breadcrumbItems: [
      { label: 'Home', href: '/' },
      { label: 'Research managers' },
    ],
    backgroundImage: '/images/aboutus_heroimg.jpg',
    backgroundImageAlt: 'Research managers background',
  },
  section: {
    eyebrow: 'Research Leadership',
    title: {
      part1: 'Profiles shaping',
      part2: ' RRISL research direction',
      align: 'left',
    },
    description:
      "Explore the institute's research management team through a cleaner, more readable profile format. Each card surfaces the essentials first, with the full profile available on demand.",
  },
  labels: {
    leadershipProfileLabel: 'Leadership Profile',
    viewFullProfileButtonLabel: 'View Full Profile',
    primaryContactLabel: 'Primary Contact',
    directLineLabel: 'Direct Line',
    researchManagementLabel: 'Research Management',
    profileOverviewLabel: 'Profile Overview',
    emptyStateTitle: 'No research managers available right now.',
    emptyStateDescription: 'Please check back later for updated leadership profiles.',
  },
  profiles: [],
};

function mapBreadcrumbItems(
  page: ResearchManagersPage | null | undefined
): BreadcrumbItem[] {
  const breadcrumbItems =
    page?.pagehero?.Breadcrumb
      ?.filter((item) => item?.label)
      .map((item) => ({
        label: item.label,
        ...(item.href ? { href: item.href } : {}),
      })) || [];

  return breadcrumbItems.length > 0
    ? breadcrumbItems
    : RESEARCH_MANAGERS_FALLBACK.hero.breadcrumbItems;
}

function mapSectionTitle(
  header: SectionHeader | null | undefined
): ResearchManagersSectionViewModel['title'] {
  const fallbackTitle = RESEARCH_MANAGERS_FALLBACK.section.title;

  return {
    part1: header?.title?.trim() || fallbackTitle.part1,
    part2: header?.hightlightedtext?.trim() || fallbackTitle.part2,
    align:
      header?.alignment === 'center' || header?.alignment === 'right'
        ? header.alignment
        : fallbackTitle.align,
  };
}

function splitTextIntoParagraphs(text: string | null | undefined): string[] {
  const normalizedText = text?.trim() || '';

  if (!normalizedText) {
    return [];
  }

  return normalizedText
    .split(/\s*\|\s*|\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function normalizeEmails(manager: ResearchManager): string[] {
  return (manager.email || [])
    .map((item) => item?.email?.trim() || '')
    .filter(Boolean);
}

function mapProfilePoints(manager: ResearchManager): string[] {
  return (manager.profilepoints || [])
    .map((item) => item?.text?.trim() || '')
    .filter(Boolean);
}

function mapManager(manager: ResearchManager): ResearchManagerProfileViewModel {
  const emails = normalizeEmails(manager);

  return {
    id:
      manager.documentId ||
      `${manager.sortorder}-${manager.fullname.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name: manager.fullname?.trim() || 'Unnamed Research Manager',
    role: manager.role?.trim() || 'Research Manager',
    credentials: manager.credentials?.trim() || '',
    imageSrc:
      getOptimizedImageUrl(manager.image, 'medium') ||
      getOptimizedImageUrl(manager.image, 'small') ||
      getStrapiImageUrl(manager.image) ||
      '/images/avatarimages.png',
    imageAlt:
      manager.imagealt?.trim() ||
      manager.image?.alternativeText ||
      manager.fullname?.trim() ||
      'Research manager portrait',
    primaryEmail: emails[0],
    emails,
    phone: manager.phonenumber?.trim() || '',
    profileSummary: manager.profilesummary?.trim() || '',
    biography: splitTextIntoParagraphs(manager.biography),
    profilePoints: mapProfilePoints(manager),
  };
}

function getProfiles(
  localizedManagers: ResearchManager[],
  fallbackManagers: ResearchManager[]
): ResearchManagerProfileViewModel[] {
  const sourceManagers = localizedManagers.length > 0 ? localizedManagers : fallbackManagers;
  return sourceManagers.map(mapManager);
}

export function mapResearchManagersPageData(
  localizedPage: ResearchManagersPage | null | undefined,
  fallbackPage: ResearchManagersPage | null | undefined,
  localizedManagers: ResearchManager[],
  fallbackManagers: ResearchManager[]
): ResearchManagersPageViewModel {
  const hero = localizedPage?.pagehero || fallbackPage?.pagehero;
  const image = hero?.backgroundImage || fallbackPage?.pagehero?.backgroundImage || null;
  const header =
    localizedPage?.researchleadershipdetails || fallbackPage?.researchleadershipdetails;

  return {
    hero: {
      title: hero?.PageTitle || RESEARCH_MANAGERS_FALLBACK.hero.title,
      breadcrumbItems: mapBreadcrumbItems(localizedPage || fallbackPage),
      backgroundImage:
        getOptimizedImageUrl(image, 'large') ||
        getOptimizedImageUrl(image, 'medium') ||
        getStrapiImageUrl(image) ||
        RESEARCH_MANAGERS_FALLBACK.hero.backgroundImage,
      backgroundImageAlt:
        hero?.backgroundImageAlt ||
        image?.alternativeText ||
        RESEARCH_MANAGERS_FALLBACK.hero.backgroundImageAlt,
    },
    section: {
      eyebrow:
        header?.eyebrow?.trim() || RESEARCH_MANAGERS_FALLBACK.section.eyebrow,
      title: mapSectionTitle(header),
      description:
        localizedPage?.description?.trim() ||
        fallbackPage?.description?.trim() ||
        RESEARCH_MANAGERS_FALLBACK.section.description,
    },
    labels: {
      leadershipProfileLabel:
        localizedPage?.leadershipprofilelabel?.trim() ||
        fallbackPage?.leadershipprofilelabel?.trim() ||
        RESEARCH_MANAGERS_FALLBACK.labels.leadershipProfileLabel,
      viewFullProfileButtonLabel:
        localizedPage?.viewfullprofilebuttonlabel?.trim() ||
        fallbackPage?.viewfullprofilebuttonlabel?.trim() ||
        RESEARCH_MANAGERS_FALLBACK.labels.viewFullProfileButtonLabel,
      primaryContactLabel:
        localizedPage?.primarycontactlabel?.trim() ||
        fallbackPage?.primarycontactlabel?.trim() ||
        RESEARCH_MANAGERS_FALLBACK.labels.primaryContactLabel,
      directLineLabel:
        localizedPage?.directlinelabel?.trim() ||
        fallbackPage?.directlinelabel?.trim() ||
        RESEARCH_MANAGERS_FALLBACK.labels.directLineLabel,
      researchManagementLabel:
        localizedPage?.researchmanagementlabel?.trim() ||
        fallbackPage?.researchmanagementlabel?.trim() ||
        RESEARCH_MANAGERS_FALLBACK.labels.researchManagementLabel,
      profileOverviewLabel:
        localizedPage?.profileoverviewlabel?.trim() ||
        fallbackPage?.profileoverviewlabel?.trim() ||
        RESEARCH_MANAGERS_FALLBACK.labels.profileOverviewLabel,
      emptyStateTitle: RESEARCH_MANAGERS_FALLBACK.labels.emptyStateTitle,
      emptyStateDescription: RESEARCH_MANAGERS_FALLBACK.labels.emptyStateDescription,
    },
    profiles: getProfiles(localizedManagers, fallbackManagers),
  };
}
