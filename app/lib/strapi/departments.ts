import type { DepartmentSingleTypePage } from '../types';
import { fetchStrapi, unwrapSingleEntity, withLocaleFallback } from './client';

function buildDepartmentQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[pagehero][populate][backgroundImage]', 'true');
  params.set('populate[pagehero][populate][Breadcrumb]', 'true');
  params.set('populate[introductionsection][populate][sectionheader]', 'true');
  params.set('populate[introductionsection][populate][points][populate][icon]', 'true');
  params.set('populate[servicesection][populate][sectionheader]', 'true');
  params.set('populate[servicesection][populate][servicecards][populate][icon]', 'true');
  params.set('populate[servicesection][populate][servicecards][populate][image]', 'true');
  params.set('populate[researchstaffsection][populate][sectionheader]', 'true');
  params.set('populate[researchstaffsection][populate][staff][populate][email]', 'true');
  params.set('populate[researchstaffsection][populate][staff][populate][paragraph]', 'true');
  params.set('populate[researchstaffsection][populate][staff][populate][portrait]', 'true');
  params.set('populate[researchhighlightssection][populate][researchhighlightcards][populate][icon]', 'true');
  params.set(
    'populate[researchhighlightssection][populate][researchhighlightcards][populate][cards][populate][paragraph]',
    'true'
  );
  params.set(
    'populate[researchhighlightssection][populate][researchhighlightcards][populate][cards][populate][points]',
    'true'
  );
  params.set(
    'populate[researchhighlightssection][populate][researchhighlightcards][populate][cards][populate][galleryimages]',
    'true'
  );
  params.set('populate[currentresearchprojectsection][populate][sectionheader]', 'true');
  params.set(
    'populate[currentresearchprojectsection][populate][researchprojects][populate][image]',
    'true'
  );

  return params.toString();
}

function getDepartmentApiSlug(slug: string): string {
  return `${slug}-department`;
}

async function fetchDepartmentPage(
  slug: string,
  locale: string
): Promise<DepartmentSingleTypePage | null> {
  const apiSlug = getDepartmentApiSlug(slug);
  const queryString = buildDepartmentQuery(locale);
  const url = queryString ? `/api/${apiSlug}?${queryString}` : `/api/${apiSlug}`;
  const response = await fetchStrapi<any>(url);
  const page = unwrapSingleEntity<DepartmentSingleTypePage>(response);

  if (page?.slug && page.slug !== slug && page.slug !== apiSlug) {
    return null;
  }

  return page;
}

export async function getDepartmentPage(
  slug: string,
  locale: string = 'en'
): Promise<DepartmentSingleTypePage | null> {
  return withLocaleFallback({
    locale,
    label: `${slug} department page`,
    fetcher: (currentLocale) => fetchDepartmentPage(slug, currentLocale),
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export { buildDepartmentQuery, getDepartmentApiSlug };
