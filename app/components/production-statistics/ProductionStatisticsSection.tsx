'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import GradientTitle from '../ui/GradientTitle';
import StatisticsChartCard from './StatisticsChartCard';
import StatisticsTabButton from './StatisticsTabButton';
import {
  defaultProductionCard,
  statisticsTabContent,
  statisticsTabs,
  type StatisticsChartCardData,
  type StatisticsTabData,
  type StatisticsTabId,
} from './productionStatisticsData';

interface ProductionStatisticsSectionProps {
  sectionTitle?: string;
  tabs?: Partial<Record<StatisticsTabId, StatisticsTabData>>;
  productionCard?: StatisticsChartCardData | null;
  exportCard?: StatisticsChartCardData | null;
  priceCard?: StatisticsChartCardData | null;
  consumptionCard?: StatisticsChartCardData | null;
}

export default function ProductionStatisticsSection({
  sectionTitle = 'Statistics',
  tabs,
  productionCard,
  exportCard,
  priceCard,
  consumptionCard,
}: ProductionStatisticsSectionProps) {
  const [activeTab, setActiveTab] = useState<StatisticsTabId>('production');
  const panelRef = useRef<HTMLDivElement | null>(null);

  const mergedTabContent = {
    ...statisticsTabContent,
    production: {
      ...statisticsTabContent.production,
      ...tabs?.production,
      primaryCard: productionCard ?? tabs?.production?.primaryCard ?? defaultProductionCard,
    },
    export: {
      ...statisticsTabContent.export,
      ...tabs?.export,
      primaryCard: exportCard ?? tabs?.export?.primaryCard ?? statisticsTabContent.export.primaryCard,
    },
    price: {
      ...statisticsTabContent.price,
      ...tabs?.price,
      primaryCard: priceCard ?? tabs?.price?.primaryCard ?? statisticsTabContent.price.primaryCard,
    },
    consumption: {
      ...statisticsTabContent.consumption,
      ...tabs?.consumption,
      primaryCard:
        consumptionCard ?? tabs?.consumption?.primaryCard ?? statisticsTabContent.consumption.primaryCard,
    },
    plantation: {
      ...statisticsTabContent.plantation,
      ...tabs?.plantation,
      primaryCard: tabs?.plantation?.primaryCard ?? statisticsTabContent.plantation.primaryCard,
    },
  };

  const activeContent = mergedTabContent[activeTab];
  const tabItems = statisticsTabs.map((tab) => ({
    ...tab,
    label: mergedTabContent[tab.id].label,
  }));

  useLayoutEffect(() => {
    if (!panelRef.current || typeof window === 'undefined') {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

    const panel = panelRef.current;
    const cards = panel.querySelectorAll<HTMLElement>('[data-stats-card]');

    const context = gsap.context(() => {
      if (isDesktop) {
        gsap.fromTo(
          panel,
          { autoAlpha: 0, y: 32 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out',
            clearProps: 'opacity,visibility,transform',
          },
        );
      } else {
        gsap.fromTo(
          panel,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.36,
            ease: 'power2.out',
            clearProps: 'opacity,visibility',
          },
        );
      }

      if (isDesktop && cards.length > 0) {
        gsap.fromTo(
          cards,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            clearProps: 'opacity,visibility,transform',
            delay: 0.04,
          },
        );
      }
    }, panel);

    return () => context.revert();
  }, [activeTab]);

  return (
    <section className="bg-white px-4 py-16 md:px-6 md:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-[80vw] md:max-w-[92vw] xl:max-w-[80vw]">
        <GradientTitle
          part1=""
          part2={sectionTitle}
          part1Color="dark-green"
          lineBreak={false}
          size="custom"
          customSize="clamp(2.25rem, 3vw, 3.25rem)"
          className="mb-10"
          style={{ lineHeight: '1.1', fontWeight: 600 }}
        />

        <div
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-color:rgba(46,125,50,0.27)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[rgba(46,125,50,0.27)] [&::-webkit-scrollbar-thumb:hover]:bg-[rgba(46,125,50,0.45)] md:mx-0 md:gap-3 md:px-0 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:pb-0 lg:[scrollbar-width:auto]"
          role="tablist"
          aria-label="Statistics categories"
        >
          {tabItems.map((tab) => (
            <StatisticsTabButton
              key={tab.id}
              id={tab.id}
              label={tab.label}
              active={activeTab === tab.id}
              onClick={setActiveTab}
            />
          ))}
        </div>

        <div
          ref={panelRef}
          id={`statistics-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`statistics-tab-${activeTab}`}
          className="mt-8 sm:mt-10 lg:mt-[56px]"
        >
          <div className="mb-6 max-w-[840px] sm:mb-8">
            <div className="text-[13px] font-medium uppercase tracking-[0.12em] text-[#1E6B2F]">
              {activeContent.insightLabel}
            </div>
            <h2 className="mt-3 text-[24px] font-semibold leading-tight text-[#1D2939] sm:text-[28px] lg:text-[34px]">
              {activeContent.heading}
            </h2>
            <p className="mt-3 text-[14px] leading-6 text-[#667085] sm:text-[15px] lg:text-[16px] lg:leading-7">
              {activeContent.description}
            </p>
          </div>

          <StatisticsChartCard card={activeContent.primaryCard} />
        </div>
      </div>
    </section>
  );
}
