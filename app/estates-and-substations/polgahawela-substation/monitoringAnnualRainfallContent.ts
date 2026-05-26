import type { EstateSubstationAnnualRainfallCardContent } from '@/app/components/estates/EstateSubstationAnnualRainfallCard';

export const polgahawelaAnnualRainfallContent: EstateSubstationAnnualRainfallCardContent =
  {
    title: 'Total Annual Rainfall',
    subtitle: 'from 2010 to 2019',
    description:
      'This chart shows the total annual rainfall recorded at the sub-station for the past 10 years.',
    yAxisLabel: 'Rainfall (mm)',
    xAxisLabel: 'Year',
    yAxisTicks: [0, 500, 1000, 1500, 2000, 2500, 3000, 3500],
    yAxisMax: 3500,
    averageLineValue: 2472,
    averageLineLabel: '2,472 mm\n10-Year Average',
    highestAnnotation: {
      year: '2014',
      value: 2950,
      label: 'Highest Annual Rainfall',
    },
    summaryCards: [
      {
        label: 'Highest Rainfall',
        value: '2,950 mm',
        detail: 'in 2014',
        icon: 'highest',
        accent: 'green',
      },
      {
        label: 'Data Period',
        value: '2010 - 2019',
        detail: '10 Years',
        icon: 'period',
        accent: 'indigo',
      },
    ],
    years: [
      { year: '2010', rainfall: 2680 },
      { year: '2011', rainfall: 2230 },
      { year: '2012', rainfall: 2290 },
      { year: '2013', rainfall: 2650 },
      { year: '2014', rainfall: 2950 },
      { year: '2015', rainfall: 2880 },
      { year: '2016', rainfall: 2050 },
      { year: '2017', rainfall: 2080 },
      { year: '2018', rainfall: 2760 },
      { year: '2019', rainfall: 2240 },
    ],
    insightCards: [
      {
        label: 'Key Insight',
        value: 'Annual rainfall',
        detail: 'The highest recorded year was 2014 and the lowest in 2016.',
        icon: 'insight',
        accent: 'green',
      },
      {
        label: 'Highest Rainfall',
        value: '2,950 mm',
        detail: 'Year 2014',
        icon: 'highest',
        accent: 'green',
      },
      {
        label: 'Lowest Rainfall',
        value: '2,050 mm',
        detail: 'Year 2016',
        icon: 'lowest',
        accent: 'blue',
      },
      {
        label: 'Total (10 Years)',
        value: '24,720 mm',
        detail: 'Cumulative Rainfall',
        icon: 'total',
        accent: 'teal',
      },
      {
        label: 'Variation Range',
        value: '900 mm',
        detail: '(2,050 - 2,950 mm)',
        icon: 'variation',
        accent: 'purple',
      },
    ],
    sourceNote:
      'Rainfall data recorded daily at the sub-station and reported to the Biometry Division of RRISL.',
  };
