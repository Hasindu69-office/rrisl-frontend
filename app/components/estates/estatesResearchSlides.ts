export interface EstateResearchSlide {
  id: string;
  title: string;
  description: string;
  bullets: string[];
}

export const estatesResearchSlides: EstateResearchSlide[] = [
  {
    id: 'dartonfield-group',
    title: 'Dartonfield Group',
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
    description:
      'Nivitigalakelle Sub-station strengthens estate performance with localized research, farmer outreach, and technical guidance.',
    bullets: [
      'Localized research',
      'Farmer outreach',
      'Technical guidance',
    ],
  },
  {
    id: 'eladuwa-sub-station',
    title: 'Eladuwa Sub-station',
    description:
      'Eladuwa Sub-station advances practical estate operations by evaluating planting systems, input use, and sustainable field practices.',
    bullets: [
      'Planting system evaluation',
      'Input optimization',
      'Sustainable practices',
    ],
  },
];
