'use client';

import React, { useState, useRef } from 'react';
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
  logoSrc?: string;
  logoAlt?: string;
  closingDateLabel?: string;
  readMoreLabel?: string;
}

const BidNoticeGrid: React.FC<BidNoticeGridProps> = ({
  initialNotices,
  logoSrc = '/images/rrisl_logo.png',
  logoAlt = 'RRISL Logo',
  closingDateLabel = 'Closing Date',
  readMoreLabel = 'Read More',
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
      {initialNotices.length === 0 ? (
        <div className="mb-16 rounded-[24px] border border-[#DDE6D7] bg-[linear-gradient(135deg,#F7FBF6_0%,#EEF7EF_100%)] px-6 py-14 text-center shadow-[0_8px_24px_rgba(15,63,29,0.04)] md:px-10">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-semibold text-[#16324F] md:text-3xl">
              Currently there are no bid notices
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#5B6470] md:text-base">
              Please check back later for upcoming tender opportunities and related notices.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-[40px] lg:gap-[80px] mb-16">
          {currentNotices.map((notice) => (
            <div key={notice.id} className="flex justify-center">
              <div className="w-full max-w-[800px] lg:max-w-none">
                <BidNoticeCard
                  title={notice.title}
                  refNo={notice.refNo}
                  closingDate={notice.closingDate}
                  readMoreHref={notice.readMoreHref}
                  logoSrc={logoSrc}
                  logoAlt={logoAlt}
                  closingDateLabel={closingDateLabel}
                  readMoreLabel={readMoreLabel}
                />
              </div>
            </div>
          ))}
        </div>
      )}

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
