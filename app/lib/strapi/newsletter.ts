import type { NewsletterSection } from '../types';
import { fetchStrapi, getStrapiUrl, unwrapSingleEntity, withLocaleFallback } from './client';

export type CreateNewsletterSubscriberInput = {
  Email: string;
  SourcePage: string;
  SubscribedAt: string;
  State?: 'Active' | 'Inactive';
};

function buildNewsletterSectionQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  return params.toString();
}

async function fetchNewsletterSection(locale: string): Promise<NewsletterSection | null> {
  const queryString = buildNewsletterSectionQuery(locale);
  const url = queryString
    ? `/api/newsletter-section?${queryString}`
    : '/api/newsletter-section';
  const response = await fetchStrapi<unknown>(url);
  return unwrapSingleEntity<NewsletterSection>(response);
}

export async function getNewsletterSection(
  locale: string = 'en'
): Promise<NewsletterSection | null> {
  return withLocaleFallback({
    locale,
    label: 'newsletter section',
    fetcher: fetchNewsletterSection,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export async function createNewsletterSubscriber(
  payload: CreateNewsletterSubscriberInput
): Promise<void> {
  const url = getStrapiUrl('/api/newsletter-subscribers');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        ...payload,
        State: payload.State ?? 'Active',
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    let errorMessage = 'Failed to subscribe to the newsletter.';

    try {
      const parsedError = JSON.parse(errorText) as {
        message?: string;
        error?: {
          message?: string;
          details?: {
            errors?: Array<{
              message?: string;
              path?: string[];
            }>;
          };
        };
      };

      const fieldError = parsedError.error?.details?.errors?.[0]?.message;
      errorMessage =
        fieldError ||
        parsedError.message ||
        parsedError.error?.message ||
        errorMessage;
    } catch {
      // Keep the default message when the response body is not JSON.
    }

    console.error(
      `[Strapi API] Error ${response.status} ${response.statusText} for ${url}`,
      errorText
    );
    throw new Error(errorMessage);
  }
}
