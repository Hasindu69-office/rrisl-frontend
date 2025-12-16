import React from 'react';
import type { FooterSocialLink } from './footerData';
import Image from 'next/image';

interface FooterSocialsProps {
  links: FooterSocialLink[];
  className?: string;
}

const iconMap: Record<FooterSocialLink['type'], string> = {
  facebook: '/images/footer_facebook.svg',
  instagram: '/images/footer_instagram.svg',
  linkedin: '/images/footer_linkedin.svg',
  youtube: '/images/footer_youtube.svg',
};

export default function FooterSocials({ links, className = '' }: FooterSocialsProps) {
  if (!links.length) return null;

  return (
    <div
      className={`flex flex-col items-center gap-3 ${className}`}
      aria-label="Social media links"
    >
      {links.map((link) => {
        const iconSrc = iconMap[link.type];

        return (
          <a
            key={link.type}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Visit our ${link.type} page`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#22C55E]/40 bg-black/40 text-white transition hover:border-[#A1DF0A] hover:bg-[#22C55E]/20"
          >
            <Image
              src={iconSrc}
              alt=""
              width={18}
              height={18}
              aria-hidden="true"
            />
          </a>
        );
      })}
    </div>
  );
}



