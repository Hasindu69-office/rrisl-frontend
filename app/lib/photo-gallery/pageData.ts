import type { BreadcrumbItem } from '@/app/components/shared/Breadcrumb';
import type { MediaAlbumSlide } from '@/app/components/media-gallery/MediaAlbumSlider';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';
import type { Album, AlbumImage, PhotoGalleryPage, PhotoGalleryPageHero } from '@/app/lib/types';

export interface PhotoGalleryHeroViewModel {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  backgroundImage: string;
  backgroundImageAlt: string;
}

export interface PhotoGalleryPhotoViewModel {
  id: string;
  src: string;
  alt: string;
  accessibilityLabel: string;
}

export interface PhotoGalleryAlbumViewModel {
  id: string;
  slug: string;
  title: string;
  albumTitle: string;
  description: string;
  coverImage: string;
  imageAlt: string;
  href: string;
  photos: PhotoGalleryPhotoViewModel[];
  labels: {
    home: string;
    photoGallery: string;
    album: string;
    photos: string;
    albumPhotos: string;
  };
}

export interface PhotoGalleryPageViewModel {
  hero: PhotoGalleryHeroViewModel;
  slides: MediaAlbumSlide[];
}

const PHOTO_GALLERY_PAGE_FALLBACK = {
  hero: {
    title: 'Photo Gallery',
    breadcrumbItems: [
      { label: 'Home', href: '/' },
      { label: 'Media Gallery' },
      { label: 'Photo Gallery' },
    ] as BreadcrumbItem[],
    backgroundImage: '/images/aboutus_heroimg.jpg',
    backgroundImageAlt: 'Photo gallery background',
  },
  labels: {
    home: 'Home',
    photoGallery: 'Photo Gallery',
    album: 'Album',
    photos: 'Photos',
    albumPhotos: 'Album Photos',
  },
  album: {
    coverImage: '/images/aboutus_heroimg.jpg',
    imageAlt: 'Photo gallery album image',
  },
};

function resolveImageUrl(image: AlbumImage | null | undefined): string | null {
  return (
    getOptimizedImageUrl(image, 'large') ||
    getOptimizedImageUrl(image, 'medium') ||
    getOptimizedImageUrl(image, 'small') ||
    getStrapiImageUrl(image)
  );
}

function mapBreadcrumbItems(hero: PhotoGalleryPageHero | null | undefined): BreadcrumbItem[] {
  const breadcrumbItems =
    hero?.Breadcrumb
      ?.filter((item) => item?.label)
      .map((item) => ({
        label: item.label,
        ...(item.href ? { href: item.href } : {}),
      })) || [];

  return breadcrumbItems.length > 0
    ? breadcrumbItems
    : PHOTO_GALLERY_PAGE_FALLBACK.hero.breadcrumbItems;
}

export function mapPhotoGalleryHero(
  page: PhotoGalleryPage | null | undefined
): PhotoGalleryHeroViewModel {
  const hero = page?.pagehero;
  const image = hero?.backgroundImage || null;

  return {
    title: hero?.PageTitle || PHOTO_GALLERY_PAGE_FALLBACK.hero.title,
    breadcrumbItems: mapBreadcrumbItems(hero),
    backgroundImage:
      resolveImageUrl(image) || PHOTO_GALLERY_PAGE_FALLBACK.hero.backgroundImage,
    backgroundImageAlt:
      hero?.backgroundImageAlt ||
      image?.alternativeText ||
      PHOTO_GALLERY_PAGE_FALLBACK.hero.backgroundImageAlt,
  };
}

function mapAlbumToSlide(album: Album): MediaAlbumSlide {
  const coverImage = resolveImageUrl(album.featuredimg);

  return {
    id: String(album.id),
    title: album.albumname,
    imageSrc: coverImage || PHOTO_GALLERY_PAGE_FALLBACK.album.coverImage,
    imageAlt:
      album.featuredimg?.alternativeText ||
      PHOTO_GALLERY_PAGE_FALLBACK.album.imageAlt,
    href: `/media-gallery/photo-gallery/albums/${album.slug}`,
  };
}

export function mapPhotoGalleryPageData(
  page: PhotoGalleryPage | null | undefined,
  albums: Album[]
): PhotoGalleryPageViewModel {
  return {
    hero: mapPhotoGalleryHero(page),
    slides: albums.map(mapAlbumToSlide),
  };
}

export function mapPhotoGalleryAlbumData(
  album: Album,
  page: PhotoGalleryPage | null | undefined
): PhotoGalleryAlbumViewModel {
  const coverImage = resolveImageUrl(album.featuredimg);
  const photos = album.images.map((image, index) => {
    const resolvedAlt = image.alternativeText?.trim() || `${album.albumname} photo ${index + 1}`;

    return {
      id: String(image.id || `${album.slug}-${index + 1}`),
      src: resolveImageUrl(image) || PHOTO_GALLERY_PAGE_FALLBACK.album.coverImage,
      alt: resolvedAlt,
      accessibilityLabel: resolvedAlt,
    };
  });

  return {
    id: String(album.id),
    slug: album.slug,
    title: album.albumname,
    albumTitle:
      album.albumtitle?.trim() || 'Moments from the album, arranged as a visual field journal.',
    description: album.albumsummary,
    coverImage: coverImage || PHOTO_GALLERY_PAGE_FALLBACK.album.coverImage,
    imageAlt:
      album.featuredimg?.alternativeText ||
      PHOTO_GALLERY_PAGE_FALLBACK.album.imageAlt,
    href: `/media-gallery/photo-gallery/albums/${album.slug}`,
    photos,
    labels: {
      home:
        page?.pagehero?.Breadcrumb?.[0]?.label ||
        PHOTO_GALLERY_PAGE_FALLBACK.labels.home,
      photoGallery:
        page?.pagehero?.Breadcrumb?.[1]?.label ||
        PHOTO_GALLERY_PAGE_FALLBACK.labels.photoGallery,
      album: page?.albumlabel || PHOTO_GALLERY_PAGE_FALLBACK.labels.album,
      photos: page?.photoslabel || PHOTO_GALLERY_PAGE_FALLBACK.labels.photos,
      albumPhotos:
        page?.albumphotoslabel || PHOTO_GALLERY_PAGE_FALLBACK.labels.albumPhotos,
    },
  };
}

export { PHOTO_GALLERY_PAGE_FALLBACK };
