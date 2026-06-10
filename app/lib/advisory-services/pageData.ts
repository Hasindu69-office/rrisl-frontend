import type { BreadcrumbItem } from '@/app/components/shared/Breadcrumb';
import {
  ADVISORY_TRAINING_CATEGORIES,
  type AdvisoryTrainingCard,
  type AdvisoryTrainingCategory,
} from '@/app/components/services/AdvisoryServicesProgramsSliderSection.data';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';
import type {
  AdvisoryServicePage,
  SectionHeader,
  TrainingProgram,
  TrainingProgramCategory,
} from '@/app/lib/types';

export interface AdvisoryServicesHeroViewModel {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  backgroundImage?: string;
  backgroundImageAlt: string;
}

export interface AdvisoryServicesOverviewViewModel {
  tag: string;
  title: string;
  paragraphs: string[];
  imageSrc: string;
  imageAlt: string;
}

export interface AdvisoryServicesProgramsViewModel {
  categories: AdvisoryTrainingCategory[];
  backgroundImage: string;
  backgroundImageAlt: string;
}

export interface AdvisoryServicesPageViewModel {
  hero: AdvisoryServicesHeroViewModel;
  overview: AdvisoryServicesOverviewViewModel;
  programs: AdvisoryServicesProgramsViewModel;
}

const ADVISORY_SERVICES_FALLBACK: AdvisoryServicesPageViewModel = {
  hero: {
    title: 'Advisory Services',
    breadcrumbItems: [
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/services' },
      { label: 'Advisory Services' },
    ],
    backgroundImage: '/images/aboutus_heroimg.jpg',
    backgroundImageAlt: 'Advisory services background',
  },
  overview: {
    tag: 'What we offer',
    title: 'Overview',
    paragraphs: [
      'Advisory Services Department (ASD) aims to increase the productivity of rubber smallholders and enhance their income levels and social status by inducing voluntary change among them. Transfer of technology in multiple directions for sustainable rubber production, marketing, mobilizing and organizing farmer groups, building human resources and enhancing local capacity of rubber smallholders in the country are among the key activities of the department.',
      'Extension & Advisory programmes are carried out under 4 thrust areas to improve the adoption rates of recommended technologies to enhance the productivity & profitability of the rubber smallholder sector.',
    ],
    imageSrc: '/images/services/advisoryservices/advisoryservicessection1img.webp',
    imageAlt: 'Advisor standing in a rubber plantation',
  },
  programs: {
    categories: ADVISORY_TRAINING_CATEGORIES,
    backgroundImage: '/images/services/advisoryservices/section2backgroundservices.png',
    backgroundImageAlt: 'Advisory services training programs background',
  },
};

function toSlug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function buildViewModelId(
  preferredId: string | null | undefined,
  numericId: number | null | undefined,
  fallbackValue: string,
  index: number
): string {
  if (preferredId?.trim()) {
    return preferredId.trim();
  }

  if (typeof numericId === 'number') {
    return `${numericId}-${toSlug(fallbackValue)}`;
  }

  return `${index}-${toSlug(fallbackValue)}`;
}

function sortBySortOrder<T extends { sortorder?: number }>(items: T[]): T[] {
  return [...items].sort((left, right) => {
    const leftOrder = typeof left?.sortorder === 'number' ? left.sortorder : Number.MAX_SAFE_INTEGER;
    const rightOrder = typeof right?.sortorder === 'number' ? right.sortorder : Number.MAX_SAFE_INTEGER;
    return leftOrder - rightOrder;
  });
}

function mapBreadcrumbItems(page: AdvisoryServicePage | null | undefined): BreadcrumbItem[] {
  const breadcrumbItems =
    page?.pagehero?.Breadcrumb
      ?.filter((item) => item?.label)
      .map((item) => ({
        label: item.label,
        ...(item.href ? { href: item.href } : {}),
      })) || [];

  return breadcrumbItems.length > 0
    ? breadcrumbItems
    : ADVISORY_SERVICES_FALLBACK.hero.breadcrumbItems;
}

function mapOverviewTitle(header: SectionHeader | null | undefined): string {
  const title = header?.title?.trim();
  const highlightedText = header?.hightlightedtext?.trim();

  if (title && highlightedText) {
    return `${title} ${highlightedText}`;
  }

  return title || highlightedText || ADVISORY_SERVICES_FALLBACK.overview.title;
}

function getCategoryKey(category: TrainingProgramCategory | null | undefined): string | null {
  if (!category) {
    return null;
  }

  if (category.documentId?.trim()) {
    return `document:${category.documentId.trim()}`;
  }

  if (typeof category.id === 'number') {
    return `id:${category.id}`;
  }

  if (category.categorytitle?.trim()) {
    return `title:${category.categorytitle.trim().toLowerCase()}`;
  }

  return null;
}

function getFallbackCard(categoryIndex: number, programIndex: number): AdvisoryTrainingCard {
  const fallbackCategory =
    ADVISORY_TRAINING_CATEGORIES[categoryIndex % ADVISORY_TRAINING_CATEGORIES.length];

  return fallbackCategory.cards[programIndex % fallbackCategory.cards.length];
}

function mapTrainingCategories(
  localizedCategories: TrainingProgramCategory[],
  fallbackCategories: TrainingProgramCategory[],
  localizedPrograms: TrainingProgram[],
  fallbackPrograms: TrainingProgram[]
): AdvisoryTrainingCategory[] {
  const categories = localizedCategories.length > 0 ? localizedCategories : fallbackCategories;
  const programs = localizedPrograms.length > 0 ? localizedPrograms : fallbackPrograms;

  if (categories.length === 0 || programs.length === 0) {
    return ADVISORY_SERVICES_FALLBACK_CATEGORIES;
  }

  const sortedCategories = sortBySortOrder(categories).filter((category) =>
    category?.categorytitle?.trim()
  );
  const sortedPrograms = sortBySortOrder(programs).filter(
    (program) => program?.programname?.trim() && program?.description?.trim()
  );

  const mappedCategories = sortedCategories
    .map((category, categoryIndex) => {
      const categoryKey = getCategoryKey(category);
      const categoryPrograms = sortedPrograms.filter(
        (program) => getCategoryKey(program.training_program_category) === categoryKey
      );

      const cards = categoryPrograms.map((program, programIndex) => {
        const fallbackCard = getFallbackCard(categoryIndex, programIndex);
        const imageSrc =
          getOptimizedImageUrl(program.image, 'medium') ||
          getOptimizedImageUrl(program.image, 'small') ||
          getStrapiImageUrl(program.image) ||
          fallbackCard.imageSrc;

        return {
          id: buildViewModelId(program.documentId, program.id, program.programname, programIndex),
          title: program.programname.trim(),
          description: program.description.trim(),
          imageSrc,
          imageAlt: program.image?.alternativeText || fallbackCard.imageAlt,
        };
      });

      return {
        id: buildViewModelId(category.documentId, category.id, category.categorytitle, categoryIndex),
        label: category.categorytitle.trim(),
        cards,
      };
    })
    .filter((category) => category.cards.length > 0);

  return mappedCategories.length > 0 ? mappedCategories : ADVISORY_SERVICES_FALLBACK_CATEGORIES;
}

const ADVISORY_SERVICES_FALLBACK_CATEGORIES = ADVISORY_TRAINING_CATEGORIES;

export function mapAdvisoryServicesPageData(
  localizedPage: AdvisoryServicePage | null | undefined,
  fallbackPage: AdvisoryServicePage | null | undefined,
  localizedCategories: TrainingProgramCategory[],
  fallbackCategories: TrainingProgramCategory[],
  localizedPrograms: TrainingProgram[],
  fallbackPrograms: TrainingProgram[]
): AdvisoryServicesPageViewModel {
  const hero = localizedPage?.pagehero || fallbackPage?.pagehero;
  const heroImage = hero?.backgroundImage || fallbackPage?.pagehero?.backgroundImage || null;
  const sectionHeader = localizedPage?.sectionheader || fallbackPage?.sectionheader;
  const sectionImage = localizedPage?.sectionimgleft || fallbackPage?.sectionimgleft || null;
  const backgroundImage =
    localizedPage?.trainingprogrambgimg || fallbackPage?.trainingprogrambgimg || null;
  const paragraphs =
    localizedPage?.description?.length
      ? localizedPage.description
      : fallbackPage?.description || [];
  const mappedParagraphs = paragraphs
    .map((item) => item?.paragraph?.trim())
    .filter((paragraph): paragraph is string => Boolean(paragraph));

  return {
    hero: {
      title: hero?.PageTitle?.trim() || ADVISORY_SERVICES_FALLBACK.hero.title,
      breadcrumbItems: mapBreadcrumbItems(localizedPage || fallbackPage),
      backgroundImage:
        getOptimizedImageUrl(heroImage, 'large') ||
        getOptimizedImageUrl(heroImage, 'medium') ||
        getStrapiImageUrl(heroImage) ||
        ADVISORY_SERVICES_FALLBACK.hero.backgroundImage,
      backgroundImageAlt:
        hero?.backgroundImageAlt?.trim() ||
        heroImage?.alternativeText ||
        ADVISORY_SERVICES_FALLBACK.hero.backgroundImageAlt,
    },
    overview: {
      tag: sectionHeader?.eyebrow?.trim() || ADVISORY_SERVICES_FALLBACK.overview.tag,
      title: mapOverviewTitle(sectionHeader),
      paragraphs:
        mappedParagraphs.length > 0
          ? mappedParagraphs
          : ADVISORY_SERVICES_FALLBACK.overview.paragraphs,
      imageSrc:
        getOptimizedImageUrl(sectionImage, 'large') ||
        getOptimizedImageUrl(sectionImage, 'medium') ||
        getStrapiImageUrl(sectionImage) ||
        ADVISORY_SERVICES_FALLBACK.overview.imageSrc,
      imageAlt:
        sectionImage?.alternativeText ||
        ADVISORY_SERVICES_FALLBACK.overview.imageAlt,
    },
    programs: {
      categories: mapTrainingCategories(
        localizedCategories,
        fallbackCategories,
        localizedPrograms,
        fallbackPrograms
      ),
      backgroundImage:
        getOptimizedImageUrl(backgroundImage, 'large') ||
        getOptimizedImageUrl(backgroundImage, 'medium') ||
        getStrapiImageUrl(backgroundImage) ||
        ADVISORY_SERVICES_FALLBACK.programs.backgroundImage,
      backgroundImageAlt:
        backgroundImage?.alternativeText ||
        ADVISORY_SERVICES_FALLBACK.programs.backgroundImageAlt,
    },
  };
}

export { ADVISORY_SERVICES_FALLBACK };
