export interface EstateResearchSlide {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  href: string;
}

export const estatesResearchSlides: EstateResearchSlide[] = [
  {
    id: 'dartonfield-group',
    title: 'Dartonfield Group',
    href: '/estates-and-substations/dartonfield-group',
    description:
      'Dartonfield Group manages rubber estates, factories, and research stations, improving yields through modern clones, rain guarding, and optimized tapping systems.',
    bullets: [
      'Rubber estate management',
      'Yield improvement strategies',
      'Research & innovation',
    ],
  },
  {
    id: 'kuruwita-sub-station',
    title: 'Kuruwita Sub-station',
    href: '/estates-and-substations/kuruwita-substation',
    description:
      'Kuruwita Sub-station supports regional field trials and estate advisory work with a focus on cultivation methods and productivity gains.',
    bullets: [
      'Regional field trials',
      'Cultivation support',
      'Productivity monitoring',
    ],
  },
  {
    id: 'nivitigalakelle-sub-station',
    title: 'Nivitigalakelle Sub-station',
    href: '/estates-and-substations/nivitigalakele-substation',
    description:
      'Nivitigalakelle Sub-station strengthens estate performance with localized research, farmer outreach, and technical guidance.',
    bullets: [
      'Localized research',
      'Farmer outreach',
      'Technical guidance',
    ],
  },
  {
    id: 'monaragala-sub-station',
    title: 'Monaragala Sub-station',
    href: '/estates-and-substations/monaragala-substation',
    description:
      'Monaragala Sub-station supports field-based research, nursery work, and regional training activities in non-traditional rubber growing areas.',
    bullets: [
      'Regional research support',
      'Nursery operations',
      'Training and demonstrations',
    ],
  },
  {
    id: 'polgahawela-sub-station',
    title: 'Polgahawela Sub-station',
    href: '/estates-and-substations/polgahawela-substation',
    description:
      'Polgahawela Sub-station contributes climatic monitoring, field observation, and applied production support within the RRISL sub-station network.',
    bullets: [
      'Field monitoring',
      'Production support',
      'Applied research',
    ],
  },
];
