'use client';

import { useMemo, useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import StatisticsLineChart from './StatisticsLineChart';
import type { StatisticsChartCardData } from './productionStatisticsData';

interface StatisticsChartCardProps {
  card: StatisticsChartCardData;
}

export default function StatisticsChartCard({
  card,
}: StatisticsChartCardProps) {
  const [selectedPeriodId, setSelectedPeriodId] = useState<string | null>(null);

  const selectedPeriod = useMemo(
    () =>
      card.periods.find((period) => period.id === selectedPeriodId) ?? null,
    [card.periods, selectedPeriodId],
  );

  return (
    <article
      className={`rounded-[20px] bg-white p-4 shadow-[0_16px_40px_rgba(15,63,29,0.06)] sm:p-5 lg:p-6 ${
        card.fullWidth ? 'xl:col-span-2' : ''
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[24px] font-semibold leading-tight text-[#313131]">
            {card.title}
          </h3>
          <p className="mt-1 text-[14px] text-[#8D8D8D]">
            {card.subtitle}
          </p>
        </div>

        <button
          type="button"
          aria-label={`Reset ${card.title} chart range`}
          onClick={() => setSelectedPeriodId(null)}
          className="rounded-[10px] bg-[#F7F7F7] p-2 text-[#343434] transition-colors hover:bg-[#EEF2F4]"
        >
          <RefreshCcw className="h-4 w-4" strokeWidth={1.8} />
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-2 md:grid-cols-4">
        {card.periods.map((period, index) => {
          const active = period.id === selectedPeriodId;

          return (
            <button
              key={`${card.title}-${period.id}-${index}`}
              type="button"
              onClick={() =>
                setSelectedPeriodId((current) => (current === period.id ? null : period.id))
              }
              className={`rounded-[4px] px-3 py-2 text-center text-[10px] font-medium tracking-[0.02em] transition-colors sm:text-[11px] ${
                active
                  ? 'bg-[#D4DAE1] text-[#24313A]'
                  : 'bg-[#E3E7EB] text-[#4A4A4A] hover:bg-[#DCE2E8]'
              }`}
            >
              {period.label}
            </button>
          );
        })}
      </div>

      <StatisticsLineChart
        line={card.line}
        period={selectedPeriod}
        xAxisLabel={card.xAxisLabel}
        chartWidth={card.chartWidth}
        chartHeight={card.chartHeight}
      />
    </article>
  );
}
