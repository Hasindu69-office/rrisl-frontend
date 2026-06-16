import { dartonfieldGroupActivitiesContent } from '@/app/estates-and-substations/dartonfield-group/activitiesSectionContent';
import { dartonfieldGroupFacilitiesContent } from '@/app/estates-and-substations/dartonfield-group/facilitiesSectionContent';
import { kuruwitaSubstationActivitiesContent } from '@/app/estates-and-substations/kuruwita-substation/activitiesSectionContent';
import { kuruwitaSubstationFacilitiesContent } from '@/app/estates-and-substations/kuruwita-substation/facilitiesSectionContent';
import { monaragalaSubstationActivitiesContent } from '@/app/estates-and-substations/monaragala-substation/activitiesSectionContent';
import { monaragalaSubstationFacilitiesContent } from '@/app/estates-and-substations/monaragala-substation/facilitiesSectionContent';
import { nivitigalakeleSubstationActivitiesContent } from '@/app/estates-and-substations/nivitigalakele-substation/activitiesSectionContent';
import { nivitigalakeleSubstationFacilitiesContent } from '@/app/estates-and-substations/nivitigalakele-substation/facilitiesSectionContent';
import { polgahawelaSubstationActivitiesContent } from '@/app/estates-and-substations/polgahawela-substation/activitiesSectionContent';
import { polgahawelaSubstationFacilitiesContent } from '@/app/estates-and-substations/polgahawela-substation/facilitiesSectionContent';

export interface ResearchNetworkStation {
  id: string;
  label: string;
  title: string;
  description: string;
  images: {
    leftVertical: string;
    topRight: string;
    bottomRight: string;
    rightVertical: string;
  };
  actions: string[];
  positions: {
    desktop: { x: number; y: number };
    tablet: { x: number; y: number };
    mobile: { x: number; y: number };
  };
}

function pickCollageImages(imageSources: string[]) {
  return {
    leftVertical: imageSources[0] || '/images/section7_img2.jpg',
    topRight: imageSources[1] || '/images/section7_img1.jpg',
    bottomRight: imageSources[2] || '/images/section7_img3.png',
    rightVertical: imageSources[3] || '/images/section7_img4.jpg',
  };
}

function buildStation(
  id: string,
  title: string,
  description: string | undefined,
  activityImageSources: string[],
  actionTitles: string[],
  positions: ResearchNetworkStation['positions']
): ResearchNetworkStation {
  return {
    id,
    label: title,
    title,
    description: description?.trim() || '',
    images: pickCollageImages(activityImageSources),
    actions: actionTitles.filter(Boolean),
    positions,
  };
}

export const researchNetworkStations: ResearchNetworkStation[] = [
  buildStation(
    'dartonfield-group',
    'Dartonfield Group',
    dartonfieldGroupActivitiesContent.description,
    dartonfieldGroupActivitiesContent.cards.map((card) => card.imageSrc),
    dartonfieldGroupFacilitiesContent.cards.map((card) => card.title),
    {
      desktop: { x: 38, y: 76 },
      tablet: { x: 41, y: 76 },
      mobile: { x: 41, y: 76 },
    }
  ),
  buildStation(
    'kuruwita-substation',
    'Kuruwita Sub-station',
    kuruwitaSubstationActivitiesContent.description,
    kuruwitaSubstationActivitiesContent.cards.map((card) => card.imageSrc),
    kuruwitaSubstationFacilitiesContent.cards.map((card) => card.title),
    {
      desktop: { x: 42, y: 71 },
      tablet: { x: 45, y: 71 },
      mobile: { x: 45, y: 71 },
    }
  ),
  buildStation(
    'nivitigalakele-substation',
    'Nivitigalakele Sub-station',
    nivitigalakeleSubstationActivitiesContent.description,
    nivitigalakeleSubstationActivitiesContent.cards.map((card) => card.imageSrc),
    nivitigalakeleSubstationFacilitiesContent.cards.map((card) => card.title),
    {
      desktop: { x: 46, y: 78 },
      tablet: { x: 48, y: 78 },
      mobile: { x: 49, y: 78 },
    }
  ),
  buildStation(
    'monaragala-substation',
    'Monaragala Sub-station',
    monaragalaSubstationActivitiesContent.description,
    monaragalaSubstationActivitiesContent.cards.map((card) => card.imageSrc),
    monaragalaSubstationFacilitiesContent.cards.map((card) => card.title),
    {
      desktop: { x: 70, y: 72 },
      tablet: { x: 68, y: 72 },
      mobile: { x: 68, y: 72 },
    }
  ),
  buildStation(
    'polgahawela-substation',
    'Polgahawela Sub-station',
    polgahawelaSubstationFacilitiesContent.description,
    polgahawelaSubstationActivitiesContent.cards.map((card) => card.imageSrc),
    polgahawelaSubstationFacilitiesContent.cards.map((card) => card.title),
    {
      desktop: { x: 36, y: 65 },
      tablet: { x: 40, y: 62 },
      mobile: { x: 40, y: 62 },
    }
  ),
];
