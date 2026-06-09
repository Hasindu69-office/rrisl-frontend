'use client';

import Image from 'next/image';
import {
  startTransition,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  ADVISORY_TRAINING_CATEGORIES,
  type AdvisoryTrainingCard,
  type AdvisoryTrainingCategory,
  type AdvisoryTrainingCategoryId,
} from './AdvisoryServicesProgramsSliderSection.data';

type ResponsiveMode = 'desktop' | 'tablet' | 'mobile';

const AUTOPLAY_DELAY_MS = 4200;
const MOTION_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

function AdvisoryProgramCard({ card }: { card: AdvisoryTrainingCard }) {
  return (
    <article className="relative h-full overflow-hidden rounded-[24px] bg-white shadow-[0_18px_46px_rgba(15,63,29,0.06)]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(250,252,248,0.98)_100%)]" />

      <div className="absolute inset-0 opacity-70 [background:repeating-conic-gradient(from_0deg_at_18%_50%,rgba(15,63,29,0.035)_0deg,rgba(15,63,29,0)_15deg,rgba(15,63,29,0.02)_24deg,rgba(15,63,29,0)_38deg)]" />

      <div className="relative z-10 flex h-full flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:py-5 sm:pl-8 sm:pr-5 md:gap-6 md:pl-10 md:pr-5 lg:gap-7 lg:py-5 lg:pl-12 lg:pr-5">
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <h3 className="max-w-[270px] text-[17px] font-medium leading-[1.35] text-[#237B2D] sm:text-[18px] md:text-[19px] lg:text-[21px]">
            {card.title}
          </h3>

          <p className="mt-4 max-w-[300px] text-[13px] font-normal leading-[1.75] text-[#1E281E] sm:mt-7 sm:leading-[1.85] md:text-[14px] lg:text-[15px]">
            {card.description}
          </p>
        </div>

        <div className="relative h-[156px] w-full overflow-hidden rounded-[14px] sm:h-full sm:w-[40%] sm:min-w-[165px] md:min-w-[190px] lg:min-w-[225px] xl:min-w-[245px]">
          <Image
            src={card.imageSrc}
            alt={card.imageAlt}
            fill
            draggable={false}
            className="pointer-events-none select-none object-cover"
            sizes="(max-width: 639px) 100vw, (max-width: 767px) 38vw, (max-width: 1279px) 240px, 250px"
          />
        </div>
      </div>
    </article>
  );
}

export default function AdvisoryServicesProgramsSliderSectionClient({
  categories,
}: {
  categories: AdvisoryTrainingCategory[];
}) {
  const initialCategoryId = categories[0]?.id ?? '';
  const [activeCategoryId, setActiveCategoryId] =
    useState<AdvisoryTrainingCategoryId>(initialCategoryId);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState<ResponsiveMode>('desktop');
  const [windowWidth, setWindowWidth] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [categoryAnimationKey, setCategoryAnimationKey] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const dragStartXRef = useRef<number | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const tabContainerRef = useRef<HTMLDivElement | null>(null);
  const hasMountedCategoryRef = useRef(false);

  const circleRefs = useRef<
    Partial<Record<AdvisoryTrainingCategoryId, HTMLSpanElement | null>>
  >({});

  const [lineStyle, setLineStyle] = useState({
    left: 0,
    width: 0,
  });

  const tabListId = useId();

  const activeCategory = categories.find(
    (category) => category.id === activeCategoryId,
  );

  const cards = activeCategory?.cards ?? [];

  useEffect(() => {
    if (categories.length === 0) {
      if (activeCategoryId !== '') {
        setActiveCategoryId('');
      }

      return;
    }

    if (categories.some((category) => category.id === activeCategoryId)) {
      return;
    }

    setActiveCategoryId(categories[0].id);
  }, [activeCategoryId, categories]);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1280px)');
    const tabletQuery = window.matchMedia(
      '(min-width: 768px) and (max-width: 1279px)',
    );
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncMode = () => {
      if (desktopQuery.matches) {
        setMode('desktop');
        return;
      }

      if (tabletQuery.matches) {
        setMode('tablet');
        return;
      }

      setMode('mobile');
    };

    const syncWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    const syncMotion = (event?: MediaQueryListEvent) => {
      setPrefersReducedMotion(event ? event.matches : motionQuery.matches);
    };

    syncMode();
    syncWindowWidth();
    syncMotion();

    desktopQuery.addEventListener('change', syncMode);
    tabletQuery.addEventListener('change', syncMode);
    motionQuery.addEventListener('change', syncMotion);
    window.addEventListener('resize', syncWindowWidth);

    return () => {
      desktopQuery.removeEventListener('change', syncMode);
      tabletQuery.removeEventListener('change', syncMode);
      motionQuery.removeEventListener('change', syncMotion);
      window.removeEventListener('resize', syncWindowWidth);
    };
  }, []);

  useEffect(() => {
    const node = sectionRef.current;

    if (!node || prefersReducedMotion) {
      setHasEnteredView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          setHasEnteredView(true);
          observer.disconnect();
        });
      },
      {
        threshold: 0.28,
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  useLayoutEffect(() => {
    const updateLinePosition = () => {
      const container = tabContainerRef.current;
      const firstCategoryId = categories[0]?.id;
      const lastCategoryId = categories.at(-1)?.id;
      const firstCircle = firstCategoryId
        ? circleRefs.current[firstCategoryId]
        : null;
      const lastCircle = lastCategoryId
        ? circleRefs.current[lastCategoryId]
        : null;

      if (!container || !firstCircle || !lastCircle) {
        setLineStyle({
          left: 0,
          width: 0,
        });
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const firstCircleRect = firstCircle.getBoundingClientRect();
      const lastCircleRect = lastCircle.getBoundingClientRect();

      const firstCircleCenter =
        firstCircleRect.left - containerRect.left + firstCircleRect.width / 2;

      const lastCircleCenter =
        lastCircleRect.left - containerRect.left + lastCircleRect.width / 2;

      setLineStyle({
        left: firstCircleCenter,
        width: Math.max(0, lastCircleCenter - firstCircleCenter),
      });
    };

    updateLinePosition();

    const observer = new ResizeObserver(updateLinePosition);

    if (tabContainerRef.current) {
      observer.observe(tabContainerRef.current);
    }

    window.addEventListener('resize', updateLinePosition);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateLinePosition);
    };
  }, [categories, windowWidth, mode]);

  useEffect(() => {
    setActiveIndex(0);
    setDragOffset(0);
    setIsDragging(false);
    dragStartXRef.current = null;
    pointerIdRef.current = null;
  }, [activeCategoryId]);

  useEffect(() => {
    if (!hasMountedCategoryRef.current) {
      hasMountedCategoryRef.current = true;
      return;
    }

    setCategoryAnimationKey((current) => current + 1);
  }, [activeCategoryId]);

  useEffect(() => {
    if (cards.length <= 1 || prefersReducedMotion || isDragging) {
      return;
    }

    const interval = window.setInterval(() => {
      startTransition(() => {
        setActiveIndex((current) => (current + 1) % cards.length);
      });
    }, AUTOPLAY_DELAY_MS);

    return () => window.clearInterval(interval);
  }, [cards.length, prefersReducedMotion, isDragging, activeCategoryId]);

  const tabletVisibleCount = windowWidth >= 1024 ? 2 : 1;
  const visibleCount =
    mode === 'desktop' ? 3 : mode === 'tablet' ? tabletVisibleCount : 1;

  const gap = mode === 'mobile' ? 16 : mode === 'tablet' ? 24 : 42;

  const cardWidth =
    mode === 'desktop'
      ? Math.min(740, Math.max(620, (windowWidth + 310 - gap * 2) / 3))
      : mode === 'tablet'
        ? visibleCount === 2
          ? Math.min(500, Math.max(430, (windowWidth - 72 - gap) / 2))
          : Math.min(680, Math.max(560, windowWidth - 96))
        : Math.min(360, Math.max(286, windowWidth - 32));

  const viewportMaxWidth =
    mode === 'desktop'
      ? '100vw'
      : visibleCount === 1
        ? `${cardWidth}px`
        : `${cardWidth * visibleCount + gap * (visibleCount - 1)}px`;

  const trackCards = [...cards, ...cards, ...cards];
  const baseIndex = cards.length > 0 ? cards.length + activeIndex : 0;
  const step = cardWidth + gap;

  const desktopCenterOffset =
    mode === 'desktop' ? (windowWidth - (cardWidth * 3 + gap * 2)) / 2 : 0;

  const translateX = -(baseIndex * step) + desktopCenterOffset + dragOffset;

  const transition = isDragging
    ? 'none'
    : prefersReducedMotion
      ? 'transform 0ms linear'
      : `transform 620ms ${MOTION_EASE}`;

  const headerMotionStyle = prefersReducedMotion
    ? undefined
    : {
        opacity: hasEnteredView ? 1 : 0,
        transform: hasEnteredView ? 'translateY(0)' : 'translateY(26px)',
        transition: `opacity 520ms ${MOTION_EASE}, transform 520ms ${MOTION_EASE}`,
      };

  const lineMotionStyle = prefersReducedMotion
    ? undefined
    : {
        opacity: hasEnteredView ? 1 : 0,
        transform: hasEnteredView ? 'scaleX(1)' : 'scaleX(0.84)',
        transformOrigin: 'left center',
        transition: `opacity 460ms ${MOTION_EASE} 100ms, transform 620ms ${MOTION_EASE} 100ms`,
      };

  const viewportMotionStyle = prefersReducedMotion
    ? undefined
    : {
        opacity: hasEnteredView ? 1 : 0,
        transform: hasEnteredView ? 'translateY(0)' : 'translateY(34px)',
        transition: `opacity 620ms ${MOTION_EASE} 120ms, transform 620ms ${MOTION_EASE} 120ms`,
      };

  const getVisibleCardAnimationStyle = (renderedIndex: number) => {
    if (prefersReducedMotion || !hasEnteredView) {
      return undefined;
    }

    const visibleSlot = renderedIndex - baseIndex;

    if (visibleSlot < 0 || visibleSlot >= visibleCount) {
      return undefined;
    }

    return {
      opacity: 1,
      transform: 'translateY(0)',
      animationName: 'advisory-card-rise-in',
      animationDuration: '620ms',
      animationTimingFunction: MOTION_EASE,
      animationDelay: `${visibleSlot * 80}ms`,
      animationFillMode: 'both',
    } as const;
  };

  const moveNext = () => {
    if (cards.length === 0) {
      return;
    }

    startTransition(() => {
      setActiveIndex((current) => (current + 1) % cards.length);
    });
  };

  const movePrevious = () => {
    if (cards.length === 0) {
      return;
    }

    startTransition(() => {
      setActiveIndex((current) => (current - 1 + cards.length) % cards.length);
    });
  };

  const handleCategoryChange = (categoryId: AdvisoryTrainingCategoryId) => {
    if (categoryId === activeCategoryId) {
      return;
    }

    startTransition(() => {
      setActiveCategoryId(categoryId);
    });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (cards.length <= 1) {
      return;
    }

    event.preventDefault();

    dragStartXRef.current = event.clientX;
    pointerIdRef.current = event.pointerId;
    setIsDragging(true);
    setDragOffset(0);

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || dragStartXRef.current === null) {
      return;
    }

    event.preventDefault();
    setDragOffset(event.clientX - dragStartXRef.current);
  };

  const completeDrag = () => {
    if (!isDragging) {
      return;
    }

    const threshold = Math.max(42, cardWidth * 0.14);
    const nextOffset = dragOffset;

    setIsDragging(false);
    setDragOffset(0);
    dragStartXRef.current = null;
    pointerIdRef.current = null;

    if (nextOffset <= -threshold) {
      moveNext();
      return;
    }

    if (nextOffset >= threshold) {
      movePrevious();
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      pointerIdRef.current !== null &&
      event.currentTarget.hasPointerCapture(pointerIdRef.current)
    ) {
      event.currentTarget.releasePointerCapture(pointerIdRef.current);
    }

    completeDrag();
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      pointerIdRef.current !== null &&
      event.currentTarget.hasPointerCapture(pointerIdRef.current)
    ) {
      event.currentTarget.releasePointerCapture(pointerIdRef.current);
    }

    setIsDragging(false);
    setDragOffset(0);
    dragStartXRef.current = null;
    pointerIdRef.current = null;
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#F3FBDF] px-4 pb-56 pt-12 select-none md:px-6 md:pb-64 md:pt-16 lg:px-10 lg:pb-72 lg:pt-20 xl:px-0 xl:pb-[22rem]"
      aria-labelledby={
        activeCategoryId ? `${tabListId}-${activeCategoryId}` : undefined
      }
    >
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/images/services/advisoryservices/section2backgroundservices.png"
          alt=""
          fill
          draggable={false}
          className="select-none object-cover object-center opacity-40"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.58)_0%,rgba(243,251,223,0.78)_38%,rgba(243,251,223,0.94)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1600px]">
        <div className="mx-auto max-w-[1180px]">
          {categories.length > 0 ? (
            <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-auto md:overflow-visible md:px-0">
              <div
                ref={tabContainerRef}
                className="relative mx-auto flex w-max min-w-[640px] items-start justify-between gap-6 pb-10 sm:min-w-[700px] md:w-full md:min-w-0 md:max-w-[1080px] md:gap-8 md:pb-14 lg:gap-10 lg:pb-16"
                role="tablist"
                aria-label="Advisory services program categories"
                style={headerMotionStyle}
              >
                <div
                  className="absolute top-[13px] z-0 h-[2px] bg-[#237B2D] md:top-[15px]"
                  style={{
                    left: `${lineStyle.left}px`,
                    width: `${lineStyle.width}px`,
                    ...lineMotionStyle,
                  }}
                />

                {categories.map((category, categoryIndex) => {
                  const isActive = category.id === activeCategoryId;

                  return (
                    <button
                      key={category.id}
                      id={`${tabListId}-${category.id}`}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`${tabListId}-${category.id}-panel`}
                      onClick={() => handleCategoryChange(category.id)}
                      className="relative z-10 flex w-[190px] shrink-0 cursor-pointer flex-col items-center text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#237B2D] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F3FBDF] sm:w-[210px] md:w-auto md:max-w-[470px] md:flex-1"
                      style={
                        prefersReducedMotion
                          ? undefined
                          : {
                              opacity: hasEnteredView ? 1 : 0,
                              transform: hasEnteredView
                                ? 'translateY(0)'
                                : 'translateY(18px)',
                              transition: `opacity 440ms ${MOTION_EASE} ${
                                categoryIndex * 70
                              }ms, transform 440ms ${MOTION_EASE} ${categoryIndex * 70}ms`,
                            }
                      }
                    >
                      <span
                        ref={(node) => {
                          circleRefs.current[category.id] = node;
                        }}
                        className={`relative z-10 h-[28px] w-[28px] rounded-full border-[3px] transition-colors duration-300 md:h-[32px] md:w-[32px] ${
                          isActive
                            ? 'border-[#237B2D] bg-[#A1DF0A]'
                            : 'border-[#A1DF0A] bg-[#A1DF0A]'
                        }`}
                        aria-hidden="true"
                      />

                      <span
                        className={`mt-5 text-[14px] font-medium leading-[1.28] transition-colors duration-300 sm:text-[15px] md:mt-8 md:text-[19px] lg:text-[21px] xl:text-[22px] ${
                          isActive ? 'text-[#237B2D]' : 'text-[#050505]'
                        }`}
                      >
                        {category.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        <div
          id={activeCategoryId ? `${tabListId}-${activeCategoryId}-panel` : undefined}
          role="tabpanel"
          aria-labelledby={
            activeCategoryId ? `${tabListId}-${activeCategoryId}` : undefined
          }
          className="mt-0"
        >
          <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
            <div
              className={`mx-auto overflow-hidden touch-pan-y ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              onDragStart={(event) => event.preventDefault()}
              style={{
                maxWidth: viewportMaxWidth,
                userSelect: 'none',
                WebkitUserSelect: 'none',
                ...viewportMotionStyle,
              }}
            >
              <div
                className="flex items-stretch"
                style={{
                  gap: `${gap}px`,
                  transform: `translateX(${translateX}px)`,
                  transition,
                  willChange: 'transform',
                }}
              >
                {trackCards.map((card, index) => (
                  <div
                    key={`${activeCategoryId}-${card.id}-${index}-${categoryAnimationKey}`}
                    className="shrink-0"
                    style={{
                      width: `${cardWidth}px`,
                      minHeight:
                        mode === 'desktop'
                          ? '350px'
                          : mode === 'tablet'
                            ? '310px'
                            : '285px',
                      ...getVisibleCardAnimationStyle(index),
                    }}
                  >
                    <AdvisoryProgramCard card={card} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {cards.length > 0 ? (
            <div className="mt-8 flex items-center justify-center gap-3">
              {cards.map((card, index) => (
                <button
                  key={`${activeCategoryId}-${card.id}-dot`}
                  type="button"
                  onClick={() => startTransition(() => setActiveIndex(index))}
                  aria-label={`Show ${card.title}`}
                  aria-pressed={index === activeIndex}
                  className="rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#237B2D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3FBDF]"
                  style={{
                    width: index === activeIndex ? '38px' : '11px',
                    height: '11px',
                    backgroundColor:
                      index === activeIndex
                        ? '#237B2D'
                        : 'rgba(46, 125, 50, 0.26)',
                  }}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <style jsx>{`
        @keyframes advisory-card-rise-in {
          from {
            opacity: 0;
            transform: translateY(24px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
