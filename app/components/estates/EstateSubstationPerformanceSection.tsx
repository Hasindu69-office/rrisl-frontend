'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { useId } from 'react';
import type { ReactNode } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from 'recharts';
import {
  ArrowRight,
  Award,
  CalendarDays,
  Factory,
  FileText,
  Leaf,
  Sprout,
  UserRound,
} from 'lucide-react';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';

gsap.registerPlugin(ScrollTrigger);

export interface EstateSubstationProductionTrendPoint {
  year: string;
  value: number;
}

export interface EstateSubstationProductivityBarPoint {
  label: string;
  value: number;
  highlight?: boolean;
}

export interface EstateSubstationPerformanceBaseCard {
  title: string;
  accent: 'green' | 'gold';
}

export interface EstateSubstationPerformanceProductionTrendCard
  extends EstateSubstationPerformanceBaseCard {
  type: 'productionTrend';
  value: string;
  unit: string;
  description: string;
  badgeLabel: string;
  chart: EstateSubstationProductionTrendPoint[];
}

export interface EstateSubstationPerformanceYieldGaugeCard
  extends EstateSubstationPerformanceBaseCard {
  type: 'yieldGauge';
  value: string;
  unit: string;
  progress: number;
  description: string;
  insight: string;
}

export interface EstateSubstationPerformanceQualityGaugeCard
  extends EstateSubstationPerformanceBaseCard {
  type: 'qualityGauge';
  value: string;
  supportingValue: string;
  progress: number;
  description: string;
  insight: string;
}

export interface EstateSubstationPerformanceProductivityBarsCard
  extends EstateSubstationPerformanceBaseCard {
  type: 'productivityBars';
  value: string;
  unit: string;
  description: string;
  highlightPrefix: string;
  highlightText: string;
  highlightSuffix: string;
  metadata: string[];
  chart: EstateSubstationProductivityBarPoint[];
}

export type EstateSubstationPerformanceCard =
  | EstateSubstationPerformanceProductionTrendCard
  | EstateSubstationPerformanceYieldGaugeCard
  | EstateSubstationPerformanceQualityGaugeCard
  | EstateSubstationPerformanceProductivityBarsCard;

export interface EstateSubstationPerformanceSectionContent {
  eyebrow: string;
  title: string;
  description: string;
  cards: EstateSubstationPerformanceCard[];
  footerNote: string;
  cta: {
    label: string;
    href: string;
  };
}

export interface EstateSubstationPerformanceSectionProps {
  content: EstateSubstationPerformanceSectionContent;
  className?: string;
  contentClassName?: string;
}

const accentStyles = {
  green: {
    iconBg: 'bg-[#2E7D32]',
    iconColor: 'text-white',
    titleColor: 'text-[#215F2D]',
    valueColor: 'text-[#14532D]',
    softPanel: 'bg-[#F7FBF4]',
    softBorder: 'border-[#E4EDD9]',
    chartPrimary: '#33A948',
    chartSecondary: '#DDF1D2',
    badgeBg: 'bg-[#F2F8EF]',
    badgeText: 'text-[#2E7D32]',
    hoverRing: 'hover:ring-[#A6DB8A] focus-visible:ring-[#A6DB8A]',
    hoverShadow: 'hover:shadow-[0_24px_58px_rgba(15,63,29,0.12)] focus-visible:shadow-[0_24px_58px_rgba(15,63,29,0.12)]',
  },
  gold: {
    iconBg: 'bg-[#D5A208]',
    iconColor: 'text-white',
    titleColor: 'text-[#215F2D]',
    valueColor: 'text-[#A77A04]',
    softPanel: 'bg-[#FFFCF3]',
    softBorder: 'border-[#F1E6C3]',
    chartPrimary: '#D0A11A',
    chartSecondary: '#F4E9C8',
    badgeBg: 'bg-[#FFF8E8]',
    badgeText: 'text-[#8C6A00]',
    hoverRing: 'hover:ring-[#F2D26B] focus-visible:ring-[#F2D26B]',
    hoverShadow: 'hover:shadow-[0_24px_58px_rgba(167,122,4,0.14)] focus-visible:shadow-[0_24px_58px_rgba(167,122,4,0.14)]',
  },
} as const;

const cardMotionClass =
  'transition-[transform,box-shadow,border-color,ring-color,opacity,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none';

function PerformanceCardShell({
  accent,
  title,
  children,
}: {
  accent: EstateSubstationPerformanceBaseCard['accent'];
  title: string;
  children: ReactNode;
}) {
  const styles = accentStyles[accent];

  return (
    <article
      tabIndex={0}
      aria-label={title}
      className={`group flex h-full min-h-[420px] flex-col overflow-hidden rounded-[24px] border ${styles.softBorder} ${styles.softPanel} px-5 py-5 text-left shadow-[0_18px_40px_rgba(15,63,29,0.05)] ring-1 ring-transparent outline-none ${cardMotionClass} hover:-translate-y-0.5 hover:scale-[1.003] focus-visible:-translate-y-0.5 focus-visible:scale-[1.003] focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-white ${styles.hoverRing} ${styles.hoverShadow} md:px-6 md:py-6`}
    >
      {children}
    </article>
  );
}

function CardIcon({
  type,
  accent,
}: {
  type: EstateSubstationPerformanceCard['type'];
  accent: EstateSubstationPerformanceBaseCard['accent'];
}) {
  const styles = accentStyles[accent];

  const icon = (() => {
    switch (type) {
      case 'productionTrend':
        return <Factory className="h-6 w-6" strokeWidth={2} />;
      case 'yieldGauge':
        return <Sprout className="h-6 w-6" strokeWidth={2} />;
      case 'qualityGauge':
        return <Award className="h-6 w-6" strokeWidth={2} />;
      case 'productivityBars':
        return <UserRound className="h-6 w-6" strokeWidth={2} />;
      default:
        return null;
    }
  })();

  return (
    <div
      className={`flex h-14 w-14 items-center justify-center rounded-full ${styles.iconBg} ${styles.iconColor} ${cardMotionClass} group-hover:scale-[1.04] group-focus-visible:scale-[1.04]`}
    >
      {icon}
    </div>
  );
}

function ProductionTrendCard({
  card,
  gradientId,
}: {
  card: EstateSubstationPerformanceProductionTrendCard;
  gradientId: string;
}) {
  const styles = accentStyles[card.accent];
  const firstPoint = card.chart[0];
  const lastPoint = card.chart[card.chart.length - 1];

  return (
    <PerformanceCardShell accent={card.accent} title={card.title}>
      <CardIcon type={card.type} accent={card.accent} />

      <h3 className={`mt-5 text-[20px] font-semibold leading-[1.25] ${styles.titleColor}`}>
        {card.title}
      </h3>

      <div className="mt-4 flex items-end justify-center gap-2 text-center">
        <span className={`text-[34px] font-semibold leading-none ${styles.valueColor}`}>
          {card.value}
        </span>
        <span className="pb-1 text-[18px] font-medium leading-none text-[#4C5C50]">
          {card.unit}
        </span>
      </div>

      <p className="mt-3 text-center text-[15px] leading-[1.75] text-[#4D5D4F]">
        {card.description}
      </p>

      <div className={`mt-5 h-[150px] w-full ${cardMotionClass} group-hover:brightness-[1.03] group-focus-visible:brightness-[1.03]`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={card.chart}
            margin={{ top: 16, right: 6, left: -18, bottom: 18 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={styles.chartPrimary} stopOpacity={0.32} />
                <stop offset="100%" stopColor={styles.chartPrimary} stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={styles.chartPrimary}
              strokeWidth={2.5}
              fill={`url(#${gradientId})`}
              isAnimationActive={false}
              dot={{ r: 3, fill: styles.chartPrimary, strokeWidth: 0 }}
              activeDot={false}
            />
          </AreaChart>
        </ResponsiveContainer>

        <div className="mt-1 flex justify-between text-[12px] text-[#66756A]">
          <span>{firstPoint?.year}</span>
          <span>{lastPoint?.year}</span>
        </div>
      </div>

      <div className="mt-auto pt-5">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-[14px] font-medium ${styles.badgeBg} ${styles.badgeText}`}
        >
          <CalendarDays className="h-4 w-4" strokeWidth={2} />
          <span>{card.badgeLabel}</span>
        </div>
      </div>

      <div className="sr-only">
        <p>
          {card.title}. {card.value} {card.unit}. {card.description}
        </p>
        <ul>
          {card.chart.map((point) => (
            <li key={point.year}>
              {point.year}: {point.value}
            </li>
          ))}
        </ul>
      </div>
    </PerformanceCardShell>
  );
}

function YieldGaugeCard({
  card,
}: {
  card: EstateSubstationPerformanceYieldGaugeCard;
}) {
  const styles = accentStyles[card.accent];
  const gaugeData = [
    { name: 'value', value: Math.max(0, Math.min(card.progress, 100)) },
    { name: 'rest', value: Math.max(0, 100 - Math.min(card.progress, 100)) },
  ];

  return (
    <PerformanceCardShell accent={card.accent} title={card.title}>
      <CardIcon type={card.type} accent={card.accent} />

      <h3 className={`mt-5 text-[20px] font-semibold leading-[1.25] ${styles.titleColor}`}>
        {card.title}
      </h3>

      <div className={`relative mt-4 h-[185px] w-full ${cardMotionClass} group-hover:brightness-[1.03] group-focus-visible:brightness-[1.03]`}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gaugeData}
              dataKey="value"
              innerRadius={60}
              outerRadius={76}
              startAngle={90}
              endAngle={-270}
              cornerRadius={20}
              stroke="none"
              isAnimationActive={false}
            >
              <Cell fill={styles.chartPrimary} />
              <Cell fill={styles.chartSecondary} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-[34px] font-semibold leading-none ${styles.valueColor}`}>
            {card.value}
          </span>
          <span className={`mt-1 text-[18px] font-semibold leading-none ${styles.valueColor}`}>
            {card.unit}
          </span>
        </div>
      </div>

      <p className="mt-1 text-center text-[15px] leading-[1.75] text-[#4D5D4F]">
        {card.description}
      </p>

      <div className="mt-auto pt-5">
        <div
          className={`rounded-[18px] border px-4 py-4 text-[14px] leading-[1.55] ${styles.softBorder} ${styles.badgeBg} ${styles.badgeText}`}
        >
          {card.insight}
        </div>
      </div>

      <div className="sr-only">
        <p>
          {card.title}. {card.value} {card.unit}. {card.description}. Progress {card.progress}
          percent.
        </p>
      </div>
    </PerformanceCardShell>
  );
}

function QualityGaugeCard({
  card,
}: {
  card: EstateSubstationPerformanceQualityGaugeCard;
}) {
  const styles = accentStyles[card.accent];
  const progress = Math.max(0, Math.min(card.progress, 100));
  const gaugeData = [
    { name: 'value', value: progress },
    { name: 'rest', value: 100 - progress },
  ];

  return (
    <PerformanceCardShell accent={card.accent} title={card.title}>
      <CardIcon type={card.type} accent={card.accent} />

      <h3 className={`mt-5 text-[20px] font-semibold leading-[1.25] ${styles.titleColor}`}>
        {card.title}
      </h3>

      <div className={`relative mt-5 h-[190px] w-full ${cardMotionClass} group-hover:brightness-[1.03] group-focus-visible:brightness-[1.03]`}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gaugeData}
              dataKey="value"
              innerRadius={95}
              outerRadius={110}
              startAngle={180}
              endAngle={0}
              cy="74%"
              cornerRadius={18}
              stroke="none"
              isAnimationActive={false}
            >
              <Cell fill={styles.chartPrimary} />
              <Cell fill={styles.chartSecondary} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-x-0 top-[72%] flex -translate-y-1/2 flex-col items-center justify-center text-center">
          <span className={`text-[34px] font-semibold leading-none ${styles.valueColor}`}>
            {card.value}
          </span>
          <span className={`mt-1 text-[18px] font-semibold leading-none ${styles.valueColor}`}>
            {card.supportingValue}
          </span>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-[13px] text-[#4D5D4F]">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>

      <p className="mt-5 text-center text-[15px] leading-[1.75] text-[#4D5D4F]">
        {card.description}
      </p>

      <div className="mt-auto pt-5">
        <div
          className={`rounded-[18px] border px-4 py-4 text-[14px] leading-[1.55] ${styles.softBorder} ${styles.badgeBg} ${styles.badgeText}`}
        >
          {card.insight}
        </div>
      </div>

      <div className="sr-only">
        <p>
          {card.title}. {card.value}. {card.supportingValue}. {card.description}. Gauge value{' '}
          {card.progress} percent.
        </p>
      </div>
    </PerformanceCardShell>
  );
}

function ProductivityBarsCard({
  card,
}: {
  card: EstateSubstationPerformanceProductivityBarsCard;
}) {
  const styles = accentStyles[card.accent];
  const highestBar = [...card.chart].sort((a, b) => b.value - a.value)[0];

  return (
    <PerformanceCardShell accent={card.accent} title={card.title}>
      <CardIcon type={card.type} accent={card.accent} />

      <h3 className={`mt-5 text-[20px] font-semibold leading-[1.25] ${styles.titleColor}`}>
        {card.title}
      </h3>

      <div className="mt-4 flex items-end justify-center gap-2 text-center">
        <span className={`text-[34px] font-semibold leading-none ${styles.valueColor}`}>
          {card.value}
        </span>
        <span className="pb-1 text-[18px] font-medium leading-none text-[#4C5C50]">
          {card.unit}
        </span>
      </div>

      <p className="mt-3 text-center text-[15px] leading-[1.75] text-[#4D5D4F]">
        {card.description}
      </p>

      <div className={`mt-4 h-[145px] w-full ${cardMotionClass} group-hover:brightness-[1.03] group-focus-visible:brightness-[1.03]`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={card.chart} margin={{ top: 14, right: 0, left: 0, bottom: 12 }}>
            <Bar
              dataKey="value"
              radius={[6, 6, 0, 0]}
              barSize={24}
              isAnimationActive={false}
            >
              {card.chart.map((entry) => (
                <Cell
                  key={entry.label}
                  fill={entry.highlight ? styles.chartPrimary : '#A7D59D'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {highestBar ? (
          <div className={`-mt-1 text-right text-[12px] font-semibold ${styles.valueColor}`}>
            {highestBar.value}
          </div>
        ) : null}
      </div>

      <p className="mt-2 text-[15px] leading-[1.75] text-[#4D5D4F]">
        {card.highlightPrefix}{' '}
        <span className="font-semibold text-[#24A154]">{card.highlightText}</span>{' '}
        {card.highlightSuffix}
      </p>

      <div className="mt-auto pt-4">
        <div
          className={`flex flex-wrap items-center gap-x-3 gap-y-2 rounded-[18px] border px-4 py-3 text-[13px] font-medium ${styles.softBorder} ${styles.badgeBg} ${styles.badgeText}`}
        >
          <Leaf className="h-4 w-4" strokeWidth={2} />
          {card.metadata.map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-3">
              {index > 0 ? <span className="h-3 w-px bg-current/25" aria-hidden="true" /> : null}
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="sr-only">
        <p>
          {card.title}. {card.value} {card.unit}. {card.description}. {card.highlightPrefix}{' '}
          {card.highlightText} {card.highlightSuffix}
        </p>
        <ul>
          {card.chart.map((point) => (
            <li key={point.label}>
              {point.label}: {point.value}
            </li>
          ))}
        </ul>
      </div>
    </PerformanceCardShell>
  );
}

function PerformanceCardRenderer({
  card,
  index,
}: {
  card: EstateSubstationPerformanceCard;
  index: number;
}) {
  const baseId = useId().replace(/:/g, '');

  switch (card.type) {
    case 'productionTrend':
      return <ProductionTrendCard card={card} gradientId={`${baseId}-${index}-production`} />;
    case 'yieldGauge':
      return <YieldGaugeCard card={card} />;
    case 'qualityGauge':
      return <QualityGaugeCard card={card} />;
    case 'productivityBars':
      return <ProductivityBarsCard card={card} />;
    default:
      return null;
  }
}

export default function EstateSubstationPerformanceSection({
  content,
  className = '',
  contentClassName = '',
}: EstateSubstationPerformanceSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const footerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (
      typeof window === 'undefined' ||
      !sectionRef.current ||
      !introRef.current
    ) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const sectionNode = sectionRef.current;
    const introNode = introRef.current;
    const orderedCardNodes = cardRefs.current.filter(
      (node): node is HTMLDivElement => Boolean(node)
    );
    const footerNode = footerRef.current;

    const context = gsap.context(() => {
      gsap.set(introNode, {
        autoAlpha: 0,
        y: 14,
      });

      if (orderedCardNodes.length > 0) {
        gsap.set(orderedCardNodes, {
          autoAlpha: 0,
          y: 24,
        });
      }

      if (footerNode) {
        gsap.set(footerNode, {
          autoAlpha: 0,
          y: 18,
        });
      }

      const timeline = gsap.timeline({
        paused: true,
        defaults: {
          ease: 'power3.out',
        },
      });

      timeline.to(introNode, {
        autoAlpha: 1,
        y: 0,
        duration: 0.78,
        clearProps: 'opacity,visibility,transform',
      });

      if (orderedCardNodes.length > 0) {
        timeline.to(
          orderedCardNodes,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.82,
            stagger: 0.16,
            clearProps: 'opacity,visibility,transform',
          },
          '-=0.18'
        );
      }

      if (footerNode) {
        timeline.to(
          footerNode,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.74,
            clearProps: 'opacity,visibility,transform',
          },
          '-=0.06'
        );
      }

      ScrollTrigger.create({
        trigger: sectionNode,
        start: 'top 84%',
        once: true,
        onEnter: () => timeline.play(0),
      });

      ScrollTrigger.refresh();
    }, sectionNode);

    return () => context.revert();
  }, [content.cards.length]);

  cardRefs.current = [];

  return (
    <section
      ref={sectionRef}
      className={`bg-white px-4 py-16 md:px-6 md:py-20 lg:px-36 lg:py-24 ${className}`.trim()}
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div
          ref={introRef}
          className={`mx-auto flex max-w-[860px] flex-col items-center text-center ${contentClassName}`.trim()}
        >
          <GradientTag
            text={content.eyebrow}
            backgroundColor="transparent"
            padding="px-4 py-1.5"
          />

          <GradientTitle
            part1=""
            part2={content.title}
            lineBreak={false}
            align="center"
            size="custom"
            customSize="clamp(2.2rem, 4vw, 3.85rem)"
            className="mt-5 leading-[1.12] tracking-[-0.02em]"
          />

          <p className="mt-6 max-w-[720px] text-[15px] leading-[1.95] text-[#26362B] md:text-[16px] md:leading-[2]">
            {content.description}
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:mt-12 xl:grid-cols-4">
          {content.cards.map((card, index) => (
            <div
              key={`${card.type}-${card.title}`}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              className="h-full"
            >
              <PerformanceCardRenderer card={card} index={index} />
            </div>
          ))}
        </div>

        <div
          ref={footerRef}
          className="mt-7 rounded-[24px] border border-[#E8EEDC] bg-white px-5 py-5 shadow-[0_16px_36px_rgba(15,63,29,0.05)] md:px-6"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#2E7D32] text-white">
                <Leaf className="h-5 w-5" strokeWidth={2} />
              </div>
              <p className="max-w-[760px] text-[15px] leading-[1.8] text-[#4D5D4F]">
                {content.footerNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
