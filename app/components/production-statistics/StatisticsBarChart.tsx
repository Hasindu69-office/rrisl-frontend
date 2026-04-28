'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { StatisticsBarDatum } from './productionStatisticsData';

interface StatisticsBarChartProps {
  bars: StatisticsBarDatum[];
  xAxisLabel: string;
  yAxisLabel: string;
}

function formatValue(value: number) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `${Math.round(value / 1000)}K`;
  }

  return `${value}`;
}

function splitLabel(label: string) {
  return label.split(' ');
}

export default function StatisticsBarChart({
  bars,
  xAxisLabel,
  yAxisLabel,
}: StatisticsBarChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [canHover, setCanHover] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const updateCanHover = () => setCanHover(mediaQuery.matches);

    updateCanHover();
    mediaQuery.addEventListener('change', updateCanHover);

    return () => mediaQuery.removeEventListener('change', updateCanHover);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      setContainerWidth(width);
    });

    observer.observe(node);
    setContainerWidth(node.getBoundingClientRect().width);

    return () => observer.disconnect();
  }, []);

  const isCompact = containerWidth > 0 && containerWidth < 520;
  const isTablet = containerWidth >= 520 && containerWidth < 900;

  const chartWidth = isCompact ? 520 : isTablet ? 640 : 760;
  const chartHeight = isCompact ? 280 : isTablet ? 320 : 360;
  const margin = isCompact
    ? { top: 18, right: 16, bottom: 66, left: 48 }
    : isTablet
      ? { top: 20, right: 20, bottom: 76, left: 56 }
      : { top: 24, right: 24, bottom: 86, left: 72 };

  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;

  const maxValue = useMemo(() => {
    const localMax = Math.max(...bars.map((item) => item.value), 0);
    return Math.ceil(localMax * 1.15 / 10000) * 10000 || 10000;
  }, [bars]);

  const yTicks = useMemo(() => {
    const divisions = isCompact ? 3 : 4;
    return Array.from(
      { length: divisions + 1 },
      (_, index) => Math.round((maxValue / divisions) * index),
    );
  }, [isCompact, maxValue]);

  const barWidth = innerWidth / Math.max(bars.length * (isCompact ? 1.2 : 1.35), 1);
  const gap = bars.length > 1 ? (innerWidth - (barWidth * bars.length)) / (bars.length - 1) : 0;

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="h-auto w-full"
        role="img"
        aria-label={`${yAxisLabel} bar chart by ${xAxisLabel}`}
      >
        {yTicks.map((tick) => {
          const y = margin.top + innerHeight - ((tick / maxValue) * innerHeight);

          return (
            <g key={tick}>
              <line
                x1={margin.left}
                y1={y}
                x2={chartWidth - margin.right}
                y2={y}
                stroke="#E8EEF2"
                strokeWidth="1"
              />
              <text
                x={margin.left - 10}
                y={y + 4}
                textAnchor="end"
                className={`fill-[#7C8794] ${isCompact ? 'text-[9px]' : 'text-[11px]'}`}
              >
                {formatValue(tick)}
              </text>
            </g>
          );
        })}

        <line
          x1={margin.left}
          y1={chartHeight - margin.bottom}
          x2={chartWidth - margin.right}
          y2={chartHeight - margin.bottom}
          stroke="#DCE3EA"
          strokeWidth="1"
        />
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={chartHeight - margin.bottom}
          stroke="#DCE3EA"
          strokeWidth="1"
        />

        {bars.map((bar, index) => {
          const x = margin.left + (index * (barWidth + gap));
          const height = (bar.value / maxValue) * innerHeight;
          const y = margin.top + innerHeight - height;
          const isActive = activeIndex === index;

          return (
            <g key={`${bar.label}-${bar.value}`}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={height}
                rx={isCompact ? 10 : 14}
                fill={bar.color}
                opacity={isActive || activeIndex === null ? 1 : 0.8}
              />

              {!isCompact ? (
                <text
                  x={x + (barWidth / 2)}
                  y={Math.max(y - 10, margin.top)}
                  textAnchor="middle"
                  className="fill-[#16341D] text-[11px] font-semibold"
                >
                  {formatValue(bar.value)}
                </text>
              ) : null}

              <rect
                x={x - 4}
                y={margin.top}
                width={barWidth + 8}
                height={innerHeight + 32}
                fill="transparent"
                tabIndex={0}
                aria-label={`${bar.label}: ${bar.value.toLocaleString()}`}
                onMouseEnter={canHover ? () => setActiveIndex(index) : undefined}
                onMouseLeave={canHover ? () => setActiveIndex(null) : undefined}
                onFocus={() => setActiveIndex(index)}
                onBlur={() => setActiveIndex(null)}
              />

              <text
                x={x + (barWidth / 2)}
                y={chartHeight - margin.bottom + (isCompact ? 18 : 24)}
                textAnchor="middle"
                className={`fill-[#364152] font-medium ${isCompact ? 'text-[9px]' : 'text-[11px]'}`}
              >
                {splitLabel(bar.label).map((part, partIndex) => (
                  <tspan
                    key={`${bar.label}-${part}-${partIndex}`}
                    x={x + (barWidth / 2)}
                    dy={partIndex === 0 ? 0 : isCompact ? 10 : 12}
                  >
                    {part}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}

        {!isCompact ? (
          <>
            <text
              x={chartWidth / 2}
              y={chartHeight - 12}
              textAnchor="middle"
              className="fill-[#313131] text-[12px]"
            >
              {xAxisLabel}
            </text>
            <text
              x="18"
              y={chartHeight / 2}
              textAnchor="middle"
              transform={`rotate(-90 18 ${chartHeight / 2})`}
              className="fill-[#313131] text-[12px]"
            >
              {yAxisLabel}
            </text>
          </>
        ) : null}
      </svg>
    </div>
  );
}
