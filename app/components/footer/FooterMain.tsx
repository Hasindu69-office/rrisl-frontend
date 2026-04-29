'use client';

import React from 'react';
import Image from 'next/image';

import type { FooterConfig } from './footerData';
import FooterLinksColumn from './FooterLinksColumn';
import FooterContact from './FooterContact';
import FooterSocials from './FooterSocials';

interface FooterMainProps {
  config: FooterConfig;
  locale: string;
}

function resolveBrowserImageUrl(src: string) {
  if (!src || typeof window === 'undefined') {
    return src;
  }

  try {
    const url = new URL(src);
    const currentHostname = window.location.hostname;
    const isLocalStrapiHost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    const isRemoteFrontendHost =
      currentHostname !== 'localhost' && currentHostname !== '127.0.0.1';

    if (isLocalStrapiHost && isRemoteFrontendHost) {
      url.hostname = currentHostname;
      return url.toString();
    }

    return src;
  } catch {
    return src;
  }
}

export default function FooterMain({ config, locale }: FooterMainProps) {
  const {
    logo,
    backgroundImage,
    linkGroups,
    contactTitle,
    addressLines,
    phones,
    email,
    socialLinks,
    rightsText,
  } = config;
  const resolvedBackgroundImageSrc = resolveBrowserImageUrl(backgroundImage.src);
  const resolvedLogoSrc = resolveBrowserImageUrl(logo.src);
  const useNativeBackgroundImage = !resolvedBackgroundImageSrc.startsWith('/');
  const useNativeLogoImage = !resolvedLogoSrc.startsWith('/');

  return (
    <footer className="relative mt-24 overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0">
        {useNativeBackgroundImage ? (
          <img
            src={resolvedBackgroundImageSrc}
            alt={backgroundImage.alt}
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            src={resolvedBackgroundImageSrc}
            alt={backgroundImage.alt}
            fill
            priority
            className="object-cover"
          />
        )}
        <div className="absolute inset-0" />
      </div>

      <div className="pointer-events-none absolute -bottom-12 -right-72 z-10 hidden h-[50%] w-[65%] lg:block">
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

      <div className="relative z-10 px-4 pb-10 pt-16 md:px-6 md:pt-24 lg:px-4 lg:pt-[237px]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-12">
          <div className="mt-36 flex flex-col items-center gap-6 text-center md:mt-28 lg:mt-0">
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
              {useNativeLogoImage ? (
                <img
                  src={resolvedLogoSrc}
                  alt={logo.alt}
                  className="h-12 w-auto md:h-16 lg:h-20"
                />
              ) : (
                <Image
                  src={resolvedLogoSrc}
                  alt={logo.alt}
                  width={1080}
                  height={168}
                  className="h-12 w-auto md:h-16 lg:h-20"
                />
              )}
            </div>
          </div>

          <div className="mt-8 ml-2 grid w-full max-w-[1080px] grid-cols-2 gap-x-4 gap-y-10 md:mt-10 md:ml-4 md:grid-cols-3 md:gap-x-12 lg:mt-10 lg:ml-8 lg:grid-cols-3 lg:gap-x-0 lg:gap-y-6 xl:gap-x-0">
            {linkGroups.map((group) => (
              <FooterLinksColumn
                key={group.title}
                title={group.title}
                links={group.links}
                locale={locale}
              />
            ))}

            <div className="hidden items-start justify-end pr-4 md:flex lg:hidden">
              <div className="pt-[54px]">
                <FooterSocials links={socialLinks} />
              </div>
            </div>

            <div className="col-span-2 flex items-end justify-between md:col-span-3 lg:col-span-1">
              <div className="w-full">
                <FooterContact
                  title={contactTitle}
                  addressLines={addressLines}
                  phones={phones}
                  email={email}
                />
              </div>
              <div className="pb-1 md:hidden">
                <FooterSocials links={socialLinks} />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 text-[11px] text-white/50 md:flex-row md:text-xs">
            <p className="max-w-[300px] text-center md:max-w-none md:text-left">
              {rightsText}
            </p>
            <div className="flex items-center gap-1">
              <span>Designed and Developed by</span>
              <a href="http://graphics.lk/" className="hover:text-[#A1DF0A]" target="_blank">
                Graphics.lk
              </a>
            </div>
          </div>
        </div>

        <FooterSocials
          links={socialLinks}
          className="pointer-events-auto absolute right-10 hidden lg:flex xl:right-16 lg:top-[12%] xl:top-1/4"
        />
      </div>
    </footer>
  );
}
