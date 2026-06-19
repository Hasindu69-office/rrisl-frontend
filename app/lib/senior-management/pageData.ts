import type { BreadcrumbItem } from '@/app/components/shared/Breadcrumb';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';
import type {
  SeniorManagementMember,
  SeniorManagementPage,
  SeniorManagementPageHero,
} from '@/app/lib/types';

export interface SeniorManagementShowcaseItem {
  id: string;
  role: string;
  name: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export interface SeniorManagementHeroViewModel {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  backgroundImage?: string;
  backgroundImageAlt: string;
}

export interface SeniorManagementPageViewModel {
  hero: SeniorManagementHeroViewModel;
  items: SeniorManagementShowcaseItem[];
}

const SENIOR_MANAGEMENT_FALLBACK: SeniorManagementPageViewModel = {
  hero: {
    title: 'Senior Management',
    breadcrumbItems: [
      { label: 'Home', href: '/' },
      { label: 'Senior Management' },
    ],
    backgroundImage: '/images/aboutus_heroimg.jpg',
    backgroundImageAlt: 'Senior management page background',
  },
  items: [],
};

function mapBreadcrumbItems(hero: SeniorManagementPageHero | null | undefined): BreadcrumbItem[] {
  const breadcrumbItems =
    hero?.Breadcrumb
      ?.filter((item) => item?.label)
      .map((item) => ({
        label: item.label,
        ...(item.href ? { href: item.href } : {}),
      })) || [];

  return breadcrumbItems.length > 0
    ? breadcrumbItems
    : SENIOR_MANAGEMENT_FALLBACK.hero.breadcrumbItems;
}

function buildMemberId(member: SeniorManagementMember): string {
  if (member.documentId) {
    return member.documentId;
  }

  return `${member.sortorder}-${member.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

function mapMember(member: SeniorManagementMember): SeniorManagementShowcaseItem {
  return {
    id: buildMemberId(member),
    role: member.position?.trim() || 'Senior Management',
    name: member.name?.trim() || 'Unnamed Senior Manager',
    description: member.description?.trim() || '',
    imageSrc:
      getOptimizedImageUrl(member.image, 'medium') ||
      getOptimizedImageUrl(member.image, 'small') ||
      getStrapiImageUrl(member.image) ||
      '/images/avatarimages.png',
    imageAlt:
      member.imagealt?.trim() ||
      member.image?.alternativeText ||
      member.name?.trim() ||
      'Senior management portrait',
  };
}

function getItems(
  localizedMembers: SeniorManagementMember[],
  fallbackMembers: SeniorManagementMember[]
): SeniorManagementShowcaseItem[] {
  const sourceMembers = localizedMembers.length > 0 ? localizedMembers : fallbackMembers;
  return sourceMembers.map(mapMember);
}

export function mapSeniorManagementPageData(
  localizedPage: SeniorManagementPage | null | undefined,
  fallbackPage: SeniorManagementPage | null | undefined,
  localizedMembers: SeniorManagementMember[],
  fallbackMembers: SeniorManagementMember[]
): SeniorManagementPageViewModel {
  const hero = localizedPage?.pagehero || fallbackPage?.pagehero;
  const image = hero?.backgroundImage || fallbackPage?.pagehero?.backgroundImage || null;

  return {
    hero: {
      title: hero?.PageTitle || SENIOR_MANAGEMENT_FALLBACK.hero.title,
      breadcrumbItems: mapBreadcrumbItems(hero),
      backgroundImage:
        getOptimizedImageUrl(image, 'large') ||
        getOptimizedImageUrl(image, 'medium') ||
        getStrapiImageUrl(image) ||
        SENIOR_MANAGEMENT_FALLBACK.hero.backgroundImage,
      backgroundImageAlt:
        hero?.backgroundImageAlt ||
        image?.alternativeText ||
        SENIOR_MANAGEMENT_FALLBACK.hero.backgroundImageAlt,
    },
    items: getItems(localizedMembers, fallbackMembers),
  };
}
