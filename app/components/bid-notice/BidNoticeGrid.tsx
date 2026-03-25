'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BidNoticeCard from './BidNoticeCard';

interface BidNotice {
  id: string;
  title: string;
  refNo: string;
  closingDate: string;
  readMoreHref: string;
}

interface BidNoticeGridProps {
  initialNotices: BidNotice[];
  locale?: string;
}

const BidNoticeGrid: React.FC<BidNoticeGridProps> = ({
  initialNotices,
  locale = 'en',
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(initialNotices.length / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNotices = initialNotices.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      // Scroll to top immediately to avoid jumping
      window.scrollTo(0, 0);
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="w-full" ref={gridRef}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-[40px] lg:gap-[80px] mb-16">
        {currentNotices.map((notice) => (
          <div key={notice.id} className="flex justify-center">
            <div className="w-full max-w-[800px] lg:max-w-none">
              <BidNoticeCard
                title={notice.title}
                refNo={notice.refNo}
                closingDate={notice.closingDate}
                readMoreHref={notice.readMoreHref}
                locale={locale}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination - Perfectly matching VacancyPagination Styling and Structure */}
      {totalPages > 1 && (
        <nav
          className="mt-10 flex flex-col items-center justify-center gap-4 pb-16 md:mt-12 md:flex-row md:justify-between"
          aria-label="Bid notice pagination"
        >
          <div className="flex justify-center md:w-[96px] md:justify-start">
            {currentPage > 1 ? (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
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
              const active = page === currentPage;

              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  aria-current={active ? 'page' : undefined}
                  className={`inline-flex h-9 min-w-9 items-center justify-center rounded-[6px] border text-sm font-medium transition ${
                    active
                      ? 'border-[#2E7D32] bg-[#2E7D32] px-3 text-white'
                      : 'border-[#A9B1B8] bg-white px-3 text-[#475467] hover:border-[#2E7D32] hover:text-[#2E7D32]'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <div className="flex justify-center md:w-[96px] md:justify-end">
            {currentPage < totalPages ? (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
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
  );
};

export default BidNoticeGrid;
