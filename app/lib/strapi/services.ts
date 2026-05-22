import type { ServicesPage, TestingServiceCategory } from '../types';
import { fetchStrapi, unwrapCollection, unwrapSingleEntity, withLocaleFallback } from './client';

function buildServicesPageQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[pagehero][populate][backgroundImage]', 'true');
  params.set('populate[pagehero][populate][Breadcrumb]', 'true');
  params.set('populate[sectionheader]', 'true');
  params.set('populate[servicehighlights][populate][icon]', 'true');
  params.set('populate[testingservicesheader]', 'true');
  params.set('populate[samplesubmissionpopupImage]', 'true');

  return params.toString();
}

function buildTestingServiceCategoriesQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('sort[0]', 'sortorder:asc');
  params.set('populate[testing_services]', 'true');

  return params.toString();
}

export async function fetchServicesPageByLocale(locale: string): Promise<ServicesPage | null> {
  const queryString = buildServicesPageQuery(locale);
  const url = queryString ? `/api/services-page?${queryString}` : '/api/services-page';
  const response = await fetchStrapi<unknown>(url);

  return unwrapSingleEntity<ServicesPage>(response);
}

export async function fetchTestingServiceCategoriesByLocale(
  locale: string
): Promise<TestingServiceCategory[]> {
  const queryString = buildTestingServiceCategoriesQuery(locale);
  const url = queryString
    ? `/api/testing-service-categories?${queryString}`
    : '/api/testing-service-categories';
  const response = await fetchStrapi<unknown>(url);

  return unwrapCollection<TestingServiceCategory>(response);
}

export async function getServicesPage(locale: string = 'en'): Promise<ServicesPage | null> {
  return withLocaleFallback({
    locale,
    label: 'services page',
    fetcher: fetchServicesPageByLocale,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export async function getTestingServiceCategories(
  locale: string = 'en'
): Promise<TestingServiceCategory[]> {
  return withLocaleFallback({
    locale,
    label: 'testing service categories',
    fetcher: fetchTestingServiceCategoriesByLocale,
    hasValue: (value) => value.length > 0,
    emptyValue: [],
  });
}

export { buildServicesPageQuery, buildTestingServiceCategoriesQuery };
