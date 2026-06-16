import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, ChevronRight, Clock3, MapPin } from 'lucide-react';
import DepartmentAnimatedSection from '../components/department/DepartmentAnimatedSection';
import EventArchiveGrid from '../components/events/EventArchiveGrid';
import EventMediaFallback from '../components/events/EventMediaFallback';
import PageHero from '../components/shared/PageHero';
import { addLocaleToUrl, normalizeLocale } from '../lib/locale';
import { isLocalhostAssetUrl } from '../lib/strapi';
import {
  EVENTS_PAGE_DATA,
  EVENTS_ROUTE,
  filterEventsByKind,
  formatEventDate,
  getArchiveEvents,
  getEventDateParts,
  getFeaturedEvent,
} from '../lib/events/pageData';

interface EventsPageProps {
  searchParams: Promise<{ locale?: string; type?: string; page?: string }>;
}

const EVENTS_PAGE_SIZE = 6;
const EVENTS_SECTION_ID = 'all-events';

function eventHref(slug: string, locale: string) {
  return addLocaleToUrl(`${EVENTS_ROUTE}/${slug}`, locale);
}

function filterHref(filterSlug: string, locale: string) {
  const base = filterSlug === 'all' ? EVENTS_ROUTE : `${EVENTS_ROUTE}?type=${filterSlug}`;
  return addLocaleToUrl(base, locale);
}

function paginationHref(
  page: number,
  locale: string,
  selectedType: 'all' | 'event' | 'program'
) {
  const params = new URLSearchParams();

  if (selectedType !== 'all') {
    params.set('type', selectedType);
  }

  if (page > 1) {
    params.set('page', `${page}`);
  }

  const queryString = params.toString();
  const base = queryString ? `${EVENTS_ROUTE}?${queryString}` : EVENTS_ROUTE;
  return `${addLocaleToUrl(base, locale)}#${EVENTS_SECTION_ID}`;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const params = await searchParams;
  const locale = normalizeLocale(params.locale);
  const selectedType =
    params.type === 'event' || params.type === 'program' ? params.type : 'all';
  const rawPage = Number.parseInt(params.page || '1', 10);
  const pageData = EVENTS_PAGE_DATA;
  const archiveEvents = getArchiveEvents();
  const filteredEvents = filterEventsByKind(archiveEvents, selectedType);
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / EVENTS_PAGE_SIZE));
  const currentPage = Number.isNaN(rawPage) ? 1 : Math.min(Math.max(rawPage, 1), totalPages);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * EVENTS_PAGE_SIZE,
    currentPage * EVENTS_PAGE_SIZE
  );
  const featuredEvent = getFeaturedEvent(archiveEvents);
  const featuredDateParts = featuredEvent ? getEventDateParts(featuredEvent.date) : null;

  return (
    <div className="min-h-screen bg-white text-[#0F3F1D]">
      <PageHero
        title={pageData.hero.title}
        breadcrumbItems={pageData.hero.breadcrumbItems}
        backgroundImage={pageData.hero.backgroundImage}
        backgroundImageAlt={pageData.hero.backgroundImageAlt}
        locale={locale}
      />

      <DepartmentAnimatedSection y={30} duration={0.78} stagger={0.08}>
        <section className="relative mb-56 overflow-hidden px-4 py-16 md:py-24">
          <div className="absolute inset-x-0 top-0 h-80 bg-white" />
          <div className="container relative mx-auto max-w-[1180px]">
            <div
              className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
              data-department-reveal
            >
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#A1DF0A]/70 bg-white px-4 py-2 text-sm font-bold text-[#2E7D32] shadow-sm">
                  <CalendarDays className="h-4 w-4" />
                  {pageData.labels.archiveEyebrow}
                </span>
                <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-tight text-[#0F3F1D] md:text-5xl">
                  {pageData.labels.browseAll}
                </h1>
              </div>
            </div>

            {featuredEvent ? (
              <Link
                href={eventHref(featuredEvent.slug, locale)}
                data-department-reveal
                className="group grid overflow-hidden rounded-[30px] bg-[#0F3F1D] shadow-[0_28px_80px_rgba(15,63,29,0.2)] lg:grid-cols-[1.02fr_0.98fr]"
              >
                <div className="relative min-h-[320px] overflow-hidden lg:min-h-[470px]">
                  {featuredEvent.featuredImage ? (
                    <Image
                      src={featuredEvent.featuredImage}
                      alt={featuredEvent.featuredImageAlt}
                      fill
                      priority
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(min-width: 1024px) 55vw, 100vw"
                      unoptimized={isLocalhostAssetUrl(featuredEvent.featuredImage)}
                    />
                  ) : (
                    <EventMediaFallback event={featuredEvent} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F3F1D]/55 to-transparent lg:hidden" />
                </div>

                <div className="flex flex-col justify-center p-7 md:p-10 lg:p-12">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-white/85">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4" />
                      {formatEventDate(featuredEvent.date)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="h-4 w-4" />
                      {featuredEvent.time}
                    </span>
                  </div>

                  <h2 className="mt-5 text-3xl font-bold leading-tight text-white md:text-4xl">
                    {featuredEvent.title}
                  </h2>

                  <p className="mt-5 text-base leading-8 text-white/78">
                    {featuredEvent.summary}
                  </p>

                  <div className="mt-6 grid gap-3 rounded-[22px] border border-white/10 bg-white/5 p-5 text-sm text-white/82">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#A1DF0A]">
                        {pageData.labels.location}
                      </p>
                      <p className="mt-1">{featuredEvent.location}</p>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center gap-3 text-base font-bold text-[#A1DF0A]">
                    {pageData.labels.readDetails}
                    <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ) : null}

            <div
              id={EVENTS_SECTION_ID}
              className="mt-14 scroll-mt-32"
              data-department-reveal
            >
              <div className="flex flex-wrap gap-3">
              {pageData.categories.map((category) => {
                const isActive = selectedType === category.slug;

                return (
                  <Link
                    key={category.slug}
                    href={filterHref(category.slug, locale)}
                    scroll={false}
                    className={`rounded-full border px-5 py-2.5 text-sm font-bold transition ${
                      isActive
                        ? 'border-[#2E7D32] bg-[#2E7D32] text-white shadow-[0_10px_24px_rgba(46,125,50,0.22)]'
                        : 'border-[#DCECCB] bg-white text-[#2E7D32] hover:border-[#A1DF0A]'
                    }`}
                  >
                    {category.label}
                  </Link>
                );
              })}
              </div>
            </div>

            <EventArchiveGrid
              events={paginatedEvents}
              locale={locale}
              selectedCategory={selectedType}
              viewDetailsLabel={pageData.labels.viewDetails}
              emptyTitle={pageData.labels.emptyTitle}
              emptyDescription={pageData.labels.emptyDescription}
            />

            {filteredEvents.length > EVENTS_PAGE_SIZE ? (
              <div
                className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm text-[#667085]"
                data-department-reveal
              >
                <Link
                  href={paginationHref(currentPage - 1, locale, selectedType)}
                  aria-disabled={currentPage === 1}
                  className={`flex items-center gap-2 transition ${
                    currentPage === 1
                      ? 'pointer-events-none opacity-40'
                      : 'hover:text-[#0F3F1D]'
                  }`}
                >
                  Prev
                </Link>

                {Array.from({ length: totalPages }, (_, index) => {
                  const page = index + 1;

                  return (
                    <Link
                      key={page}
                      href={paginationHref(page, locale, selectedType)}
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                        currentPage === page
                          ? 'bg-[#2E7D32] font-semibold text-white shadow-[0_8px_20px_rgba(46,125,50,0.25)]'
                          : 'text-[#98A2B3] hover:bg-[#F1F8F1] hover:text-[#0F3F1D]'
                      }`}
                    >
                      {page}
                    </Link>
                  );
                })}

                <Link
                  href={paginationHref(currentPage + 1, locale, selectedType)}
                  aria-disabled={currentPage === totalPages}
                  className={`flex items-center gap-2 transition ${
                    currentPage === totalPages
                      ? 'pointer-events-none opacity-40'
                      : 'hover:text-[#0F3F1D]'
                  }`}
                >
                  Next
                </Link>
              </div>
            ) : null}
          </div>
        </section>
      </DepartmentAnimatedSection>
    </div>
  );
}
