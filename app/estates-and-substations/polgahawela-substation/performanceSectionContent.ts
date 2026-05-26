import type { EstateSubstationPerformanceSectionContent } from '@/app/components/estates/EstateSubstationPerformanceSection';

export const polgahawelaPerformanceSectionContent: EstateSubstationPerformanceSectionContent =
  {
    eyebrow: 'Gallery',
    title: 'Production & Field Performance',
    description:
      'The sub-station actively supports rubber production studies while maintaining a strong focus on quality processing and efficient tapping systems.',
    cards: [
      {
        type: 'productionTrend',
        accent: 'green',
        title: 'Total Production (2019)',
        value: '15,678',
        unit: 'kg',
        description: 'of rubber production recorded',
        badgeLabel: 'Year 2019',
        chart: [
          { year: '2010', value: 11200 },
          { year: '2011', value: 11800 },
          { year: '2012', value: 9800 },
          { year: '2013', value: 8200 },
          { year: '2014', value: 9400 },
          { year: '2015', value: 11200 },
          { year: '2016', value: 13100 },
          { year: '2017', value: 12400 },
          { year: '2018', value: 12200 },
          { year: '2019', value: 15678 },
        ],
      },
      {
        type: 'yieldGauge',
        accent: 'green',
        title: 'Yield Performance',
        value: '883',
        unit: 'kg/ha',
        progress: 66,
        description: 'Average yield reached per hectare.',
        insight: 'Consistent plantation productivity across managed estates.',
      },
      {
        type: 'qualityGauge',
        accent: 'gold',
        title: 'RSS Quality',
        value: '73%',
        supportingValue: 'Grade 1',
        progress: 73,
        description:
          'Approximately 73% of total RSS production was sold as Grade 1 quality.',
        insight: 'Highest quality market-grade output.',
      },
      {
        type: 'productivityBars',
        accent: 'green',
        title: 'Tapper Productivity',
        value: '9.4',
        unit: 'kg',
        description: 'Average intake per tapper',
        highlightPrefix: 'Highest productivity recorded from',
        highlightText: 'RRIC 121',
        highlightSuffix: 'clone fields under D3 tapping systems.',
        metadata: ['RRIC 121 Clone', 'D3 System'],
        chart: [
          { label: 'A', value: 4.2 },
          { label: 'B', value: 6.1 },
          { label: 'C', value: 6.3 },
          { label: 'D', value: 7.1 },
          { label: 'E', value: 9.4, highlight: true },
        ],
      },
    ],
    footerNote:
      'These results reflect the dedication of our field teams, innovative research, and the continuous improvement of plantation management practices.',
    cta: {
      label: 'View Detailed Reports',
      href: '#detailed-reports',
    },
  };
