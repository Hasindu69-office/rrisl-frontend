import type {
  AdvisoryServicePage,
  TrainingProgram,
  TrainingProgramCategory,
} from '../types';
import { fetchStrapi, unwrapCollection, unwrapSingleEntity, withLocaleFallback } from './client';

function buildAdvisoryServicePageQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[pagehero][populate][backgroundImage]', 'true');
  params.set('populate[pagehero][populate][Breadcrumb]', 'true');
  params.set('populate[sectionheader]', 'true');
  params.set('populate[description]', 'true');
  params.set('populate[sectionimgleft]', 'true');
  params.set('populate[trainingprogrambgimg]', 'true');

  return params.toString();
}

function buildTrainingProgramCategoriesQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('sort[0]', 'sortorder:asc');

  return params.toString();
}

function buildTrainingProgramsQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('sort[0]', 'sortorder:asc');
  params.set('populate[image]', 'true');
  params.set('populate[training_program_category]', 'true');

  return params.toString();
}

export async function fetchAdvisoryServicePageByLocale(
  locale: string
): Promise<AdvisoryServicePage | null> {
  const queryString = buildAdvisoryServicePageQuery(locale);
  const url = queryString
    ? `/api/advisory-service-page?${queryString}`
    : '/api/advisory-service-page';
  const response = await fetchStrapi<unknown>(url);

  return unwrapSingleEntity<AdvisoryServicePage>(response);
}

export async function fetchTrainingProgramCategoriesByLocale(
  locale: string
): Promise<TrainingProgramCategory[]> {
  const queryString = buildTrainingProgramCategoriesQuery(locale);
  const url = queryString
    ? `/api/training-program-categories?${queryString}`
    : '/api/training-program-categories';
  const response = await fetchStrapi<unknown>(url);

  return unwrapCollection<TrainingProgramCategory>(response);
}

export async function fetchTrainingProgramsByLocale(
  locale: string
): Promise<TrainingProgram[]> {
  const queryString = buildTrainingProgramsQuery(locale);
  const url = queryString
    ? `/api/training-programs?${queryString}`
    : '/api/training-programs';
  const response = await fetchStrapi<unknown>(url);

  return unwrapCollection<TrainingProgram>(response);
}

export async function getAdvisoryServicePage(
  locale: string = 'en'
): Promise<AdvisoryServicePage | null> {
  return withLocaleFallback({
    locale,
    label: 'advisory service page',
    fetcher: fetchAdvisoryServicePageByLocale,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export async function getTrainingProgramCategories(
  locale: string = 'en'
): Promise<TrainingProgramCategory[]> {
  return withLocaleFallback({
    locale,
    label: 'training program categories',
    fetcher: fetchTrainingProgramCategoriesByLocale,
    hasValue: (value) => value.length > 0,
    emptyValue: [],
  });
}

export async function getTrainingPrograms(locale: string = 'en'): Promise<TrainingProgram[]> {
  return withLocaleFallback({
    locale,
    label: 'training programs',
    fetcher: fetchTrainingProgramsByLocale,
    hasValue: (value) => value.length > 0,
    emptyValue: [],
  });
}

export {
  buildAdvisoryServicePageQuery,
  buildTrainingProgramCategoriesQuery,
  buildTrainingProgramsQuery,
};
