import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';
import type {
  EstateSubstation,
  HomeResearchNetworkSection,
  HomepageResearchNetworkLocation,
  HomepageResearchNetworkLocationMapmark,
} from '@/app/lib/types';

export interface ResearchNetworkStationViewModel {
  id: HomepageResearchNetworkLocationMapmark;
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

export interface ResearchNetworkSectionViewModel {
  buttonText: string;
  titlePart1: string;
  titlePart2: string;
  mapImage: string;
  backgroundImage: string;
  backgroundImageAlt: string;
  locations: ResearchNetworkStationViewModel[];
}

const MARKER_ORDER: HomepageResearchNetworkLocationMapmark[] = [
  'dartonfield-group',
  'kuruwita-substation',
  'nivitigalakele-substation',
  'monaragala-substation',
  'polgahawela-substation',
];

const MARKER_POSITIONS: Record<
  HomepageResearchNetworkLocationMapmark,
  ResearchNetworkStationViewModel['positions']
> = {
  'dartonfield-group': {
    desktop: { x: 38, y: 76 },
    tablet: { x: 41, y: 76 },
    mobile: { x: 41, y: 76 },
  },
  'kuruwita-substation': {
    desktop: { x: 42, y: 71 },
    tablet: { x: 45, y: 71 },
    mobile: { x: 45, y: 71 },
  },
  'nivitigalakele-substation': {
    desktop: { x: 46, y: 78 },
    tablet: { x: 48, y: 78 },
    mobile: { x: 49, y: 78 },
  },
  'monaragala-substation': {
    desktop: { x: 70, y: 72 },
    tablet: { x: 68, y: 72 },
    mobile: { x: 68, y: 72 },
  },
  'polgahawela-substation': {
    desktop: { x: 36, y: 65 },
    tablet: { x: 40, y: 62 },
    mobile: { x: 40, y: 62 },
  },
};

const RESEARCH_NETWORK_FALLBACKS = {
  buttonText: 'Our Research',
  titlePart1: 'Explore Our',
  titlePart2: 'Research Network',
  mapImage: '/images/section7_SLmap.png',
  backgroundImage: '/images/section7_bg.png',
  backgroundImageAlt: 'Forest background',
  collageImages: {
    leftVertical: '/images/section7_img2.jpg',
    topRight: '/images/section7_img1.jpg',
    bottomRight: '/images/section7_img3.png',
    rightVertical: '/images/section7_img4.jpg',
  },
};

function buildCollageImages(imageSources: Array<string | null | undefined>) {
  return {
    leftVertical:
      imageSources[0] || RESEARCH_NETWORK_FALLBACKS.collageImages.leftVertical,
    topRight:
      imageSources[1] || RESEARCH_NETWORK_FALLBACKS.collageImages.topRight,
    bottomRight:
      imageSources[2] || RESEARCH_NETWORK_FALLBACKS.collageImages.bottomRight,
    rightVertical:
      imageSources[3] || RESEARCH_NETWORK_FALLBACKS.collageImages.rightVertical,
  };
}

export function mapHomeResearchNetworkSection(
  section: HomeResearchNetworkSection | null | undefined,
  locations: HomepageResearchNetworkLocation[],
  localizedEstates: EstateSubstation[],
  fallbackEstates: EstateSubstation[] = []
): ResearchNetworkSectionViewModel {
  const fallbackEstatesBySlug = new Map(
    fallbackEstates.map((estate) => [estate.slug, estate])
  );
  const localizedEstatesBySlug = new Map(
    localizedEstates.map((estate) => [
      estate.slug,
      {
        ...fallbackEstatesBySlug.get(estate.slug),
        ...estate,
        title: estate.title || fallbackEstatesBySlug.get(estate.slug)?.title || '',
        shortdescription:
          estate.shortdescription ||
          fallbackEstatesBySlug.get(estate.slug)?.shortdescription ||
          '',
        activitiessection:
          estate.activitiessection ||
          fallbackEstatesBySlug.get(estate.slug)?.activitiessection,
        facilitiessection:
          estate.facilitiessection ||
          fallbackEstatesBySlug.get(estate.slug)?.facilitiessection,
      },
    ])
  );

  const sortedLocations = MARKER_ORDER.map((mapmark) =>
    locations.find((location) => location.mapmark === mapmark)
  )
    .filter((location): location is HomepageResearchNetworkLocation => Boolean(location))
    .map((location) => {
      const estate =
        localizedEstatesBySlug.get(location.mapmark) ||
        fallbackEstatesBySlug.get(location.mapmark);
      const activityCards = estate?.activitiessection?.card || [];
      const facilityCards = estate?.facilitiessection?.cards || [];

      return {
        id: location.mapmark,
        label: estate?.title || location.mapmark,
        title: estate?.title || location.mapmark,
        description: estate?.shortdescription?.trim() || '',
        images: buildCollageImages(
          activityCards.map((card) =>
            getOptimizedImageUrl(card.image, 'medium') ||
            getStrapiImageUrl(card.image)
          )
        ),
        actions: facilityCards
          .map((card) => card.title?.trim())
          .filter((title): title is string => Boolean(title)),
        positions: MARKER_POSITIONS[location.mapmark],
      };
    });

  const backgroundImage =
    getOptimizedImageUrl(section?.backgroundimage, 'large') ||
    getOptimizedImageUrl(section?.backgroundimage, 'medium') ||
    getStrapiImageUrl(section?.backgroundimage) ||
    RESEARCH_NETWORK_FALLBACKS.backgroundImage;

  return {
    buttonText:
      section?.sectionheader?.eyebrow?.trim() ||
      RESEARCH_NETWORK_FALLBACKS.buttonText,
    titlePart1:
      section?.sectionheader?.title?.trim() ||
      RESEARCH_NETWORK_FALLBACKS.titlePart1,
    titlePart2:
      section?.sectionheader?.hightlightedtext?.trim() ||
      RESEARCH_NETWORK_FALLBACKS.titlePart2,
    mapImage: RESEARCH_NETWORK_FALLBACKS.mapImage,
    backgroundImage,
    backgroundImageAlt:
      section?.backgroundimage?.alternativeText ||
      RESEARCH_NETWORK_FALLBACKS.backgroundImageAlt,
    locations: sortedLocations,
  };
}
