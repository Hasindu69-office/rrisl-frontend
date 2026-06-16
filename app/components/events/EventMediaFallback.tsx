import { CalendarDays, GraduationCap, MapPin } from 'lucide-react';
import type { EventItem } from '@/app/lib/events/pageData';

interface EventMediaFallbackProps {
  event: Pick<EventItem, 'title' | 'kind' | 'location'>;
  compact?: boolean;
  textMode?: 'full' | 'icon-only';
  className?: string;
}

export default function EventMediaFallback({
  event,
  compact = false,
  textMode = 'full',
  className = '',
}: EventMediaFallbackProps) {
  const Icon = event.kind === 'Program' ? GraduationCap : CalendarDays;
  const showText = textMode === 'full';
  const containerPaddingClass = compact ? 'p-3' : 'p-5 md:p-7';
  const iconWrapperClass = compact
    ? 'h-9 w-9 rounded-xl'
    : 'h-12 w-12 rounded-2xl';
  const iconClass = compact ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <div
      className={[
        'relative flex h-full w-full overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(161,223,10,0.35),_transparent_42%),linear-gradient(160deg,#123F1D_0%,#0B2C15_52%,#07190D_100%)] text-white',
        compact ? 'min-h-[180px]' : 'min-h-[280px]',
        className,
      ].join(' ')}
    >
      <div className="pointer-events-none absolute -left-10 top-6 h-36 w-36 rounded-full bg-[#A1DF0A]/18 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-4 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className={`relative flex h-full w-full flex-col justify-between ${containerPaddingClass}`}>
        <div className="flex items-start justify-end">
          <div
            className={`inline-flex items-center justify-center border border-white/12 bg-white/10 text-[#D7F59F] shadow-[0_12px_28px_rgba(0,0,0,0.16)] ${iconWrapperClass}`}
          >
            <Icon className={iconClass} />
          </div>
        </div>

        {showText ? (
          <div className="max-w-[28rem]">
            <h3 className={`font-semibold leading-tight ${compact ? 'text-lg' : 'text-2xl md:text-3xl'}`}>
              {event.title}
            </h3>
            <p className={`mt-3 flex items-start gap-2 text-white/78 ${compact ? 'text-sm' : 'text-base'}`}>
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#A1DF0A]" />
              <span>{event.location}</span>
            </p>
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
