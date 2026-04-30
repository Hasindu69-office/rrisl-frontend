import type { BoardMember, ManagementBoardPage } from '../types';
import { fetchStrapi, unwrapCollection, unwrapSingleEntity, withLocaleFallback } from './client';

function buildManagementBoardPageQuery(locale: string): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('populate[pagehero][populate][backgroundImage]', 'true');
  params.set('populate[pagehero][populate][Breadcrumb]', 'true');
  params.set('populate[LabelMemberBoard][populate]', '*');
  params.set('populate[LabelInAttendance][populate]', '*');
  params.set('populate[ErrorMessage]', 'true');

  return params.toString();
}

function buildBoardMembersQuery(locale: string, memberType: BoardMember['MemberType']): string {
  const params = new URLSearchParams();

  if (locale && locale !== 'en') {
    params.set('locale', locale);
  }

  params.set('filters[MemberType][$eq]', memberType);
  params.set('filters[IsActive][$eq]', 'true');
  params.set('sort[0]', 'DisplayOrder:asc');
  params.set('sort[1]', 'FullName:asc');
  params.set('populate[ProfileImage]', 'true');
  params.set('populate[OrganizationLines]', 'true');

  return params.toString();
}

async function fetchManagementBoardPage(locale: string): Promise<ManagementBoardPage | null> {
  const queryString = buildManagementBoardPageQuery(locale);
  const url = queryString
    ? `/api/management-board-page?${queryString}`
    : '/api/management-board-page';
  const response = await fetchStrapi<unknown>(url);
  return unwrapSingleEntity<ManagementBoardPage>(response);
}

async function fetchBoardMembers(
  locale: string,
  memberType: BoardMember['MemberType']
): Promise<BoardMember[]> {
  const queryString = buildBoardMembersQuery(locale, memberType);
  const response = await fetchStrapi<unknown>(`/api/board-members?${queryString}`);
  return unwrapCollection<BoardMember>(response);
}

export async function getManagementBoardPage(
  locale: string = 'en'
): Promise<ManagementBoardPage | null> {
  return withLocaleFallback({
    locale,
    label: 'management board page',
    fetcher: fetchManagementBoardPage,
    hasValue: (value) => value !== null,
    emptyValue: null,
  });
}

export async function getBoardMembers(
  memberType: BoardMember['MemberType'],
  locale: string = 'en'
): Promise<BoardMember[]> {
  return withLocaleFallback({
    locale,
    label: `board members (${memberType})`,
    fetcher: (activeLocale) => fetchBoardMembers(activeLocale, memberType),
    hasValue: (value) => value.length > 0,
    emptyValue: [],
  });
}

export { buildBoardMembersQuery, buildManagementBoardPageQuery };
