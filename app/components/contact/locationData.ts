export type LocationDetail = {
  label: string;
  value: string;
  href?: string;
};

export type LocationCardData = {
  titlePart1: string;
  titlePart2: string;
  sideLabel: string;
  orientation?: 'details-left' | 'map-left';
  mapSrc: string;
  mapTitle: string;
  details: LocationDetail[];
};

export const headOfficeCard: LocationCardData = {
  titlePart1: 'Head Office and',
  titlePart2: 'Laboratories',
  sideLabel: 'Head office',
  orientation: 'details-left',
  mapTitle: 'Rubber Research Institute of Sri Lanka Head Office Map',
  mapSrc:
    'https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d1588.5838773394985!2d80.16827004326355!3d6.505344001140077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1srubber%20research%20institute%20of%20sri%20lanka!5e1!3m2!1sen!2slk!4v1774259126736!5m2!1sen!2slk',
  details: [
    {
      label: 'Postal Address',
      value: 'Dartonfield, Agalawatta, Sri Lanka, 12200',
    },
    {
      label: 'Director',
      value: '034 - 2248457',
      href: 'tel:0342248457',
    },
    {
      label: 'Additional Director',
      value: '034 - 2248458',
      href: 'tel:0342248458',
    },
    {
      label: 'Deputy Director Research(Biology)',
      value: '034 - 2295610',
      href: 'tel:0342295610',
    },
  ],
};

export const laboratoryCard: LocationCardData = {
  titlePart1: 'Board Office and Rubber',
  titlePart2: 'Chemistry & Technology Laboratories',
  sideLabel: 'Laboratories',
  orientation: 'map-left',
  mapTitle: 'Rubber Chemistry and Technology Laboratories Map',
  mapSrc:
    'https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d1588.5838773394985!2d80.16827004326355!3d6.505344001140077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1srubber%20research%20institute%20of%20sri%20lanka!5e1!3m2!1sen!2slk!4v1774259126736!5m2!1sen!2slk',
  details: [
    {
      label: 'Postal Address',
      value: 'Telewela Road, Ratmalana',
    },
    {
      label: 'Chairman',
      value: '011 - 2635019 / 034 - 2121076',
      href: 'tel:0112635019',
    },
    {
      label: 'Director',
      value: '011 - 2633351',
      href: 'tel:0112633351',
    },
    {
      label: 'Deputy Director Research(Technology)',
      value: '011 - 2633352',
      href: 'tel:0112633352',
    },
  ],
};
