import type { ResearchManager, ResearchManagersPage } from '../types';
import { fetchStrapi, unwrapCollection, unwrapSingleEntity, withLocaleFallback } from './client';

export function buildResearchManagersPageQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[pagehero][populate][backgroundImage]', 'true');
  params.set('populate[pagehero][populate][Breadcrumb]', 'true');
  params.set('populate[researchleadershipdetails][populate]', '*');

  return params.toString();
}

export function buildResearchManagersQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('sort[0]', 'sortorder:asc');
  params.set('sort[1]', 'fullname:asc');
  params.set('populate[image]', 'true');
  params.set('populate[email]', 'true');
  params.set('populate[profilepoints]', 'true');

  return params.toString();
}

async function fetchResearchManagersPage(locale: string): Promise<ResearchManagersPage | null> {
  const queryString = buildResearchManagersPageQuery(locale);
  const url = queryString
    ? `/api/research-managers-page?${queryString}`
    : '/api/research-managers-page';
  const response = await fetchStrapi<unknown>(url);

  return unwrapSingleEntity<ResearchManagersPage>(response);
}

async function fetchResearchManagers(locale: string): Promise<ResearchManager[]> {
  const queryString = buildResearchManagersQuery(locale);
  const url = queryString
    ? `/api/research-managers?${queryString}`
    : '/api/research-managers';
  const response = await fetchStrapi<unknown>(url);

  return unwrapCollection<ResearchManager>(response);
}

export async function getResearchManagersPage(
  locale: string = 'en'
): Promise<ResearchManagersPage | null> {
  return withLocaleFallback({
    locale,
    label: 'research managers page',
    fetcher: fetchResearchManagersPage,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export async function getResearchManagers(
  locale: string = 'en'
): Promise<ResearchManager[]> {
  return withLocaleFallback({
    locale,
    label: 'research managers',
    fetcher: fetchResearchManagers,
    hasValue: (value) => value.length > 0,
    emptyValue: [],
  });
}
