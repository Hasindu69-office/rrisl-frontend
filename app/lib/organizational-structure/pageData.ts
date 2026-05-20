import type { BreadcrumbItem } from '@/app/components/shared/Breadcrumb';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';
import type {
  OrganizationStructurePage,
  OrganizationStructurePageHero,
} from '@/app/lib/types';

export interface OrganizationalStructureHeroViewModel {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  backgroundImage?: string;
  backgroundImageAlt: string;
}

export interface OrganizationalStructureChartViewModel {
  chartUrl: string;
  chartAlt: string;
  fallbackUrl: string;
}

export interface OrganizationalStructurePageViewModel {
  hero: OrganizationalStructureHeroViewModel;
  chart: OrganizationalStructureChartViewModel;
}

const ORGANIZATIONAL_STRUCTURE_FALLBACK: OrganizationalStructurePageViewModel = {
  hero: {
    title: 'Organizational Structure',
    breadcrumbItems: [
      { label: 'Home', href: '/' },
      { label: 'Organizational Structure' },
    ],
    backgroundImage: '/images/aboutus_heroimg.jpg',
    backgroundImageAlt: 'Organizational Structure background',
  },
  chart: {
    chartUrl: '/images/OrganizationalStructure2.svg',
    chartAlt: 'RRISL organizational structure chart',
    fallbackUrl: '/images/OrganizationalStructure2.svg',
  },
};

function mapBreadcrumbItems(
  hero: OrganizationStructurePageHero | null | undefined
): BreadcrumbItem[] {
  const breadcrumbItems =
    hero?.Breadcrumb
      ?.filter((item) => item?.label)
      .map((item) => ({
        label: item.label,
        ...(item.href ? { href: item.href } : {}),
      })) || [];

  return breadcrumbItems.length > 0
    ? breadcrumbItems
    : ORGANIZATIONAL_STRUCTURE_FALLBACK.hero.breadcrumbItems;
}

export function mapOrganizationalStructurePageData(
  localizedPage: OrganizationStructurePage | null | undefined,
  fallbackPage: OrganizationStructurePage | null | undefined
): OrganizationalStructurePageViewModel {
  const hero = localizedPage?.pagehero || fallbackPage?.pagehero;
  const heroImage =
    hero?.backgroundImage || fallbackPage?.pagehero?.backgroundImage || null;
  const chartImage =
    localizedPage?.organizationstructureimg ||
    fallbackPage?.organizationstructureimg ||
    null;

  return {
    hero: {
      title: hero?.PageTitle || ORGANIZATIONAL_STRUCTURE_FALLBACK.hero.title,
      breadcrumbItems: mapBreadcrumbItems(hero),
      backgroundImage:
        getOptimizedImageUrl(heroImage, 'large') ||
        getOptimizedImageUrl(heroImage, 'medium') ||
        getStrapiImageUrl(heroImage) ||
        ORGANIZATIONAL_STRUCTURE_FALLBACK.hero.backgroundImage,
      backgroundImageAlt:
        hero?.backgroundImageAlt ||
        heroImage?.alternativeText ||
        ORGANIZATIONAL_STRUCTURE_FALLBACK.hero.backgroundImageAlt,
    },
    chart: {
      chartUrl:
        getOptimizedImageUrl(chartImage, 'large') ||
        getOptimizedImageUrl(chartImage, 'medium') ||
        getStrapiImageUrl(chartImage) ||
        ORGANIZATIONAL_STRUCTURE_FALLBACK.chart.chartUrl,
      chartAlt:
        chartImage?.alternativeText ||
        ORGANIZATIONAL_STRUCTURE_FALLBACK.chart.chartAlt,
      fallbackUrl: ORGANIZATIONAL_STRUCTURE_FALLBACK.chart.fallbackUrl,
    },
  };
}

export { ORGANIZATIONAL_STRUCTURE_FALLBACK };
