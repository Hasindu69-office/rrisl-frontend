import type { BreadcrumbItem } from '@/app/components/shared/Breadcrumb';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';
import type { NewsAndBlogPage, NewsArticleEntity, NewsCategory } from '@/app/lib/types';

export const NEWS_AND_BLOGS_ROUTE = '/news-and-blogs';

export interface NewsCategoryViewModel {
  label: string;
  slug: string;
}

export interface NewsArticle {
  slug: string;
  title: string;
  summary: string;
  content: string[];
  publishedDate: string;
  categories: NewsCategoryViewModel[];
  featuredImage: string;
  featuredImageAlt: string;
  galleryImages: Array<{
    src: string;
    alt: string;
  }>;
  isFeatured: boolean;
}

export interface NewsPageLabels {
  title: string;
  topic: string;
  all: string;
  articleGallery: string;
  latestFromRrisl: string;
  featured: string;
  readFeaturedArticle: string;
  readArticle: string;
  backToAllArticles: string;
  relatedArticles: string;
  read: string;
  article: string;
}

export interface NewsPageHeroViewModel {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  backgroundImage?: string;
  backgroundImageAlt: string;
}

export interface NewsPageViewModel {
  hero: NewsPageHeroViewModel;
  labels: NewsPageLabels;
  categories: NewsCategoryViewModel[];
}

const NEWS_PAGE_FALLBACK: NewsPageViewModel = {
  hero: {
    title: 'News and Blogs',
    breadcrumbItems: [
      { label: 'Home', href: '/' },
      { label: 'News and Blogs' },
    ],
    backgroundImage: '/images/section6_bg.jpg',
    backgroundImageAlt: 'RRISL news and research updates',
  },
  labels: {
    title: 'News and Blogs',
    topic: 'Research updates, field stories, and industry insights.',
    all: 'All',
    articleGallery: 'Article Gallery',
    latestFromRrisl: 'Latest from RRISL',
    featured: 'Featured',
    readFeaturedArticle: 'Read Featured Article',
    readArticle: 'Read Article',
    backToAllArticles: 'Back to all articles',
    relatedArticles: 'Related Articles',
    read: 'Read',
    article: 'Article',
  },
  categories: [{ label: 'All', slug: 'all' }],
};

const NEWS_ARTICLE_FALLBACK_IMAGE = '/images/section6_img1.png';

function toCategorySlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function sortByPublishedDateDesc<T extends { publishedAt?: string; publishedDate?: string }>(items: T[]): T[] {
  return [...items].sort((left, right) => {
    const leftTime = new Date(left.publishedAt || left.publishedDate || 0).getTime();
    const rightTime = new Date(right.publishedAt || right.publishedDate || 0).getTime();
    return rightTime - leftTime;
  });
}

function mapBreadcrumbItems(page: NewsAndBlogPage | null | undefined): BreadcrumbItem[] {
  const breadcrumbItems =
    page?.pagehero?.Breadcrumb
      ?.filter((item) => item?.label)
      .map((item) => ({
        label: item.label,
        ...(item.href
          ? {
              href: item.href === '/news' ? NEWS_AND_BLOGS_ROUTE : item.href,
            }
          : {}),
      })) || [];

  return breadcrumbItems.length > 0
    ? breadcrumbItems
    : NEWS_PAGE_FALLBACK.hero.breadcrumbItems;
}

function mapCategory(category: NewsCategory | null | undefined): NewsCategoryViewModel | null {
  const label = category?.name?.trim();

  if (!label) {
    return null;
  }

  return {
    label,
    slug: category?.slug?.trim() || toCategorySlug(label),
  };
}

function uniqueCategories(categories: NewsCategoryViewModel[]): NewsCategoryViewModel[] {
  const seen = new Set<string>();

  return categories.filter((category) => {
    const key = category.slug;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export function formatArticleDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function mapNewsArticle(article: NewsArticleEntity | null | undefined): NewsArticle | null {
  const slug = article?.slug?.trim();
  const title = article?.title?.trim();

  if (!slug || !title) {
    return null;
  }

  const summary = article?.summary?.trim() || '';
  const content =
    article?.paragraph
      ?.map((item) => item?.paragraph?.trim())
      .filter((paragraph): paragraph is string => Boolean(paragraph)) || [];
  const featuredImage =
    getOptimizedImageUrl(article?.featuredImage, 'large') ||
    getOptimizedImageUrl(article?.featuredImage, 'medium') ||
    getStrapiImageUrl(article?.featuredImage) ||
    NEWS_ARTICLE_FALLBACK_IMAGE;
  const featuredImageAlt =
    article?.featuredImage?.alternativeText ||
    title;
  const galleryImages =
    article?.gallelryImages
      ?.map((image, index) => {
        const src =
          getOptimizedImageUrl(image, 'large') ||
          getOptimizedImageUrl(image, 'medium') ||
          getStrapiImageUrl(image);

        if (!src) {
          return null;
        }

        return {
          src,
          alt: image?.alternativeText || `${title} gallery image ${index + 1}`,
        };
      })
      .filter((image): image is { src: string; alt: string } => Boolean(image)) || [];
  const categories = uniqueCategories(
    (article?.news_categories || [])
      .map(mapCategory)
      .filter((category): category is NewsCategoryViewModel => Boolean(category))
  );

  return {
    slug,
    title,
    summary,
    content,
    publishedDate: article?.publishedAt || article?.createdAt || new Date(0).toISOString(),
    categories,
    featuredImage,
    featuredImageAlt,
    galleryImages,
    isFeatured: article?.isFeatured === true,
  };
}

export function mapNewsArticles(articles: NewsArticleEntity[]): NewsArticle[] {
  return sortByPublishedDateDesc(articles)
    .map(mapNewsArticle)
    .filter((article): article is NewsArticle => Boolean(article));
}

export function mapNewsPageData(
  localizedPage: NewsAndBlogPage | null | undefined,
  fallbackPage: NewsAndBlogPage | null | undefined,
  localizedCategories: NewsCategory[],
  fallbackCategories: NewsCategory[]
): NewsPageViewModel {
  const page = localizedPage || fallbackPage;
  const hero = page?.pagehero || fallbackPage?.pagehero;
  const heroImage = hero?.backgroundImage || null;
  const activeCategoriesSource =
    (localizedCategories.length > 0 ? localizedCategories : fallbackCategories)
      .filter((category) => category?.isActive !== false);
  const mappedCategories = uniqueCategories(
    activeCategoriesSource
      .map(mapCategory)
      .filter((category): category is NewsCategoryViewModel => Boolean(category))
  );

  return {
    hero: {
      title: hero?.PageTitle?.trim() || NEWS_PAGE_FALLBACK.hero.title,
      breadcrumbItems: mapBreadcrumbItems(page),
      backgroundImage:
        getOptimizedImageUrl(heroImage, 'large') ||
        getOptimizedImageUrl(heroImage, 'medium') ||
        getStrapiImageUrl(heroImage) ||
        NEWS_PAGE_FALLBACK.hero.backgroundImage,
      backgroundImageAlt:
        hero?.backgroundImageAlt?.trim() ||
        heroImage?.alternativeText ||
        NEWS_PAGE_FALLBACK.hero.backgroundImageAlt,
    },
    labels: {
      title: hero?.PageTitle?.trim() || NEWS_PAGE_FALLBACK.labels.title,
      topic: page?.topic?.trim() || NEWS_PAGE_FALLBACK.labels.topic,
      all: page?.alllabel?.trim() || NEWS_PAGE_FALLBACK.labels.all,
      articleGallery:
        page?.articlegallerylabel?.trim() || NEWS_PAGE_FALLBACK.labels.articleGallery,
      latestFromRrisl: page?.latestfromrrisllabel?.trim() || NEWS_PAGE_FALLBACK.labels.latestFromRrisl,
      featured: page?.featuredlabel?.trim() || NEWS_PAGE_FALLBACK.labels.featured,
      readFeaturedArticle:
        page?.readfeaturedarticlebuttonlabel?.trim() || NEWS_PAGE_FALLBACK.labels.readFeaturedArticle,
      readArticle: page?.readarticlelabel?.trim() || NEWS_PAGE_FALLBACK.labels.readArticle,
      backToAllArticles:
        page?.Backtoallarticleslabel?.trim() || NEWS_PAGE_FALLBACK.labels.backToAllArticles,
      relatedArticles:
        page?.relatedarticleslabel?.trim() || NEWS_PAGE_FALLBACK.labels.relatedArticles,
      read: page?.readlabel?.trim() || NEWS_PAGE_FALLBACK.labels.read,
      article: page?.articlelabel?.trim() || NEWS_PAGE_FALLBACK.labels.article,
    },
    categories: [
      { label: page?.alllabel?.trim() || NEWS_PAGE_FALLBACK.labels.all, slug: 'all' },
      ...mappedCategories,
    ],
  };
}

export function getFeaturedArticle(articles: NewsArticle[]): NewsArticle | null {
  if (articles.length === 0) {
    return null;
  }

  return articles.find((article) => article.isFeatured) || articles[0];
}

export function filterArticlesByCategory(
  articles: NewsArticle[],
  selectedCategorySlug: string
): NewsArticle[] {
  if (!selectedCategorySlug || selectedCategorySlug === 'all') {
    return articles;
  }

  return articles.filter((article) =>
    article.categories.some((category) => category.slug === selectedCategorySlug)
  );
}

export function getArticleBySlug(articles: NewsArticle[], slug: string): NewsArticle | null {
  return articles.find((article) => article.slug === slug) || null;
}

export function getPrimaryCategory(article: NewsArticle): NewsCategoryViewModel | null {
  return article.categories[0] || null;
}

export function getRelatedArticles(
  article: NewsArticle,
  articles: NewsArticle[],
  limit = 3
): NewsArticle[] {
  const articleCategorySlugs = new Set(article.categories.map((category) => category.slug));
  const remaining = articles.filter((item) => item.slug !== article.slug);

  const matching = remaining.filter((item) =>
    item.categories.some((category) => articleCategorySlugs.has(category.slug))
  );
  const nonMatching = remaining.filter((item) =>
    item.categories.every((category) => !articleCategorySlugs.has(category.slug))
  );

  return [...matching, ...nonMatching].slice(0, limit);
}

export function getNewsEmptyState(page: NewsAndBlogPage | null | undefined): {
  title: string;
  description: string;
} {
  const fallbackTitle = 'No articles found';
  const fallbackDescription = 'Try another category to explore more updates.';

  return {
    title:
      page?.ErrorMessage?.title?.trim() ||
      page?.ErrorMessage?.Title?.trim() ||
      fallbackTitle,
    description:
      page?.ErrorMessage?.description?.trim() ||
      page?.ErrorMessage?.Description?.trim() ||
      fallbackDescription,
  };
}
