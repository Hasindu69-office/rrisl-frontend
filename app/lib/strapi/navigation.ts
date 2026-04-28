import type { GlobalLayout, Menu } from '../types';
import { fetchStrapi, unwrapSingleEntity, withLocaleFallback } from './client';
import { buildQueryString } from './query';

async function fetchGlobalLayout(locale: string): Promise<GlobalLayout | null> {
  const queryString = buildQueryString({
    'populate[0]': 'logo',
    'populate[1]': 'favicon',
    locale,
  });

  const response = await fetchStrapi<any>(`/api/global-layout?${queryString}`);
  return unwrapSingleEntity<GlobalLayout>(response);
}

export async function getGlobalLayout(locale: string = 'en'): Promise<GlobalLayout | null> {
  return withLocaleFallback({
    locale,
    label: 'global layout',
    fetcher: fetchGlobalLayout,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

async function fetchMenuBySlug(slug: string, locale: string): Promise<Menu | null> {
  const queryString = buildQueryString({
    'filters[slug][$eq]': slug,
    locale,
    populate: '*',
  });

  const response = await fetchStrapi<any>(`/api/tree-menus/menu?${queryString}`);
  return unwrapSingleEntity<Menu>(response);
}

export async function getMenuBySlug(slug: string, locale: string = 'en'): Promise<Menu | null> {
  return withLocaleFallback({
    locale,
    label: `menu with slug "${slug}"`,
    fetcher: (nextLocale) => fetchMenuBySlug(slug, nextLocale),
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}
