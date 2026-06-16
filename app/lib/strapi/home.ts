import type { HomePage } from '../types';
import { fetchStrapi, unwrapSingleEntity, withLocaleFallback } from './client';

function buildHomePageQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[hero][populate][backgroundImageDesktop]', 'true');
  params.set('populate[hero][populate][backgroundImageMobile]', 'true');
  params.set('populate[hero][populate][primaryCta]', 'true');
  params.set('populate[hero][populate][labels]', 'true');
  params.set('populate[hero][populate][badges][populate][avatars]', 'true');
  params.set('populate[hero][populate][badges][populate][icon]', 'true');
  params.set('populate[stats][populate]', '*');
  params.set('populate[aboutSection][populate]', '*');
  params.set('populate[industrysupportsection][populate][supporttheindustrysection]', 'true');
  params.set('populate[industrysupportsection][populate][supporttheindustrycard]', 'true');
  params.set('populate[industrysupportsection][populate][backgroundImage]', 'true');
  params.set('populate[industrysupportsection][populate][plantimage]', 'true');
  params.set('populate[currentresearchsection][populate][sectionheader]', 'true');
  params.set('populate[datainsightssection][populate][statisticsrightheader]', 'true');
  params.set('populate[datainsightssection][populate][viewdatabutton]', 'true');
  params.set('populate[datainsightssection][populate][backgroundimage]', 'true');
  params.set('populate[newssectionheader]', 'true');
  params.set('populate[researchnetworksection][populate][sectionheader]', 'true');
  params.set('populate[researchnetworksection][populate][backgroundimage]', 'true');

  return params.toString();
}

async function fetchHomePage(locale: string): Promise<HomePage | null> {
  const queryString = buildHomePageQuery(locale);
  const url = queryString ? `/api/home-page?${queryString}` : '/api/home-page';
  const response = await fetchStrapi<any>(url);
  return unwrapSingleEntity<HomePage>(response);
}

export async function getHomePage(locale: string = 'en'): Promise<HomePage | null> {
  return withLocaleFallback({
    locale,
    label: 'home page',
    fetcher: fetchHomePage,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export { buildHomePageQuery };
