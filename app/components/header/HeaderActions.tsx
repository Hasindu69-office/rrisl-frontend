'use client';

import React from 'react';
import HeaderCta from './HeaderCta';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import { HeaderCtaItem, MenuItem } from '@/app/lib/types';
import MobileMenu from './MobileMenu';

interface HeaderActionsProps {
  leftMenuItems?: MenuItem[];
  headerCta?: HeaderCtaItem | null;
}

export default function HeaderActions(props: HeaderActionsProps) {
  const leftMenuItems = props.leftMenuItems ?? [];
  const headerCta = props.headerCta ?? null;

  return (
    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
      <div className="hidden sm:block xl:mr-[40px]">
        <HeaderCta item={headerCta} />
      </div>

      <LanguageSwitcher />

      <div className="xl:hidden">
        <MobileMenu menuItems={leftMenuItems} headerCta={headerCta} />
      </div>
    </div>
  );
}

