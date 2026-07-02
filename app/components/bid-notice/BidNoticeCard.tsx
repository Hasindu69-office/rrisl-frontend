import React from 'react';
import Button from '@/app/components/ui/Button';

interface BidNoticeCardProps {
  title: string;
  refNo: string;
  closingDate: string;
  readMoreHref?: string;
  logoSrc?: string;
  logoAlt?: string;
  closingDateLabel?: string;
  readMoreLabel?: string;
}

const BidNoticeCard: React.FC<BidNoticeCardProps> = ({
  title,
  refNo,
  closingDate,
  readMoreHref,
  logoSrc = '/images/rrisl_logo.png',
  logoAlt = 'RRISL Logos',
  closingDateLabel = 'Closing Date',
  readMoreLabel = 'Read More',
}) => {
  const hasDocument = Boolean(readMoreHref);
  const cardLogoSrc = logoSrc || '/images/rrisl_logo.png';

  return (
    <div 
      className="relative overflow-hidden rounded-[20px] p-6 md:p-10 text-white flex flex-col justify-between h-full min-h-[350px] md:min-h-[420px]"
      style={{
        background: 'radial-gradient(circle at center, #499348 0%, #0E3C3A 100%)',
      }}
    >
      {/* Top Section - Logos and Institute Info */}
      <div className="flex flex-col items-center gap-4 mb-4 md:mb-8">
        <div className="relative w-full h-12 md:h-16">
          <img
            src={cardLogoSrc}
            alt={logoAlt}
            className="h-full w-full object-contain"
          />
        </div>
      </div>

      {/* Middle Section - Title and Reference Number */}
      <div className="flex-grow flex flex-col items-center justify-center text-center gap-3 md:gap-4 px-2">
        <h3 className="font-bold font-outfit leading-tight max-w-[95%] md:max-w-[90%] text-lg md:text-[20px]">
          {title}
        </h3>
        <p className="font-medium font-outfit opacity-80 uppercase text-lg md:text-[20px]">
          {refNo}
        </p>
      </div>

      {/* Bottom Section - Closing Date and Read More */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-8 md:mt-10 w-full gap-4 sm:gap-0">
        <div className="flex flex-col">
          <span className="text-[#A1DF0A] font-semibold font-outfit text-[15px] md:text-[17px]">
            {closingDateLabel}: {closingDate}
          </span>
        </div>
        {hasDocument ? (
          <a
            href={readMoreHref}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open tender document for ${title}`}
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="!w-auto min-h-12 px-6 text-xs font-bold md:!h-[45px] md:px-8 md:text-sm"
            >
              {readMoreLabel}
            </Button>
          </a>
        ) : (
          <span
            className="inline-flex !w-auto min-h-12 items-center justify-center rounded-[30px] border border-[#A1DF0A]/50 px-6 text-xs font-bold text-[#A1DF0A]/60 md:!h-[45px] md:px-8 md:text-sm"
            aria-disabled="true"
          >
            {readMoreLabel}
          </span>
        )}
      </div>
    </div>
  );
};

export default BidNoticeCard;
