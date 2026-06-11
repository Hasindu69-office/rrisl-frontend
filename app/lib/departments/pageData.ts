import type { BreadcrumbItem } from '@/app/components/shared/Breadcrumb';
import type {
  DepartmentResearchHighlightImage,
  DepartmentResearchHighlightItem,
} from '@/app/components/department/DepartmentResearchHighlightsSection';
import type { DepartmentAwardsTimelineItem } from '@/app/components/department/DepartmentAwardsTimelineSection';
import type { DepartmentCurrentProjectItem } from '@/app/components/department/DepartmentCurrentProjectsSection';
import type { DepartmentPublicationSectionItem } from '@/app/components/department/DepartmentPublicationsSection';
import type { DepartmentServiceItem } from '@/app/components/department/DepartmentServicesSection';
import type { DepartmentStaffMember } from '@/app/components/department/DepartmentStaffSection';
import type { DepartmentSectionPoint } from '@/app/components/department/DepartmentSection';
import type {
  DepartmentAwardsSection,
  DepartmentAwardsTimelineCard,
  DepartmentHighlightSubcard,
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

export interface DepartmentAwardsTimelineViewModel {
  tagText: string;
  titlePart1: string;
  titlePart2: string;
  items: DepartmentAwardsTimelineItem[];
}

export interface DepartmentPublicationsViewModel {
  title: string;
  leftBackgroundImageSrc: string;
  leftBackgroundImageAlt: string;
  rightBackgroundImageSrc: string;
  rightBackgroundImageAlt: string;
  sections: DepartmentPublicationSectionItem[];
}

const DEPARTMENT_PUBLICATIONS_FALLBACK = {
  leftBackgroundImageSrc: '/images/departments/bgdotsourpublications.png',
  leftBackgroundImageAlt: 'Decorative dotted background for publications',
  rightBackgroundImageSrc: '/images/departments/bgimgourpulications.jpg',
  rightBackgroundImageAlt: 'Publications section background',
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

function mapHighlightImages(
  images: DepartmentHighlightSubcard['galleryimages'],
  title: string
): DepartmentResearchHighlightImage[] {
  return (images || [])
    .map((image, index): DepartmentResearchHighlightImage | null => {
      const src =
        getOptimizedImageUrl(image, 'large') ||
        getOptimizedImageUrl(image, 'medium') ||
        getStrapiImageUrl(image);

      if (!src) {
        return null;
      }

      return {
        src,
        alt: image.alternativeText || title,
        title: image.caption || image.alternativeText || `${title} image ${index + 1}`,
      };
    })
    .filter((image): image is DepartmentResearchHighlightImage => Boolean(image));
}

function mapHighlightSubcards(
  localizedCards: DepartmentHighlightSubcard[] | null | undefined,
  fallbackCards: DepartmentHighlightSubcard[] | null | undefined
): DepartmentResearchHighlightItem['sections'] {
  const cards = localizedCards?.length ? localizedCards : fallbackCards || [];

  return sortBySortOrder(cards)
    .map((card): NonNullable<DepartmentResearchHighlightItem['sections']>[number] | null => {
      const heading = card.subtitle?.trim();
      const paragraphs =
        card.paragraph
          ?.map((item) => item?.paragraph?.trim())
          .filter((paragraph): paragraph is string => Boolean(paragraph)) || [];
      const items =
        card.points
          ?.map((item) => item?.label?.trim())
          .filter((label): label is string => Boolean(label)) || [];
      const images =
        card.needimages === true ? mapHighlightImages(card.galleryimages, heading || 'Research highlight') : [];

      if (!heading && paragraphs.length === 0 && items.length === 0 && images.length === 0) {
        return null;
      }

      return {
        id: card.id ? String(card.id) : slugify(heading || paragraphs[0] || 'highlight-subcard'),
        heading,
        body: paragraphs.join(' '),
        items,
        images,
      };
    })
    .filter((section): section is NonNullable<DepartmentResearchHighlightItem['sections']>[number] =>
      Boolean(section)
    );
}

function mapHighlightCards(
  localizedCards: DepartmentResearchHighlightCard[] | null | undefined,
  fallbackCards: DepartmentResearchHighlightCard[] | null | undefined
): DepartmentResearchHighlightItem[] {
  const cards = localizedCards?.length ? localizedCards : fallbackCards || [];

  return sortBySortOrder(cards)
    .map((card): DepartmentResearchHighlightItem | null => {
      const summary = card.title?.trim();

      if (!summary) {
        return null;
      }

      const iconSrc =
        getOptimizedImageUrl(card.icon, 'thumbnail') ||
        getOptimizedImageUrl(card.icon, 'small') ||
        getStrapiImageUrl(card.icon) ||
        undefined;
      const sections =
        card.subtopicpresent === true
          ? mapHighlightSubcards(card.cards, fallbackCards?.find((item) => item.id === card.id)?.cards)
          : [];

      return {
        id: card.id ? String(card.id) : slugify(summary),
        summary,
        details: card.description?.trim() || undefined,
        sections,
        iconSrc,
        iconAlt: card.icon?.alternativeText || summary,
      };
    })
    .filter((highlight): highlight is DepartmentResearchHighlightItem => Boolean(highlight));
}

function mapCurrentProjectCards(
  localizedProjects: DepartmentCurrentResearchProjectCard[] | null | undefined,
  fallbackProjects: DepartmentCurrentResearchProjectCard[] | null | undefined,
  departmentName: string,
  slug: string
): DepartmentCurrentProjectItem[] {
  const projects = localizedProjects?.length ? localizedProjects : fallbackProjects || [];

  return sortBySortOrder(projects)
    .map((project): DepartmentCurrentProjectItem | null => {
      const title = project.title?.trim();
      const imageSrc =
        getOptimizedImageUrl(project.image, 'large') ||
        getOptimizedImageUrl(project.image, 'medium') ||
        getStrapiImageUrl(project.image);

      if (!title || !imageSrc) {
        return null;
      }

      return {
        id: project.id ? String(project.id) : slugify(title),
        title,
        imageSrc,
        imageAlt: project.image?.alternativeText || title,
        departmentName,
      };
    })
    .filter((project): project is DepartmentCurrentProjectItem => Boolean(project));
}

function getYearFromDate(date: string): string {
  const year = date.slice(0, 4);
  return /^\d{4}$/.test(year) ? year : date;
}

function mapAwardsTimelineCards(
  localizedCards: DepartmentAwardsTimelineCard[] | null | undefined,
  fallbackCards: DepartmentAwardsTimelineCard[] | null | undefined
): DepartmentAwardsTimelineItem[] {
  const cards = localizedCards?.length ? localizedCards : fallbackCards || [];

  return [...cards]
    .map((card): (DepartmentAwardsTimelineCard & {
      title: string;
      date: string;
      description: string;
    }) | null => {
      const title = card.title?.trim();
      const date = card.date?.trim();
      const description = card.description?.trim();

      if (!title || !date || !description) {
        return null;
      }

      return {
        ...card,
        title,
        date,
        description,
      };
    })
    .filter(
      (
        card
      ): card is DepartmentAwardsTimelineCard & {
        title: string;
        date: string;
        description: string;
      } => Boolean(card)
    )
    .sort((left, right) => left.date.localeCompare(right.date))
    .map((card, index) => {
      const textBlock = {
        variant: 'text' as const,
        lines: [getYearFromDate(card.date), card.title],
      };
      const cardBlock = {
        variant: 'card' as const,
        content: card.description,
      };

      return {
        id: card.id ? String(card.id) : slugify(`${card.date}-${card.title}`),
        top: index % 2 === 0 ? textBlock : cardBlock,
        bottom: index % 2 === 0 ? cardBlock : textBlock,
      };
    });
}

function mapPublicationCards(
  localizedCards: DepartmentPublicationCard[] | null | undefined,
  fallbackCards: DepartmentPublicationCard[] | null | undefined
): DepartmentPublicationSectionItem[] {
  const cards = localizedCards?.length ? localizedCards : fallbackCards || [];

  return sortBySortOrder(cards)
    .map((card): DepartmentPublicationSectionItem | null => {
      const label = card.title?.trim();
      const entries =
        card.points
          ?.map((item) => item?.paragraph?.trim())
          .filter((entry): entry is string => Boolean(entry)) || [];

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

export function mapDepartmentAwardsTimeline(
  localizedPage: DepartmentSingleTypePage | null | undefined,
  fallbackPage?: DepartmentSingleTypePage | null
): DepartmentAwardsTimelineViewModel | null {
  const isPresent = localizedPage?.awardtimelinepresent ?? fallbackPage?.awardtimelinepresent;

  if (isPresent !== true) {
    return null;
  }

  const section: DepartmentAwardsSection | null | undefined =
    localizedPage?.awardssection || fallbackPage?.awardssection;

  if (!section) {
    return null;
  }

  const header = section.sectionheader || fallbackPage?.awardssection?.sectionheader;
  const title = header?.title || '';
  const highlightedText = header?.hightlightedtext || '';
  const titleParts = splitTitle(title, highlightedText);
  const items = mapAwardsTimelineCards(section.cards, fallbackPage?.awardssection?.cards);

  if (items.length === 0) {
    return null;
  }

  return {
    tagText: header?.eyebrow?.trim() || 'Awards & Achievements',
    ...titleParts,
    items,
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
    fallbackPage?.publicationssection?.publications
  );

  if (sections.length === 0) {
    return null;
  }

  const rightImage = section.rightimage || fallbackPage?.publicationssection?.rightimage || null;
  const rightBackgroundImageSrc =
    getOptimizedImageUrl(rightImage, 'large') ||
    getOptimizedImageUrl(rightImage, 'medium') ||
    getStrapiImageUrl(rightImage) ||
    DEPARTMENT_PUBLICATIONS_FALLBACK.rightBackgroundImageSrc;

  return {
    title:
      section.sectiontitle?.trim() ||
      fallbackPage?.publicationssection?.sectiontitle?.trim() ||
      'Our Publications',
    leftBackgroundImageSrc: DEPARTMENT_PUBLICATIONS_FALLBACK.leftBackgroundImageSrc,
    leftBackgroundImageAlt: DEPARTMENT_PUBLICATIONS_FALLBACK.leftBackgroundImageAlt,
    rightBackgroundImageSrc,
    rightBackgroundImageAlt:
      section.rightimage?.alternativeText ||
      fallbackPage?.publicationssection?.rightimage?.alternativeText ||
      DEPARTMENT_PUBLICATIONS_FALLBACK.rightBackgroundImageAlt,
    sections,
  };
}
