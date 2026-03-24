'use client';

import { useState } from 'react';
import GradientTitle from '../ui/GradientTitle';
import StatisticsChartCard from './StatisticsChartCard';
import StatisticsTabButton from './StatisticsTabButton';
import {
  statisticsTabContent,
  statisticsTabs,
  type StatisticsTabId,
} from './productionStatisticsData';

export default function ProductionStatisticsSection() {
  const [activeTab, setActiveTab] = useState<StatisticsTabId>('production');

  const activeContent = statisticsTabContent[activeTab];
  const hasCards = activeContent.cards.length > 0;

  return (
    <section className="bg-[#F4F4F2] px-4 py-16 md:px-6 md:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-[80vw]">
        <GradientTitle
          part1=""
          part2="Statistics"
          part1Color="dark-green"
          lineBreak={false}
          size="custom"
          customSize="clamp(2.25rem, 3vw, 3.25rem)"
          className="mb-10"
          style={{ lineHeight: '1.1', fontWeight: 600 }}
        />

        <div
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
          role="tablist"
          aria-label="Statistics categories"
        >
          {statisticsTabs.map((tab) => (
            <StatisticsTabButton
              key={tab.id}
              id={tab.id}
              label={tab.label}
              eyebrow={tab.eyebrow}
              active={activeTab === tab.id}
              onClick={setActiveTab}
            />
          ))}
        </div>

        <div
          id={`statistics-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`statistics-tab-${activeTab}`}
          className="mt-[60px]"
        >
          {hasCards ? (
            <div className="grid gap-x-10 gap-y-10 xl:grid-cols-2">
              {activeContent.cards.map((card) => (
                <StatisticsChartCard
                  key={card.title}
                  card={card}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] bg-white p-10 text-center shadow-[0_16px_40px_rgba(15,63,29,0.06)]">
              <div className="text-[28px] font-semibold text-[#1E6B2F]">
                {activeContent.label}
              </div>
              <p className="mx-auto mt-3 max-w-[620px] text-[16px] leading-7 text-[#667085]">
                The frontend structure for this tab is ready. Chart-specific data and
                visual variations can be added next without changing the overall section
                architecture.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
