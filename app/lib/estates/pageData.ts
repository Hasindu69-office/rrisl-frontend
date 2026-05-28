import type { BreadcrumbItem } from '@/app/components/shared/Breadcrumb';
import type { EstateSubstationActivitiesContent } from '@/app/components/estates/EstateSubstationActivitiesSection';
import type { EstateSubstationContactSectionContent } from '@/app/components/estates/EstateSubstationContactSection';
import type { EstateSubstationFacilitiesContent } from '@/app/components/estates/EstateSubstationFacilitiesSection';
import type { EstateSubstationIntroContent } from '@/app/components/estates/EstateSubstationIntroSection';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';
import type {
  ContactLocationCard,
  ContactPage,
  EstateAndSubstationsPage,
  EstateSubstation,
  SectionHeader,
} from '@/app/lib/types';

export interface EstateSlideViewModel {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  href: string;
}

export interface EstateLandingPageViewModel {
  hero: {
    title: string;
    breadcrumbItems: BreadcrumbItem[];
    backgroundImage?: string;
    backgroundImageAlt: string;
  };
  section: {
    eyebrow: string;
    titlePart1: string;
    titlePart2: string;
  };
  readMoreButtonLabel: string;
  slides: EstateSlideViewModel[];
}

export interface EstateDetailPageViewModel {
  hero: {
    title: string;
    breadcrumbItems: BreadcrumbItem[];
    backgroundImage?: string;
    backgroundImageAlt: string;
  };
  intro: EstateSubstationIntroContent;
  facilities: EstateSubstationFacilitiesContent;
  activities: EstateSubstationActivitiesContent;
  contact: EstateSubstationContactSectionContent;
}

const ESTATE_LANDING_FALLBACK: EstateLandingPageViewModel = {
  hero: {
    title: 'Estates and substations',
    breadcrumbItems: [
      { label: 'Home', href: '/' },
      { label: 'Estates and substations' },
    ],
    backgroundImage: '/images/aboutus_heroimg.jpg',
    backgroundImageAlt: 'Estates and substations background',
  },
  section: {
    eyebrow: 'Locations',
    titlePart1: 'Estates & Research ',
    titlePart2: 'Stations',
  },
  readMoreButtonLabel: 'Read More',
  slides: [],
};

const ESTATE_DETAIL_FALLBACK: EstateDetailPageViewModel = {
  hero: {
    title: 'Dartonfield Group',
    breadcrumbItems: [
      { label: 'Home', href: '/' },
      { label: 'Estates and substations', href: '/estates-and-substations' },
      { label: 'Dartonfield Group' },
    ],
    backgroundImage: '/images/estateandsubstationsbgimage.webp',
    backgroundImageAlt: 'Dartonfield Group background',
  },
  intro: {
    eyebrow: 'Main Objective',
    titlePart1: 'About the Dartonfield ',
    titlePart2: 'Group',
    paragraphs: [],
    imageSrc: '/images/estateandsubstations/section1img.png',
    imageAlt: 'Dartonfield Group overview collage',
  },
  facilities: {
    eyebrow: 'Main Objective',
    title: 'Group Facilities',
    description: '',
    imageSrc: '/images/estateandsubstations/nivitigalakelesubstation.png',
    imageAlt: 'Dartonfield Group facilities',
    cards: [],
  },
  activities: {
    eyebrow: 'Who We Are',
    title: 'Research & Operational Activities',
    backgroundImageSrc: '/images/estateandsubstations/section3bgimg.png',
    backgroundImageAlt: 'Research and operational activities background',
    cards: [],
  },
  contact: {
    titlePart1: 'Contact',
    titlePart2: 'Information',
    sideLabel: 'Head office',
    orientation: 'details-left',
    mapTitle: 'Dartonfield Group map',
    mapSrc: '',
    details: [],
  },
};

function mapBreadcrumbItems(
  hero: EstateAndSubstationsPage['pagehero'] | EstateSubstation['pagehero'] | null | undefined,
  fallback: BreadcrumbItem[]
): BreadcrumbItem[] {
  const breadcrumbItems =
    hero?.Breadcrumb
      ?.filter((item) => item?.label)
      .map((item) => ({
        label: item.label,
        ...(item.href ? { href: item.href } : {}),
      })) || [];

  return breadcrumbItems.length > 0 ? breadcrumbItems : fallback;
}

function getSectionTitleParts(
  sectionHeader: SectionHeader | null | undefined,
  fallbackPart1: string,
  fallbackPart2: string
): { part1: string; part2: string } {
  return {
    part1: sectionHeader?.title?.trim() || fallbackPart1,
    part2: sectionHeader?.hightlightedtext?.trim() || fallbackPart2,
  };
}

function combineSectionTitle(
  sectionHeader: SectionHeader | null | undefined,
  fallback: string
): string {
  const title = sectionHeader?.title?.trim() || '';
  const highlighted = sectionHeader?.hightlightedtext?.trim() || '';
  const combined = `${title}${highlighted ? ` ${highlighted}` : ''}`.trim();
  return combined || fallback;
}

function buildPhoneHref(number: string): string {
  const sanitized = number.replace(/[^0-9+]/g, '');
  return sanitized ? `tel:${sanitized}` : '#';
}

function mapContactDetails(locationCard: ContactLocationCard | null | undefined) {
  if (!locationCard) {
    return [];
  }

  const details = [
    {
      label: locationCard.addresslabel || 'Postal Address',
      value: locationCard.address,
    },
  ];

  const phoneDetails =
    [...(locationCard.phonenumber || [])]
      .sort((left, right) => {
        const leftOrder = typeof left?.sortorder === 'number' ? left.sortorder : Number.MAX_SAFE_INTEGER;
        const rightOrder = typeof right?.sortorder === 'number' ? right.sortorder : Number.MAX_SAFE_INTEGER;
        return leftOrder - rightOrder;
      })
      .filter((phone) => phone?.number?.trim())
      .map((phone) => ({
        label: phone.label?.trim() || 'Telephone',
        value: phone.number.trim(),
        href: buildPhoneHref(phone.number),
      }));

  return [...details, ...phoneDetails];
}

function getHeadOfficeCard(contactPage: ContactPage | null | undefined): ContactLocationCard | null {
  const cards = contactPage?.headofficeandboardofficedetails || [];
  return cards.length > 0 ? cards[0] : null;
}

export function mapEstateLandingPageData(
  page: EstateAndSubstationsPage | null | undefined,
  estates: EstateSubstation[]
): EstateLandingPageViewModel {
  const hero = page?.pagehero;
  const sectionHeader = page?.sectionheader;
  const titleParts = getSectionTitleParts(
    sectionHeader,
    ESTATE_LANDING_FALLBACK.section.titlePart1,
    ESTATE_LANDING_FALLBACK.section.titlePart2
  );

  return {
    hero: {
      title: hero?.PageTitle || ESTATE_LANDING_FALLBACK.hero.title,
      breadcrumbItems: mapBreadcrumbItems(hero, ESTATE_LANDING_FALLBACK.hero.breadcrumbItems),
      backgroundImage:
        getOptimizedImageUrl(hero?.backgroundImage, 'large') ||
        getOptimizedImageUrl(hero?.backgroundImage, 'medium') ||
        getStrapiImageUrl(hero?.backgroundImage) ||
        ESTATE_LANDING_FALLBACK.hero.backgroundImage,
      backgroundImageAlt:
        hero?.backgroundImageAlt ||
        hero?.backgroundImage?.alternativeText ||
        ESTATE_LANDING_FALLBACK.hero.backgroundImageAlt,
    },
    section: {
      eyebrow: sectionHeader?.eyebrow?.trim() || ESTATE_LANDING_FALLBACK.section.eyebrow,
      titlePart1: titleParts.part1,
      titlePart2: titleParts.part2,
    },
    readMoreButtonLabel:
      page?.readmorebuttonlabel?.trim() || ESTATE_LANDING_FALLBACK.readMoreButtonLabel,
    slides: estates.map((estate) => ({
      id: estate.slug,
      title: estate.title,
      description: estate.shortdescription,
      bullets:
        estate.point
          ?.map((point) => point.label?.trim())
          .filter((label): label is string => Boolean(label)) || [],
      href: `/estates-and-substations/${estate.slug}`,
    })),
  };
}

export function mapEstateDetailPageData(
  estate: EstateSubstation | null | undefined,
  contactPage: ContactPage | null | undefined
): EstateDetailPageViewModel {
  if (!estate) {
    return ESTATE_DETAIL_FALLBACK;
  }

  const hero = estate.pagehero;
  const introHeader = estate.introduction?.sectionheader;
  const facilitiesHeader = estate.facilitiessection?.sectionheader;
  const activitiesHeader = estate.activitiessection?.sectionheader;
  const headOfficeCard = getHeadOfficeCard(contactPage);

  return {
    hero: {
      title: hero?.PageTitle || estate.title || ESTATE_DETAIL_FALLBACK.hero.title,
      breadcrumbItems: mapBreadcrumbItems(hero, ESTATE_DETAIL_FALLBACK.hero.breadcrumbItems),
      backgroundImage:
        getOptimizedImageUrl(hero?.backgroundImage, 'large') ||
        getOptimizedImageUrl(hero?.backgroundImage, 'medium') ||
        getStrapiImageUrl(hero?.backgroundImage) ||
        ESTATE_DETAIL_FALLBACK.hero.backgroundImage,
      backgroundImageAlt:
        hero?.backgroundImageAlt ||
        hero?.backgroundImage?.alternativeText ||
        ESTATE_DETAIL_FALLBACK.hero.backgroundImageAlt,
    },
    intro: {
      eyebrow: introHeader?.eyebrow?.trim() || ESTATE_DETAIL_FALLBACK.intro.eyebrow,
      titlePart1: '',
      titlePart2:
        introHeader?.hightlightedtext?.trim() ||
        introHeader?.title?.trim() ||
        ESTATE_DETAIL_FALLBACK.intro.titlePart2,
      paragraphs:
        estate.introduction?.paragraph
          ?.map((item) => item.paragraph?.trim())
          .filter((paragraph): paragraph is string => Boolean(paragraph)) || [],
      imageSrc:
        getOptimizedImageUrl(estate.introductionimage, 'large') ||
        getOptimizedImageUrl(estate.introductionimage, 'medium') ||
        getStrapiImageUrl(estate.introductionimage) ||
        ESTATE_DETAIL_FALLBACK.intro.imageSrc,
      imageAlt: estate.imagealt || estate.introductionimage?.alternativeText || ESTATE_DETAIL_FALLBACK.intro.imageAlt,
    },
    facilities: {
      eyebrow: facilitiesHeader?.eyebrow?.trim() || ESTATE_DETAIL_FALLBACK.facilities.eyebrow,
      title: combineSectionTitle(facilitiesHeader, ESTATE_DETAIL_FALLBACK.facilities.title),
      description:
        estate.facilitiessection?.paragraph
          ?.map((item) => item.paragraph?.trim())
          .filter((paragraph): paragraph is string => Boolean(paragraph))
          .join(' ') || ESTATE_DETAIL_FALLBACK.facilities.description,
      imageSrc:
        getOptimizedImageUrl(estate.facilitysectionimage, 'large') ||
        getOptimizedImageUrl(estate.facilitysectionimage, 'medium') ||
        getStrapiImageUrl(estate.facilitysectionimage) ||
        ESTATE_DETAIL_FALLBACK.facilities.imageSrc,
      imageAlt:
        estate.facilitysectionimgalt ||
        estate.facilitysectionimage?.alternativeText ||
        ESTATE_DETAIL_FALLBACK.facilities.imageAlt,
      cards:
        estate.facilitiessection?.cards?.map((card) => ({
          title: card.title,
          description: card.description,
          iconSrc:
            getOptimizedImageUrl(card.icon, 'small') ||
            getStrapiImageUrl(card.icon) ||
            '/images/estateandsubstations/testtubeicon.png',
          iconAlt: card.icon?.alternativeText || 'Facility icon',
        })) || [],
    },
    activities: {
      eyebrow: activitiesHeader?.eyebrow?.trim() || ESTATE_DETAIL_FALLBACK.activities.eyebrow,
      title: combineSectionTitle(activitiesHeader, ESTATE_DETAIL_FALLBACK.activities.title),
      description:
        estate.activitiessection?.sectionheader?.hightlightedtext?.trim() ||
        ESTATE_DETAIL_FALLBACK.activities.description,
      backgroundImageSrc:
        getOptimizedImageUrl(estate.activitiessectionbgimage, 'large') ||
        getOptimizedImageUrl(estate.activitiessectionbgimage, 'medium') ||
        getStrapiImageUrl(estate.activitiessectionbgimage) ||
        ESTATE_DETAIL_FALLBACK.activities.backgroundImageSrc,
      backgroundImageAlt:
        estate.activitiessectionbgimagealt ||
        estate.activitiessectionbgimage?.alternativeText ||
        ESTATE_DETAIL_FALLBACK.activities.backgroundImageAlt,
      cards:
        estate.activitiessection?.card?.map((card) => ({
          title: card.title,
          description: card.description,
          imageSrc:
            getOptimizedImageUrl(card.image, 'medium') ||
            getStrapiImageUrl(card.image) ||
            '/images/aboutusRubber.jpg',
          imageAlt: card.imagealt || card.image?.alternativeText || `${card.title} activity`,
        })) || [],
    },
    contact: {
      titlePart1: estate.contacttitlepart1 || ESTATE_DETAIL_FALLBACK.contact.titlePart1,
      titlePart2: estate.contacttitlepart2 || ESTATE_DETAIL_FALLBACK.contact.titlePart2,
      sideLabel: estate.contactverticaltext || ESTATE_DETAIL_FALLBACK.contact.sideLabel,
      orientation: 'details-left',
      mapTitle: `${estate.title} map`,
      mapSrc: headOfficeCard?.gmapembedlink || ESTATE_DETAIL_FALLBACK.contact.mapSrc,
      details: mapContactDetails(headOfficeCard),
    },
  };
}
