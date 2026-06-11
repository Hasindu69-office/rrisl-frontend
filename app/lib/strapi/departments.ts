import type { DepartmentSingleTypePage } from '../types';
import { fetchStrapi, unwrapSingleEntity, withLocaleFallback } from './client';

type DepartmentFieldSet = Set<string>;

function buildDepartmentBaseQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate', '*');

  return params.toString();
}

function buildDepartmentQuery(locale: string, availableFields?: DepartmentFieldSet): string {
  const params = new URLSearchParams();
  const hasField = (field: string) => !availableFields || availableFields.has(field);
  const setPopulate = (field: string, key: string, value: string = 'true') => {
    if (hasField(field)) {
      params.set(key, value);
    }
  };

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  setPopulate('pagehero', 'populate[pagehero][populate][backgroundImage]');
  setPopulate('pagehero', 'populate[pagehero][populate][Breadcrumb]');
  setPopulate('introductionsection', 'populate[introductionsection][populate][sectionheader]');
  setPopulate('introductionsection', 'populate[introductionsection][populate][points][populate][icon]');
  setPopulate('servicesection', 'populate[servicesection][populate][sectionheader]');
  setPopulate('servicesection', 'populate[servicesection][populate][servicecards][populate][icon]');
  setPopulate('servicesection', 'populate[servicesection][populate][servicecards][populate][image]');
  setPopulate('researchstaffsection', 'populate[researchstaffsection][populate][sectionheader]');
  setPopulate('researchstaffsection', 'populate[researchstaffsection][populate][staff][populate][email]');
  setPopulate('researchstaffsection', 'populate[researchstaffsection][populate][staff][populate][paragraph]');
  setPopulate('researchstaffsection', 'populate[researchstaffsection][populate][staff][populate][portrait]');
  setPopulate(
    'researchhighlightssection',
    'populate[researchhighlightssection][populate][researchhighlightcards][populate][icon]'
  );
  setPopulate(
    'researchhighlightssection',
    'populate[researchhighlightssection][populate][researchhighlightcards][populate][cards][populate][paragraph]'
  );
  setPopulate(
    'researchhighlightssection',
    'populate[researchhighlightssection][populate][researchhighlightcards][populate][cards][populate][points]'
  );
  setPopulate(
    'researchhighlightssection',
    'populate[researchhighlightssection][populate][researchhighlightcards][populate][cards][populate][galleryimages]'
  );
  setPopulate('currentresearchprojectsection', 'populate[currentresearchprojectsection][populate][sectionheader]');
  setPopulate(
    'currentresearchprojectsection',
    'populate[currentresearchprojectsection][populate][researchprojects][populate][image]'
  );
  setPopulate('awardssection', 'populate[awardssection][populate][sectionheader]');
  setPopulate('awardssection', 'populate[awardssection][populate][cards]');
  setPopulate('publicationssection', 'populate[publicationssection][populate][rightimage]');
  setPopulate('publicationssection', 'populate[publicationssection][populate][publications][populate][points]');
  setPopulate('achievementssection', 'populate[achievementssection][populate][sectionheader]');
  setPopulate('achievementssection', 'populate[achievementssection][populate][achievements]');

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
  const baseQueryString = buildDepartmentBaseQuery(locale);
  const baseUrl = baseQueryString ? `/api/${apiSlug}?${baseQueryString}` : `/api/${apiSlug}`;
  const baseResponse = await fetchStrapi<any>(baseUrl);
  const basePage = unwrapSingleEntity<DepartmentSingleTypePage>(baseResponse);

  if (basePage?.slug && basePage.slug !== slug && basePage.slug !== apiSlug) {
    return null;
  }

  if (!basePage) {
    return null;
  }

  const availableFields = new Set(Object.keys(basePage));
  const queryString = buildDepartmentQuery(locale, availableFields);
  const url = queryString ? `/api/${apiSlug}?${queryString}` : `/api/${apiSlug}`;
  const response = await fetchStrapi<any>(url);
  const page = unwrapSingleEntity<DepartmentSingleTypePage>(response) ?? basePage;

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

export { buildDepartmentBaseQuery, buildDepartmentQuery, getDepartmentApiSlug };
