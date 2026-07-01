import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Clock3,
  GraduationCap,
  MapPin,
} from 'lucide-react';
import DepartmentAnimatedSection from '../../components/department/DepartmentAnimatedSection';
import EventMediaFallback from '../../components/events/EventMediaFallback';
import PageHero from '../../components/shared/PageHero';
import { addLocaleToUrl, normalizeLocale } from '../../lib/locale';
import { getAllEvents, getEventBySlug, getEventCategories, getEventPage } from '../../lib/strapi';
import { isLocalhostAssetUrl } from '../../lib/strapi';
import {
  EVENTS_ROUTE,
  formatEventDate,
  getEventDateParts,
  getEventStatus,
  getRelatedEvents,
  mapEvent,
  mapEventsWithFallback,
  mapEventsPageData,
} from '../../lib/events/pageData';

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ locale?: string }>;
}

export async function generateStaticParams() {
  const events = await getAllEvents('en');
  return events
    .map((event) => event?.slug?.trim())
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }));
}

export default async function EventDetailPage({
  params,
  searchParams,
}: EventDetailPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const locale = normalizeLocale(query.locale);
  const [
    localizedPage,
    fallbackPage,
    localizedCategories,
    fallbackCategories,
    eventEntity,
    fallbackEventEntity,
    localizedEvents,
    fallbackEvents,
  ] = await Promise.all([
    getEventPage(locale),
    locale !== 'en' ? getEventPage('en') : Promise.resolve(null),
    getEventCategories(locale),
    locale !== 'en' ? getEventCategories('en') : Promise.resolve([]),
    getEventBySlug(slug, locale),
    locale !== 'en' ? getEventBySlug(slug, 'en') : Promise.resolve(null),
    getAllEvents(locale),
    locale !== 'en' ? getAllEvents('en') : Promise.resolve([]),
  ]);
  const pageData = mapEventsPageData(
    localizedPage,
    fallbackPage,
    localizedCategories,
    fallbackCategories
  );
  const event = mapEvent(eventEntity || fallbackEventEntity, {
    fallbackEvent: fallbackEventEntity,
    localizedCategories,
    fallbackCategories,
  });

  if (!event) {
    notFound();
  }

  const relatedEvents = getRelatedEvents(
    event,
    mapEventsWithFallback(
      localizedEvents.length > 0 ? localizedEvents : fallbackEvents,
      fallbackEvents,
      localizedCategories,
      fallbackCategories
    )
  );
  const backHref = addLocaleToUrl(EVENTS_ROUTE, locale);
  const status = getEventStatus(event.date);
  const categoryLabel = event.categories[0]?.label || event.kind;
  const statusLabel = status === 'upcoming' ? pageData.labels.upcoming : pageData.labels.past;
  const kindIcon = event.kind === 'Program' ? GraduationCap : CalendarDays;
  const KindIcon = kindIcon;

  return (
    <div className="min-h-screen overflow-x-clip bg-white text-[#0F3F1D]">
      <PageHero
        title={pageData.labels.title}
        breadcrumbItems={[
          pageData.hero.breadcrumbItems[0] || { label: 'Home', href: '/' },
          { label: pageData.labels.title, href: EVENTS_ROUTE },
          { label: pageData.labels.details },
        ]}
        backgroundImage={event.featuredImage || pageData.hero.backgroundImage}
        backgroundImageAlt={event.featuredImageAlt || pageData.hero.backgroundImageAlt}
        locale={locale}
      />

      <DepartmentAnimatedSection y={28} duration={0.76} stagger={0.09}>
        <article className="mb-56 px-4 py-14 md:px-6 md:py-20 lg:px-36">
          <div className="mx-auto w-full max-w-[1480px]">
            <Link
              href={backHref}
              data-department-reveal
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#DCECCB] bg-white px-5 py-2.5 text-sm font-bold text-[#2E7D32] shadow-sm transition hover:border-[#A1DF0A]"
            >
              <ArrowLeft className="h-4 w-4" />
              {pageData.labels.backToAllEvents}
            </Link>

            <div className="grid min-w-0 gap-9 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className="min-w-0">
                <div
                  className="overflow-hidden rounded-[30px] bg-white shadow-[0_24px_70px_rgba(15,63,29,0.12)]"
                  data-department-reveal
                >
                  <div className="relative aspect-[16/9] min-h-[280px] overflow-hidden">
                    {event.featuredImage ? (
                      <Image
                        src={event.featuredImage}
                        alt={event.featuredImageAlt}
                        fill
                        priority
                        className="object-cover"
                        sizes="(min-width: 1768px) 1104px, (min-width: 1024px) calc(100vw - 18rem - 376px), 100vw"
                        unoptimized={isLocalhostAssetUrl(event.featuredImage)}
                      />
                    ) : (
                      <EventMediaFallback event={event} />
                    )}
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2 sm:left-6 sm:top-6">
                      <div className="rounded-full bg-[#A1DF0A] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#0F3F1D] sm:tracking-[0.16em]">
                        {categoryLabel}
                      </div>
                      <div
                        className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] sm:tracking-[0.16em] ${
                          status === 'upcoming'
                            ? 'bg-white/92 text-[#0F3F1D]'
                            : 'bg-[#E5E7EB] text-[#344054]'
                        }`}
                      >
                        {statusLabel}
                      </div>
                    </div>
                  </div>

                  <div className="min-w-0 p-6 md:p-10">
                    <div className="grid gap-4 rounded-[24px] bg-[#F7FAF3] p-5 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1fr)] xl:gap-5 xl:p-6">
                      <div className="rounded-[18px] bg-white/60 p-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#2E7D32]">
                          {pageData.labels.date}
                        </p>
                        <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[#36543F]">
                          <CalendarDays className="h-4 w-4 text-[#2E7D32]" />
                          {formatEventDate(event.date)}
                        </p>
                      </div>
                      <div className="rounded-[18px] bg-white/60 p-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#2E7D32]">
                          {pageData.labels.time}
                        </p>
                        <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[#36543F]">
                          <Clock3 className="h-4 w-4 text-[#2E7D32]" />
                          {event.time}
                        </p>
                      </div>
                      <div className="rounded-[18px] bg-white/60 p-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#2E7D32]">
                          {pageData.labels.location}
                        </p>
                        <p className="mt-2 inline-flex items-start gap-2 text-sm font-medium leading-6 text-[#36543F]">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#2E7D32]" />
                          <span>{event.location}</span>
                        </p>
                      </div>
                      <div className="rounded-[18px] bg-white/60 p-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#2E7D32]">
                          {pageData.labels.status}
                        </p>
                        <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[#36543F]">
                          <KindIcon className="h-4 w-4 text-[#2E7D32]" />
                          {status === 'upcoming' ? pageData.labels.upcoming : pageData.labels.past}
                        </p>
                      </div>
                    </div>

                    <h1 className="mt-8 [overflow-wrap:anywhere] text-3xl font-bold leading-tight text-[#0F3F1D] md:text-5xl">
                      {event.title}
                    </h1>
                    <p className="mt-5 [overflow-wrap:anywhere] border-l-4 border-[#A1DF0A] pl-5 text-lg leading-8 text-[#36543F]">
                      {event.summary}
                    </p>

                    <div className="mt-9 min-w-0 space-y-6 [overflow-wrap:anywhere] text-base leading-8 text-[#36543F] md:text-lg">
                      {event.content.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {event.galleryImages.length > 0 ? (
                  <section className="mt-10" data-department-reveal>
                    <h2 className="text-2xl font-bold text-[#0F3F1D]">
                      {pageData.labels.gallery}
                    </h2>
                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                      {event.galleryImages.map((image) => (
                        <div
                          key={image.src}
                          className="relative aspect-[4/3] overflow-hidden rounded-[24px] shadow-[0_18px_50px_rgba(15,63,29,0.1)]"
                        >
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className="object-cover"
                            sizes="(min-width: 768px) 50vw, 100vw"
                            unoptimized={isLocalhostAssetUrl(image.src)}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>

              <aside className="space-y-7 lg:sticky lg:top-8 lg:self-start" data-department-reveal>
                {relatedEvents.length > 0 ? (
                  <div className="rounded-[26px] border border-[#DCECCB] bg-white p-6 shadow-[0_18px_50px_rgba(15,63,29,0.08)]">
                    <h2 className="text-xl font-bold text-[#0F3F1D]">{pageData.labels.relatedEvents}</h2>
                    <div className="mt-5 space-y-4">
                      {relatedEvents.map((related) => (
                        <Link
                          key={related.slug}
                          href={addLocaleToUrl(`${EVENTS_ROUTE}/${related.slug}`, locale)}
                          className="group grid grid-cols-[86px_1fr] gap-4 rounded-[18px] p-2 transition hover:bg-[#F7FAF3]"
                        >
                          <div className="relative h-20 overflow-hidden rounded-[14px] bg-[#123F1D]">
                            {related.featuredImage ? (
                              <Image
                                src={related.featuredImage}
                                alt={related.featuredImageAlt}
                                fill
                                className="object-cover"
                                sizes="86px"
                                unoptimized={isLocalhostAssetUrl(related.featuredImage)}
                              />
                            ) : (
                              <EventMediaFallback
                                event={related}
                                compact
                                textMode="icon-only"
                                className="min-h-0"
                              />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#2E7D32]">
                              {related.kind}
                            </p>
                            <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-[#0F3F1D] group-hover:text-[#2E7D32]">
                              {related.title}
                            </h3>
                            <p className="mt-1 text-xs text-[#557062]">
                              {formatEventDate(related.date)}
                            </p>
                            <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#2E7D32]">
                              {pageData.labels.viewDetails}
                              <ChevronRight className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </aside>
            </div>
          </div>
        </article>
      </DepartmentAnimatedSection>
    </div>
  );
}
