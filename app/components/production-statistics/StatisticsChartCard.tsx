'use client';

import { useMemo, useState } from 'react';
import StatisticsBarChart from './StatisticsBarChart';
import StatisticsDonutChart from './StatisticsDonutChart';
import StatisticsLineChart from './StatisticsLineChart';
import type {
  StatisticsBarDatum,
  StatisticsChartCardData,
  StatisticsKpi,
  StatisticsPeriod,
  StatisticsPoint,
  StatisticsSummaryData,
} from './productionStatisticsData';

interface StatisticsChartCardProps {
  card: StatisticsChartCardData;
}

const allPeriodsId = 'all-years';

function formatCompactValue(value: number) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return `${value}`;
}

function createDynamicTrendKpis(points: StatisticsPoint[]): StatisticsKpi[] {
  const latest = points[points.length - 1];
  const previous = points[points.length - 2] ?? latest;
  const delta = latest.value - previous.value;

  return [
    {
      label: 'Latest value',
      value: latest.value.toLocaleString(),
      detail: `${latest.year}`,
    },
    {
      label: 'Change',
      value: `${delta >= 0 ? '+' : ''}${formatCompactValue(delta)}`,
      detail: `vs ${previous.year}`,
    },
    {
      label: 'Period',
      value: `${points[0].year} - ${latest.year}`,
      detail: `${points.length} data points`,
    },
  ];
}

export default function StatisticsChartCard({
  card,
}: StatisticsChartCardProps) {
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>(
    card.defaultPeriodId ?? allPeriodsId,
  );

  const selectedPeriod = useMemo(
    () =>
      card.periods?.find((period) => period.id === selectedPeriodId) ?? null,
    [card.periods, selectedPeriodId],
  );

  const filteredPoints = useMemo(() => {
    if (!card.line) {
      return [];
    }

    if (!selectedPeriod) {
      return card.line.points;
    }

    return card.line.points.filter(
      (point) => point.year >= selectedPeriod.startYear && point.year <= selectedPeriod.endYear,
    );
  }, [card.line, selectedPeriod]);

  const activeBarSnapshot = useMemo(() => {
    if (!card.barSeries || card.barSeries.length === 0) {
      return null;
    }

    const allPoints = card.barSeries.flatMap((series) => series.points);
    const latestYear = Math.max(...allPoints.map((point) => point.year));
    const snapshotYear = selectedPeriod?.endYear ?? latestYear;

    const bars: StatisticsBarDatum[] = card.barSeries.map((series) => {
      const matchingPoint =
        [...series.points]
          .reverse()
          .find((point) => point.year <= snapshotYear) ?? series.points[series.points.length - 1];

      return {
        label: series.label,
        value: matchingPoint.value,
        color: series.color,
      };
    });

    return {
      snapshotYear,
      bars,
    };
  }, [card.barSeries, selectedPeriod]);

  const activeKpis = useMemo(() => {
    if (card.primaryChartType !== 'trend' || filteredPoints.length === 0) {
      if (card.primaryChartType !== 'bar' || !activeBarSnapshot) {
        return card.kpis;
      }

      const total = activeBarSnapshot.bars.reduce((sum, bar) => sum + bar.value, 0);
      const topCategory = activeBarSnapshot.bars.reduce((best, current) =>
        current.value > best.value ? current : best,
      );
      const lowestCategory = activeBarSnapshot.bars.reduce((lowest, current) =>
        current.value < lowest.value ? current : lowest,
      );

      return [
        {
          label: 'Latest total',
          value: `${formatCompactValue(total)}`,
          detail: `Year ${activeBarSnapshot.snapshotYear} across all categories`,
        },
        {
          label: 'Top category',
          value: topCategory.label,
          detail: `${topCategory.value.toLocaleString()} in ${activeBarSnapshot.snapshotYear}`,
        },
        {
          label: 'Lowest category',
          value: lowestCategory.label,
          detail: `${lowestCategory.value.toLocaleString()} in ${activeBarSnapshot.snapshotYear}`,
        },
      ];
    }

    return createDynamicTrendKpis(filteredPoints);
  }, [activeBarSnapshot, card.kpis, card.primaryChartType, filteredPoints]);

  const activeShareSummary = useMemo<StatisticsSummaryData | undefined>(() => {
    if (card.primaryChartType !== 'bar' || !activeBarSnapshot || !card.shareSummary) {
      return card.shareSummary;
    }

    const total = activeBarSnapshot.bars.reduce((sum, bar) => sum + bar.value, 0);

    return {
      ...card.shareSummary,
      description: `Share across the six production categories in ${activeBarSnapshot.snapshotYear}.`,
      centerValue: formatCompactValue(total),
      slices: activeBarSnapshot.bars.map((bar) => ({
        label: bar.label,
        value: bar.value,
        color: bar.color,
      })),
    };
  }, [activeBarSnapshot, card.primaryChartType, card.shareSummary]);

  const periodOptions: StatisticsPeriod[] = card.periods ?? [];

  return (
    <article
      data-stats-card
      className="rounded-[22px] bg-white p-4 shadow-[0_10px_26px_rgba(15,63,29,0.05)] sm:rounded-[24px] sm:p-5 sm:shadow-[0_14px_34px_rgba(15,63,29,0.06)] lg:p-7 lg:shadow-[0_16px_40px_rgba(15,63,29,0.06)]"
    >
      <div className="mb-5 flex flex-col gap-3 lg:mb-7 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-[720px]">
          <h3 className="text-[20px] font-semibold leading-tight text-[#1D2939] sm:text-[22px] lg:text-[26px]">
            {card.title}
          </h3>
          <p className="mt-2 text-[13px] leading-6 text-[#667085] sm:text-[14px] lg:text-[15px]">
            {card.subtitle}
          </p>
        </div>

        {card.periods && card.periods.length > 0 ? (
          <div className="inline-flex flex-wrap gap-1.5 rounded-[14px] bg-[#F5F8F6] p-1 sm:gap-2 sm:rounded-[16px] sm:p-1.5">
            <button
              type="button"
              onClick={() => setSelectedPeriodId(allPeriodsId)}
              className={`rounded-[10px] px-2.5 py-1.5 text-[11px] font-medium transition-colors sm:rounded-[12px] sm:px-3 sm:py-2 sm:text-[12px] ${
                selectedPeriodId === allPeriodsId
                  ? 'bg-[#1E6B2F] text-white'
                  : 'text-[#475467] hover:bg-white'
              }`}
            >
              All years
            </button>
            {periodOptions.map((period) => {
              const active = period.id === selectedPeriodId;

              return (
                <button
                  key={period.id}
                  type="button"
                  onClick={() => setSelectedPeriodId(period.id)}
                  className={`rounded-[10px] px-2.5 py-1.5 text-[11px] font-medium transition-colors sm:rounded-[12px] sm:px-3 sm:py-2 sm:text-[12px] ${
                    active
                      ? 'bg-[#1E6B2F] text-white'
                      : 'text-[#475467] hover:bg-white'
                  }`}
                >
                  {period.label}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {card.primaryChartType === 'bar' ? (
        <div className="grid gap-4 lg:gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start xl:gap-8">
          <div className="min-w-0 space-y-4">
            <div className="rounded-[20px] border border-[#EDF2EC] bg-[#FCFEFB] p-3.5 sm:rounded-[22px] sm:p-4 lg:p-5">
              {(card.contextLabel && (activeBarSnapshot?.snapshotYear ?? card.contextValue)) ? (
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#EAF6EC] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[#1E6B2F]">
                    {card.contextLabel}
                  </span>
                  <span className="text-[13px] font-medium text-[#475467]">
                    {activeBarSnapshot?.snapshotYear ?? card.contextValue}
                  </span>
                </div>
              ) : null}

              {(activeBarSnapshot?.bars ?? card.bars) ? (
                <StatisticsBarChart
                  bars={activeBarSnapshot?.bars ?? card.bars ?? []}
                  xAxisLabel={card.xAxisLabel}
                  yAxisLabel={card.yAxisLabel}
                />
              ) : null}
            </div>

            <div className="rounded-[20px] border border-[#E5EEE4] bg-[#FAFCF9] p-3.5 sm:rounded-[22px] sm:p-4 lg:p-5">
              <div className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#6B7B6F]">
                At a glance
              </div>
              <div className="mt-3 grid gap-2.5 sm:mt-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-3">
                {activeKpis.map((kpi) => (
                  <div
                    key={kpi.label}
                    className="rounded-[14px] bg-white px-3 py-3 shadow-[0_6px_16px_rgba(15,63,29,0.04)] sm:rounded-[16px] sm:shadow-[0_8px_20px_rgba(15,63,29,0.05)]"
                  >
                    <div className="text-[12px] text-[#667085]">
                      {kpi.label}
                    </div>
                    <div className="mt-1 text-[20px] font-semibold text-[#16341D]">
                      {kpi.value}
                    </div>
                    {kpi.detail ? (
                      <div className="mt-1 text-[12px] text-[#98A2B3]">
                        {kpi.detail}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="xl:w-[360px] xl:justify-self-end xl:pl-2">
            {activeShareSummary ? (
              <StatisticsDonutChart summary={activeShareSummary} compact />
            ) : null}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start xl:gap-8">
          <div className="min-w-0 space-y-4">
            <div className="rounded-[20px] border border-[#EDF2EC] bg-[#FCFEFB] p-3.5 sm:rounded-[22px] sm:p-4 lg:p-5">
              {card.line ? (
                <StatisticsLineChart
                  line={card.line}
                  points={filteredPoints}
                  xAxisLabel={card.xAxisLabel}
                  yAxisLabel={card.yAxisLabel}
                />
              ) : null}
            </div>

            <div className="rounded-[20px] border border-[#E5EEE4] bg-[#FAFCF9] p-3.5 sm:rounded-[22px] sm:p-4 lg:p-5">
              <div className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#6B7B6F]">
                At a glance
              </div>
              <div className="mt-3 grid gap-2.5 sm:mt-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-3">
                {activeKpis.map((kpi) => (
                  <div
                    key={kpi.label}
                    className="rounded-[14px] bg-white px-3 py-3 shadow-[0_6px_16px_rgba(15,63,29,0.04)] sm:rounded-[16px] sm:shadow-[0_8px_20px_rgba(15,63,29,0.05)]"
                  >
                    <div className="text-[12px] text-[#667085]">
                      {kpi.label}
                    </div>
                    <div className="mt-1 text-[20px] font-semibold text-[#16341D]">
                      {kpi.value}
                    </div>
                    {kpi.detail ? (
                      <div className="mt-1 text-[12px] text-[#98A2B3]">
                        {kpi.detail}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="xl:w-[360px] xl:justify-self-end xl:pl-2">
            {card.shareSummary ? (
              <StatisticsDonutChart summary={card.shareSummary} compact />
            ) : null}
          </div>
        </div>
      )}
    </article>
  );
}
