'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Button from '../ui/Button';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import { MenuItem } from '@/app/lib/types';
import { addLocaleToUrl } from '@/app/lib/locale';

interface HeaderActionsProps {
  menuItems?: MenuItem[];
}

export default function HeaderActions({ menuItems = [] }: HeaderActionsProps) {
  const searchParams = useSearchParams();
  const currentLocale = searchParams.get('locale') || 'en';

  // If menu items are provided from Strapi, use them
  // Otherwise, use default buttons
  const hasMenuItems = menuItems && menuItems.length > 0;

  // Helper to preserve locale in links
  const getLocalizedUrl = (url: string) => {
    // Only preserve locale for internal links
    if (url.startsWith('http') || url.startsWith('//')) {
      return url;
    }
    return addLocaleToUrl(url, currentLocale);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Action Buttons from Strapi menu or default */}
      {hasMenuItems ? (
        menuItems.map((item, index) => (
          <Link
            key={item.id || item.url}
            href={getLocalizedUrl(item.url)}
            target={item.target || '_self'}
            className="hidden md:inline-block"
          >
            {/* First button uses primary, second uses outline */}
            <Button variant={index === 0 ? 'primary' : 'outline'} size="sm">
              {item.title}
            </Button>
          </Link>
        ))
      ) : (
        <>
          <Link href={getLocalizedUrl('/researchers')} className="hidden md:inline-block">
            <Button 
              variant="primary" 
              size="sm"
              className="!w-[178px] !h-[56px] !rounded-[30px] !bg-[#2E7D32] hover:!bg-[#2E7D32]/90"
            >
              Researchers
            </Button>
          </Link>
          
          <Link href={getLocalizedUrl('/knowledge-hub')} className="hidden md:inline-block">
            <Button variant="outline" size="sm">
              Knowledge Hub
            </Button>
          </Link>
        </>
      )}

      {/* Language Switcher */}
      <LanguageSwitcher />
    </div>
  );
}

