import React from 'react';
import Link from 'next/link';

import type { FooterLink } from './footerData';

interface FooterLinksColumnProps {
  title: string;
  links: FooterLink[];
  locale: string;
}

function isExternalUrl(url: string) {
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//');
}

function getLocalizedUrl(url: string, locale: string) {
  if (!url || isExternalUrl(url) || locale === 'en') {
    return url;
  }

  const [path, queryString] = url.split('?');
  const params = new URLSearchParams(queryString || '');
  params.set('locale', locale);

  const nextQuery = params.toString();
  return nextQuery ? `${path}?${nextQuery}` : path;
}

export default function FooterLinksColumn({
  title,
  links,
  locale,
}: FooterLinksColumnProps) {
  return (
    <div>
      <h3 className="text-[18px] font-semibold leading-[128%] text-white md:text-[20px] lg:text-[24px]">
        {title}
      </h3>
      <ul className="mt-4 space-y-2 text-white md:mt-6 md:space-y-3 lg:mt-[30px]">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={getLocalizedUrl(link.href, locale) || '#'}
              target={link.openInNewTab ? '_blank' : undefined}
              rel={link.openInNewTab ? 'noreferrer' : undefined}
              className="text-[12px] font-normal leading-relaxed text-white transition-colors hover:text-[#A1DF0A] md:text-[14px] md:leading-[28px] lg:text-[15px]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
