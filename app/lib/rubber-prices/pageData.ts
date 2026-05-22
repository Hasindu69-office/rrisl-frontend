import type { BreadcrumbItem } from '@/app/components/shared/Breadcrumb';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';
import type {
  RubberAuctionPrice,
  RubberPriceEntry,
  RubberPricePage,
  RubberPricePageViewModel,
  RubberPricesHeroViewModel,
  RubberPricesSectionContent,
} from '@/app/lib/types';

const RUBBER_PRICES_PAGE_FALLBACK: RubberPricePageViewModel = {
  hero: {
    title: 'Rubber Prices',
    breadcrumbItems: [
      { label: 'Home', href: '/' },
      { label: 'Rubber Prices' },
    ],
    backgroundImage: '/images/aboutus_heroimg.jpg',
    backgroundImageAlt: 'Rubber prices background',
  },
  content: {
    sectionTag: 'Weekly Rubber Prices',
    sectionTitlePart1: 'Rubber auction',
    sectionTitlePart2: ' prices',
    sectionDescription:
      'View the latest weekly auction sheet and the archived rubber price list.',
    latestUpdateLabel: 'Latest Update',
    archivedYearsLabel: 'Archived Years',
    recentUpdatesLabel: 'Recent Updates',
    recentAuctionDateLabel: 'Recent Auction Date',
    weeklyUploadsLabel: 'Weekly Uploads',
    latestWeeklyUploadLabel: 'Latest Weekly Upload',
    recentWeeklyUploadLabel: 'Recent weekly upload',
    archiveEntryLabel: 'Archive entry',
    auctionPriceLabel: 'Auction Prices',
    dateOfAuctionLabel: 'Date of auction:',
    openFullSheetButtonLabel: 'Open full sheet',
    archiveTag: 'Archive Browser',
    archiveTitlePart1: 'Browse weekly',
    archiveTitlePart2: ' rubber prices.',
    archiveDescription:
      'Select an archive year to view the available weekly uploads, then choose a date to open that auction sheet.',
    activeArchiveLabel: 'Active archive',
    archiveYearLabel: 'Archive year',
    uploadsLabel: 'Uploads',
    availableDatesLabel: 'Available Dates',
    newestDataShownLabel: 'Newest dates shown first',
    tapWeeklyDateLabel: 'Tap a weekly date to open the sheet',
    quickSwitchLabel: 'Quick switch',
    inThisArchiveYearLabel: 'In this archive year',
    previousButtonLabel: 'Previous',
    nextButtonLabel: 'Next',
    closeArchiveViewerLabel: 'Close archive viewer',
    archiveSuffixLabel: 'archive',
    emptyStateTag: 'Rubber Prices',
    emptyStateTitlePart1: 'Weekly auction sheets',
    emptyStateTitlePart2: ' will appear here once uploads are available.',
    emptyStateDescription:
      'This page is ready for weekly image-based price uploads and archive browsing, but no records are available yet.',
  },
  entries: [],
  latestEntry: null,
  recentEntries: [],
  archiveYears: [],
  entriesByYear: {},
};

function mapBreadcrumbItems(
  hero: RubberPricePage['pagehero'] | null | undefined
): BreadcrumbItem[] {
  const breadcrumbItems =
    hero?.Breadcrumb
      ?.filter((item) => item?.label)
      .map((item) => ({
        label: item.label,
        ...(item.href ? { href: item.href } : {}),
      })) || [];

  return breadcrumbItems.length > 0
    ? breadcrumbItems
    : RUBBER_PRICES_PAGE_FALLBACK.hero.breadcrumbItems;
}

function buildImageAlt(date: string): string {
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));

  return `Rubber auction price sheet for ${formattedDate}`;
}

function mapHero(
  localizedPage: RubberPricePage | null | undefined,
  fallbackPage: RubberPricePage | null | undefined
): RubberPricesHeroViewModel {
  const hero = localizedPage?.pagehero || fallbackPage?.pagehero;
  const image = hero?.backgroundImage || fallbackPage?.pagehero?.backgroundImage || null;

  return {
    title: hero?.PageTitle || RUBBER_PRICES_PAGE_FALLBACK.hero.title,
    breadcrumbItems: mapBreadcrumbItems(hero),
    backgroundImage:
      getOptimizedImageUrl(image, 'large') ||
      getOptimizedImageUrl(image, 'medium') ||
      getStrapiImageUrl(image) ||
      RUBBER_PRICES_PAGE_FALLBACK.hero.backgroundImage,
    backgroundImageAlt:
      hero?.backgroundImageAlt ||
      image?.alternativeText ||
      RUBBER_PRICES_PAGE_FALLBACK.hero.backgroundImageAlt,
  };
}

function mapSectionContent(
  localizedPage: RubberPricePage | null | undefined,
  fallbackPage: RubberPricePage | null | undefined
): RubberPricesSectionContent {
  const page = localizedPage || fallbackPage;
  const sectionHeader = page?.sectionheader;
  const archiveHeader = page?.archivedbrowsertitle;
  const fallbackContent = RUBBER_PRICES_PAGE_FALLBACK.content;

  return {
    sectionTag: sectionHeader?.eyebrow || fallbackContent.sectionTag,
    sectionTitlePart1: sectionHeader?.title || fallbackContent.sectionTitlePart1,
    sectionTitlePart2:
      sectionHeader?.hightlightedtext
        ? ` ${sectionHeader.hightlightedtext}`
        : fallbackContent.sectionTitlePart2,
    sectionDescription: page?.description || fallbackContent.sectionDescription,
    latestUpdateLabel: page?.latestupdatelabel || fallbackContent.latestUpdateLabel,
    archivedYearsLabel: page?.archivedyearslabel || fallbackContent.archivedYearsLabel,
    recentUpdatesLabel: page?.recentupdatelabel || fallbackContent.recentUpdatesLabel,
    recentAuctionDateLabel:
      page?.recentauctiondatelabel || fallbackContent.recentAuctionDateLabel,
    weeklyUploadsLabel: page?.weeklyuploadslabel || fallbackContent.weeklyUploadsLabel,
    latestWeeklyUploadLabel:
      page?.latestweeklyuploadlabel || fallbackContent.latestWeeklyUploadLabel,
    recentWeeklyUploadLabel: fallbackContent.recentWeeklyUploadLabel,
    archiveEntryLabel: fallbackContent.archiveEntryLabel,
    auctionPriceLabel: page?.auctionpricelabel || fallbackContent.auctionPriceLabel,
    dateOfAuctionLabel: page?.dateofauctionlabel || fallbackContent.dateOfAuctionLabel,
    openFullSheetButtonLabel:
      page?.openfullsheetbuttonlabel || fallbackContent.openFullSheetButtonLabel,
    archiveTag: archiveHeader?.eyebrow || fallbackContent.archiveTag,
    archiveTitlePart1: archiveHeader?.title || fallbackContent.archiveTitlePart1,
    archiveTitlePart2:
      archiveHeader?.hightlightedtext
        ? ` ${archiveHeader.hightlightedtext}`
        : fallbackContent.archiveTitlePart2,
    archiveDescription: page?.archiveddescription || fallbackContent.archiveDescription,
    activeArchiveLabel: page?.activearchivedlabel || fallbackContent.activeArchiveLabel,
    archiveYearLabel: page?.archivedyearlabel || fallbackContent.archiveYearLabel,
    uploadsLabel: page?.uploadslabel || fallbackContent.uploadsLabel,
    availableDatesLabel: page?.availabledateslabel || fallbackContent.availableDatesLabel,
    newestDataShownLabel: page?.newestdatashownlabel || fallbackContent.newestDataShownLabel,
    tapWeeklyDateLabel: fallbackContent.tapWeeklyDateLabel,
    quickSwitchLabel: page?.quickswitchlabel || fallbackContent.quickSwitchLabel,
    inThisArchiveYearLabel:
      page?.inthisarchiveyearlabel || fallbackContent.inThisArchiveYearLabel,
    previousButtonLabel:
      page?.previouslbuttonlabel || fallbackContent.previousButtonLabel,
    nextButtonLabel: page?.nextbuttonlabel || fallbackContent.nextButtonLabel,
    closeArchiveViewerLabel: fallbackContent.closeArchiveViewerLabel,
    archiveSuffixLabel: page?.archivelabel || fallbackContent.archiveSuffixLabel,
    emptyStateTag: fallbackContent.emptyStateTag,
    emptyStateTitlePart1: fallbackContent.emptyStateTitlePart1,
    emptyStateTitlePart2: fallbackContent.emptyStateTitlePart2,
    emptyStateDescription: fallbackContent.emptyStateDescription,
  };
}

function mapEntries(entries: RubberAuctionPrice[]): RubberPriceEntry[] {
  return [...entries]
    .filter((entry) => Boolean(entry.date && entry.price))
    .sort((left, right) => right.date.localeCompare(left.date))
    .map((entry, index): RubberPriceEntry => {
      const imageSrc =
        getOptimizedImageUrl(entry.price, 'large') ||
        getOptimizedImageUrl(entry.price, 'medium') ||
        getStrapiImageUrl(entry.price) ||
        '';

      return {
        id: entry.documentId || String(entry.id),
        date: entry.date,
        imageSrc,
        imageAlt: entry.price?.alternativeText || buildImageAlt(entry.date),
        status: index === 0 ? 'latest' : index < 4 ? 'recent' : 'archive',
        archiveYear: entry.date.slice(0, 4),
      };
    })
    .filter((entry) => Boolean(entry.imageSrc));
}

function buildEntriesByYear(entries: RubberPriceEntry[]): Record<string, RubberPriceEntry[]> {
  return entries.reduce<Record<string, RubberPriceEntry[]>>((accumulator, entry) => {
    if (!accumulator[entry.archiveYear]) {
      accumulator[entry.archiveYear] = [];
    }

    accumulator[entry.archiveYear].push(entry);
    return accumulator;
  }, {});
}

export function mapRubberPricePageData(
  localizedPage: RubberPricePage | null | undefined,
  fallbackPage: RubberPricePage | null | undefined,
  auctionPrices: RubberAuctionPrice[]
): RubberPricePageViewModel {
  const entries = mapEntries(auctionPrices);
  const latestEntry = entries[0] ?? null;
  const archiveYears = Array.from(new Set(entries.map((entry) => entry.archiveYear)));

  return {
    hero: mapHero(localizedPage, fallbackPage),
    content: mapSectionContent(localizedPage, fallbackPage),
    entries,
    latestEntry,
    recentEntries: entries.slice(0, 4),
    archiveYears,
    entriesByYear: buildEntriesByYear(entries),
  };
}

export { RUBBER_PRICES_PAGE_FALLBACK };
