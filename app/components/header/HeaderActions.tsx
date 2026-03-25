'use client';

import React from 'react';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import { MenuItem } from '@/app/lib/types';
import MobileMenu from './MobileMenu';

interface HeaderActionsProps {
  menuItems?: MenuItem[];
  leftMenuItems?: MenuItem[];
}

export default function HeaderActions({ menuItems = [], leftMenuItems = [] }: HeaderActionsProps) {

  return (
    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">

      {/* Language Switcher */}
      <LanguageSwitcher />

      {/* Mobile Menu Hamburger - Only on mobile (hide on tablet and up) */}
      <div className="xl:hidden">
        <MobileMenu
          menuItems={leftMenuItems}
          headerRightMenuItems={menuItems}
        />
      </div>
    </div>
  );
}

