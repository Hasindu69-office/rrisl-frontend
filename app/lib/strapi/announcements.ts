import type { HeroAnnouncementItem } from '../types';
import { buildPopulateQuery } from './query';
import { fetchStrapi, unwrapCollection, withLocaleFallback } from './client';

async function fetchAnnouncements(locale: string): Promise<HeroAnnouncementItem[]> {
  const populateFields = ['image'];
  const populateQuery = buildPopulateQuery(populateFields);

  const queryParams = new URLSearchParams();
  queryParams.append('locale', locale);
  queryParams.append('filters[isActive][$eq]', 'true');
  queryParams.append('sort', 'publishedAt:desc');
  const queryString = queryParams.toString();

  const url = `/api/annoucements?${queryString}&${populateQuery}`;
  const response = await fetchStrapi<any>(url);
  const announcements = unwrapCollection<any>(response);

  return announcements.map((item: any) => {
    const attributes = item.attributes || item;

    return {
      id: item.id || attributes.id,
      documentId: item.documentId || attributes.documentId,
      title: attributes.title || item.title,
      slug: attributes.slug || item.slug,
      summary: attributes.summary || item.summary,
      image: attributes.image || item.image,
      isActive: attributes.isActive !== undefined ? attributes.isActive : item.isActive,
      createdAt: attributes.createdAt || item.createdAt,
      updatedAt: attributes.updatedAt || item.updatedAt,
      publishedAt: attributes.publishedAt || item.publishedAt,
      locale: attributes.locale || item.locale || locale,
    };
  });
}

export async function getAllAnnouncements(locale: string = 'en'): Promise<HeroAnnouncementItem[]> {
  return withLocaleFallback({
    locale,
    label: 'announcements',
    fetcher: fetchAnnouncements,
    hasValue: (value) => value.length > 0,
    emptyValue: [],
  });
}
