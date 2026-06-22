'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ArrowRight, ChevronDown, ChevronRight } from 'lucide-react';
import type {
  MenuItem,
  NavigationImage,
  ResearchMegaMenuImages,
  ResearchManagersMenuCopy,
} from '@/app/lib/types';
import { addLocaleToUrl } from '@/app/lib/locale';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';

interface NavigationProps {
  menuItems: MenuItem[];
  researchMegaMenuImages: ResearchMegaMenuImages;
  researchManagersMenuCopy: ResearchManagersMenuCopy;
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
  researchMegaMenuImages: ResearchMegaMenuImages;
  researchManagersMenuCopy: ResearchManagersMenuCopy;
}

const SUBMENU_COLUMN_MAX_ITEMS = 6;
const SUBMENU_COLUMN_SPLIT_THRESHOLD = 7;

const RESEARCH_DEVELOPMENT_TITLE = 'research & development';
const RESEARCH_MANAGERS_TITLE = 'research managers';
const RESEARCH_DEVELOPMENT_CATEGORY_URLS = new Set([
  '/research-managers',
  '/departments',
  '/estates-and-substations',
]);
const RESEARCH_MANAGERS_URL = '/research-managers';

function normalizeMenuTitle(title: string) {
  return title.trim().replace(/\s+/g, ' ').toLowerCase();
}

function isResearchDevelopmentRoot(item: MenuItem, level: number) {
  if (level !== 0) {
    return false;
  }

  const childUrls = item.children?.map((child) => normalizeNavigableUrl(child.url)).filter(Boolean) ?? [];
  const hasResearchDevelopmentRoutes = childUrls.some((url) =>
    RESEARCH_DEVELOPMENT_CATEGORY_URLS.has(url as string),
  );

  return hasResearchDevelopmentRoutes || normalizeMenuTitle(item.title) === RESEARCH_DEVELOPMENT_TITLE;
}

function isResearchDepartmentsCategory(item: MenuItem | null) {
  return Boolean(
    item?.children?.some((child) => {
      const childUrl = normalizeNavigableUrl(child.url);
      return childUrl === '/departments' || childUrl?.startsWith('/departments/');
    }),
  );
}

function isEstatesAndSubstationsCategory(item: MenuItem | null) {
  return normalizeNavigableUrl(item?.url) === '/estates-and-substations';
}

function getResearchCategoryImage(
  item: MenuItem | null,
  images: ResearchMegaMenuImages,
): NavigationImage | null {
  if (isResearchDepartmentsCategory(item)) {
    return images.researchDepartments;
  }

  if (isEstatesAndSubstationsCategory(item)) {
    return images.estatesAndSubstations;
  }

  return null;
}

function isResearchManagersCategory(item: MenuItem | null) {
  return Boolean(
    item &&
      (normalizeNavigableUrl(item.url) === RESEARCH_MANAGERS_URL ||
        normalizeMenuTitle(item.title) === RESEARCH_MANAGERS_TITLE),
  );
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
  researchMegaMenuImages,
  researchManagersMenuCopy,
}: DesktopMenuEntryProps) {
  const itemRef = useRef<HTMLDivElement | null>(null);
  const submenuRef = useRef<HTMLDivElement | null>(null);
  const [submenuOffsetTop, setSubmenuOffsetTop] = useState(0);
  const [researchMenuOffsetLeft, setResearchMenuOffsetLeft] = useState(0);
  const [researchMenuWidth, setResearchMenuWidth] = useState(0);
  const isRootLevel = level === 0;
  const itemPath = [...parentPath, item.id];
  const hasChildren = Boolean(item.children?.length);
  const isOpen = hasChildren && isPathPrefix(itemPath, openPath);
  const isActive = isItemActive(item);
  const submenuId = `desktop-submenu-${itemPath.join('-')}`;
  const isResearchMegaMenu = hasChildren && isResearchDevelopmentRoot(item, level);
  const researchCategories = item.children ?? [];
  const activeResearchCategoryFromRoute = researchCategories.find((child) => isItemActive(child));
  const [selectedResearchCategoryId, setSelectedResearchCategoryId] = useState<string | null>(null);
  const activeResearchCategoryId =
    selectedResearchCategoryId ?? activeResearchCategoryFromRoute?.id ?? researchCategories[0]?.id ?? null;
  const activeResearchCategory =
    researchCategories.find((child) => child.id === activeResearchCategoryId) ??
    activeResearchCategoryFromRoute ??
    researchCategories[0] ??
    null;
  const activeResearchImage = getResearchCategoryImage(activeResearchCategory, researchMegaMenuImages);
  const activeResearchColumns = activeResearchCategory?.children?.length
    ? chunkMenuItems(activeResearchCategory.children, SUBMENU_COLUMN_MAX_ITEMS)
    : [];
  const showResearchManagersPreview =
    isResearchManagersCategory(activeResearchCategory) && activeResearchColumns.length === 0;

  useLayoutEffect(() => {
    if (!isResearchMegaMenu || !isOpen) {
      return;
    }

    const updateOffset = () => {
      const itemElement = itemRef.current;
      const navElement = itemElement?.closest('nav');

      if (!itemElement || !navElement) {
        setResearchMenuOffsetLeft(0);
        setResearchMenuWidth(0);
        return;
      }

      const itemRect = itemElement.getBoundingClientRect();
      const navRect = navElement.getBoundingClientRect();

      setResearchMenuOffsetLeft(navRect.left - itemRect.left);
      setResearchMenuWidth(navRect.width);
    };

    updateOffset();
    window.addEventListener('resize', updateOffset);

    return () => {
      window.removeEventListener('resize', updateOffset);
    };
  }, [isOpen, isResearchMegaMenu]);

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
          if (isResearchMegaMenu) {
            setSelectedResearchCategoryId(null);
          }

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
              if (isResearchMegaMenu) {
                setSelectedResearchCategoryId(null);
              }

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
            onFocus={() => {
              if (isResearchMegaMenu) {
                setSelectedResearchCategoryId(null);
              }

              onOpenPath(itemPath);
            }}
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
          className={`absolute z-[120] ${
            isResearchMegaMenu ? 'transition-[opacity,transform]' : 'transition-all'
          } duration-200 ease-out motion-reduce:transition-none ${
            isRootLevel ? `${isResearchMegaMenu ? 'top-full pt-5' : 'left-1/2 top-full pt-4'}` : 'left-full top-0 pl-3'
          } ${
            isOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-1 opacity-0'
          }`}
          style={
            isRootLevel
              ? isResearchMegaMenu
                ? {
                    left: `${researchMenuOffsetLeft}px`,
                    transform: isOpen ? 'translateY(0)' : 'translateY(4px)',
                  }
                : { transform: `translateX(-50%) ${isOpen ? 'translateY(0)' : 'translateY(4px)'}` }
              : { top: `${submenuOffsetTop}px` }
          }
        >
          {isResearchMegaMenu ? (
            <div
              className="grid h-[460px] grid-cols-[290px_minmax(600px,1fr)_260px] gap-6 overflow-hidden rounded-[28px] border border-white/70 bg-white/95 p-4 text-left shadow-[0_24px_64px_rgba(15,63,29,0.18)] backdrop-blur-xl"
              style={{ width: researchMenuWidth ? `${researchMenuWidth}px` : 'min(1240px, calc(100vw - 64px))' }}
            >
              <style jsx global>{`
                @keyframes researchMenuFade {
                  from {
                    opacity: 0;
                    transform: translateX(-14px);
                  }
                  to {
                    opacity: 1;
                    transform: translateX(0);
                  }
                }

                @media (prefers-reduced-motion: reduce) {
                  .research-menu-animated {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                  }
                }
              `}</style>
              <div className="flex flex-col gap-1 border-r border-[#E4E8E0] pr-3">
                {researchCategories.map((category) => {
                  const categoryActive = activeResearchCategory?.id === category.id;
                  const categoryRouteActive = isItemActive(category);

                  return (
                    <div
                      key={category.id || category.url}
                      className={`flex items-center gap-2 rounded-[18px] transition-[background-color,color] duration-200 motion-reduce:transition-none ${
                        categoryActive || categoryRouteActive
                          ? 'bg-green-50 text-green-700'
                          : 'text-[#1F2937] hover:bg-[#F5F8F2] hover:text-green-700'
                      }`}
                      onMouseEnter={() => setSelectedResearchCategoryId(category.id)}
                    >
                      <Link
                        href={getLocalizedUrl(category.url)}
                        target={category.target || '_self'}
                        onFocus={() => setSelectedResearchCategoryId(category.id)}
                        onClick={onCloseAll}
                        className="flex-1 rounded-[18px] px-3 py-3 text-sm font-medium leading-snug outline-none"
                      >
                        {category.title}
                      </Link>
                      {category.children?.length ? (
                        <ChevronRight className="mr-3 h-4 w-4 shrink-0 text-current" aria-hidden="true" />
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <div className="min-h-0 py-1">
                {activeResearchCategory ? (
                  <div
                    key={`research-heading-${activeResearchCategory.id}`}
                    className="research-menu-animated mb-3 flex items-center justify-between gap-4 animate-[researchMenuFade_180ms_ease-out]"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-green-700">
                      {activeResearchCategory.title}
                    </p>
                  </div>
                ) : null}

                {activeResearchColumns.length > 0 ? (
                  <div
                    key={`research-links-${activeResearchCategory?.id ?? 'research'}`}
                    className="research-menu-animated grid max-h-[450px] grid-cols-3 gap-x-6 gap-y-1 overflow-y-auto overflow-x-hidden pr-1 animate-[researchMenuFade_220ms_ease-out]"
                  >
                    {activeResearchColumns.map((columnItems, columnIndex) => (
                      <div
                        key={`${activeResearchCategory?.id ?? 'research'}-column-${columnIndex}`}
                        className="flex min-w-0 flex-col gap-1"
                      >
                        {columnItems.map((child) => {
                          const childActive = isItemActive(child);

                          return (
                            <Link
                              key={child.id || child.url}
                              href={getLocalizedUrl(child.url)}
                              target={child.target || '_self'}
                              onClick={onCloseAll}
                              className={`rounded-[14px] px-4 py-2.5 text-sm font-medium leading-snug outline-none transition-[background-color,color] duration-200 motion-reduce:transition-none ${
                                childActive
                                  ? 'bg-green-50 text-green-700'
                                  : 'text-[#1F2937] hover:bg-[#F5F8F2] hover:text-green-700 focus:bg-[#F5F8F2] focus:text-green-700'
                              }`}
                            >
                              {child.title}
                            </Link>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ) : showResearchManagersPreview && activeResearchCategory ? (
                  <div
                    key={`research-managers-preview-${activeResearchCategory.id}`}
                    className="research-menu-animated max-w-[620px] rounded-[24px] border border-[#E4EDE0] bg-[linear-gradient(135deg,#F8FBF6_0%,#EEF8ED_100%)] p-5 shadow-[0_18px_44px_rgba(15,63,29,0.07)] animate-[researchMenuFade_220ms_ease-out]"
                  >
                    <div className="inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-green-700 shadow-[0_8px_18px_rgba(15,63,29,0.06)]">
                      {researchManagersMenuCopy.eyebrow}
                    </div>
                    <h3 className="mt-4 max-w-[480px] text-[22px] font-semibold leading-[1.15] text-[#15341F]">
                      {researchManagersMenuCopy.title}
                    </h3>
                    <p className="mt-3 max-w-[540px] text-sm leading-7 text-[#546F7A]">
                      {researchManagersMenuCopy.description}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-4">
                      <Link
                        href={getLocalizedUrl(activeResearchCategory.url)}
                        target={activeResearchCategory.target || '_self'}
                        onClick={onCloseAll}
                        className="inline-flex items-center gap-2 rounded-full bg-[#0F3F1D] px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-[#2E7D32] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-2"
                      >
                        {researchManagersMenuCopy.cta}
                        <ArrowRight className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
                      </Link>
                      <p className="max-w-[260px] text-xs font-semibold uppercase tracking-[0.12em] text-[#6A7A70]">
                        {researchManagersMenuCopy.label}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="rounded-[18px] bg-[#F5F8F2] px-4 py-5 text-sm font-medium text-[#546F7A]">
                    Select a research area to view available links.
                  </p>
                )}
              </div>

              {!activeResearchImage ? (
                <div aria-hidden="true" />
              ) : (
                <div
                  key={`research-image-${activeResearchImage.src}`}
                  className="research-menu-animated relative h-[220px] self-end animate-[researchMenuFade_220ms_ease-out]"
                >
                  <Image
                    key={activeResearchImage.src}
                    src={activeResearchImage.src}
                    alt={activeResearchImage.alt}
                    fill
                    sizes="260px"
                    unoptimized={isLocalhostAssetUrl(activeResearchImage.src)}
                    className="object-cover opacity-35 transition-transform duration-300 ease-out motion-reduce:transition-none"
                    style={{
                      WebkitMaskImage:
                        'linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)',
                      maskImage:
                        'linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)',
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
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
              researchMegaMenuImages={researchMegaMenuImages}
              researchManagersMenuCopy={researchManagersMenuCopy}
            />
          )}
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
  researchMegaMenuImages,
  researchManagersMenuCopy,
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
            researchMegaMenuImages={researchMegaMenuImages}
            researchManagersMenuCopy={researchManagersMenuCopy}
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
                  researchMegaMenuImages={researchMegaMenuImages}
                  researchManagersMenuCopy={researchManagersMenuCopy}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navigation({
  menuItems,
  researchMegaMenuImages,
  researchManagersMenuCopy,
}: NavigationProps) {
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
        researchMegaMenuImages={researchMegaMenuImages}
        researchManagersMenuCopy={researchManagersMenuCopy}
      />
    </nav>
  );
}
