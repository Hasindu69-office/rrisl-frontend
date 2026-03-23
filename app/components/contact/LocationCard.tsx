import type { LocationCardData, LocationDetail } from './locationData';

function DetailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.25" stroke="#74B357" strokeWidth="1.5" />
      <path
        d="M11.25 8.5H12.75V12.1L15 14"
        stroke="#74B357"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DetailRow({ item }: { item: LocationDetail }) {
  const content = item.href ? (
    <a href={item.href} className="font-semibold text-[#2E7D32] hover:text-[#246327]">
      {item.value}
    </a>
  ) : (
    <p className="font-semibold text-[#2E7D32]">{item.value}</p>
  );

  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 shrink-0">
        <DetailIcon />
      </div>
      <div>
        <p className="text-[16px] leading-6 text-[#7A8B7B]">{item.label}</p>
        <div className="mt-1 text-[16px] leading-6">{content}</div>
      </div>
    </div>
  );
}

export default function LocationCard({
  titlePart1,
  titlePart2,
  sideLabel,
  orientation = 'details-left',
  mapSrc,
  mapTitle,
  details,
}: LocationCardData) {
  const isMapLeft = orientation === 'map-left';

  return (
    <section className="mt-16 md:mt-20">
      <h2 className="text-[34px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#0F3F1D] md:text-[48px]">
        {titlePart1} <span className="text-[#57D54A]">- {titlePart2}</span>
      </h2>

      <div className="mt-10 overflow-hidden rounded-[30px] border border-[rgba(46,125,50,0.27)] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
        <div className={`grid min-h-[310px] ${isMapLeft ? 'lg:grid-cols-[1.1fr_120px_1fr]' : 'lg:grid-cols-[1fr_120px_1.1fr]'}`}>
          {isMapLeft ? (
            <>
              <div className="relative min-h-[280px] overflow-hidden bg-[#DDE6DD]">
                <iframe
                  src={mapSrc}
                  title={mapTitle}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full min-h-[280px] w-full"
                  style={{ border: 0 }}
                  allowFullScreen
                />
              </div>

              <div className="relative hidden items-center justify-center overflow-hidden bg-[#F8FBF7] lg:flex">
                <span
                  className="pointer-events-none rotate-180 text-[64px] font-light tracking-[-0.04em] text-transparent [writing-mode:vertical-rl]"
                  style={{ WebkitTextStroke: '1.5px rgba(46, 125, 50, 0.75)' }}
                >
                  {sideLabel}
                </span>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(161,223,10,0.08),_transparent_55%)]" />
              </div>

              <div className="relative flex items-center bg-white px-6 py-8 md:px-8 lg:px-10">
                <div className="w-full pl-4">
                  <div className="space-y-6">
                    {details.map((item) => (
                      <DetailRow key={`${item.label}-${item.value}`} item={item} />
                    ))}
                  </div>
                </div>
                <div className="absolute right-6 top-1/2 hidden h-[68%] w-[5px] -translate-y-1/2 rounded-full bg-[rgba(46,125,50,0.27)] lg:block" />
              </div>
            </>
          ) : (
            <>
              <div className="relative flex items-center bg-white px-6 py-8 md:px-8 lg:px-10">
                <div className="w-full pr-4">
                  <div className="space-y-6">
                    {details.map((item) => (
                      <DetailRow key={`${item.label}-${item.value}`} item={item} />
                    ))}
                  </div>
                </div>
                <div className="absolute right-6 top-1/2 hidden h-[68%] w-[5px] -translate-y-1/2 rounded-full bg-[rgba(46,125,50,0.27)] lg:block" />
              </div>

              <div className="relative hidden items-center justify-center overflow-hidden bg-[#F8FBF7] lg:flex">
                <span
                  className="pointer-events-none text-[64px] font-light tracking-[-0.04em] text-transparent [writing-mode:vertical-rl]"
                  style={{ WebkitTextStroke: '1.5px rgba(46, 125, 50, 0.75)' }}
                >
                  {sideLabel}
                </span>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(161,223,10,0.08),_transparent_55%)]" />
              </div>

              <div className="relative min-h-[280px] overflow-hidden bg-[#DDE6DD]">
                <iframe
                  src={mapSrc}
                  title={mapTitle}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full min-h-[280px] w-full"
                  style={{ border: 0 }}
                  allowFullScreen
                />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
