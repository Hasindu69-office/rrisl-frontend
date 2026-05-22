import type { BreadcrumbItem } from '@/app/components/shared/Breadcrumb';
import { addLocaleToUrl } from '@/app/lib/locale';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';
import type { SectionHeader, ServicesPage, TestingService, TestingServiceCategory } from '@/app/lib/types';

export interface ServicesHeroViewModel {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  backgroundImage?: string;
  backgroundImageAlt: string;
}

export interface ServicesTitleViewModel {
  part1: string;
  part2: string;
  align: 'left' | 'center' | 'right';
}

export interface ServicesHighlightViewModel {
  id: string;
  title: string;
  description: string;
  iconSrc?: string;
  iconAlt: string;
}

export interface ServicesTestingItemViewModel {
  id: string;
  name: string;
  displayNumber: number;
}

export interface ServicesTestingCategoryViewModel {
  id: string;
  title: string;
  items: ServicesTestingItemViewModel[];
}

export interface ServicesSectionViewModel {
  eyebrow: string;
  title: ServicesTitleViewModel;
  description: string;
  highlights: ServicesHighlightViewModel[];
}

export interface ServicesTestingViewModel {
  eyebrow: string;
  title: ServicesTitleViewModel;
  description: string;
  numberLabel: string;
  nameOfTestLabel: string;
  categories: ServicesTestingCategoryViewModel[];
}

export interface ServicesCtaViewModel {
  title: string;
  description: string;
  buttonLabel: string;
  url: string;
}

export interface ServicesSampleSubmissionPopupViewModel {
  imageSrc: string;
  imageAlt: string;
}

export interface ServicesPageViewModel {
  hero: ServicesHeroViewModel;
  section: ServicesSectionViewModel;
  testing: ServicesTestingViewModel;
  cta: ServicesCtaViewModel;
  sampleSubmissionPopup: ServicesSampleSubmissionPopupViewModel | null;
}

const SERVICES_PAGE_FALLBACK: ServicesPageViewModel = {
  hero: {
    title: 'Services',
    breadcrumbItems: [
      { label: 'Home', href: '/' },
      { label: 'Services' },
    ],
    backgroundImage: '/images/aboutus_heroimg.jpg',
    backgroundImageAlt: 'Services background',
  },
  section: {
    eyebrow: 'Our Services',
    title: {
      part1: 'Research, Extension',
      part2: '& Analytical Services',
      align: 'left',
    },
    description:
      'All research and extension departments of RRISL provide advice on every aspect of rubber agronomy and technology to stakeholders. The Institute also supports academic programs of universities and other higher education institutions by supervising students, and contributes to human resource development programs of other organizations by training teachers and stakeholders. When analytical services are provided, a nominal fee is charged to cover basic costs.',
    highlights: [],
  },
  testing: {
    eyebrow: 'Testing Services',
    title: {
      part1: 'Laboratory Tests',
      part2: 'Available at RRISL',
      align: 'left',
    },
    description: 'The following laboratory tests are carried out by the Rubber Research Institute of Sri Lanka.',
    numberLabel: 'No.',
    nameOfTestLabel: 'Name of the Test',
    categories: [],
  },
  cta: {
    title: 'Need more information about a testing service?',
    description: 'Contact RRISL for service availability, sample submission guidance, and fee details.',
    buttonLabel: 'Contact Us',
    url: '/contact',
  },
  sampleSubmissionPopup: null,
};

function toSlug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function buildViewModelId(
  preferredId: string | null | undefined,
  numericId: number | null | undefined,
  fallbackValue: string,
  index: number
): string {
  if (preferredId?.trim()) {
    return preferredId.trim();
  }

  if (typeof numericId === 'number') {
    return `${numericId}-${toSlug(fallbackValue)}`;
  }

  return `${index}-${toSlug(fallbackValue)}`;
}

function mapBreadcrumbItems(page: ServicesPage | null | undefined): BreadcrumbItem[] {
  const breadcrumbItems =
    page?.pagehero?.Breadcrumb
      ?.filter((item) => item?.label)
      .map((item) => ({
        label: item.label,
        ...(item.href ? { href: item.href } : {}),
      })) || [];

  return breadcrumbItems.length > 0
    ? breadcrumbItems
    : SERVICES_PAGE_FALLBACK.hero.breadcrumbItems;
}

function mapSectionTitle(header: SectionHeader | null | undefined, fallback: ServicesTitleViewModel): ServicesTitleViewModel {
  return {
    part1: header?.title?.trim() || fallback.part1,
    part2: header?.hightlightedtext?.trim() || fallback.part2,
    align:
      header?.alignment === 'center' || header?.alignment === 'right'
        ? header.alignment
        : fallback.align,
  };
}

function mapHighlights(
  localizedPage: ServicesPage | null | undefined,
  fallbackPage: ServicesPage | null | undefined
): ServicesHighlightViewModel[] {
  const highlights =
    localizedPage?.servicehighlights?.length
      ? localizedPage.servicehighlights
      : fallbackPage?.servicehighlights || [];

  return highlights
    .filter((highlight) => highlight?.title?.trim() && highlight?.description?.trim())
    .map((highlight, index) => ({
      id: buildViewModelId(undefined, highlight.id, highlight.title, index),
      title: highlight.title.trim(),
      description: highlight.description.trim(),
      iconSrc:
        getOptimizedImageUrl(highlight.icon, 'small') || getStrapiImageUrl(highlight.icon) || undefined,
      iconAlt: highlight.icon?.alternativeText || `${highlight.title.trim()} icon`,
    }));
}

function sortTestingServices(services: TestingService[] | null | undefined): TestingService[] {
  return [...(services || [])].sort((left, right) => {
    const leftOrder = typeof left?.sortorder === 'number' ? left.sortorder : Number.MAX_SAFE_INTEGER;
    const rightOrder = typeof right?.sortorder === 'number' ? right.sortorder : Number.MAX_SAFE_INTEGER;
    return leftOrder - rightOrder;
  });
}

function mapTestingCategories(
  localizedCategories: TestingServiceCategory[],
  fallbackCategories: TestingServiceCategory[]
): ServicesTestingCategoryViewModel[] {
  const categories = localizedCategories.length > 0 ? localizedCategories : fallbackCategories;

  return [...categories]
    .sort((left, right) => {
      const leftOrder = typeof left?.sortorder === 'number' ? left.sortorder : Number.MAX_SAFE_INTEGER;
      const rightOrder = typeof right?.sortorder === 'number' ? right.sortorder : Number.MAX_SAFE_INTEGER;
      return leftOrder - rightOrder;
    })
    .filter((category) => category?.categoryname?.trim())
    .map((category, categoryIndex) => {
      const sortedServices = sortTestingServices(category.testing_services).filter(
        (service) => service?.servicename?.trim()
      );

      return {
        id: buildViewModelId(
          category.documentId,
          category.id,
          category.categoryname,
          categoryIndex
        ),
        title: category.categoryname.trim(),
        items: sortedServices.map((service, serviceIndex) => ({
          id: buildViewModelId(
            service.documentId,
            service.id,
            service.servicename,
            serviceIndex
          ),
          name: service.servicename.trim(),
          displayNumber: serviceIndex + 1,
        })),
      };
    })
    .filter((category) => category.items.length > 0);
}

function mapPopup(
  localizedPage: ServicesPage | null | undefined,
  fallbackPage: ServicesPage | null | undefined
): ServicesSampleSubmissionPopupViewModel | null {
  const image =
    localizedPage?.samplesubmissionpopupImage || fallbackPage?.samplesubmissionpopupImage || null;

  const imageSrc =
    getOptimizedImageUrl(image, 'large') ||
    getOptimizedImageUrl(image, 'medium') ||
    getStrapiImageUrl(image);

  if (!imageSrc) {
    return null;
  }

  return {
    imageSrc,
    imageAlt: image?.alternativeText || 'Rubber sample submission guide',
  };
}

export function mapServicesPageData(
  localizedPage: ServicesPage | null | undefined,
  fallbackPage: ServicesPage | null | undefined,
  localizedCategories: TestingServiceCategory[],
  fallbackCategories: TestingServiceCategory[],
  locale: string
): ServicesPageViewModel {
  const hero = localizedPage?.pagehero || fallbackPage?.pagehero;
  const heroImage = hero?.backgroundImage || fallbackPage?.pagehero?.backgroundImage || null;
  const sectionHeader = localizedPage?.sectionheader || fallbackPage?.sectionheader;
  const testingHeader = localizedPage?.testingservicesheader || fallbackPage?.testingservicesheader;
  const ctaUrl = localizedPage?.ctaurl?.trim() || fallbackPage?.ctaurl?.trim() || SERVICES_PAGE_FALLBACK.cta.url;

  return {
    hero: {
      title: hero?.PageTitle || SERVICES_PAGE_FALLBACK.hero.title,
      breadcrumbItems: mapBreadcrumbItems(localizedPage || fallbackPage),
      backgroundImage:
        getOptimizedImageUrl(heroImage, 'large') ||
        getOptimizedImageUrl(heroImage, 'medium') ||
        getStrapiImageUrl(heroImage) ||
        SERVICES_PAGE_FALLBACK.hero.backgroundImage,
      backgroundImageAlt:
        hero?.backgroundImageAlt ||
        heroImage?.alternativeText ||
        SERVICES_PAGE_FALLBACK.hero.backgroundImageAlt,
    },
    section: {
      eyebrow: sectionHeader?.eyebrow?.trim() || SERVICES_PAGE_FALLBACK.section.eyebrow,
      title: mapSectionTitle(sectionHeader, SERVICES_PAGE_FALLBACK.section.title),
      description:
        localizedPage?.description?.trim() ||
        fallbackPage?.description?.trim() ||
        SERVICES_PAGE_FALLBACK.section.description,
      highlights: mapHighlights(localizedPage, fallbackPage),
    },
    testing: {
      eyebrow: testingHeader?.eyebrow?.trim() || SERVICES_PAGE_FALLBACK.testing.eyebrow,
      title: mapSectionTitle(testingHeader, SERVICES_PAGE_FALLBACK.testing.title),
      description:
        localizedPage?.testingdescription?.trim() ||
        fallbackPage?.testingdescription?.trim() ||
        SERVICES_PAGE_FALLBACK.testing.description,
      numberLabel:
        localizedPage?.numberlabel?.trim() ||
        fallbackPage?.numberlabel?.trim() ||
        SERVICES_PAGE_FALLBACK.testing.numberLabel,
      nameOfTestLabel:
        localizedPage?.nameofthetestlabel?.trim() ||
        fallbackPage?.nameofthetestlabel?.trim() ||
        SERVICES_PAGE_FALLBACK.testing.nameOfTestLabel,
      categories: mapTestingCategories(localizedCategories, fallbackCategories),
    },
    cta: {
      title:
        localizedPage?.ctatitle?.trim() ||
        fallbackPage?.ctatitle?.trim() ||
        SERVICES_PAGE_FALLBACK.cta.title,
      description:
        localizedPage?.ctadescription?.trim() ||
        fallbackPage?.ctadescription?.trim() ||
        SERVICES_PAGE_FALLBACK.cta.description,
      buttonLabel:
        localizedPage?.ctabuttonlabel?.trim() ||
        fallbackPage?.ctabuttonlabel?.trim() ||
        SERVICES_PAGE_FALLBACK.cta.buttonLabel,
      url: addLocaleToUrl(ctaUrl, locale),
    },
    sampleSubmissionPopup: mapPopup(localizedPage, fallbackPage),
  };
}
