'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import GradientTitle from '@/app/components/ui/GradientTitle';
import PublicationCard from '../shared/PublicationCard';
import type { PublicationCardItem } from '../shared/PublicationCard';

interface ELibrarySectionProps {
  filters: ELibraryFilterNode[];
  initialActiveFilterId?: string;
  itemLabel?: string;
  filterLibraryLabel?: string;
  resetButtonLabel?: string;
  searchLibraryLabel?: string;
  readMoreLabel?: string;
  emptyState?: {
    title: string;
    description: string;
  };
}

export type ELibraryPublicationItem = PublicationCardItem;

export interface ELibraryFilterNode {
  id: string;
  label: string;
  publications?: ELibraryPublicationItem[];
  children?: ELibraryFilterNode[];
}

interface FlattenedFilterItem {
  id: string;
  label: string;
  depth: number;
}

interface FilterTreeProps {
  activeFilterId: string;
  compact: boolean;
  filters: FlattenedFilterItem[];
  filterLibraryLabel: string;
  maxHeightClassName?: string;
  resetButtonLabel: string;
  onReset: () => void;
  onSelect: (filterId: string) => void;
}

function flattenFilterTree(
  nodes: ELibraryFilterNode[],
  depth = 0,
): FlattenedFilterItem[] {
  return nodes.flatMap((node) => [
    { id: node.id, label: node.label, depth },
    ...flattenFilterTree(node.children ?? [], depth + 1),
  ]);
}

function collectPublications(node: ELibraryFilterNode): ELibraryPublicationItem[] {
  return [
    ...(node.publications ?? []),
    ...(node.children ?? []).flatMap(collectPublications),
  ];
}

function filterTree(nodes: ELibraryFilterNode[], query: string): ELibraryFilterNode[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return nodes;
  }

  return nodes.reduce<ELibraryFilterNode[]>((accumulator, node) => {
    const labelMatches = node.label.toLowerCase().includes(normalizedQuery);
    const publicationMatches = collectPublications(node).some((publication) =>
      publication.title.toLowerCase().includes(normalizedQuery),
    );
    const filteredChildren = filterTree(node.children ?? [], normalizedQuery);

    if (labelMatches || publicationMatches || filteredChildren.length > 0) {
      accumulator.push({
        ...node,
        children: filteredChildren,
      });
    }

    return accumulator;
  }, []);
}

function findNodeById(
  nodes: ELibraryFilterNode[],
  nodeId: string,
): ELibraryFilterNode | null {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return node;
    }

    const nestedMatch = findNodeById(node.children ?? [], nodeId);
    if (nestedMatch) {
      return nestedMatch;
    }
  }

  return null;
}

function getFirstNode(nodes: ELibraryFilterNode[]): ELibraryFilterNode | null {
  return nodes[0] ?? null;
}

function FilterTree({
  activeFilterId,
  compact,
  filters,
  filterLibraryLabel,
  maxHeightClassName = 'max-h-[620px]',
  resetButtonLabel,
  onReset,
  onSelect,
}: FilterTreeProps) {
  if (filters.length === 0) {
    return (
      <div className="rounded-[12px] border border-dashed border-[#D6DDD0] px-4 py-6 text-center text-[12px] text-[#667085]">
        No library categories match your search.
      </div>
    );
  }

  const basePadding = compact ? 10 : 12;
  const stepPadding = compact ? 14 : 18;

  return (
    <>
      <div className="mt-5 flex items-center justify-between">
        <p className="text-[11px] font-medium text-[#98A2B3]">{filterLibraryLabel}</p>
        <button
          type="button"
          onClick={onReset}
          className="text-[11px] font-medium text-[#98A2B3] transition hover:text-[#2E7D32]"
        >
          {resetButtonLabel}
        </button>
      </div>

      <div
        className={`mt-4 overflow-y-auto pr-1 [scrollbar-color:#C8D1C1_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#D5DDD0] [&::-webkit-scrollbar-track]:bg-transparent ${maxHeightClassName}`}
      >
        <nav aria-label="Library categories">
          <ul className="space-y-1">
            {filters.map((filterItem) => {
              const isActive = filterItem.id === activeFilterId;

              return (
                <li key={filterItem.id}>
                  <button
                    id={`library-filter-${filterItem.id}`}
                    type="button"
                    onClick={() => onSelect(filterItem.id)}
                    className={`flex w-full items-center rounded-[8px] py-2 text-left text-[12px] leading-[1.45] transition ${
                      isActive
                        ? 'bg-[#F1F3EE] font-medium text-[#53C54F]'
                        : 'text-[#3D5C4A] hover:bg-[#F7F9F5]'
                    }`}
                    style={{
                      paddingLeft: `${basePadding + filterItem.depth * stepPadding}px`,
                      paddingRight: '12px',
                    }}
                  >
                    {filterItem.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}

export default function ELibrarySection({
  filters,
  initialActiveFilterId,
  itemLabel = 'items',
  filterLibraryLabel = 'Filter Library',
  resetButtonLabel = 'Reset',
  searchLibraryLabel = 'Search Library',
  readMoreLabel = 'Read More',
  emptyState = {
    title: 'No publications found',
    description: 'Please check back later for upcoming publications and library resources.',
  },
}: ELibrarySectionProps) {
  const defaultActiveNode = useMemo(() => {
    if (initialActiveFilterId) {
      return findNodeById(filters, initialActiveFilterId);
    }

    return getFirstNode(filters);
  }, [filters, initialActiveFilterId]);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilterId, setActiveFilterId] = useState(defaultActiveNode?.id ?? '');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewportWidth, setViewportWidth] = useState(1600);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isTabletFilterOpen, setIsTabletFilterOpen] = useState(false);
  const contentPanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const syncViewportWidth = () => {
      setViewportWidth(window.innerWidth);
    };

    syncViewportWidth();
    window.addEventListener('resize', syncViewportWidth);

    return () => {
      window.removeEventListener('resize', syncViewportWidth);
    };
  }, []);

  const isDesktop = viewportWidth >= 1280;
  const isTablet = viewportWidth >= 768 && viewportWidth < 1280;
  const isMobile = viewportWidth < 768;
  const mobileFilterOpen = isMobile && isMobileFilterOpen;
  const tabletFilterOpen = isTablet && isTabletFilterOpen;

  const visibleFilters = useMemo(
    () => flattenFilterTree(filterTree(filters, searchTerm)),
    [filters, searchTerm],
  );

  const resolvedActiveFilterId = useMemo(() => {
    if (visibleFilters.some((filterItem) => filterItem.id === activeFilterId)) {
      return activeFilterId;
    }

    return visibleFilters[0]?.id ?? defaultActiveNode?.id ?? '';
  }, [activeFilterId, defaultActiveNode?.id, visibleFilters]);

  const activeNode = findNodeById(filters, resolvedActiveFilterId) ?? getFirstNode(filters);

  const activePublications = useMemo(
    () => (activeNode ? collectPublications(activeNode) : []),
    [activeNode],
  );

  const filteredPublications = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();

    if (!normalizedQuery) {
      return activePublications;
    }

    return activePublications.filter((publication) =>
      publication.title.toLowerCase().includes(normalizedQuery),
    );
  }, [activePublications, searchTerm]);

  const columnCount = useMemo(() => {
    if (viewportWidth >= 1536) {
      return 4;
    }

    if (viewportWidth >= 1280) {
      return 3;
    }

    if (viewportWidth >= 768) {
      return 2;
    }

    return 1;
  }, [viewportWidth]);

  const itemsPerPage = columnCount * 3;
  const totalPages = Math.max(1, Math.ceil(filteredPublications.length / itemsPerPage));
  const resolvedCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (resolvedCurrentPage - 1) * itemsPerPage;
  const paginatedPublications = filteredPublications.slice(startIndex, startIndex + itemsPerPage);
  const placeholderCount = Math.max(0, itemsPerPage - paginatedPublications.length);
  const paddedPublications = [
    ...paginatedPublications.map((publication) => ({ type: 'publication' as const, publication })),
    ...Array.from({ length: placeholderCount }, (_, index) => ({
      type: 'placeholder' as const,
      id: `placeholder-${resolvedActiveFilterId}-${resolvedCurrentPage}-${index}`,
    })),
  ];

  useLayoutEffect(() => {
    if (!contentPanelRef.current || typeof window === 'undefined') {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const panel = contentPanelRef.current;

    const context = gsap.context(() => {
      gsap.fromTo(
        panel,
        { autoAlpha: 0, x: 84 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.6,
          ease: 'power3.out',
          clearProps: 'opacity,visibility,transform',
        },
      );
    }, panel);

    return () => context.revert();
  }, [paginatedPublications.length, resolvedActiveFilterId, resolvedCurrentPage]);

  const closeResponsiveFilters = () => {
    setIsMobileFilterOpen(false);
    setIsTabletFilterOpen(false);
  };

  const handleReset = () => {
    setSearchTerm('');
    setActiveFilterId(defaultActiveNode?.id ?? '');
    setCurrentPage(1);
    closeResponsiveFilters();
  };

  const handleFilterChange = (filterId: string) => {
    setActiveFilterId(filterId);
    setCurrentPage(1);

    if (isMobile) {
      setIsMobileFilterOpen(false);
    }

    if (isTablet) {
      setIsTabletFilterOpen(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  const activeFilterLabel = activeNode?.label ?? 'Library';

  return (
    <section className="mb-20 overflow-x-clip bg-white px-4 pb-20 pt-12 md:mb-24 md:px-6 md:pb-24 md:pt-16 lg:mb-48 lg:px-8 lg:pb-28 lg:pt-20">
      <div className="mx-auto grid w-full max-w-[1920px] gap-8 xl:grid-cols-[290px_minmax(0,1fr)] xl:gap-10">
        <aside className="hidden self-start rounded-[18px] border border-[#E4E8E0] bg-white p-4 shadow-[0_10px_28px_rgba(13,62,28,0.04)] md:p-5 xl:sticky xl:top-6 xl:block">
          <div className="relative">
            <label htmlFor="library-search-desktop" className="sr-only">
              {searchLibraryLabel}
            </label>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]"
              aria-hidden="true"
            />
            <input
              id="library-search-desktop"
              type="search"
              value={searchTerm}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder={searchLibraryLabel}
              className="h-[40px] w-full rounded-[10px] border border-[#E7E7E7] bg-white pl-9 pr-4 text-[13px] text-[#344054] outline-none transition focus:border-[#2E7D32]"
            />
          </div>

          <FilterTree
            activeFilterId={resolvedActiveFilterId}
            compact={false}
            filters={visibleFilters}
            filterLibraryLabel={filterLibraryLabel}
            onReset={handleReset}
            onSelect={handleFilterChange}
            resetButtonLabel={resetButtonLabel}
          />
        </aside>

        <div className="min-w-0">
          {!isDesktop && (
            <div className="sticky top-0 z-30 mb-6 -mx-4 border-b border-[#EFF2EB] bg-white/95 px-4 pb-4 pt-2 backdrop-blur-sm md:-mx-6 md:px-6">
              <div className="relative">
                <label htmlFor="library-search-responsive" className="sr-only">
                  {searchLibraryLabel}
                </label>
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]"
                  aria-hidden="true"
                />
                <input
                  id="library-search-responsive"
                  type="search"
                  value={searchTerm}
                  onChange={(event) => handleSearchChange(event.target.value)}
                  placeholder={searchLibraryLabel}
                  className="h-[48px] w-full rounded-[14px] border border-[#E7E7E7] bg-white pl-10 pr-4 text-[14px] text-[#344054] outline-none transition focus:border-[#2E7D32]"
                />
              </div>

              {isTablet ? (
                <div className="mt-4 rounded-[18px] border border-[#E4E8E0] bg-white p-4 shadow-[0_10px_28px_rgba(13,62,28,0.04)]">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                    onClick={() => setIsTabletFilterOpen((current) => !current)}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] border border-[#D5DDD0] bg-[#F7FAF3] px-4 text-sm font-medium text-[#184B2B] transition hover:border-[#2E7D32]"
                    >
                      <SlidersHorizontal className="h-4 w-4" strokeWidth={2} />
                      <span>{filterLibraryLabel}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          tabletFilterOpen ? 'rotate-180' : ''
                        }`}
                        strokeWidth={2}
                      />
                    </button>

                    <div className="inline-flex h-11 items-center rounded-[14px] bg-[#F5F8F1] px-4 text-sm font-medium text-[#2E7D32]">
                      {activeFilterLabel}
                    </div>

                    <div className="inline-flex h-11 items-center rounded-[14px] bg-[#FBFCFA] px-4 text-sm text-[#667085]">
                      {filteredPublications.length} {itemLabel}
                    </div>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="ml-auto text-sm font-medium text-[#98A2B3] transition hover:text-[#2E7D32]"
                    >
                      {resetButtonLabel}
                    </button>
                  </div>

                  {tabletFilterOpen && (
                    <div className="mt-4 rounded-[14px] border border-[#EEF2EA] bg-[#FBFCFA] p-4">
                      <FilterTree
                        activeFilterId={resolvedActiveFilterId}
                        compact
                        filters={visibleFilters}
                        filterLibraryLabel={filterLibraryLabel}
                        maxHeightClassName="max-h-[320px]"
                        onReset={handleReset}
                        onSelect={handleFilterChange}
                        resetButtonLabel={resetButtonLabel}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[14px] border border-[#D5DDD0] bg-[#F7FAF3] px-4 text-sm font-medium text-[#184B2B] transition hover:border-[#2E7D32]"
                  >
                    <SlidersHorizontal className="h-4 w-4" strokeWidth={2} />
                    <span>{filterLibraryLabel}</span>
                  </button>

                  <div className="min-w-0 flex-1 rounded-[14px] bg-[#F5F8F1] px-4 py-3">
                    <div className="truncate text-sm font-medium text-[#2E7D32]">
                      {activeFilterLabel}
                    </div>
                    <div className="mt-0.5 text-xs text-[#667085]">
                      {filteredPublications.length} {itemLabel}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <GradientTitle
                part1=""
                part2={activeFilterLabel}
                lineBreak={false}
                size="custom"
                customSize="clamp(2rem,3vw,3.25rem)"
                className="leading-[1.05]"
              />
            </div>

            <div className="hidden rounded-full bg-[#F5F8F1] px-4 py-2 text-sm font-medium text-[#2E7D32] xl:block">
              {filteredPublications.length} {itemLabel}
            </div>
          </div>

          <div
            ref={contentPanelRef}
            className="min-w-0 overflow-x-clip"
            key={`${resolvedActiveFilterId}-${resolvedCurrentPage}-${paginatedPublications.length}`}
          >
            {filteredPublications.length > 0 ? (
              <div className="flex min-h-[calc(3*330px+2*20px)] flex-col">
                <div className="grid flex-1 auto-rows-fr gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {paddedPublications.map((item) => {
                    if (item.type === 'placeholder') {
                      return (
                        <article
                          key={item.id}
                          aria-hidden="true"
                          className="invisible rounded-[20px] border border-transparent px-2.5 pb-5 pt-0.5 md:px-3 md:pb-5"
                        />
                      );
                    }

                    const { publication } = item;

                    return (
                      <div
                        key={publication.id}
                        data-library-card
                      >
                        <PublicationCard item={publication} buttonLabel={readMoreLabel} />
                      </div>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <nav
                    className="mt-10 flex flex-col items-center justify-center gap-4 md:mt-12 md:flex-row md:justify-between"
                    aria-label="e-Library pagination"
                  >
                    <div className="flex justify-center md:w-[96px] md:justify-start">
                      {resolvedCurrentPage > 1 ? (
                        <button
                          type="button"
                          onClick={() => handlePageChange(resolvedCurrentPage - 1)}
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-[7px] border border-[#A9B1B8] bg-white px-4 text-sm font-medium text-[#6B7280] transition hover:border-[#2E7D32] hover:text-[#2E7D32]"
                        >
                          <ChevronLeft className="h-4 w-4" strokeWidth={1.8} />
                          <span>Prev</span>
                        </button>
                      ) : (
                        <div className="h-9 md:w-[96px]" aria-hidden="true" />
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                      {Array.from({ length: totalPages }, (_, index) => {
                        const page = index + 1;
                        const isActive = page === resolvedCurrentPage;

                        return (
                          <button
                            key={page}
                            type="button"
                            onClick={() => handlePageChange(page)}
                            aria-current={isActive ? 'page' : undefined}
                            className={`inline-flex h-9 min-w-9 items-center justify-center rounded-[6px] border px-3 text-sm font-medium transition ${
                              isActive
                                ? 'border-[#2E7D32] bg-[#2E7D32] text-white'
                                : 'border-[#A9B1B8] bg-white text-[#475467] hover:border-[#2E7D32] hover:text-[#2E7D32]'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex justify-center md:w-[96px] md:justify-end">
                      {resolvedCurrentPage < totalPages ? (
                        <button
                          type="button"
                          onClick={() => handlePageChange(resolvedCurrentPage + 1)}
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-[7px] border border-[#A9B1B8] bg-white px-4 text-sm font-medium text-[#6B7280] transition hover:border-[#2E7D32] hover:text-[#2E7D32]"
                        >
                          <span>Next</span>
                          <ChevronRight className="h-4 w-4" strokeWidth={1.8} />
                        </button>
                      ) : (
                        <div className="h-9 md:w-[96px]" aria-hidden="true" />
                      )}
                    </div>
                  </nav>
                )}
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-[#D6DDD0] bg-[#FBFCFA] px-6 py-16 text-center">
                <h3 className="text-[22px] font-semibold text-[#184B2B]">{emptyState.title}</h3>
                <p className="mx-auto mt-3 max-w-[540px] text-[15px] leading-7 text-[#667085]">
                  {emptyState.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-[#042012]/35 transition-opacity duration-300 md:hidden ${
          mobileFilterOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsMobileFilterOpen(false)}
        aria-hidden="true"
      />

      <div
        className={`fixed inset-x-0 bottom-0 z-50 rounded-t-[28px] bg-white px-4 pb-8 pt-5 shadow-[0_-20px_60px_rgba(15,63,29,0.16)] transition-transform duration-300 md:hidden ${
          mobileFilterOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-library-filter-title"
      >
        <div className="mx-auto w-full max-w-[560px]">
          <div className="flex items-center justify-between">
            <div>
              <h3
                id="mobile-library-filter-title"
                className="mt-4 text-[20px] font-semibold text-[#184B2B]"
              >
                {filterLibraryLabel}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F8F1] text-[#184B2B]"
              aria-label="Close filter panel"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>

          <FilterTree
            activeFilterId={resolvedActiveFilterId}
            compact
            filters={visibleFilters}
            filterLibraryLabel={filterLibraryLabel}
            maxHeightClassName="max-h-[55vh]"
            onReset={handleReset}
            onSelect={handleFilterChange}
            resetButtonLabel={resetButtonLabel}
          />
        </div>
      </div>
    </section>
  );
}
