/**
 * Utility functions for handling locale in URLs
 */

/**
 * Normalize locale values to the format expected by Strapi.
 * Example: `si-LK` -> `si`, `ta-LK` -> `ta`
 */
export function normalizeLocale(locale: string | null | undefined): string {
  if (!locale) return 'en';
  if (locale === 'en') return 'en';
  if (locale.startsWith('si')) return 'si';
  if (locale.startsWith('ta')) return 'ta';
  return locale;
}

/**
 * Get current locale from URL search params (client-side)
 */
export function getCurrentLocaleFromUrl(): string {
  if (typeof window === 'undefined') return 'en';
  
  const params = new URLSearchParams(window.location.search);
  return normalizeLocale(params.get('locale'));
}

/**
 * Add locale parameter to a URL
 * Preserves existing query parameters
 */
export function addLocaleToUrl(url: string, locale: string): string {
  const normalizedLocale = normalizeLocale(locale);

  // Don't add locale if it's already 'en' (default)
  if (normalizedLocale === 'en') {
    return url;
  }

  // Don't modify external URLs
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
    return url;
  }

  // Handle relative URLs
  try {
    // Split URL into path and query string
    const [path, existingQuery] = url.split('?');
    const params = new URLSearchParams(existingQuery || '');
    params.set('locale', normalizedLocale);
    
    const queryString = params.toString();
    return queryString ? `${path}?${queryString}` : `${path}?locale=${normalizedLocale}`;
  } catch {
    // If parsing fails, manually append
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}locale=${normalizedLocale}`;
  }
}

/**
 * Get locale from URL search params (server-side)
 */
export function getLocaleFromSearchParams(searchParams: { locale?: string }): string {
  return normalizeLocale(searchParams.locale);
}

