import type { EventCategory, EventEntity, EventPage } from '../types';
import { fetchStrapi, unwrapCollection, unwrapSingleEntity, withLocaleFallback } from './client';

function setLocale(params: URLSearchParams, locale: string) {
  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }
}

export function buildEventPageQuery(locale: string): string {
  const params = new URLSearchParams();

  setLocale(params, locale);
  params.set('populate[pagehero][populate][backgroundImage]', 'true');
  params.set('populate[pagehero][populate][Breadcrumb]', 'true');
  params.set('populate[sectionheader]', 'true');

  return params.toString();
}

export function buildAllEventsQuery(locale: string): string {
  const params = new URLSearchParams();

  setLocale(params, locale);
  params.set('populate[featuredImage]', 'true');
  params.set('populate[galleryimages]', 'true');
  params.set('populate[paragraph]', 'true');
  params.set('populate[event_categories]', 'true');
  params.set('sort[0]', 'dateandtime:asc');

  return params.toString();
}

export function buildEventBySlugQuery(slug: string, locale: string): string {
  const params = new URLSearchParams();

  setLocale(params, locale);
  params.set('filters[slug][$eq]', slug);
  params.set('populate[featuredImage]', 'true');
  params.set('populate[galleryimages]', 'true');
  params.set('populate[paragraph]', 'true');
  params.set('populate[event_categories]', 'true');

  return params.toString();
}

export function buildEventCategoriesQuery(locale: string): string {
  const params = new URLSearchParams();

  setLocale(params, locale);
  params.set('sort[0]', 'sortOrder:asc');

  return params.toString();
}

async function fetchEventPage(locale: string): Promise<EventPage | null> {
  const queryString = buildEventPageQuery(locale);
  const url = queryString ? `/api/event-page?${queryString}` : '/api/event-page';
  const response = await fetchStrapi<any>(url);
  return unwrapSingleEntity<EventPage>(response);
}

async function fetchAllEvents(locale: string): Promise<EventEntity[]> {
  const queryString = buildAllEventsQuery(locale);
  const response = await fetchStrapi<any>(`/api/events?${queryString}`);
  return unwrapCollection<EventEntity>(response);
}

async function fetchEventBySlug(slug: string, locale: string): Promise<EventEntity | null> {
  const queryString = buildEventBySlugQuery(slug, locale);
  const response = await fetchStrapi<any>(`/api/events?${queryString}`);
  return unwrapSingleEntity<EventEntity>(response);
}

async function fetchEventCategories(locale: string): Promise<EventCategory[]> {
  const queryString = buildEventCategoriesQuery(locale);
  const response = await fetchStrapi<any>(`/api/event-categories?${queryString}`);
  return unwrapCollection<EventCategory>(response);
}

export async function getEventPage(locale: string = 'en'): Promise<EventPage | null> {
  return withLocaleFallback({
    locale,
    label: 'event page',
    fetcher: fetchEventPage,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export async function getAllEvents(locale: string = 'en'): Promise<EventEntity[]> {
  return withLocaleFallback({
    locale,
    label: 'events',
    fetcher: fetchAllEvents,
    hasValue: (value) => value.length > 0,
    emptyValue: [],
  });
}

export async function getEventBySlug(slug: string, locale: string = 'en'): Promise<EventEntity | null> {
  return withLocaleFallback({
    locale,
    label: `event "${slug}"`,
    fetcher: (nextLocale) => fetchEventBySlug(slug, nextLocale),
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export async function getEventCategories(locale: string = 'en'): Promise<EventCategory[]> {
  return withLocaleFallback({
    locale,
    label: 'event categories',
    fetcher: fetchEventCategories,
    hasValue: (value) => value.length > 0,
    emptyValue: [],
  });
}
