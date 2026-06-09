import type { BreadcrumbItem } from '@/app/components/shared/Breadcrumb';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';
import type { SectionHeader, TrainingProgramCard, TrainingProgramPage } from '@/app/lib/types';

export interface TrainingProgramHeroViewModel {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  backgroundImage?: string;
  backgroundImageAlt: string;
}

export interface TrainingProgramTitleViewModel {
  part1: string;
  part2: string;
  align: 'left' | 'center' | 'right';
}

export interface TrainingProgramCardViewModel {
  title: string;
  items: string[];
  imageSrc: string;
  imageAlt: string;
  variant: 'light' | 'green';
  imageWrapClassName: string;
  imageClassName: string;
  contentClassName?: string;
  titleWrapClassName?: string;
  listClassName?: string;
  imageWidth: number;
  imageHeight: number;
}

export interface TrainingProgramSectionViewModel {
  tag: string;
  title: TrainingProgramTitleViewModel;
  description: string;
  backgroundImage: string;
  backgroundImageAlt: string;
}

export interface TrainingProgramPageViewModel {
  hero: TrainingProgramHeroViewModel;
  section: TrainingProgramSectionViewModel;
  cards: TrainingProgramCardViewModel[];
}

const CARD_LAYOUT_FALLBACKS: TrainingProgramCardViewModel[] = [
  {
    title: 'Centralized farmer Training programs',
    items: [
      'Nursery management and bud grafting training for selected nursery owners and bud grafters',
      'Advance training on rubber cultivation and plantation management for medium scale rubber growers',
      'Advance training on rubber cultivation and processing for rubber growers in non traditional areas',
    ],
    imageSrc: '/images/farmerleft.png',
    imageAlt: 'Farmer standing with folded arms',
    variant: 'light',
    imageWrapClassName: 'right-[-4px] md:right-[-10px] lg:right-[-200px]',
    imageClassName: 'w-[140px] md:w-[190px] lg:w-[750px]',
    contentClassName: 'px-5 py-5 md:px-6 md:py-6 lg:pt-8 lg:pb-30 lg:px-10',
    titleWrapClassName: 'max-w-full pr-0',
    listClassName:
      'mt-5 space-y-4 pr-0 md:mt-6 md:space-y-5 md:pr-24 lg:mt-10 lg:space-y-9 lg:pr-24',
    imageWidth: 800,
    imageHeight: 382,
  },
  {
    title: 'Decentralized Training Programs',
    items: [
      'Nursery management and bud grafting training for selected nursery owners and bud grafters',
      'Advance training on rubber cultivation and plantation management for medium scale rubber growers',
      'Advance training on rubber cultivation and processing for rubber growers in non traditional areas',
    ],
    imageSrc: '/images/farmerright.png',
    imageAlt: 'Farmer using a laptop',
    variant: 'green',
    imageWrapClassName: 'right-[-8px] md:right-[-14px] lg:right-[-130px]',
    imageClassName: 'w-[165px] md:w-[220px] lg:w-[650px]',
    contentClassName: 'px-5 py-5 md:px-6 md:py-6 lg:pt-8 lg:pb-30 lg:px-10',
    titleWrapClassName: 'max-w-full pr-0',
    listClassName:
      'mt-5 space-y-4 pr-0 md:mt-6 md:space-y-5 md:pr-24 lg:mt-10 lg:space-y-9 lg:pr-24',
    imageWidth: 425,
    imageHeight: 328,
  },
];

const TRAINING_PROGRAM_PAGE_FALLBACK: TrainingProgramPageViewModel = {
  hero: {
    title: 'Training Program',
    breadcrumbItems: [
      { label: 'Home', href: '/' },
      { label: 'Training Program' },
    ],
    backgroundImage: '/images/aboutus_heroimg.jpg',
    backgroundImageAlt: 'Training program background',
  },
  section: {
    tag: 'FAQ',
    title: {
      part1: 'Training & Capacity',
      part2: 'Building for Farmers',
      align: 'left',
    },
    description:
      'Two types of training programs are conducted by the ASD for rubber growers',
    backgroundImage: '/images/datainsightsbackground.png',
    backgroundImageAlt: 'Training programs background',
  },
  cards: CARD_LAYOUT_FALLBACKS,
};

function mapBreadcrumbItems(page: TrainingProgramPage | null | undefined): BreadcrumbItem[] {
  const breadcrumbItems =
    page?.pagehero?.Breadcrumb
      ?.filter((item) => item?.label)
      .map((item) => ({
        label: item.label,
        ...(item.href ? { href: item.href } : {}),
      })) || [];

  return breadcrumbItems.length > 0
    ? breadcrumbItems
    : TRAINING_PROGRAM_PAGE_FALLBACK.hero.breadcrumbItems;
}

function mapSectionTitle(
  header: SectionHeader | null | undefined,
  fallback: TrainingProgramTitleViewModel
): TrainingProgramTitleViewModel {
  return {
    part1: header?.title?.trim() || fallback.part1,
    part2: header?.hightlightedtext?.trim() || fallback.part2,
    align:
      header?.alignment === 'center' || header?.alignment === 'right'
        ? header.alignment
        : fallback.align,
  };
}

function sortProgramCards(cards: TrainingProgramCard[] | null | undefined): TrainingProgramCard[] {
  return [...(cards || [])].sort((left, right) => {
    const leftOrder = typeof left?.sortorder === 'number' ? left.sortorder : Number.MAX_SAFE_INTEGER;
    const rightOrder = typeof right?.sortorder === 'number' ? right.sortorder : Number.MAX_SAFE_INTEGER;
    return leftOrder - rightOrder;
  });
}

function mapProgramCards(
  localizedPage: TrainingProgramPage | null | undefined,
  fallbackPage: TrainingProgramPage | null | undefined
): TrainingProgramCardViewModel[] {
  const sourceCards =
    localizedPage?.trainingprogram?.length
      ? localizedPage.trainingprogram
      : fallbackPage?.trainingprogram || [];

  const mappedCards = sortProgramCards(sourceCards)
    .slice(0, CARD_LAYOUT_FALLBACKS.length)
    .map((card, index) => {
      const fallback = CARD_LAYOUT_FALLBACKS[index];
      const imageSrc =
        getOptimizedImageUrl(card.imageright, 'large') ||
        getOptimizedImageUrl(card.imageright, 'medium') ||
        getStrapiImageUrl(card.imageright) ||
        fallback.imageSrc;

      const items =
        card.points
          ?.map((point) => point?.point?.trim())
          .filter((point): point is string => Boolean(point)) || [];

      return {
        ...fallback,
        title: card.programtitle?.trim() || fallback.title,
        items: items.length > 0 ? items : fallback.items,
        imageSrc,
        imageAlt: card.imageright?.alternativeText || fallback.imageAlt,
      };
    });

  return mappedCards.length > 0 ? mappedCards : TRAINING_PROGRAM_PAGE_FALLBACK.cards;
}

export function mapTrainingProgramPageData(
  localizedPage: TrainingProgramPage | null | undefined,
  fallbackPage: TrainingProgramPage | null | undefined
): TrainingProgramPageViewModel {
  const hero = localizedPage?.pagehero || fallbackPage?.pagehero;
  const heroImage = hero?.backgroundImage || fallbackPage?.pagehero?.backgroundImage || null;
  const sectionHeader = localizedPage?.sectionheader || fallbackPage?.sectionheader;
  const backgroundImage = localizedPage?.backgroundimage || fallbackPage?.backgroundimage || null;

  return {
    hero: {
      title: hero?.PageTitle?.trim() || TRAINING_PROGRAM_PAGE_FALLBACK.hero.title,
      breadcrumbItems: mapBreadcrumbItems(localizedPage || fallbackPage),
      backgroundImage:
        getOptimizedImageUrl(heroImage, 'large') ||
        getOptimizedImageUrl(heroImage, 'medium') ||
        getStrapiImageUrl(heroImage) ||
        TRAINING_PROGRAM_PAGE_FALLBACK.hero.backgroundImage,
      backgroundImageAlt:
        hero?.backgroundImageAlt?.trim() ||
        heroImage?.alternativeText ||
        TRAINING_PROGRAM_PAGE_FALLBACK.hero.backgroundImageAlt,
    },
    section: {
      tag: sectionHeader?.eyebrow?.trim() || TRAINING_PROGRAM_PAGE_FALLBACK.section.tag,
      title: mapSectionTitle(sectionHeader, TRAINING_PROGRAM_PAGE_FALLBACK.section.title),
      description:
        localizedPage?.description?.trim() ||
        fallbackPage?.description?.trim() ||
        TRAINING_PROGRAM_PAGE_FALLBACK.section.description,
      backgroundImage:
        getOptimizedImageUrl(backgroundImage, 'large') ||
        getOptimizedImageUrl(backgroundImage, 'medium') ||
        getStrapiImageUrl(backgroundImage) ||
        TRAINING_PROGRAM_PAGE_FALLBACK.section.backgroundImage,
      backgroundImageAlt:
        backgroundImage?.alternativeText ||
        TRAINING_PROGRAM_PAGE_FALLBACK.section.backgroundImageAlt,
    },
    cards: mapProgramCards(localizedPage, fallbackPage),
  };
}

export { TRAINING_PROGRAM_PAGE_FALLBACK };
