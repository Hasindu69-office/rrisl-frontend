import type { HomePage } from '../types';
import { fetchStrapi, unwrapSingleEntity, withLocaleFallback } from './client';

function buildHomePageQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[hero][populate][backgroundImageDesktop]', 'true');
  params.set('populate[hero][populate][backgroundImageMobile]', 'true');
  params.set('populate[hero][populate][primaryCta]', 'true');
  params.set('populate[hero][populate][labels]', 'true');
  params.set('populate[hero][populate][badges][populate][avatars]', 'true');
  params.set('populate[hero][populate][badges][populate][icon]', 'true');
  params.set('populate[stats][populate]', '*');
  params.set('populate[aboutSection][populate]', '*');
  params.set('populate[Announcement][populate]', '*');

  return params.toString();
}

async function fetchHomePage(locale: string): Promise<HomePage | null> {
  const queryString = buildHomePageQuery(locale);
  const url = queryString ? `/api/home-page?${queryString}` : '/api/home-page';
  const response = await fetchStrapi<any>(url);
  return unwrapSingleEntity<HomePage>(response);
}

export async function getHomePage(locale: string = 'en'): Promise<HomePage | null> {
  return withLocaleFallback({
    locale,
    label: 'home page',
    fetcher: fetchHomePage,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export { buildHomePageQuery };
