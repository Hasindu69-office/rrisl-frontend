'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { StatisticsLine } from './productionStatisticsData';
import { formatDisplayValue } from './productionStatisticsData';

interface StatisticsLineChartProps {
  lines: StatisticsLine[];
  xAxisLabel: string;
  yAxisLabel: string;
  valueDecimals?: number;
}

interface ChartPoint {
  year: number;
  value: number;
  x: number;
  y: number;
}

function formatValue(value: number) {
  if (value === 0) return '0';
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${Math.round(value / 1000)}K`;
  return `${value}`;
}

function getNiceStep(maxValue: number, divisions: number) {
  if (maxValue <= 0) {
    return 1;
  }

  const roughStep = maxValue / Math.max(divisions, 1);
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const normalizedStep = roughStep / magnitude;

  if (normalizedStep <= 1) return magnitude;
  if (normalizedStep <= 2) return 2 * magnitude;
  if (normalizedStep <= 5) return 5 * magnitude;
  return 10 * magnitude;
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
  lines,
  xAxisLabel,
  yAxisLabel,
  valueDecimals = 1,
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

  const primaryLine = lines[0] ?? null;
  const points = primaryLine?.points ?? [];
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
  const divisions = isCompact ? 3 : 4;

  const maxValue = useMemo(() => {
    const localMax = Math.max(...lines.flatMap((line) => line.points.map((point) => point.value)), 0);
    const paddedMax = localMax * 1.15;
    const step = getNiceStep(paddedMax, divisions);
    return Math.max(step * divisions, Math.ceil(paddedMax / step) * step);
  }, [divisions, lines]);

  const yTicks = useMemo(() => Array.from(
    { length: divisions + 1 },
    (_, index) => (maxValue / divisions) * index,
  ), [divisions, maxValue]);

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

  const chartLines = useMemo(() => {
    return lines.map((line) => {
      const count = Math.max(line.points.length - 1, 1);

      return {
        ...line,
        chartPoints: line.points.map((point, index) => ({
          year: point.year,
          value: point.value,
          x: margin.left + ((index / count) * innerWidth),
          y: margin.top + innerHeight - ((point.value / maxValue) * innerHeight),
        })),
      };
    });
  }, [innerHeight, innerWidth, lines, margin.left, margin.top, maxValue]);

  const activePoints = hoveredPointIndex !== null
    ? chartLines.map((line) => ({
      label: line.label,
      color: line.color,
      point: line.chartPoints[hoveredPointIndex] ?? null,
    })).filter((entry) => entry.point !== null)
    : [];
  const activePrimaryPoint = activePoints[0]?.point ?? null;
  const previousPrimaryPoint =
    hoveredPointIndex !== null && hoveredPointIndex > 0
      ? chartLines[0]?.chartPoints[hoveredPointIndex - 1] ?? null
      : null;
  const tooltipWidth = 188;
  const tooltipHeaderHeight = 24;
  const tooltipSeriesRowHeight = 18;
  const tooltipFooterHeight = previousPrimaryPoint ? 18 : 12;
  const tooltipHeight = tooltipHeaderHeight + (activePoints.length * tooltipSeriesRowHeight) + tooltipFooterHeight;

  const tooltipPosition = useMemo(() => {
    if (!activePrimaryPoint) {
      return null;
    }

    const preferredX = activePrimaryPoint.x + 10;
    const preferredY = activePrimaryPoint.y - (tooltipHeight + 10);
    const fallbackY = activePrimaryPoint.y + 12;

    const x = Math.min(
      Math.max(preferredX, margin.left),
      chartWidth - margin.right - tooltipWidth,
    );
    const y = preferredY < margin.top
      ? Math.min(fallbackY, chartHeight - margin.bottom - tooltipHeight)
      : preferredY;

    return { x, y };
  }, [
    activePrimaryPoint,
    chartHeight,
    chartWidth,
    margin.bottom,
    margin.left,
    margin.right,
    margin.top,
    tooltipHeight,
  ]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <div className="mb-3 flex flex-wrap items-center gap-3 text-[12px] text-[#4A4A4A] sm:mb-4">
        {lines.map((line) => (
          <div key={line.label} className="flex items-center gap-2">
            <span
              className="h-[9px] w-[9px] rounded-full"
              style={{ backgroundColor: line.color }}
            />
            <span>{line.label}</span>
          </div>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="h-auto w-full"
        role="img"
        aria-label={`${lines.map((line) => line.label).join(', ')} line chart with ${xAxisLabel} on the x-axis and ${yAxisLabel} on the y-axis`}
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

        {chartLines.map((line) => (
          <g key={line.label}>
            <path
              d={createSmoothPath(line.chartPoints)}
              fill="none"
              stroke={line.color}
              strokeWidth={isCompact ? '2.5' : '3'}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {line.chartPoints.map((point, index) => (
              <circle
                key={`${line.label}-${point.year}-${point.value}`}
                cx={point.x}
                cy={point.y}
                r={hoveredPointIndex === index && !isCompact ? 5 : isCompact ? 3.5 : 4}
                fill="#ffffff"
                stroke={line.color}
                strokeWidth={isCompact ? '2' : '2.5'}
              />
            ))}
          </g>
        ))}

        {points.map((point, index) => {
          const x = margin.left + ((index / Math.max(points.length - 1, 1)) * innerWidth);
          const previousX = index > 0
            ? margin.left + (((index - 1) / Math.max(points.length - 1, 1)) * innerWidth)
            : x;
          const nextX = index < points.length - 1
            ? margin.left + (((index + 1) / Math.max(points.length - 1, 1)) * innerWidth)
            : x;
          const zoneWidth = points.length === 1
            ? innerWidth
            : Math.max((nextX - previousX) / 2, 18);

          return (
            <rect
              key={`focus-${point.year}-${index}`}
              x={Math.max(margin.left, x - (zoneWidth / 2))}
              y={margin.top}
              width={zoneWidth}
              height={innerHeight}
              fill="transparent"
              tabIndex={0}
              aria-label={`${point.year}`}
              onMouseEnter={canHover ? () => setHoveredPointIndex(index) : undefined}
              onMouseLeave={canHover ? () => setHoveredPointIndex(null) : undefined}
              onFocus={() => setHoveredPointIndex(index)}
              onBlur={() => setHoveredPointIndex(null)}
            />
          );
        })}

        {canHover && !isCompact && activePrimaryPoint && tooltipPosition ? (
          <g transform={`translate(${tooltipPosition.x}, ${tooltipPosition.y})`}>
            <rect
              width={tooltipWidth}
              height={tooltipHeight}
              rx="10"
              fill="#16341D"
              opacity="0.96"
            />
            <text x="12" y="17" className="fill-white text-[11px] font-semibold">
              {activePrimaryPoint.year}
            </text>
            {activePoints.map((entry, index) => {
              const rowY = 32 + (index * tooltipSeriesRowHeight);

              return (
                <g key={`${entry.label}-${entry.point?.year}`}>
                  <circle cx="16" cy={rowY - 4} r="3.5" fill={entry.color} />
                  <text
                    x="24"
                    y={rowY}
                    className="fill-white text-[10px] font-medium"
                  >
                    {entry.label}: {entry.point ? formatDisplayValue(entry.point.value, valueDecimals) : ''}
                  </text>
                </g>
              );
            })}
            <text
              x="12"
              y={tooltipHeight - 8}
              className="fill-[#C6E7CF] text-[9px]"
            >
              {previousPrimaryPoint
                ? `${activePrimaryPoint.value - previousPrimaryPoint.value >= 0 ? '+' : ''}${formatDisplayValue(activePrimaryPoint.value - previousPrimaryPoint.value, valueDecimals)} vs ${previousPrimaryPoint.year}`
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
