'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { isLocalhostAssetUrl } from '../lib/strapi';

interface InteractiveOrgChartProps {
  chartUrl: string;
  chartAlt: string;
  fallbackUrl?: string;
}

export default function InteractiveOrgChart({
  chartUrl,
  chartAlt,
  fallbackUrl = '/images/OrganizationalStructure2.svg',
}: InteractiveOrgChartProps) {
  const [svgMarkup, setSvgMarkup] = useState<string>('');
  const [useFallback, setUseFallback] = useState(false);
  const hasLocalhostUrl = isLocalhostAssetUrl(chartUrl);
  const shouldForceFallback =
    hasLocalhostUrl &&
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1';

  const activeUrl = shouldForceFallback || useFallback ? fallbackUrl : chartUrl;
  const isSvgAsset = /\.svg(?:\?|#|$)/i.test(activeUrl);
  const useUnoptimized = isLocalhostAssetUrl(activeUrl);

  useEffect(() => {
    let isMounted = true;

    const loadSvg = async () => {
      if (!isSvgAsset) {
        return;
      }

      try {
        const response = await fetch(activeUrl);
        if (!response.ok) {
          if (isMounted) {
            if (!useFallback && activeUrl !== fallbackUrl) {
              setUseFallback(true);
            }
          }
          return;
        }

        const rawSvg = await response.text();
        if (!isMounted) {
          return;
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(rawSvg, 'image/svg+xml');
        const svg = doc.querySelector('svg');

        if (!svg) {
          return;
        }

        const interactiveNodes = svg.querySelectorAll(
          'rect[fill^="url(#paint"], path[fill^="url(#paint"]'
        );

        interactiveNodes.forEach((node, index) => {
          node.classList.add('org-node');
          node.setAttribute('tabindex', '0');
          if (!node.getAttribute('aria-label')) {
            node.setAttribute('aria-label', `Organization unit ${index + 1}`);
          }
        });

        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', chartAlt);

        setSvgMarkup(svg.outerHTML);
      } catch {
        if (isMounted) {
          if (!useFallback && activeUrl !== fallbackUrl) {
            setUseFallback(true);
          }
        }
      }
    };

    void loadSvg();

    return () => {
      isMounted = false;
    };
  }, [activeUrl, chartAlt, fallbackUrl, isSvgAsset, useFallback]);

  const styleTag = useMemo(
    () => `
            .org-chart-wrap svg {
                width: 100%;
                height: auto;
                display: block;
            }

            .org-chart-wrap .org-chart-reveal {
                animation: revealTopToBottom 1.2s ease-out forwards;
                clip-path: inset(0 0 100% 0);
                will-change: clip-path;
            }

            @keyframes revealTopToBottom {
                from {
                    clip-path: inset(0 0 100% 0);
                }
                to {
                    clip-path: inset(0 0 0 0);
                }
            }

            @media (prefers-reduced-motion: reduce) {
                .org-chart-wrap .org-chart-reveal {
                    animation: none;
                    clip-path: inset(0 0 0 0);
                }
            }

            .org-chart-wrap .org-node {
                cursor: pointer;
                transition: filter 180ms ease, opacity 180ms ease, transform 180ms ease;
                transform-box: fill-box;
                transform-origin: center;
            }

            .org-chart-wrap .org-node:hover,
            .org-chart-wrap .org-node:focus-visible {
                filter: drop-shadow(0 4px 10px rgba(15, 23, 42, 0.35)) brightness(1.06);
                opacity: 0.96;
            }
        `,
    []
  );

  if (!svgMarkup) {
    if (isSvgAsset) {
      return (
        <div className="org-chart-wrap w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeUrl}
            alt={chartAlt}
            className="org-chart-reveal h-auto w-full"
            onError={() => {
              if (!useFallback && activeUrl !== fallbackUrl) {
                setUseFallback(true);
              }
            }}
          />
        </div>
      );
    }

    return (
      <div className="org-chart-wrap w-full">
        <Image
          src={activeUrl}
          alt={chartAlt}
          width={1746}
          height={1200}
          className="org-chart-reveal h-auto w-full"
          unoptimized={useUnoptimized}
          onError={() => {
            if (!useFallback && activeUrl !== fallbackUrl) {
              setUseFallback(true);
            }
          }}
        />
      </div>
    );
  }

    return (
    <div className="org-chart-wrap w-full">
      <style>{styleTag}</style>
      <div
        className="org-chart-reveal"
        aria-label={chartAlt}
        role="img"
        dangerouslySetInnerHTML={{ __html: svgMarkup }}
      />
    </div>
    );
}
