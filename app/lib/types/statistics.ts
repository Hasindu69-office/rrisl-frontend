import type { StrapiMedia } from './strapi';

export interface StatisticsContentEntry {
  id: number;
  documentId?: string;
  productionstatistic: StrapiMedia | null;
  exportandconsumptionstats: StrapiMedia | null;
  pricetrendstat: StrapiMedia | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}
