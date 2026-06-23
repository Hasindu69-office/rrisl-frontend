'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { normalizeLocale } from '@/app/lib/locale';
import { getFooter } from '@/app/lib/strapi';

import FooterNewsletter from './FooterNewsletter';
import FooterMain from './FooterMain';
import { footerConfig, mapFooterToConfig, type FooterConfig } from './footerData';

export default function Footer() {
  const searchParams = useSearchParams();
  const locale = normalizeLocale(searchParams.get('locale'));
  const [config, setConfig] = useState<FooterConfig>(footerConfig);

  useEffect(() => {
    let isActive = true;

    async function loadFooter() {
      try {
        const footer = await getFooter(locale);

        if (!isActive) {
          return;
        }

        setConfig(mapFooterToConfig(footer));
      } catch (error) {
        console.error('Failed to load footer content:', error);

        if (isActive) {
          setConfig(footerConfig);
        }
      }
    }

    void loadFooter();

    return () => {
      isActive = false;
    };
  }, [locale]);

  return (
    <div className="-mt-[200px] md:-mt-[236px] lg:-mt-[248px]">
      <div className="-mb-[220px]">
        <FooterNewsletter />
      </div>
      <FooterMain config={config} locale={locale} />
    </div>
  );
}
