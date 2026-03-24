'use client';

import { useMemo, useState } from 'react';
import type { StatisticsLine, StatisticsPoint, StatisticsPeriod } from './productionStatisticsData';

interface StatisticsLineChartProps {
  line: StatisticsLine;
  period: StatisticsPeriod;
  xAxisLabel: string;
}

interface ChartPoint extends StatisticsPoint {
  x: number;
  y: number;
}

const chartHeight = 230;
const chartWidth = 450;
const margin = {
  top: 16,
  right: 24,
  bottom: 36,
  left: 46,
};

function formatValue(value: number) {
  if (value === 0) return '0';
  if (value >= 1000) return `${Math.round(value / 1000)}K`;
  return `${value}`;
}

function createYearTicks(startYear: number, endYear: number) {
  const step = 2;
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

  const filteredPoints = useMemo(
    () =>
      line.points.filter(
        (point) => point.year >= period.startYear && point.year <= period.endYear,
      ),
    [line.points, period.endYear, period.startYear],
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
    () => createYearTicks(period.startYear, period.endYear),
    [period.endYear, period.startYear],
  );

  const chartPoints = useMemo(() => {
    const yearSpan = Math.max(period.endYear - period.startYear, 1);

    return filteredPoints.map((point) => ({
      ...point,
      x: margin.left + ((point.value / maxValue) * innerWidth),
      y:
        margin.top +
        innerHeight -
        (((point.year - period.startYear) / yearSpan) * innerHeight),
    }));
  }, [filteredPoints, innerHeight, innerWidth, maxValue, period.endYear, period.startYear]);

  const activePoint = hoveredPointIndex !== null ? chartPoints[hoveredPointIndex] : null;

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[470px]">
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
          aria-label={`${xAxisLabel} line chart for ${period.label}`}
        >
          {yTicks.map((tick) => {
            const y =
              margin.top +
              innerHeight -
              (((tick - period.startYear) / Math.max(period.endYear - period.startYear, 1)) * innerHeight);

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
            <g transform={`translate(${activePoint.x + 8}, ${activePoint.y - 38})`}>
              <rect
                width="78"
                height="30"
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
            y={chartHeight}
            textAnchor="middle"
            className="fill-[#313131] text-[12px]"
          >
            {xAxisLabel}
          </text>
          <text
            x="16"
            y={chartHeight / 2}
            textAnchor="middle"
            transform={`rotate(-90 16 ${chartHeight / 2})`}
            className="fill-[#313131] text-[12px]"
          >
            Year
          </text>
        </svg>
      </div>
    </div>
  );
}
