'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { addLocaleToUrl } from '@/app/lib/locale';
import styles from './PageHero.module.css';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  variant?: 'light' | 'dark';
  className?: string;
  locale?: string;
}

export default function Breadcrumb({
  items,
  variant = 'light',
  className = '',
  locale = 'en',
}: BreadcrumbProps) {
  const isDark = variant === 'dark';
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);

  const getLocalizedUrl = (url: string) => {
    if (url.startsWith('http') || url.startsWith('//')) {
      return url;
    }
    return addLocaleToUrl(url, locale);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkOverflow = () => {
      if (containerRef.current && contentRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const contentWidth = contentRef.current.scrollWidth;
        console.log('Breadcrumb width debug:', { containerWidth, contentWidth, overflows: contentWidth > containerWidth });
        if (contentWidth > containerWidth) {
          setScrollDistance(contentWidth - containerWidth);
        } else {
          setScrollDistance(0);
        }
      }
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(() => {
      checkOverflow();
    });

    if (containerRef.current) resizeObserver.observe(containerRef.current);
    if (contentRef.current) resizeObserver.observe(contentRef.current);

    window.addEventListener('resize', checkOverflow);

    const timer = setTimeout(checkOverflow, 200);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', checkOverflow);
      clearTimeout(timer);
    };
  }, [items]);

  const isOverflowing = scrollDistance > 0;

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden w-full ${className}`}
    >
      {/* Self-contained styling for marquee bounce to bypass potential CSS module caching/issues */}
      {isOverflowing && (
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes marqueeBounce-${scrollDistance} {
            0%, 15% {
              transform: translateX(0);
            }
            85%, 100% {
              transform: translateX(-${scrollDistance}px);
            }
          }
          .custom-marquee-active {
            will-change: transform;
            animation: marqueeBounce-${scrollDistance} 8s ease-in-out infinite alternate;
          }
          .custom-marquee-active:hover,
          .custom-marquee-active:active {
            animation-play-state: paused;
          }
        `}} />
      )}
      <nav
        ref={contentRef}
        className={`flex items-center space-x-2 text-sm md:text-base ${isDark ? 'text-[#042012]' : 'text-white'} ${
          isOverflowing ? 'w-max justify-start custom-marquee-active' : 'w-full justify-center'
        } whitespace-nowrap`}
        aria-label="Breadcrumb"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={index}>
              {item.href && !isLast ? (
                <Link
                  href={getLocalizedUrl(item.href)}
                  className={`transition-colors ${isDark ? 'hover:text-[#042012]/80' : 'hover:text-white/80'}`}
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-[#A1DF0A]' : isDark ? 'text-[#042012]/80' : 'text-white/80'}>
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className={`mx-1 ${isDark ? 'text-[#042012]/50' : 'text-white/60'}`}>{'\u00BB'}</span>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );
}

