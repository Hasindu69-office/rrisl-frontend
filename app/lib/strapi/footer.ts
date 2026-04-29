import type { Footer } from '../types';
import { fetchStrapi, unwrapSingleEntity, withLocaleFallback } from './client';

function buildFooterQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[FooterLogo]', 'true');
  params.set('populate[FooterBackgroundImage]', 'true');
  params.set('populate[TopicandLinks][populate][Links]', 'true');
  params.set('populate[ContactInfo][populate][PhoneNumber]', 'true');
  params.set('populate[SocialLinks][populate][Icon]', 'true');

  return params.toString();
}

async function fetchFooter(locale: string): Promise<Footer | null> {
  const queryString = buildFooterQuery(locale);
  const url = queryString ? `/api/footer?${queryString}` : '/api/footer';
  const response = await fetchStrapi<unknown>(url);

  return unwrapSingleEntity<Footer>(response);
}

export async function getFooter(locale: string = 'en'): Promise<Footer | null> {
  return withLocaleFallback({
    locale,
    label: 'footer',
    fetcher: fetchFooter,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export { buildFooterQuery };
