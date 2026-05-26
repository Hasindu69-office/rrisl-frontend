import type { EstateSubstationRainfallDistributionCardContent } from '@/app/components/estates/EstateSubstationRainfallDistributionCard';

export const polgahawelaRainfallDistributionContent: EstateSubstationRainfallDistributionCardContent =
  {
    title: 'Rainfall Distribution',
    subtitle: 'Based on 10-Year Monthly Rainfall Averages',
    description:
      'The chart below shows the average monthly rainfall pattern of the sub-station based on 10 years of recorded data.',
    summaryBadge: {
      label: 'Annual Average Rainfall',
      value: '2,512 mm',
      detail: '(10 Year Average)',
    },
    yAxisLabel: 'Rainfall (mm)',
    xAxisLabel: 'Months',
    yAxisTicks: [0, 100, 200, 300, 400, 500],
    yAxisMax: 550,
    months: [
      { month: 'Jan', rainfall: 65, trend: 65 },
      { month: 'Feb', rainfall: 85, trend: 85 },
      { month: 'Mar', rainfall: 185, trend: 185 },
      { month: 'Apr', rainfall: 295, trend: 295 },
      { month: 'May', rainfall: 310, trend: 310 },
      { month: 'Jun', rainfall: 185, trend: 185 },
      { month: 'Jul', rainfall: 90, trend: 90 },
      { month: 'Aug', rainfall: 135, trend: 135 },
      { month: 'Sep', rainfall: 190, trend: 190 },
      { month: 'Oct', rainfall: 402, trend: 402 },
      { month: 'Nov', rainfall: 365, trend: 365 },
      { month: 'Dec', rainfall: 225, trend: 225 },
    ],
    seasonBands: [
      {
        label: 'Dry Period',
        icon: 'sun',
        startMonth: 'Jan',
        endMonth: 'Feb',
        fill: 'rgba(255, 191, 87, 0.08)',
        textColor: '#B37711',
      },
      {
        label: 'Southwest Monsoon',
        icon: 'southwest-monsoon',
        startMonth: 'Mar',
        endMonth: 'Aug',
        fill: 'rgba(76, 184, 139, 0.06)',
        textColor: '#2D8B67',
      },
      {
        label: 'Northeast Monsoon',
        icon: 'northeast-monsoon',
        startMonth: 'Sep',
        endMonth: 'Dec',
        fill: 'rgba(103, 160, 255, 0.06)',
        textColor: '#246BDE',
      },
    ],
    peakAnnotation: {
      month: 'Oct',
      label: 'Highest Rainfall Period',
      value: 402,
    },
    legend: {
      barLabel: 'Average Rainfall (mm)',
      lineLabel: 'Rainfall Trend',
    },
    sourceNote:
      'Source: Rainfall data recorded daily at the sub-station and reported to RRISL Biometry Division.',
    metricCards: [
      {
        label: 'Highest Rainfall',
        value: 'October',
        detail: '402 mm (Average)',
        icon: 'highest',
        accent: 'green',
      },
      {
        label: 'Lowest Rainfall',
        value: 'January',
        detail: '65 mm (Average)',
        icon: 'lowest',
        accent: 'blue',
      },
      {
        label: 'Annual Average',
        value: '2,512 mm',
        detail: '(10 Year Average)',
        icon: 'average',
        accent: 'mint',
      },
      {
        label: 'Rainfall Pattern',
        value: 'Bimodal',
        detail: 'Distribution',
        icon: 'pattern',
        accent: 'purple',
      },
      {
        label: 'Data Period',
        value: '10 Years',
        detail: 'Monthly Averages',
        icon: 'period',
        accent: 'amber',
      },
    ],
    footerNote:
      'Rainfall pattern shows a bimodal distribution with peaks during the Southwest Monsoon (Apr-May) and Northeast Monsoon (Oct-Nov) periods.',
  };
