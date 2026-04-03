import type { Hero, RichTextBlock, StrapiImage } from '@/app/lib/types';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';

export const HERO_IMAGE_FALLBACKS = ['/images/homeBannerimg1.png', '/images/homeBannerimg2.jpg'];

export function extractTextFromBlocks(blocks: RichTextBlock[] | null | undefined): string {
  if (!Array.isArray(blocks)) {
    return '';
  }

  return blocks
    .map((block) =>
      Array.isArray(block.children)
        ? block.children.map((child) => child.text || '').join('')
        : ''
    )
    .filter(Boolean)
    .join(' ')
    .trim();
}

export function normalizeHeroes(hero: Hero | Hero[] | null | undefined): Hero[] {
  if (!hero) {
    return [];
  }

  return Array.isArray(hero) ? hero.filter(Boolean) : [hero];
}

export function resolveHeroSlides(
  localizedHero: Hero | Hero[] | null | undefined,
  fallbackHero: Hero | Hero[] | null | undefined
): Hero[] {
  const localizedSlides = normalizeHeroes(localizedHero);
  const fallbackSlides = normalizeHeroes(fallbackHero);

  if (localizedSlides.length > 0) {
    return localizedSlides.map((slide, index) => {
      const fallbackSlide = fallbackSlides[index];

      if (!fallbackSlide) {
        return slide;
      }

      const localizedDesktopImages = normalizeImageCollection(slide.backgroundImageDesktop);
      const localizedMobileImages = normalizeImageCollection(slide.backgroundImageMobile);
      const localizedAvatars = slide.badges?.avatars || [];
      const mergedBadges = slide.badges || fallbackSlide.badges;

      return {
        ...slide,
        primaryCta: slide.primaryCta || fallbackSlide.primaryCta,
        labels: slide.labels || fallbackSlide.labels,
        backgroundImageDesktop:
          localizedDesktopImages.length > 0
            ? slide.backgroundImageDesktop
            : fallbackSlide.backgroundImageDesktop,
        backgroundImageMobile:
          localizedMobileImages.length > 0
            ? slide.backgroundImageMobile
            : fallbackSlide.backgroundImageMobile,
        badges: mergedBadges
          ? {
              ...mergedBadges,
              avatars:
                localizedAvatars.length > 0
                  ? localizedAvatars
                  : fallbackSlide.badges?.avatars || [],
              icon: slide.badges?.icon || fallbackSlide.badges?.icon || null,
            }
          : null,
      };
    });
  }

  return fallbackSlides;
}

function normalizeImageCollection(
  image: StrapiImage | StrapiImage[] | null | undefined
): StrapiImage[] {
  if (!image) {
    return [];
  }

  return Array.isArray(image) ? image : [image];
}

export function getHeroDesktopImage(hero: Hero, index: number): string | null {
  const images = normalizeImageCollection(hero.backgroundImageDesktop);
  const primaryImage = images[0];

  return (
    getOptimizedImageUrl(primaryImage, 'large') ||
    getStrapiImageUrl(primaryImage) ||
    HERO_IMAGE_FALLBACKS[index % HERO_IMAGE_FALLBACKS.length] ||
    null
  );
}

export function getHeroMobileImage(hero: Hero, index: number): string | null {
  const mobileImages = normalizeImageCollection(hero.backgroundImageMobile);
  const desktopImages = normalizeImageCollection(hero.backgroundImageDesktop);
  const primaryImage = mobileImages[0] || desktopImages[0];

  return (
    getOptimizedImageUrl(primaryImage, mobileImages[0] ? 'small' : 'large') ||
    getStrapiImageUrl(primaryImage) ||
    HERO_IMAGE_FALLBACKS[index % HERO_IMAGE_FALLBACKS.length] ||
    null
  );
}
