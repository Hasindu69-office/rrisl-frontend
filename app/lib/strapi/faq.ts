import type { Faq, FaqPage } from '../types';
import { fetchStrapi, unwrapCollection, unwrapSingleEntity, withLocaleFallback } from './client';

function buildFaqPageQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[pagehero][populate][backgroundImage]', 'true');
  params.set('populate[pagehero][populate][Breadcrumb]', 'true');
  params.set('populate[sectionheader]', 'true');
  params.set('populate[leftimage]', 'true');

  return params.toString();
}

function buildFaqsQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('sort[0]', 'sortorder:asc');

  return params.toString();
}

export async function fetchFaqPageByLocale(locale: string): Promise<FaqPage | null> {
  const queryString = buildFaqPageQuery(locale);
  const url = queryString ? `/api/faq-page?${queryString}` : '/api/faq-page';
  const response = await fetchStrapi<unknown>(url);

  return unwrapSingleEntity<FaqPage>(response);
}

export async function fetchFaqsByLocale(locale: string): Promise<Faq[]> {
  const queryString = buildFaqsQuery(locale);
  const url = queryString ? `/api/faqs?${queryString}` : '/api/faqs';
  const response = await fetchStrapi<unknown>(url);

  return unwrapCollection<Faq>(response);
}

export async function getFaqPage(locale: string = 'en'): Promise<FaqPage | null> {
  return withLocaleFallback({
    locale,
    label: 'faq page',
    fetcher: fetchFaqPageByLocale,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export async function getFaqs(locale: string = 'en'): Promise<Faq[]> {
  return withLocaleFallback({
    locale,
    label: 'faqs',
    fetcher: fetchFaqsByLocale,
    hasValue: (value) => value.length > 0,
    emptyValue: [],
  });
}

export { buildFaqPageQuery, buildFaqsQuery };
