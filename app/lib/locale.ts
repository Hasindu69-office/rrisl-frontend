/**
 * Utility functions for handling locale in URLs
 */

/**
 * Get current locale from URL search params (client-side)
 */
export function getCurrentLocaleFromUrl(): string {
  if (typeof window === 'undefined') return 'en';
  
  const params = new URLSearchParams(window.location.search);
  return params.get('locale') || 'en';
}

/**
 * Add locale parameter to a URL
 * Preserves existing query parameters
 */
export function addLocaleToUrl(url: string, locale: string): string {
  // Don't add locale if it's already 'en' (default)
  if (locale === 'en') {
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
    params.set('locale', locale);
    
    const queryString = params.toString();
    return queryString ? `${path}?${queryString}` : `${path}?locale=${locale}`;
  } catch {
    // If parsing fails, manually append
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}locale=${locale}`;
  }
}

/**
 * Get locale from URL search params (server-side)
 */
export function getLocaleFromSearchParams(searchParams: { locale?: string }): string {
  return searchParams.locale || 'en';
}

