'use client';

import React, { useState, useRef, useEffect, startTransition } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { normalizeLocale } from '@/app/lib/locale';

interface Language {
  code: string;
  name: string;
  locale: string;
}

interface LanguageSwitcherProps {
  languages?: Language[];
}

const defaultLanguages: Language[] = [
  { code: 'en', name: 'English', locale: 'en' },
  { code: 'si', name: 'සිංහල', locale: 'si' },
  { code: 'ta', name: 'தமிழ்', locale: 'ta' },
];

function localeToCode(locale: string | null): string {
  return normalizeLocale(locale);
}

function getCurrentLocale(searchParams: URLSearchParams): string {
  return normalizeLocale(searchParams.get('locale'));
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
  const currentLang =
    languages.find((lang) => lang.code === currentLanguageCode) || languages[0];

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
    const params = new URLSearchParams(searchParams.toString());
    const locale = normalizeLocale(language.locale);

    if (locale === 'en') {
      params.delete('locale');
    } else {
      params.set('locale', locale);
    }

    startTransition(() => {
      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname);
    });

    router.refresh();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-1 sm:px-1.5 md:px-2 py-0.5 sm:py-1 md:py-1 bg-white hover:bg-gray-50 text-[#546F7A] rounded-[12px] sm:rounded-[15px] md:rounded-[20px] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center gap-1 sm:gap-1 !w-[55px] sm:!w-[65px] md:!w-[75px] lg:!w-[80px] !h-[28px] sm:!h-[32px] md:!h-[34px] lg:!h-[38px] justify-center cursor-pointer"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className="text-[9px] sm:text-[11px] md:text-[12px] font-medium">
          {currentLang.code.toUpperCase()}
        </span>
        <svg
          className={`w-2 h-2 sm:w-2.5 sm:h-2.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700 overflow-hidden animate-dropdown-fade">
          <style jsx>{`
            @keyframes dropdownFade {
              from {
                opacity: 0;
                transform: translateY(-12px) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            .animate-dropdown-fade {
              animation: dropdownFade 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              transform-origin: top right;
            }
          `}</style>
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
