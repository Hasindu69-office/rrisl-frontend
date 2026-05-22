import type { Album, AlbumImage, PhotoGalleryPage } from '../types';
import { fetchStrapi, unwrapCollection, unwrapSingleEntity, withLocaleFallback } from './client';

type PhotoGalleryPageRecord = Partial<PhotoGalleryPage> & {
  id?: number;
  attributes?: Partial<PhotoGalleryPage>;
};

type AlbumRecord = Partial<Album> & {
  id?: number;
  attributes?: Partial<Album>;
  featuredimg?: unknown;
  images?: unknown;
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

function normalizeMediaCollection(media: unknown): AlbumImage[] {
  if (!media) {
    return [];
  }

  if (typeof media === 'object' && media !== null && 'data' in media) {
    const data = (media as { data?: unknown }).data;

    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .map((item) => normalizeRelation<AlbumImage>(item))
      .filter((item): item is AlbumImage => item !== null);
  }

  if (!Array.isArray(media)) {
    return [];
  }

  return media
    .map((item) => normalizeRelation<AlbumImage>(item))
    .filter((item): item is AlbumImage => item !== null);
}

function mapPhotoGalleryPageRecord(
  record: PhotoGalleryPageRecord | null | undefined,
  locale: string
): PhotoGalleryPage | null {
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
    photoslabel: attributes.photoslabel || record.photoslabel,
    albumphotoslabel: attributes.albumphotoslabel || record.albumphotoslabel,
    albumlabel: attributes.albumlabel || record.albumlabel,
  };
}

function mapAlbumRecord(record: AlbumRecord, locale: string): Album {
  const attributes = record.attributes || record;

  return {
    id: record.id || attributes.id || 0,
    documentId: record.documentId || attributes.documentId,
    createdAt: attributes.createdAt || record.createdAt,
    updatedAt: attributes.updatedAt || record.updatedAt,
    publishedAt: attributes.publishedAt || record.publishedAt,
    locale: attributes.locale || record.locale || locale,
    albumname: attributes.albumname || record.albumname || '',
    slug: attributes.slug || record.slug || '',
    albumtitle: attributes.albumtitle || record.albumtitle || null,
    albumsummary: attributes.albumsummary || record.albumsummary || '',
    featuredimg: normalizeRelation<AlbumImage>(attributes.featuredimg || record.featuredimg),
    images: normalizeMediaCollection(attributes.images || record.images),
  };
}

function buildPhotoGalleryPageQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[pagehero][populate][backgroundImage]', 'true');
  params.set('populate[pagehero][populate][Breadcrumb]', 'true');

  return params.toString();
}

function buildAlbumsQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[featuredimg]', 'true');
  params.set('populate[images]', 'true');

  return params.toString();
}

function buildAlbumBySlugQuery(slug: string, locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('filters[slug][$eq]', slug);
  params.set('populate[featuredimg]', 'true');
  params.set('populate[images]', 'true');

  return params.toString();
}

async function fetchPhotoGalleryPage(locale: string): Promise<PhotoGalleryPage | null> {
  const queryString = buildPhotoGalleryPageQuery(locale);
  const url = queryString
    ? `/api/photo-gallery-page?${queryString}`
    : '/api/photo-gallery-page';
  const response = await fetchStrapi<unknown>(url);
  const page = unwrapSingleEntity<PhotoGalleryPageRecord>(response);

  return mapPhotoGalleryPageRecord(page, locale);
}

export async function getPhotoGalleryPage(
  locale: string = 'en'
): Promise<PhotoGalleryPage | null> {
  return withLocaleFallback({
    locale,
    label: 'photo gallery page',
    fetcher: fetchPhotoGalleryPage,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

async function fetchPhotoGalleryAlbums(locale: string): Promise<Album[]> {
  const queryString = buildAlbumsQuery(locale);
  const url = queryString ? `/api/albums?${queryString}` : '/api/albums';
  const response = await fetchStrapi<unknown>(url);
  const albums = unwrapCollection<AlbumRecord>(response);

  return albums.map((album) => mapAlbumRecord(album, locale));
}

export async function getPhotoGalleryAlbums(locale: string = 'en'): Promise<Album[]> {
  return withLocaleFallback({
    locale,
    label: 'photo gallery albums',
    fetcher: fetchPhotoGalleryAlbums,
    hasValue: (value) => value.length > 0,
    emptyValue: [],
  });
}

async function fetchPhotoGalleryAlbumBySlug(
  slug: string,
  locale: string
): Promise<Album | null> {
  const queryString = buildAlbumBySlugQuery(slug, locale);
  const url = queryString ? `/api/albums?${queryString}` : '/api/albums';
  const response = await fetchStrapi<unknown>(url);
  const album = unwrapCollection<AlbumRecord>(response)[0];

  return album ? mapAlbumRecord(album, locale) : null;
}

export async function getPhotoGalleryAlbumBySlug(
  slug: string,
  locale: string = 'en'
): Promise<Album | null> {
  return withLocaleFallback({
    locale,
    label: `photo gallery album "${slug}"`,
    fetcher: (resolvedLocale) => fetchPhotoGalleryAlbumBySlug(slug, resolvedLocale),
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export async function getPhotoGalleryAlbumSlugs(
  locale: string = 'en'
): Promise<Array<{ slug: string }>> {
  const albums = await getPhotoGalleryAlbums(locale);

  return albums
    .filter((album) => album.slug)
    .map((album) => ({ slug: album.slug }));
}

export {
  buildAlbumBySlugQuery,
  buildAlbumsQuery,
  buildPhotoGalleryPageQuery,
};
