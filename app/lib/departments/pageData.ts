import type { BreadcrumbItem } from '@/app/components/shared/Breadcrumb';
import type { DepartmentServiceItem } from '@/app/components/department/DepartmentServicesSection';
import type { DepartmentStaffMember } from '@/app/components/department/DepartmentStaffSection';
import type { DepartmentSectionPoint } from '@/app/components/department/DepartmentSection';
import type {
  DepartmentIntroductionSection,
  DepartmentPoint,
  DepartmentPageHero,
  DepartmentResearchStaffSection,
  DepartmentServiceCard,
  DepartmentServiceSection,
  DepartmentStaffCard,
  DepartmentSingleTypePage,
} from '@/app/lib/types';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';

export interface DepartmentHeroViewModel {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  backgroundImage?: string;
  backgroundImageAlt: string;
}

export interface DepartmentIntroductionViewModel {
  tagText: string;
  titlePart1: string;
  titlePart2: string;
  description: string;
  points: DepartmentSectionPoint[];
  videoUrl?: string;
  videoTitle: string;
}

export interface DepartmentServicesViewModel {
  tagText: string;
  titlePart1: string;
  titlePart2: string;
  items: DepartmentServiceItem[];
}

export interface DepartmentResearchStaffViewModel {
  tagText: string;
  titlePart1: string;
  titlePart2: string;
  staff: DepartmentStaffMember[];
}

const DEPARTMENT_HERO_FALLBACK: DepartmentHeroViewModel = {
  title: 'Department',
  breadcrumbItems: [
    { label: 'Home', href: '/' },
    { label: 'Departments' },
  ],
  backgroundImage: '/images/aboutus_heroimg.jpg',
  backgroundImageAlt: 'Department background',
};

function humanizeSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function mapBreadcrumbItems(
  hero: DepartmentPageHero | null | undefined,
  slug: string,
  title: string
): BreadcrumbItem[] {
  const breadcrumbItems =
    hero?.Breadcrumb
      ?.filter((item) => item?.label)
      .map((item) => ({
        label: item.label,
        ...(item.href ? { href: item.href } : {}),
      })) || [];

  return breadcrumbItems.length > 0
    ? breadcrumbItems
    : [
        ...DEPARTMENT_HERO_FALLBACK.breadcrumbItems,
        { label: title || humanizeSlug(slug) },
      ];
}

function splitTitle(title: string, highlightedText: string): Pick<
  DepartmentIntroductionViewModel | DepartmentServicesViewModel,
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

function formatServiceNumber(sortOrder: number, index: number): string {
  const number = Number.isFinite(sortOrder) ? sortOrder : index + 1;
  return String(number).padStart(2, '0');
}

function mapDepartmentPoints(
  localizedPoints: DepartmentPoint[] | null | undefined,
  fallbackPoints: DepartmentPoint[] | null | undefined
): DepartmentSectionPoint[] {
  const points = localizedPoints?.length ? localizedPoints : fallbackPoints || [];

  return points
    .map((item): DepartmentSectionPoint | null => {
      const text = item?.point?.trim();

      if (!text) {
        return null;
      }

      return {
        text,
        iconSrc:
          getOptimizedImageUrl(item.icon, 'thumbnail') ||
          getOptimizedImageUrl(item.icon, 'small') ||
          getStrapiImageUrl(item.icon) ||
          undefined,
        iconAlt: item.icon?.alternativeText || text,
      };
    })
    .filter((point): point is DepartmentSectionPoint => Boolean(point));
}

function mapServiceCards(
  localizedCards: DepartmentServiceCard[] | null | undefined,
  fallbackCards: DepartmentServiceCard[] | null | undefined
): DepartmentServiceItem[] {
  const cards = localizedCards?.length ? localizedCards : fallbackCards || [];

  return cards
    .map((card): (DepartmentServiceItem & { sortorder: number }) | null => {
      const title = card?.title?.trim();
      const description = card?.description?.trim();
      const iconSrc =
        getOptimizedImageUrl(card?.icon, 'thumbnail') ||
        getOptimizedImageUrl(card?.icon, 'small') ||
        getStrapiImageUrl(card?.icon);
      const imageSrc =
        getOptimizedImageUrl(card?.image, 'large') ||
        getOptimizedImageUrl(card?.image, 'medium') ||
        getStrapiImageUrl(card?.image);

      if (!title || !description || !iconSrc || !imageSrc) {
        return null;
      }

      return {
        number: '',
        title,
        description,
        iconSrc,
        iconAlt: card.icon?.alternativeText || title,
        imageSrc,
        imageAlt: card.image?.alternativeText || title,
        sortorder: card.sortorder ?? Number.MAX_SAFE_INTEGER,
      };
    })
    .filter((card): card is DepartmentServiceItem & { sortorder: number } => Boolean(card))
    .sort((left, right) => left.sortorder - right.sortorder)
    .map(({ sortorder, ...card }, index) => ({
      ...card,
      number: formatServiceNumber(sortorder, index),
    }));
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function mapStaffCards(
  localizedStaff: DepartmentStaffCard[] | null | undefined,
  fallbackStaff: DepartmentStaffCard[] | null | undefined
): DepartmentStaffMember[] {
  const staff = localizedStaff?.length ? localizedStaff : fallbackStaff || [];

  return staff
    .map((member): DepartmentStaffMember | null => {
      const name = member?.name?.trim();
      const role = member?.departmenttitle?.trim();
      const imageSrc =
        getOptimizedImageUrl(member?.portrait, 'medium') ||
        getOptimizedImageUrl(member?.portrait, 'small') ||
        getStrapiImageUrl(member?.portrait);

      if (!name || !role || !imageSrc) {
        return null;
      }

      const paragraphs =
        member.paragraph
          ?.map((item) => item?.paragraph?.trim())
          .filter((paragraph): paragraph is string => Boolean(paragraph)) || [];

      return {
        id: slugify(name),
        name,
        role,
        imageSrc,
        imageAlt: member.portrait?.alternativeText || name,
        credentials: member.education?.trim() || undefined,
        emails:
          member.email
            ?.map((item) => item?.email?.trim())
            .filter((email): email is string => Boolean(email)) || [],
        biography: paragraphs[0],
        currentWork: paragraphs.slice(1).join(' '),
      };
    })
    .filter((member): member is DepartmentStaffMember => Boolean(member));
}

export function mapDepartmentHero(
  localizedPage: DepartmentSingleTypePage | null | undefined,
  fallbackPage: DepartmentSingleTypePage | null | undefined,
  slug: string
): DepartmentHeroViewModel {
  const hero = localizedPage?.pagehero || fallbackPage?.pagehero;
  const image = hero?.backgroundImage || fallbackPage?.pagehero?.backgroundImage || null;
  const title =
    hero?.PageTitle ||
    localizedPage?.departmenttitle ||
    fallbackPage?.departmenttitle ||
    humanizeSlug(slug);

  return {
    title,
    breadcrumbItems: mapBreadcrumbItems(hero, slug, title),
    backgroundImage:
      getOptimizedImageUrl(image, 'large') ||
      getOptimizedImageUrl(image, 'medium') ||
      getStrapiImageUrl(image) ||
      DEPARTMENT_HERO_FALLBACK.backgroundImage,
    backgroundImageAlt:
      hero?.backgroundImageAlt ||
      image?.alternativeText ||
      `${title} background`,
  };
}

export function mapDepartmentIntroduction(
  localizedSection: DepartmentIntroductionSection | null | undefined,
  fallbackSection?: DepartmentIntroductionSection | null
): DepartmentIntroductionViewModel | null {
  const section = localizedSection || fallbackSection;

  if (!section) {
    return null;
  }

  const header = section.sectionheader || fallbackSection?.sectionheader;
  const title = header?.title || '';
  const highlightedText = header?.hightlightedtext || '';
  const titleParts = splitTitle(title, highlightedText);
  const description = section.paragraph?.trim() || fallbackSection?.paragraph?.trim() || '';

  if (!title && !description) {
    return null;
  }

  return {
    tagText: header?.eyebrow?.trim() || 'Main objective',
    ...titleParts,
    description,
    points: mapDepartmentPoints(section.points, fallbackSection?.points),
    videoUrl: section.url?.trim() || fallbackSection?.url?.trim() || undefined,
    videoTitle:
      section.videotitle?.trim() ||
      fallbackSection?.videotitle?.trim() ||
      'Department video',
  };
}

export function mapDepartmentServices(
  localizedPage: DepartmentSingleTypePage | null | undefined,
  fallbackPage?: DepartmentSingleTypePage | null
): DepartmentServicesViewModel | null {
  const isPresent = localizedPage?.servicesectionpresent ?? fallbackPage?.servicesectionpresent;

  if (isPresent !== true) {
    return null;
  }

  const section: DepartmentServiceSection | null | undefined =
    localizedPage?.servicesection || fallbackPage?.servicesection;

  if (!section) {
    return null;
  }

  const header = section.sectionheader || fallbackPage?.servicesection?.sectionheader;
  const title = header?.title || '';
  const highlightedText = header?.hightlightedtext || '';
  const titleParts = splitTitle(title, highlightedText);
  const items = mapServiceCards(section.servicecards, fallbackPage?.servicesection?.servicecards);

  if (items.length === 0) {
    return null;
  }

  return {
    tagText: header?.eyebrow?.trim() || 'Main objective',
    ...titleParts,
    items,
  };
}

export function mapDepartmentResearchStaff(
  localizedPage: DepartmentSingleTypePage | null | undefined,
  fallbackPage?: DepartmentSingleTypePage | null
): DepartmentResearchStaffViewModel | null {
  const isPresent = localizedPage?.researchstaffpresent ?? fallbackPage?.researchstaffpresent;

  if (isPresent !== true) {
    return null;
  }

  const section: DepartmentResearchStaffSection | null | undefined =
    localizedPage?.researchstaffsection || fallbackPage?.researchstaffsection;

  if (!section) {
    return null;
  }

  const header = section.sectionheader || fallbackPage?.researchstaffsection?.sectionheader;
  const title = header?.title || '';
  const highlightedText = header?.hightlightedtext || '';
  const titleParts = splitTitle(title, highlightedText);
  const staff = mapStaffCards(section.staff, fallbackPage?.researchstaffsection?.staff);

  if (staff.length === 0) {
    return null;
  }

  return {
    tagText: header?.eyebrow?.trim() || 'Research Staff',
    ...titleParts,
    staff,
  };
}
