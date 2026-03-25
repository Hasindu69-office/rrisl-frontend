'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { MenuItem } from '@/app/lib/types';
import { addLocaleToUrl } from '@/app/lib/locale';

interface NavigationProps {
  menuItems: MenuItem[];
}

export default function Navigation({ menuItems }: NavigationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = searchParams.get('locale') || 'en';

  const isActive = (url: string) => {
    if (url === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(url);
  };

  // Helper to preserve locale in links
  const getLocalizedUrl = (url: string) => {
    // Only preserve locale for internal links
    if (url.startsWith('http') || url.startsWith('//')) {
      return url;
    }
    return addLocaleToUrl(url, currentLocale);
  };

  // Flatten menu items to handle nested children
  const flattenMenuItems = (items: MenuItem[]): MenuItem[] => {
    const flattened: MenuItem[] = [];
    items.forEach((item) => {
      flattened.push(item);
      if (item.children && item.children.length > 0) {
        flattened.push(...flattenMenuItems(item.children));
      }
    });
    return flattened;
  };

  // For now, we'll only show top-level items in the main navigation
  // You can add dropdown support later if needed
  const topLevelItems = menuItems.filter((item) => !item.children || item.children.length === 0);

  if (topLevelItems.length === 0) {
    return null;
  }

  return (
    <nav
      className="hidden xl:flex items-center justify-between bg-white/85 rounded-[16px] md:rounded-[20px] lg:rounded-[24px] w-full max-w-[1440px] h-[44px] md:h-[52px] lg:h-[60px] opacity-100 px-6 md:px-10 lg:px-16 mx-auto"
    >
      {topLevelItems.map((item) => (
        <Link
          key={item.id || item.url}
          href={getLocalizedUrl(item.url)}
          target={item.target || '_self'}
          className={`text-[10px] md:text-xs lg:text-base font-medium transition-colors whitespace-nowrap ${isActive(item.url)
            ? 'text-green-600 font-semibold'
            : 'text-gray-800 hover:text-green-600'
            }`}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

