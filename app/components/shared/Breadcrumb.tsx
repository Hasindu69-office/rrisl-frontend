'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { addLocaleToUrl } from '@/app/lib/locale';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const searchParams = useSearchParams();
  const currentLocale = searchParams.get('locale') || 'en';

  const getLocalizedUrl = (url: string) => {
    if (url.startsWith('http') || url.startsWith('//')) {
      return url;
    }
    return addLocaleToUrl(url, currentLocale);
  };

  return (
    <nav className="flex items-center space-x-2 text-white text-sm md:text-base" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <React.Fragment key={index}>
            {item.href && !isLast ? (
              <Link
                href={getLocalizedUrl(item.href)}
                className="hover:text-white/80 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-[#A1DF0A]' : 'text-white/80'}>
                {item.label}
              </span>
            )}
            {!isLast && (
              <span className="text-white/60 mx-1">»</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

