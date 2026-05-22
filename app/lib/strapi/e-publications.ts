import type { EPublicationsPage, Publication, PublicationCategory } from '../types';
import { fetchStrapi, unwrapCollection, unwrapSingleEntity, withLocaleFallback } from './client';

type PublicationCategoryRecord = Partial<PublicationCategory> & {
  id?: number;
  attributes?: Partial<PublicationCategory>;
  publication_category?: unknown;
};

type PublicationRecord = Partial<Publication> & {
  id?: number;
  attributes?: Partial<Publication>;
  publication_categories?: unknown;
  CoverImage?: unknown;
  PublicationDocument?: unknown;
};

function normalizeRelation<T>(relation: unknown): T | null {
  if (!relation) {
    return null;
  }

  if (typeof relation === 'object' && relation !== null && 'data' in relation) {
    const data = (relation as { data?: unknown }).data;
    if (!data || Array.isArray(data)) {
      return null;
    }

    if (typeof data === 'object' && data !== null && 'attributes' in data) {
      return {
        ...(data as { attributes?: object }).attributes,
        id: (data as { id?: number }).id,
      } as T;
    }

    return data as T;
  }

  if (typeof relation === 'object' && relation !== null && 'attributes' in relation) {
    return {
      ...((relation as { attributes?: object }).attributes || {}),
      id: (relation as { id?: number }).id,
    } as T;
  }

  return relation as T;
}

function normalizeRelationCollection<T>(relation: unknown): T[] {
  if (!relation) {
    return [];
  }

  if (typeof relation === 'object' && relation !== null && 'data' in relation) {
    const data = (relation as { data?: unknown }).data;

    if (!Array.isArray(data)) {
      const singleItem = normalizeRelation<T>(relation);
      return singleItem ? [singleItem] : [];
    }

    return data
      .map((item) => normalizeRelation<T>(item))
      .filter((item): item is T => item !== null);
  }

  if (Array.isArray(relation)) {
    return relation
      .map((item) => normalizeRelation<T>(item))
      .filter((item): item is T => item !== null);
  }

  const singleItem = normalizeRelation<T>(relation);
  return singleItem ? [singleItem] : [];
}

function buildEPublicationsPageQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[pagehero][populate][backgroundImage]', 'true');
  params.set('populate[pagehero][populate][Breadcrumb]', 'true');
  params.set('populate[ErrorMessage]', 'true');

  return params.toString();
}

function buildPublicationCategoriesQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('filters[IsActive][$eq]', 'true');
  params.set('sort[0]', 'DisplayOrder:asc');
  params.set('pagination[pageSize]', '100');
  params.set('populate[publication_category]', 'true');

  return params.toString();
}

function buildPublicationsQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('filters[IsActive][$eq]', 'true');
  params.set('sort[0]', 'DisplayOrder:asc');
  params.set('pagination[pageSize]', '100');
  params.set('populate[publication_categories][populate][publication_category]', 'true');
  params.set('populate[CoverImage]', 'true');
  params.set('populate[PublicationDocument]', 'true');

  return params.toString();
}

async function fetchEPublicationsPage(locale: string): Promise<EPublicationsPage | null> {
  const queryString = buildEPublicationsPageQuery(locale);
  const url = queryString ? `/api/e-publications-page?${queryString}` : '/api/e-publications-page';
  const response = await fetchStrapi<unknown>(url);
  return unwrapSingleEntity<EPublicationsPage>(response);
}

export async function getEPublicationsPage(locale: string = 'en'): Promise<EPublicationsPage | null> {
  return withLocaleFallback({
    locale,
    label: 'e-publications page',
    fetcher: fetchEPublicationsPage,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

async function fetchPublicationCategories(locale: string): Promise<PublicationCategory[]> {
  const queryString = buildPublicationCategoriesQuery(locale);
  const url = queryString
    ? `/api/publication-categories?${queryString}`
    : '/api/publication-categories';
  const response = await fetchStrapi<unknown>(url);
  const categories = unwrapCollection<PublicationCategoryRecord>(response);

  return categories.map((item) => {
    const attributes = item.attributes || item;

    return {
      id: item.id || attributes.id || 0,
      documentId: item.documentId || attributes.documentId,
      CategoryName: attributes.CategoryName || item.CategoryName || '',
      Slug: attributes.Slug || item.Slug,
      DisplayOrder: attributes.DisplayOrder || item.DisplayOrder || 0,
      IsActive: attributes.IsActive ?? item.IsActive,
      publication_category: normalizeRelation(attributes.publication_category || item.publication_category),
      createdAt: attributes.createdAt || item.createdAt,
      updatedAt: attributes.updatedAt || item.updatedAt,
      publishedAt: attributes.publishedAt || item.publishedAt,
      locale: attributes.locale || item.locale || locale,
    };
  });
}

export async function getPublicationCategories(locale: string = 'en'): Promise<PublicationCategory[]> {
  return withLocaleFallback({
    locale,
    label: 'publication categories',
    fetcher: fetchPublicationCategories,
    hasValue: (value) => value.length > 0,
    emptyValue: [],
  });
}

async function fetchPublications(locale: string): Promise<Publication[]> {
  const queryString = buildPublicationsQuery(locale);
  const url = queryString ? `/api/publications?${queryString}` : '/api/publications';
  const response = await fetchStrapi<unknown>(url);
  const publications = unwrapCollection<PublicationRecord>(response);

  return publications.map((item) => {
    const attributes = item.attributes || item;
    const title = attributes.title || item.title || '';

    return {
      id: item.id || attributes.id || 0,
      documentId: item.documentId || attributes.documentId,
      title,
      slug: attributes.slug || item.slug || '',
      publication_categories: normalizeRelationCollection(
        attributes.publication_categories || item.publication_categories
      ),
      CoverImage: normalizeRelation(attributes.CoverImage || item.CoverImage),
      CoverImgAltText: attributes.CoverImgAltText || item.CoverImgAltText,
      PublicationDocument: normalizeRelation(attributes.PublicationDocument || item.PublicationDocument),
      DisplayOrder: attributes.DisplayOrder || item.DisplayOrder || 0,
      IsActive: attributes.IsActive ?? item.IsActive,
      createdAt: attributes.createdAt || item.createdAt,
      updatedAt: attributes.updatedAt || item.updatedAt,
      publishedAt: attributes.publishedAt || item.publishedAt,
      locale: attributes.locale || item.locale || locale,
    };
  });
}

export async function getPublications(locale: string = 'en'): Promise<Publication[]> {
  return withLocaleFallback({
    locale,
    label: 'publications',
    fetcher: fetchPublications,
    hasValue: (value) => value.length > 0,
    emptyValue: [],
  });
}

export {
  buildEPublicationsPageQuery,
  buildPublicationCategoriesQuery,
  buildPublicationsQuery,
};
