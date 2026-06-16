import type { HomepageResearchNetworkLocation } from '../types';
import { fetchStrapi, unwrapCollection, withLocaleFallback } from './client';

function buildHomepageResearchNetworkLocationsQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  return params.toString();
}

async function fetchHomepageResearchNetworkLocationsByLocale(
  locale: string
): Promise<HomepageResearchNetworkLocation[]> {
  const queryString = buildHomepageResearchNetworkLocationsQuery(locale);
  const url = queryString
    ? `/api/homepage-research-network-locations?${queryString}`
    : '/api/homepage-research-network-locations';
  const response = await fetchStrapi<unknown>(url);

  return unwrapCollection<HomepageResearchNetworkLocation>(response);
}

function mergeLocationsByMapmark(
  localized: HomepageResearchNetworkLocation[],
  fallback: HomepageResearchNetworkLocation[]
): HomepageResearchNetworkLocation[] {
  const fallbackByMapmark = new Map(
    fallback.map((location) => [location.mapmark, location])
  );

  const mergedLocalized = localized.map((location) => {
    const fallbackLocation = fallbackByMapmark.get(location.mapmark);

    return {
      ...fallbackLocation,
      ...location,
    } as HomepageResearchNetworkLocation;
  });

  const mergedMapmarks = new Set(mergedLocalized.map((location) => location.mapmark));
  const fallbackOnly = fallback.filter((location) => !mergedMapmarks.has(location.mapmark));

  return [...mergedLocalized, ...fallbackOnly];
}

export async function getHomepageResearchNetworkLocations(
  locale: string = 'en'
): Promise<HomepageResearchNetworkLocation[]> {
  const localized = await withLocaleFallback({
    locale,
    label: 'homepage research network locations',
    fetcher: fetchHomepageResearchNetworkLocationsByLocale,
    hasValue: (value) => value.length > 0,
    emptyValue: [],
  });

  if (locale === 'en') {
    return localized;
  }

  const fallback = await fetchHomepageResearchNetworkLocationsByLocale('en');
  return mergeLocationsByMapmark(localized, fallback);
}

export { buildHomepageResearchNetworkLocationsQuery };
