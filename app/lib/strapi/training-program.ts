import type { TrainingProgramPage } from '../types';
import { fetchStrapi, unwrapSingleEntity, withLocaleFallback } from './client';

function buildTrainingProgramPageQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[pagehero][populate][backgroundImage]', 'true');
  params.set('populate[pagehero][populate][Breadcrumb]', 'true');
  params.set('populate[sectionheader]', 'true');
  params.set('populate[backgroundimage]', 'true');
  params.set('populate[trainingprogram][populate][imageright]', 'true');
  params.set('populate[trainingprogram][populate][points][populate][icon]', 'true');

  return params.toString();
}

export async function fetchTrainingProgramPageByLocale(
  locale: string
): Promise<TrainingProgramPage | null> {
  const queryString = buildTrainingProgramPageQuery(locale);
  const url = queryString
    ? `/api/training-program-page?${queryString}`
    : '/api/training-program-page';
  const response = await fetchStrapi<unknown>(url);

  return unwrapSingleEntity<TrainingProgramPage>(response);
}

export async function getTrainingProgramPage(
  locale: string = 'en'
): Promise<TrainingProgramPage | null> {
  return withLocaleFallback({
    locale,
    label: 'training program page',
    fetcher: fetchTrainingProgramPageByLocale,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export { buildTrainingProgramPageQuery };
