import type { BreadcrumbItem } from '@/app/components/shared/Breadcrumb';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';
import type { DownloadPage, DownloadPageHero } from '@/app/lib/types';

export interface DownloadHeroViewModel {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  backgroundImage?: string;
  backgroundImageAlt: string;
}

const DOWNLOAD_HERO_FALLBACK: DownloadHeroViewModel = {
  title: 'Downloads',
  breadcrumbItems: [
    { label: 'Home', href: '/' },
    { label: 'Downloads' },
  ],
  backgroundImage: '/images/aboutus_heroimg.jpg',
  backgroundImageAlt: 'Downloads background',
};

function mapBreadcrumbItems(hero: DownloadPageHero | null | undefined): BreadcrumbItem[] {
  const breadcrumbItems =
    hero?.Breadcrumb
      ?.filter((item) => item?.label)
      .map((item) => ({
        label: item.label,
        ...(item.href ? { href: item.href } : {}),
      })) || [];

  return breadcrumbItems.length > 0 ? breadcrumbItems : DOWNLOAD_HERO_FALLBACK.breadcrumbItems;
}

export function mapDownloadHero(
  localizedPage: DownloadPage | null | undefined,
  fallbackPage?: DownloadPage | null
): DownloadHeroViewModel {
  const hero = localizedPage?.pagehero || fallbackPage?.pagehero;
  const image = hero?.backgroundImage || fallbackPage?.pagehero?.backgroundImage || null;

  return {
    title: hero?.PageTitle || DOWNLOAD_HERO_FALLBACK.title,
    breadcrumbItems: mapBreadcrumbItems(hero),
    backgroundImage:
      getOptimizedImageUrl(image, 'large') ||
      getOptimizedImageUrl(image, 'medium') ||
      getStrapiImageUrl(image) ||
      DOWNLOAD_HERO_FALLBACK.backgroundImage,
    backgroundImageAlt:
      hero?.backgroundImageAlt || image?.alternativeText || DOWNLOAD_HERO_FALLBACK.backgroundImageAlt,
  };
}
