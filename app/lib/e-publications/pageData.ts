import type { BreadcrumbItem } from '@/app/components/shared/Breadcrumb';
import type { PublicationCardItem } from '@/app/components/shared/PublicationCard';
import type { ELibraryFilterNode } from '@/app/components/e-library/ELibrarySection';
import { getOptimizedImageUrl, getStrapiImageUrl, getStrapiMediaUrl } from '@/app/lib/strapi';
import type { EPublicationsPage, EPublicationsPageHero, Publication, PublicationCategory } from '@/app/lib/types';

export interface EPublicationsHeroViewModel {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  backgroundImage?: string;
  backgroundImageAlt: string;
}

export interface EPublicationsEmptyState {
  title: string;
  description: string;
}

export interface EPublicationsPageViewModel {
  hero: EPublicationsHeroViewModel;
  itemLabel: string;
  filterLibraryLabel: string;
  resetButtonLabel: string;
  searchLibraryLabel: string;
  readMoreLabel: string;
  emptyState: EPublicationsEmptyState;
  filters: ELibraryFilterNode[];
}

const SHARED_BOOK_IMAGE = '/images/departments/recommendationBook.webp';

const E_PUBLICATIONS_FALLBACK: EPublicationsPageViewModel = {
  hero: {
    title: 'e-Library/Publications',
    breadcrumbItems: [
      { label: 'Home', href: '/' },
      { label: 'e-Library/Publications' },
    ],
    backgroundImage: '/images/aboutus_heroimg.jpg',
    backgroundImageAlt: 'e-Library/Publications background',
  },
  itemLabel: 'items',
  filterLibraryLabel: 'Filter Library',
  resetButtonLabel: 'Reset',
  searchLibraryLabel: 'Search Library',
  readMoreLabel: 'Read More',
  emptyState: {
    title: 'No publications found',
    description: 'Please check back later for upcoming publications and library resources.',
  },
  filters: [],
};

function mapBreadcrumbItems(hero: EPublicationsPageHero | null | undefined): BreadcrumbItem[] {
  const breadcrumbItems =
    hero?.Breadcrumb
      ?.filter((item) => item?.label)
      .map((item) => ({
        label: item.label,
        ...(item.href ? { href: item.href } : {}),
      })) || [];

  return breadcrumbItems.length > 0
    ? breadcrumbItems
    : E_PUBLICATIONS_FALLBACK.hero.breadcrumbItems;
}

function mapPublicationToCard(publication: Publication): PublicationCardItem {
  const title = publication.title?.trim() || 'Untitled Publication';
  const imageSrc =
    getOptimizedImageUrl(publication.CoverImage, 'medium') ||
    getOptimizedImageUrl(publication.CoverImage, 'small') ||
    getStrapiImageUrl(publication.CoverImage) ||
    SHARED_BOOK_IMAGE;
  const documentUrl = getStrapiMediaUrl(publication.PublicationDocument) || '';

  return {
    id: String(publication.id || publication.documentId || publication.slug || title),
    title,
    imageSrc,
    imageAlt:
      publication.CoverImgAltText ||
      publication.CoverImage?.alternativeText ||
      title,
    fallbackImageSrc: SHARED_BOOK_IMAGE,
    readMoreHref: documentUrl,
    openInNewTab: Boolean(documentUrl),
    readMoreAriaLabel: `Open publication document for ${title}`,
  };
}

function mapHero(
  localizedPage: EPublicationsPage | null | undefined,
  fallbackPage: EPublicationsPage | null | undefined
): EPublicationsHeroViewModel {
  const hero = localizedPage?.pagehero || fallbackPage?.pagehero;
  const image = hero?.backgroundImage || fallbackPage?.pagehero?.backgroundImage || null;

  return {
    title: hero?.PageTitle || E_PUBLICATIONS_FALLBACK.hero.title,
    breadcrumbItems: mapBreadcrumbItems(hero),
    backgroundImage:
      getOptimizedImageUrl(image, 'large') ||
      getOptimizedImageUrl(image, 'medium') ||
      getStrapiImageUrl(image) ||
      E_PUBLICATIONS_FALLBACK.hero.backgroundImage,
    backgroundImageAlt:
      hero?.backgroundImageAlt ||
      image?.alternativeText ||
      E_PUBLICATIONS_FALLBACK.hero.backgroundImageAlt,
  };
}

function buildCategoryTree(
  categories: PublicationCategory[],
  publications: Publication[]
): ELibraryFilterNode[] {
  const categoryMap = new Map<number, ELibraryFilterNode>();
  const childrenByParent = new Map<number, ELibraryFilterNode[]>();
  const rootNodes: ELibraryFilterNode[] = [];

  for (const category of categories) {
    if (!category.id || !category.CategoryName?.trim()) {
      continue;
    }

    categoryMap.set(category.id, {
      id: String(category.id),
      label: category.CategoryName.trim(),
      publications: [],
      children: [],
    });
  }

  for (const publication of publications) {
    const publicationCard = mapPublicationToCard(publication);
    const categoryRelations = publication.publication_categories || [];

    for (const categoryRelation of categoryRelations) {
      const categoryId = categoryRelation?.id;
      if (!categoryId) {
        continue;
      }

      const categoryNode = categoryMap.get(categoryId);
      if (!categoryNode) {
        continue;
      }

      categoryNode.publications = [...(categoryNode.publications || []), publicationCard];
    }
  }

  for (const category of categories) {
    const node = categoryMap.get(category.id);
    if (!node) {
      continue;
    }

    const parentId = category.publication_category?.id;

    if (!parentId || !categoryMap.has(parentId)) {
      rootNodes.push(node);
      continue;
    }

    const siblings = childrenByParent.get(parentId) || [];
    siblings.push(node);
    childrenByParent.set(parentId, siblings);
  }

  const attachChildren = (nodes: ELibraryFilterNode[]): ELibraryFilterNode[] =>
    nodes.map((node): ELibraryFilterNode => {
      const childNodes = attachChildren(childrenByParent.get(Number(node.id)) || []);

      return {
        ...node,
        publications: node.publications || [],
        children: childNodes,
      };
    });

  return attachChildren(rootNodes);
}

export function mapEPublicationsPageData(
  localizedPage: EPublicationsPage | null | undefined,
  fallbackPage: EPublicationsPage | null | undefined,
  categories: PublicationCategory[],
  publications: Publication[]
): EPublicationsPageViewModel {
  return {
    hero: mapHero(localizedPage, fallbackPage),
    itemLabel:
      localizedPage?.LabelItems ||
      fallbackPage?.LabelItems ||
      E_PUBLICATIONS_FALLBACK.itemLabel,
    filterLibraryLabel:
      localizedPage?.LabelFilterLibrary ||
      fallbackPage?.LabelFilterLibrary ||
      E_PUBLICATIONS_FALLBACK.filterLibraryLabel,
    resetButtonLabel:
      localizedPage?.LabelResetButton ||
      fallbackPage?.LabelResetButton ||
      E_PUBLICATIONS_FALLBACK.resetButtonLabel,
    searchLibraryLabel:
      localizedPage?.LabelSearchLibrary ||
      fallbackPage?.LabelSearchLibrary ||
      E_PUBLICATIONS_FALLBACK.searchLibraryLabel,
    readMoreLabel:
      localizedPage?.LabelReadMore ||
      fallbackPage?.LabelReadMore ||
      E_PUBLICATIONS_FALLBACK.readMoreLabel,
    emptyState: {
      title:
        localizedPage?.ErrorMessage?.title ||
        fallbackPage?.ErrorMessage?.title ||
        E_PUBLICATIONS_FALLBACK.emptyState.title,
      description:
        localizedPage?.ErrorMessage?.description ||
        fallbackPage?.ErrorMessage?.description ||
        E_PUBLICATIONS_FALLBACK.emptyState.description,
    },
    filters: buildCategoryTree(categories, publications),
  };
}
