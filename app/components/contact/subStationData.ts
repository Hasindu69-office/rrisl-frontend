export type SubStationContact = {
  label: string;
  value: string;
  href?: string;
};

export type SubStationCardData = {
  name: string;
  subtitle?: string;
  contacts: SubStationContact[];
};

export const subStationCards: SubStationCardData[] = [
  {
    name: 'Nivitigalakale Sub-station',
    subtitle: 'Genetics and Plant Breeding Department & Training Centre',
    contacts: [
      {
        label: 'Postal Address',
        value: 'Matugama, Sri Lanka, 12100',
      },
      {
        label: 'Telephone',
        value: '034 - 2247368',
        href: 'tel:0342247368',
      },
      {
        label: 'Telephone / Fax',
        value: '034 - 2247199',
        href: 'tel:0342247199',
      },
      {
        label: 'e-mail',
        value: 'rrigp@sltnet.lk',
        href: 'mailto:rrigp@sltnet.lk',
      },
      {
        label: 'Deputy Director Research (Biology)',
        value: '034 - 2295610',
        href: 'tel:0342295610',
      },
    ],
  },
  {
    name: 'Kuruwita Sub-station',
    contacts: [
      {
        label: 'Postal Address',
        value: 'Kuruwita, Ratnapura',
      },
      {
        label: 'Telephone - Asst. Estate Manager',
        value: '045 - 3460537',
        href: 'tel:0453460537',
      },
      {
        label: 'Telephone / Fax. - (Genetics & Plant Breeding Department)',
        value: '045 - 2262115',
        href: 'tel:0452262115',
      },
      {
        label: 'e-mail',
        value: 'rrikuruwita@sltnet.lk',
      },
    ],
  },
  {
    name: 'Polgahawela Sub-station',
    contacts: [
      {
        label: 'Postal Address',
        value: 'Narampola Estate, Nungamuwa, Yatigaloluwa',
      },
      {
        label: 'Telephone',
        value: '037 - 2244120',
        href: 'tel:0372244120',
      },
    ],
  },
  {
    name: 'Monaragala Sub-Station',
    contacts: [
      {
        label: 'Postal Address',
        value: 'Kubukkana, Monaragala',
      },
      {
        label: 'Telephone',
        value: '055 - 3600707',
        href: 'tel:0553600707',
      },
    ],
  },
];
