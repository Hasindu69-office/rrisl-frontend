import type { BidNoticePage, BidNoticePageHero } from '@/app/lib/types';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';
import type { BreadcrumbItem } from '@/app/components/shared/Breadcrumb';

export interface BidNoticeHeroViewModel {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  backgroundImage?: string;
  backgroundImageAlt: string;
}

const BID_NOTICE_HERO_FALLBACK: BidNoticeHeroViewModel = {
  title: 'Bid Notice',
  breadcrumbItems: [
    { label: 'Home', href: '/' },
    { label: 'Bid Notice' },
  ],
  backgroundImage: '/images/aboutus_heroimg.jpg',
  backgroundImageAlt: 'Bid Notice background',
};

function mapBreadcrumbItems(hero: BidNoticePageHero | null | undefined): BreadcrumbItem[] {
  const breadcrumbItems =
    hero?.Breadcrumb
      ?.filter((item) => item?.label)
      .map((item) => ({
        label: item.label,
        ...(item.href ? { href: item.href } : {}),
      })) || [];

  return breadcrumbItems.length > 0
    ? breadcrumbItems
    : BID_NOTICE_HERO_FALLBACK.breadcrumbItems;
}

export function mapBidNoticeHero(
  localizedPage: BidNoticePage | null | undefined,
  fallbackPage?: BidNoticePage | null
): BidNoticeHeroViewModel {
  const hero = localizedPage?.pagehero || fallbackPage?.pagehero;
  const image = hero?.backgroundImage || fallbackPage?.pagehero?.backgroundImage || null;

  return {
    title: hero?.PageTitle || BID_NOTICE_HERO_FALLBACK.title,
    breadcrumbItems: mapBreadcrumbItems(hero),
    backgroundImage:
      getOptimizedImageUrl(image, 'large') ||
      getOptimizedImageUrl(image, 'medium') ||
      getStrapiImageUrl(image) ||
      BID_NOTICE_HERO_FALLBACK.backgroundImage,
    backgroundImageAlt:
      hero?.backgroundImageAlt ||
      image?.alternativeText ||
      BID_NOTICE_HERO_FALLBACK.backgroundImageAlt,
  };
}
