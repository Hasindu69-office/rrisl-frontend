'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { createPortal } from 'react-dom';
import { MenuItem as MenuItemType } from '@/app/lib/types';
import { addLocaleToUrl } from '@/app/lib/locale';

interface MobileMenuProps {
  menuItems: MenuItemType[];
}

export default function MobileMenu({ menuItems }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = searchParams.get('locale') || 'en';

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const { body } = document;
    const previousOverflow = body.style.overflow;

    if (isOpen) {
      body.style.overflow = 'hidden';
    }

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const isActive = (url: string) => {
    if (url === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(url);
  };

  // Helper to preserve locale in links
  const getLocalizedUrl = (url: string) => {
    // Only preserve locale for internal links
    if (url.startsWith('http') || url.startsWith('//')) {
      return url;
    }
    return addLocaleToUrl(url, currentLocale);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="xl:hidden p-2 text-[#546F7A] hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg bg-white hover:bg-gray-50 transition-colors"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {typeof document !== 'undefined'
        ? createPortal(
            <>
              {/* Backdrop */}
              <div
                className={`fixed inset-0 bg-black/50 z-[90] xl:hidden transition-opacity duration-300 ease-in-out ${
                  isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsOpen(false)}
              />

              {/* Menu Panel */}
              <div
                className={`fixed inset-y-0 right-0 h-dvh w-80 max-w-[85vw] bg-gray-900 z-[100] xl:hidden shadow-xl overflow-y-auto transition-transform duration-300 ease-in-out ${
                  isOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
                }`}
              >
                <div className="p-6">
                  {/* Close Button */}
                  <div className="mb-6 flex justify-end">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 text-white hover:text-green-400 focus:outline-none"
                      aria-label="Close menu"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Navigation Links */}
                  <nav className="mb-8 flex flex-col gap-4">
                    {menuItems.map((item) => (
                      <Link
                        key={item.id || item.url}
                        href={getLocalizedUrl(item.url)}
                        target={item.target || '_self'}
                        onClick={() => setIsOpen(false)}
                        className={`rounded px-4 py-2 text-base font-medium transition-colors ${
                          isActive(item.url)
                            ? 'text-green-400 bg-green-400/10'
                            : 'text-white hover:text-green-400 hover:bg-gray-800'
                        }`}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
            </>,
            document.body,
          )
        : null}
    </>
  );
}

