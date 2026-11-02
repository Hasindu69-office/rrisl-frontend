import type { BreadcrumbItem } from '@/app/components/shared/Breadcrumb';
import type { DepartmentResearchHighlightItem } from '@/app/components/department/DepartmentResearchHighlightsSection';
import type { DepartmentCurrentProjectItem } from '@/app/components/department/DepartmentCurrentProjectsSection';
import type { DepartmentPublicationSectionItem } from '@/app/components/department/DepartmentPublicationsSection';
import type {
  DepartmentServiceGroupItem,
  DepartmentServiceItem,
  DepartmentServiceMediaItem,
  DepartmentStructuredServiceItem,
} from '@/app/components/department/DepartmentServicesSection';
import type { DepartmentStaffMember } from '@/app/components/department/DepartmentStaffSection';
import type { DepartmentTechnicalStaffGroupItem } from '@/app/components/department/DepartmentStaffSection';
import type { DepartmentSectionPoint } from '@/app/components/department/DepartmentSection';
import type {
  DepartmentAchievementSection,
  DepartmentCurrentResearchProjectCard,
  DepartmentCurrentResearchProjectSection,
  DepartmentIntroductionSection,
  DepartmentPoint,
  DepartmentPageHero,
  DepartmentResearchHighlightCard,
  DepartmentResearchHighlightsSection,
  DepartmentResearchStaffSection,
  DepartmentPublicationCard,
  DepartmentPublicationsSection,
  DepartmentServiceCard,
  DepartmentServiceSection,
  DepartmentStaffCard,
  DepartmentTechnicalStaffGroup,
  DepartmentSingleTypePage,
  StrapiImage,
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
  closingDescription?: string;
  points: DepartmentSectionPoint[];
  videoUrl?: string;
  videoTitle: string;
}

export interface DepartmentServicesViewModel {
  tagText: string;
  titlePart1: string;
  titlePart2: string;
  items: DepartmentServiceItem[];
  serviceGroups: DepartmentServiceGroupItem[];
}

export interface DepartmentResearchStaffViewModel {
  tagText: string;
  titlePart1: string;
  titlePart2: string;
  staff: DepartmentStaffMember[];
  technicalStaffGroups: DepartmentTechnicalStaffGroupItem[];
}

export interface DepartmentResearchHighlightsViewModel {
  tagText: string;
  titlePart1: string;
  titlePart2: string;
  highlights: DepartmentResearchHighlightItem[];
}

export interface DepartmentCurrentProjectsViewModel {
  tagText: string;
  titlePart1: string;
  titlePart2: string;
  projects: DepartmentCurrentProjectItem[];
}

export interface DepartmentPublicationsViewModel {
  tagText: string;
  titlePart1: string;
  titlePart2: string;
  sections: DepartmentPublicationSectionItem[];
}

export interface DepartmentAchievementsViewModel {
  title: string;
  leftBackgroundImageSrc: string;
  leftBackgroundImageAlt: string;
  rightBackgroundImageSrc: string;
  rightBackgroundImageAlt: string;
  sections: DepartmentPublicationSectionItem[];
}

const DEPARTMENT_ACHIEVEMENTS_FALLBACK = {
  leftBackgroundImageSrc: '/images/departments/bgdotsourpublications.png',
  leftBackgroundImageAlt: 'Decorative dotted background for achievements',
  rightBackgroundImageSrc: '/images/departments/bgimgourpulications.jpg',
  rightBackgroundImageAlt: 'Achievements section background',
};

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

function sortBySortOrder<T extends { sortorder?: number | null }>(items: T[]): T[] {
  return [...items].sort((left, right) => {
    const leftOrder = left.sortorder ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = right.sortorder ?? Number.MAX_SAFE_INTEGER;
    return leftOrder - rightOrder;
  });
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

function mapServiceImages(
  images: StrapiImage[] | null | undefined,
  fallbackImages: StrapiImage[] | null | undefined,
  fallbackAlt: string = 'Service image'
): DepartmentServiceMediaItem[] {
  const source = images?.length ? images : fallbackImages || [];

  return source
    .map((image, index) => {
      const src =
        getOptimizedImageUrl(image, 'large') ||
        getOptimizedImageUrl(image, 'medium') ||
        getStrapiImageUrl(image);

      if (!src) return null;

      return {
        id: image.documentId || String(image.id || index),
        src,
        alt: image.alternativeText?.trim() || fallbackAlt,
      };
    })
    .filter((image): image is DepartmentServiceMediaItem => Boolean(image));
}

function omitSortorder<T extends { sortorder: number }>(item: T): Omit<T, 'sortorder'> {
  const { sortorder, ...rest } = item;
  void sortorder;
  return rest;
}

function mapStructuredServiceItems(
  localized: NonNullable<DepartmentServiceSection['servicegroups']>[number]['items'],
  fallback: NonNullable<DepartmentServiceSection['servicegroups']>[number]['items']
): DepartmentStructuredServiceItem[] {
  const items = localized?.length ? localized : fallback || [];

  return items
    .map((item, index) => {
      const title = item?.title?.trim();
      if (!title) return null;
      const fallbackItem = fallback?.find(
        (candidate) => candidate?.servicekey && candidate.servicekey === item.servicekey
      );
      const detailsSource = item.details?.length ? item.details : fallbackItem?.details || [];
      const details = detailsSource
        .map((detail) => ({
          label: detail?.label?.trim() || '',
          value: detail?.value?.trim() || '',
          sortorder: detail?.sortorder ?? Number.MAX_SAFE_INTEGER,
        }))
        .filter((detail) => detail.label && detail.value)
        .sort((left, right) => left.sortorder - right.sortorder)
        .map(omitSortorder);

      return {
        key: item.servicekey?.trim() || slugify(title) || `service-item-${index}`,
        title,
        description: item.description?.trim() || fallbackItem?.description?.trim() || undefined,
        images: mapServiceImages(item.images, fallbackItem?.images, title),
        details,
        sortorder: item.sortorder ?? Number.MAX_SAFE_INTEGER,
      };
    })
    .filter((item) => item !== null)
    .sort((left, right) => left.sortorder - right.sortorder)
    .map(omitSortorder);
}

function mapServiceGroups(
  localized: DepartmentServiceSection['servicegroups'],
  fallback: DepartmentServiceSection['servicegroups']
): DepartmentServiceGroupItem[] {
  const groups = localized?.length ? localized : fallback || [];

  return groups
    .map((group, index) => {
      const title = group?.title?.trim();
      if (!title) return null;
      const fallbackGroup = fallback?.find(
        (candidate) => candidate?.servicekey && candidate.servicekey === group.servicekey
      );

      return {
        key: group.servicekey?.trim() || slugify(title) || `service-group-${index}`,
        title,
        description: group.description?.trim() || fallbackGroup?.description?.trim() || undefined,
        images: mapServiceImages(group.images, fallbackGroup?.images, title),
        items: mapStructuredServiceItems(group.items, fallbackGroup?.items),
        sortorder: group.sortorder ?? Number.MAX_SAFE_INTEGER,
      };
    })
    .filter((group) => group !== null)
    .sort((left, right) => left.sortorder - right.sortorder)
    .map(omitSortorder);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function splitVerticalTextTitle(verticalText: string): Pick<
  DepartmentResearchHighlightsViewModel,
  'titlePart1' | 'titlePart2'
> {
  const title = verticalText.trim();

  if (!title) {
    return {
      titlePart1: 'Research ',
      titlePart2: 'Highlights',
    };
  }

  if (title.toLowerCase() === 'research highlights') {
    return {
      titlePart1: 'Research ',
      titlePart2: 'Highlights',
    };
  }

  const lastSpaceIndex = title.lastIndexOf(' ');

  if (lastSpaceIndex === -1) {
    return {
      titlePart1: '',
      titlePart2: title,
    };
  }

  return {
    titlePart1: title.slice(0, lastSpaceIndex + 1),
    titlePart2: title.slice(lastSpaceIndex + 1),
  };
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

function mapTechnicalStaffGroups(
  localizedGroups: DepartmentTechnicalStaffGroup[] | null | undefined,
  fallbackGroups: DepartmentTechnicalStaffGroup[] | null | undefined
): DepartmentTechnicalStaffGroupItem[] {
  const groups = localizedGroups?.length ? localizedGroups : fallbackGroups || [];

  return groups
    .map((group): DepartmentTechnicalStaffGroupItem | null => {
      const title = group?.title?.trim();
      const members = (group?.members || [])
        .map((member) => {
          const name = member?.name?.trim();

          if (!name) {
            return null;
          }

          return {
            id: String(member.id),
            name,
            qualifications: member.qualifications?.trim() || undefined,
          };
        })
        .filter((member): member is NonNullable<typeof member> => Boolean(member));

      if (!title || members.length === 0) {
        return null;
      }

      return {
        id: String(group.id),
        title,
        members,
      };
    })
    .filter((group): group is DepartmentTechnicalStaffGroupItem => Boolean(group));
}

function mapHighlightCards(
  localizedCards: DepartmentResearchHighlightCard[] | null | undefined,
  fallbackCards: DepartmentResearchHighlightCard[] | null | undefined
): DepartmentResearchHighlightItem[] {
  const cards = localizedCards?.length ? localizedCards : fallbackCards || [];

  return sortBySortOrder(cards)
    .map((card): DepartmentResearchHighlightItem | null => {
      const title = card.title?.trim();
      const description = card.description?.trim();

      if (!title || !description) {
        return null;
      }

      const imageSrc =
        getOptimizedImageUrl(card.image, 'large') ||
        getOptimizedImageUrl(card.image, 'medium') ||
        getStrapiImageUrl(card.image) ||
        undefined;

      return {
        id: card.id ? String(card.id) : slugify(title),
        title,
        description,
        researchTeam: card.researchteam?.trim() || undefined,
        imageSrc,
        imageAlt: card.image?.alternativeText || title,
      };
    })
    .filter((highlight): highlight is DepartmentResearchHighlightItem => Boolean(highlight));
}

function mapProjectGalleryImages(
  images: DepartmentCurrentResearchProjectCard['galleryimages'],
  title: string
): NonNullable<DepartmentCurrentProjectItem['gallery']> {
  return (images || [])
    .map((image, index) => {
      const src =
        getOptimizedImageUrl(image, 'large') ||
        getOptimizedImageUrl(image, 'medium') ||
        getStrapiImageUrl(image);

      if (!src) {
        return null;
      }

      return {
        id: image.id ? String(image.id) : `${slugify(title)}-gallery-${index + 1}`,
        src,
        alt: image.alternativeText || `${title} image ${index + 1}`,
      };
    })
    .filter((image): image is NonNullable<DepartmentCurrentProjectItem['gallery']>[number] =>
      Boolean(image)
    );
}

function mapCurrentProjectCards(
  localizedProjects: DepartmentCurrentResearchProjectCard[] | null | undefined,
  fallbackProjects: DepartmentCurrentResearchProjectCard[] | null | undefined,
  departmentName: string,
  _slug: string
): DepartmentCurrentProjectItem[] {
  const projects = localizedProjects?.length ? localizedProjects : fallbackProjects || [];

  return sortBySortOrder(projects)
    .map((project): DepartmentCurrentProjectItem | null => {
      const title = project.title?.trim();

      if (!title) {
        return null;
      }

      const imageSrc =
        getOptimizedImageUrl(project.image, 'large') ||
        getOptimizedImageUrl(project.image, 'medium') ||
        getStrapiImageUrl(project.image) ||
        undefined;

      return {
        id: project.id ? String(project.id) : slugify(title),
        title,
        description: project.description?.trim() || undefined,
        researchTeam: project.researchteam?.trim() || undefined,
        imageSrc,
        imageAlt: project.image?.alternativeText || title,
        gallery: mapProjectGalleryImages(project.galleryimages, title),
        departmentName,
      };
    })
    .filter((project): project is DepartmentCurrentProjectItem => Boolean(project));
}

/**
 * Publication year for descending sort:
 * prefer "Published in YYYY", else first (YYYY), else highest standalone year.
 */
export function extractPublicationYear(text: string): number | null {
  if (!text) {
    return null;
  }

  const publishedInMatch = text.match(/Published\s+in\s+(19|20)\d{2}/i);
  if (publishedInMatch) {
    const year = Number(publishedInMatch[0].match(/(19|20)\d{2}/)?.[0]);
    if (Number.isFinite(year)) {
      return year;
    }
  }

  const parentheticalMatch = text.match(/\((19|20)\d{2}\)/);
  if (parentheticalMatch) {
    const year = Number(parentheticalMatch[0].replace(/[()]/g, ''));
    if (Number.isFinite(year)) {
      return year;
    }
  }

  const standaloneYears = [...text.matchAll(/\b((?:19|20)\d{2})\b/g)].map((match) =>
    Number(match[1])
  );
  if (standaloneYears.length === 0) {
    return null;
  }

  return Math.max(...standaloneYears);
}

function sortEntriesByYearDescending(entries: string[]): string[] {
  return [...entries]
    .map((entry, index) => ({ entry, index, year: extractPublicationYear(entry) }))
    .sort((left, right) => {
      if (left.year == null && right.year == null) {
        return left.index - right.index;
      }

      if (left.year == null) {
        return 1;
      }

      if (right.year == null) {
        return -1;
      }

      if (right.year !== left.year) {
        return right.year - left.year;
      }

      return left.index - right.index;
    })
    .map((item) => item.entry);
}

function mapPublicationCards(
  localizedCards: DepartmentPublicationCard[] | null | undefined,
  fallbackCards: DepartmentPublicationCard[] | null | undefined,
  options?: { sortEntriesByYearDesc?: boolean }
): DepartmentPublicationSectionItem[] {
  const cards = localizedCards?.length ? localizedCards : fallbackCards || [];
  const sortEntriesByYearDesc = options?.sortEntriesByYearDesc === true;

  return sortBySortOrder(cards)
    .map((card): DepartmentPublicationSectionItem | null => {
      const label = card.title?.trim();
      const rawEntries =
        card.points
          ?.map((item) => item?.paragraph?.trim())
          .filter((entry): entry is string => Boolean(entry)) || [];
      const entries = sortEntriesByYearDesc
        ? sortEntriesByYearDescending(rawEntries)
        : rawEntries;

      if (!label || entries.length === 0) {
        return null;
      }

      return {
        id: card.id ? String(card.id) : slugify(label),
        label,
        entries,
      };
    })
    .filter((section): section is DepartmentPublicationSectionItem => Boolean(section));
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
  const closingDescription =
    section.closingparagraph?.trim() || fallbackSection?.closingparagraph?.trim() || undefined;

  if (!title && !description) {
    return null;
  }

  return {
    tagText: header?.eyebrow?.trim() || 'Main objective',
    ...titleParts,
    description,
    closingDescription,
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
  const serviceGroups = mapServiceGroups(
    section.servicegroups,
    fallbackPage?.servicesection?.servicegroups
  );

  if (items.length === 0 && serviceGroups.length === 0) {
    return null;
  }

  return {
    tagText: header?.eyebrow?.trim() || 'Main objective',
    ...titleParts,
    items,
    serviceGroups,
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
  const technicalStaffGroups = mapTechnicalStaffGroups(
    section.technicalstaffgroups,
    fallbackPage?.researchstaffsection?.technicalstaffgroups
  );

  if (staff.length === 0 && technicalStaffGroups.length === 0) {
    return null;
  }

  return {
    tagText: header?.eyebrow?.trim() || 'Research Staff',
    ...titleParts,
    staff,
    technicalStaffGroups,
  };
}

export function mapDepartmentResearchHighlights(
  localizedPage: DepartmentSingleTypePage | null | undefined,
  fallbackPage?: DepartmentSingleTypePage | null
): DepartmentResearchHighlightsViewModel | null {
  const isPresent =
    localizedPage?.researchhighlightspresent ?? fallbackPage?.researchhighlightspresent;

  if (isPresent !== true) {
    return null;
  }

  const section: DepartmentResearchHighlightsSection | null | undefined =
    localizedPage?.researchhighlightssection || fallbackPage?.researchhighlightssection;

  if (!section) {
    return null;
  }

  const highlights = mapHighlightCards(
    section.researchhighlightcards,
    fallbackPage?.researchhighlightssection?.researchhighlightcards
  );

  if (highlights.length === 0) {
    return null;
  }

  const verticalText =
    section.verticaltext || fallbackPage?.researchhighlightssection?.verticaltext || 'Research Highlights';
  const titleParts = splitVerticalTextTitle(verticalText);

  return {
    tagText: verticalText,
    ...titleParts,
    highlights,
  };
}

export function mapDepartmentCurrentProjects(
  localizedPage: DepartmentSingleTypePage | null | undefined,
  fallbackPage: DepartmentSingleTypePage | null | undefined,
  slug: string
): DepartmentCurrentProjectsViewModel | null {
  const isPresent = localizedPage?.currentprojectpresent ?? fallbackPage?.currentprojectpresent;

  if (isPresent !== true) {
    return null;
  }

  const section: DepartmentCurrentResearchProjectSection | null | undefined =
    localizedPage?.currentresearchprojectsection ||
    fallbackPage?.currentresearchprojectsection;

  if (!section) {
    return null;
  }

  const header = section.sectionheader || fallbackPage?.currentresearchprojectsection?.sectionheader;
  const title = header?.title || '';
  const highlightedText = header?.hightlightedtext || '';
  const titleParts = splitTitle(title, highlightedText);
  const departmentName =
    localizedPage?.departmenttitle?.trim() ||
    fallbackPage?.departmenttitle?.trim() ||
    humanizeSlug(slug);
  const projects = mapCurrentProjectCards(
    section.researchprojects,
    fallbackPage?.currentresearchprojectsection?.researchprojects,
    departmentName,
    slug
  );

  if (projects.length === 0) {
    return null;
  }

  return {
    tagText: header?.eyebrow?.trim() || 'Recent Project',
    ...titleParts,
    projects,
  };
}

export function mapDepartmentPublications(
  localizedPage: DepartmentSingleTypePage | null | undefined,
  fallbackPage?: DepartmentSingleTypePage | null
): DepartmentPublicationsViewModel | null {
  const isPresent = localizedPage?.publicationspresent ?? fallbackPage?.publicationspresent;

  if (isPresent !== true) {
    return null;
  }

  const section: DepartmentPublicationsSection | null | undefined =
    localizedPage?.publicationssection || fallbackPage?.publicationssection;

  if (!section) {
    return null;
  }

  const sections = mapPublicationCards(
    section.publications,
    fallbackPage?.publicationssection?.publications,
    { sortEntriesByYearDesc: true }
  );

  if (sections.length === 0) {
    return null;
  }

  const sectionTitle =
    section.sectiontitle?.trim() ||
    fallbackPage?.publicationssection?.sectiontitle?.trim() ||
    'Publications';

  return {
    tagText: 'Publications',
    titlePart1: sectionTitle.toLowerCase() === 'publications' ? 'Our' : sectionTitle,
    titlePart2: sectionTitle.toLowerCase() === 'publications' ? 'Publications' : '',
    sections,
  };
}

export function mapDepartmentAchievements(
  localizedPage: DepartmentSingleTypePage | null | undefined,
  fallbackPage?: DepartmentSingleTypePage | null
): DepartmentAchievementsViewModel | null {
  const isPresent = localizedPage?.achievementspresent ?? fallbackPage?.achievementspresent;

  if (isPresent !== true) {
    return null;
  }

  const section: DepartmentAchievementSection | null | undefined =
    localizedPage?.achievementssection || fallbackPage?.achievementssection;

  if (!section) {
    return null;
  }

  const sections = mapPublicationCards(
    section.categories,
    fallbackPage?.achievementssection?.categories
  );

  if (sections.length === 0) {
    return null;
  }

  const rightImage = section.rightimage || fallbackPage?.achievementssection?.rightimage || null;
  const rightBackgroundImageSrc =
    getOptimizedImageUrl(rightImage, 'large') ||
    getOptimizedImageUrl(rightImage, 'medium') ||
    getStrapiImageUrl(rightImage) ||
    DEPARTMENT_ACHIEVEMENTS_FALLBACK.rightBackgroundImageSrc;

  return {
    title:
      section.sectiontitle?.trim() ||
      fallbackPage?.achievementssection?.sectiontitle?.trim() ||
      'Our Achievements',
    leftBackgroundImageSrc: DEPARTMENT_ACHIEVEMENTS_FALLBACK.leftBackgroundImageSrc,
    leftBackgroundImageAlt: DEPARTMENT_ACHIEVEMENTS_FALLBACK.leftBackgroundImageAlt,
    rightBackgroundImageSrc,
    rightBackgroundImageAlt:
      section.rightimage?.alternativeText ||
      fallbackPage?.achievementssection?.rightimage?.alternativeText ||
      DEPARTMENT_ACHIEVEMENTS_FALLBACK.rightBackgroundImageAlt,
    sections,
  };
}
