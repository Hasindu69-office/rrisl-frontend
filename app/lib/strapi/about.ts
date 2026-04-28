import type { AboutPage } from '../types';
import { fetchStrapi, unwrapSingleEntity, withLocaleFallback } from './client';

function buildAboutPageQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[pagehero][populate][backgroundImage]', 'true');
  params.set('populate[pagehero][populate][Breadcrumb]', 'true');
  params.set('populate[firstcontent][populate]', '*');
  params.set('populate[objectives][populate]', '*');
  params.set('populate[objectivebgimage][populate]', '*');
  params.set('populate[objectivesection][populate]', '*');

  return params.toString();
}

async function fetchAboutPage(locale: string): Promise<AboutPage | null> {
  const queryString = buildAboutPageQuery(locale);
  const url = queryString ? `/api/about-page?${queryString}` : '/api/about-page';
  const response = await fetchStrapi<any>(url);
  return unwrapSingleEntity<AboutPage>(response);
}

export async function getAboutPage(locale: string = 'en'): Promise<AboutPage | null> {
  return withLocaleFallback({
    locale,
    label: 'about page',
    fetcher: fetchAboutPage,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export { buildAboutPageQuery };
