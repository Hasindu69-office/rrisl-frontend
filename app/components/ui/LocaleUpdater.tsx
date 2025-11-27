'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Maps locale codes to HTML lang attribute values
 */
function localeToLang(locale: string | null): string {
  if (!locale) return 'en';
  if (locale === 'en') return 'en';
  if (locale.startsWith('si')) return 'si'; // si-LK -> si
  if (locale.startsWith('ta')) return 'ta'; // ta-LK -> ta
  return 'en';
}

/**
 * Client component that updates the HTML lang attribute based on the current locale
 * This ensures accessibility and SEO compliance
 */
export default function LocaleUpdater() {
  const searchParams = useSearchParams();
  const locale = searchParams.get('locale') || 'en';
  const lang = localeToLang(locale);

  useEffect(() => {
    // Update the html lang attribute when locale changes
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  // This component doesn't render anything
  return null;
}

