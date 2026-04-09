import type { AboutPage, AboutPageHero } from '@/app/lib/types';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';
import type { BreadcrumbItem } from '@/app/components/shared/Breadcrumb';

export interface AboutHeroViewModel {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  backgroundImage?: string;
  backgroundImageAlt: string;
}

const ABOUT_HERO_FALLBACK: AboutHeroViewModel = {
  title: 'About us',
  breadcrumbItems: [
    { label: 'Home', href: '/' },
    { label: 'About us' },
  ],
  backgroundImage: '/images/aboutus_heroimg.jpg',
  backgroundImageAlt: 'About Us background',
};

function mapBreadcrumbItems(hero: AboutPageHero | null | undefined): BreadcrumbItem[] {
  const breadcrumbItems =
    hero?.Breadcrumb
      ?.filter((item) => item?.label)
      .map((item) => ({
        label: item.label,
        ...(item.href ? { href: item.href } : {}),
      })) || [];

  return breadcrumbItems.length > 0
    ? breadcrumbItems
    : ABOUT_HERO_FALLBACK.breadcrumbItems;
}

export function mapAboutHero(
  localizedPage: AboutPage | null | undefined,
  fallbackPage?: AboutPage | null
): AboutHeroViewModel {
  const hero = localizedPage?.pagehero || fallbackPage?.pagehero;
  const image = hero?.backgroundImage || fallbackPage?.pagehero?.backgroundImage || null;

  return {
    title: hero?.PageTitle || ABOUT_HERO_FALLBACK.title,
    breadcrumbItems: mapBreadcrumbItems(hero),
    backgroundImage:
      getOptimizedImageUrl(image, 'large') ||
      getOptimizedImageUrl(image, 'medium') ||
      getStrapiImageUrl(image) ||
      ABOUT_HERO_FALLBACK.backgroundImage,
    backgroundImageAlt:
      hero?.backgroundImageAlt ||
      image?.alternativeText ||
      ABOUT_HERO_FALLBACK.backgroundImageAlt,
  };
}
