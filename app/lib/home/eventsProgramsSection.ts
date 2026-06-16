import type { EventEntity, HomeEventsAndProgramsSection } from '@/app/lib/types';
import {
  mapEventsWithFallback,
  type EventItem,
  type EventsPageLabels,
} from '@/app/lib/events/pageData';
import type { EventCategory } from '@/app/lib/types';

export interface HomeEventsProgramsSectionViewModel {
  eyebrow: string;
  titlePart1: string;
  titlePart2: string;
  upcomingLabel: string;
  pastLabel: string;
  previousLabel: string;
  nextLabel: string;
  pastEventsTitle: string;
  pastEventsEmptyMessage: string;
  upcomingEmptyTitle: string;
  upcomingEmptyDescription: string;
  events: EventItem[];
}

const HOME_EVENTS_PROGRAMS_FALLBACK: HomeEventsProgramsSectionViewModel = {
  eyebrow: 'Events & Activities',
  titlePart1: 'Events & ',
  titlePart2: 'Programs',
  upcomingLabel: 'Upcoming',
  pastLabel: 'Past',
  previousLabel: 'Previous',
  nextLabel: 'Next',
  pastEventsTitle: 'Past Events & Programs',
  pastEventsEmptyMessage:
    'Nothing to revisit this month. Past events and programs will appear here once available.',
  upcomingEmptyTitle: 'No upcoming events or programs this month.',
  upcomingEmptyDescription:
    'Check another month on the calendar to explore what is scheduled next.',
  events: [],
};

export function mapHomeEventsProgramsSection(
  section: HomeEventsAndProgramsSection | null | undefined,
  eventPageLabels: Pick<EventsPageLabels, 'upcoming' | 'past' | 'previous' | 'next'>,
  localizedEvents: EventEntity[],
  fallbackEvents: EventEntity[],
  localizedCategories: EventCategory[],
  fallbackCategories: EventCategory[]
): HomeEventsProgramsSectionViewModel {
  const activeEvents = localizedEvents.length > 0 ? localizedEvents : fallbackEvents;
  const events = mapEventsWithFallback(
    activeEvents,
    fallbackEvents,
    localizedCategories,
    fallbackCategories
  );
  const titlePart1 = section?.sectionheader?.title;
  const titlePart2 = section?.sectionheader?.hightlightedtext;

  return {
    eyebrow:
      section?.sectionheader?.eyebrow?.trim() ||
      HOME_EVENTS_PROGRAMS_FALLBACK.eyebrow,
    titlePart1:
      (titlePart1 && titlePart1.trim()
        ? titlePart1
        : '') ||
      HOME_EVENTS_PROGRAMS_FALLBACK.titlePart1,
    titlePart2:
      (titlePart2 && titlePart2.trim()
        ? titlePart2
        : '') ||
      HOME_EVENTS_PROGRAMS_FALLBACK.titlePart2,
    upcomingLabel:
      eventPageLabels.upcoming || HOME_EVENTS_PROGRAMS_FALLBACK.upcomingLabel,
    pastLabel:
      eventPageLabels.past || HOME_EVENTS_PROGRAMS_FALLBACK.pastLabel,
    previousLabel:
      eventPageLabels.previous || HOME_EVENTS_PROGRAMS_FALLBACK.previousLabel,
    nextLabel:
      eventPageLabels.next || HOME_EVENTS_PROGRAMS_FALLBACK.nextLabel,
    pastEventsTitle:
      section?.pasteventsandprogramslabel?.trim() ||
      HOME_EVENTS_PROGRAMS_FALLBACK.pastEventsTitle,
    pastEventsEmptyMessage:
      section?.noeventslabel?.trim() ||
      HOME_EVENTS_PROGRAMS_FALLBACK.pastEventsEmptyMessage,
    upcomingEmptyTitle:
      section?.noupcomingeventserrormessage?.Title?.trim() ||
      section?.noupcomingeventserrormessage?.title?.trim() ||
      HOME_EVENTS_PROGRAMS_FALLBACK.upcomingEmptyTitle,
    upcomingEmptyDescription:
      section?.noupcomingeventserrormessage?.Description?.trim() ||
      section?.noupcomingeventserrormessage?.description?.trim() ||
      HOME_EVENTS_PROGRAMS_FALLBACK.upcomingEmptyDescription,
    events,
  };
}
