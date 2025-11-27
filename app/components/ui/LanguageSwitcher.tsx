'use client';

import React, { useState, useRef, useEffect, startTransition } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

interface Language {
  code: string;
  name: string;
  locale: string; // Backend locale format (e.g., 'en', 'si-LK', 'ta-LK')
}

interface LanguageSwitcherProps {
  languages?: Language[];
}

// Default languages with backend locale mapping
const defaultLanguages: Language[] = [
  { code: 'en', name: 'English', locale: 'en' },
  { code: 'si', name: 'සිංහල', locale: 'si-LK' },
  { code: 'ta', name: 'தமிழ்', locale: 'ta-LK' },
];

/**
 * Convert backend locale to language code
 * e.g., 'si-LK' -> 'si', 'ta-LK' -> 'ta', 'en' -> 'en'
 */
function localeToCode(locale: string | null): string {
  if (!locale) return 'en';
  if (locale === 'en') return 'en';
  if (locale.startsWith('si')) return 'si';
  if (locale.startsWith('ta')) return 'ta';
  return 'en';
}

/**
 * Get current locale from URL search params
 */
function getCurrentLocale(searchParams: URLSearchParams): string {
  return searchParams.get('locale') || 'en';
}

export default function LanguageSwitcher({
  languages = defaultLanguages,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentLocale = getCurrentLocale(searchParams);
  const currentLanguageCode = localeToCode(currentLocale);
  const currentLang = languages.find((lang) => lang.code === currentLanguageCode) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (language: Language) => {
    // Create new URLSearchParams with updated locale
    const params = new URLSearchParams(searchParams.toString());
    params.set('locale', language.locale);

    // Update the URL with the new locale parameter
    // Use replace to avoid adding to history
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
    // Refresh after navigation to re-fetch server components with new locale
    router.refresh();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium">{currentLang.code.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700">
          <ul className="py-1">
            {languages.map((language) => (
              <li key={language.code}>
                <button
                  onClick={() => handleLanguageChange(language)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    currentLanguageCode === language.code
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="font-medium">{language.code.toUpperCase()}</span>
                  <span className="ml-2 text-gray-500 dark:text-gray-400">{language.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

