'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { LocationCardData, LocationDetail } from './locationData';

gsap.registerPlugin(ScrollTrigger);

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13.832 16.568C14.0385 16.6628 14.2712 16.6845 14.4917 16.6294C14.7122 16.5744 14.9073 16.4458 15.045 16.265L15.4 15.8C15.5863 15.5516 15.8279 15.35 16.1056 15.2111C16.3833 15.0723 16.6895 15 17 15H20C20.5304 15 21.0391 15.2107 21.4142 15.5858C21.7893 15.9609 22 16.4696 22 17V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22C15.2261 22 10.6477 20.1036 7.27208 16.7279C3.89642 13.3523 2 8.7739 2 4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H7C7.53043 2 8.03914 2.21071 8.41421 2.58579C8.78929 2.96086 9 3.46957 9 4V7C9 7.31049 8.92771 7.61672 8.78885 7.89443C8.65 8.17214 8.44839 8.41371 8.2 8.6L7.732 8.951C7.54842 9.09118 7.41902 9.29059 7.36579 9.51535C7.31256 9.74012 7.33878 9.97638 7.44 10.184C8.80668 12.9599 11.0544 15.2048 13.832 16.568Z"
        stroke="rgba(46, 125, 50, 1)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NavigationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15.8 8.2L13.03 15.3C12.9969 15.3847 12.9415 15.4588 12.8698 15.5147C12.7982 15.5705 12.7129 15.606 12.6229 15.6174C12.533 15.6288 12.4416 15.6156 12.3585 15.579C12.2754 15.5424 12.2036 15.4838 12.1508 15.4097L11.0514 13.8702C11.0001 13.7982 10.9387 13.7368 10.8667 13.6855L9.32724 12.5861C9.25314 12.5332 9.19451 12.4615 9.15795 12.3784C9.1214 12.2952 9.10817 12.2039 9.11957 12.1139C9.13097 12.024 9.16658 11.9387 9.22239 11.8671C9.27821 11.7954 9.35225 11.74 9.437 11.7068L15.8 8.2Z"
        stroke="rgba(46, 125, 50, 1)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DetailRow({ item }: { item: LocationDetail }) {
  const icon = item.label === 'Postal Address' ? <NavigationIcon /> : <PhoneIcon />;

  const content = item.href ? (
    <a href={item.href} className="font-semibold text-[#2E7D32] hover:text-[#246327]">
      {item.value}
    </a>
  ) : (
    <p className="font-semibold text-[#2E7D32]">{item.value}</p>
  );

  return (
    <div className="flex items-start gap-3">
      <div
        className="mt-1 flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full border"
        style={{ borderColor: 'rgba(46, 125, 50, 1)' }}
      >
        {icon}
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
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isMapLeft = orientation === 'map-left';

  useLayoutEffect(() => {
    if (
      typeof window === 'undefined' ||
      !sectionRef.current ||
      !headingRef.current ||
      !cardRef.current
    ) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const sectionNode = sectionRef.current;
    const headingNode = headingRef.current;
    const cardNode = cardRef.current;

    const context = gsap.context(() => {
      const panes = gsap.utils.toArray<HTMLElement>('[data-location-card-pane]', cardNode);

      gsap.set(headingNode, { autoAlpha: 0, y: 24 });
      gsap.set(cardNode, { autoAlpha: 0, y: 28 });

      if (panes.length > 0) {
        gsap.set(panes, { autoAlpha: 0, y: 20 });
      }

      ScrollTrigger.create({
        trigger: sectionNode,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          const timeline = gsap.timeline({
            defaults: {
              ease: 'power3.out',
            },
          });

          timeline.to(headingNode, {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            clearProps: 'opacity,visibility,transform',
          });

          timeline.to(
            cardNode,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.76,
              clearProps: 'opacity,visibility,transform',
            },
            '-=0.38'
          );

          if (panes.length > 0) {
            timeline.to(
              panes,
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.64,
                stagger: 0.08,
                clearProps: 'opacity,visibility,transform',
              },
              '-=0.42'
            );
          }
        },
      });

      ScrollTrigger.refresh();
    }, sectionNode);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="mt-16 md:mt-20">
      <h2
        ref={headingRef}
        className="text-[34px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#0F3F1D] md:text-[48px]"
      >
        {titlePart1} <span className="bg-gradient-to-r from-[#20C997] to-[#A1DF0A] bg-clip-text text-transparent"> {titlePart2}</span>
      </h2>

      <div
        ref={cardRef}
        className="mt-10 overflow-hidden rounded-[30px] border-b border-transparent bg-white shadow-[0_24px_70px_rgba(0,0,0,0.08)] transition-colors duration-200 hover:border-[rgba(46,125,50,0.27)]"
      >
        <div className={`grid min-h-[380px] ${isMapLeft ? 'lg:grid-cols-[1.1fr_120px_1fr]' : 'lg:grid-cols-[1fr_120px_1.1fr]'}`}>
          {isMapLeft ? (
            <>
              <div data-location-card-pane className="relative min-h-[380px] overflow-hidden bg-[#DDE6DD]">
                <iframe
                  src={mapSrc}
                  title={mapTitle}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full min-h-[380px] w-full"
                  style={{ border: 0 }}
                  allowFullScreen
                />
              </div>

              <div className="relative hidden items-center justify-center overflow-hidden bg-white py-8 lg:flex">
                <span
                  className="pointer-events-none rotate-180 text-[64px] font-light tracking-[-0.04em] text-transparent [writing-mode:vertical-rl]"
                  style={{ WebkitTextStroke: '1.5px rgba(46, 125, 50, 0.75)' }}
                >
                  {sideLabel}
                </span>
              </div>

              <div data-location-card-pane className="relative flex items-center bg-white px-6 py-12 md:px-8 md:py-14 lg:px-10 lg:py-16">
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage: "url('/images/Aboutussection2rightbranch.png')",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'left bottom',
                    backgroundSize: '75% auto',
                  }}
                />
                <div className="w-full pl-4">
                  <div className="location-details-scroll max-h-[320px] space-y-6 overflow-y-auto pr-4">
                    {details.map((item) => (
                      <DetailRow key={`${item.label}-${item.value}`} item={item} />
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div data-location-card-pane className="relative flex items-center bg-white px-6 py-12 md:px-8 md:py-14 lg:px-10 lg:py-16">
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage: "url('/images/Aboutussection2rightbranch.png')",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'left bottom',
                    backgroundSize: '75% auto',
                  }}
                />
                <div className="w-full pr-4">
                  <div className="location-details-scroll max-h-[320px] space-y-6 overflow-y-auto pr-4">
                    {details.map((item) => (
                      <DetailRow key={`${item.label}-${item.value}`} item={item} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative hidden items-center justify-center overflow-hidden bg-white py-8 lg:flex">
                <span
                  className="pointer-events-none rotate-180 text-[64px] font-light tracking-[-0.04em] text-transparent [writing-mode:vertical-rl]"
                  style={{ WebkitTextStroke: '1.5px rgba(46, 125, 50, 0.75)' }}
                >
                  {sideLabel}
                </span>
              </div>

              <div data-location-card-pane className="relative min-h-[380px] overflow-hidden bg-[#DDE6DD]">
                <iframe
                  src={mapSrc}
                  title={mapTitle}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full min-h-[380px] w-full"
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
