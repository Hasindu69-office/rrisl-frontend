'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { addLocaleToUrl } from '@/app/lib/locale';
import type { HeaderCtaItem } from '@/app/lib/types';
import Button from '../ui/Button';

interface HeaderCtaProps {
  item?: HeaderCtaItem | null;
  className?: string;
  buttonClassName?: string;
  onClick?: () => void;
}

function isInternalHref(href: string) {
  return href.startsWith('/');
}

export default function HeaderCta({
  item,
  className = '',
  buttonClassName = '',
  onClick,
}: HeaderCtaProps) {
  const searchParams = useSearchParams();
  const currentLocale = searchParams.get('locale') || 'en';

  if (!item?.title || !item?.url) {
    return null;
  }

  const href = isInternalHref(item.url) ? addLocaleToUrl(item.url, currentLocale) : item.url;
  const target = item.target || '_self';
  const rel = target === '_blank' ? 'noopener noreferrer' : undefined;
  const button = (
    <Button
      variant="primary"
      size="sm"
      className={`min-h-[38px] px-[40px] text-xs sm:text-sm md:min-h-[42px] ${buttonClassName}`}
    >
      {item.title}
    </Button>
  );

  if (isInternalHref(item.url)) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {button}
      </Link>
    );
  }

  return (
    <a href={href} target={target} rel={rel} className={className} onClick={onClick}>
      {button}
    </a>
  );
}
