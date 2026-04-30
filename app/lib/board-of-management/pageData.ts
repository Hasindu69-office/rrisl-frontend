import type { BreadcrumbItem } from '@/app/components/shared/Breadcrumb';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';
import type {
  BoardMember,
  HighlightedTitle,
  ManagementBoardPage,
  ManagementBoardPageHero,
} from '@/app/lib/types';

export interface BoardHeroViewModel {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  backgroundImage?: string;
  backgroundImageAlt: string;
}

export interface BoardSectionTitleViewModel {
  part1: string;
  part2: string;
}

export interface BoardMemberCardViewModel {
  name: string;
  descriptor?: string;
  organizationText?: string;
  imageSrc: string;
  imageAlt: string;
}

export interface BoardOfManagementPageViewModel {
  hero: BoardHeroViewModel;
  memberBoardTitle: BoardSectionTitleViewModel;
  attendanceTitle: BoardSectionTitleViewModel;
  emptyStateTitle: string;
  emptyStateDescription: string;
  boardMembers: BoardMemberCardViewModel[];
  attendanceMembers: BoardMemberCardViewModel[];
}

const BOARD_PAGE_FALLBACK: BoardOfManagementPageViewModel = {
  hero: {
    title: 'Board of management',
    breadcrumbItems: [
      { label: 'Home', href: '/' },
      { label: 'Board of management' },
    ],
    backgroundImage: '/images/aboutus_heroimg.jpg',
    backgroundImageAlt: 'Board of management background',
  },
  memberBoardTitle: {
    part1: 'Members',
    part2: ' of the Board',
  },
  attendanceTitle: {
    part1: 'In',
    part2: ' Attendance',
  },
  emptyStateTitle: 'There is no members uploaded at the moment.',
  emptyStateDescription: 'Please check back later for upcoming board member updates.',
  boardMembers: [],
  attendanceMembers: [],
};

function mapBreadcrumbItems(hero: ManagementBoardPageHero | null | undefined): BreadcrumbItem[] {
  const breadcrumbItems =
    hero?.Breadcrumb
      ?.filter((item) => item?.label)
      .map((item) => ({
        label: item.label,
        ...(item.href ? { href: item.href } : {}),
      })) || [];

  return breadcrumbItems.length > 0
    ? breadcrumbItems
    : BOARD_PAGE_FALLBACK.hero.breadcrumbItems;
}

function mapSectionTitle(
  title: HighlightedTitle | null | undefined,
  fallback: BoardSectionTitleViewModel
): BoardSectionTitleViewModel {
  return {
    part1: title?.Title || fallback.part1,
    part2: title?.HighlightedText || fallback.part2,
  };
}

function mapBoardMember(member: BoardMember): BoardMemberCardViewModel {
  const organizationText = member.OrganizationLines?.map((line) => line?.Text?.trim())
    .filter((line): line is string => Boolean(line))
    .join(', ');

  const imageSrc =
    getOptimizedImageUrl(member.ProfileImage, 'medium') ||
    getOptimizedImageUrl(member.ProfileImage, 'small') ||
    getStrapiImageUrl(member.ProfileImage) ||
    '/images/avatarimages.png';

  return {
    name: member.FullName,
    descriptor: member.Position,
    organizationText: organizationText || undefined,
    imageSrc,
    imageAlt: member.ImageAlt || member.ProfileImage?.alternativeText || member.FullName,
  };
}

export function mapBoardOfManagementPageData(
  localizedPage: ManagementBoardPage | null | undefined,
  fallbackPage: ManagementBoardPage | null | undefined,
  boardMembers: BoardMember[],
  attendanceMembers: BoardMember[]
): BoardOfManagementPageViewModel {
  const hero = localizedPage?.pagehero || fallbackPage?.pagehero;
  const image = hero?.backgroundImage || fallbackPage?.pagehero?.backgroundImage || null;

  return {
    hero: {
      title: hero?.PageTitle || BOARD_PAGE_FALLBACK.hero.title,
      breadcrumbItems: mapBreadcrumbItems(hero),
      backgroundImage:
        getOptimizedImageUrl(image, 'large') ||
        getOptimizedImageUrl(image, 'medium') ||
        getStrapiImageUrl(image) ||
        BOARD_PAGE_FALLBACK.hero.backgroundImage,
      backgroundImageAlt:
        hero?.backgroundImageAlt ||
        image?.alternativeText ||
        BOARD_PAGE_FALLBACK.hero.backgroundImageAlt,
    },
    memberBoardTitle: mapSectionTitle(
      localizedPage?.LabelMemberBoard || fallbackPage?.LabelMemberBoard,
      BOARD_PAGE_FALLBACK.memberBoardTitle
    ),
    attendanceTitle: mapSectionTitle(
      localizedPage?.LabelInAttendance || fallbackPage?.LabelInAttendance,
      BOARD_PAGE_FALLBACK.attendanceTitle
    ),
    emptyStateTitle:
      localizedPage?.ErrorMessage?.title ||
      fallbackPage?.ErrorMessage?.title ||
      BOARD_PAGE_FALLBACK.emptyStateTitle,
    emptyStateDescription:
      localizedPage?.ErrorMessage?.description ||
      fallbackPage?.ErrorMessage?.description ||
      BOARD_PAGE_FALLBACK.emptyStateDescription,
    boardMembers: boardMembers.map(mapBoardMember),
    attendanceMembers: attendanceMembers.map(mapBoardMember),
  };
}
