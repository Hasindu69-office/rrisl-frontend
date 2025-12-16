import React from 'react';
import type { FooterLink } from './footerData';

interface FooterLinksColumnProps {
  title: string;
  links: FooterLink[];
}

export default function FooterLinksColumn({ title, links }: FooterLinksColumnProps) {
  return (
    <div>
      <h3 className="text-[30px] font-semibold leading-[128%] text-white">
        {title}
      </h3>
      <ul className="mt-[54px] space-y-[20px] text-white">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-[18px] leading-[35px] font-normal text-white transition-colors hover:text-[#A1DF0A]"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}



