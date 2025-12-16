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
      <div className="relative z-10 px-4 pb-10 pt-[237px] md:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-12">
          {/* Logo + institute text */}
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
              <Image
                src="/images/rrisl_logo.png"
                alt="Rubber Research Institute of Sri Lanka logo"
                width={1080}
                height={168}
                className="h-16 w-auto md:h-20"
              />
            </div>
          </div>

          {/* Columns */}
          <div className="grid gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1.4fr)] md:gap-12" style={{ marginTop: '91px' }}>
            <FooterLinksColumn title="Quick Links" links={quickLinks} />
            <FooterLinksColumn title="Important links" links={importantLinks} />
            <FooterContact
              addressLines={addressLines}
              phones={phones}
              email={email}
            />
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row">
            <p>© {new Date().getFullYear()} Rubber Research Institute of Sri Lanka. All rights reserved.</p>
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
          className="pointer-events-auto absolute right-6 top-1/2 hidden -translate-y-1/2 lg:flex"
        />

        {/* Socials for mobile / tablet */}
        <div className="mt-8 flex justify-center lg:hidden">
          <FooterSocials links={socialLinks} />
        </div>
      </div>
    </footer>
  );
}



