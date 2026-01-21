import React from 'react';
import type { FooterLink } from './footerData';

interface FooterLinksColumnProps {
  title: string;
  links: FooterLink[];
}

export default function FooterLinksColumn({ title, links }: FooterLinksColumnProps) {
  return (
    <div>
      <h3 className="text-[18px] md:text-[20px] lg:text-[24px] font-semibold leading-[128%] text-white">
        {title}
      </h3>
      <ul className="mt-4 md:mt-6 lg:mt-[30px] space-y-2 md:space-y-3 text-white">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-[12px] md:text-[14px] lg:text-[15px] leading-relaxed md:leading-[28px] font-normal text-white transition-colors hover:text-[#A1DF0A]"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}



