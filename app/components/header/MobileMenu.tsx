'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import Button from '../ui/Button';
import { MenuItem as MenuItemType } from '@/app/lib/types';
import { addLocaleToUrl } from '@/app/lib/locale';

interface MobileMenuProps {
  menuItems: MenuItemType[];
  headerRightMenuItems?: MenuItemType[];
}

export default function MobileMenu({ menuItems, headerRightMenuItems = [] }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = searchParams.get('locale') || 'en';

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

  // Flatten menu items for mobile display
  const flattenMenuItems = (items: MenuItemType[]): MenuItemType[] => {
    const flattened: MenuItemType[] = [];
    items.forEach((item) => {
      flattened.push(item);
      if (item.children && item.children.length > 0) {
        flattened.push(...flattenMenuItems(item.children));
      }
    });
    return flattened;
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 text-white hover:text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 rounded bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <svg
          className="w-6 h-6"
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
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-80 bg-gray-900 z-50 lg:hidden shadow-xl overflow-y-auto">
            <div className="p-6">
              {/* Close Button */}
              <div className="flex justify-end mb-6">
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
              <nav className="flex flex-col gap-4 mb-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.id || item.url}
                    href={getLocalizedUrl(item.url)}
                    target={item.target || '_self'}
                    onClick={() => setIsOpen(false)}
                    className={`text-base font-medium py-2 px-4 rounded transition-colors ${
                      isActive(item.url)
                        ? 'text-green-400 bg-green-400/10'
                        : 'text-white hover:text-green-400 hover:bg-gray-800'
                    }`}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                {headerRightMenuItems.length > 0 ? (
                  headerRightMenuItems.map((item, index) => (
                    <Link
                      key={item.id || item.url}
                      href={getLocalizedUrl(item.url)}
                      target={item.target || '_self'}
                      onClick={() => setIsOpen(false)}
                    >
                      <Button variant={index === 0 ? 'primary' : 'outline'} size="md" className="w-full">
                        {item.title}
                      </Button>
                    </Link>
                  ))
                ) : (
                  <>
                    <Link href={getLocalizedUrl('/researchers')} onClick={() => setIsOpen(false)}>
                      <Button variant="primary" size="md" className="w-full">
                        Researchers
                      </Button>
                    </Link>
                    
                    <Link href={getLocalizedUrl('/knowledge-hub')} onClick={() => setIsOpen(false)}>
                      <Button variant="outline" size="md" className="w-full">
                        Knowledge Hub
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

