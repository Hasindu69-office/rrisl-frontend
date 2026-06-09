import type { BreadcrumbItem } from '@/app/components/shared/Breadcrumb';
import type { FaqItemData } from '@/app/components/faq/faqData';
import { faqItems } from '@/app/components/faq/faqData';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';
import type { Faq, FaqPage, SectionHeader } from '@/app/lib/types';

export interface FaqHeroViewModel {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  backgroundImage?: string;
  backgroundImageAlt: string;
}

export interface FaqTitleViewModel {
  part1: string;
  part2: string;
  align: 'left' | 'center' | 'right';
}

export interface FaqSectionViewModel {
  eyebrow: string;
  title: FaqTitleViewModel;
  imageSrc: string;
  imageAlt: string;
}

export interface FaqPageViewModel {
  hero: FaqHeroViewModel;
  section: FaqSectionViewModel;
  items: FaqItemData[];
}

const FAQ_PAGE_FALLBACK: FaqPageViewModel = {
  hero: {
    title: 'FAQ section',
    breadcrumbItems: [
      { label: 'Home', href: '/' },
      { label: 'FAQ section' },
    ],
    backgroundImage: '/images/faqbanner.webp',
    backgroundImageAlt: 'FAQ section background',
  },
  section: {
    eyebrow: 'FAQ',
    title: {
      part1: 'Quick Answers',
      part2: 'to Common Questions',
      align: 'left',
    },
    imageSrc: '/images/faqsection1img.webp',
    imageAlt: 'FAQ section illustration',
  },
  items: faqItems,
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

function mapBreadcrumbItems(page: FaqPage | null | undefined): BreadcrumbItem[] {
  const breadcrumbItems =
    page?.pagehero?.Breadcrumb
      ?.filter((item) => item?.label)
      .map((item) => ({
        label: item.label,
        ...(item.href ? { href: item.href } : {}),
      })) || [];

  return breadcrumbItems.length > 0 ? breadcrumbItems : FAQ_PAGE_FALLBACK.hero.breadcrumbItems;
}

function mapSectionTitle(
  header: SectionHeader | null | undefined,
  fallback: FaqTitleViewModel
): FaqTitleViewModel {
  return {
    part1: header?.title?.trim() || fallback.part1,
    part2: header?.hightlightedtext?.trim() || fallback.part2,
    align:
      header?.alignment === 'center' || header?.alignment === 'right'
        ? header.alignment
        : fallback.align,
  };
}

function mapFaqItems(localizedFaqs: Faq[], fallbackFaqs: Faq[]): FaqItemData[] {
  const faqs = localizedFaqs.length > 0 ? localizedFaqs : fallbackFaqs;

  const mappedItems = [...faqs]
    .sort((left, right) => {
      const leftOrder = typeof left?.sortorder === 'number' ? left.sortorder : Number.MAX_SAFE_INTEGER;
      const rightOrder = typeof right?.sortorder === 'number' ? right.sortorder : Number.MAX_SAFE_INTEGER;
      return leftOrder - rightOrder;
    })
    .filter((faq) => faq?.question?.trim() && faq?.answer?.trim())
    .map((faq, index) => ({
      id: buildViewModelId(faq.documentId, faq.id, faq.question, index),
      number: `${String(index + 1).padStart(2, '0')}.`,
      question: faq.question.trim(),
      answer: faq.answer.trim(),
    }));

  return mappedItems.length > 0 ? mappedItems : FAQ_PAGE_FALLBACK.items;
}

export function mapFaqPageData(
  localizedPage: FaqPage | null | undefined,
  fallbackPage: FaqPage | null | undefined,
  localizedFaqs: Faq[],
  fallbackFaqs: Faq[]
): FaqPageViewModel {
  const hero = localizedPage?.pagehero || fallbackPage?.pagehero;
  const heroImage = hero?.backgroundImage || fallbackPage?.pagehero?.backgroundImage || null;
  const sectionHeader = localizedPage?.sectionheader || fallbackPage?.sectionheader;
  const leftImage = localizedPage?.leftimage || fallbackPage?.leftimage || null;

  return {
    hero: {
      title: hero?.PageTitle?.trim() || FAQ_PAGE_FALLBACK.hero.title,
      breadcrumbItems: mapBreadcrumbItems(localizedPage || fallbackPage),
      backgroundImage:
        getOptimizedImageUrl(heroImage, 'large') ||
        getOptimizedImageUrl(heroImage, 'medium') ||
        getStrapiImageUrl(heroImage) ||
        FAQ_PAGE_FALLBACK.hero.backgroundImage,
      backgroundImageAlt:
        hero?.backgroundImageAlt?.trim() ||
        heroImage?.alternativeText ||
        FAQ_PAGE_FALLBACK.hero.backgroundImageAlt,
    },
    section: {
      eyebrow: sectionHeader?.eyebrow?.trim() || FAQ_PAGE_FALLBACK.section.eyebrow,
      title: mapSectionTitle(sectionHeader, FAQ_PAGE_FALLBACK.section.title),
      imageSrc:
        getOptimizedImageUrl(leftImage, 'large') ||
        getOptimizedImageUrl(leftImage, 'medium') ||
        getStrapiImageUrl(leftImage) ||
        FAQ_PAGE_FALLBACK.section.imageSrc,
      imageAlt: leftImage?.alternativeText || FAQ_PAGE_FALLBACK.section.imageAlt,
    },
    items: mapFaqItems(localizedFaqs, fallbackFaqs),
  };
}

export { FAQ_PAGE_FALLBACK };
