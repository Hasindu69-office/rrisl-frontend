import type { HomePageStat } from '@/app/lib/types';

export interface HeroStatisticItem {
  percentage: string;
  label: string;
}

function normalizeStats(stats: HomePageStat[] | null | undefined): HeroStatisticItem[] {
  if (!Array.isArray(stats)) {
    return [];
  }

  return stats
    .filter((stat): stat is HomePageStat => Boolean(stat))
    .map((stat) => ({
      percentage: stat.percentage || '',
      label: stat.label || '',
    }))
    .filter((stat) => stat.percentage || stat.label);
}

export function resolveHomePageStats(
  localizedStats: HomePageStat[] | null | undefined,
  fallbackStats: HomePageStat[] | null | undefined
): HeroStatisticItem[] {
  const primaryStats = normalizeStats(localizedStats);

  if (primaryStats.length > 0) {
    return primaryStats;
  }

  return normalizeStats(fallbackStats);
}
