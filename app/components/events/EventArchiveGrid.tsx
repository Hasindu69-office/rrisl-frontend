'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, ChevronRight, Clock3, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { addLocaleToUrl } from '@/app/lib/locale';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';
import EventMediaFallback from '@/app/components/events/EventMediaFallback';
import {
  EVENTS_ROUTE,
  formatEventDate,
  getEventDateParts,
  getEventStatus,
  type EventItem,
} from '@/app/lib/events/pageData';

interface EventArchiveGridProps {
  events: EventItem[];
  locale: string;
  viewDetailsLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  selectedCategory: string;
}

function eventHref(slug: string, locale: string) {
  return addLocaleToUrl(`${EVENTS_ROUTE}/${slug}`, locale);
}

function EventCard({
  event,
  locale,
  viewDetailsLabel,
}: {
  event: EventItem;
  locale: string;
  viewDetailsLabel: string;
}) {
  const dateParts = getEventDateParts(event.date);
  const status = getEventStatus(event.date);

  return (
    <Link
      href={eventHref(event.slug, locale)}
      data-events-filter-item
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-[#DCECCB] bg-white shadow-[0_18px_50px_rgba(15,63,29,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,63,29,0.14)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {event.featuredImage ? (
          <Image
            src={event.featuredImage}
            alt={event.featuredImageAlt}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            unoptimized={isLocalhostAssetUrl(event.featuredImage)}
          />
        ) : (
          <EventMediaFallback event={event} compact />
        )}

        <div className="absolute left-5 top-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#2E7D32]">
            {event.kind}
          </span>
          <span
            className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] ${
              status === 'upcoming'
                ? 'bg-[#A1DF0A] text-[#0F3F1D]'
                : 'bg-[#E5E7EB] text-[#344054]'
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 rounded-[20px] bg-[#F7FAF3] p-4">
          <div className="min-w-[74px] border-r border-[#DCECCB] pr-4">
            <p className="text-2xl font-bold leading-none text-[#0F3F1D]">
              {dateParts.day}
            </p>
            <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-[#2E7D32]">
              {dateParts.month}
            </p>
          </div>
          <div className="min-w-0 space-y-2">
            <p className="flex items-center gap-2 text-sm font-medium leading-none text-[#557062]">
              <CalendarDays className="h-4 w-4 text-[#2E7D32]" />
              <span>{formatEventDate(event.date)}</span>
            </p>
            <p className="flex items-center gap-2 text-sm font-medium leading-none text-[#557062]">
              <Clock3 className="h-4 w-4 text-[#2E7D32]" />
              <span>{event.time}</span>
            </p>
          </div>
        </div>

        <h2 className="mt-5 text-xl font-bold leading-snug text-[#0F3F1D] transition group-hover:text-[#2E7D32]">
          {event.title}
        </h2>

        <p className="mt-3 flex items-start gap-2 text-sm leading-7 text-[#557062]">
          <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#2E7D32]" />
          <span>{event.location}</span>
        </p>

        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#557062]">
          {event.summary}
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-dashed border-[#A1DF0A]/70 pt-5 text-sm font-bold text-[#2E7D32]">
          <span>{viewDetailsLabel}</span>
          <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

export default function EventArchiveGrid({
  events,
  locale,
  viewDetailsLabel,
  emptyTitle,
  emptyDescription,
  selectedCategory,
}: EventArchiveGridProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const eventKey = useMemo(
    () => events.map((event) => event.slug).join('|'),
    [events]
  );

  useLayoutEffect(() => {
    if (!panelRef.current || typeof window === 'undefined') {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const panel = panelRef.current;

    const context = gsap.context(() => {
      gsap.fromTo(
        panel,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.62,
          ease: 'power3.out',
          overwrite: 'auto',
          clearProps: 'opacity,visibility,transform',
        }
      );
    }, panel);

    return () => context.revert();
  }, [eventKey, selectedCategory]);

  return (
    <div ref={panelRef} key={selectedCategory}>
      {events.length > 0 ? (
        <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event.slug}
              event={event}
              locale={locale}
              viewDetailsLabel={viewDetailsLabel}
            />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-[26px] border border-dashed border-[#A1DF0A] bg-white p-10 text-center">
          <h2 className="text-2xl font-bold text-[#0F3F1D]">{emptyTitle}</h2>
          <p className="mt-3 text-[#557062]">{emptyDescription}</p>
        </div>
      )}
    </div>
  );
}
