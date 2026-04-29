import type { Download, DownloadPage } from '../types';
import { fetchStrapi, unwrapCollection, unwrapSingleEntity, withLocaleFallback } from './client';

type DownloadRecord = Partial<Download> & {
  id?: number;
  attributes?: Partial<Download>;
};

function buildDownloadPageQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[pagehero][populate][backgroundImage]', 'true');
  params.set('populate[pagehero][populate][Breadcrumb]', 'true');
  params.set('populate[ErrrorMessage]', 'true');

  return params.toString();
}

function buildDownloadsQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[documentimage]', 'true');
  params.set('populate[document]', 'true');
  params.set('pagination[pageSize]', '100');

  return params.toString();
}

async function fetchDownloadPage(locale: string): Promise<DownloadPage | null> {
  const queryString = buildDownloadPageQuery(locale);
  const url = queryString ? `/api/downloadpage?${queryString}` : '/api/downloadpage';
  const response = await fetchStrapi<unknown>(url);
  return unwrapSingleEntity<DownloadPage>(response);
}

export async function getDownloadPage(locale: string = 'en'): Promise<DownloadPage | null> {
  return withLocaleFallback({
    locale,
    label: 'download page',
    fetcher: fetchDownloadPage,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

async function fetchDownloads(locale: string): Promise<Download[]> {
  const queryString = buildDownloadsQuery(locale);
  const url = queryString ? `/api/downloads?${queryString}` : '/api/downloads';
  const response = await fetchStrapi<unknown>(url);
  const downloads = unwrapCollection<DownloadRecord>(response);

  return downloads.map((item) => {
    const attributes = item.attributes || item;
    const id = item.id || attributes.id || 0;
    const title = attributes.Title || item.Title || '';

    return {
      id,
      documentId: item.documentId || attributes.documentId,
      Title: title,
      documentimage: attributes.documentimage || item.documentimage || null,
      document: attributes.document || item.document || null,
      createdAt: attributes.createdAt || item.createdAt,
      updatedAt: attributes.updatedAt || item.updatedAt,
      publishedAt: attributes.publishedAt || item.publishedAt,
      locale: attributes.locale || item.locale || locale,
    };
  });
}

export async function getDownloads(locale: string = 'en'): Promise<Download[]> {
  return withLocaleFallback({
    locale,
    label: 'downloads',
    fetcher: fetchDownloads,
    hasValue: (value) => value.length > 0,
    emptyValue: [],
  });
}

export { buildDownloadPageQuery, buildDownloadsQuery };
