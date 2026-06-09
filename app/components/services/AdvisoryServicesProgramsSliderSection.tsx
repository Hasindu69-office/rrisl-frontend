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

type AdvisoryTrainingCategoryId = 'centralized' | 'decentralized';

interface AdvisoryTrainingCard {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

interface AdvisoryTrainingCategory {
  id: AdvisoryTrainingCategoryId;
  label: string;
  cards: AdvisoryTrainingCard[];
}

type ResponsiveMode = 'desktop' | 'tablet' | 'mobile';

const AUTOPLAY_DELAY_MS = 4200;
const MOTION_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const ADVISORY_TRAINING_CATEGORIES: AdvisoryTrainingCategory[] = [
  {
    id: 'centralized',
    label: 'Centralized farmer Training programs',
    cards: [
      {
        id: 'centralized-plantation',
        title: 'Rubber Plantation Training',
        description:
          'Advance training on rubber cultivation and plantation management for medium scale rubber growers.',
        imageSrc: '/images/farmerright.png',
        imageAlt: 'Trainer working with rubber nursery plants',
      },
      {
        id: 'centralized-processing',
        title: 'Rubber Processing Training',
        description:
          'Advance training on rubber cultivation and processing for rubber growers in non traditional areas.',
        imageSrc: '/images/services/advisoryservices/advisoryservicessection1img.webp',
        imageAlt: 'Advisor in a rubber plantation for training support',
      },
      {
        id: 'centralized-bud-grafting',
        title: 'Bud Grafting Training',
        description:
          'Nursery management and bud grafting training for selected nursery owners and bud grafters.',
        imageSrc: '/images/farmerleft.png',
        imageAlt: 'Rubber nursery plants prepared for training',
      },
    ],
  },
  {
    id: 'decentralized',
    label: 'Decentralized Training Programs',
    cards: [
      {
        id: 'decentralized-field-clinic',
        title: 'Field Advisory Clinics',
        description:
          'On-site guidance sessions for smallholders to improve adoption of recommended rubber cultivation practices.',
        imageSrc: '/images/services/advisoryservices/advisoryservicessection1img.webp',
        imageAlt: 'Advisor standing in a plantation during a field clinic',
      },
      {
        id: 'decentralized-plantation-guidance',
        title: 'On-site Plantation Guidance',
        description:
          'Hands-on plantation management support for growers who need practical recommendations in their own fields.',
        imageSrc: '/images/farmerright.png',
        imageAlt: 'Hands-on training activity among rubber plants',
      },
      {
        id: 'decentralized-processing-demo',
        title: 'Processing Demonstrations',
        description:
          'Community-level demonstrations focused on better rubber processing practices and post-harvest improvement.',
        imageSrc: '/images/farmerleft.png',
        imageAlt: 'Rubber nursery stock used during demonstration activities',
      },
    ],
  },
];

function AdvisoryProgramCard({ card }: { card: AdvisoryTrainingCard }) {
  return (
    <article className="relative h-full overflow-hidden rounded-[24px] bg-white shadow-[0_18px_46px_rgba(15,63,29,0.06)]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(250,252,248,0.98)_100%)]" />

      <div className="absolute inset-0 opacity-70 [background:repeating-conic-gradient(from_0deg_at_18%_50%,rgba(15,63,29,0.035)_0deg,rgba(15,63,29,0)_15deg,rgba(15,63,29,0.02)_24deg,rgba(15,63,29,0)_38deg)]" />

      <div className="relative z-10 flex h-full items-center gap-5 py-5 pl-8 pr-5 md:gap-6 md:pl-10 md:pr-5 lg:gap-7 lg:py-5 lg:pl-12 lg:pr-5">
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <h3 className="max-w-[270px] text-[18px] font-medium leading-[1.35] text-[#237B2D] md:text-[19px] lg:text-[21px]">
            {card.title}
          </h3>

          <p className="mt-7 max-w-[300px] text-[13px] font-normal leading-[1.85] text-[#1E281E] md:text-[14px] lg:text-[15px]">
            {card.description}
          </p>
        </div>

        <div className="relative h-full w-[40%] min-w-[165px] overflow-hidden rounded-[14px] md:min-w-[190px] lg:min-w-[225px] xl:min-w-[245px]">
          <Image
            src={card.imageSrc}
            alt={card.imageAlt}
            fill
            draggable={false}
            className="pointer-events-none select-none object-cover"
            sizes="(max-width: 767px) 38vw, (max-width: 1279px) 200px, 250px"
          />
        </div>
      </div>
    </article>
  );
}

export default function AdvisoryServicesProgramsSliderSection() {
  const [activeCategoryId, setActiveCategoryId] =
    useState<AdvisoryTrainingCategoryId>('centralized');
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState<ResponsiveMode>('desktop');
  const [windowWidth, setWindowWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [categoryAnimationKey, setCategoryAnimationKey] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
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

  const activeCategory =
    ADVISORY_TRAINING_CATEGORIES.find(
      (category) => category.id === activeCategoryId
    ) ?? ADVISORY_TRAINING_CATEGORIES[0];

  const cards = activeCategory.cards;

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1280px)');
    const tabletQuery = window.matchMedia(
      '(min-width: 768px) and (max-width: 1279px)'
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
      const leftCircle = circleRefs.current.centralized;
      const rightCircle = circleRefs.current.decentralized;

      if (!container || !leftCircle || !rightCircle) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const leftCircleRect = leftCircle.getBoundingClientRect();
      const rightCircleRect = rightCircle.getBoundingClientRect();

      const leftCircleCenter =
        leftCircleRect.left - containerRect.left + leftCircleRect.width / 2;

      const rightCircleCenter =
        rightCircleRect.left - containerRect.left + rightCircleRect.width / 2;

      setLineStyle({
        left: leftCircleCenter,
        width: rightCircleCenter - leftCircleCenter,
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
  }, [windowWidth, mode]);

  useEffect(() => {
    const node = viewportRef.current;

    if (!node) {
      return;
    }

    const updateWidth = () => {
      setViewportWidth(node.clientWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(node);

    return () => observer.disconnect();
  }, [mode]);

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

  const gap = mode === 'mobile' ? 16 : mode === 'tablet' ? 20 : 42;

  const cardWidth =
    mode === 'desktop'
      ? Math.min(740, Math.max(620, (windowWidth + 310 - gap * 2) / 3))
      : mode === 'tablet'
        ? Math.min(390, Math.max(320, (windowWidth - 72 - gap * 2) / 3))
        : Math.min(360, Math.max(286, viewportWidth - 28));

  const visibleCount = mode === 'mobile' ? 1 : 3;

  const viewportMaxWidth =
    mode === 'desktop'
      ? '100vw'
      : visibleCount === 1
        ? `${cardWidth}px`
        : `${cardWidth * 3 + gap * 2}px`;

  const trackCards = [...cards, ...cards, ...cards];
  const baseIndex = cards.length + activeIndex;
  const step = cardWidth + gap;

  const desktopCenterOffset =
    mode === 'desktop'
      ? (windowWidth - (cardWidth * 3 + gap * 2)) / 2
      : 0;

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
    startTransition(() => {
      setActiveIndex((current) => (current + 1) % cards.length);
    });
  };

  const movePrevious = () => {
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
      className="relative overflow-hidden bg-[#F3FBDF] px-4 py-14 select-none md:px-6 md:py-18 lg:px-10 lg:py-20 xl:px-0"
      aria-labelledby={`${tabListId}-centralized`}
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
          <div
            ref={tabContainerRef}
            className="relative mx-auto flex w-full max-w-[1080px] items-start justify-between gap-10 pb-12 md:pb-14 lg:pb-16"
            role="tablist"
            aria-label="Advisory services program categories"
            style={headerMotionStyle}
          >
            <div
              className="absolute top-[15px] z-0 h-[2px] bg-[#237B2D]"
              style={{
                left: `${lineStyle.left}px`,
                width: `${lineStyle.width}px`,
                ...lineMotionStyle,
              }}
            />

            {ADVISORY_TRAINING_CATEGORIES.map((category) => {
              const isActive = category.id === activeCategoryId;
              const categoryIndex = ADVISORY_TRAINING_CATEGORIES.findIndex(
                ({ id }) => id === category.id
              );

              return (
                <button
                  key={category.id}
                  id={`${tabListId}-${category.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`${tabListId}-${category.id}-panel`}
                  onClick={() => handleCategoryChange(category.id)}
                  className="relative z-10 flex max-w-[470px] flex-1 flex-col items-center text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#237B2D] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F3FBDF]"
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
                    className={`relative z-10 h-[32px] w-[32px] rounded-full border-[3px] transition-colors duration-300 ${
                      isActive
                        ? 'border-[#237B2D] bg-[#A1DF0A]'
                        : 'border-[#A1DF0A] bg-[#A1DF0A]'
                    }`}
                    aria-hidden="true"
                  />

                  <span
                    className={`mt-8 text-[17px] font-medium leading-[1.28] transition-colors duration-300 md:text-[19px] lg:text-[21px] xl:text-[22px] ${
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

        <div
          id={`${tabListId}-${activeCategoryId}-panel`}
          role="tabpanel"
          aria-labelledby={`${tabListId}-${activeCategoryId}`}
          className="mt-0"
        >
          <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
            <div
              ref={viewportRef}
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
