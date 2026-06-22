import type { AboutSection, HeroCta, RichTextBlock } from '@/app/lib/types';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';

export interface AboutSectionViewModel {
  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;
  announcementLabel: string;
  imageSrc: string;
  imageAlt: string;
  cta: HeroCta | null;
}

const ABOUT_SECTION_FALLBACKS: AboutSectionViewModel = {
  eyebrow: 'Who we are',
  title: 'Advancing Rubber',
  highlightedText: "Research for Sri Lanka's Future",
  description:
    'Rubber Research Institute of Sri Lanka is the oldest research institute on rubber in the world and is the nodal agency in Sri Lanka with the statutory responsibility for research and development on all aspects of rubber cultivation and processing for the benefit of the rubber industry.',
  announcementLabel: 'Research & Institute Updates',
  imageSrc: '/images/sec1-img 1.png',
  imageAlt: 'Rubber Research Institute of Sri Lanka',
  cta: {
    id: 0,
    label: 'Read More',
    linkType: 'internal',
    url: '/about',
    variant: 'primary',
    openInNewTab: false,
  },
};

export function extractPlainText(blocks: RichTextBlock[] | null | undefined): string {
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

function getSectionImage(section: AboutSection | null | undefined) {
  return section?.imageTop || section?.imageBottom || null;
}

export function mapAboutSection(
  section: AboutSection | null | undefined
): AboutSectionViewModel {
  const image = getSectionImage(section);
  const imageSrc =
    getOptimizedImageUrl(image, 'large') ||
    getOptimizedImageUrl(image, 'medium') ||
    getStrapiImageUrl(image) ||
    ABOUT_SECTION_FALLBACKS.imageSrc;

  const description = extractPlainText(section?.body);

  return {
    eyebrow: section?.header?.eyebrow || ABOUT_SECTION_FALLBACKS.eyebrow,
    title: section?.header?.title || ABOUT_SECTION_FALLBACKS.title,
    highlightedText:
      section?.header?.hightlightedtext || ABOUT_SECTION_FALLBACKS.highlightedText,
    description: description || ABOUT_SECTION_FALLBACKS.description,
    announcementLabel:
      section?.annoucementlabel || ABOUT_SECTION_FALLBACKS.announcementLabel,
    imageSrc,
    imageAlt: image?.alternativeText || ABOUT_SECTION_FALLBACKS.imageAlt,
    cta: section?.primaryCta || ABOUT_SECTION_FALLBACKS.cta,
  };
}
