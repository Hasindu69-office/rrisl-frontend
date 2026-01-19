import React from 'react';
import Image from 'next/image';
import { footerConfig } from './footerData';
import FooterLinksColumn from './FooterLinksColumn';
import FooterContact from './FooterContact';
import FooterSocials from './FooterSocials';

export default function FooterMain() {
  const { quickLinks, importantLinks, addressLines, phones, email, socialLinks } =
    footerConfig;

  return (
    <footer className="relative mt-24 overflow-hidden bg-black text-white">
      {/* Background image */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/images/footer_bg.png"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0" />
      </div>

      {/* Hand image on the right */}
      <div className="pointer-events-none absolute -bottom-12 -right-72 z-10 hidden h-[638px] w-[958px] lg:block">
        <div className="relative h-full w-full">
          <Image
            src="/images/footer_hand.png"
            alt=""
            fill
            sizes="958px"
            className="object-contain object-bottom"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 pb-10 pt-16 md:pt-24 lg:pt-[237px] md:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-12">
          {/* Logo + institute text */}
          <div className="flex flex-col items-center lg:items-start gap-6 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-8">
              <Image
                src="/images/rrisl_logo.png"
                alt="Rubber Research Institute of Sri Lanka logo"
                width={1080}
                height={168}
                className="h-12 w-auto md:h-16 lg:h-20"
              />
            </div>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1.4fr)] gap-y-12 gap-x-4 md:gap-x-12 lg:gap-2 mt-12 md:mt-16 lg:mt-[91px]">
            <FooterLinksColumn title="Quick Links" links={quickLinks} />
            <FooterLinksColumn title="Important links" links={importantLinks} />

            {/* Socials for Tablet view - positioned to the right of top links */}
            <div className="hidden md:flex lg:hidden items-start justify-end pr-4">
              <div className="pt-[54px]"> {/* Aligned with link list start */}
                <FooterSocials links={socialLinks} />
              </div>
            </div>

            <div className="col-span-2 md:col-span-3 lg:col-span-1 flex items-end justify-between">
              <div className="w-full">
                <FooterContact
                  addressLines={addressLines}
                  phones={phones}
                  email={email}
                />
              </div>
              {/* Socials for mobile only */}
              <div className="md:hidden pb-1">
                <FooterSocials links={socialLinks} />
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 text-[11px] md:text-xs text-white/50 md:flex-row">
            <p className="text-center md:text-left max-w-[300px] md:max-w-none">© {new Date().getFullYear()} Rubber Research Institute of Sri Lanka. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-[#A1DF0A]">
                Privacy policy
              </a>
              <span className="h-3 w-px bg-white/30" />
              <a href="#" className="hover:text-[#A1DF0A]">
                Terms &amp; conditions
              </a>
            </div>
          </div>
        </div>

        {/* Vertical socials on large screens */}
        <FooterSocials
          links={socialLinks}
          className="pointer-events-auto absolute right-10 xl:right-16 top-1/4 hidden lg:flex"
        />
      </div>
    </footer>
  );
}



