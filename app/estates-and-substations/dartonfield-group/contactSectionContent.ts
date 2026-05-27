import type { EstateSubstationContactSectionContent } from '@/app/components/estates/EstateSubstationContactSection';
import { headOfficeCard } from '@/app/components/contact/locationData';

export const dartonfieldGroupContactSectionContent: EstateSubstationContactSectionContent =
  {
    titlePart1: 'Contact',
    titlePart2: 'Information',
    sideLabel: 'Headoffice',
    orientation: 'details-left',
    mapTitle: 'Dartonfield Group map',
    mapSrc: headOfficeCard.mapSrc,
    details: headOfficeCard.details,
  };
