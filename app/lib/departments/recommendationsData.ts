import type {
  DepartmentRecommendationGroup,
  DepartmentRecommendationItem,
  DepartmentSingleTypePage,
} from '@/app/lib/types';

export interface DepartmentRecommendationBriefItem {
  id: string;
  title: string;
  description?: string;
}

export interface DepartmentRecommendationGroupView {
  id: string;
  title: string;
  items: DepartmentRecommendationBriefItem[];
}

export interface DepartmentRecommendationsContent {
  eyebrow: string;
  title: string;
  highlightedText: string;
  groups: DepartmentRecommendationGroupView[];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function sortBySortOrder<T extends { sortorder?: number | null }>(items: T[]): T[] {
  return [...items].sort((left, right) => (left.sortorder || 0) - (right.sortorder || 0));
}

function mapRecommendationItems(
  items: DepartmentRecommendationItem[] | null | undefined
): DepartmentRecommendationBriefItem[] {
  return sortBySortOrder(items || [])
    .map((item): DepartmentRecommendationBriefItem | null => {
      const title = item.title?.trim();

      if (!title) {
        return null;
      }

      return {
        id: item.id ? String(item.id) : slugify(title),
        title,
        description: item.description?.trim() || undefined,
      };
    })
    .filter((item): item is DepartmentRecommendationBriefItem => Boolean(item));
}

function mapRecommendationGroups(
  groups: DepartmentRecommendationGroup[] | null | undefined
): DepartmentRecommendationGroupView[] {
  return sortBySortOrder(groups || [])
    .map((group): DepartmentRecommendationGroupView | null => {
      const title = group.title?.trim();
      const items = mapRecommendationItems(group.items);

      if (!title || items.length === 0) {
        return null;
      }

      return {
        id: group.id ? String(group.id) : slugify(title),
        title,
        items,
      };
    })
    .filter((group): group is DepartmentRecommendationGroupView => Boolean(group));
}

export function mapDepartmentRecommendations(
  localizedPage: DepartmentSingleTypePage | null | undefined,
  fallbackPage?: DepartmentSingleTypePage | null
): DepartmentRecommendationsContent | null {
  const isPresent =
    localizedPage?.recommendationsectionpresent ?? fallbackPage?.recommendationsectionpresent;

  if (isPresent !== true) {
    return null;
  }

  const section = localizedPage?.recommendationsection || fallbackPage?.recommendationsection;

  if (!section) {
    return null;
  }

  const fallbackSection = fallbackPage?.recommendationsection;
  const groups = mapRecommendationGroups(
    section.recommendationgroups?.length
      ? section.recommendationgroups
      : fallbackSection?.recommendationgroups
  );

  if (groups.length === 0) {
    return null;
  }

  const header = section.sectionheader || fallbackSection?.sectionheader;
  const title =
    header?.title && header.title.trim().length > 0 ? header.title : 'New Recommendations';
  const highlightedText =
    header?.hightlightedtext && header.hightlightedtext.trim().length > 0
      ? header.hightlightedtext
      : '';

  return {
    eyebrow: header?.eyebrow?.trim() || 'New Recommendations',
    title,
    highlightedText,
    groups,
  };
}
