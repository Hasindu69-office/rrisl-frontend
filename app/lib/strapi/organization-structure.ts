import type { OrganizationStructurePage } from '../types';
import { fetchStrapi, unwrapSingleEntity, withLocaleFallback } from './client';

export function buildOrganizationStructurePageQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[pagehero][populate][backgroundImage]', 'true');
  params.set('populate[pagehero][populate][Breadcrumb]', 'true');
  params.set('populate[organizationstructureimg]', 'true');

  return params.toString();
}

async function fetchOrganizationStructurePage(
  locale: string
): Promise<OrganizationStructurePage | null> {
  const queryString = buildOrganizationStructurePageQuery(locale);
  const url = queryString
    ? `/api/organization-structure-page?${queryString}`
    : '/api/organization-structure-page';
  const response = await fetchStrapi<unknown>(url);

  return unwrapSingleEntity<OrganizationStructurePage>(response);
}

export async function getOrganizationStructurePage(
  locale: string = 'en'
): Promise<OrganizationStructurePage | null> {
  return withLocaleFallback({
    locale,
    label: 'organization structure page',
    fetcher: fetchOrganizationStructurePage,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}
