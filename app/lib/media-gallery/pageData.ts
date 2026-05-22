import type { BreadcrumbItem } from '@/app/components/shared/Breadcrumb';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';
import type { GalleryAlbumCard, GalleryPage, GalleryPageHero } from '@/app/lib/types';

export interface MediaGalleryHeroViewModel {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  backgroundImage?: string;
  backgroundImageAlt: string;
}

export interface MediaGallerySectionViewModel {
  tag: string;
  titlePart1: string;
  titlePart2: string;
  description: string;
}

export interface MediaGalleryCardViewModel {
  id: 'photo-gallery' | 'video-gallery';
  title: string;
  description: string;
  href: string;
  albumLabel: string;
  viewAlbumLabel: string;
  coverImage: string;
  coverAlt: string;
}

export interface MediaGalleryPageViewModel {
  hero: MediaGalleryHeroViewModel;
  section: MediaGallerySectionViewModel;
  cards: MediaGalleryCardViewModel[];
}

const MEDIA_GALLERY_PAGE_FALLBACK: MediaGalleryPageViewModel = {
  hero: {
    title: 'Media Gallery',
    breadcrumbItems: [
      { label: 'Home', href: '/' },
      { label: 'Media Gallery' },
    ],
    backgroundImage: '/images/aboutus_heroimg.jpg',
    backgroundImageAlt: 'Media gallery background',
  },
  section: {
    tag: 'Gallery Collection',
    titlePart1: 'Explore RRISL moments',
    titlePart2: 'through photos and videos.',
    description:
      'Choose a media type to view organized albums from institute programmes, field work, research events, and knowledge sharing activities.',
  },
  cards: [
    {
      id: 'photo-gallery',
      title: 'Photo Gallery',
      description:
        'Browse photo albums from research activities, field visits, outreach programmes, and institutional events.',
      href: '/media-gallery/photo-gallery',
      albumLabel: 'Photo Albums',
      viewAlbumLabel: 'View albums',
      coverImage: '/images/aboutusRubber.jpg',
      coverAlt: 'Photo gallery cover image',
    },
    {
      id: 'video-gallery',
      title: 'Video Gallery',
      description:
        'Watch video albums covering symposium highlights, field extension stories, demonstrations, and stakeholder sessions.',
      href: '/media-gallery/video-gallery',
      albumLabel: 'Video Albums',
      viewAlbumLabel: 'View albums',
      coverImage: '/images/section7_img4.jpg',
      coverAlt: 'Video gallery cover image',
    },
  ],
};

function mapBreadcrumbItems(hero: GalleryPageHero | null | undefined): BreadcrumbItem[] {
  const breadcrumbItems =
    hero?.Breadcrumb
      ?.filter((item) => item?.label)
      .map((item) => ({
        label: item.label,
        ...(item.href ? { href: item.href } : {}),
      })) || [];

  return breadcrumbItems.length > 0
    ? breadcrumbItems
    : MEDIA_GALLERY_PAGE_FALLBACK.hero.breadcrumbItems;
}

function mapHero(
  localizedPage: GalleryPage | null | undefined,
  fallbackPage: GalleryPage | null | undefined
): MediaGalleryHeroViewModel {
  const hero = localizedPage?.pagehero || fallbackPage?.pagehero;
  const image = hero?.backgroundImage || fallbackPage?.pagehero?.backgroundImage || null;

  return {
    title: hero?.PageTitle || MEDIA_GALLERY_PAGE_FALLBACK.hero.title,
    breadcrumbItems: mapBreadcrumbItems(hero),
    backgroundImage:
      getOptimizedImageUrl(image, 'large') ||
      getOptimizedImageUrl(image, 'medium') ||
      getStrapiImageUrl(image) ||
      MEDIA_GALLERY_PAGE_FALLBACK.hero.backgroundImage,
    backgroundImageAlt:
      hero?.backgroundImageAlt ||
      image?.alternativeText ||
      MEDIA_GALLERY_PAGE_FALLBACK.hero.backgroundImageAlt,
  };
}

function mapSection(
  localizedPage: GalleryPage | null | undefined,
  fallbackPage: GalleryPage | null | undefined
): MediaGallerySectionViewModel {
  const page = localizedPage || fallbackPage;
  const sectionHeader = page?.sectionheader;

  return {
    tag: sectionHeader?.eyebrow || MEDIA_GALLERY_PAGE_FALLBACK.section.tag,
    titlePart1: sectionHeader?.title || MEDIA_GALLERY_PAGE_FALLBACK.section.titlePart1,
    titlePart2:
      sectionHeader?.hightlightedtext || MEDIA_GALLERY_PAGE_FALLBACK.section.titlePart2,
    description: page?.description || MEDIA_GALLERY_PAGE_FALLBACK.section.description,
  };
}

function mapCard(
  cardId: 'photo-gallery' | 'video-gallery',
  card: GalleryAlbumCard | null | undefined
): MediaGalleryCardViewModel {
  const fallbackCard = MEDIA_GALLERY_PAGE_FALLBACK.cards.find((item) => item.id === cardId)!;
  const image = card?.albumimg || null;

  return {
    id: cardId,
    title: card?.albumtitle || fallbackCard.title,
    description: card?.albumdescription || fallbackCard.description,
    href: card?.url || fallbackCard.href,
    albumLabel: card?.albumlabel || fallbackCard.albumLabel,
    viewAlbumLabel: card?.viewalbumlabel || fallbackCard.viewAlbumLabel,
    coverImage:
      getOptimizedImageUrl(image, 'large') ||
      getOptimizedImageUrl(image, 'medium') ||
      getStrapiImageUrl(image) ||
      fallbackCard.coverImage,
    coverAlt: image?.alternativeText || fallbackCard.coverAlt,
  };
}

export function mapMediaGalleryPageData(
  localizedPage: GalleryPage | null | undefined,
  fallbackPage: GalleryPage | null | undefined
): MediaGalleryPageViewModel {
  return {
    hero: mapHero(localizedPage, fallbackPage),
    section: mapSection(localizedPage, fallbackPage),
    cards: [
      mapCard(
        'photo-gallery',
        localizedPage?.photogallery || fallbackPage?.photogallery
      ),
      mapCard(
        'video-gallery',
        localizedPage?.videogallery || fallbackPage?.videogallery
      ),
    ],
  };
}

export { MEDIA_GALLERY_PAGE_FALLBACK };
