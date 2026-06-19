'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { MenuItem } from '@/app/lib/types';
import { addLocaleToUrl } from '@/app/lib/locale';

interface NavigationProps {
  menuItems: MenuItem[];
}

interface DesktopMenuListProps {
  items: MenuItem[];
  level: number;
  parentPath: string[];
  openPath: string[];
  onOpenPath: (path: string[]) => void;
  onTogglePath: (path: string[]) => void;
  onCloseAll: () => void;
  getLocalizedUrl: (url: string) => string;
  isItemActive: (item: MenuItem) => boolean;
}

const SUBMENU_COLUMN_MAX_ITEMS = 6;
const SUBMENU_COLUMN_SPLIT_THRESHOLD = 7;

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

function isPlaceholderUrl(url: string | null | undefined) {
  const trimmedUrl = url?.trim();
  return !trimmedUrl || trimmedUrl.startsWith('#');
}

function normalizeNavigableUrl(url: string | null | undefined) {
  if (isPlaceholderUrl(url)) {
    return null;
  }

  return normalizeUrl(url as string);
}

function matchesPath(url: string | null | undefined, pathname: string) {
  const normalizedUrl = normalizeNavigableUrl(url);

  if (!normalizedUrl) {
    return false;
  }

  return normalizedUrl === '/'
    ? pathname === '/'
    : pathname === normalizedUrl || pathname.startsWith(`${normalizedUrl}/`);
}

function isExternalUrl(url: string) {
  return url.startsWith('http') || url.startsWith('//');
}

function isPathPrefix(prefix: string[], path: string[]) {
  return prefix.every((segment, index) => path[index] === segment);
}

function chunkMenuItems(items: MenuItem[], size: number) {
  const chunks: MenuItem[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

interface DesktopMenuEntryProps extends Omit<DesktopMenuListProps, 'items'> {
  item: MenuItem;
}

function DesktopMenuEntry({
  item,
  level,
  parentPath,
  openPath,
  onOpenPath,
  onTogglePath,
  onCloseAll,
  getLocalizedUrl,
  isItemActive,
}: DesktopMenuEntryProps) {
  const itemRef = useRef<HTMLDivElement | null>(null);
  const submenuRef = useRef<HTMLDivElement | null>(null);
  const [submenuOffsetTop, setSubmenuOffsetTop] = useState(0);
  const isRootLevel = level === 0;
  const itemPath = [...parentPath, item.id];
  const hasChildren = Boolean(item.children?.length);
  const isOpen = hasChildren && isPathPrefix(itemPath, openPath);
  const isActive = isItemActive(item);
  const submenuId = `desktop-submenu-${itemPath.join('-')}`;

  useLayoutEffect(() => {
    if (isRootLevel || !hasChildren) {
      return;
    }

    const updateOffset = () => {
      const itemElement = itemRef.current;
      const submenuElement = submenuRef.current;

      if (!itemElement || !submenuElement) {
        setSubmenuOffsetTop(0);
        return;
      }

      const viewportPadding = 24;
      const itemRect = itemElement.getBoundingClientRect();
      const submenuRect = submenuElement.getBoundingClientRect();
      const bottomLimit = window.innerHeight - viewportPadding;
      const bottomOverflow = Math.max(0, submenuRect.bottom - bottomLimit);
      const maxUpwardShift = Math.max(0, itemRect.top - viewportPadding);
      const nextOffsetTop = -Math.min(bottomOverflow, maxUpwardShift);

      setSubmenuOffsetTop(nextOffsetTop);
    };

    updateOffset();
    window.addEventListener('resize', updateOffset);

    return () => {
      window.removeEventListener('resize', updateOffset);
    };
  }, [hasChildren, isOpen, isRootLevel, item.children, item.title]);

  return (
    <div
      ref={itemRef}
      key={item.id || item.url}
      className={isRootLevel ? 'relative flex h-full items-center' : 'relative'}
      onMouseEnter={() => {
        if (hasChildren) {
          onOpenPath(itemPath);
        }
      }}
    >
      <div
        className={
          isRootLevel
            ? 'flex items-center gap-1'
            : `flex w-full items-center gap-2 rounded-[16px] transition-[background-color,color] duration-200 motion-reduce:transition-none ${
                isActive ? 'bg-green-50 text-green-700' : 'text-[#1F2937] hover:bg-[#F5F8F2] hover:text-green-700'
              }`
        }
      >
        <Link
          href={getLocalizedUrl(item.url)}
          target={item.target || '_self'}
          onFocus={() => {
            if (hasChildren) {
              onOpenPath(itemPath);
            }
          }}
          onClick={() => {
            onCloseAll();
          }}
          className={
            isRootLevel
              ? `whitespace-nowrap text-[10px] font-medium transition-colors duration-200 motion-reduce:transition-none md:text-xs lg:text-base ${
                  isActive ? 'font-semibold text-green-600' : 'text-gray-800 hover:text-green-600'
                }`
              : 'flex-1 rounded-[16px] px-3 py-2.5 text-sm font-medium outline-none'
          }
        >
          {item.title}
        </Link>

        {hasChildren ? (
          <button
            type="button"
            aria-label={`Toggle ${item.title} submenu`}
            aria-haspopup="menu"
            aria-expanded={isOpen}
            aria-controls={submenuId}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onTogglePath(itemPath);
            }}
            onFocus={() => onOpenPath(itemPath)}
            className={
              isRootLevel
                ? `rounded-full p-1.5 transition-colors duration-200 motion-reduce:transition-none ${
                    isActive || isOpen
                      ? 'text-green-600 hover:bg-green-50'
                      : 'text-[#546F7A] hover:bg-green-50 hover:text-green-600'
                  }`
                : `mr-1 rounded-full p-1.5 transition-colors duration-200 motion-reduce:transition-none ${
                    isActive || isOpen
                      ? 'text-green-700 hover:bg-green-100'
                      : 'text-[#546F7A] hover:bg-green-100 hover:text-green-700'
                  }`
            }
          >
            {isRootLevel ? (
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''}`}
              />
            ) : (
              <ChevronRight
                className={`h-4 w-4 transition-transform duration-200 motion-reduce:transition-none ${isOpen ? 'translate-x-0.5' : ''}`}
              />
            )}
          </button>
        ) : null}
      </div>

      {hasChildren ? (
        <div
          ref={submenuRef}
          id={submenuId}
          role="menu"
          aria-label={item.title}
          className={`absolute z-[120] transition-all duration-200 ease-out motion-reduce:transition-none ${
            isRootLevel ? 'left-1/2 top-full pt-4' : 'left-full top-0 pl-3'
          } ${
            isOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-1 opacity-0'
          }`}
          style={
            isRootLevel
              ? { transform: `translateX(-50%) ${isOpen ? 'translateY(0)' : 'translateY(4px)'}` }
              : { top: `${submenuOffsetTop}px` }
          }
        >
          <DesktopMenuList
            items={item.children ?? []}
            level={level + 1}
            parentPath={itemPath}
            openPath={openPath}
            onOpenPath={onOpenPath}
            onTogglePath={onTogglePath}
            onCloseAll={onCloseAll}
            getLocalizedUrl={getLocalizedUrl}
            isItemActive={isItemActive}
          />
        </div>
      ) : null}
    </div>
  );
}

function DesktopMenuList({
  items,
  level,
  parentPath,
  openPath,
  onOpenPath,
  onTogglePath,
  onCloseAll,
  getLocalizedUrl,
  isItemActive,
}: DesktopMenuListProps) {
  const isRootLevel = level === 0;
  const itemColumns =
    !isRootLevel && items.length >= SUBMENU_COLUMN_SPLIT_THRESHOLD
      ? chunkMenuItems(items, SUBMENU_COLUMN_MAX_ITEMS)
      : [items];

  return (
    <div
      className={
        isRootLevel
          ? 'flex h-full w-full items-center justify-between gap-4'
          : 'relative min-w-[240px] rounded-[22px] border border-[#E4E8E0] bg-white/95 p-2 text-left shadow-[0_18px_40px_rgba(15,63,29,0.12)] backdrop-blur-sm'
      }
    >
      {isRootLevel ? (
        items.map((item) => (
          <DesktopMenuEntry
            key={item.id || item.url}
            item={item}
            level={level}
            parentPath={parentPath}
            openPath={openPath}
            onOpenPath={onOpenPath}
            onTogglePath={onTogglePath}
            onCloseAll={onCloseAll}
            getLocalizedUrl={getLocalizedUrl}
            isItemActive={isItemActive}
          />
        ))
      ) : (
        <div className="grid grid-flow-col auto-cols-[minmax(240px,1fr)] gap-2">
          {itemColumns.map((columnItems, columnIndex) => (
            <div key={`${parentPath.join('-') || 'root'}-column-${columnIndex}`} className="flex min-w-[240px] flex-col gap-1">
              {columnItems.map((item) => (
                <DesktopMenuEntry
                  key={item.id || item.url}
                  item={item}
                  level={level}
                  parentPath={parentPath}
                  openPath={openPath}
                  onOpenPath={onOpenPath}
                  onTogglePath={onTogglePath}
                  onCloseAll={onCloseAll}
                  getLocalizedUrl={getLocalizedUrl}
                  isItemActive={isItemActive}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navigation({ menuItems }: NavigationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = searchParams.get('locale') || 'en';
  const navRef = useRef<HTMLElement | null>(null);
  const [openPath, setOpenPath] = useState<string[]>([]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenPath([]);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenPath([]);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getLocalizedUrl = (url: string) => {
    if (isExternalUrl(url)) {
      return url;
    }

    return addLocaleToUrl(url, currentLocale);
  };

  const isItemActive = (item: MenuItem): boolean => {
    if (!pathname) {
      return false;
    }

    const selfActive = matchesPath(item.url, pathname);

    if (selfActive) {
      return true;
    }

    return item.children?.some((child) => isItemActive(child)) ?? false;
  };

  const handleOpenPath = (path: string[]) => {
    setOpenPath(path);
  };

  const handleTogglePath = (path: string[]) => {
    setOpenPath((currentPath) => {
      if (currentPath.length === path.length && isPathPrefix(path, currentPath)) {
        return path.slice(0, -1);
      }

      return path;
    });
  };

  if (menuItems.length === 0) {
    return null;
  }

  return (
    <nav
      ref={navRef}
      aria-label="Primary navigation"
      onMouseLeave={() => setOpenPath([])}
      className="hidden xl:flex items-center justify-between bg-white/85 rounded-[16px] md:rounded-[20px] lg:rounded-[50px] w-full max-w-[1440px] h-[44px] md:h-[52px] lg:h-[60px] px-6 md:px-10 lg:px-16 mx-auto"
    >
      <DesktopMenuList
        items={menuItems}
        level={0}
        parentPath={[]}
        openPath={openPath}
        onOpenPath={handleOpenPath}
        onTogglePath={handleTogglePath}
        onCloseAll={() => setOpenPath([])}
        getLocalizedUrl={getLocalizedUrl}
        isItemActive={isItemActive}
      />
    </nav>
  );
}
