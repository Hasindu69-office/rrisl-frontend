import React from 'react';
import LogoSection from './LogoSection';
import Navigation from './Navigation';
import HeaderActions from './HeaderActions';
import MobileMenu from './MobileMenu';
import { getGlobalLayout, getMenuBySlug } from '@/app/lib/strapi';
import { MenuItem } from '@/app/lib/types';

interface HeaderProps {
  locale?: string;
}

export default async function Header({ locale = 'en' }: HeaderProps) {
  // Fetch global layout first
  const globalLayout = await getGlobalLayout(locale);

  // Fetch menus in parallel using slugs from global layout
  const [leftMenu, rightMenu] = await Promise.all([
    globalLayout?.headerLeftMenuSlug
      ? getMenuBySlug(globalLayout.headerLeftMenuSlug, locale)
      : Promise.resolve(null),
    globalLayout?.headerRightMenuSlug
      ? getMenuBySlug(globalLayout.headerRightMenuSlug, locale)
      : Promise.resolve(null),
  ]);

  // Extract menu items
  const leftMenuItems: MenuItem[] = leftMenu?.items || [];
  const rightMenuItems: MenuItem[] = rightMenu?.items || [];

  return (
    <header className="relative z-50 bg-transparent">
      {/* Content on top of background */}
      <div className="relative z-10">
        {/* Top Section - Logo and Actions */}
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Logo Section */}
            <LogoSection globalLayout={globalLayout} />

            {/* Right: Actions (Buttons + Language Switcher) */}
            <HeaderActions menuItems={rightMenuItems} />
          </div>
        </div>

        {/* Bottom Section - Navigation */}
        <div className="container mx-auto px-4 pb-3">
          <div className="flex items-center justify-between">
            {/* Desktop Navigation with transparent white background */}
            <Navigation menuItems={leftMenuItems} />

            {/* Mobile Menu Button */}
            <MobileMenu 
              menuItems={leftMenuItems} 
              headerRightMenuItems={rightMenuItems}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

