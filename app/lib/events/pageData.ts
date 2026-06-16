import type { BreadcrumbItem } from '@/app/components/shared/Breadcrumb';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';
import type { EventCategory, EventEntity, EventPage } from '@/app/lib/types';

export const EVENTS_ROUTE = '/events';

const EVENT_TIME_ZONE = 'Asia/Colombo';
const EVENT_FALLBACK_IMAGE = '/images/section6_img1.png';

export type EventKind = 'Event' | 'Program';
export type EventStatus = 'past' | 'upcoming';

export interface EventGalleryImage {
  src: string;
  alt: string;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string[];
  date: string;
  time: string;
  dateTime: string;
  location: string;
  kind: EventKind;
  categories: EventCategoryViewModel[];
  featuredImage: string | null;
  featuredImageAlt: string;
  galleryImages: EventGalleryImage[];
}

export interface EventCategoryViewModel {
  label: string;
  slug: string;
}

export interface EventsPageLabels {
  title: string;
  topic: string;
  all: string;
  events: string;
  programs: string;
  archiveEyebrow: string;
  browseAll: string;
  readDetails: string;
  viewDetails: string;
  backToAllEvents: string;
  relatedEvents: string;
  gallery: string;
  event: string;
  program: string;
  emptyTitle: string;
  emptyDescription: string;
  details: string;
  kind: string;
  location: string;
  time: string;
  date: string;
  status: string;
  upcoming: string;
  past: string;
  previous: string;
  next: string;
}

export interface EventsPageHeroViewModel {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  backgroundImage?: string;
  backgroundImageAlt: string;
}

export interface EventsPageViewModel {
  hero: EventsPageHeroViewModel;
  labels: EventsPageLabels;
  categories: EventCategoryViewModel[];
}

interface EventMappingOptions {
  fallbackEvent?: EventEntity | null;
  localizedCategories?: EventCategory[];
  fallbackCategories?: EventCategory[];
}

const EVENTS_PAGE_FALLBACK: EventsPageViewModel = {
  hero: {
    title: 'Events and Programs',
    breadcrumbItems: [
      { label: 'Home', href: '/' },
      { label: 'Events and Programs' },
    ],
    backgroundImage: '/images/section6_bg.jpg',
    backgroundImageAlt: 'RRISL events and programs',
  },
  labels: {
    title: 'Events and Programs',
    topic: 'Upcoming sessions, field programmes, and institutional events across RRISL.',
    all: 'All',
    events: 'Events',
    programs: 'Programs',
    archiveEyebrow: 'RRISL Calendar',
    browseAll: 'Browse all scheduled items',
    readDetails: 'Read Details',
    viewDetails: 'View Details',
    backToAllEvents: 'Back to all events',
    relatedEvents: 'Related Events',
    gallery: 'Event Gallery',
    event: 'Event',
    program: 'Program',
    emptyTitle: 'No events found',
    emptyDescription: 'Try another filter to explore upcoming and past RRISL activities.',
    details: 'Details',
    kind: 'Kind',
    location: 'Location',
    time: 'Time',
    date: 'Date',
    status: 'Status',
    upcoming: 'Upcoming',
    past: 'Past',
    previous: 'Previous',
    next: 'Next',
  },
  categories: [
    { label: 'All', slug: 'all' },
    { label: 'Events', slug: 'event' },
    { label: 'Programs', slug: 'program' },
  ],
};

function titleCase(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function toCategorySlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatDateParts(dateTime: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: EVENT_TIME_ZONE,
    ...options,
  }).formatToParts(new Date(dateTime));
}

function getEventDateKey(dateTime: string): string {
  const parts = formatDateParts(dateTime, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const year = parts.find((part) => part.type === 'year')?.value || '1970';
  const month = parts.find((part) => part.type === 'month')?.value || '01';
  const day = parts.find((part) => part.type === 'day')?.value || '01';

  return `${year}-${month}-${day}`;
}

function formatDisplayTime(dateTime: string): string {
  const parts = formatDateParts(dateTime, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const hour = parts.find((part) => part.type === 'hour')?.value || '12';
  const minute = parts.find((part) => part.type === 'minute')?.value || '00';
  const dayPeriod = (parts.find((part) => part.type === 'dayPeriod')?.value || 'AM').toLowerCase();

  return `${hour}.${minute} ${dayPeriod}`;
}

function mapBreadcrumbItems(page: EventPage | null | undefined): BreadcrumbItem[] {
  const breadcrumbItems =
    page?.pagehero?.Breadcrumb
      ?.filter((item) => item?.label)
      .map((item) => ({
        label: item.label,
        ...(item.href ? { href: item.href } : {}),
      })) || [];

  return breadcrumbItems.length > 0
    ? breadcrumbItems
    : EVENTS_PAGE_FALLBACK.hero.breadcrumbItems;
}

function mapCategory(category: EventCategory | null | undefined): EventCategoryViewModel | null {
  const label = category?.name?.trim();

  if (!label) {
    return null;
  }

  return {
    label: titleCase(label),
    slug: toCategorySlug(label),
  };
}

function buildCategoryLookups(
  localizedCategories: EventCategory[] = [],
  fallbackCategories: EventCategory[] = []
) {
  const localizedByDocumentId = new Map<string, EventCategory>();
  const localizedBySlug = new Map<string, EventCategory>();

  localizedCategories.forEach((category) => {
    if (category?.documentId) {
      localizedByDocumentId.set(category.documentId, category);
    }

    if (category?.name?.trim()) {
      localizedBySlug.set(toCategorySlug(category.name), category);
    }
  });

  fallbackCategories.forEach((category) => {
    const slug = category?.name?.trim() ? toCategorySlug(category.name) : null;

    if (category?.documentId && !localizedByDocumentId.has(category.documentId)) {
      localizedByDocumentId.set(category.documentId, category);
    }

    if (slug && !localizedBySlug.has(slug)) {
      localizedBySlug.set(slug, category);
    }
  });

  return {
    localizedByDocumentId,
    localizedBySlug,
  };
}

function resolveEventCategories(
  event: EventEntity | null | undefined,
  fallbackEvent: EventEntity | null | undefined,
  localizedCategories: EventCategory[] = [],
  fallbackCategories: EventCategory[] = []
): EventCategoryViewModel[] {
  const relationCategories =
    event?.event_categories && event.event_categories.length > 0
      ? event.event_categories
      : fallbackEvent?.event_categories || [];
  const { localizedByDocumentId, localizedBySlug } = buildCategoryLookups(
    localizedCategories,
    fallbackCategories
  );

  return uniqueCategories(
    relationCategories
      .map((category) => {
        const translatedCategory =
          (category?.documentId
            ? localizedByDocumentId.get(category.documentId)
            : null) ||
          (category?.name?.trim()
            ? localizedBySlug.get(toCategorySlug(category.name))
            : null) ||
          category;

        return mapCategory(translatedCategory);
      })
      .filter((category): category is EventCategoryViewModel => Boolean(category))
  );
}

function uniqueCategories(categories: EventCategoryViewModel[]): EventCategoryViewModel[] {
  const seen = new Set<string>();

  return categories.filter((category) => {
    if (seen.has(category.slug)) {
      return false;
    }

    seen.add(category.slug);
    return true;
  });
}

function inferEventKind(categories: EventCategoryViewModel[]): EventKind {
  return categories.some((category) => category.slug === 'program') ? 'Program' : 'Event';
}

function sortByDateTimeAsc(items: EventItem[]): EventItem[] {
  return [...items].sort((left, right) => left.dateTime.localeCompare(right.dateTime));
}

function sortByUpcomingThenPast(items: EventItem[]): EventItem[] {
  const upcoming = items.filter((item) => getEventStatus(item.date) === 'upcoming');
  const past = items.filter((item) => getEventStatus(item.date) === 'past');

  return [
    ...sortByDateTimeAsc(upcoming),
    ...sortByDateTimeAsc(past).reverse(),
  ];
}

export function formatEventDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
}

export function getEventDateParts(date: string): {
  day: string;
  month: string;
  year: string;
  weekday: string;
} {
  const eventDate = new Date(`${date}T00:00:00`);

  return {
    day: `${eventDate.getDate()}`,
    month: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(eventDate),
    year: `${eventDate.getFullYear()}`,
    weekday: new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(eventDate),
  };
}

export function getEventStatus(date: string): EventStatus {
  const today = new Date();
  const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return new Date(`${date}T00:00:00`) < localToday ? 'past' : 'upcoming';
}

export function mapEvent(
  event: EventEntity | null | undefined,
  options: EventMappingOptions = {}
): EventItem | null {
  const slug = event?.slug?.trim();
  const title = event?.title?.trim();
  const dateTime = event?.dateandtime;

  if (!slug || !title || !dateTime) {
    return null;
  }

  const categories = resolveEventCategories(
    event,
    options.fallbackEvent,
    options.localizedCategories,
    options.fallbackCategories
  );
  const featuredImage =
    getOptimizedImageUrl(event?.featuredImage, 'large') ||
    getOptimizedImageUrl(event?.featuredImage, 'medium') ||
    getStrapiImageUrl(event?.featuredImage) ||
    null;
  const galleryImages =
    event?.galleryimages
      ?.map((image, index) => {
        const src =
          getOptimizedImageUrl(image, 'large') ||
          getOptimizedImageUrl(image, 'medium') ||
          getStrapiImageUrl(image);

        if (!src) {
          return null;
        }

        return {
          src,
          alt: image?.alternativeText || `${title} gallery image ${index + 1}`,
        };
      })
      .filter((image): image is EventGalleryImage => Boolean(image)) || [];

  return {
    id: event?.documentId?.trim() || `${event?.id || slug}`,
    slug,
    title,
    summary: event?.summary?.trim() || '',
    content:
      event?.paragraph
        ?.map((item) => item?.paragraph?.trim())
        .filter((paragraph): paragraph is string => Boolean(paragraph)) || [],
    date: getEventDateKey(dateTime),
    time: formatDisplayTime(dateTime),
    dateTime,
    location: event?.location?.trim() || '',
    kind: inferEventKind(categories),
    categories,
    featuredImage,
    featuredImageAlt: event?.featuredImage?.alternativeText || title,
    galleryImages,
  };
}

export function mapEvents(events: EventEntity[]): EventItem[] {
  return sortByDateTimeAsc(
    events
      .map((event) => mapEvent(event))
      .filter((event): event is EventItem => Boolean(event))
  );
}

export function mapEventsWithFallback(
  events: EventEntity[],
  fallbackEvents: EventEntity[] = [],
  localizedCategories: EventCategory[] = [],
  fallbackCategories: EventCategory[] = []
): EventItem[] {
  return sortByDateTimeAsc(
    events
      .map((event) => {
        const fallbackEvent =
          fallbackEvents.find((candidate) =>
            (event?.documentId && candidate?.documentId)
              ? candidate.documentId === event.documentId
              : false
          ) ||
          fallbackEvents.find((candidate) =>
            candidate?.slug?.trim() && event?.slug?.trim()
              ? candidate.slug?.trim() === event.slug?.trim()
              : false
          ) ||
          null;

        return mapEvent(event, {
          fallbackEvent,
          localizedCategories,
          fallbackCategories,
        });
      })
      .filter((event): event is EventItem => Boolean(event))
  );
}

export function mapEventsPageData(
  localizedPage: EventPage | null | undefined,
  fallbackPage: EventPage | null | undefined,
  localizedCategories: EventCategory[],
  fallbackCategories: EventCategory[]
): EventsPageViewModel {
  const page = localizedPage || fallbackPage;
  const hero = page?.pagehero || fallbackPage?.pagehero;
  const heroImage = hero?.backgroundImage || fallbackPage?.pagehero?.backgroundImage || null;
  const sectionHeader = page?.sectionheader || fallbackPage?.sectionheader;
  const sourceCategories =
    (localizedCategories.length > 0 ? localizedCategories : fallbackCategories)
      .filter((category) => category?.isActive !== false);
  const mappedCategories = uniqueCategories(
    sourceCategories
      .map(mapCategory)
      .filter((category): category is EventCategoryViewModel => Boolean(category))
  );

  return {
    hero: {
      title: hero?.PageTitle?.trim() || EVENTS_PAGE_FALLBACK.hero.title,
      breadcrumbItems: mapBreadcrumbItems(page),
      backgroundImage:
        getOptimizedImageUrl(heroImage, 'large') ||
        getOptimizedImageUrl(heroImage, 'medium') ||
        getStrapiImageUrl(heroImage) ||
        EVENTS_PAGE_FALLBACK.hero.backgroundImage,
      backgroundImageAlt:
        hero?.backgroundImageAlt?.trim() ||
        heroImage?.alternativeText ||
        EVENTS_PAGE_FALLBACK.hero.backgroundImageAlt,
    },
    labels: {
      title: hero?.PageTitle?.trim() || EVENTS_PAGE_FALLBACK.labels.title,
      topic: EVENTS_PAGE_FALLBACK.labels.topic,
      all: page?.alllabel?.trim() || EVENTS_PAGE_FALLBACK.labels.all,
      events: EVENTS_PAGE_FALLBACK.labels.events,
      programs: EVENTS_PAGE_FALLBACK.labels.programs,
      archiveEyebrow: sectionHeader?.eyebrow?.trim() || EVENTS_PAGE_FALLBACK.labels.archiveEyebrow,
      browseAll: sectionHeader?.title?.trim() || EVENTS_PAGE_FALLBACK.labels.browseAll,
      readDetails: page?.readdetailslabel?.trim() || EVENTS_PAGE_FALLBACK.labels.readDetails,
      viewDetails: page?.viewdetailslabel?.trim() || EVENTS_PAGE_FALLBACK.labels.viewDetails,
      backToAllEvents:
        page?.backtoalleventslabel?.trim() || EVENTS_PAGE_FALLBACK.labels.backToAllEvents,
      relatedEvents: EVENTS_PAGE_FALLBACK.labels.relatedEvents,
      gallery: EVENTS_PAGE_FALLBACK.labels.gallery,
      event: EVENTS_PAGE_FALLBACK.labels.event,
      program: EVENTS_PAGE_FALLBACK.labels.program,
      emptyTitle: EVENTS_PAGE_FALLBACK.labels.emptyTitle,
      emptyDescription: EVENTS_PAGE_FALLBACK.labels.emptyDescription,
      details: page?.detailslabel?.trim() || EVENTS_PAGE_FALLBACK.labels.details,
      kind: EVENTS_PAGE_FALLBACK.labels.kind,
      location: page?.locationlabel?.trim() || EVENTS_PAGE_FALLBACK.labels.location,
      time: page?.timelabel?.trim() || EVENTS_PAGE_FALLBACK.labels.time,
      date: page?.datelabel?.trim() || EVENTS_PAGE_FALLBACK.labels.date,
      status: page?.statuslabel?.trim() || EVENTS_PAGE_FALLBACK.labels.status,
      upcoming: page?.upcominglabel?.trim() || EVENTS_PAGE_FALLBACK.labels.upcoming,
      past: page?.pastlabel?.trim() || EVENTS_PAGE_FALLBACK.labels.past,
      previous: page?.previousbuttonlabel?.trim() || EVENTS_PAGE_FALLBACK.labels.previous,
      next: page?.nextbuttonlabel?.trim() || EVENTS_PAGE_FALLBACK.labels.next,
    },
    categories: [
      { label: page?.alllabel?.trim() || EVENTS_PAGE_FALLBACK.labels.all, slug: 'all' },
      ...mappedCategories,
    ],
  };
}

export function getFeaturedEvent(events: EventItem[]): EventItem | null {
  if (events.length === 0) {
    return null;
  }

  const upcoming = sortByDateTimeAsc(events.filter((event) => getEventStatus(event.date) === 'upcoming'));
  return upcoming[0] || events[0];
}

export function filterEventsByKind(events: EventItem[], kindSlug: string): EventItem[] {
  if (!kindSlug || kindSlug === 'all') {
    return sortByUpcomingThenPast(events);
  }

  return sortByUpcomingThenPast(
    events.filter((event) => event.categories.some((category) => category.slug === kindSlug))
  );
}

export function getRelatedEvents(event: EventItem, events: EventItem[], limit = 3): EventItem[] {
  const remaining = events.filter((item) => item.slug !== event.slug);
  const sameKind = remaining.filter((item) => item.kind === event.kind);
  return sortByUpcomingThenPast(sameKind).slice(0, limit);
}

export function getArchiveEvents(events: EventItem[]): EventItem[] {
  return sortByUpcomingThenPast(events);
}

export function getFallbackEventImage(): string {
  return EVENT_FALLBACK_IMAGE;
}
