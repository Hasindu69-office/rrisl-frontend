'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, MapPin } from 'lucide-react';
import GradientTag from '@/app/components/ui/GradientTag';
import GradientTitle from '@/app/components/ui/GradientTitle';
import { addLocaleToUrl, normalizeLocale } from '@/app/lib/locale';
import {
  EVENTS_ROUTE,
  getAllEvents,
  getEventDateParts,
  getEventStatus,
  type EventItem,
} from '@/app/lib/events/pageData';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const LIST_PAGE_SIZE = 5;
const TODAY = new Date();
const INITIAL_MONTH = TODAY.getMonth();
const INITIAL_YEAR = TODAY.getFullYear();
const CALENDAR_EVENTS = getAllEvents();

function formatMonthYear(year: number, month: number) {
  return `${MONTHS[month]} ${year}`;
}

function toLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function buildCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const previousMonthLastDay = new Date(year, month, 0);

  const daysFromPreviousMonth = (firstDay.getDay() + 6) % 7;
  const daysInCurrentMonth = lastDay.getDate();
  const trailingDays = (7 - ((daysFromPreviousMonth + daysInCurrentMonth) % 7)) % 7;

  const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];

  for (let index = daysFromPreviousMonth; index > 0; index -= 1) {
    days.push({
      date: new Date(year, month - 1, previousMonthLastDay.getDate() - index + 1),
      isCurrentMonth: false,
    });
  }

  for (let day = 1; day <= daysInCurrentMonth; day += 1) {
    days.push({
      date: new Date(year, month, day),
      isCurrentMonth: true,
    });
  }

  for (let day = 1; day <= trailingDays; day += 1) {
    days.push({
      date: new Date(year, month + 1, day),
      isCurrentMonth: false,
    });
  }

  return days;
}

export default function EventsProgramsSection() {
  const searchParams = useSearchParams();
  const [displayMonth, setDisplayMonth] = useState(INITIAL_MONTH);
  const [displayYear, setDisplayYear] = useState(INITIAL_YEAR);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerSlide, setCardsPerSlide] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedEventDate, setSelectedEventDate] = useState<string | null>(null);
  const [isDesktopCalendar, setIsDesktopCalendar] = useState(false);
  const locale = normalizeLocale(searchParams.get('locale'));

  useEffect(() => {
    const updateCardsPerSlide = () => {
      if (window.innerWidth >= 768) {
        setCardsPerSlide(2);
        return;
      }

      setCardsPerSlide(1);
    };

    updateCardsPerSlide();
    window.addEventListener('resize', updateCardsPerSlide);

    return () => {
      window.removeEventListener('resize', updateCardsPerSlide);
    };
  }, []);

  useEffect(() => {
    const updateCalendarMode = () => {
      const desktop = window.innerWidth >= 1280;
      setIsDesktopCalendar(desktop);

      if (desktop) {
        setSelectedEventDate(null);
      }
    };

    updateCalendarMode();
    window.addEventListener('resize', updateCalendarMode);

    return () => {
      window.removeEventListener('resize', updateCalendarMode);
    };
  }, []);

  const visibleEvents = CALENDAR_EVENTS.filter((event: EventItem) => {
    const eventDate = new Date(`${event.date}T00:00:00`);

    return (
      eventDate.getMonth() === displayMonth &&
      eventDate.getFullYear() === displayYear
    );
  }).sort((left, right) => left.date.localeCompare(right.date));

  const pastEvents = visibleEvents.filter((event) => getEventStatus(event.date) === 'past').slice(0, 2);
  const upcomingEvents = visibleEvents.filter((event) => getEventStatus(event.date) === 'upcoming');
  const effectiveSelectedEventDate = visibleEvents.some((event) => event.date === selectedEventDate)
    ? selectedEventDate
    : null;
  const totalPages = Math.max(1, Math.ceil(upcomingEvents.length / LIST_PAGE_SIZE));
  const paginatedEvents = upcomingEvents.slice(
    (currentPage - 1) * LIST_PAGE_SIZE,
    currentPage * LIST_PAGE_SIZE
  );
  const totalSlides = Math.max(1, Math.ceil(upcomingEvents.length / cardsPerSlide));
  const activeSlide = Math.min(currentSlide, totalSlides - 1);
  const sliderEvents = upcomingEvents.slice(
    activeSlide * cardsPerSlide,
    (activeSlide + 1) * cardsPerSlide
  );

  // Auto-advance slides on mobile/tablet when there are multiple slides
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return undefined;

    const interval = setInterval(() => {
      setCurrentSlide((current) => (current + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(interval);
  }, [totalSlides, isPaused]);

  const calendarDays = buildCalendarDays(displayYear, displayMonth);

  const handleMonthChange = (direction: 'previous' | 'next') => {
    setCurrentPage(1);
    setCurrentSlide(0);

    if (direction === 'previous') {
      if (displayMonth === 0) {
        setDisplayMonth(11);
        setDisplayYear((current) => current - 1);
        return;
      }

      setDisplayMonth((current) => current - 1);
      return;
    }

    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear((current) => current + 1);
      return;
    }

    setDisplayMonth((current) => current + 1);
  };

  const handleListPageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  const handleSlideChange = (direction: 'previous' | 'next') => {
    setCurrentSlide((current) => {
      if (direction === 'previous') {
        return Math.max(0, current - 1);
      }

      return Math.min(totalSlides - 1, current + 1);
    });
  };

  return (
    <section className="overflow-x-clip bg-white py-8 md:py-4 lg:py-8">
      <div className="mx-auto w-full max-w-[1600px] overflow-x-hidden px-4 md:px-6 xl:w-[80%] xl:px-0">
        <div className="rounded-[28px] px-0 py-0 md:px-0 md:py-0">
          <div className="mb-8 text-center md:mb-10 xl:hidden">
            <GradientTag
              text="Events & Activities"
              className="inline-block"
              gradientFrom="#20C997"
              gradientTo="#A1DF0A"
              backgroundColor="transparent"
              textColor="#2E7D32"
            />
            <GradientTitle
              part1="Events & "
              part2="Programs"
              part1Color="dark-green"
              lineBreak={false}
              size="md"
              align="center"
              className="mt-5 font-bold"
              style={{ lineHeight: '1.15' }}
            />
          </div>

          <div className="grid gap-8 xl:grid-cols-[340px_minmax(0,1fr)] xl:gap-12">
            <aside className="overflow-x-clip bg-[#FAFBF8] px-5 py-6 shadow-[0_24px_80px_rgba(15,63,29,0.06)] md:px-8 md:py-10 xl:border-r xl:border-[#A1DF0A] xl:pr-8">
              <div className="relative rounded-[24px] bg-white p-4 shadow-[0_18px_40px_rgba(15,63,29,0.08)] md:p-5">
                <div className="mb-5 flex items-center justify-between">
                  <button
                    type="button"
                    aria-label="Previous month"
                    onClick={() => handleMonthChange('previous')}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8D8] text-[#0F3F1D] transition hover:border-[#2E7D32] hover:bg-[#F1F8F1]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#344054] md:text-base">
                    <span>{formatMonthYear(displayYear, displayMonth)}</span>
                    <CalendarDays className="h-4 w-4 text-[#6B7280]" />
                  </div>
                  <button
                    type="button"
                    aria-label="Next month"
                    onClick={() => handleMonthChange('next')}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8D8] text-[#0F3F1D] transition hover:border-[#2E7D32] hover:bg-[#F1F8F1]"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="mb-2 grid grid-cols-7 gap-y-3 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-[#667085]">
                  {WEEKDAY_LABELS.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-y-2 overflow-visible">
                  {calendarDays.map(({ date, isCurrentMonth }, index) => {
                    const isoDate = toLocalDateKey(date);
                    const event = visibleEvents.find((item) => item.date === isoDate);
                    const hasEvent = Boolean(event);
                    const eventStatus = event ? getEventStatus(event.date) : null;
                    const isToday = isoDate === toLocalDateKey(TODAY);
                    const calendarColumn = index % 7;
                    const popoverPositionClass = calendarColumn <= 1
                      ? 'left-0 translate-x-0'
                      : calendarColumn >= 5
                        ? 'right-0 left-auto translate-x-0'
                        : 'left-1/2 -translate-x-1/2';

                    return (
                      <div key={isoDate} className="group relative flex justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (isDesktopCalendar) {
                              return;
                            }

                            if (!event) {
                              setSelectedEventDate(null);
                              return;
                            }

                            setSelectedEventDate((current) => (
                              current === isoDate ? null : isoDate
                            ));
                          }}
                          aria-expanded={!isDesktopCalendar && hasEvent ? effectiveSelectedEventDate === isoDate : undefined}
                          aria-label={event ? `Show details for ${event.title}` : undefined}
                          className={[
                            'relative aspect-square h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ease-out',
                            isCurrentMonth ? 'text-[#344054]' : 'text-[#C2C8D0]',
                            isToday ? 'bg-[#2E7D32] font-bold text-white shadow-[0_10px_24px_rgba(46,125,50,0.28)]' : '',
                            !isToday ? 'hover:bg-[#F3F6F0]' : '',
                            hasEvent ? 'cursor-pointer' : '',
                          ].join(' ')}
                        >
                          {date.getDate()}
                          {hasEvent && eventStatus === 'upcoming' ? (
                            <span className="absolute bottom-0.5 h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
                          ) : null}
                          {hasEvent && eventStatus === 'past' ? (
                            <span className="absolute bottom-0.5 h-1.5 w-1.5 rounded-full bg-[#98A2B3]" />
                          ) : null}
                        </button>

                        {event ? (
                          <div className={[
                            'absolute z-20 w-[min(13rem,calc(100vw-3rem))] rounded-2xl bg-[#123F1D] p-2.5 text-left text-white shadow-[0_18px_40px_rgba(15,63,29,0.24)] transition-all duration-300 ease-out',
                            'top-full mt-2 opacity-0 pointer-events-none translate-y-2',
                            'xl:top-auto xl:bottom-full xl:mt-0 xl:mb-3',
                            'xl:group-hover:translate-y-0 xl:group-hover:opacity-100',
                            effectiveSelectedEventDate === isoDate ? 'translate-y-0 opacity-100 pointer-events-auto xl:pointer-events-none' : '',
                            popoverPositionClass,
                          ].join(' ')}>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A1DF0A]">
                              {event.kind} / {eventStatus}
                            </p>
                            <p className="mt-1 text-xs font-semibold leading-5">
                              {event.title}
                            </p>
                            <p className="mt-1.5 text-[11px] leading-4 text-white/80">{event.location}</p>
                            <p className="mt-1 text-[11px] text-white/80">{event.time}</p>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 hidden space-y-8 xl:block">
                <div>
                  <h3 className="text-[22px] font-bold text-[#0F3F1D] md:text-[28px]">
                    Past Events & Programs
                  </h3>
                  <div className="mt-4 space-y-5">
                    {pastEvents.length > 0 ? (
                      pastEvents.map((event) => (
                        <article key={event.id} className="space-y-2">
                          <h4 className="text-lg font-semibold leading-8 text-[#486476]">
                            {event.title}
                          </h4>
                          <p className="text-[18px] font-normal text-[#98A2B3]">
                            {getEventDateParts(event.date).day} {getEventDateParts(event.date).month} {new Date(`${event.date}T00:00:00`).getFullYear()}
                          </p>
                        </article>
                      ))
                    ) : (
                      <p className="text-base text-[#667085]">
                        Nothing to revisit this month. Past events and programs will appear here once available.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex h-full min-w-0 flex-col overflow-x-hidden">
              <div className="hidden flex-col gap-6 border-b border-[#B7DB6A] pb-6 md:flex-row md:items-end md:justify-between xl:flex">
                <div>
                  <GradientTag
                    text="Events & Activities"
                    className="inline-block"
                    gradientFrom="#20C997"
                    gradientTo="#A1DF0A"
                    backgroundColor="transparent"
                    textColor="#2E7D32"
                  />
                  <GradientTitle
                    part1="Events & "
                    part2="Programs"
                    part1Color="dark-green"
                    lineBreak={false}
                    size="md"
                    className="mt-5 font-bold"
                    style={{ lineHeight: '1.15' }}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Previous list page"
                    onClick={() => handleListPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E2E8D8] text-[#0F3F1D] transition enabled:hover:border-[#2E7D32] enabled:hover:bg-[#F1F8F1] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next list page"
                    onClick={() => handleListPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E2E8D8] text-[#0F3F1D] transition enabled:hover:border-[#2E7D32] enabled:hover:bg-[#F1F8F1] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-8 xl:hidden">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h3 className="min-w-0 flex-1 text-left text-[20px] font-bold leading-tight text-[#0F3F1D] md:text-[24px]">
                    Upcoming Events & Programs
                  </h3>
                  {upcomingEvents.length > cardsPerSlide ? (
                    <div className="flex shrink-0 items-center gap-3">
                      <button
                        type="button"
                        aria-label="Previous upcoming events"
                        onClick={() => handleSlideChange('previous')}
                        disabled={activeSlide === 0}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8D8] text-[#0F3F1D] transition enabled:hover:border-[#2E7D32] enabled:hover:bg-[#F1F8F1] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Next upcoming events"
                        onClick={() => handleSlideChange('next')}
                        disabled={activeSlide === totalSlides - 1}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8D8] text-[#0F3F1D] transition enabled:hover:border-[#2E7D32] enabled:hover:bg-[#F1F8F1] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  ) : null}
                </div>

                {upcomingEvents.length > 0 ? (
                  <>
                    <div
                      className="grid min-w-0 gap-4 overflow-x-hidden md:grid-cols-2 md:gap-5"
                      onMouseEnter={() => setIsPaused(true)}
                      onMouseLeave={() => setIsPaused(false)}
                      onTouchStart={() => setIsPaused(true)}
                      onTouchEnd={() => setIsPaused(false)}
                    >
                      {sliderEvents.map((event) => {
                        const { day, month } = getEventDateParts(event.date);

                        return (
                          <Link
                            key={event.id}
                            href={addLocaleToUrl(`${EVENTS_ROUTE}/${event.slug}`, locale)}
                            className="flex h-[320px] min-w-0 flex-col justify-between overflow-hidden rounded-[24px] border border-[#EEF2E8] bg-white px-5 py-5 md:h-[300px]"
                          >
                            <div className="min-w-[118px]">
                              <p className="text-[25px] font-bold leading-none text-[#0F3F1D]">
                                {day} {month}
                              </p>
                              <p className="mt-1 text-[18px] font-medium text-[#2E7D32]">
                                {event.time}
                              </p>
                            </div>

                            <div className="my-4 h-[2px] w-full bg-[#2E7D32]/60" />

                            <div className="min-w-0">
                              <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-[#F5F7FA] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#486476]">
                                  {event.kind}
                                </span>
                              </div>
                              <p className="flex min-w-0 items-start gap-2 text-base text-[#7A8B99]">
                                <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#2E7D32]" />
                                <span className="min-w-0 break-words">{event.location}</span>
                              </p>
                              <h3 className="mt-2 break-words text-[18px] font-semibold leading-7 text-[#486476]">
                                {event.title}
                              </h3>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {upcomingEvents.length > cardsPerSlide ? (
                      <div className="mt-6 flex items-center justify-center gap-2">
                        {Array.from({ length: totalSlides }, (_, index) => (
                          <button
                            key={index + 1}
                            type="button"
                            aria-label={`Go to slide ${index + 1}`}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-2.5 rounded-full transition-all ${
                              activeSlide === index
                                ? 'w-8 bg-[#2E7D32]'
                                : 'w-2.5 bg-[#D0D5DD]'
                            }`}
                          />
                        ))}
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div className="rounded-[24px] border border-dashed border-[#DDECC0] bg-[#F8FBF4] px-6 py-10 text-center shadow-[0_18px_40px_rgba(15,63,29,0.04)]">
                    <p className="text-lg font-semibold text-[#0F3F1D]">
                      No upcoming events or programs this month.
                    </p>
                    <p className="mt-2 text-sm text-[#667085]">
                      Check another month on the calendar to explore what is scheduled next.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 hidden flex-1 space-y-5 md:mt-8 md:space-y-6 xl:block">
                {upcomingEvents.length > 0 ? paginatedEvents.map((event) => {
                  const { day, month } = getEventDateParts(event.date);

                  return (
                    <Link
                      key={event.id}
                      href={addLocaleToUrl(`${EVENTS_ROUTE}/${event.slug}`, locale)}
                      className="group flex flex-col gap-5 rounded-[24px] bg-white px-5 py-5 md:flex-row md:items-center md:px-6"
                    >
                      <div className="min-w-[118px] md:pr-2">
                        <p className="text-[25px] font-bold text-[#0F3F1D] leading-none">
                          {day} {month}
                        </p>
                        <p className="mt-1 text-[18px] font-medium text-[#2E7D32]">
                          {event.time}
                        </p>
                      </div>

                      <div className="hidden w-[2px] self-stretch bg-[#2E7D32]/60 md:block" />

                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#F5F7FA] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#486476]">
                            {event.kind}
                          </span>
                        </div>

                        <p className="flex min-w-0 items-start gap-2 text-base text-[#7A8B99]">
                          <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#2E7D32]" />
                          <span className="min-w-0 break-words">{event.location}</span>
                        </p>
                        <h3 className="mt-2 break-words text-[18px] font-semibold leading-7 text-[#486476]">
                          {event.title}
                        </h3>
                      </div>

                      <span
                        aria-label={`Open ${event.title}`}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E2E8D8] text-[#0F3F1D] transition group-hover:border-[#2E7D32] group-hover:bg-[#F1F8F1]"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  );
                }) : (
                  <div className="rounded-[24px] border border-dashed border-[#DDECC0] bg-[#F8FBF4] px-6 py-10 text-center shadow-[0_18px_40px_rgba(15,63,29,0.04)]">
                    <p className="text-lg font-semibold text-[#0F3F1D]">
                      No upcoming events or programs this month.
                    </p>
                    <p className="mt-2 text-sm text-[#667085]">
                      Check another month on the calendar to explore what is scheduled next.
                    </p>
                  </div>
                )}
              </div>

              {upcomingEvents.length > 0 ? (
                <div className="mt-8 hidden flex-wrap items-center justify-center gap-3 text-sm text-[#667085] md:mt-10 xl:flex">
                  <button
                    type="button"
                    onClick={() => handleListPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 transition enabled:hover:text-[#0F3F1D] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1;

                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => handleListPageChange(page)}
                        className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                          currentPage === page
                            ? 'bg-[#2E7D32] font-semibold text-white shadow-[0_8px_20px_rgba(46,125,50,0.25)]'
                            : 'text-[#98A2B3] hover:bg-[#F1F8F1] hover:text-[#0F3F1D]'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => handleListPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 transition enabled:hover:text-[#0F3F1D] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
