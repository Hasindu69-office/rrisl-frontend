'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { StatisticsLine, StatisticsPoint } from './productionStatisticsData';

interface StatisticsLineChartProps {
  line: StatisticsLine;
  points: StatisticsPoint[];
  xAxisLabel: string;
  yAxisLabel: string;
}

interface ChartPoint extends StatisticsPoint {
  x: number;
  y: number;
}

function formatValue(value: number) {
  if (value === 0) return '0';
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${Math.round(value / 1000)}K`;
  return `${value}`;
}

function createSmoothPath(points: ChartPoint[]) {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  return points.reduce((path, point, index, array) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }

    const previous = array[index - 1];
    const controlX = (previous.x + point.x) / 2;

    return `${path} C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
  }, '');
}

export default function StatisticsLineChart({
  line,
  points,
  xAxisLabel,
  yAxisLabel,
}: StatisticsLineChartProps) {
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
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
  const chartHeight = isCompact ? 260 : isTablet ? 290 : 320;
  const margin = isCompact
    ? { top: 18, right: 16, bottom: 42, left: 48 }
    : isTablet
      ? { top: 18, right: 20, bottom: 46, left: 56 }
      : { top: 20, right: 24, bottom: 52, left: 70 };

  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;

  const maxValue = useMemo(() => {
    const localMax = Math.max(...points.map((point) => point.value), 0);
    return Math.ceil(localMax * 1.15 / 10000) * 10000 || 10000;
  }, [points]);

  const yTicks = useMemo(() => {
    const divisions = isCompact ? 3 : 4;
    return Array.from(
      { length: divisions + 1 },
      (_, index) => Math.round((maxValue / divisions) * index),
    );
  }, [isCompact, maxValue]);

  const xTicks = useMemo(() => {
    if (points.length === 0) {
      return [];
    }

    const targetTicks = isCompact ? 4 : isTablet ? 5 : 6;
    const step = Math.max(Math.ceil((points.length - 1) / Math.max(targetTicks - 1, 1)), 1);
    const sampled = points.filter((_, index) => index % step === 0);
    const lastPoint = points[points.length - 1];

    if (sampled[sampled.length - 1]?.year !== lastPoint.year) {
      sampled.push(lastPoint);
    }

    return sampled;
  }, [isCompact, isTablet, points]);

  const chartPoints = useMemo(() => {
    const count = Math.max(points.length - 1, 1);

    return points.map((point, index) => ({
      ...point,
      x: margin.left + ((index / count) * innerWidth),
      y: margin.top + innerHeight - ((point.value / maxValue) * innerHeight),
    }));
  }, [innerHeight, innerWidth, margin.left, margin.top, maxValue, points]);

  const activePoint = hoveredPointIndex !== null ? chartPoints[hoveredPointIndex] : null;
  const previousPoint =
    hoveredPointIndex !== null && hoveredPointIndex > 0
      ? chartPoints[hoveredPointIndex - 1]
      : null;
  const tooltipWidth = 112;
  const tooltipHeight = 44;

  const tooltipPosition = useMemo(() => {
    if (!activePoint) {
      return null;
    }

    const preferredX = activePoint.x + 10;
    const preferredY = activePoint.y - 54;
    const fallbackY = activePoint.y + 12;

    const x = Math.min(
      Math.max(preferredX, margin.left),
      chartWidth - margin.right - tooltipWidth,
    );
    const y = preferredY < margin.top
      ? Math.min(fallbackY, chartHeight - margin.bottom - tooltipHeight)
      : preferredY;

    return { x, y };
  }, [activePoint, chartHeight, chartWidth, margin.bottom, margin.left, margin.right, margin.top]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <div className="mb-3 flex items-center gap-2 text-[12px] text-[#4A4A4A] sm:mb-4">
        <span
          className="h-[9px] w-[9px] rounded-full"
          style={{ backgroundColor: line.color }}
        />
        <span>{line.label}</span>
      </div>

      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="h-auto w-full"
        role="img"
        aria-label={`${line.label} line chart with ${xAxisLabel} on the x-axis and ${yAxisLabel} on the y-axis`}
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
                stroke="#E8EDF3"
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

        {xTicks.map((tick) => {
          const index = points.findIndex((point) => point.year === tick.year);
          const x = margin.left + ((index / Math.max(points.length - 1, 1)) * innerWidth);

          return (
            <text
              key={tick.year}
              x={x}
              y={chartHeight - margin.bottom + (isCompact ? 18 : 24)}
              textAnchor="middle"
              className={`fill-[#7C8794] ${isCompact ? 'text-[9px]' : 'text-[11px]'}`}
            >
              {tick.year}
            </text>
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

        <path
          d={createSmoothPath(chartPoints)}
          fill="none"
          stroke={line.color}
          strokeWidth={isCompact ? '2.5' : '3'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {chartPoints.map((point, index) => (
          <g key={`${point.year}-${point.value}`}>
            <circle
              cx={point.x}
              cy={point.y}
              r={hoveredPointIndex === index && !isCompact ? 5 : isCompact ? 3.5 : 4}
              fill="#ffffff"
              stroke={line.color}
              strokeWidth={isCompact ? '2' : '2.5'}
            />
            <circle
              cx={point.x}
              cy={point.y}
              r={isCompact ? '9' : '12'}
              fill="transparent"
              tabIndex={0}
              aria-label={`${point.year}: ${point.value.toLocaleString()}`}
              onMouseEnter={canHover ? () => setHoveredPointIndex(index) : undefined}
              onMouseLeave={canHover ? () => setHoveredPointIndex(null) : undefined}
              onFocus={() => setHoveredPointIndex(index)}
              onBlur={() => setHoveredPointIndex(null)}
            />
          </g>
        ))}

        {canHover && !isCompact && activePoint && tooltipPosition ? (
          <g transform={`translate(${tooltipPosition.x}, ${tooltipPosition.y})`}>
            <rect
              width={tooltipWidth}
              height={tooltipHeight}
              rx="10"
              fill="#16341D"
              opacity="0.96"
            />
            <text x="12" y="16" className="fill-white text-[10px] font-medium">
              {activePoint.year}
            </text>
            <text x="12" y="30" className="fill-white text-[11px] font-semibold">
              {activePoint.value.toLocaleString()}
            </text>
            <text x="12" y="40" className="fill-[#C6E7CF] text-[9px]">
              {previousPoint
                ? `${activePoint.value - previousPoint.value >= 0 ? '+' : ''}${(activePoint.value - previousPoint.value).toLocaleString()} vs ${previousPoint.year}`
                : 'Start of selected range'}
            </text>
          </g>
        ) : null}

        {!isCompact ? (
          <>
            <text
              x={chartWidth / 2}
              y={chartHeight - 8}
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
