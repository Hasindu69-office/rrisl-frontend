// Strapi API Client
import type { GlobalLayout, Menu, HomePage, StrapiResponse, HeroAnnouncementItem } from './types';

const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

/**
 * Get the full Strapi API URL
 */
export function getStrapiUrl(path: string): string {
  const baseUrl = STRAPI_API_URL.replace(/\/$/, '');
  const apiPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${apiPath}`;
}

/**
 * Get Strapi image URL
 */
export function getStrapiImageUrl(image: any): string | null {
  if (!image) return null;
  
  // Handle Strapi v4+ response format with data.attributes
  if (image.data?.attributes?.url) {
    const url = image.data.attributes.url;
    return url.startsWith('http') ? url : `${STRAPI_API_URL}${url}`;
  }
  
  // Handle populated image object (direct attributes)
  if (image.attributes?.url) {
    const url = image.attributes.url;
    return url.startsWith('http') ? url : `${STRAPI_API_URL}${url}`;
  }
  
  // Handle direct image object (already populated)
  if (image.url) {
    return image.url.startsWith('http') ? image.url : `${STRAPI_API_URL}${image.url}`;
  }
  
  return null;
}

/**
 * Get optimized Strapi image URL with format
 */
export function getOptimizedImageUrl(
  image: any,
  format: 'thumbnail' | 'small' | 'medium' | 'large' = 'small'
): string | null {
  if (!image) return null;
  
  // Try to get optimized format from various possible structures
  let formats = null;
  
  if (image.data?.attributes?.formats) {
    formats = image.data.attributes.formats;
  } else if (image.attributes?.formats) {
    formats = image.attributes.formats;
  } else if (image.formats) {
    formats = image.formats;
  }
  
  if (formats && formats[format]?.url) {
    const formatUrl = formats[format].url;
    return formatUrl.startsWith('http') ? formatUrl : `${STRAPI_API_URL}${formatUrl}`;
  }
  
  // Fallback to original
  return getStrapiImageUrl(image);
}

/**
 * Build query string with proper encoding for Strapi API
 */
function buildQueryString(params: Record<string, string | undefined>): string {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value);
    }
  });
  return queryParams.toString();
}

/**
 * Fetch data from Strapi API
 * Returns null for 404 errors (translation not found) to allow fallback
 * Throws errors for other HTTP errors (500, etc.)
 */
async function fetchStrapi<T>(path: string, options: RequestInit = {}): Promise<T | null> {
  const url = getStrapiUrl(path);
  
  // Log API calls in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Strapi API] Fetching: ${url}`);
  }
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    // Add cache revalidation for Next.js
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  // Handle 404 as "not found" (translation doesn't exist) - return null for graceful fallback
  if (response.status === 404) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Strapi API] 404 Not Found for ${url} - translation may not exist, will fallback to default locale`);
    }
    return null;
  }

  // For other errors, throw to indicate a real problem
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    console.error(`[Strapi API] Error ${response.status} ${response.statusText} for ${url}`, errorText);
    throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  // Log response structure in development for debugging
  if (process.env.NODE_ENV === 'development' && path.includes('locale=')) {
    console.log(`[Strapi API] Response structure for ${url}:`, {
      hasData: !!data.data,
      isArray: Array.isArray(data.data),
      dataLength: Array.isArray(data.data) ? data.data.length : 'N/A',
      hasAttributes: !!(data.data?.attributes || data.attributes),
    });
  }
  
  return data;
}

/**
 * Fetch Global Layout
 */
export async function getGlobalLayout(locale: string = 'en'): Promise<GlobalLayout | null> {
  try {
    const queryString = buildQueryString({
      populate: 'logo',
      locale: locale,
    });
    
    const response = await fetchStrapi<any>(
      `/api/global-layout?${queryString}`
    );
    
    // If response is null (404), fallback to default locale
    if (response === null) {
      if (locale !== 'en') {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Strapi API] No translation found for locale "${locale}", falling back to "en" for global layout`);
        }
        return getGlobalLayout('en');
      }
      return null;
    }
    
    let result: GlobalLayout | null = null;
    
    // Handle Strapi v4 response format with data wrapper
    if (response.data) {
      // Handle array response
      if (Array.isArray(response.data)) {
        result = response.data.length > 0 ? response.data[0] : null;
      } else {
        // Handle single object response
        result = response.data;
      }
    } else if (response.id || response.attributes) {
      // Handle direct response (if not wrapped)
      result = response;
    }
    
    // If no data found and locale is not 'en', fallback to default locale
    if (!result && locale !== 'en') {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Strapi API] No translation found for locale "${locale}", falling back to "en" for global layout`);
      }
      return getGlobalLayout('en');
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching global layout:', error);
    // Fallback to default locale if requested locale fails
    if (locale !== 'en') {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Strapi API] Error fetching locale "${locale}", falling back to "en" for global layout`);
      }
      return getGlobalLayout('en');
    }
    return null;
  }
}

/**
 * Fetch Menu by slug
 */
export async function getMenuBySlug(slug: string, locale: string = 'en'): Promise<Menu | null> {
  try {
    // Build query string with proper encoding
    const queryString = buildQueryString({
      'filters[slug][$eq]': slug,
      locale: locale,
      populate: '*',
    });
    
    const response = await fetchStrapi<any>(
      `/api/tree-menus/menu?${queryString}`
    );
    
    // If response is null (404), fallback to default locale
    if (response === null) {
      if (locale !== 'en') {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Strapi API] No translation found for locale "${locale}", falling back to "en" for menu with slug "${slug}"`);
        }
        return getMenuBySlug(slug, 'en');
      }
      return null;
    }
    
    let result: Menu | null = null;
    
    // Handle Strapi v4 response format with data wrapper
    if (response.data) {
      // If data is an array, get the first item
      if (Array.isArray(response.data)) {
        result = response.data.length > 0 ? response.data[0] : null;
      } else {
        // If data is a single object
        result = response.data;
      }
    } else if (response.id || response.attributes) {
      // Handle direct response (if not wrapped)
      result = response;
    }
    
    // If no data found and locale is not 'en', fallback to default locale
    if (!result && locale !== 'en') {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Strapi API] No translation found for locale "${locale}", falling back to "en" for menu with slug "${slug}"`);
      }
      return getMenuBySlug(slug, 'en');
    }
    
    return result;
  } catch (error) {
    console.error(`Error fetching menu with slug "${slug}" and locale "${locale}":`, error);
    // Fallback to default locale if requested locale fails
    if (locale !== 'en') {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Strapi API] Error fetching locale "${locale}", falling back to "en" for menu with slug "${slug}"`);
      }
      return getMenuBySlug(slug, 'en');
    }
    return null;
  }
}

/**
 * Build Strapi populate query string from an array of field paths
 * This makes it easier to manage complex populate queries
 * 
 * @example
 * buildPopulateQuery(['hero', 'hero.backgroundImageDesktop', 'hero.badges.avatars'])
 * // Returns: "populate[0]=hero&populate[1]=hero.backgroundImageDesktop&populate[2]=hero.badges.avatars"
 */
export function buildPopulateQuery(fields: string[]): string {
  return fields
    .map((field, index) => `populate[${index}]=${encodeURIComponent(field)}`)
    .join('&');
}

/**
 * Get home page populate fields
 * Centralized configuration for home page data population
 */
function getHomePagePopulateFields(): string[] {
  return [
    'hero',
    'hero.backgroundImageDesktop',
    'hero.backgroundImageMobile',
    'hero.primaryCta',
    'hero.badges',
    'hero.badges.avatars',
    'hero.labels',
    'hero.hero_news_items',
    'hero.hero_news_items.featuredImage',
    'hero.hero_annoucements_items',
    'hero.hero_annoucements_items.image',
  ];
}

/**
 * Fetch Home Page with all required fields populated
 */
export async function getHomePage(locale: string = 'en'): Promise<HomePage | null> {
  try {
    const populateFields = getHomePagePopulateFields();
    const populateQuery = buildPopulateQuery(populateFields);
    
    // Build query string with locale and populate
    const queryString = buildQueryString({
      locale: locale,
    });
    
    // Combine locale query with populate query
    const url = `/api/home-page?${queryString}&${populateQuery}`;
    
    const response = await fetchStrapi<any>(url);
    
    // If response is null (404), fallback to default locale
    if (response === null) {
      if (locale !== 'en') {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Strapi API] No translation found for locale "${locale}", falling back to "en" for home page`);
        }
        return getHomePage('en');
      }
      return null;
    }
    
    let result: HomePage | null = null;
    
    // Handle Strapi v4 response format with data wrapper
    if (response.data) {
      // Handle array response
      if (Array.isArray(response.data)) {
        result = response.data.length > 0 ? response.data[0] : null;
      } else {
        // Handle single object response
        result = response.data;
      }
    } else if (response.id || response.attributes) {
      // Handle direct response (if not wrapped)
      result = response;
    }
    
    // If no data found and locale is not 'en', fallback to default locale
    if (!result && locale !== 'en') {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Strapi API] No translation found for locale "${locale}", falling back to "en" for home page`);
      }
      return getHomePage('en');
    }
    
    return result;
  } catch (error) {
    console.error(`Error fetching home page with locale "${locale}":`, error);
    // Fallback to default locale if requested locale fails
    if (locale !== 'en') {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Strapi API] Error fetching locale "${locale}", falling back to "en" for home page`);
      }
      return getHomePage('en');
    }
    return null;
  }
}

/**
 * Fetch all active announcements from Strapi
 */
export async function getAllAnnouncements(locale: string = 'en'): Promise<HeroAnnouncementItem[]> {
  try {
    const populateFields = ['image'];
    const populateQuery = buildPopulateQuery(populateFields);
    
    // Build query string with locale, populate, and filters
    // Note: URLSearchParams will convert boolean to string, which Strapi accepts
    const queryParams = new URLSearchParams();
    queryParams.append('locale', locale);
    queryParams.append('filters[isActive][$eq]', 'true');
    queryParams.append('sort', 'publishedAt:desc');
    const queryString = queryParams.toString();
    
    // Combine query with populate
    const url = `/api/annoucements?${queryString}&${populateQuery}`;
    
    const response = await fetchStrapi<any>(url);
    
    if (!response) {
      // Fallback to English if no data found for current locale
      if (locale !== 'en') {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Strapi API] No announcements found for locale "${locale}", falling back to "en"`);
        }
        return getAllAnnouncements('en');
      }
      return [];
    }
    
    let announcements: HeroAnnouncementItem[] = [];
    
    // Handle Strapi v4 response format with data wrapper
    if (response.data) {
      announcements = Array.isArray(response.data) ? response.data : [response.data];
    } else if (Array.isArray(response)) {
      announcements = response;
    } else if (response.id) {
      announcements = [response];
    }
    
    // If no announcements found and locale is not 'en', fallback to default locale
    if (announcements.length === 0 && locale !== 'en') {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Strapi API] No announcements found for locale "${locale}", falling back to "en"`);
      }
      return getAllAnnouncements('en');
    }
    
    // Map to HeroAnnouncementItem format
    return announcements.map((item: any) => {
      // Handle Strapi v4 response format
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
  } catch (error) {
    console.error(`Error fetching announcements with locale "${locale}":`, error);
    // Fallback to English if requested locale fails
    if (locale !== 'en') {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Strapi API] Error fetching locale "${locale}", falling back to "en" for announcements`);
      }
      return getAllAnnouncements('en');
    }
    return [];
  }
}

