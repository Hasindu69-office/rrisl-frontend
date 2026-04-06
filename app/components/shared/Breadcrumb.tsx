import React from 'react';
import Link from 'next/link';
import { addLocaleToUrl } from '@/app/lib/locale';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  variant?: 'light' | 'dark';
  className?: string;
  locale?: string;
}

export default function Breadcrumb({
  items,
  variant = 'light',
  className = '',
  locale = 'en',
}: BreadcrumbProps) {
  const isDark = variant === 'dark';

  const getLocalizedUrl = (url: string) => {
    if (url.startsWith('http') || url.startsWith('//')) {
      return url;
    }
    return addLocaleToUrl(url, locale);
  };

  return (
    <nav
      className={`flex items-center space-x-2 text-sm md:text-base ${isDark ? 'text-[#042012]' : 'text-white'} ${className}`.trim()}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {item.href && !isLast ? (
              <Link
                href={getLocalizedUrl(item.href)}
                className={`transition-colors ${isDark ? 'hover:text-[#042012]/80' : 'hover:text-white/80'}`}
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-[#A1DF0A]' : isDark ? 'text-[#042012]/80' : 'text-white/80'}>
                {item.label}
              </span>
            )}
            {!isLast && (
              <span className={`mx-1 ${isDark ? 'text-[#042012]/50' : 'text-white/60'}`}>{'\u00BB'}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
