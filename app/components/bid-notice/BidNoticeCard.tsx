import React from 'react';
import Image from 'next/image';
import Button from '../ui/Button';

interface BidNoticeCardProps {
  title: string;
  refNo: string;
  closingDate: string;
  readMoreHref?: string;
  locale?: string;
}

const BidNoticeCard: React.FC<BidNoticeCardProps> = ({
  title,
  refNo,
  closingDate,
  readMoreHref = '#',
  locale = 'en',
}) => {
  return (
    <div 
      className="relative overflow-hidden rounded-[20px] p-8 md:p-10 text-white flex flex-col justify-between h-full min-h-[420px]"
      style={{
        background: 'radial-gradient(circle at center, #499348 0%, #0E3C3A 100%)',
      }}
    >
      {/* Top Section - Logos and Institute Info */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="relative w-full h-16">
          <Image
            src="/images/rrisl_logo.png"
            alt="RRISL Logos"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Middle Section - Title and Reference Number */}
      <div className="flex-grow flex flex-col items-center justify-center text-center gap-4 px-2">
        <h3 className="font-bold font-outfit leading-tight max-w-[90%]" style={{ fontSize: '20px' }}>
          {title}
        </h3>
        <p className="font-medium font-outfit opacity-80 uppercase" style={{ fontSize: '20px' }}>
          {refNo}
        </p>
      </div>

      {/* Bottom Section - Closing Date and Read More */}
      <div className="flex items-center justify-between mt-10 w-full">
        <div className="flex flex-col">
          <span className="text-[#A1DF0A] font-semibold font-outfit" style={{ fontSize: '17px' }}>
            Closing Date: {closingDate}
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="!w-auto px-8 !h-[45px] text-sm font-bold"
        >
          Read More
        </Button>
      </div>
    </div>
  );
};

export default BidNoticeCard;
