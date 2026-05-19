import type { ContactPage, ContactSubject } from '../types';
import { fetchStrapi, getStrapiUrl, unwrapCollection, unwrapSingleEntity, withLocaleFallback } from './client';

export type CreateContactMessageInput = {
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  subject: string;
  message: string;
};

function buildContactPageQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[pagehero][populate][backgroundImage]', 'true');
  params.set('populate[pagehero][populate][Breadcrumb]', 'true');
  params.set('populate[contactinformationdetails][populate][phonenumbers]', 'true');
  params.set('populate[contactinformationdetails][populate][contactformlabels]', 'true');
  params.set('populate[sociallinkscontact]', 'true');

  return params.toString();
}

function buildContactSubjectsQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('sort[0]', 'sortorder:asc');

  return params.toString();
}

async function fetchContactPage(locale: string): Promise<ContactPage | null> {
  const queryString = buildContactPageQuery(locale);
  const url = queryString ? `/api/contact-page?${queryString}` : '/api/contact-page';
  const response = await fetchStrapi<unknown>(url);

  return unwrapSingleEntity<ContactPage>(response);
}

async function fetchContactSubjects(locale: string): Promise<ContactSubject[]> {
  const queryString = buildContactSubjectsQuery(locale);
  const url = queryString ? `/api/contact-subjects?${queryString}` : '/api/contact-subjects';
  const response = await fetchStrapi<unknown>(url);

  return unwrapCollection<ContactSubject>(response);
}

export async function getContactPage(locale: string = 'en'): Promise<ContactPage | null> {
  return withLocaleFallback({
    locale,
    label: 'contact page',
    fetcher: fetchContactPage,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export async function getContactSubjects(locale: string = 'en'): Promise<ContactSubject[]> {
  return withLocaleFallback({
    locale,
    label: 'contact subjects',
    fetcher: fetchContactSubjects,
    hasValue: (value) => value.length > 0,
    emptyValue: [],
  });
}

export async function createContactMessage(
  payload: CreateContactMessageInput
): Promise<void> {
  const url = getStrapiUrl('/api/contact-messages');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: payload,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    let errorMessage = 'Failed to create contact message.';

    try {
      const parsedError = JSON.parse(errorText) as {
        message?: string;
        error?: {
          message?: string;
        };
      };

      errorMessage = parsedError.message || parsedError.error?.message || errorMessage;
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

export { buildContactPageQuery, buildContactSubjectsQuery };
