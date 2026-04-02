'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import Button from '@/app/components/ui/Button';
import GradientTitle from '@/app/components/ui/GradientTitle';
import {
  eLibraryFilterTree,
  type ELibraryFilterNode,
  type ELibraryPublicationItem,
} from './eLibraryData';

interface ELibrarySectionProps {
  filters?: ELibraryFilterNode[];
  initialActiveFilterId?: string;
}

interface FlattenedFilterItem {
  id: string;
  label: string;
  depth: number;
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

export default function ELibrarySection({
  filters = eLibraryFilterTree,
  initialActiveFilterId,
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

    if (viewportWidth >= 640) {
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

  const handleReset = () => {
    setSearchTerm('');
    setActiveFilterId(defaultActiveNode?.id ?? '');
    setCurrentPage(1);
  };

  const handleFilterChange = (filterId: string) => {
    setActiveFilterId(filterId);
    setCurrentPage(1);
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

  return (
    <section className="mb-20 bg-white px-4 pb-20 pt-12 md:mb-24 md:px-6 md:pb-24 md:pt-16 lg:mb-48 lg:px-8 lg:pb-28 lg:pt-20">
      <div className="mx-auto grid w-full max-w-[1920px] gap-8 xl:grid-cols-[290px_minmax(0,1fr)] xl:gap-10">
        <aside className="rounded-[18px] border border-[#E4E8E0] bg-white p-4 shadow-[0_10px_28px_rgba(13,62,28,0.04)] md:p-5">
          <div className="relative">
            <label htmlFor="library-search" className="sr-only">
              Search library
            </label>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]"
              aria-hidden="true"
            />
            <input
              id="library-search"
              type="search"
              value={searchTerm}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search Library"
              className="h-[40px] w-full rounded-[10px] border border-[#E7E7E7] bg-white pl-9 pr-4 text-[13px] text-[#344054] outline-none transition focus:border-[#2E7D32]"
            />
          </div>

          <div className="mt-5 flex items-center justify-between">
            <p className="text-[11px] font-medium text-[#98A2B3]">Filter Library</p>
            <button
              type="button"
              onClick={handleReset}
              className="text-[11px] font-medium text-[#98A2B3] transition hover:text-[#2E7D32]"
            >
              Reset
            </button>
          </div>

          <div className="mt-4 max-h-[620px] overflow-y-auto pr-1 [scrollbar-color:#C8D1C1_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#D5DDD0] [&::-webkit-scrollbar-track]:bg-transparent">
            {visibleFilters.length > 0 ? (
              <nav aria-label="Library categories">
                <ul className="space-y-1">
                  {visibleFilters.map((filterItem) => {
                    const isActive = filterItem.id === resolvedActiveFilterId;

                    return (
                      <li key={filterItem.id}>
                        <button
                          type="button"
                          onClick={() => handleFilterChange(filterItem.id)}
                          className={`flex w-full items-center rounded-[8px] py-2 text-left text-[12px] leading-[1.45] transition ${
                            isActive
                              ? 'bg-[#F1F3EE] font-medium text-[#53C54F]'
                              : 'text-[#3D5C4A] hover:bg-[#F7F9F5]'
                          }`}
                          style={{
                            paddingLeft: `${12 + filterItem.depth * 18}px`,
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
            ) : (
              <div className="rounded-[12px] border border-dashed border-[#D6DDD0] px-4 py-6 text-center text-[12px] text-[#667085]">
                No library categories match your search.
              </div>
            )}
          </div>
        </aside>

        <div
          ref={contentPanelRef}
          className="min-w-0"
          key={`${resolvedActiveFilterId}-${resolvedCurrentPage}-${paginatedPublications.length}`}
        >
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <GradientTitle
                part1=""
                part2={activeNode?.label ?? 'Library'}
                lineBreak={false}
                size="custom"
                customSize="clamp(2rem,3vw,3.25rem)"
                className="leading-[1.05]"
              />
            </div>

            <div className="hidden rounded-full bg-[#F5F8F1] px-4 py-2 text-sm font-medium text-[#2E7D32] lg:block">
              {filteredPublications.length} items
            </div>
          </div>

          {filteredPublications.length > 0 ? (
            <div className="flex min-h-[calc(3*330px+2*20px)] flex-col">
              <div className="grid flex-1 auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
                    <article
                      key={publication.id}
                      data-library-card
                      className="rounded-[20px] border border-[#E6E8E4] bg-white px-2.5 pb-5 pt-0.5 shadow-[0_12px_36px_rgba(15,63,29,0.04)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,63,29,0.08)] md:px-3 md:pb-5"
                    >
                      <div className="pointer-events-none relative mx-auto -mb-1 -mt-6 aspect-[0.82] w-[calc(100%+24px)] max-w-[268px] md:w-[calc(100%+28px)] md:max-w-[286px]">
                        <Image
                          src={publication.imageSrc}
                          alt={publication.imageAlt}
                          fill
                          className="scale-[1.5] object-contain"
                          sizes="(max-width: 640px) 45vw, (max-width: 1536px) 18vw, 180px"
                        />
                      </div>

                      <div className="relative z-[1] mt-0 flex w-full flex-col items-center text-center">
                        <h3 className="w-[calc(100%+20px)] text-[15px] font-semibold leading-[1.2] text-[#101828]">
                          {publication.title}
                        </h3>

                        <div className="mb-[18px] mt-2 flex justify-center">
                          <Link href={publication.readMoreHref} className="inline-flex">
                            <Button
                              variant="outline"
                              size="sm"
                              className="!h-[42px] !w-[138px] !rounded-[999px] !px-0 !py-0 text-[13px] font-medium"
                            >
                              Read More
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </article>
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

                  <div className="flex items-center gap-4">
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
              <h3 className="text-[22px] font-semibold text-[#184B2B]">No publications found</h3>
              <p className="mx-auto mt-3 max-w-[540px] text-[15px] leading-7 text-[#667085]">
                This state is already wired for backend filtering. Once real library data is connected,
                the panel will reflect the selected category and search query automatically.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
