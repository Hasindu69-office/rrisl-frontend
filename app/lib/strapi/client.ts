const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
const DEFAULT_LOCALE = 'en';

export function getStrapiUrl(path: string): string {
  const baseUrl = STRAPI_API_URL.replace(/\/$/, '');
  const apiPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${apiPath}`;
}

export async function fetchStrapi<T>(path: string, options: RequestInit = {}): Promise<T | null> {
  const url = getStrapiUrl(path);

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Strapi API] Fetching: ${url}`);
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    next: { revalidate: 60 },
  });

  if (response.status === 404) {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[Strapi API] 404 Not Found for ${url} - translation may not exist, will fallback to default locale`
      );
    }
    return null;
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    console.error(`[Strapi API] Error ${response.status} ${response.statusText} for ${url}`, errorText);
    throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

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

export function unwrapSingleEntity<T>(response: any): T | null {
  if (!response) {
    return null;
  }

  if (response.data) {
    if (Array.isArray(response.data)) {
      return response.data.length > 0 ? response.data[0] : null;
    }

    return response.data;
  }

  if (response.id || response.attributes) {
    return response;
  }

  return null;
}

export function unwrapCollection<T>(response: any): T[] {
  if (!response) {
    return [];
  }

  if (response.data) {
    return Array.isArray(response.data) ? response.data : [response.data];
  }

  if (Array.isArray(response)) {
    return response;
  }

  if (response.id) {
    return [response];
  }

  return [];
}

type LocaleFallbackOptions<T> = {
  locale?: string;
  label: string;
  fetcher: (locale: string) => Promise<T>;
  hasValue: (value: T) => boolean;
  emptyValue: T;
};

export async function withLocaleFallback<T>({
  locale = DEFAULT_LOCALE,
  label,
  fetcher,
  hasValue,
  emptyValue,
}: LocaleFallbackOptions<T>): Promise<T> {
  try {
    const result = await fetcher(locale);

    if (hasValue(result) || locale === DEFAULT_LOCALE) {
      return result;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[Strapi API] No translation found for locale "${locale}", falling back to "${DEFAULT_LOCALE}" for ${label}`
      );
    }

    return withLocaleFallback({
      locale: DEFAULT_LOCALE,
      label,
      fetcher,
      hasValue,
      emptyValue,
    });
  } catch (error) {
    console.error(`Error fetching ${label} with locale "${locale}":`, error);

    if (locale !== DEFAULT_LOCALE) {
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `[Strapi API] Error fetching locale "${locale}", falling back to "${DEFAULT_LOCALE}" for ${label}`
        );
      }

      return withLocaleFallback({
        locale: DEFAULT_LOCALE,
        label,
        fetcher,
        hasValue,
        emptyValue,
      });
    }

    return emptyValue;
  }
}

export { DEFAULT_LOCALE, STRAPI_API_URL };
