import type { BidNoticePage, Tender } from '../types';
import { fetchStrapi, unwrapCollection, unwrapSingleEntity, withLocaleFallback } from './client';

function buildBidNoticePageQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[pagehero][populate][backgroundImage]', 'true');
  params.set('populate[pagehero][populate][Breadcrumb]', 'true');
  params.set('populate[rrisllogo]', 'true');
  params.set('populate[ErrrorMessage]', 'true');

  return params.toString();
}

function buildTenderQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('filters[State][$eq]', 'Open');
  params.set('sort', 'PublishDate:desc');
  params.set('populate[Document]', 'true');
  params.set('pagination[pageSize]', '100');

  return params.toString();
}

async function fetchBidNoticePage(locale: string): Promise<BidNoticePage | null> {
  const queryString = buildBidNoticePageQuery(locale);
  const url = queryString ? `/api/bid-notice-page?${queryString}` : '/api/bid-notice-page';
  const response = await fetchStrapi<any>(url);
  return unwrapSingleEntity<BidNoticePage>(response);
}

export async function getBidNoticePage(locale: string = 'en'): Promise<BidNoticePage | null> {
  return withLocaleFallback({
    locale,
    label: 'bid notice page',
    fetcher: fetchBidNoticePage,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

async function fetchTenders(locale: string): Promise<Tender[]> {
  const queryString = buildTenderQuery(locale);
  const url = queryString ? `/api/tenders?${queryString}` : '/api/tenders';
  const response = await fetchStrapi<any>(url);
  const tenders = unwrapCollection<any>(response);

  return tenders.map((item: any) => {
    const attributes = item.attributes || item;

    return {
      id: item.id || attributes.id,
      documentId: item.documentId || attributes.documentId,
      Title: attributes.Title || item.Title,
      TenderNumber: attributes.TenderNumber || item.TenderNumber,
      ClosingDate: attributes.ClosingDate || item.ClosingDate,
      PublishDate: attributes.PublishDate || item.PublishDate,
      State: attributes.State || item.State,
      Document: attributes.Document || item.Document,
      createdAt: attributes.createdAt || item.createdAt,
      updatedAt: attributes.updatedAt || item.updatedAt,
      publishedAt: attributes.publishedAt || item.publishedAt,
      locale: attributes.locale || item.locale || locale,
    };
  });
}

export async function getTenders(locale: string = 'en'): Promise<Tender[]> {
  return withLocaleFallback({
    locale,
    label: 'tenders',
    fetcher: fetchTenders,
    hasValue: (value) => value.length > 0,
    emptyValue: [],
  });
}

export { buildBidNoticePageQuery, buildTenderQuery };
