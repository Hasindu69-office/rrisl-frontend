import React from 'react';
import LogoSection from './LogoSection';
import Navigation from './Navigation';
import HeaderActions from './HeaderActions';
import { getGlobalLayout, getMenuBySlug, getResearchManagersPage } from '@/app/lib/strapi';
import { mapResearchMegaMenuImages } from '@/app/lib/navigation/megaMenuImages';
import { mapResearchManagersMenuCopy } from '@/app/lib/navigation/researchManagersMenuCopy';
import { HeaderCtaItem, MenuItem } from '@/app/lib/types';

interface HeaderProps {
  locale?: string;
  compactOnMobile?: boolean;
}

export default async function Header({ locale = 'en', compactOnMobile = false }: HeaderProps) {
  // Fetch global layout first
  const globalLayout = await getGlobalLayout(locale);

  // Fetch menus in parallel using slugs from global layout
  const [leftMenu, rightMenu, researchManagersPage, fallbackResearchManagersPage] = await Promise.all([
    globalLayout?.headerLeftMenuSlug
      ? getMenuBySlug(globalLayout.headerLeftMenuSlug, locale)
      : Promise.resolve(null),
    globalLayout?.headerRightMenuSlug
      ? getMenuBySlug(globalLayout.headerRightMenuSlug, locale)
      : Promise.resolve(null),
    getResearchManagersPage(locale),
    locale !== 'en' ? getResearchManagersPage('en') : Promise.resolve(null),
  ]);

  // Extract menu items
  const leftMenuItems: MenuItem[] = leftMenu?.items || [];
  const researchMegaMenuImages = mapResearchMegaMenuImages(leftMenu);
  const researchManagersMenuCopy = mapResearchManagersMenuCopy(
    researchManagersPage,
    fallbackResearchManagersPage,
  );
  const rightMenuFirstItem = rightMenu?.items?.[0];
  const headerCta: HeaderCtaItem | null =
    rightMenuFirstItem?.title?.trim() && rightMenuFirstItem?.url?.trim()
      ? {
          title: rightMenuFirstItem.title.trim(),
          url: rightMenuFirstItem.url.trim(),
          target: rightMenuFirstItem.target || '_self',
        }
      : null;

  return (
    <header className="relative z-[160] bg-transparent">
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
            <HeaderActions leftMenuItems={leftMenuItems} headerCta={headerCta} />
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
            <Navigation
              menuItems={leftMenuItems}
              researchMegaMenuImages={researchMegaMenuImages}
              researchManagersMenuCopy={researchManagersMenuCopy}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

