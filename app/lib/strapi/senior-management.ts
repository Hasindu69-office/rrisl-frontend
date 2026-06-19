import type { SeniorManagementMember, SeniorManagementPage } from '../types';
import { fetchStrapi, unwrapCollection, unwrapSingleEntity, withLocaleFallback } from './client';

export function buildSeniorManagementPageQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[pagehero][populate][backgroundImage]', 'true');
  params.set('populate[pagehero][populate][Breadcrumb]', 'true');

  return params.toString();
}

export function buildSeniorManagementMembersQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('sort[0]', 'sortorder:asc');
  params.set('sort[1]', 'name:asc');
  params.set('populate[image]', 'true');

  return params.toString();
}

async function fetchSeniorManagementPage(
  locale: string
): Promise<SeniorManagementPage | null> {
  const queryString = buildSeniorManagementPageQuery(locale);
  const url = queryString
    ? `/api/senior-management-page?${queryString}`
    : '/api/senior-management-page';
  const response = await fetchStrapi<unknown>(url);

  return unwrapSingleEntity<SeniorManagementPage>(response);
}

async function fetchSeniorManagementMembers(
  locale: string
): Promise<SeniorManagementMember[]> {
  const queryString = buildSeniorManagementMembersQuery(locale);
  const url = queryString
    ? `/api/senior-managements?${queryString}`
    : '/api/senior-managements';
  const response = await fetchStrapi<unknown>(url);

  return unwrapCollection<SeniorManagementMember>(response);
}

export async function getSeniorManagementPage(
  locale: string = 'en'
): Promise<SeniorManagementPage | null> {
  return withLocaleFallback({
    locale,
    label: 'senior management page',
    fetcher: fetchSeniorManagementPage,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export async function getSeniorManagementMembers(
  locale: string = 'en'
): Promise<SeniorManagementMember[]> {
  return withLocaleFallback({
    locale,
    label: 'senior management members',
    fetcher: fetchSeniorManagementMembers,
    hasValue: (value) => value.length > 0,
    emptyValue: [],
  });
}
