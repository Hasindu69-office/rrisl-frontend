import React from 'react';
import type { FooterPhone } from './footerData';

interface FooterContactProps {
  addressLines: string[];
  phones: FooterPhone[];
  email: string;
}

export default function FooterContact({
  addressLines,
  phones,
  email,
}: FooterContactProps) {
  return (
    <div>
      <h3 className="text-[30px] font-semibold leading-[128%] text-white">
        Contact us
      </h3>

      <div className="mt-[54px] space-y-[20px] text-[18px] leading-[35px] font-normal text-white">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 10C20 14.993 14.461 20.193 12.601 21.799C12.4277 21.9293 12.2168 21.9998 12 21.9998C11.7832 21.9998 11.5723 21.9293 11.399 21.799C9.539 20.193 4 14.993 4 10C4 7.87827 4.84285 5.84344 6.34315 4.34315C7.84344 2.84285 9.87827 2 12 2C14.1217 2 16.1566 2.84285 17.6569 4.34315C19.1571 5.84344 20 7.87827 20 10Z" stroke="url(#paint0_linear_location)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="url(#paint1_linear_location)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="paint0_linear_location" x1="4" y1="11.9999" x2="20" y2="11.9999" gradientUnits="userSpaceOnUse">
                  <stop offset="0.0288462" stopColor="#20C997"/>
                  <stop offset="1" stopColor="#A1DF0A"/>
                </linearGradient>
                <linearGradient id="paint1_linear_location" x1="4" y1="11.9999" x2="20" y2="11.9999" gradientUnits="userSpaceOnUse">
                  <stop offset="0.0288462" stopColor="#20C997"/>
                  <stop offset="1" stopColor="#A1DF0A"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            {addressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.832 16.568C14.0385 16.6628 14.2712 16.6845 14.4917 16.6294C14.7122 16.5744 14.9073 16.4458 15.045 16.265L15.4 15.8C15.5863 15.5516 15.8279 15.35 16.1056 15.2111C16.3833 15.0723 16.6895 15 17 15H20C20.5304 15 21.0391 15.2107 21.4142 15.5858C21.7893 15.9609 22 16.4696 22 17V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22C15.2261 22 10.6477 20.1036 7.27208 16.7279C3.89642 13.3523 2 8.7739 2 4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H7C7.53043 2 8.03914 2.21071 8.41421 2.58579C8.78929 2.96086 9 3.46957 9 4V7C9 7.31049 8.92771 7.61672 8.78885 7.89443C8.65 8.17214 8.44839 8.41371 8.2 8.6L7.732 8.951C7.54842 9.09118 7.41902 9.29059 7.36579 9.51535C7.31256 9.74012 7.33878 9.97638 7.44 10.184C8.80668 12.9599 11.0544 15.2048 13.832 16.568Z" stroke="url(#paint0_linear_phone)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="paint0_linear_phone" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                  <stop offset="0.0288462" stopColor="#20C997"/>
                  <stop offset="1" stopColor="#A1DF0A"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            {phones.map((phone) => (
              <p key={`${phone.label}-${phone.number}`}>
                <span className="mr-1 text-white">{phone.label}:</span>
                <a
                  href={`tel:${phone.number.replace(/[^0-9+]/g, '')}`}
                  className="hover:text-[#A1DF0A]"
                >
                  {phone.number}
                </a>
              </p>
            ))}
          </div>
        </div>

        <div className="ml-[36px]">
          <a
            href={`mailto:${email}`}
            className="text-white hover:text-[#A1DF0A]"
          >
            {email}
          </a>
        </div>
      </div>
    </div>
  );
}



