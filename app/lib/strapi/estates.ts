import type {
  EstateAndSubstationsPage,
  EstateSubstation,
  PolgahawelaAnnualRainfallValue,
  PolgahawelaProductionCard,
  PolgahawelaRainfallMonthValue,
} from '../types';
import { fetchStrapi, unwrapCollection, unwrapSingleEntity, withLocaleFallback } from './client';

function buildEstateAndSubstationsPageQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[pagehero][populate][backgroundImage]', 'true');
  params.set('populate[pagehero][populate][Breadcrumb]', 'true');
  params.set('populate[sectionheader]', 'true');

  return params.toString();
}

function buildEstateSubstationsQuery(locale: string, slug?: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  if (slug) {
    params.set('filters[slug][$eq]', slug);
  }

  params.set('sort[0]', 'sortorder:asc');
  params.set('populate[pagehero][populate][backgroundImage]', 'true');
  params.set('populate[pagehero][populate][Breadcrumb]', 'true');
  params.set('populate[point]', 'true');
  params.set('populate[introduction][populate][sectionheader]', 'true');
  params.set('populate[introduction][populate][paragraph]', 'true');
  params.set('populate[introductionimage]', 'true');
  params.set('populate[facilitiessection][populate][sectionheader]', 'true');
  params.set('populate[facilitiessection][populate][paragraph]', 'true');
  params.set('populate[facilitiessection][populate][cards][populate][icon]', 'true');
  params.set('populate[facilitysectionimage]', 'true');
  params.set('populate[activitiessection][populate][sectionheader]', 'true');
  params.set('populate[activitiessection][populate][card][populate][image]', 'true');
  params.set('populate[activitiessectionbgimage]', 'true');
  params.set('populate[featuressection][populate][sectionheader]', 'true');
  params.set('populate[featuressection][populate][cards][populate][image]', 'true');
  params.set('populate[featuressection][populate][featuresectionbackgroundimage]', 'true');
  params.set('populate[monitoringsection][populate][sectionheader]', 'true');
  params.set('populate[monitoringsection][populate][monitoringsectionbackgroundimage]', 'true');
  params.set('populate[monitoringsection][populate][rainfalldistribution]', 'true');
  params.set('populate[monitoringsection][populate][annualrainfalldistribution]', 'true');
  params.set('populate[performancesection][populate][sectionheader]', 'true');
  params.set('populate[performancesection][populate][productiontrendcard]', 'true');
  params.set('populate[performancesection][populate][yieldperformancecard]', 'true');
  params.set('populate[performancesection][populate][qualityguagecard]', 'true');
  params.set('populate[performancesection][populate][taperproductioncard][populate][barchartvalues]', 'true');

  return params.toString();
}

function buildPolgahawelaAnnualRainfallQuery(): string {
  const params = new URLSearchParams();
  params.set('populate[yeardata]', 'true');
  return params.toString();
}

function buildPolgahawelaRainfallMonthQuery(): string {
  const params = new URLSearchParams();
  params.set('populate[monthdata]', 'true');
  return params.toString();
}

function buildPolgahawelaProductionCardsQuery(): string {
  const params = new URLSearchParams();
  params.set('populate[trendpoints]', 'true');
  return params.toString();
}

async function fetchEstateAndSubstationsPageByLocale(
  locale: string
): Promise<EstateAndSubstationsPage | null> {
  const queryString = buildEstateAndSubstationsPageQuery(locale);
  const url = queryString
    ? `/api/estate-and-substations-page?${queryString}`
    : '/api/estate-and-substations-page';
  const response = await fetchStrapi<unknown>(url);

  return unwrapSingleEntity<EstateAndSubstationsPage>(response);
}

async function fetchEstateSubstationsByLocale(
  locale: string
): Promise<EstateSubstation[]> {
  const queryString = buildEstateSubstationsQuery(locale);
  const url = queryString
    ? `/api/estate-substations?${queryString}`
    : '/api/estate-substations';
  const response = await fetchStrapi<unknown>(url);

  return unwrapCollection<EstateSubstation>(response);
}

async function fetchEstateSubstationBySlugAndLocale(
  slug: string,
  locale: string
): Promise<EstateSubstation | null> {
  const queryString = buildEstateSubstationsQuery(locale, slug);
  const url = queryString
    ? `/api/estate-substations?${queryString}`
    : '/api/estate-substations';
  const response = await fetchStrapi<unknown>(url);

  return unwrapSingleEntity<EstateSubstation>(response);
}

export async function getEstateAndSubstationsPage(
  locale: string = 'en'
): Promise<EstateAndSubstationsPage | null> {
  return withLocaleFallback({
    locale,
    label: 'estate and substations page',
    fetcher: fetchEstateAndSubstationsPageByLocale,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export async function getEstateSubstations(
  locale: string = 'en'
): Promise<EstateSubstation[]> {
  return withLocaleFallback({
    locale,
    label: 'estate substations',
    fetcher: fetchEstateSubstationsByLocale,
    hasValue: (value) => value.length > 0,
    emptyValue: [],
  });
}

export async function getEstateSubstationBySlug(
  slug: string,
  locale: string = 'en'
): Promise<EstateSubstation | null> {
  return withLocaleFallback({
    locale,
    label: `estate substation ${slug}`,
    fetcher: (activeLocale) => fetchEstateSubstationBySlugAndLocale(slug, activeLocale),
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export async function getPolgahawelaAnnualRainfallValues(): Promise<PolgahawelaAnnualRainfallValue[]> {
  const queryString = buildPolgahawelaAnnualRainfallQuery();
  const response = await fetchStrapi<unknown>(
    `/api/polgahawela-annual-rainfall-values?${queryString}`
  );

  return unwrapCollection<PolgahawelaAnnualRainfallValue>(response);
}

export async function getPolgahawelaRainfallMonthValues(): Promise<PolgahawelaRainfallMonthValue[]> {
  const queryString = buildPolgahawelaRainfallMonthQuery();
  const response = await fetchStrapi<unknown>(
    `/api/polgahawela-rainfall-month-values?${queryString}`
  );

  return unwrapCollection<PolgahawelaRainfallMonthValue>(response);
}

export async function getPolgahawelaProductionCards(): Promise<PolgahawelaProductionCard[]> {
  const queryString = buildPolgahawelaProductionCardsQuery();
  const response = await fetchStrapi<unknown>(
    `/api/polgahawela-production-cards?${queryString}`
  );

  return unwrapCollection<PolgahawelaProductionCard>(response);
}

export {
  buildEstateAndSubstationsPageQuery,
  buildEstateSubstationsQuery,
  buildPolgahawelaAnnualRainfallQuery,
  buildPolgahawelaRainfallMonthQuery,
  buildPolgahawelaProductionCardsQuery,
};

