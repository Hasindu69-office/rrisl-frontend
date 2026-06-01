'use client';

import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import StatisticsBarChart from './StatisticsBarChart';
import StatisticsDonutChart from './StatisticsDonutChart';
import StatisticsLineChart from './StatisticsLineChart';
import type {
  StatisticsBarDatum,
  StatisticsChartCardData,
  StatisticsKpi,
  StatisticsLine,
  StatisticsPeriod,
  StatisticsPoint,
  StatisticsSidePanelData,
  StatisticsSummaryData,
} from './productionStatisticsData';
import { formatDisplayValue } from './productionStatisticsData';

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

function createDynamicTrendKpis(points: StatisticsPoint[], decimals: number = 1): StatisticsKpi[] {
  const latest = points[points.length - 1];
  const previous = points[points.length - 2] ?? latest;
  const delta = latest.value - previous.value;

  return [
    {
      label: 'Latest value',
      value: formatDisplayValue(latest.value, decimals),
      detail: `${latest.year}`,
    },
    {
      label: 'Change',
      value: `${delta >= 0 ? '+' : ''}${formatDisplayValue(delta, decimals)}`,
      detail: `vs ${previous.year}`,
    },
    {
      label: 'Period',
      value: `${points[0].year} - ${latest.year}`,
      detail: `${points.length} data points`,
    },
  ];
}

function createDynamicMultiLineTrendKpis(lines: StatisticsLine[], decimals: number = 2): StatisticsKpi[] {
  const lineKpis = lines.map((line) => {
    const latest = line.points[line.points.length - 1];

    return {
      label: line.label,
      value: formatDisplayValue(latest.value, decimals),
      detail: `${latest.year}`,
    };
  });

  const allYears = lines.flatMap((line) => line.points.map((point) => point.year));

  return [
    ...lineKpis,
    {
      label: 'Period',
      value: `${Math.min(...allYears)} - ${Math.max(...allYears)}`,
      detail: `${allYears.length > 0 ? new Set(allYears).size : 0} data points`,
    },
  ];
}

function StatisticsDownloadPanel({
  downloadUrl,
  downloadLabel,
  downloadDescription,
}: {
  downloadUrl: string;
  downloadLabel?: string;
  downloadDescription?: string;
}) {
  return (
    <div className="rounded-[20px] border border-[#DDEBDF] bg-[#F5FAF4] p-3.5 sm:rounded-[22px] sm:p-4 lg:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#1E6B2F]">
            Detailed data
          </div>
          <p className="mt-1 text-[13px] leading-6 text-[#667085] sm:text-[14px]">
            {downloadDescription ?? 'Download the underlying dataset in CSV format.'}
          </p>
        </div>

        <a
          href={downloadUrl}
          download
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[14px] bg-[#1E6B2F] px-4 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#175426]"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          {downloadLabel ?? 'Download CSV'}
        </a>
      </div>
    </div>
  );
}

function StatisticsSidePanel({
  panel,
}: {
  panel: StatisticsSidePanelData;
}) {
  return (
    <div className="w-full rounded-[18px] border border-[#E4EDE1] bg-[#FCFEFB] p-3.5 sm:rounded-[20px] sm:p-4">
      <div className="mb-4">
        <div className="text-[15px] font-semibold text-[#1E6B2F]">
          {panel.title}
        </div>
        {panel.description ? (
          <p className="mt-1 text-[12px] leading-5 text-[#667085]">
            {panel.description}
          </p>
        ) : null}
      </div>

      <div className="space-y-2.5 sm:space-y-3">
        {panel.items.map((item) => (
          <div
            key={`${panel.title}-${item.label}`}
            className="rounded-[12px] bg-white px-3 py-3 shadow-[0_4px_12px_rgba(15,63,29,0.035)] sm:rounded-[14px] sm:shadow-[0_8px_18px_rgba(15,63,29,0.04)]"
          >
            <div className="text-[12px] text-[#667085]">
              {item.label}
            </div>
            <div className="mt-1 text-[20px] font-semibold text-[#16341D]">
              {item.value}
            </div>
            {item.detail ? (
              <div className="mt-1 text-[12px] text-[#98A2B3]">
                {item.detail}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
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

  const filteredTrendLines = useMemo(() => {
    const sourceLines = card.lines ?? (card.line ? [card.line] : []);

    if (sourceLines.length === 0) {
      return [];
    }

    return sourceLines.map((line) => ({
      ...line,
      points: selectedPeriod
        ? line.points.filter(
          (point) => point.year >= selectedPeriod.startYear && point.year <= selectedPeriod.endYear,
        )
        : line.points,
    })).filter((line) => line.points.length > 0);
  }, [card.line, card.lines, selectedPeriod]);

  const activeBarSnapshot = useMemo(() => {
    if (!card.barSeries || card.barSeries.length === 0) {
      return null;
    }

    const allPoints = card.barSeries.flatMap((series) => series.points);
    const latestYear = Math.max(...allPoints.map((point) => point.year));
    const targetYear = selectedPeriod?.endYear ?? latestYear;
    const matchingPoints = card.barSeries.map((series) =>
      [...series.points]
        .reverse()
        .find((point) => point.year <= targetYear) ?? series.points[series.points.length - 1]
    );
    const snapshotYear = matchingPoints[0]?.year ?? latestYear;

    const bars: StatisticsBarDatum[] = card.barSeries.map((series, index) => {
      const matchingPoint = matchingPoints[index];

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
    if (card.primaryChartType !== 'trend' || filteredTrendLines.length === 0) {
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

    if (filteredTrendLines.length === 1) {
      return createDynamicTrendKpis(filteredTrendLines[0].points, card.valueDecimals ?? 1);
    }

    return createDynamicMultiLineTrendKpis(filteredTrendLines, card.valueDecimals ?? 2);
  }, [activeBarSnapshot, card.kpis, card.primaryChartType, card.valueDecimals, filteredTrendLines]);

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
          {card.subtitle ? (
            <p className="mt-2 text-[13px] leading-6 text-[#667085] sm:text-[14px] lg:text-[15px]">
              {card.subtitle}
            </p>
          ) : null}
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

            {card.downloadUrl ? (
              <StatisticsDownloadPanel
                downloadUrl={card.downloadUrl}
                downloadLabel={card.downloadLabel}
                downloadDescription={card.downloadDescription}
              />
            ) : null}
          </div>

          <div className="xl:w-[360px] xl:justify-self-end xl:pl-2">
            {activeShareSummary ? (
              <StatisticsDonutChart summary={activeShareSummary} compact />
            ) : card.sidePanel ? (
              <StatisticsSidePanel panel={card.sidePanel} />
            ) : null}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start xl:gap-8">
          <div className="min-w-0 space-y-4">
            <div className="rounded-[20px] border border-[#EDF2EC] bg-[#FCFEFB] p-3.5 sm:rounded-[22px] sm:p-4 lg:p-5">
              {filteredTrendLines.length > 0 ? (
                <StatisticsLineChart
                  lines={filteredTrendLines}
                  xAxisLabel={card.xAxisLabel}
                  yAxisLabel={card.yAxisLabel}
                  valueDecimals={card.valueDecimals}
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

            {card.downloadUrl ? (
              <StatisticsDownloadPanel
                downloadUrl={card.downloadUrl}
                downloadLabel={card.downloadLabel}
                downloadDescription={card.downloadDescription}
              />
            ) : null}
          </div>

          <div className="xl:w-[360px] xl:justify-self-end xl:pl-2">
            {card.shareSummary ? (
              <StatisticsDonutChart summary={card.shareSummary} compact />
            ) : card.sidePanel ? (
              <StatisticsSidePanel panel={card.sidePanel} />
            ) : null}
          </div>
        </div>
      )}
    </article>
  );
}
