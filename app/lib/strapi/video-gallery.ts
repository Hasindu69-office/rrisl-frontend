import type {
  VideoAlbum,
  VideoAlbumImage,
  VideoGalleryPage,
  VideoItem,
} from '../types';
import {
  fetchStrapi,
  unwrapCollection,
  unwrapSingleEntity,
  withLocaleFallback,
} from './client';

type VideoGalleryPageRecord = Partial<VideoGalleryPage> & {
  id?: number;
  attributes?: Partial<VideoGalleryPage>;
};

type VideoItemRecord = Partial<VideoItem> & {
  id?: number;
  attributes?: Partial<VideoItem>;
  thumbnailimage?: unknown;
  videofile?: unknown;
};

type VideoAlbumRecord = Partial<VideoAlbum> & {
  id?: number;
  attributes?: Partial<VideoAlbum>;
  featuredimg?: unknown;
  video_items?: unknown;
};

function normalizeRelation<T>(relation: unknown): T | null {
  if (!relation) {
    return null;
  }

  if (typeof relation === 'object' && relation !== null && 'data' in relation) {
    const data = (relation as { data?: unknown }).data;

    if (!data || Array.isArray(data)) {
      return null;
    }

    if (typeof data === 'object' && data !== null && 'attributes' in data) {
      return {
        ...((data as { attributes?: object }).attributes || {}),
        id: (data as { id?: number }).id,
      } as T;
    }

    return data as T;
  }

  if (typeof relation === 'object' && relation !== null && 'attributes' in relation) {
    return {
      ...((relation as { attributes?: object }).attributes || {}),
      id: (relation as { id?: number }).id,
    } as T;
  }

  return relation as T;
}

function normalizeRelationCollection<T>(relation: unknown): T[] {
  if (!relation) {
    return [];
  }

  if (typeof relation === 'object' && relation !== null && 'data' in relation) {
    const data = (relation as { data?: unknown }).data;

    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .map((item) => normalizeRelation<T>(item))
      .filter((item): item is T => item !== null);
  }

  if (!Array.isArray(relation)) {
    return [];
  }

  return relation
    .map((item) => normalizeRelation<T>(item))
    .filter((item): item is T => item !== null);
}

function mapVideoGalleryPageRecord(
  record: VideoGalleryPageRecord | null | undefined,
  locale: string
): VideoGalleryPage | null {
  if (!record) {
    return null;
  }

  const attributes = record.attributes || record;

  return {
    id: record.id || attributes.id || 0,
    documentId: record.documentId || attributes.documentId,
    createdAt: attributes.createdAt || record.createdAt,
    updatedAt: attributes.updatedAt || record.updatedAt,
    publishedAt: attributes.publishedAt || record.publishedAt,
    locale: attributes.locale || record.locale || locale,
    pagehero: normalizeRelation(attributes.pagehero || record.pagehero),
    videoslabel: attributes.videoslabel || record.videoslabel,
    albumvideoslabel: attributes.albumvideoslabel || record.albumvideoslabel,
    albumlabel: attributes.albumlabel || record.albumlabel,
  };
}

function mapVideoItemRecord(record: VideoItemRecord, locale: string): VideoItem {
  const attributes = record.attributes || record;

  return {
    id: record.id || attributes.id || 0,
    documentId: record.documentId || attributes.documentId,
    createdAt: attributes.createdAt || record.createdAt,
    updatedAt: attributes.updatedAt || record.updatedAt,
    publishedAt: attributes.publishedAt || record.publishedAt,
    locale: attributes.locale || record.locale || locale,
    videotitle: attributes.videotitle || record.videotitle || '',
    videodescription: attributes.videodescription || record.videodescription || '',
    thumbnailimage: normalizeRelation<VideoAlbumImage>(
      attributes.thumbnailimage || record.thumbnailimage
    ),
    sourcetype: attributes.sourcetype || record.sourcetype || null,
    videourl: attributes.videourl || record.videourl || null,
    videofile: normalizeRelation(attributes.videofile || record.videofile),
    duration: attributes.duration || record.duration || null,
    sortorder: attributes.sortorder || record.sortorder || 0,
  };
}

function mapVideoAlbumRecord(record: VideoAlbumRecord, locale: string): VideoAlbum {
  const attributes = record.attributes || record;
  const videoItems = normalizeRelationCollection<VideoItemRecord>(
    attributes.video_items || record.video_items
  )
    .map((item) => mapVideoItemRecord(item, locale))
    .sort((left, right) => left.sortorder - right.sortorder);

  return {
    id: record.id || attributes.id || 0,
    documentId: record.documentId || attributes.documentId,
    createdAt: attributes.createdAt || record.createdAt,
    updatedAt: attributes.updatedAt || record.updatedAt,
    publishedAt: attributes.publishedAt || record.publishedAt,
    locale: attributes.locale || record.locale || locale,
    videoalbumname: attributes.videoalbumname || record.videoalbumname || '',
    slug: attributes.slug || record.slug || '',
    videoalbumtitle: attributes.videoalbumtitle || record.videoalbumtitle || null,
    videoalbumsummary: attributes.videoalbumsummary || record.videoalbumsummary || '',
    featuredimg: normalizeRelation<VideoAlbumImage>(
      attributes.featuredimg || record.featuredimg
    ),
    video_items: videoItems,
  };
}

function buildVideoGalleryPageQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[pagehero][populate][backgroundImage]', 'true');
  params.set('populate[pagehero][populate][Breadcrumb]', 'true');

  return params.toString();
}

function buildVideoAlbumsQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[featuredimg]', 'true');
  params.set('populate[video_items][populate][thumbnailimage]', 'true');
  params.set('populate[video_items][populate][videofile]', 'true');
  params.set('sort[0]', 'videoalbumname:asc');

  return params.toString();
}

function buildVideoAlbumBySlugQuery(slug: string, locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('filters[slug][$eq]', slug);
  params.set('populate[featuredimg]', 'true');
  params.set('populate[video_items][populate][thumbnailimage]', 'true');
  params.set('populate[video_items][populate][videofile]', 'true');

  return params.toString();
}

async function fetchVideoGalleryPage(locale: string): Promise<VideoGalleryPage | null> {
  const queryString = buildVideoGalleryPageQuery(locale);
  const url = queryString
    ? `/api/video-gallery-page?${queryString}`
    : '/api/video-gallery-page';
  const response = await fetchStrapi<unknown>(url);
  const page = unwrapSingleEntity<VideoGalleryPageRecord>(response);

  return mapVideoGalleryPageRecord(page, locale);
}

export async function getVideoGalleryPage(
  locale: string = 'en'
): Promise<VideoGalleryPage | null> {
  return withLocaleFallback({
    locale,
    label: 'video gallery page',
    fetcher: fetchVideoGalleryPage,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

async function fetchVideoGalleryAlbums(locale: string): Promise<VideoAlbum[]> {
  const queryString = buildVideoAlbumsQuery(locale);
  const url = queryString ? `/api/videoalbums?${queryString}` : '/api/videoalbums';
  const response = await fetchStrapi<unknown>(url);
  const albums = unwrapCollection<VideoAlbumRecord>(response);

  return albums.map((album) => mapVideoAlbumRecord(album, locale));
}

export async function getVideoGalleryAlbums(locale: string = 'en'): Promise<VideoAlbum[]> {
  return withLocaleFallback({
    locale,
    label: 'video gallery albums',
    fetcher: fetchVideoGalleryAlbums,
    hasValue: (value) => value.length > 0,
    emptyValue: [],
  });
}

async function fetchVideoGalleryAlbumBySlug(
  slug: string,
  locale: string
): Promise<VideoAlbum | null> {
  const queryString = buildVideoAlbumBySlugQuery(slug, locale);
  const url = queryString ? `/api/videoalbums?${queryString}` : '/api/videoalbums';
  const response = await fetchStrapi<unknown>(url);
  const album = unwrapCollection<VideoAlbumRecord>(response)[0];

  return album ? mapVideoAlbumRecord(album, locale) : null;
}

export async function getVideoGalleryAlbumBySlug(
  slug: string,
  locale: string = 'en'
): Promise<VideoAlbum | null> {
  return withLocaleFallback({
    locale,
    label: `video gallery album "${slug}"`,
    fetcher: (resolvedLocale) => fetchVideoGalleryAlbumBySlug(slug, resolvedLocale),
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export async function getVideoGalleryAlbumSlugs(
  locale: string = 'en'
): Promise<Array<{ slug: string }>> {
  const albums = await getVideoGalleryAlbums(locale);

  return albums
    .filter((album) => album.slug)
    .map((album) => ({ slug: album.slug }));
}

export {
  buildVideoAlbumBySlugQuery,
  buildVideoAlbumsQuery,
  buildVideoGalleryPageQuery,
};
