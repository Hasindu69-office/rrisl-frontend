import React from 'react';
import type { FooterLink } from './footerData';

interface FooterLinksColumnProps {
  title: string;
  links: FooterLink[];
}

export default function FooterLinksColumn({ title, links }: FooterLinksColumnProps) {
  return (
    <div>
      <h3 className="text-[20px] md:text-[24px] lg:text-[30px] font-semibold leading-[128%] text-white">
        {title}
      </h3>
      <ul className="mt-6 md:mt-10 lg:mt-[54px] space-y-3 md:space-y-[20px] text-white">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-[14px] md:text-[16px] lg:text-[18px] leading-relaxed md:leading-[35px] font-normal text-white transition-colors hover:text-[#A1DF0A]"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}



