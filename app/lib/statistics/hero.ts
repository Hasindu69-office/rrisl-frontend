import type { StatisticsHeroContent, StatisticsPage } from '@/app/lib/types';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi/media';

const STATISTICS_HERO_FALLBACK: StatisticsHeroContent = {
  title: 'Production Statistics',
  breadcrumbItems: [
    { label: 'Home', href: '/' },
    { label: 'Production Statistics' },
  ],
  backgroundImage: '/images/aboutus_heroimg.jpg',
  backgroundImageAlt: 'Production statistics background',
};

function mapBreadcrumbItems(
  page: StatisticsPage | null | undefined,
): StatisticsHeroContent['breadcrumbItems'] {
  const breadcrumbItems =
    page?.pagehero?.Breadcrumb
      ?.filter((item) => item?.label)
      .map((item) => ({
        label: item.label,
        ...(item.href ? { href: item.href } : {}),
      })) || [];

  return breadcrumbItems.length > 0
    ? breadcrumbItems
    : STATISTICS_HERO_FALLBACK.breadcrumbItems;
}

export function mapStatisticsHero(
  localizedPage: StatisticsPage | null | undefined,
  fallbackPage?: StatisticsPage | null,
): StatisticsHeroContent {
  const hero = localizedPage?.pagehero || fallbackPage?.pagehero;
  const image = hero?.backgroundImage || fallbackPage?.pagehero?.backgroundImage || null;

  return {
    title: hero?.PageTitle || STATISTICS_HERO_FALLBACK.title,
    breadcrumbItems: mapBreadcrumbItems(localizedPage || fallbackPage),
    backgroundImage:
      getOptimizedImageUrl(image, 'large') ||
      getOptimizedImageUrl(image, 'medium') ||
      getStrapiImageUrl(image) ||
      STATISTICS_HERO_FALLBACK.backgroundImage,
    backgroundImageAlt:
      hero?.backgroundImageAlt ||
      image?.alternativeText ||
      STATISTICS_HERO_FALLBACK.backgroundImageAlt,
  };
}

export { STATISTICS_HERO_FALLBACK };
