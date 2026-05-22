import type { RubberAuctionPrice, RubberPricePage } from '../types';
import { fetchStrapi, unwrapCollection, unwrapSingleEntity, withLocaleFallback } from './client';

type RubberAuctionPriceRecord = Partial<RubberAuctionPrice> & {
  id?: number;
  attributes?: Partial<RubberAuctionPrice>;
};

function buildRubberPricePageQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[pagehero][populate][backgroundImage]', 'true');
  params.set('populate[pagehero][populate][Breadcrumb]', 'true');
  params.set('populate[sectionheader][populate]', '*');
  params.set('populate[archivedbrowsertitle][populate]', '*');

  return params.toString();
}

function buildRubberAuctionPricesQuery(): string {
  const params = new URLSearchParams();

  params.set('populate[price]', 'true');
  params.set('pagination[pageSize]', '100');
  params.set('sort[0]', 'date:desc');

  return params.toString();
}

async function fetchRubberPricePage(locale: string): Promise<RubberPricePage | null> {
  const queryString = buildRubberPricePageQuery(locale);
  const url = queryString ? `/api/rubber-price-page?${queryString}` : '/api/rubber-price-page';
  const response = await fetchStrapi<unknown>(url);
  return unwrapSingleEntity<RubberPricePage>(response);
}

export async function getRubberPricePage(
  locale: string = 'en'
): Promise<RubberPricePage | null> {
  return withLocaleFallback({
    locale,
    label: 'rubber price page',
    fetcher: fetchRubberPricePage,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

async function fetchRubberAuctionPrices(): Promise<RubberAuctionPrice[]> {
  const queryString = buildRubberAuctionPricesQuery();
  const url = queryString
    ? `/api/rubber-auction-prices?${queryString}`
    : '/api/rubber-auction-prices';
  const response = await fetchStrapi<unknown>(url);
  const entries = unwrapCollection<RubberAuctionPriceRecord>(response);
  const mappedEntries = entries
    .map((item): RubberAuctionPrice | null => {
      const attributes = item.attributes || item;
      const id = item.id || attributes.id || 0;
      const date = attributes.date || item.date;

      if (!date) {
        return null;
      }

      return {
        id,
        documentId: item.documentId || attributes.documentId,
        date,
        price: attributes.price || item.price || null,
        createdAt: attributes.createdAt || item.createdAt,
        updatedAt: attributes.updatedAt || item.updatedAt,
        publishedAt: attributes.publishedAt || item.publishedAt,
      };
    })
    .filter((item): item is RubberAuctionPrice => item !== null);

  return mappedEntries;
}

export async function getRubberAuctionPrices(): Promise<RubberAuctionPrice[]> {
  try {
    return await fetchRubberAuctionPrices();
  } catch (error) {
    console.error('Error fetching rubber auction prices:', error);
    return [];
  }
}

export { buildRubberAuctionPricesQuery, buildRubberPricePageQuery };
