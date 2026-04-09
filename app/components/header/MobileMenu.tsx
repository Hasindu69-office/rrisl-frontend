'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { MenuItem as MenuItemType } from '@/app/lib/types';
import { addLocaleToUrl } from '@/app/lib/locale';

interface MobileMenuProps {
  menuItems: MenuItemType[];
}

interface MobileMenuListProps {
  items: MenuItemType[];
  expandedIds: Set<string>;
  level: number;
  activePath: string[];
  getLocalizedUrl: (url: string) => string;
  isItemActive: (item: MenuItemType) => boolean;
  onCloseMenu: () => void;
  onToggleItem: (itemId: string) => void;
}

function normalizeUrl(url: string) {
  if (!url) {
    return '/';
  }

  try {
    const parsedUrl = new URL(url, 'https://rrisl.local');
    return parsedUrl.pathname || '/';
  } catch {
    return url.split('?')[0] || '/';
  }
}

function findActivePath(items: MenuItemType[], pathname: string): string[] {
  for (const item of items) {
    const normalizedUrl = normalizeUrl(item.url);
    const isDirectMatch =
      normalizedUrl === '/'
        ? pathname === '/'
        : pathname === normalizedUrl || pathname.startsWith(`${normalizedUrl}/`);

    if (isDirectMatch) {
      return [item.id];
    }

    if (item.children?.length) {
      const childPath = findActivePath(item.children, pathname);
      if (childPath.length > 0) {
        return [item.id, ...childPath];
      }
    }
  }

  return [];
}

function isExternalUrl(url: string) {
  return url.startsWith('http') || url.startsWith('//');
}

function MobileMenuList({
  items,
  expandedIds,
  level,
  activePath,
  getLocalizedUrl,
  isItemActive,
  onCloseMenu,
  onToggleItem,
}: MobileMenuListProps) {
  return (
    <div className={level === 0 ? 'flex flex-col gap-1.5' : 'mt-1 flex flex-col gap-1'}>
      {items.map((item) => {
        const hasChildren = Boolean(item.children?.length);
        const isExpanded = expandedIds.has(item.id);
        const isActive = isItemActive(item);
        const isInActivePath = activePath.includes(item.id);
        const submenuId = `mobile-submenu-${item.id}`;

        return (
          <div
            key={item.id || item.url}
            className="overflow-hidden rounded-[20px] bg-transparent transition-colors duration-200 motion-reduce:transition-none"
          >
            <div
              className={`flex items-center gap-2 ${
                level === 0 ? 'px-2 py-1.5' : 'pl-4 pr-2 py-1.5'
              }`}
              style={level > 0 ? { paddingLeft: `${Math.min(level, 4) * 16}px` } : undefined}
            >
              <Link
                href={getLocalizedUrl(item.url)}
                target={item.target || '_self'}
                onClick={onCloseMenu}
                className={`flex-1 rounded-[16px] px-3 py-2.5 text-sm font-medium transition-colors duration-200 outline-none motion-reduce:transition-none sm:text-base ${
                  isActive
                    ? 'text-green-300'
                    : 'text-white hover:text-green-300'
                }`}
              >
                {item.title}
              </Link>

              {hasChildren ? (
                <button
                  type="button"
                  aria-label={`Toggle ${item.title} submenu`}
                  aria-expanded={isExpanded}
                  aria-haspopup="menu"
                  aria-controls={submenuId}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onToggleItem(item.id);
                  }}
                  className={`rounded-full p-2 transition-colors duration-200 motion-reduce:transition-none ${
                    isExpanded || isInActivePath
                      ? 'bg-white/10 text-green-300'
                      : 'text-[#C8D4D9] hover:bg-white/10 hover:text-green-300'
                  }`}
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 motion-reduce:transition-none ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              ) : null}
            </div>

            {hasChildren ? (
              <div
                id={submenuId}
                role="menu"
                aria-label={item.title}
                className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${
                  isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="min-h-0 border-l border-white/10 ml-5 mr-3 mb-2">
                  <MobileMenuList
                    items={item.children ?? []}
                    expandedIds={expandedIds}
                    level={level + 1}
                    activePath={activePath}
                    getLocalizedUrl={getLocalizedUrl}
                    isItemActive={isItemActive}
                    onCloseMenu={onCloseMenu}
                    onToggleItem={onToggleItem}
                  />
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default function MobileMenu({ menuItems }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = searchParams.get('locale') || 'en';

  const activePath = useMemo(() => findActivePath(menuItems, pathname ?? '/'), [menuItems, pathname]);

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

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const getLocalizedUrl = (url: string) => {
    if (isExternalUrl(url)) {
      return url;
    }

    return addLocaleToUrl(url, currentLocale);
  };

  const isItemActive = (item: MenuItemType): boolean => {
    if (!pathname) {
      return false;
    }

    const normalizedUrl = normalizeUrl(item.url);
    const selfActive =
      normalizedUrl === '/'
        ? pathname === '/'
        : pathname === normalizedUrl || pathname.startsWith(`${normalizedUrl}/`);

    if (selfActive) {
      return true;
    }

    return item.children?.some((child) => isItemActive(child)) ?? false;
  };

  const handleToggleItem = (itemId: string) => {
    setExpandedIds((currentExpandedIds) => {
      const nextExpandedIds = new Set(currentExpandedIds);

      if (nextExpandedIds.has(itemId)) {
        nextExpandedIds.delete(itemId);
      } else {
        nextExpandedIds.add(itemId);
      }

      return nextExpandedIds;
    });
  };

  const handleCloseMenu = () => {
    setExpandedIds(new Set());
    setIsOpen(false);
  };

  const handleToggleMenu = () => {
    if (isOpen) {
      setExpandedIds(new Set());
      setIsOpen(false);
      return;
    }

    setExpandedIds(new Set(activePath.slice(0, -1)));
    setIsOpen(true);
  };

  return (
    <>
      <button
        onClick={handleToggleMenu}
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

      {typeof document !== 'undefined'
        ? createPortal(
            <>
              <div
                className={`fixed inset-0 bg-black/50 z-[90] xl:hidden transition-opacity duration-300 ease-in-out ${
                  isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={handleCloseMenu}
              />

              <div
                className={`fixed inset-y-0 right-0 h-dvh w-80 max-w-[85vw] bg-gray-900 z-[100] xl:hidden shadow-xl overflow-y-auto transition-transform duration-300 ease-in-out ${
                  isOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
                }`}
              >
                <div className="p-6">
                  <div className="mb-6 flex justify-end">
                    <button
                      onClick={handleCloseMenu}
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

                  <nav className="mb-8" aria-label="Mobile navigation">
                    <MobileMenuList
                      items={menuItems}
                      expandedIds={expandedIds}
                      level={0}
                      activePath={activePath}
                      getLocalizedUrl={getLocalizedUrl}
                      isItemActive={isItemActive}
                      onCloseMenu={handleCloseMenu}
                      onToggleItem={handleToggleItem}
                    />
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
