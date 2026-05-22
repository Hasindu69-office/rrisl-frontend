import type { BreadcrumbItem } from '@/app/components/shared/Breadcrumb';
import type { MediaAlbumSlide } from '@/app/components/media-gallery/MediaAlbumSlider';
import {
  getOptimizedImageUrl,
  getStrapiImageUrl,
  getStrapiMediaUrl,
} from '@/app/lib/strapi';
import type {
  VideoAlbum,
  VideoAlbumImage,
  VideoGalleryPage,
  VideoGalleryPageHero,
  VideoItem,
} from '@/app/lib/types';

export interface VideoGalleryHeroViewModel {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  backgroundImage: string;
  backgroundImageAlt: string;
}

export interface VideoGalleryItemViewModel {
  id: string;
  title: string;
  description?: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  sourceType: 'youtube' | 'local';
  src: string;
  duration?: string;
}

export interface VideoGalleryAlbumViewModel {
  id: string;
  slug: string;
  title: string;
  albumTitle: string;
  description: string;
  coverImage: string;
  imageAlt: string;
  href: string;
  videos: VideoGalleryItemViewModel[];
  labels: {
    home: string;
    videoGallery: string;
    album: string;
    videos: string;
    albumVideos: string;
  };
}

export interface VideoGalleryPageViewModel {
  hero: VideoGalleryHeroViewModel;
  slides: MediaAlbumSlide[];
}

const VIDEO_GALLERY_PAGE_FALLBACK = {
  hero: {
    title: 'Video Gallery',
    breadcrumbItems: [
      { label: 'Home', href: '/' },
      { label: 'Media Gallery' },
      { label: 'Video Gallery' },
    ] as BreadcrumbItem[],
    backgroundImage: '/images/aboutus_heroimg.jpg',
    backgroundImageAlt: 'Video gallery background',
  },
  labels: {
    home: 'Home',
    videoGallery: 'Video Gallery',
    album: 'Album',
    videos: 'Videos',
    albumVideos: 'Album Videos',
  },
  album: {
    coverImage: '/images/aboutus_heroimg.jpg',
    imageAlt: 'Video gallery album image',
    title: 'Video Gallery Album',
    description: 'Selected videos from the album.',
  },
  video: {
    thumbnailSrc: '/images/aboutus_heroimg.jpg',
    thumbnailAlt: 'Video thumbnail',
    title: 'Untitled video',
  },
};

function resolveImageUrl(image: VideoAlbumImage | null | undefined): string | null {
  return (
    getOptimizedImageUrl(image, 'large') ||
    getOptimizedImageUrl(image, 'medium') ||
    getOptimizedImageUrl(image, 'small') ||
    getStrapiImageUrl(image)
  );
}

function mapBreadcrumbItems(hero: VideoGalleryPageHero | null | undefined): BreadcrumbItem[] {
  const breadcrumbItems =
    hero?.Breadcrumb
      ?.filter((item) => item?.label)
      .map((item) => ({
        label: item.label,
        ...(item.href ? { href: item.href } : {}),
      })) || [];

  return breadcrumbItems.length > 0
    ? breadcrumbItems
    : VIDEO_GALLERY_PAGE_FALLBACK.hero.breadcrumbItems;
}

function normalizeYouTubeEmbedUrl(url: string | null | undefined): string | null {
  if (!url) {
    return null;
  }

  if (url.startsWith('https://www.youtube.com/embed/') || url.startsWith('http://www.youtube.com/embed/')) {
    return url;
  }

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const videoId = parsed.pathname.replace(/^\/+/, '').split('/')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (parsed.pathname.startsWith('/embed/')) {
        const videoId = parsed.pathname.replace('/embed/', '').split('/')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }

      const videoId = parsed.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function mapVideoGalleryHero(
  page: VideoGalleryPage | null | undefined
): VideoGalleryHeroViewModel {
  const hero = page?.pagehero;
  const image = hero?.backgroundImage || null;

  return {
    title: hero?.PageTitle || VIDEO_GALLERY_PAGE_FALLBACK.hero.title,
    breadcrumbItems: mapBreadcrumbItems(hero),
    backgroundImage:
      resolveImageUrl(image) || VIDEO_GALLERY_PAGE_FALLBACK.hero.backgroundImage,
    backgroundImageAlt:
      hero?.backgroundImageAlt ||
      image?.alternativeText ||
      VIDEO_GALLERY_PAGE_FALLBACK.hero.backgroundImageAlt,
  };
}

function mapAlbumToSlide(album: VideoAlbum): MediaAlbumSlide {
  const coverImage = resolveImageUrl(album.featuredimg);

  return {
    id: String(album.id),
    title: album.videoalbumname,
    imageSrc: coverImage || VIDEO_GALLERY_PAGE_FALLBACK.album.coverImage,
    imageAlt:
      album.featuredimg?.alternativeText ||
      VIDEO_GALLERY_PAGE_FALLBACK.album.imageAlt,
    href: `/media-gallery/video-gallery/albums/${album.slug}`,
  };
}

export function mapVideoGalleryPageData(
  page: VideoGalleryPage | null | undefined,
  albums: VideoAlbum[]
): VideoGalleryPageViewModel {
  return {
    hero: mapVideoGalleryHero(page),
    slides: albums.map(mapAlbumToSlide),
  };
}

function mapVideoSource(video: VideoItem): {
  sourceType: 'youtube' | 'local';
  src: string;
} {
  const sourceType = video.sourcetype === 'local' ? 'local' : 'youtube';

  if (sourceType === 'local') {
    return {
      sourceType,
      src: getStrapiMediaUrl(video.videofile) || '',
    };
  }

  return {
    sourceType,
    src: normalizeYouTubeEmbedUrl(video.videourl) || '',
  };
}

function mapVideoItemToViewModel(
  video: VideoItem,
  album: VideoAlbum,
  index: number
): VideoGalleryItemViewModel {
  const source = mapVideoSource(video);
  const resolvedAlt =
    video.thumbnailimage?.alternativeText?.trim() ||
    `${album.videoalbumname} video ${index + 1}`;

  return {
    id: String(video.id || `${album.slug}-${index + 1}`),
    title: video.videotitle || VIDEO_GALLERY_PAGE_FALLBACK.video.title,
    description: video.videodescription || undefined,
    thumbnailSrc:
      resolveImageUrl(video.thumbnailimage) ||
      VIDEO_GALLERY_PAGE_FALLBACK.video.thumbnailSrc,
    thumbnailAlt: resolvedAlt,
    sourceType: source.sourceType,
    src: source.src,
    duration: video.duration?.trim() || undefined,
  };
}

export function mapVideoGalleryAlbumData(
  album: VideoAlbum,
  page: VideoGalleryPage | null | undefined
): VideoGalleryAlbumViewModel {
  const coverImage = resolveImageUrl(album.featuredimg);

  return {
    id: String(album.id),
    slug: album.slug,
    title: album.videoalbumname || VIDEO_GALLERY_PAGE_FALLBACK.album.title,
    albumTitle:
      album.videoalbumtitle?.trim() ||
      'Stories from the album, presented as a video collection.',
    description:
      album.videoalbumsummary || VIDEO_GALLERY_PAGE_FALLBACK.album.description,
    coverImage: coverImage || VIDEO_GALLERY_PAGE_FALLBACK.album.coverImage,
    imageAlt:
      album.featuredimg?.alternativeText ||
      VIDEO_GALLERY_PAGE_FALLBACK.album.imageAlt,
    href: `/media-gallery/video-gallery/albums/${album.slug}`,
    videos: album.video_items.map((video, index) =>
      mapVideoItemToViewModel(video, album, index)
    ),
    labels: {
      home:
        page?.pagehero?.Breadcrumb?.[0]?.label ||
        VIDEO_GALLERY_PAGE_FALLBACK.labels.home,
      videoGallery:
        page?.pagehero?.Breadcrumb?.[1]?.label ||
        VIDEO_GALLERY_PAGE_FALLBACK.labels.videoGallery,
      album: page?.albumlabel || VIDEO_GALLERY_PAGE_FALLBACK.labels.album,
      videos: page?.videoslabel || VIDEO_GALLERY_PAGE_FALLBACK.labels.videos,
      albumVideos:
        page?.albumvideoslabel ||
        VIDEO_GALLERY_PAGE_FALLBACK.labels.albumVideos,
    },
  };
}

export { VIDEO_GALLERY_PAGE_FALLBACK, normalizeYouTubeEmbedUrl };
