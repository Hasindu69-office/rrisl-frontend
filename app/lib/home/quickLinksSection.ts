import type { HomeQuickLink, HomeQuickLinksSection } from '@/app/lib/types';
import { addLocaleToUrl } from '@/app/lib/locale';
import { getStrapiImageUrl } from '@/app/lib/strapi';

const DEFAULT_QUICK_LINK_ICON = '/images/lets-icons_arhives-group-docks-light.png';

export interface HomeQuickLinksSectionItemViewModel {
  title: string;
  href: string;
  iconSrc: string;
  isExternal: boolean;
  openInNewTab: boolean;
}

export interface HomeQuickLinksSectionViewModel {
  items: HomeQuickLinksSectionItemViewModel[];
}

const QUICK_LINKS_FALLBACK: HomeQuickLinksSectionViewModel = {
  items: [
    {
      title: 'PROCUREMENT NOTICE',
      href: '/bid-notice',
      iconSrc: DEFAULT_QUICK_LINK_ICON,
      isExternal: false,
      openInNewTab: false,
    },
    {
      title: 'DOWNLOADS',
      href: '/downloads',
      iconSrc: DEFAULT_QUICK_LINK_ICON,
      isExternal: false,
      openInNewTab: false,
    },
    {
      title: 'ADVISORY CIRCULARS',
      href: '/e-Library-Publications',
      iconSrc: DEFAULT_QUICK_LINK_ICON,
      isExternal: false,
      openInNewTab: false,
    },
    {
      title: 'RUBBER PRICES',
      href: '/rubber-prices',
      iconSrc: DEFAULT_QUICK_LINK_ICON,
      isExternal: false,
      openInNewTab: false,
    },
    {
      title: 'CONTACT',
      href: '/contact',
      iconSrc: DEFAULT_QUICK_LINK_ICON,
      isExternal: false,
      openInNewTab: false,
    },
  ],
};

function isExternalUrl(url: string): boolean {
  return /^(https?:)?\/\//i.test(url);
}

function normalizeQuickLink(
  item: HomeQuickLink,
  locale: string
): HomeQuickLinksSectionItemViewModel | null {
  const title = item.title?.trim();
  const url = item.url?.trim();

  if (!title || !url) {
    return null;
  }

  const isExternal = isExternalUrl(url);

  return {
    title,
    href: isExternal ? url : addLocaleToUrl(url, locale),
    iconSrc: getStrapiImageUrl(item.icon) || DEFAULT_QUICK_LINK_ICON,
    isExternal,
    openInNewTab: Boolean(item.openinnewtab),
  };
}

export function mapHomeQuickLinksSection(
  section: HomeQuickLinksSection | null | undefined,
  locale: string
): HomeQuickLinksSectionViewModel {
  const quickLinks = Array.isArray(section?.quicklinks) ? section.quicklinks : [];

  const items = quickLinks
    .map((item, index) => ({ item, index }))
    .sort((left, right) => {
      const leftSort = left.item.sortorder ?? Number.MAX_SAFE_INTEGER;
      const rightSort = right.item.sortorder ?? Number.MAX_SAFE_INTEGER;

      if (leftSort !== rightSort) {
        return leftSort - rightSort;
      }

      return left.index - right.index;
    })
    .map(({ item }) => normalizeQuickLink(item, locale))
    .filter((item): item is HomeQuickLinksSectionItemViewModel => Boolean(item));

  return items.length > 0 ? { items } : QUICK_LINKS_FALLBACK;
}
