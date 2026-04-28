'use client';

import type { StatisticsSummaryData } from './productionStatisticsData';

interface StatisticsDonutChartProps {
  summary: StatisticsSummaryData;
  size?: number;
  strokeWidth?: number;
  compact?: boolean;
}

function formatSummaryValue(value: number) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return `${value}`;
}

function polarToCartesian(cx: number, cy: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

function createArcPath(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

export default function StatisticsDonutChart({
  summary,
  size = 176,
  strokeWidth = 18,
  compact = false,
}: StatisticsDonutChartProps) {
  const total = summary.slices.reduce((sum, slice) => sum + slice.value, 0);
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  const arcs = summary.slices.reduce<Array<StatisticsSummaryData['slices'][number] & {
    startAngle: number;
    endAngle: number;
    percentage: number;
  }>>((items, slice) => {
    const startAngle = items.length > 0 ? items[items.length - 1].endAngle : 0;
    const angle = total === 0 ? 0 : (slice.value / total) * 360;
    const endAngle = startAngle + angle;

    return [
      ...items,
      {
        ...slice,
        startAngle,
        endAngle,
        percentage: total === 0 ? 0 : (slice.value / total) * 100,
      },
    ];
  }, []);

  const containerClassName = compact
    ? 'w-full rounded-[18px] border border-[#E4EDE1] bg-[#FCFEFB] p-3.5 sm:rounded-[20px] sm:p-4'
    : 'rounded-[24px] border border-[#E4EDE1] bg-[linear-gradient(180deg,#FCFEFB_0%,#F6FAF4_100%)] p-5';

  return (
    <div className={containerClassName}>
      {summary.title ? (
        <div className="mb-4">
          <div className="text-[15px] font-semibold text-[#1E6B2F]">
            {summary.title}
          </div>
          {summary.description ? (
            <p className="mt-1 text-[12px] leading-5 text-[#667085]">
              {summary.description}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-5">
        <div className="mx-auto w-fit">
          <div className="relative">
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="h-auto w-[156px] sm:w-[176px]"
              role="img"
              aria-label={summary.ariaLabel}
            >
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#E6EEE3"
                strokeWidth={strokeWidth}
              />

              {arcs.map((slice) => (
                <path
                  key={slice.label}
                  d={createArcPath(center, center, radius, slice.startAngle, slice.endAngle)}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
              ))}
            </svg>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="text-[17px] font-semibold leading-none text-[#16341D] sm:text-[19px]">
                {summary.centerValue ?? formatSummaryValue(total)}
              </div>
              <div className="mt-1 max-w-[76px] text-[9px] font-medium uppercase tracking-[0.08em] text-[#6B7B6F] sm:max-w-[84px] sm:text-[10px]">
                {summary.centerLabel}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          {arcs.map((slice) => (
            <div
              key={`${summary.centerLabel}-${slice.label}`}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-2.5 rounded-[12px] bg-white px-3 py-2.5 shadow-[0_4px_12px_rgba(15,63,29,0.035)] sm:gap-3 sm:rounded-[14px] sm:px-3 sm:py-3 sm:shadow-[0_8px_18px_rgba(15,63,29,0.04)]"
            >
              <span
                className="mt-1 h-[10px] w-[10px] rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              <div className="min-w-0">
                <div className="text-[12px] font-medium leading-5 text-[#24313A] sm:text-[13px]">
                  {slice.label}
                </div>
                <div className="text-[10px] text-[#667085] sm:text-[11px]">
                  {slice.value.toLocaleString()}
                </div>
              </div>
              <div className="pt-0.5 text-[11px] font-semibold text-[#16341D] sm:text-[12px]">
                {Math.round(slice.percentage)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
