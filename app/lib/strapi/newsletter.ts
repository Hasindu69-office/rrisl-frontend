import type { NewsletterSection } from '../types';
import { fetchStrapi, getStrapiUrl, unwrapSingleEntity, withLocaleFallback } from './client';

export type CreateNewsletterSubscriberInput = {
  Email: string;
  SourcePage: string;
  SubscribedAt: string;
  State?: 'Active' | 'Inactive';
};

export class NewsletterSubscriptionError extends Error {
  constructor(
    message: string,
    public readonly code: 'already_subscribed' | 'validation_error' | 'unknown_error'
  ) {
    super(message);
    this.name = 'NewsletterSubscriptionError';
  }
}

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
    let errorCode: NewsletterSubscriptionError['code'] = 'unknown_error';

    try {
      const parsedError = JSON.parse(errorText) as {
        message?: string;
        error?: {
          name?: string;
          message?: string;
          details?: {
            errors?: Array<{
              message?: string;
              path?: string[];
            }>;
          };
        };
      };

      const fieldErrors = parsedError.error?.details?.errors || [];
      const emailUniqueError = fieldErrors.find((fieldError) => {
        const fieldPath = fieldError.path?.join('.');
        return fieldPath === 'Email' && fieldError.message === 'This attribute must be unique';
      });
      const fieldError = fieldErrors[0]?.message;

      if (emailUniqueError) {
        errorMessage = 'This email is already subscribed.';
        errorCode = 'already_subscribed';
      } else {
        errorCode = parsedError.error?.name === 'ValidationError' ? 'validation_error' : errorCode;
      }

      errorMessage =
        emailUniqueError
          ? errorMessage
          : fieldError ||
            parsedError.message ||
            parsedError.error?.message ||
            errorMessage;
    } catch {
      // Keep the default message when the response body is not JSON.
    }

    if (errorCode !== 'already_subscribed') {
      console.error(
        `[Strapi API] Error ${response.status} ${response.statusText} for ${url}`,
        errorText
      );
    }

    throw new NewsletterSubscriptionError(errorMessage, errorCode);
  }
}
