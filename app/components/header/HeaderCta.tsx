'use client';

import React from 'react';
import Link from 'next/link';
import Button from '../ui/Button';

const HEADER_CTA = {
  label: 'e-Testing',
  href: '#',
};

interface HeaderCtaProps {
  className?: string;
  buttonClassName?: string;
  onClick?: () => void;
}

function isInternalHref(href: string) {
  return href.startsWith('/');
}

export default function HeaderCta({
  className = '',
  buttonClassName = '',
  onClick,
}: HeaderCtaProps) {
  const button = (
    <Button
      variant="primary"
      size="sm"
      className={`min-h-[38px] px-[40px] text-xs sm:text-sm md:min-h-[42px] ${buttonClassName}`}
    >
      {HEADER_CTA.label}
    </Button>
  );

  if (isInternalHref(HEADER_CTA.href)) {
    return (
      <Link href={HEADER_CTA.href} className={className} onClick={onClick}>
        {button}
      </Link>
    );
  }

  return (
    <a href={HEADER_CTA.href} className={className} onClick={onClick}>
      {button}
    </a>
  );
}
