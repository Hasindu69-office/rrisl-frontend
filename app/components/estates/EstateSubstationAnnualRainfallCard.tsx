'use client';

import { useEffect, useId, useState } from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  LabelList,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  BarChart3,
  CalendarRange,
  CloudRain,
  Droplets,
  Info,
  Leaf,
  PieChart,
  TrendingUp,
} from 'lucide-react';

export interface AnnualRainfallDatum {
  year: string;
  rainfall: number;
}

export interface AnnualRainfallSummaryCard {
  label: string;
  value: string;
  detail: string;
  icon: 'average' | 'highest' | 'period';
  accent: 'blue' | 'green' | 'indigo';
}

export interface AnnualRainfallInsightCard {
  label: string;
  value: string;
  detail: string;
  icon: 'insight' | 'highest' | 'lowest' | 'total' | 'variation';
  accent: 'green' | 'blue' | 'teal' | 'purple';
}

export interface EstateSubstationAnnualRainfallCardContent {
  title: string;
  subtitle: string;
  description: string;
  yAxisLabel: string;
  xAxisLabel: string;
  yAxisTicks: number[];
  yAxisMax: number;
  averageLineValue: number;
  averageLineLabel: string;
  highestAnnotation: {
    year: string;
    value: number;
    label: string;
  };
  summaryCards: AnnualRainfallSummaryCard[];
  years: AnnualRainfallDatum[];
  insightCards: AnnualRainfallInsightCard[];
  sourceNote: string;
}

function VerticalAxisTitle({ text }: { text: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-8 top-1/2 z-10 -translate-y-1/2 -rotate-90 text-[12px] font-semibold text-[#35475F] md:left-0"
    >
      {text}
    </div>
  );
}

const accentStyles = {
  blue: {
    iconBg: 'bg-[#EEF5FF]',
    iconColor: 'text-[#246BDE]',
    valueColor: 'text-[#246BDE]',
  },
  green: {
    iconBg: 'bg-[#EBF9EE]',
    iconColor: 'text-[#2EA44F]',
    valueColor: 'text-[#1E7A3A]',
  },
  indigo: {
    iconBg: 'bg-[#EEF2FF]',
    iconColor: 'text-[#5C72C9]',
    valueColor: 'text-[#2B3B5F]',
  },
  teal: {
    iconBg: 'bg-[#EAF8F6]',
    iconColor: 'text-[#2FA89A]',
    valueColor: 'text-[#288B81]',
  },
  purple: {
    iconBg: 'bg-[#F2EEFF]',
    iconColor: 'text-[#7D61D6]',
    valueColor: 'text-[#5B49AF]',
  },
} as const;

function SummaryIcon({
  icon,
  className,
}: {
  icon: AnnualRainfallSummaryCard['icon'];
  className?: string;
}) {
  switch (icon) {
    case 'average':
      return <Droplets className={className} strokeWidth={1.8} />;
    case 'highest':
      return <TrendingUp className={className} strokeWidth={1.8} />;
    case 'period':
      return <CalendarRange className={className} strokeWidth={1.8} />;
    default:
      return null;
  }
}

function InsightIcon({
  icon,
  className,
}: {
  icon: AnnualRainfallInsightCard['icon'];
  className?: string;
}) {
  switch (icon) {
    case 'insight':
      return <CloudRain className={className} strokeWidth={1.8} />;
    case 'highest':
      return <TrendingUp className={className} strokeWidth={1.8} />;
    case 'lowest':
      return <BarChart3 className={className} strokeWidth={1.8} />;
    case 'total':
      return <PieChart className={className} strokeWidth={1.8} />;
    case 'variation':
      return <TrendingUp className={className} strokeWidth={1.8} />;
    default:
      return null;
  }
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}) {
  const rainfall = payload?.[0]?.value;

  if (!active || typeof rainfall !== 'number') {
    return null;
  }

  return (
    <div className="rounded-[14px] border border-[#DCE7F4] bg-white/95 px-3 py-2 shadow-[0_14px_28px_rgba(36,107,222,0.12)] backdrop-blur-sm">
      <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#2E7D32]">
        {label}
      </div>
      <div className="mt-1 text-[15px] font-semibold text-[#246BDE]">
        {rainfall.toLocaleString()} mm
      </div>
      <div className="text-[11px] text-[#5A6A80]">Total annual rainfall</div>
    </div>
  );
}

function BarValueLabel({
  x,
  y,
  width,
  value,
}: {
  x?: number;
  y?: number;
  width?: number;
  value?: number | string;
}) {
  if (
    typeof x !== 'number' ||
    typeof y !== 'number' ||
    typeof width !== 'number' ||
    typeof value !== 'number'
  ) {
    return null;
  }

  return (
    <text
      x={x + width / 2}
      y={y - 14}
      textAnchor="middle"
      fill="#2D3646"
      fontSize={11}
      fontWeight={700}
    >
      {value.toLocaleString()} mm
    </text>
  );
}

function HighestLabel({
  viewBox,
  text,
}: {
  viewBox?: { x?: number; y?: number };
  text: string;
}) {
  if (!viewBox || typeof viewBox.x !== 'number' || typeof viewBox.y !== 'number') {
    return null;
  }

  const width = 152;
  const height = 28;
  const x = viewBox.x - width / 2;
  const y = viewBox.y - 62;

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={8} fill="#2EA44F" />
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

function AverageLineLabel({
  viewBox,
  value,
}: {
  viewBox?: { x?: number; y?: number; width?: number };
  value: string;
}) {
  if (
    !viewBox ||
    typeof viewBox.x !== 'number' ||
    typeof viewBox.y !== 'number' ||
    typeof viewBox.width !== 'number'
  ) {
    return null;
  }

  const textWidth = Math.max(88, value.length * 6.5 + 18);
  const x = viewBox.x + viewBox.width - 12;
  const y = viewBox.y - 10;

  return (
    <g>
      <rect
        x={x - textWidth}
        y={y - 12}
        width={textWidth}
        height={20}
        rx={10}
        fill="rgba(255,255,255,0.96)"
        stroke="#D9E6FA"
      />
      <text
        x={x - 10}
        y={y + 2}
        textAnchor="end"
        fill="#246BDE"
        fontSize={10}
        fontWeight={700}
      >
        {value}
      </text>
    </g>
  );
}

function SummaryCard({ item }: { item: AnnualRainfallSummaryCard }) {
  const accent = accentStyles[item.accent];

  return (
    <article className="rounded-[16px] border border-[#E5EAF4] bg-white/92 px-3 py-3 shadow-[0_10px_22px_rgba(31,62,95,0.05)] md:px-3.5 md:py-3.5">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full md:h-10 md:w-10 ${accent.iconBg}`}
      >
        <SummaryIcon icon={item.icon} className={`h-4 w-4 md:h-4.5 md:w-4.5 ${accent.iconColor}`} />
      </div>
      <div className="mt-2 text-[11px] leading-[1.3] text-[#5E6F87] md:text-[12px]">
        {item.label}
      </div>
      <div
        className={`mt-1 text-[15px] font-semibold leading-[1.1] ${accent.valueColor} md:text-[16px]`}
      >
        {item.value}
      </div>
      <div className="mt-1 text-[10px] leading-[1.3] text-[#607087] md:text-[11px]">
        {item.detail}
      </div>
    </article>
  );
}

function InsightCard({ item }: { item: AnnualRainfallInsightCard }) {
  const accent = accentStyles[item.accent];

  return (
    <article className="min-h-[122px] rounded-[16px] border border-[#E3EAF3] bg-white/80 px-3 py-3 md:px-4">
      <div className="flex items-start gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${accent.iconBg}`}>
          <InsightIcon icon={item.icon} className={`h-5 w-5 ${accent.iconColor}`} />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-medium leading-[1.35] text-[#617089]">
            {item.label}
          </div>
          <div className={`mt-1 text-[16px] font-semibold leading-[1.15] ${accent.valueColor}`}>
            {item.value}
          </div>
          <div className="mt-1 text-[12px] leading-[1.45] text-[#6A7A91]">
            {item.detail}
          </div>
        </div>
      </div>
    </article>
  );
}

function FeaturedInsightCard({ item }: { item: AnnualRainfallInsightCard }) {
  const accent = accentStyles[item.accent];

  return (
    <article className="rounded-[18px] border border-[#CDE6D7] bg-white/86 px-4 py-4 shadow-[0_10px_22px_rgba(31,62,95,0.04)] md:px-5">
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${accent.iconBg}`}>
          <InsightIcon icon={item.icon} className={`h-5 w-5 ${accent.iconColor}`} />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-medium uppercase tracking-[0.04em] leading-[1.3] text-[#617089]">
            {item.label}
          </div>
          <div className={`mt-2 max-w-[360px] text-[18px] font-semibold leading-[1.25] ${accent.valueColor}`}>
            {item.value}
          </div>
          <div className="mt-2 max-w-[420px] text-[13px] leading-[1.6] text-[#6A7A91] md:text-[14px]">
            {item.detail}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function EstateSubstationAnnualRainfallCard({
  content,
}: {
  content: EstateSubstationAnnualRainfallCardContent;
}) {
  const [viewportWidth, setViewportWidth] = useState(1280);
  const gradientId = useId().replace(/:/g, '');
  const barGradientId = `${gradientId}-bar`;
  const highestYear = content.highestAnnotation.year;
  const highestValue = content.highestAnnotation.value;
  const [featuredInsight, ...metricInsights] = content.insightCards;
  const isCompact = viewportWidth < 640;
  const isTablet = viewportWidth >= 640 && viewportWidth < 1024;
  const chartHeightClassName = isCompact
    ? 'h-[280px]'
    : isTablet
      ? 'h-[340px]'
      : 'h-[420px]';
  const chartMargin = isCompact
    ? { top: 22, right: 12, left: 4, bottom: 18 }
    : isTablet
      ? { top: 28, right: 28, left: 20, bottom: 24 }
      : { top: 34, right: 48, left: 34, bottom: 28 };
  const xTickFontSize = isCompact ? 10 : 12;
  const yTickFontSize = isCompact ? 10 : 12;
  const yAxisWidth = isCompact ? 42 : isTablet ? 52 : 62;
  const barSize = isCompact ? 20 : isTablet ? 26 : 34;

  useEffect(() => {
    const updateViewportWidth = () => {
      setViewportWidth(window.innerWidth);
    };

    updateViewportWidth();
    window.addEventListener('resize', updateViewportWidth);

    return () => window.removeEventListener('resize', updateViewportWidth);
  }, []);

  return (
    <article className="w-full rounded-[22px] border border-white/80 bg-white/88 p-3.5 shadow-[0_22px_60px_rgba(31,62,95,0.08)] backdrop-blur-[2px] md:rounded-[30px] md:p-5 lg:p-6">
      <div className="grid gap-4 min-[960px]:grid-cols-[minmax(320px,1fr)_396px] min-[960px]:items-start min-[960px]:gap-5">
        <div className="flex min-w-0 items-start gap-3 text-left md:gap-4">
          <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,#F5FFEC_0%,#EBF7D8_100%)] md:h-[64px] md:w-[64px]">
            <CloudRain className="h-7 w-7 text-[#4BA965] md:h-8 md:w-8" strokeWidth={1.8} />
          </div>
          <div className="min-w-0 max-w-[500px]">
            <h3 className="max-w-[420px] text-[21px] font-semibold leading-[1.04] tracking-[-0.02em] text-[#1E7A3A] md:text-[26px] min-[960px]:max-w-[440px]">
              {content.title}
            </h3>
            <p className="mt-1.5 text-[14px] leading-[1.3] text-[#334D73] md:text-[17px]">
              {content.subtitle}
            </p>
          </div>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-3 min-[960px]:w-[396px] min-[960px]:self-start">
          {content.summaryCards.map((item) => (
            <SummaryCard key={`${item.label}-${item.value}`} item={item} />
          ))}
        </div>
      </div>

      <p className="mt-4 max-w-[600px] text-left text-[13px] leading-[1.72] text-[#5E6F87] md:text-[15px]">
        {content.description}
      </p>

      <div className="mt-5 rounded-[18px] border border-[#DFE6F1] bg-white/78 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] md:rounded-[20px] md:p-4">
        <div
          className={`relative w-full overflow-hidden rounded-[16px] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(244,248,255,0.98)_100%)] md:rounded-[18px] ${chartHeightClassName}`}
        >
          <div className="absolute inset-0 rounded-[18px] border border-[#E7EDF7]" />
          <VerticalAxisTitle text={content.yAxisLabel} />

          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={content.years}
              margin={chartMargin}
              accessibilityLayer
            >
              <defs>
                <linearGradient id={barGradientId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#58C57A" />
                  <stop offset="100%" stopColor="#1F77D8" />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} stroke="#DCE6F2" strokeDasharray="3 4" />

              <XAxis
                dataKey="year"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#374B65', fontSize: xTickFontSize, fontWeight: 500 }}
                dy={isCompact ? 5 : 8}
                interval={isCompact ? 'preserveStartEnd' : 0}
                label={{
                  value: content.xAxisLabel,
                  position: 'insideBottom',
                  offset: isCompact ? -2 : -6,
                  fill: '#35475F',
                  fontSize: isCompact ? 10 : 12,
                  fontWeight: 600,
                }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                width={yAxisWidth}
                domain={[0, content.yAxisMax]}
                ticks={content.yAxisTicks}
                tick={{ fill: '#5A6C85', fontSize: yTickFontSize }}
                tickFormatter={(value: number) => value.toLocaleString()}
              />

              <Tooltip
                cursor={{ fill: 'rgba(36,107,222,0.06)' }}
                content={<ChartTooltip />}
              />

              <ReferenceLine
                y={content.averageLineValue}
                stroke="#7BA7EF"
                strokeDasharray="4 4"
                ifOverflow="extendDomain"
                label={isCompact ? undefined : <AverageLineLabel value={content.averageLineLabel} />}
              />

              <Bar
                dataKey="rainfall"
                fill={`url(#${barGradientId})`}
                radius={[8, 8, 0, 0]}
                barSize={barSize}
                isAnimationActive={false}
              >
                {!isCompact ? <LabelList dataKey="rainfall" content={<BarValueLabel />} /> : null}
              </Bar>

              <ReferenceDot
                x={highestYear}
                y={highestValue}
                r={6.5}
                fill="#2EA44F"
                stroke="#FFFFFF"
                strokeWidth={3}
                ifOverflow="visible"
                label={isCompact ? undefined : <HighestLabel text={content.highestAnnotation.label} />}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 rounded-[18px] border border-[#CDE6D7] bg-[linear-gradient(180deg,#FCFEFD_0%,#F7FBF8_100%)] p-3 md:mt-5 md:p-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)] lg:items-start">
            {featuredInsight ? <FeaturedInsightCard item={featuredInsight} /> : null}

            <div className="grid gap-3 md:grid-cols-2">
              {metricInsights.map((item) => (
                <InsightCard key={`${item.label}-${item.value}`} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-start gap-3 md:flex-row md:justify-between md:gap-4">
        <div className="flex items-start gap-2 text-left text-[11px] leading-[1.55] text-[#70819A] md:text-[12px]">
          <Info className="mt-[1px] h-4 w-4 shrink-0 text-[#2E7D32]" strokeWidth={1.8} />
          <span>{content.sourceNote}</span>
        </div>
        <div className="hidden shrink-0 items-center gap-1 text-[#67B06A] lg:flex">
          <Leaf className="h-5 w-5" strokeWidth={1.6} />
          <Leaf className="h-4 w-4 -translate-y-1" strokeWidth={1.6} />
        </div>
      </div>

      <div className="sr-only">
        <p>
          {content.title}. {content.subtitle}. {content.description}
        </p>
        <ul>
          {content.years.map((item) => (
            <li key={item.year}>
              {item.year}: {item.rainfall} millimeters
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
