import type { HomepageStatisticsSectionItem } from '../types';
import { fetchStrapi, unwrapCollection, withLocaleFallback } from './client';

async function fetchHomepageStatistics(
  locale: string
): Promise<HomepageStatisticsSectionItem[]> {
  const queryParams = new URLSearchParams();
  queryParams.append('locale', locale);

  const queryString = queryParams.toString();
  const url = queryString
    ? `/api/homepage-statistics-sections?${queryString}`
    : '/api/homepage-statistics-sections';
  const response = await fetchStrapi<any>(url);
  const statistics = unwrapCollection<any>(response);

  return statistics.map((item: any) => {
    const attributes = item.attributes || item;

    return {
      id: item.id || attributes.id,
      documentId: item.documentId || attributes.documentId,
      label: attributes.label || item.label || '',
      value: attributes.value ?? item.value ?? 0,
      createdAt: attributes.createdAt || item.createdAt,
      updatedAt: attributes.updatedAt || item.updatedAt,
      publishedAt: attributes.publishedAt || item.publishedAt,
      locale: attributes.locale || item.locale || locale,
    };
  });
}

export async function getHomepageStatistics(
  locale: string = 'en'
): Promise<HomepageStatisticsSectionItem[]> {
  return withLocaleFallback({
    locale,
    label: 'homepage statistics',
    fetcher: fetchHomepageStatistics,
    hasValue: (value) => value.length > 0,
    emptyValue: [],
  });
}
