'use client';

import { ArrowRight } from 'lucide-react';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { createPortal } from 'react-dom';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';
import type {
  DepartmentRecommendationBriefItem,
  DepartmentRecommendationGroupView,
  DepartmentRecommendationsContent,
} from '@/app/lib/departments/recommendationsData';
import styles from './DepartmentRecommendationsSection.module.css';

interface DepartmentRecommendationsSectionProps {
  content: DepartmentRecommendationsContent;
  containerClassName?: string;
}

interface ConnectorGeometry {
  itemId: string;
  pointX: number;
  pointY: number;
  bendX: number;
  endX: number;
  endY: number;
}

interface CardCurveOffset {
  itemId: string;
  offsetX: number;
}

interface CurveGeometry {
  arc: { left: number; top: number; width: number; height: number };
  connectors: ConnectorGeometry[];
  cardOffsets: CardCurveOffset[];
}

// Coordinates are measured in the 1774 × 887 background image.
const BACKGROUND_WIDTH = 1774;
const BACKGROUND_HEIGHT = 887;
const ARC_ARTWORK = { x: 600, y: 262, width: 180, height: 530 };
const HOVER_CLOSE_DELAY_MS = 220;
const POPOVER_ESTIMATED_HEIGHT = 160;
const VISIBLE_CAPACITY = 5;
const VIEWPORT_EDGE_MARGIN = 10;
const DOT_OFFSET_START = 42;
const DOT_OFFSET_END = -18;
const SCROLL_STEP_VIEWPORT_RATIO = 0.55;
const DESKTOP_TIMELINE_QUERY = '(min-width: 1101px)';
const NARROW_POPOVER_QUERY = '(max-width: 850px)';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => (
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  ));

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', update);
      return () => media.removeEventListener('change', update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, [query]);

  return matches;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getDotOffset(index: number, count: number): number {
  if (count <= 1) {
    return 0;
  }

  return DOT_OFFSET_START + (DOT_OFFSET_END - DOT_OFFSET_START) * (index / (count - 1));
}

/** Same quadratic bulge as Line 2.svg — peaks in the middle, 0 at the ends. */
function getArcCurveOffset(t: number, maxOffset: number): number {
  return maxOffset * 4 * t * (1 - t);
}

function getArcT(y: number, arcTop: number, arcHeight: number): number {
  if (arcHeight <= 0) {
    return 0.5;
  }

  return clamp((y - arcTop) / arcHeight, 0, 1);
}

function calculateCurveGeometry(
  visualRoot: HTMLElement,
  viewport: HTMLElement,
  cards: { element: HTMLDivElement; itemId: string }[]
): CurveGeometry {
  const visualRect = visualRoot.getBoundingClientRect();
  const viewportRect = viewport.getBoundingClientRect();
  const scale = Math.max(
    visualRect.width / BACKGROUND_WIDTH,
    visualRect.height / BACKGROUND_HEIGHT
  );
  const imageLeft = (visualRect.width - BACKGROUND_WIDTH * scale) / 2;
  const imageTop = (visualRect.height - BACKGROUND_HEIGHT * scale) / 2;
  const arc = {
    left: visualRect.left + imageLeft + ARC_ARTWORK.x * scale - viewportRect.left,
    top: visualRect.top + imageTop + ARC_ARTWORK.y * scale - viewportRect.top,
    width: ARC_ARTWORK.width * scale,
    height: ARC_ARTWORK.height * scale,
  };
  const cardCurveMax = clamp(arc.width * 0.28, 18, 36);

  // Pass 1: place cards on a parallel curve (top/bottom closer in, middle further out).
  const cardOffsets = cards.map((card) => {
    const rowRect =
      card.element.querySelector('[data-recommendation-row]')?.getBoundingClientRect()
      || card.element.getBoundingClientRect();
    const cardCenterY = rowRect.top + rowRect.height / 2 - viewportRect.top;
    const t = getArcT(cardCenterY, arc.top, arc.height);
    const offsetX = getArcCurveOffset(t, cardCurveMax);
    card.element.style.transform = `translateX(${offsetX}px)`;

    return { itemId: card.itemId, offsetX };
  });

  // Pass 2: connectors from arc dots to the curved card positions.
  const visibleCards = cards
    .map((card) => {
      const cardRect = card.element.getBoundingClientRect();
      const rowRect =
        card.element.querySelector('[data-recommendation-row]')?.getBoundingClientRect() || cardRect;
      const cardCenterY = rowRect.top + rowRect.height / 2;

      if (
        cardCenterY < viewportRect.top - VIEWPORT_EDGE_MARGIN
        || cardCenterY > viewportRect.bottom + VIEWPORT_EDGE_MARGIN
      ) {
        return null;
      }

      return {
        itemId: card.itemId,
        cardLeft: cardRect.left - viewportRect.left,
        cardCenterY: cardCenterY - viewportRect.top,
      };
    })
    .filter((card): card is NonNullable<typeof card> => Boolean(card));

  const connectors = visibleCards.map((card, index) => {
    const requestedY = card.cardCenterY + getDotOffset(index, visibleCards.length) * scale;
    // Line 2.svg is a filled arc in viewBox 77.75 × 232; outer edge peaks at mid-height.
    const t = clamp((requestedY - arc.top) / arc.height, 0, 1);
    const pointX = arc.left + 4 * t * (1 - t) * arc.width;
    const pointY = arc.top + t * arc.height;
    const endX = card.cardLeft + 4;
    const span = Math.max(endX - pointX, 0);

    return {
      itemId: card.itemId,
      pointX,
      pointY,
      bendX: pointX + Math.max(18, span * 0.42),
      endX,
      endY: card.cardCenterY,
    };
  });

  return { arc, connectors, cardOffsets };
}

function RecommendationCard({
  item,
  index,
  groupId,
  isOpen,
  isPinned,
  onHoverOpen,
  onHoverClose,
  onTogglePin,
  onDismiss,
}: {
  item: DepartmentRecommendationBriefItem;
  index: number;
  groupId: string;
  isOpen: boolean;
  isPinned: boolean;
  onHoverOpen: () => void;
  onHoverClose: () => void;
  onTogglePin: () => void;
  onDismiss: () => void;
}) {
  const hasDescription = Boolean(item.description);
  const detailsId = `recommendation-details-${groupId}-${item.id}`;
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    if (!isOpen || !anchorRef.current) {
      setPopoverPosition(null);
      return;
    }

    const updatePosition = () => {
      if (!anchorRef.current) {
        return;
      }

      const anchorRect = anchorRef.current.getBoundingClientRect();
      const popoverWidth = Math.min(320, window.innerWidth - 24);
      const popoverHeight = POPOVER_ESTIMATED_HEIGHT;
      const gap = 12;
      const preferBelow = window.matchMedia(NARROW_POPOVER_QUERY).matches;

      let left: number;
      let top: number;

      if (preferBelow) {
        // Mobile: open under the arrow for reliable tap + reading space.
        left = clamp(anchorRect.right - popoverWidth, 12, window.innerWidth - popoverWidth - 12);
        top = anchorRect.bottom + gap;
        if (top + popoverHeight > window.innerHeight - 12) {
          top = Math.max(12, anchorRect.top - popoverHeight - gap);
        }
      } else {
        // Desktop/tablet: prefer the right side; fall back below if clipped.
        left = anchorRect.right + gap;
        top = anchorRect.top + anchorRect.height / 2 - popoverHeight / 2;

        if (left + popoverWidth > window.innerWidth - 12) {
          left = clamp(anchorRect.right - popoverWidth, 12, window.innerWidth - popoverWidth - 12);
          top = anchorRect.bottom + gap;
          if (top + popoverHeight > window.innerHeight - 12) {
            top = Math.max(12, anchorRect.top - popoverHeight - gap);
          }
        } else {
          top = clamp(top, 12, window.innerHeight - popoverHeight - 12);
        }
      }

      setPopoverPosition({ top, left });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen]);

  const number = index + 1;
  const isEvenNumber = number % 2 === 0;
  const numberBadgeClassName = [
    styles.numberBadge,
    isEvenNumber ? styles.numberBadgeEven : styles.numberBadgeOdd,
  ].join(' ');

  if (!hasDescription) {
    return (
      <article data-department-reveal className={styles.card}>
        <div className={styles.cardMain} data-recommendation-row>
          <div className={numberBadgeClassName} aria-hidden="true">
            {String(number).padStart(2, '0')}
          </div>
          <div className={styles.imagePlaceholder} aria-hidden="true">
            <span className={styles.placeholderLeaf} />
          </div>
          <span className={styles.titleRule} aria-hidden="true" />
          <h4 className={styles.cardTitle}>{item.title}</h4>
        </div>
      </article>
    );
  }

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget;

    if (next instanceof Node && event.currentTarget.contains(next)) {
      return;
    }

    if (!isPinned) {
      onDismiss();
    }
  };

  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onTogglePin();
  };

  return (
    <article
      data-department-reveal
      className={`${styles.card} ${isOpen ? styles.cardActive : ''}`}
    >
      <div className={styles.cardMain} data-recommendation-row>
        <div className={numberBadgeClassName} aria-hidden="true">
          {String(number).padStart(2, '0')}
        </div>
        <div className={styles.imagePlaceholder} aria-hidden="true">
          <span className={styles.placeholderLeaf} />
        </div>
        <span className={styles.titleRule} aria-hidden="true" />
        <h4 className={styles.cardTitle}>{item.title}</h4>
        <div
          ref={anchorRef}
          className={styles.detailsAnchor}
          data-recommendation-details-anchor
          onMouseEnter={onHoverOpen}
          onMouseLeave={onHoverClose}
          onFocus={onHoverOpen}
          onBlur={handleBlur}
        >
          <button
            type="button"
            className={`${styles.detailsButton} ${isOpen ? styles.detailsButtonActive : ''}`}
            onClick={handleClick}
            aria-expanded={isOpen}
            aria-controls={detailsId}
            aria-label={`${isOpen ? 'Hide' : 'View'} details for ${item.title}`}
          >
            <ArrowRight aria-hidden="true" size={22} strokeWidth={2.4} />
          </button>
          {isOpen && popoverPosition && typeof document !== 'undefined'
            ? createPortal(
                <div
                  id={detailsId}
                  role="region"
                  aria-label={`Details for ${item.title}`}
                  className={`${styles.popover} ${styles.popoverOpen}`}
                  data-recommendation-details-anchor
                  style={{
                    top: popoverPosition.top,
                    left: popoverPosition.left,
                  }}
                  onMouseEnter={onHoverOpen}
                  onMouseLeave={onHoverClose}
                >
                  <p>{item.description}</p>
                </div>,
                document.body
              )
            : null}
        </div>
      </div>
    </article>
  );
}

function RecommendationGroup({
  group,
  decorated,
  isPinScroll,
  isDesktopTimeline,
  stackTranslateY,
  isScrolledToStart,
  isScrolledToEnd,
  onCardStepMeasured,
}: {
  group: DepartmentRecommendationGroupView;
  decorated: boolean;
  isPinScroll: boolean;
  isDesktopTimeline: boolean;
  stackTranslateY: number;
  isScrolledToStart: boolean;
  isScrolledToEnd: boolean;
  onCardStepMeasured?: (step: number) => void;
}) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const stackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hoverCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pinnedItemIdRef = useRef<string | null>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const lastTranslateRef = useRef(stackTranslateY);
  const [geometry, setGeometry] = useState<CurveGeometry | null>(null);
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [pinnedItemId, setPinnedItemId] = useState<string | null>(null);

  const clearHoverCloseTimeout = () => {
    if (hoverCloseTimeoutRef.current) {
      clearTimeout(hoverCloseTimeoutRef.current);
      hoverCloseTimeoutRef.current = null;
    }
  };

  const setPinned = (itemId: string | null) => {
    pinnedItemIdRef.current = itemId;
    setPinnedItemId(itemId);
  };

  const dismissOpenPopover = () => {
    clearHoverCloseTimeout();
    setPinned(null);
    setOpenItemId(null);
  };

  const openItem = (itemId: string) => {
    clearHoverCloseTimeout();

    if (pinnedItemIdRef.current && pinnedItemIdRef.current !== itemId) {
      setPinned(null);
    }

    setOpenItemId(itemId);
  };

  const scheduleHoverClose = (itemId: string) => {
    clearHoverCloseTimeout();
    hoverCloseTimeoutRef.current = setTimeout(() => {
      if (pinnedItemIdRef.current === itemId) {
        return;
      }

      setOpenItemId((current) => (current === itemId ? null : current));
    }, HOVER_CLOSE_DELAY_MS);
  };

  const togglePin = (itemId: string) => {
    clearHoverCloseTimeout();

    if (pinnedItemIdRef.current === itemId) {
      setPinned(null);
      setOpenItemId(null);
      return;
    }

    setPinned(itemId);
    setOpenItemId(itemId);
  };

  const dismissItem = (itemId: string) => {
    clearHoverCloseTimeout();

    if (pinnedItemIdRef.current === itemId) {
      setPinned(null);
    }

    setOpenItemId((current) => (current === itemId ? null : current));
  };

  useEffect(() => () => clearHoverCloseTimeout(), []);

  useEffect(() => {
    if (Math.abs(stackTranslateY - lastTranslateRef.current) < 0.5) {
      return;
    }

    lastTranslateRef.current = stackTranslateY;
    dismissOpenPopover();
  }, [stackTranslateY]);

  useEffect(() => {
    if (!pinnedItemId) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      if (target.closest('[data-recommendation-details-anchor]')) {
        return;
      }

      setPinned(null);
      setOpenItemId(null);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPinned(null);
        setOpenItemId(null);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [pinnedItemId]);

  useLayoutEffect(() => {
    if (!isPinScroll || !stackRef.current) {
      return;
    }

    const stack = stackRef.current;
    const first = cardRefs.current[0];
    const second = cardRefs.current[1];
    const visibleLast = cardRefs.current[Math.min(VISIBLE_CAPACITY, group.items.length) - 1];

    if (!first) {
      return;
    }

    const measure = () => {
      const step = second
        ? second.offsetTop - first.offsetTop
        : first.offsetHeight + 16;

      if (step > 0 && onCardStepMeasured) {
        onCardStepMeasured(step);
      }

      // Size the pinned viewport from real card heights so the last visible card is not clipped.
      if (visibleLast) {
        const computed = window.getComputedStyle(stack);
        const padY = (parseFloat(computed.paddingTop) || 0) + (parseFloat(computed.paddingBottom) || 0);
        const contentHeight = visibleLast.offsetTop + visibleLast.offsetHeight - first.offsetTop;
        const measured = Math.ceil(contentHeight + padY + 12);
        // On narrow screens, keep room for the intro inside the sticky panel.
        const maxForViewport = window.matchMedia(NARROW_POPOVER_QUERY).matches
          ? Math.floor(window.innerHeight * 0.58)
          : Number.POSITIVE_INFINITY;
        stack.style.maxHeight = `${Math.min(measured, maxForViewport)}px`;
      }
    };

    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);

    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
    };
  }, [group.items.length, isPinScroll, onCardStepMeasured, stackTranslateY]);

  useLayoutEffect(() => {
    if (!decorated || !viewportRef.current || !stackRef.current) {
      return;
    }

    const viewport = viewportRef.current;
    const stack = stackRef.current;
    const visualRoot =
      (viewport.closest('[data-recommendations-visual]') as HTMLElement | null)
      || (viewport.closest('section') as HTMLElement | null);

    if (!visualRoot) {
      return;
    }

    const update = () => {
      const cards = group.items
        .map((item, index) => {
          const element = cardRefs.current[index];
          return element ? { element, itemId: item.id } : null;
        })
        .filter((card): card is { element: HTMLDivElement; itemId: string } => Boolean(card));

      if (!isDesktopTimeline || cards.length !== group.items.length) {
        cards.forEach((card) => {
          card.element.style.transform = '';
        });
        setGeometry(null);
        return;
      }

      setGeometry(calculateCurveGeometry(visualRoot, viewport, cards));
    };

    const scheduleUpdate = () => {
      if (scrollFrameRef.current !== null) {
        return;
      }

      scrollFrameRef.current = window.requestAnimationFrame(() => {
        scrollFrameRef.current = null;
        update();
      });
    };

    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(visualRoot);
    observer.observe(viewport);
    observer.observe(stack);
    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('orientationchange', scheduleUpdate);

    if (isPinScroll) {
      window.addEventListener('scroll', scheduleUpdate, { passive: true });
    }

    update();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('orientationchange', scheduleUpdate);
      window.removeEventListener('scroll', scheduleUpdate);

      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
        scrollFrameRef.current = null;
      }
    };
  }, [decorated, group.items, isDesktopTimeline, isPinScroll, stackTranslateY]);

  const stackClassName = [
    styles.cardStack,
    isPinScroll ? styles.cardStackPinned : '',
    isPinScroll && isScrolledToStart ? styles.isScrolledToStart : '',
    isPinScroll && isScrolledToEnd ? styles.isScrolledToEnd : '',
  ]
    .filter(Boolean)
    .join(' ');

  const stackStyle = isPinScroll
    ? ({ '--recommendation-visible-count': VISIBLE_CAPACITY } as CSSProperties)
    : undefined;

  const offsetById = new Map(
    (geometry?.cardOffsets || []).map((entry) => [entry.itemId, entry.offsetX])
  );

  const cards = group.items.map((item, index) => {
    const offsetX = offsetById.get(item.id) ?? 0;

    return (
      <div
        key={item.id}
        ref={(node) => { cardRefs.current[index] = node; }}
        className={styles.cardPosition}
        style={offsetX ? { transform: `translateX(${offsetX}px)` } : undefined}
      >
        <RecommendationCard
          item={item}
          index={index}
          groupId={group.id}
          isOpen={openItemId === item.id}
          isPinned={pinnedItemId === item.id}
          onHoverOpen={() => openItem(item.id)}
          onHoverClose={() => scheduleHoverClose(item.id)}
          onTogglePin={() => togglePin(item.id)}
          onDismiss={() => dismissItem(item.id)}
        />
      </div>
    );
  });

  return (
    <div className={styles.group}>
      <h3 className={styles.groupTitle}>{group.title}</h3>
      <div ref={viewportRef} className={styles.timelineShell}>
        {geometry ? (
          <>
            <svg
              className={styles.arc}
              style={geometry.arc}
              viewBox="0 0 77.75 232"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <image href="/images/departments/svg/Line%202.svg" width="77.75" height="232" />
            </svg>
            <svg className={styles.connectorLayer} aria-hidden="true">
              {geometry.connectors.map((connector) => (
                <g key={connector.itemId}>
                  <path
                    d={`M ${connector.pointX + 8} ${connector.pointY} L ${connector.bendX} ${connector.endY} H ${connector.endX}`}
                  />
                  <circle
                    cx={connector.pointX}
                    cy={connector.pointY}
                    r={7}
                    fill="#ffffff"
                  />
                  <circle
                    cx={connector.pointX}
                    cy={connector.pointY}
                    r={4.25}
                    fill="#61b819"
                  />
                </g>
              ))}
            </svg>
          </>
        ) : null}
        <div ref={stackRef} className={stackClassName} style={stackStyle}>
          {isPinScroll ? (
            <div
              className={styles.cardStackTrack}
              style={{ transform: `translate3d(0, ${-stackTranslateY}px, 0)` }}
            >
              {cards}
            </div>
          ) : (
            cards
          )}
        </div>
      </div>
    </div>
  );
}

export default function DepartmentRecommendationsSection({
  content,
  containerClassName = '',
}: DepartmentRecommendationsSectionProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const firstGroup = content.groups[0];
  const overflowCount = firstGroup
    ? Math.max(0, firstGroup.items.length - VISIBLE_CAPACITY)
    : 0;
  const isPinScroll = overflowCount > 0;
  const isDesktopTimeline = useMediaQuery(DESKTOP_TIMELINE_QUERY);
  const isNarrowLayout = useMediaQuery(NARROW_POPOVER_QUERY);
  const isCompactLayout = useMediaQuery('(max-width: 560px)');
  const headingSize = isCompactLayout
    ? 'clamp(24px, 7vw, 32px)'
    : isNarrowLayout
      ? 'clamp(26px, 6vw, 36px)'
      : 'clamp(30px, 3vw, 52px)';
  const [cardStep, setCardStep] = useState(110);
  const [trackHeight, setTrackHeight] = useState<number | undefined>(undefined);
  const [stackTranslateY, setStackTranslateY] = useState(0);
  const [isScrolledToStart, setIsScrolledToStart] = useState(true);
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);

  const handleCardStepMeasured = (step: number) => {
    setCardStep((current) => (Math.abs(current - step) < 0.5 ? current : step));
  };

  useLayoutEffect(() => {
    if (!isPinScroll || !stickyRef.current) {
      setTrackHeight(undefined);
      return;
    }

    const updateTrackHeight = () => {
      const stickyHeight = stickyRef.current?.offsetHeight || window.innerHeight;
      const scrollStep = Math.max(cardStep, window.innerHeight * SCROLL_STEP_VIEWPORT_RATIO);
      setTrackHeight(stickyHeight + overflowCount * scrollStep);
    };

    updateTrackHeight();

    const observer = new ResizeObserver(updateTrackHeight);
    observer.observe(stickyRef.current);
    window.addEventListener('resize', updateTrackHeight);
    window.addEventListener('orientationchange', updateTrackHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateTrackHeight);
      window.removeEventListener('orientationchange', updateTrackHeight);
    };
  }, [cardStep, isPinScroll, overflowCount]);

  useEffect(() => {
    if (!isPinScroll) {
      setStackTranslateY(0);
      setIsScrolledToStart(true);
      setIsScrolledToEnd(false);
      return;
    }

    const updateProgress = () => {
      const track = trackRef.current;
      const sticky = stickyRef.current;

      if (!track || !sticky) {
        return;
      }

      const trackRect = track.getBoundingClientRect();
      const range = Math.max(track.offsetHeight - sticky.offsetHeight, 1);
      const progress = clamp(-trackRect.top / range, 0, 1);
      // Extra end travel so the final card clears the viewport bottom fully.
      const maxTranslate = overflowCount * cardStep + Math.max(12, cardStep * 0.08);

      setStackTranslateY(progress * maxTranslate);
      setIsScrolledToStart(progress <= 0.08);
      setIsScrolledToEnd(progress >= 0.92);
    };

    const scheduleUpdate = () => {
      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        updateProgress();
      });
    };

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('orientationchange', scheduleUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('orientationchange', scheduleUpdate);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [cardStep, isPinScroll, overflowCount]);

  const sectionClassName = [
    styles.section,
    isPinScroll ? styles.sectionPinScroll : '',
  ]
    .filter(Boolean)
    .join(' ');

  const contentNode = (
    <div className={`${styles.content} ${containerClassName}`}>
      <div className={styles.intro} data-department-reveal>
        <GradientTag
          text={content.eyebrow}
          backgroundColor="white"
          padding="px-5 py-1.5"
        />
        <GradientTitle
          part1={content.title}
          part2={content.highlightedText}
          lineBreak
          part1Color="dark-green"
          size="custom"
          customSize={headingSize}
          align="left"
          className={styles.heading}
          gradientFrom="#7CC51F"
          gradientTo="#A1DF0A"
        />
      </div>
      <div className={styles.groups}>
        {content.groups.map((group, index) => (
          <RecommendationGroup
            key={group.id}
            group={group}
            decorated={index === 0}
            isPinScroll={index === 0 && isPinScroll}
            isDesktopTimeline={index === 0 && isDesktopTimeline}
            stackTranslateY={index === 0 ? stackTranslateY : 0}
            isScrolledToStart={index === 0 ? isScrolledToStart : true}
            isScrolledToEnd={index === 0 && isScrolledToEnd}
            onCardStepMeasured={index === 0 ? handleCardStepMeasured : undefined}
          />
        ))}
      </div>
    </div>
  );

  if (!isPinScroll) {
    return (
      <section
        id="recommendations"
        className={sectionClassName}
        data-recommendations-visual
      >
        {contentNode}
      </section>
    );
  }

  return (
    <section id="recommendations" className={sectionClassName}>
      <div
        ref={trackRef}
        className={styles.scrollTrack}
        style={trackHeight ? { height: trackHeight } : undefined}
      >
        <div
          ref={stickyRef}
          className={styles.stickyPanel}
          data-recommendations-visual
        >
          {contentNode}
        </div>
      </div>
    </section>
  );
}
