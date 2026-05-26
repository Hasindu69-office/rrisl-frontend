import type { EstateSubstationContactSectionContent } from '@/app/components/estates/EstateSubstationContactSection';
import type { LocationDetail } from '@/app/components/contact/locationData';
import { subStationCards } from '@/app/components/contact/subStationData';

const monaragalaContactCard = subStationCards.find(
  (card) => card.name === 'Monaragala Sub-Station',
);

if (!monaragalaContactCard) {
  throw new Error('Monaragala Sub-Station contact data was not found.');
}

const details: LocationDetail[] = monaragalaContactCard.contacts.map((contact) => ({
  label: contact.label,
  value: contact.value,
  href: contact.href,
}));

export const monaragalaContactSectionContent: EstateSubstationContactSectionContent =
  {
    titlePart1: 'Contact',
    titlePart2: 'Information',
    sideLabel: 'Sub-station',
    orientation: 'details-left',
    mapTitle: 'Monaragala Sub-Station map',
    mapSrc:
      'https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d1588.5838773394985!2d80.16827004326355!3d6.505344001140077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1srubber%20research%20institute%20of%20sri%20lanka!5e1!3m2!1sen!2slk!4v1774259126736!5m2!1sen!2slk',
    details,
  };
