'use client';

import React from 'react';
import HeaderCta from './HeaderCta';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import { MenuItem } from '@/app/lib/types';
import MobileMenu from './MobileMenu';

interface HeaderActionsProps {
  leftMenuItems?: MenuItem[];
}

export default function HeaderActions(props: HeaderActionsProps) {
  const leftMenuItems = props.leftMenuItems ?? [];

  return (
    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
      <div className="hidden sm:block xl:mr-[40px]">
        <HeaderCta />
      </div>

      <LanguageSwitcher />

      <div className="xl:hidden">
        <MobileMenu menuItems={leftMenuItems} />
      </div>
    </div>
  );
}

