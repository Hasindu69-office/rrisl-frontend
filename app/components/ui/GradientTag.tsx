'use client';
import React, { useEffect, useId, useRef, useState } from 'react';

interface GradientTagProps {
  text: string;
  className?: string;
  backgroundColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  textColor?: string;
  padding?: string;
}


/**
 * Reusable gradient tag component with pill shape
 * Outer pill has linear gradient from #20C997 to #A1DF0A (default)
 * Text color is #2E7D32, text size 20px
 */
export default function GradientTag({
  text,
  className = '',
  backgroundColor = 'white',
  gradientFrom = '#20C997',
  gradientTo = '#A1DF0A',
  textColor = '#2E7D32',
  padding = 'px-6 py-1'
}: GradientTagProps) {
  const gradientId = useId().replace(/:/g, '');
  const transparentWrapperRef = useRef<HTMLDivElement | null>(null);
  const [transparentSize, setTransparentSize] = useState({ width: 0, height: 0 });
  // Check if background is transparent
  const isTransparent = backgroundColor === 'transparent' ||
    backgroundColor === 'rgba(255, 255, 255, 0)' ||
    (backgroundColor?.includes('rgba') && backgroundColor.includes(', 0)'));

  useEffect(() => {
    if (!isTransparent) {
      return;
    }

    const node = transparentWrapperRef.current;

    if (!node) {
      return;
    }

    const updateSize = () => {
      setTransparentSize({
        width: node.offsetWidth,
        height: node.offsetHeight,
      });
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [isTransparent, padding, text, className, gradientFrom, gradientTo, textColor]);

  // For transparent backgrounds, render a dedicated SVG border layer.
  // The SVG uses the element's exact rendered size so the border matches
  // the filled pill geometry on all browsers.
  if (isTransparent) {
    const strokeInset = 1;
    const strokeWidth = 2;
    const svgWidth = Math.max(transparentSize.width, 0);
    const svgHeight = Math.max(transparentSize.height, 0);
    const rectWidth = Math.max(svgWidth - strokeInset * 2, 0);
    const rectHeight = Math.max(svgHeight - strokeInset * 2, 0);
    const rectRadius = rectHeight / 2;

    return (
      <div
        ref={transparentWrapperRef}
        className={`relative inline-block ${className}`}
        style={{
          padding: '2px',
          borderRadius: '9999px',
        }}
      >
        <svg
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
          viewBox={`0 0 ${svgWidth || 1} ${svgHeight || 1}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={gradientFrom} />
              <stop offset="100%" stopColor={gradientTo} />
            </linearGradient>
          </defs>
          <rect
            x={strokeInset}
            y={strokeInset}
            width={rectWidth}
            height={rectHeight}
            rx={rectRadius}
            ry={rectRadius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
          />
        </svg>
        <div
          className={`${padding} rounded-full`}
          style={{
            backgroundColor: 'transparent',
            position: 'relative',
            zIndex: 1,
            borderRadius: '9999px',
          }}
        >
          <span
            style={{
              color: textColor,
              fontWeight: 600,
            }}
            className="text-[12px] md:text-[12px] lg:text-[14px]"
          >
            {text}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inline-block ${className}`}
      style={{
        background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
        borderRadius: '9999px',
        padding: '2px',
      }}
    >
      <div
        className={`${padding} rounded-full`}
        style={{

          backgroundColor: backgroundColor,
          borderRadius: '9999px',
        }}
      >
        <span
          style={{
            color: textColor,
            fontWeight: 600,
          }}
          className="text-[12px] md:text-[12px] lg:text-[14px]"
        >
          {text}
        </span>
      </div>
    </div>
  );
}

