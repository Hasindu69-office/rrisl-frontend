import React from 'react';
import LogoSection from './LogoSection';
import Navigation from './Navigation';
import HeaderActions from './HeaderActions';
import { getGlobalLayout, getMenuBySlug } from '@/app/lib/strapi';
import { MenuItem } from '@/app/lib/types';

interface HeaderProps {
  locale?: string;
  compactOnMobile?: boolean;
}

export default async function Header({ locale = 'en', compactOnMobile = false }: HeaderProps) {
  // Fetch global layout first
  const globalLayout = await getGlobalLayout(locale);

  // Fetch menus in parallel using slugs from global layout
  const [leftMenu] = await Promise.all([
    globalLayout?.headerLeftMenuSlug
      ? getMenuBySlug(globalLayout.headerLeftMenuSlug, locale)
      : Promise.resolve(null),
  ]);

  // Extract menu items
  const leftMenuItems: MenuItem[] = leftMenu?.items || [];

  return (
    <header className="relative z-50 bg-transparent">
      {/* Content on top of background */}
      <div className="relative z-10">
        {/* Top Section - Logo and Actions */}
        <div
          className={`container mx-auto max-w-[1440px] w-full px-3 sm:px-4 md:px-5 lg:px-8 ${
            compactOnMobile ? 'py-1.5 sm:py-2.5 md:py-3' : 'py-2 sm:py-3 md:py-3'
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Left: Logo Section */}
            <LogoSection globalLayout={globalLayout} />

            {/* Right: Actions (Buttons + Language Switcher + Hamburger) */}
            <HeaderActions leftMenuItems={leftMenuItems} />
          </div>
        </div>

        {/* Bottom Section - Navigation (Tablet and Desktop) */}
        <div
          className={`hidden xl:block container mx-auto max-w-[1440px] w-full px-3 sm:px-4 md:px-5 lg:px-8 ${
            compactOnMobile ? 'pb-2 sm:pb-2.5 md:pb-3' : 'pb-2 sm:pb-3 md:pb-3'
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Desktop Navigation with transparent white background */}
            <Navigation menuItems={leftMenuItems} />
          </div>
        </div>
      </div>
    </header>
  );
}

