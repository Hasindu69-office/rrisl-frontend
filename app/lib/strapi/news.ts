import type { NewsAndBlogPage, NewsArticleEntity, NewsCategory } from '../types';
import { fetchStrapi, unwrapCollection, unwrapSingleEntity, withLocaleFallback } from './client';

function setLocale(params: URLSearchParams, locale: string) {
  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }
}

export function buildNewsAndBlogPageQuery(locale: string): string {
  const params = new URLSearchParams();

  setLocale(params, locale);
  params.set('populate[pagehero][populate][backgroundImage]', 'true');
  params.set('populate[pagehero][populate][Breadcrumb]', 'true');
  params.set('populate[ErrorMessage]', 'true');

  return params.toString();
}

export function buildAllNewsArticlesQuery(locale: string): string {
  const params = new URLSearchParams();

  setLocale(params, locale);
  params.set('populate[featuredImage]', 'true');
  params.set('populate[gallelryImages]', 'true');
  params.set('populate[paragraph]', 'true');
  params.set('populate[news_categories]', 'true');
  params.set('sort[0]', 'publishedAt:desc');

  return params.toString();
}

export function buildNewsArticleBySlugQuery(slug: string, locale: string): string {
  const params = new URLSearchParams();

  setLocale(params, locale);
  params.set('filters[slug][$eq]', slug);
  params.set('populate[featuredImage]', 'true');
  params.set('populate[gallelryImages]', 'true');
  params.set('populate[paragraph]', 'true');
  params.set('populate[news_categories]', 'true');

  return params.toString();
}

export function buildNewsCategoriesQuery(locale: string): string {
  const params = new URLSearchParams();

  setLocale(params, locale);
  params.set('sort[0]', 'sortOrder:asc');

  return params.toString();
}

async function fetchNewsAndBlogPage(locale: string): Promise<NewsAndBlogPage | null> {
  const queryString = buildNewsAndBlogPageQuery(locale);
  const url = queryString ? `/api/news-and-blog-page?${queryString}` : '/api/news-and-blog-page';
  const response = await fetchStrapi<any>(url);
  return unwrapSingleEntity<NewsAndBlogPage>(response);
}

async function fetchAllNewsArticles(locale: string): Promise<NewsArticleEntity[]> {
  const queryString = buildAllNewsArticlesQuery(locale);
  const response = await fetchStrapi<any>(`/api/news?${queryString}`);
  return unwrapCollection<NewsArticleEntity>(response);
}

async function fetchNewsArticleBySlug(slug: string, locale: string): Promise<NewsArticleEntity | null> {
  const queryString = buildNewsArticleBySlugQuery(slug, locale);
  const response = await fetchStrapi<any>(`/api/news?${queryString}`);
  return unwrapSingleEntity<NewsArticleEntity>(response);
}

async function fetchNewsCategories(locale: string): Promise<NewsCategory[]> {
  const queryString = buildNewsCategoriesQuery(locale);
  const response = await fetchStrapi<any>(`/api/news-categories?${queryString}`);
  return unwrapCollection<NewsCategory>(response);
}

export async function getNewsAndBlogPage(locale: string = 'en'): Promise<NewsAndBlogPage | null> {
  return withLocaleFallback({
    locale,
    label: 'news and blog page',
    fetcher: fetchNewsAndBlogPage,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export async function getAllNewsArticles(locale: string = 'en'): Promise<NewsArticleEntity[]> {
  return withLocaleFallback({
    locale,
    label: 'news articles',
    fetcher: fetchAllNewsArticles,
    hasValue: (value) => value.length > 0,
    emptyValue: [],
  });
}

export async function getNewsArticleBySlug(slug: string, locale: string = 'en'): Promise<NewsArticleEntity | null> {
  return withLocaleFallback({
    locale,
    label: `news article "${slug}"`,
    fetcher: (nextLocale) => fetchNewsArticleBySlug(slug, nextLocale),
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export async function getNewsCategories(locale: string = 'en'): Promise<NewsCategory[]> {
  return withLocaleFallback({
    locale,
    label: 'news categories',
    fetcher: fetchNewsCategories,
    hasValue: (value) => value.length > 0,
    emptyValue: [],
  });
}
