import type { Menu, NavigationImage, ResearchMegaMenuImages, StrapiImage } from '../types';
import { getOptimizedImageUrl, getStrapiImageUrl } from '../strapi';

const RESEARCH_DEPARTMENTS_FALLBACK: NavigationImage = {
  src: '/images/departments/geneticsplantbreedingsection1.png',
  alt: 'Rubber plant research and development nursery',
};

const ESTATES_AND_SUBSTATIONS_FALLBACK: NavigationImage = {
  src: '/images/estateandsubstations/nivitigalakelesubstation.png',
  alt: 'Rubber estate and substation landscape',
};

function resolveNavigationImage(
  images: Array<StrapiImage | null | undefined>,
  fallback: NavigationImage,
): NavigationImage {
  for (const image of images) {
    const src = getOptimizedImageUrl(image, 'medium') || getStrapiImageUrl(image);

    if (src) {
      return {
        src,
        alt: image?.alternativeText?.trim() || fallback.alt,
      };
    }
  }

  return fallback;
}

export function mapResearchMegaMenuImages(
  menu: Menu | null | undefined,
  fallbackMenu?: Menu | null,
): ResearchMegaMenuImages {
  return {
    researchDepartments: resolveNavigationImage(
      [menu?.researchdepartmentbackgroundimg, fallbackMenu?.researchdepartmentbackgroundimg],
      RESEARCH_DEPARTMENTS_FALLBACK,
    ),
    estatesAndSubstations: resolveNavigationImage(
      [menu?.estateandsubstationbackgroundimg, fallbackMenu?.estateandsubstationbackgroundimg],
      ESTATES_AND_SUBSTATIONS_FALLBACK,
    ),
  };
}
