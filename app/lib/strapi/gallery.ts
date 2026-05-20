import type { GalleryPage } from '../types';
import { fetchStrapi, unwrapSingleEntity, withLocaleFallback } from './client';

function buildGalleryPageQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[pagehero][populate][backgroundImage]', 'true');
  params.set('populate[pagehero][populate][Breadcrumb]', 'true');
  params.set('populate[sectionheader][populate]', '*');
  params.set('populate[photogallery][populate][albumimg]', 'true');
  params.set('populate[videogallery][populate][albumimg]', 'true');

  return params.toString();
}

async function fetchGalleryPage(locale: string): Promise<GalleryPage | null> {
  const queryString = buildGalleryPageQuery(locale);
  const url = queryString ? `/api/gallery-page?${queryString}` : '/api/gallery-page';
  const response = await fetchStrapi<unknown>(url);
  return unwrapSingleEntity<GalleryPage>(response);
}

export async function getGalleryPage(locale: string = 'en'): Promise<GalleryPage | null> {
  return withLocaleFallback({
    locale,
    label: 'gallery page',
    fetcher: fetchGalleryPage,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export { buildGalleryPageQuery };
