'use client';

import { useEffect, useMemo, useState } from 'react';

const SVG_PATH = '/images/OrganizationalStructure2.svg';

export default function InteractiveOrgChart() {
    const [svgMarkup, setSvgMarkup] = useState<string>('');

    useEffect(() => {
        let isMounted = true;

        const loadSvg = async () => {
            try {
                const response = await fetch(SVG_PATH);
                if (!response.ok) {
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

                setSvgMarkup(svg.outerHTML);
            } catch {
                // Fail silently and keep non-interactive fallback below.
            }
        };

        void loadSvg();

        return () => {
            isMounted = false;
        };
    }, []);

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
        return (
            <img
                src={SVG_PATH}
                alt="RRISL organizational structure chart"
                className="org-chart-reveal h-auto w-full"
            />
        );
    }

    return (
        <div className="org-chart-wrap w-full">
            <style>{styleTag}</style>
            <div
                className="org-chart-reveal"
                aria-label="Interactive RRISL organizational structure chart"
                role="img"
                dangerouslySetInnerHTML={{ __html: svgMarkup }}
            />
        </div>
    );
}
