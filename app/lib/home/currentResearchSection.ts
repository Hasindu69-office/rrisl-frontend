import type { DepartmentCurrentProjectItem } from '@/app/components/department/DepartmentCurrentProjectsSection';
import type {
  CurrentResearchSection,
  DepartmentCurrentResearchProjectCard,
  DepartmentSingleTypePage,
  MenuItem,
  SectionHeader,
} from '@/app/lib/types';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';

export interface HomeResearchSectionViewModel {
  tagText: string;
  titlePart1: string;
  titlePart2: string;
  projects: DepartmentCurrentProjectItem[];
}

export interface HomeDepartmentProjectSource {
  slug: string;
  page: DepartmentSingleTypePage | null | undefined;
}

type SortableHomeProject = DepartmentCurrentProjectItem & {
  sortorder: number;
  departmentIndex: number;
  cardIndex: number;
};

const HOME_RESEARCH_FALLBACK = {
  tagText: 'Current Projects',
  titlePart1: 'Research Across',
  titlePart2: ' Our Departments',
};

function splitTitle(title: string, highlightedText: string): Pick<
  HomeResearchSectionViewModel,
  'titlePart1' | 'titlePart2'
> {
  if (!highlightedText) {
    return {
      titlePart1: title,
      titlePart2: '',
    };
  }

  const highlightedIndex = title.toLowerCase().indexOf(highlightedText.toLowerCase());

  if (highlightedIndex === -1) {
    return {
      titlePart1: title,
      titlePart2: highlightedText,
    };
  }

  return {
    titlePart1: title.slice(0, highlightedIndex),
    titlePart2: title.slice(highlightedIndex),
  };
}

function humanizeSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function normalizeDepartmentSlug(url: string): string | null {
  try {
    const parsedUrl = new URL(url, 'http://localhost');
    const match = parsedUrl.pathname.match(/^\/departments\/([^/?#]+)\/?$/);
    return match?.[1] || null;
  } catch {
    const match = url.match(/^\/departments\/([^/?#]+)\/?$/);
    return match?.[1] || null;
  }
}

export function extractDepartmentSlugsFromMenuItems(menuItems: MenuItem[]): string[] {
  const slugs: string[] = [];
  const seen = new Set<string>();

  const visit = (items: MenuItem[]) => {
    items.forEach((item) => {
      const slug = normalizeDepartmentSlug(item.url);

      if (slug && !seen.has(slug)) {
        seen.add(slug);
        slugs.push(slug);
      }

      if (item.children?.length) {
        visit(item.children);
      }
    });
  };

  visit(menuItems);

  return slugs;
}

function mapProjectCard(
  card: DepartmentCurrentResearchProjectCard,
  departmentName: string,
  departmentSlug: string
): (DepartmentCurrentProjectItem & { sortorder: number }) | null {
  if (card.includeinhomepage !== true) {
    return null;
  }

  const title = card.title?.trim();
  const imageSrc =
    getOptimizedImageUrl(card.image, 'large') ||
    getOptimizedImageUrl(card.image, 'medium') ||
    getStrapiImageUrl(card.image);

  if (!title || !imageSrc) {
    return null;
  }

  return {
    id: `${departmentSlug}-${card.id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    title,
    href: `/departments/${departmentSlug}`,
    imageSrc,
    imageAlt: card.image?.alternativeText || title,
    departmentName,
    sortorder: card.sortorder ?? Number.MAX_SAFE_INTEGER,
  };
}

function mapSectionHeader(section: CurrentResearchSection | null | undefined): Pick<
  HomeResearchSectionViewModel,
  'tagText' | 'titlePart1' | 'titlePart2'
> {
  const header: SectionHeader | null | undefined = section?.sectionheader;
  const title =
    header?.title && header.title.trim().length > 0
      ? header.title
      : HOME_RESEARCH_FALLBACK.titlePart1;
  const highlightedText =
    header?.hightlightedtext && header.hightlightedtext.trim().length > 0
      ? header.hightlightedtext
      : HOME_RESEARCH_FALLBACK.titlePart2;
  const titleParts = splitTitle(title, highlightedText);

  return {
    tagText: header?.eyebrow?.trim() || HOME_RESEARCH_FALLBACK.tagText,
    ...titleParts,
  };
}

export function mapHomeResearchSection(
  section: CurrentResearchSection | null | undefined,
  departmentSources: HomeDepartmentProjectSource[]
): HomeResearchSectionViewModel | null {
  const projects = departmentSources.flatMap((source, departmentIndex) => {
    const page = source.page;

    if (!page || page.currentprojectpresent !== true) {
      return [];
    }

    const departmentName = page.departmenttitle?.trim() || humanizeSlug(source.slug);
    const cards = page.currentresearchprojectsection?.researchprojects || [];

    return cards
      .map((card, cardIndex) => {
        const project = mapProjectCard(card, departmentName, source.slug);

        return project
          ? {
              ...project,
              departmentIndex,
              cardIndex,
            }
          : null;
      })
      .filter((project): project is SortableHomeProject => project !== null);
  });

  if (projects.length === 0) {
    return null;
  }

  const sortedProjects = [...projects]
    .sort((left, right) => {
      if (left.sortorder !== right.sortorder) {
        return left.sortorder - right.sortorder;
      }

      if (left.departmentIndex !== right.departmentIndex) {
        return left.departmentIndex - right.departmentIndex;
      }

      return left.cardIndex - right.cardIndex;
    })
    .map(({ sortorder, departmentIndex, cardIndex, ...project }) => project);

  return {
    ...mapSectionHeader(section),
    projects: sortedProjects,
  };
}
