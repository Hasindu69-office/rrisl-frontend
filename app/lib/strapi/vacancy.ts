import type {
  Department,
  Vacancy,
  VacancyListBlock,
  VacancyPage,
  VacancyState,
} from '../types';
import { fetchStrapi, unwrapCollection, unwrapSingleEntity, withLocaleFallback } from './client';

type DepartmentRecord = Partial<Department> & {
  id?: number;
  attributes?: Partial<Department>;
};

type VacancyPageRecord = Partial<VacancyPage> & {
  id?: number;
  attributes?: Partial<VacancyPage>;
};

type VacancyRecord = Partial<Vacancy> & {
  id?: number;
  attributes?: Partial<Vacancy>;
  department?: unknown;
  responsibilityblocks?: unknown;
  skillsblocks?: unknown;
  noticedocument?: unknown;
};

export interface VacancyPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface VacancyCollectionResult {
  items: Vacancy[];
  pagination: VacancyPagination;
}

export interface VacancyQueryOptions {
  category?: string;
  locale?: string;
  page?: number;
  pageSize?: number;
  state?: VacancyState;
}

interface VacancyResponseMeta {
  pagination?: Partial<VacancyPagination>;
}

interface VacancyCollectionResponse {
  data?: unknown;
  meta?: VacancyResponseMeta;
}

function normalizeRelation<T>(relation: unknown): T | null {
  if (!relation) {
    return null;
  }

  if (typeof relation === 'object' && relation !== null && 'data' in relation) {
    const data = (relation as { data?: unknown }).data;
    if (!data || Array.isArray(data)) {
      return null;
    }

    if (typeof data === 'object' && data !== null && 'attributes' in data) {
      return {
        ...(data as { attributes?: object }).attributes,
        id: (data as { id?: number }).id,
      } as T;
    }

    return data as T;
  }

  if (typeof relation === 'object' && relation !== null && 'attributes' in relation) {
    return {
      ...((relation as { attributes?: object }).attributes || {}),
      id: (relation as { id?: number }).id,
    } as T;
  }

  return relation as T;
}

function normalizeComponentCollection<T>(components: unknown): T[] {
  if (!components) {
    return [];
  }

  if (!Array.isArray(components)) {
    const singleComponent = normalizeRelation<T>(components);
    return singleComponent ? [singleComponent] : [];
  }

  return components
    .map((item) => normalizeRelation<T>(item))
    .filter((item): item is T => item !== null);
}

function normalizePagination(
  meta: VacancyResponseMeta | undefined,
  fallbackPage: number,
  fallbackPageSize: number
): VacancyPagination {
  const pagination = meta?.pagination;

  return {
    page: pagination?.page || fallbackPage,
    pageSize: pagination?.pageSize || fallbackPageSize,
    pageCount: pagination?.pageCount || 0,
    total: pagination?.total || 0,
  };
}

function buildVacancyPageQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[pagehero][populate][backgroundImage]', 'true');
  params.set('populate[pagehero][populate][Breadcrumb]', 'true');
  params.set('populate[emptystate]', 'true');

  return params.toString();
}

function buildVacancyDepartmentsQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('sort[0]', 'sortorder:asc');
  params.set('sort[1]', 'departmentname:asc');
  params.set('pagination[pageSize]', '100');

  return params.toString();
}

function buildVacanciesQuery({
  category,
  locale = 'en',
  page = 1,
  pageSize = 4,
  state = 'open',
}: VacancyQueryOptions = {}): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('filters[state][$eq]', state);
  if (category) {
    params.set('filters[department][departmentname][$eq]', category);
  }

  params.set('sort[0]', 'openingdate:desc');
  params.set('sort[1]', 'publishedAt:desc');
  params.set('sort[2]', 'id:desc');
  params.set('pagination[page]', String(page));
  params.set('pagination[pageSize]', String(pageSize));
  params.set('populate[department]', 'true');
  params.set('populate[responsibilityblocks]', 'true');
  params.set('populate[skillsblocks]', 'true');
  params.set('populate[noticedocument]', 'true');

  return params.toString();
}

function buildVacancyBySlugQuery(slug: string, locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('filters[slug][$eq]', slug);
  params.set('populate[department]', 'true');
  params.set('populate[responsibilityblocks]', 'true');
  params.set('populate[skillsblocks]', 'true');
  params.set('populate[noticedocument]', 'true');

  return params.toString();
}

function mapVacancyPageRecord(record: VacancyPageRecord | null | undefined, locale: string): VacancyPage | null {
  if (!record) {
    return null;
  }

  const attributes = record.attributes || record;

  return {
    id: record.id || attributes.id || 0,
    documentId: record.documentId || attributes.documentId,
    createdAt: attributes.createdAt || record.createdAt,
    updatedAt: attributes.updatedAt || record.updatedAt,
    publishedAt: attributes.publishedAt || record.publishedAt,
    locale: attributes.locale || record.locale || locale,
    pagehero: normalizeRelation(attributes.pagehero || record.pagehero),
    emptystate: normalizeRelation(attributes.emptystate || record.emptystate),
    searchbuttonlabel: attributes.searchbuttonlabel || record.searchbuttonlabel,
    searchcategorylabel: attributes.searchcategorylabel || record.searchcategorylabel,
    jobdetailslabel: attributes.jobdetailslabel || record.jobdetailslabel,
    applyjoblabel: attributes.applyjoblabel || record.applyjoblabel,
    overviewtitle: attributes.overviewtitle || record.overviewtitle,
    descriptiontitle: attributes.descriptiontitle || record.descriptiontitle,
    responsibilitiestitle: attributes.responsibilitiestitle || record.responsibilitiestitle,
    skillstitle: attributes.skillstitle || record.skillstitle,
    downloadnoticetitle: attributes.downloadnoticetitle || record.downloadnoticetitle,
    downloadbuttonlabel: attributes.downloadbuttonlabel || record.downloadbuttonlabel,
    applyformtitle: attributes.applyformtitle || record.applyformtitle,
    fullnamelabel: attributes.fullnamelabel || record.fullnamelabel,
    emaillabel: attributes.emaillabel || record.emaillabel,
    contactnumberlabel: attributes.contactnumberlabel || record.contactnumberlabel,
    cvlabel: attributes.cvlabel || record.cvlabel,
    submitlabel: attributes.submitlabel || record.submitlabel,
    jobtitlelabel: attributes.jobtitlelabel || record.jobtitlelabel,
    jobtypelabel: attributes.jobtypelabel || record.jobtypelabel,
    categorylabel: attributes.categorylabel || record.categorylabel,
    experiencelabel: attributes.experiencelabel || record.experiencelabel,
    degreelabel: attributes.degreelabel || record.degreelabel,
    offeredsalarylabel: attributes.offeredsalarylabel || record.offeredsalarylabel,
    locationlabel: attributes.locationlabel || record.locationlabel,
  };
}

function mapDepartmentRecord(item: DepartmentRecord, locale: string): Department {
  const attributes = item.attributes || item;

  return {
    id: item.id || attributes.id || 0,
    documentId: item.documentId || attributes.documentId,
    departmentname: attributes.departmentname || item.departmentname || '',
    sortorder: attributes.sortorder ?? item.sortorder ?? null,
    createdAt: attributes.createdAt || item.createdAt,
    updatedAt: attributes.updatedAt || item.updatedAt,
    publishedAt: attributes.publishedAt || item.publishedAt,
    locale: attributes.locale || item.locale || locale,
  };
}

function mapVacancyRecord(item: VacancyRecord, locale: string): Vacancy {
  const attributes = item.attributes || item;

  return {
    id: item.id || attributes.id || 0,
    documentId: item.documentId || attributes.documentId,
    title: attributes.title || item.title || '',
    slug: attributes.slug || item.slug || '',
    department: normalizeRelation(attributes.department || item.department),
    employmenttype: attributes.employmenttype || item.employmenttype || '',
    salaryrange: attributes.salaryrange || item.salaryrange || null,
    location: attributes.location || item.location || null,
    overviewlocation: attributes.overviewlocation || item.overviewlocation || null,
    experience: attributes.experience || item.experience || null,
    degree: attributes.degree || item.degree || null,
    description: attributes.description || item.description || '',
    responsibilityblocks: normalizeComponentCollection<VacancyListBlock>(
      attributes.responsibilityblocks || item.responsibilityblocks
    ),
    skillsblocks: normalizeComponentCollection<VacancyListBlock>(
      attributes.skillsblocks || item.skillsblocks
    ),
    closingdate: attributes.closingdate || item.closingdate || '',
    openingdate: attributes.openingdate || item.openingdate || '',
    state: (attributes.state || item.state || 'open') as VacancyState,
    noticedocument: normalizeRelation(attributes.noticedocument || item.noticedocument),
    createdAt: attributes.createdAt || item.createdAt,
    updatedAt: attributes.updatedAt || item.updatedAt,
    publishedAt: attributes.publishedAt || item.publishedAt,
    locale: attributes.locale || item.locale || locale,
  };
}

async function fetchVacancyPage(locale: string): Promise<VacancyPage | null> {
  const queryString = buildVacancyPageQuery(locale);
  const url = queryString ? `/api/vacancy-page?${queryString}` : '/api/vacancy-page';
  const response = await fetchStrapi<unknown>(url);
  const page = unwrapSingleEntity<VacancyPageRecord>(response);

  return mapVacancyPageRecord(page, locale);
}

export async function getVacancyPage(locale: string = 'en'): Promise<VacancyPage | null> {
  return withLocaleFallback({
    locale,
    label: 'vacancy page',
    fetcher: fetchVacancyPage,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

async function fetchVacancyDepartments(locale: string): Promise<Department[]> {
  const queryString = buildVacancyDepartmentsQuery(locale);
  const url = queryString ? `/api/departments?${queryString}` : '/api/departments';
  const response = await fetchStrapi<unknown>(url);
  const departments = unwrapCollection<DepartmentRecord>(response);

  return departments.map((item) => mapDepartmentRecord(item, locale));
}

export async function getVacancyDepartments(locale: string = 'en'): Promise<Department[]> {
  return withLocaleFallback({
    locale,
    label: 'vacancy departments',
    fetcher: fetchVacancyDepartments,
    hasValue: (value) => value.length > 0,
    emptyValue: [],
  });
}

async function fetchVacancies(
  options: VacancyQueryOptions = {}
): Promise<VacancyCollectionResult | null> {
  const locale = options.locale || 'en';
  const page = options.page || 1;
  const pageSize = options.pageSize || 4;
  const queryString = buildVacanciesQuery({ ...options, locale, page, pageSize });
  const url = queryString ? `/api/vacancies?${queryString}` : '/api/vacancies';
  const response = await fetchStrapi<VacancyCollectionResponse>(url);

  if (!response) {
    return null;
  }

  const vacancies = unwrapCollection<VacancyRecord>(response);

  return {
    items: vacancies.map((item) => mapVacancyRecord(item, locale)),
    pagination: normalizePagination(response?.meta, page, pageSize),
  };
}

export async function getVacancies(
  options: VacancyQueryOptions = {}
): Promise<VacancyCollectionResult> {
  const locale = options.locale || 'en';
  const emptyValue: VacancyCollectionResult = {
    items: [],
    pagination: {
      page: options.page || 1,
      pageSize: options.pageSize || 4,
      pageCount: 0,
      total: 0,
    },
  };
  const localizedResult = await fetchVacancies(options);

  if (localizedResult || locale === 'en') {
    return localizedResult || emptyValue;
  }

  const fallbackResult = await fetchVacancies({
    ...options,
    locale: 'en',
  });

  return fallbackResult || emptyValue;
}

async function fetchVacancyBySlug(slug: string, locale: string): Promise<Vacancy | null> {
  const queryString = buildVacancyBySlugQuery(slug, locale);
  const url = queryString ? `/api/vacancies?${queryString}` : '/api/vacancies';
  const response = await fetchStrapi<unknown>(url);
  const vacancy = unwrapCollection<VacancyRecord>(response)[0];

  return vacancy ? mapVacancyRecord(vacancy, locale) : null;
}

export async function getVacancyBySlug(
  slug: string,
  locale: string = 'en'
): Promise<Vacancy | null> {
  return withLocaleFallback({
    locale,
    label: `vacancy "${slug}"`,
    fetcher: (resolvedLocale) => fetchVacancyBySlug(slug, resolvedLocale),
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export {
  buildVacancyBySlugQuery,
  buildVacancyDepartmentsQuery,
  buildVacanciesQuery,
  buildVacancyPageQuery,
};
