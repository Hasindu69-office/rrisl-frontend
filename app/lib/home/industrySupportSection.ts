import type {
  IndustrySupportCard,
  IndustrySupportSection,
} from '@/app/lib/types';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';

export interface IndustrySupportCardViewModel {
  id: number;
  title: string;
  description: string;
}

export interface IndustrySupportSectionViewModel {
  eyebrow: string;
  title: string;
  highlightedText: string;
  outlineText: string;
  backgroundImageSrc: string;
  backgroundImageAlt: string;
  plantImageSrc: string;
  plantImageAlt: string;
  cards: IndustrySupportCardViewModel[];
}

const INDUSTRY_SUPPORT_SECTION_FALLBACKS: IndustrySupportSectionViewModel = {
  eyebrow: 'What We Do',
  title: 'How We',
  highlightedText: 'Support the Industry',
  outlineText: 'What We Do',
  backgroundImageSrc: '/images/section3_bg.jpg',
  backgroundImageAlt: 'Dark soil background',
  plantImageSrc: '/images/section3_plant.png',
  plantImageAlt: 'Growing plant representing industry support',
  cards: [
    {
      id: 1,
      title: 'Research & Innovation',
      description: 'Advancing rubber science through multidisciplinary research.',
    },
    {
      id: 2,
      title: 'Training & Development',
      description: 'Workshops and programs to boost industry knowledge.',
    },
    {
      id: 3,
      title: 'Statistics & Market Insights',
      description: 'Trusted rubber production data and industry analysis.',
    },
    {
      id: 4,
      title: 'Field Advisory Services',
      description: 'Providing expert, on-ground support for rubber growers.',
    },
    {
      id: 5,
      title: 'Laboratory Services',
      description: 'Soil testing, plant diagnostics, and quality analysis.',
    },
    {
      id: 6,
      title: 'Rubber Clone Development',
      description: 'High-performing clones for sustainable cultivation.',
    },
  ],
};

function normalizeCards(
  cards: IndustrySupportCard[] | null | undefined
): IndustrySupportCardViewModel[] {
  if (!Array.isArray(cards)) {
    return [];
  }

  return cards
    .filter((card): card is IndustrySupportCard => Boolean(card))
    .sort((left, right) => {
      const leftOrder = left.sortorder ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = right.sortorder ?? Number.MAX_SAFE_INTEGER;

      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }

      return left.id - right.id;
    })
    .slice(0, 6)
    .map((card) => ({
      id: card.id,
      title: card.title || '',
      description: card.description || '',
    }))
    .filter((card) => card.title || card.description);
}

export function mapIndustrySupportSection(
  section: IndustrySupportSection | null | undefined
): IndustrySupportSectionViewModel {
  const backgroundImage = section?.backgroundImage;
  const plantImage = section?.plantimage;
  const cards = normalizeCards(section?.supporttheindustrycard);

  return {
    eyebrow:
      section?.supporttheindustrysection?.eyebrow || INDUSTRY_SUPPORT_SECTION_FALLBACKS.eyebrow,
    title:
      section?.supporttheindustrysection?.title || INDUSTRY_SUPPORT_SECTION_FALLBACKS.title,
    highlightedText:
      section?.supporttheindustrysection?.hightlightedtext ||
      INDUSTRY_SUPPORT_SECTION_FALLBACKS.highlightedText,
    outlineText: section?.outlinetext || INDUSTRY_SUPPORT_SECTION_FALLBACKS.outlineText,
    backgroundImageSrc:
      getOptimizedImageUrl(backgroundImage, 'large') ||
      getOptimizedImageUrl(backgroundImage, 'medium') ||
      getStrapiImageUrl(backgroundImage) ||
      INDUSTRY_SUPPORT_SECTION_FALLBACKS.backgroundImageSrc,
    backgroundImageAlt:
      backgroundImage?.alternativeText || INDUSTRY_SUPPORT_SECTION_FALLBACKS.backgroundImageAlt,
    plantImageSrc:
      getOptimizedImageUrl(plantImage, 'large') ||
      getOptimizedImageUrl(plantImage, 'medium') ||
      getStrapiImageUrl(plantImage) ||
      INDUSTRY_SUPPORT_SECTION_FALLBACKS.plantImageSrc,
    plantImageAlt: plantImage?.alternativeText || INDUSTRY_SUPPORT_SECTION_FALLBACKS.plantImageAlt,
    cards: cards.length > 0 ? cards : INDUSTRY_SUPPORT_SECTION_FALLBACKS.cards,
  };
}
