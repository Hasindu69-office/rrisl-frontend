import type { BreadcrumbItem } from '@/app/components/shared/Breadcrumb';

export const EVENTS_ROUTE = '/events';

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
  location: string;
  kind: EventKind;
  featuredImage: string | null;
  featuredImageAlt: string;
  galleryImages: EventGalleryImage[];
  isFeatured: boolean;
}

export interface EventCategoryViewModel {
  label: string;
  slug: 'all' | 'event' | 'program';
}

export interface EventsPageLabels {
  title: string;
  topic: string;
  all: string;
  events: string;
  programs: string;
  featured: string;
  featuredLabel: string;
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

export const EVENTS_PAGE_DATA: EventsPageViewModel = {
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
    featured: 'Featured',
    featuredLabel: 'Featured upcoming item',
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
  },
  categories: [
    { label: 'All', slug: 'all' },
    { label: 'Events', slug: 'event' },
    { label: 'Programs', slug: 'program' },
  ],
};

const EVENT_ITEMS: EventItem[] = [
  {
    id: 'scientific-affairs',
    slug: 'scientific-affairs-r-and-d-committee-meeting',
    title: '1st committee meeting of Scientific Affairs and R&D (Technology)',
    summary:
      'A cross-functional session to review current applied research priorities, commercialization readiness, and institutional delivery milestones.',
    content: [
      'This committee meeting brings together research leads, administration, and technology transfer stakeholders to review the current portfolio of institutional research and development activity.',
      'The agenda focuses on aligning active investigations with operational needs, identifying barriers to field deployment, and clarifying next-step ownership across scientific and administrative teams.',
      'Participants will also review upcoming reporting expectations and collaboration priorities for the next quarter.',
    ],
    date: '2026-03-21',
    time: '10.00 am',
    location: 'Rubber Research Institute, Sri Lanka.',
    kind: 'Event',
    featuredImage: '/images/section6_img1.png',
    featuredImageAlt: 'Scientific affairs meeting at RRISL',
    galleryImages: [
      {
        src: '/images/section6_img1.png',
        alt: 'Research team gathered for the scientific affairs meeting',
      },
    ],
    isFeatured: true,
  },
  {
    id: 'latex-quality-program',
    slug: 'latex-quality-improvement-program-for-field-officers',
    title: 'Latex Quality Improvement Program for Field Officers',
    summary:
      'A focused capacity-building programme for field officers on process discipline, handling practices, and practical quality interventions.',
    content: [
      'The programme is designed for field officers who directly support producers and estate teams working on latex quality management.',
      'Sessions cover contamination prevention, handling routines, field-level quality checks, and structured troubleshooting practices that can be applied immediately after training.',
      'The programme also includes discussion time for recurring quality failures reported from the field and how to standardize responses across regions.',
    ],
    date: '2026-03-24',
    time: '2.30 pm',
    location: 'Technology Transfer Division, Ratmalana.',
    kind: 'Program',
    featuredImage: null,
    featuredImageAlt: 'Latex quality training program',
    galleryImages: [],
    isFeatured: false,
  },
  {
    id: 'smallholders-workshop',
    slug: 'smallholders-sustainability-workshop',
    title: 'Smallholders Sustainability Workshop',
    summary:
      'A practical workshop on long-term field resilience, good agricultural practices, and advisory support for smallholder growers.',
    content: [
      'This workshop is structured around the operational challenges faced by smallholder growers and the advisory teams who support them.',
      'Discussion topics include field sustainability, risk awareness, and the practical integration of RRISL guidance into everyday cultivation decisions.',
      'Participants will leave with implementation notes that can be adapted for local outreach and extension work.',
    ],
    date: '2026-03-29',
    time: '9.30 am',
    location: 'RRISL Outreach Center, Kalutara.',
    kind: 'Program',
    featuredImage: '/images/section6_img1.png',
    featuredImageAlt: 'Smallholders sustainability workshop',
    galleryImages: [
      {
        src: '/images/section6_img1.png',
        alt: 'Workshop session with RRISL outreach participants',
      },
    ],
    isFeatured: false,
  },
  {
    id: 'crop-management-review',
    slug: 'crop-management-review-meeting',
    title: 'Crop management review meeting',
    summary:
      'An internal review of field performance observations, operational concerns, and near-term crop management interventions.',
    content: [
      'The crop management review meeting consolidates observations from active sites and recent reporting cycles to identify where corrective action is needed.',
      'Contributors compare performance indicators, discuss agronomic risks, and agree on the priority interventions that should be communicated to field teams.',
    ],
    date: '2026-03-05',
    time: '11.00 am',
    location: 'Research Administration Board Room.',
    kind: 'Event',
    featuredImage: null,
    featuredImageAlt: 'Crop management review meeting',
    galleryImages: [],
    isFeatured: false,
  },
  {
    id: 'lab-safety-session',
    slug: 'laboratory-safety-orientation-for-new-trainees',
    title: 'Laboratory safety orientation for new trainees',
    summary:
      'A foundational orientation on laboratory conduct, safety systems, and operating expectations for incoming trainees.',
    content: [
      'This orientation introduces new trainees to RRISL laboratory environments, safety protocols, and supervision expectations before they begin hands-on work.',
      'The session covers facility rules, incident prevention, and the basic routines required to work safely around equipment, samples, and shared lab resources.',
    ],
    date: '2026-03-11',
    time: '1.00 pm',
    location: 'Central Laboratory Complex.',
    kind: 'Program',
    featuredImage: null,
    featuredImageAlt: 'Laboratory safety orientation',
    galleryImages: [],
    isFeatured: false,
  },
  {
    id: 'plant-breeding-clinic',
    slug: 'plant-breeding-clinic-for-extension-officers',
    title: 'Plant breeding clinic for extension officers',
    summary:
      'A targeted clinic on breeding priorities, communication to the field, and how extension teams can translate current research into practice.',
    content: [
      'The clinic is aimed at extension officers who need a clearer working understanding of plant breeding outputs and how those outputs should be explained in the field.',
      'Researchers will walk through current themes, answer operational questions, and provide guidance on how to communicate breeding value without oversimplifying technical nuance.',
    ],
    date: '2026-02-06',
    time: '9.00 am',
    location: 'Genetics and Plant Breeding Unit.',
    kind: 'Program',
    featuredImage: '/images/section6_img1.png',
    featuredImageAlt: 'Plant breeding clinic for extension officers',
    galleryImages: [],
    isFeatured: false,
  },
  {
    id: 'advisory-panel',
    slug: 'quarterly-advisory-panel-discussion-on-field-innovation',
    title: 'Quarterly advisory panel discussion on field innovation',
    summary:
      'A panel discussion reviewing practical field innovation priorities, stakeholder feedback, and implementation opportunities.',
    content: [
      'The advisory panel discussion is a structured conversation between institutional leaders and technical stakeholders working close to field conditions.',
      'It is intended to surface practical insights, stress-test ongoing initiatives, and identify where innovation efforts need stronger operational support.',
    ],
    date: '2025-12-19',
    time: '3.00 pm',
    location: 'Main Auditorium, RRISL.',
    kind: 'Event',
    featuredImage: null,
    featuredImageAlt: 'Quarterly advisory panel discussion',
    galleryImages: [],
    isFeatured: false,
  },
];

function toDate(dateString: string): Date {
  return new Date(`${dateString}T00:00:00`);
}

function sortByDateAsc(items: EventItem[]): EventItem[] {
  return [...items].sort((left, right) => left.date.localeCompare(right.date));
}

function sortByUpcomingThenPast(items: EventItem[]): EventItem[] {
  const upcoming = items.filter((item) => getEventStatus(item.date) === 'upcoming');
  const past = items.filter((item) => getEventStatus(item.date) === 'past');

  return [
    ...sortByDateAsc(upcoming),
    ...sortByDateAsc(past).reverse(),
  ];
}

export function getAllEvents(): EventItem[] {
  return sortByDateAsc(EVENT_ITEMS);
}

export function formatEventDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(toDate(date));
}

export function getEventDateParts(date: string): {
  day: string;
  month: string;
  year: string;
  weekday: string;
} {
  const eventDate = toDate(date);

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
  return toDate(date) < localToday ? 'past' : 'upcoming';
}

export function getFeaturedEvent(events: EventItem[]): EventItem | null {
  if (events.length === 0) {
    return null;
  }

  const upcoming = sortByDateAsc(events.filter((event) => getEventStatus(event.date) === 'upcoming'));
  return upcoming[0] || events.find((event) => event.isFeatured) || events[0];
}

export function getEventBySlug(slug: string): EventItem | null {
  return EVENT_ITEMS.find((event) => event.slug === slug) || null;
}

export function filterEventsByKind(events: EventItem[], kindSlug: 'all' | 'event' | 'program'): EventItem[] {
  if (kindSlug === 'all') {
    return sortByUpcomingThenPast(events);
  }

  const kind = kindSlug === 'event' ? 'Event' : 'Program';
  return sortByUpcomingThenPast(events.filter((event) => event.kind === kind));
}

export function getRelatedEvents(event: EventItem, events: EventItem[], limit = 3): EventItem[] {
  const remaining = events.filter((item) => item.slug !== event.slug);
  const sameKind = remaining.filter((item) => item.kind === event.kind);
  return sortByUpcomingThenPast(sameKind).slice(0, limit);
}

export function getArchiveEvents(): EventItem[] {
  return sortByUpcomingThenPast(EVENT_ITEMS);
}
