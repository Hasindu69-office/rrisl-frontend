'use client';

import { useId } from 'react';
import type { ReactElement } from 'react';
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Line,
  ReferenceArea,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DotItemDotProps, RenderableText } from 'recharts';
import {
  BarChart3,
  CalendarRange,
  CloudRain,
  Droplets,
  Info,
  Sprout,
  SunMedium,
  Waves,
} from 'lucide-react';

export interface RainfallMonthDatum {
  month: string;
  rainfall: number;
  trend: number;
}

export interface RainfallSeasonBand {
  label: string;
  icon: 'sun' | 'southwest-monsoon' | 'northeast-monsoon';
  startMonth: string;
  endMonth: string;
  fill: string;
  textColor: string;
}

export interface RainfallSummaryBadge {
  label: string;
  value: string;
  detail: string;
}

export interface RainfallPeakAnnotation {
  month: string;
  label: string;
  value: number;
}

export interface RainfallMetricCard {
  label: string;
  value: string;
  detail: string;
  icon: 'highest' | 'lowest' | 'average' | 'pattern' | 'period';
  accent: 'green' | 'blue' | 'mint' | 'purple' | 'amber';
}

export interface EstateSubstationRainfallDistributionCardContent {
  title: string;
  subtitle: string;
  description: string;
  summaryBadge: RainfallSummaryBadge;
  yAxisLabel: string;
  xAxisLabel: string;
  yAxisTicks: number[];
  yAxisMax: number;
  months: RainfallMonthDatum[];
  seasonBands: RainfallSeasonBand[];
  peakAnnotation: RainfallPeakAnnotation;
  legend: {
    barLabel: string;
    lineLabel: string;
  };
  sourceNote: string;
  metricCards: RainfallMetricCard[];
  footerNote: string;
}

interface TooltipContentProps {
  active?: boolean;
  payload?: Array<{
    value?: number;
    payload?: RainfallMonthDatum;
  }>;
  label?: string;
}

interface ValueLabelRendererProps {
  x?: number | string;
  y?: number | string;
  value?: RenderableText;
  index?: number;
}

function VerticalAxisTitle({ text }: { text: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-6 top-1/2 z-10 -translate-y-1/2 -rotate-90 text-[12px] font-semibold text-[#35475F] md:left-0"
    >
      {text}
    </div>
  );
}

const accentStyles = {
  green: {
    iconBg: 'bg-[#EBF9EE]',
    iconColor: 'text-[#42A85B]',
    valueColor: 'text-[#1E7A3A]',
  },
  blue: {
    iconBg: 'bg-[#EEF5FF]',
    iconColor: 'text-[#2F7AE5]',
    valueColor: 'text-[#246BDE]',
  },
  mint: {
    iconBg: 'bg-[#EAF8EF]',
    iconColor: 'text-[#57B885]',
    valueColor: 'text-[#228B52]',
  },
  purple: {
    iconBg: 'bg-[#F2EEFF]',
    iconColor: 'text-[#7D61D6]',
    valueColor: 'text-[#5140A8]',
  },
  amber: {
    iconBg: 'bg-[#FFF6E6]',
    iconColor: 'text-[#B88413]',
    valueColor: 'text-[#A36E02]',
  },
} as const;

function MetricIcon({
  icon,
  className,
}: {
  icon: RainfallMetricCard['icon'];
  className?: string;
}) {
  switch (icon) {
    case 'highest':
      return <BarChart3 className={className} strokeWidth={1.8} />;
    case 'lowest':
      return <Droplets className={className} strokeWidth={1.8} />;
    case 'average':
      return <CloudRain className={className} strokeWidth={1.8} />;
    case 'pattern':
      return <Waves className={className} strokeWidth={1.8} />;
    case 'period':
      return <CalendarRange className={className} strokeWidth={1.8} />;
    default:
      return null;
  }
}

function SeasonIcon({
  icon,
  className,
}: {
  icon: RainfallSeasonBand['icon'];
  className?: string;
}) {
  switch (icon) {
    case 'sun':
      return <SunMedium className={className} strokeWidth={1.8} />;
    case 'southwest-monsoon':
    case 'northeast-monsoon':
      return <CloudRain className={className} strokeWidth={1.8} />;
    default:
      return null;
  }
}

function RainfallTooltip({ active, payload, label }: TooltipContentProps) {
  const point = payload?.[0]?.payload;
  const rainfall = payload?.[0]?.value;

  if (!active || !point || typeof rainfall !== 'number') {
    return null;
  }

  return (
    <div className="rounded-[14px] border border-[#DCE7F4] bg-white/95 px-3 py-2 shadow-[0_14px_28px_rgba(36,107,222,0.12)] backdrop-blur-sm">
      <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#2E7D32]">
        {label}
      </div>
      <div className="mt-1 text-[15px] font-semibold text-[#246BDE]">
        {rainfall} mm
      </div>
      <div className="text-[11px] text-[#5A6A80]">Monthly rainfall average</div>
    </div>
  );
}

function ValueLabel({
  x,
  y,
  value,
  index,
  data,
  peakMonth,
}: {
  x?: number | string;
  y?: number | string;
  value?: RenderableText;
  index?: number;
  data: RainfallMonthDatum[];
  peakMonth: string;
}) {
  if (
    (typeof x !== 'number' && typeof x !== 'string') ||
    (typeof y !== 'number' && typeof y !== 'string') ||
    typeof value !== 'number' ||
    typeof index !== 'number'
  ) {
    return null;
  }

  const month = data[index]?.month;
  const fill = month === peakMonth ? '#1F9E55' : '#246BDE';
  const labelX = typeof x === 'number' ? x : Number(x);
  const labelY = typeof y === 'number' ? y : Number(y);

  if (Number.isNaN(labelX) || Number.isNaN(labelY)) {
    return null;
  }

  return (
    <text
      x={labelX}
      y={labelY - 15}
      textAnchor="middle"
      fill={fill}
      fontSize={13}
      fontWeight={700}
    >
      {value}
    </text>
  );
}

function PeakLabel({
  viewBox,
  text,
}: {
  viewBox?: { x?: number; y?: number };
  text: string;
}) {
  if (!viewBox || typeof viewBox.x !== 'number' || typeof viewBox.y !== 'number') {
    return null;
  }

  const width = 134;
  const height = 28;
  const x = viewBox.x - width / 2;
  const y = viewBox.y - 62;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={8}
        fill="#2EA44F"
        opacity={0.98}
      />
      <text
        x={viewBox.x}
        y={y + 18}
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize={12}
        fontWeight={600}
      >
        {text}
      </text>
    </g>
  );
}

function CustomLineDot({
  cx,
  cy,
  payload,
  peakMonth,
}: DotItemDotProps & {
  payload?: RainfallMonthDatum;
  peakMonth: string;
}) {
  if (typeof cx !== 'number' || typeof cy !== 'number' || !payload) {
    return null;
  }

  const isPeak = payload.month === peakMonth;
  const fill = isPeak ? '#2EA44F' : '#246BDE';

  return (
    <g>
      {isPeak ? (
        <circle cx={cx} cy={cy} r={10.5} fill="rgba(46,164,79,0.18)" />
      ) : null}
      <circle cx={cx} cy={cy} r={isPeak ? 6.5 : 5} fill={fill} />
    </g>
  );
}

function renderLineDot(props: DotItemDotProps, peakMonth: string): ReactElement | null {
  return <CustomLineDot {...props} peakMonth={peakMonth} />;
}

function renderValueLabel(
  props: ValueLabelRendererProps,
  data: RainfallMonthDatum[],
  peakMonth: string,
): ReactElement | null {
  return (
    <ValueLabel
      x={props.x}
      y={props.y}
      value={props.value}
      index={props.index}
      data={data}
      peakMonth={peakMonth}
    />
  );
}

function MetricCard({ item }: { item: RainfallMetricCard }) {
  const accent = accentStyles[item.accent];

  return (
    <article className="min-h-[122px] rounded-[16px] border border-[#E6EDF6] bg-white/88 px-4 py-3 shadow-[0_10px_24px_rgba(31,62,95,0.05)] backdrop-blur-sm md:px-4 md:py-3.5">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${accent.iconBg}`}
        >
          <MetricIcon icon={item.icon} className={`h-5 w-5 ${accent.iconColor}`} />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-medium leading-[1.3] text-[#617089]">
            {item.label}
          </div>
          <div className={`mt-1 text-[15px] font-semibold leading-[1.1] ${accent.valueColor} md:text-[16px]`}>
            {item.value}
          </div>
          <div className="mt-1 text-[11px] leading-[1.35] text-[#6A7A91] md:text-[12px]">
            {item.detail}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function EstateSubstationRainfallDistributionCard({
  content,
}: {
  content: EstateSubstationRainfallDistributionCardContent;
}) {
  const chartGradientId = useId().replace(/:/g, '');
  const areaGradientId = `${chartGradientId}-area`;
  const barGradientId = `${chartGradientId}-bar`;
  const peakMonth = content.peakAnnotation.month;

  return (
    <article className="w-full rounded-[26px] border border-white/80 bg-white/88 p-4 shadow-[0_22px_60px_rgba(31,62,95,0.08)] backdrop-blur-[2px] md:rounded-[30px] md:p-5 lg:p-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_258px] lg:items-start lg:gap-5">
        <div className="flex min-w-0 items-start gap-4 text-left">
          <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,#F5FFEC_0%,#EBF7D8_100%)] md:h-[64px] md:w-[64px]">
            <CloudRain className="h-7 w-7 text-[#4BA965] md:h-8 md:w-8" strokeWidth={1.8} />
          </div>
          <div className="min-w-0 max-w-[500px]">
            <h3 className="text-[24px] font-semibold leading-[1.02] tracking-[-0.02em] text-[#125F46] md:text-[26px]">
              {content.title}
            </h3>
            <p className="mt-1.5 max-w-[500px] text-[16px] leading-[1.28] text-[#516684] md:text-[17px]">
              {content.subtitle}
            </p>
          </div>
        </div>

        <div className="w-full rounded-[16px] border border-[#E5EAF4] bg-white/92 px-3.5 py-3 text-left shadow-[0_10px_22px_rgba(31,62,95,0.05)] md:px-4 md:py-3.5 lg:self-start">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EDF4FF] md:h-8.5 md:w-8.5">
              <Droplets className="h-4 w-4 text-[#246BDE] md:h-4.5 md:w-4.5" strokeWidth={1.8} />
            </div>
            <div>
              <div className="text-[10px] leading-[1.3] text-[#6B7C94] md:text-[11px]">
                {content.summaryBadge.label}
              </div>
              <div className="mt-1 text-[15px] font-semibold leading-none text-[#246BDE] md:text-[16px]">
                {content.summaryBadge.value}
              </div>
              <div className="mt-1 text-[10px] leading-[1.3] text-[#607087] md:text-[11px]">
                {content.summaryBadge.detail}
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 max-w-[720px] text-left text-[14px] leading-[1.75] text-[#5E6F87] md:text-[15px]">
        {content.description}
      </p>

      <div className="mt-5 rounded-[20px] border border-[#DFE6F1] bg-white/78 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] md:p-4">
        <div className="mb-3 grid gap-3 text-[11px] font-semibold uppercase tracking-[0.02em] md:grid-cols-3">
          {content.seasonBands.map((band) => (
            <div
              key={`${band.label}-${band.startMonth}`}
              className="flex items-center justify-center gap-2"
              style={{ color: band.textColor }}
            >
              <SeasonIcon icon={band.icon} className="h-4 w-4" />
              <span>{band.label}</span>
            </div>
          ))}
        </div>

        <div className="relative h-[320px] w-full overflow-hidden rounded-[18px] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(244,248,255,0.98)_100%)] md:h-[400px]">
          <div className="absolute inset-0 rounded-[18px] border border-[#E7EDF7]" />
          <div className="absolute inset-x-0 top-0 z-0 h-full rounded-[18px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9)_0%,rgba(250,252,255,0)_56%)]" />
          <VerticalAxisTitle text={content.yAxisLabel} />

          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={content.months}
              margin={{ top: 30, right: 28, left: 34, bottom: 26 }}
              accessibilityLayer
            >
              <defs>
                <linearGradient id={barGradientId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#2A8DD6" />
                  <stop offset="100%" stopColor="#44C1D8" />
                </linearGradient>
                <linearGradient id={areaGradientId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(54,132,226,0.28)" />
                  <stop offset="100%" stopColor="rgba(54,132,226,0.02)" />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} stroke="#DCE6F2" strokeDasharray="3 4" />

              {content.seasonBands.map((band) => (
                <ReferenceArea
                  key={`${band.label}-${band.startMonth}-${band.endMonth}`}
                  x1={band.startMonth}
                  x2={band.endMonth}
                  fill={band.fill}
                  fillOpacity={1}
                  ifOverflow="extendDomain"
                />
              ))}

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#374B65', fontSize: 12, fontWeight: 500 }}
                dy={8}
                label={{
                  value: content.xAxisLabel,
                  position: 'insideBottom',
                  offset: -6,
                  fill: '#35475F',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                width={52}
                domain={[0, content.yAxisMax]}
                ticks={content.yAxisTicks}
                tick={{ fill: '#5A6C85', fontSize: 12 }}
              />

              <Tooltip
                cursor={{ fill: 'rgba(36,107,222,0.06)' }}
                content={<RainfallTooltip />}
              />

              <Area
                type="monotone"
                dataKey="trend"
                fill={`url(#${areaGradientId})`}
                stroke="none"
                isAnimationActive={false}
              />

              <Bar
                dataKey="rainfall"
                fill={`url(#${barGradientId})`}
                radius={[10, 10, 0, 0]}
                barSize={24}
                isAnimationActive={false}
              />

              <Line
                type="monotone"
                dataKey="trend"
                stroke="#246BDE"
                strokeWidth={2}
                dot={(props) => renderLineDot(props, peakMonth)}
                activeDot={{ r: 7, fill: '#FFFFFF', stroke: '#246BDE', strokeWidth: 2 }}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey="trend"
                  content={(props) =>
                    renderValueLabel(props as ValueLabelRendererProps, content.months, peakMonth)
                  }
                />
              </Line>

              <ReferenceDot<string, number>
                x={content.peakAnnotation.month}
                y={content.peakAnnotation.value}
                r={0}
                ifOverflow="visible"
                label={<PeakLabel text={content.peakAnnotation.label} />}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-wrap items-center gap-6 text-[13px] font-medium text-[#4D5E75]">
            <div className="flex items-center gap-2">
              <span className="h-4 w-5 rounded-[5px] bg-[linear-gradient(180deg,#2A8DD6_0%,#44C1D8_100%)]" />
              <span>{content.legend.barLabel}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-2">
                <span className="h-[2px] w-8 bg-[#246BDE]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#246BDE]" />
              </span>
              <span>{content.legend.lineLabel}</span>
            </div>
          </div>

          <div className="flex max-w-[380px] items-start gap-2 text-left text-[12px] leading-[1.55] text-[#70819A] lg:justify-end">
            <Info className="mt-[1px] h-4 w-4 shrink-0 text-[#9AA8BC]" strokeWidth={1.8} />
            <span>{content.sourceNote}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {content.metricCards.map((item) => (
          <MetricCard key={`${item.label}-${item.value}`} item={item} />
        ))}
      </div>

      <div className="mt-5 flex items-start gap-3 text-left">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF7E8]">
          <Sprout className="h-4 w-4 text-[#59A85C]" strokeWidth={1.8} />
        </div>
        <p className="max-w-[980px] text-[13px] leading-[1.75] text-[#5D7089] md:text-[14px]">
          {content.footerNote}
        </p>
      </div>

      <div className="sr-only">
        <p>
          {content.title}. {content.subtitle}. {content.description}
        </p>
        <ul>
          {content.months.map((item) => (
            <li key={item.month}>
              {item.month}: {item.rainfall} millimeters
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
