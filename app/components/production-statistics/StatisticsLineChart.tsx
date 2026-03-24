'use client';

import { useMemo, useState } from 'react';
import type { StatisticsLine, StatisticsPoint, StatisticsPeriod } from './productionStatisticsData';

interface StatisticsLineChartProps {
  line: StatisticsLine;
  period: StatisticsPeriod | null;
  xAxisLabel: string;
}

interface ChartPoint extends StatisticsPoint {
  x: number;
  y: number;
}

const chartHeight = 246;
const chartWidth = 450;
const margin = {
  top: 16,
  right: 24,
  bottom: 42,
  left: 52,
};

function formatValue(value: number) {
  if (value === 0) return '0';
  if (value >= 1000) return `${Math.round(value / 1000)}K`;
  return `${value}`;
}

function createYearTicks(startYear: number, endYear: number) {
  const span = endYear - startYear;
  let step = 2;

  if (span > 30) {
    step = 10;
  } else if (span > 18) {
    step = 5;
  } else if (span > 10) {
    step = 4;
  }

  const ticks: number[] = [];

  for (let year = startYear; year <= endYear; year += step) {
    ticks.push(year);
  }

  if (ticks[ticks.length - 1] !== endYear) {
    ticks.push(endYear);
  }

  return ticks;
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
  period,
  xAxisLabel,
}: StatisticsLineChartProps) {
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  const activeRange = useMemo(() => {
    if (period) {
      return period;
    }

    const firstPoint = line.points[0];
    const lastPoint = line.points[line.points.length - 1];

    return {
      id: 'all',
      label: `${firstPoint.year} - ${lastPoint.year}`,
      startYear: firstPoint.year,
      endYear: lastPoint.year,
    };
  }, [line.points, period]);

  const filteredPoints = useMemo(
    () =>
      line.points.filter(
        (point) => point.year >= activeRange.startYear && point.year <= activeRange.endYear,
      ),
    [activeRange.endYear, activeRange.startYear, line.points],
  );

  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;

  const maxValue = useMemo(() => {
    const localMax = Math.max(...filteredPoints.map((point) => point.value), 0);
    return Math.ceil(localMax * 1.1 / 10000) * 10000 || 10000;
  }, [filteredPoints]);

  const xTicks = useMemo(() => {
    const divisions = 5;
    return Array.from({ length: divisions + 1 }, (_, index) => Math.round((maxValue / divisions) * index));
  }, [maxValue]);

  const yTicks = useMemo(
    () => createYearTicks(activeRange.startYear, activeRange.endYear),
    [activeRange.endYear, activeRange.startYear],
  );

  const chartPoints = useMemo(() => {
    const yearSpan = Math.max(activeRange.endYear - activeRange.startYear, 1);

    return filteredPoints.map((point) => ({
      ...point,
      x: margin.left + ((point.value / maxValue) * innerWidth),
      y:
        margin.top +
        innerHeight -
        (((point.year - activeRange.startYear) / yearSpan) * innerHeight),
    }));
  }, [activeRange.endYear, activeRange.startYear, filteredPoints, innerHeight, innerWidth, maxValue]);

  const activePoint = hoveredPointIndex !== null ? chartPoints[hoveredPointIndex] : null;
  const tooltipWidth = 78;
  const tooltipHeight = 30;
  const tooltipOffset = 10;

  const tooltipPosition = useMemo(() => {
    if (!activePoint) {
      return null;
    }

    const preferredX = activePoint.x + tooltipOffset;
    const preferredY = activePoint.y - 38;
    const fallbackY = activePoint.y + 12;

    const x = Math.min(
      Math.max(preferredX, margin.left),
      chartWidth - margin.right - tooltipWidth,
    );

    const y = preferredY < margin.top
      ? Math.min(fallbackY, chartHeight - margin.bottom - tooltipHeight)
      : Math.max(preferredY, margin.top);

    return { x, y };
  }, [activePoint]);

  return (
    <div className="w-full overflow-hidden">
      <div className="w-full min-w-0">
        <div className="mb-5 flex items-center gap-2 text-[12px] text-[#4A4A4A]">
          <span
            className="h-[9px] w-[9px] rounded-full"
            style={{ backgroundColor: '#2AC669' }}
          />
          <span>{line.label}</span>
        </div>

        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-auto w-full"
          role="img"
          aria-label={`${xAxisLabel} line chart for ${activeRange.label}`}
        >
          {yTicks.map((tick) => {
            const y =
              margin.top +
              innerHeight -
              (((tick - activeRange.startYear) / Math.max(activeRange.endYear - activeRange.startYear, 1)) * innerHeight);

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
                  className="fill-[#7C8794] text-[11px]"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {xTicks.map((tick) => {
            const x = margin.left + ((tick / maxValue) * innerWidth);

            return (
              <g key={tick}>
                <line
                  x1={x}
                  y1={margin.top}
                  x2={x}
                  y2={chartHeight - margin.bottom}
                  stroke="#EEF2F6"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={chartHeight - 12}
                  textAnchor="middle"
                  className="fill-[#7C8794] text-[11px]"
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

          <path
            d={createSmoothPath(chartPoints)}
            fill="none"
            stroke={line.color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {chartPoints.map((point, index) => (
            <g key={`${point.year}-${point.value}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r={hoveredPointIndex === index ? 4.5 : 0}
                fill={line.color}
                className="transition-all duration-150"
              />
              <circle
                cx={point.x}
                cy={point.y}
                r="10"
                fill="transparent"
                onMouseEnter={() => setHoveredPointIndex(index)}
                onMouseLeave={() => setHoveredPointIndex(null)}
              />
            </g>
          ))}

          {activePoint ? (
            <g transform={`translate(${tooltipPosition?.x ?? 0}, ${tooltipPosition?.y ?? 0})`}>
              <rect
                width={tooltipWidth}
                height={tooltipHeight}
                rx="8"
                fill="#16341D"
                opacity="0.96"
              />
              <text x="39" y="13" textAnchor="middle" className="fill-white text-[9px]">
                {activePoint.year}
              </text>
              <text x="39" y="23" textAnchor="middle" className="fill-white text-[10px] font-semibold">
                {activePoint.value.toLocaleString()}
              </text>
            </g>
          ) : null}

          <text
            x={chartWidth / 2}
            y={chartHeight + 10}
            textAnchor="middle"
            className="fill-[#313131] text-[12px]"
          >
            {xAxisLabel}
          </text>
          <text
            x="10"
            y={chartHeight / 2}
            textAnchor="middle"
            transform={`rotate(-90 10 ${chartHeight / 2})`}
            className="fill-[#313131] text-[12px]"
          >
            Year
          </text>
        </svg>
      </div>
    </div>
  );
}
