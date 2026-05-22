import type { BreadcrumbItem } from '@/app/components/shared/Breadcrumb';
import { getStrapiMediaUrl, getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';
import type { Department, ValidationLabels, Vacancy, VacancyDetailsPage, VacancyPage } from '@/app/lib/types';

export interface VacancyHeroViewModel {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  backgroundImage?: string;
  backgroundImageAlt: string;
}

export interface VacancyEmptyStateViewModel {
  title: string;
  description: string;
}

export interface VacancyLabelsViewModel {
  searchButtonLabel: string;
  searchCategoryLabel: string;
  jobDetailsLabel: string;
  applyJobLabel: string;
  overviewTitle: string;
  descriptionTitle: string;
  responsibilitiesTitle: string;
  skillsTitle: string;
  downloadNoticeTitle: string;
  downloadButtonLabel: string;
  applyFormTitle: string;
  fullNameLabel: string;
  emailLabel: string;
  contactNumberLabel: string;
  cvLabel: string;
  submitLabel: string;
  overviewItemLabels: {
    category: string;
    degree: string;
    experience: string;
    jobTitle: string;
    jobType: string;
    location: string;
    offeredSalary: string;
  };
}

export interface VacancyValidationLabelGroupViewModel {
  requiredLabel: string;
  minimumCharacterLabel: string;
  maximumCharactersLabel: string;
}

export interface VacancyDetailLabelsViewModel {
  validationLabels: {
    fullName: VacancyValidationLabelGroupViewModel;
    email: VacancyValidationLabelGroupViewModel;
    contactNumber: VacancyValidationLabelGroupViewModel;
    cvRequired: string;
    cvType: string;
    cvEmptyFile: string;
    submitSuccessMessage: string;
    applicationErrorMessage: string;
  };
}

export interface VacancyListItemViewModel {
  id: string;
  slug: string;
  title: string;
  category: string;
  employmentType: string;
  salaryRange: string;
  location: string;
}

export interface VacancyDetailViewModel {
  slug: string;
  title: string;
  category: string;
  employmentType: string;
  salaryRange: string;
  location: string;
  overviewLocation: string;
  experience: string;
  degree: string;
  description: string[];
  responsibilities: string[];
  skills: string[];
  noticeDocumentUrl: string;
  openingDate: string;
  closingDate: string;
  state: string;
}

export interface VacancyPageViewModel {
  hero: VacancyHeroViewModel;
  labels: VacancyLabelsViewModel;
  emptyState: VacancyEmptyStateViewModel;
}

const VACANCY_PAGE_FALLBACK: VacancyPageViewModel = {
  hero: {
    title: 'Vacancy Section',
    breadcrumbItems: [
      { label: 'Home', href: '/' },
      { label: 'Vacancy Section' },
    ],
    backgroundImage: '/images/aboutus_heroimg.jpg',
    backgroundImageAlt: 'Vacancy section background',
  },
  labels: {
    searchButtonLabel: 'Search Job',
    searchCategoryLabel: 'Select Category',
    jobDetailsLabel: 'Job Details',
    applyJobLabel: 'Apply Job',
    overviewTitle: 'Job Overview',
    descriptionTitle: 'Job Description',
    responsibilitiesTitle: 'Responsibilities',
    skillsTitle: 'Skills',
    downloadNoticeTitle: 'Download Vacancy Notice',
    downloadButtonLabel: 'Download PDF',
    applyFormTitle: 'Apply For This Role',
    fullNameLabel: 'Full Name',
    emailLabel: 'Email',
    contactNumberLabel: 'Contact Number',
    cvLabel: 'Upload Your CV',
    submitLabel: 'Send Application',
    overviewItemLabels: {
      category: 'Category',
      degree: 'Education',
      experience: 'Experience',
      jobTitle: 'Job Title',
      jobType: 'Job Type',
      location: 'Location',
      offeredSalary: 'Offered Salary',
    },
  },
  emptyState: {
    title: 'No vacancies found for this category.',
    description: 'Try another category to view more job postings.',
  },
};

const VACANCY_DETAIL_LABELS_FALLBACK: VacancyDetailLabelsViewModel = {
  validationLabels: {
    fullName: {
      requiredLabel: 'required',
      minimumCharacterLabel: 'must be at least 3 characters.',
      maximumCharactersLabel: 'cannot exceed 255 characters.',
    },
    email: {
      requiredLabel: 'required',
      minimumCharacterLabel: 'must be at least 3 characters.',
      maximumCharactersLabel: 'cannot exceed 255 characters.',
    },
    contactNumber: {
      requiredLabel: 'required',
      minimumCharacterLabel: 'must be at least 3 characters.',
      maximumCharactersLabel: 'cannot exceed 255 characters.',
    },
    cvRequired: 'CV file is required.',
    cvType: 'CV must be a PDF, DOC, or DOCX file.',
    cvEmptyFile: 'CV file is empty.',
    submitSuccessMessage: 'Vacancy application submitted successfully.',
    applicationErrorMessage: 'Unable to submit vacancy application.',
  },
};

function mapBreadcrumbItems(page: VacancyPage | null | undefined): BreadcrumbItem[] {
  const breadcrumbItems =
    page?.pagehero?.Breadcrumb
      ?.filter((item) => item?.label)
      .map((item) => ({
        label: item.label,
        ...(item.href ? { href: item.href } : {}),
      })) || [];

  return breadcrumbItems.length > 0
    ? breadcrumbItems
    : VACANCY_PAGE_FALLBACK.hero.breadcrumbItems;
}

function splitTextIntoParagraphs(text: string | null | undefined): string[] {
  const normalizedText = text?.trim() || '';

  if (!normalizedText) {
    return [];
  }

  return normalizedText
    .split(/\s*\|\s*|\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function mapListBlocks(items: Array<{ text?: string | null }> | null | undefined): string[] {
  return (items || [])
    .map((item) => item.text?.trim() || '')
    .filter(Boolean);
}

function getDepartmentLabel(department: Department | null | undefined): string {
  return department?.departmentname?.trim() || 'General';
}

function mapValidationLabelGroup(
  localizedLabels: ValidationLabels | null | undefined,
  fallbackLabels: ValidationLabels | null | undefined,
  fallbackValues: VacancyValidationLabelGroupViewModel
): VacancyValidationLabelGroupViewModel {
  return {
    requiredLabel:
      localizedLabels?.requiredlabel ||
      fallbackLabels?.requiredlabel ||
      fallbackValues.requiredLabel,
    minimumCharacterLabel:
      localizedLabels?.minimumcharacterlabel ||
      fallbackLabels?.minimumcharacterlabel ||
      fallbackValues.minimumCharacterLabel,
    maximumCharactersLabel:
      localizedLabels?.maximumcharacterslabel ||
      fallbackLabels?.maximumcharacterslabel ||
      fallbackValues.maximumCharactersLabel,
  };
}

export function mapVacancyPageData(
  localizedPage: VacancyPage | null | undefined,
  fallbackPage: VacancyPage | null | undefined
): VacancyPageViewModel {
  const hero = localizedPage?.pagehero || fallbackPage?.pagehero;
  const image = hero?.backgroundImage || fallbackPage?.pagehero?.backgroundImage || null;

  return {
    hero: {
      title: hero?.PageTitle || VACANCY_PAGE_FALLBACK.hero.title,
      breadcrumbItems: mapBreadcrumbItems(localizedPage || fallbackPage),
      backgroundImage:
        getOptimizedImageUrl(image, 'large') ||
        getOptimizedImageUrl(image, 'medium') ||
        getStrapiImageUrl(image) ||
        VACANCY_PAGE_FALLBACK.hero.backgroundImage,
      backgroundImageAlt:
        hero?.backgroundImageAlt ||
        image?.alternativeText ||
        VACANCY_PAGE_FALLBACK.hero.backgroundImageAlt,
    },
    labels: {
      searchButtonLabel:
        localizedPage?.searchbuttonlabel ||
        fallbackPage?.searchbuttonlabel ||
        VACANCY_PAGE_FALLBACK.labels.searchButtonLabel,
      searchCategoryLabel:
        localizedPage?.searchcategorylabel ||
        fallbackPage?.searchcategorylabel ||
        VACANCY_PAGE_FALLBACK.labels.searchCategoryLabel,
      jobDetailsLabel:
        localizedPage?.jobdetailslabel ||
        fallbackPage?.jobdetailslabel ||
        VACANCY_PAGE_FALLBACK.labels.jobDetailsLabel,
      applyJobLabel:
        localizedPage?.applyjoblabel ||
        fallbackPage?.applyjoblabel ||
        VACANCY_PAGE_FALLBACK.labels.applyJobLabel,
      overviewTitle:
        localizedPage?.overviewtitle ||
        fallbackPage?.overviewtitle ||
        VACANCY_PAGE_FALLBACK.labels.overviewTitle,
      descriptionTitle:
        localizedPage?.descriptiontitle ||
        fallbackPage?.descriptiontitle ||
        VACANCY_PAGE_FALLBACK.labels.descriptionTitle,
      responsibilitiesTitle:
        localizedPage?.responsibilitiestitle ||
        fallbackPage?.responsibilitiestitle ||
        VACANCY_PAGE_FALLBACK.labels.responsibilitiesTitle,
      skillsTitle:
        localizedPage?.skillstitle ||
        fallbackPage?.skillstitle ||
        VACANCY_PAGE_FALLBACK.labels.skillsTitle,
      downloadNoticeTitle:
        localizedPage?.downloadnoticetitle ||
        fallbackPage?.downloadnoticetitle ||
        VACANCY_PAGE_FALLBACK.labels.downloadNoticeTitle,
      downloadButtonLabel:
        localizedPage?.downloadbuttonlabel ||
        fallbackPage?.downloadbuttonlabel ||
        VACANCY_PAGE_FALLBACK.labels.downloadButtonLabel,
      applyFormTitle:
        localizedPage?.applyformtitle ||
        fallbackPage?.applyformtitle ||
        VACANCY_PAGE_FALLBACK.labels.applyFormTitle,
      fullNameLabel:
        localizedPage?.fullnamelabel ||
        fallbackPage?.fullnamelabel ||
        VACANCY_PAGE_FALLBACK.labels.fullNameLabel,
      emailLabel:
        localizedPage?.emaillabel ||
        fallbackPage?.emaillabel ||
        VACANCY_PAGE_FALLBACK.labels.emailLabel,
      contactNumberLabel:
        localizedPage?.contactnumberlabel ||
        fallbackPage?.contactnumberlabel ||
        VACANCY_PAGE_FALLBACK.labels.contactNumberLabel,
      cvLabel:
        localizedPage?.cvlabel ||
        fallbackPage?.cvlabel ||
        VACANCY_PAGE_FALLBACK.labels.cvLabel,
      submitLabel:
        localizedPage?.submitlabel ||
        fallbackPage?.submitlabel ||
        VACANCY_PAGE_FALLBACK.labels.submitLabel,
      overviewItemLabels: {
        category:
          localizedPage?.categorylabel ||
          fallbackPage?.categorylabel ||
          VACANCY_PAGE_FALLBACK.labels.overviewItemLabels.category,
        degree:
          localizedPage?.degreelabel ||
          fallbackPage?.degreelabel ||
          VACANCY_PAGE_FALLBACK.labels.overviewItemLabels.degree,
        experience:
          localizedPage?.experiencelabel ||
          fallbackPage?.experiencelabel ||
          VACANCY_PAGE_FALLBACK.labels.overviewItemLabels.experience,
        jobTitle:
          localizedPage?.jobtitlelabel ||
          fallbackPage?.jobtitlelabel ||
          VACANCY_PAGE_FALLBACK.labels.overviewItemLabels.jobTitle,
        jobType:
          localizedPage?.jobtypelabel ||
          fallbackPage?.jobtypelabel ||
          VACANCY_PAGE_FALLBACK.labels.overviewItemLabels.jobType,
        location:
          localizedPage?.locationlabel ||
          fallbackPage?.locationlabel ||
          VACANCY_PAGE_FALLBACK.labels.overviewItemLabels.location,
        offeredSalary:
          localizedPage?.offeredsalarylabel ||
          fallbackPage?.offeredsalarylabel ||
          VACANCY_PAGE_FALLBACK.labels.overviewItemLabels.offeredSalary,
      },
    },
    emptyState: {
      title:
        localizedPage?.emptystate?.Title ||
        fallbackPage?.emptystate?.Title ||
        localizedPage?.emptystate?.title ||
        fallbackPage?.emptystate?.title ||
        VACANCY_PAGE_FALLBACK.emptyState.title,
      description:
        localizedPage?.emptystate?.Description ||
        fallbackPage?.emptystate?.Description ||
        localizedPage?.emptystate?.description ||
        fallbackPage?.emptystate?.description ||
        VACANCY_PAGE_FALLBACK.emptyState.description,
    },
  };
}

export function mapVacancyDetailLabelsData(
  localizedPage: VacancyDetailsPage | null | undefined,
  fallbackPage: VacancyDetailsPage | null | undefined
): VacancyDetailLabelsViewModel {
  return {
    validationLabels: {
      fullName: mapValidationLabelGroup(
        localizedPage?.fullnamelabels,
        fallbackPage?.fullnamelabels,
        VACANCY_DETAIL_LABELS_FALLBACK.validationLabels.fullName
      ),
      email: mapValidationLabelGroup(
        localizedPage?.emaillabels,
        fallbackPage?.emaillabels,
        VACANCY_DETAIL_LABELS_FALLBACK.validationLabels.email
      ),
      contactNumber: mapValidationLabelGroup(
        localizedPage?.contactnumberlabels,
        fallbackPage?.contactnumberlabels,
        VACANCY_DETAIL_LABELS_FALLBACK.validationLabels.contactNumber
      ),
      cvRequired:
        localizedPage?.cvrequiredvalidationlabel ||
        fallbackPage?.cvrequiredvalidationlabel ||
        VACANCY_DETAIL_LABELS_FALLBACK.validationLabels.cvRequired,
      cvType:
        localizedPage?.cvtypevalidationlabel ||
        fallbackPage?.cvtypevalidationlabel ||
        VACANCY_DETAIL_LABELS_FALLBACK.validationLabels.cvType,
      cvEmptyFile:
        localizedPage?.cvemptyfilelabels ||
        fallbackPage?.cvemptyfilelabels ||
        VACANCY_DETAIL_LABELS_FALLBACK.validationLabels.cvEmptyFile,
      submitSuccessMessage:
        localizedPage?.submitsuccessmessage ||
        fallbackPage?.submitsuccessmessage ||
        VACANCY_DETAIL_LABELS_FALLBACK.validationLabels.submitSuccessMessage,
      applicationErrorMessage:
        localizedPage?.applicationerrormessage ||
        fallbackPage?.applicationerrormessage ||
        VACANCY_DETAIL_LABELS_FALLBACK.validationLabels.applicationErrorMessage,
    },
  };
}

export function mapVacancyCategories(departments: Department[]): string[] {
  const uniqueCategories = new Set<string>();

  departments
    .slice()
    .sort((left, right) => {
      const sortOrderDiff = (left.sortorder ?? Number.MAX_SAFE_INTEGER) - (right.sortorder ?? Number.MAX_SAFE_INTEGER);
      if (sortOrderDiff !== 0) {
        return sortOrderDiff;
      }

      return left.departmentname.localeCompare(right.departmentname);
    })
    .forEach((department) => {
      const label = department.departmentname?.trim();
      if (label) {
        uniqueCategories.add(label);
      }
    });

  return Array.from(uniqueCategories);
}

export function mapVacancyToListItem(vacancy: Vacancy): VacancyListItemViewModel {
  return {
    id: String(vacancy.id || vacancy.documentId || vacancy.slug || vacancy.title),
    slug: vacancy.slug,
    title: vacancy.title?.trim() || 'Untitled Vacancy',
    category: getDepartmentLabel(vacancy.department),
    employmentType: vacancy.employmenttype?.trim() || 'N/A',
    salaryRange: vacancy.salaryrange?.trim() || 'Negotiable',
    location: vacancy.location?.trim() || 'Sri Lanka',
  };
}

export function mapVacancyToDetailViewModel(vacancy: Vacancy): VacancyDetailViewModel {
  return {
    slug: vacancy.slug,
    title: vacancy.title?.trim() || 'Untitled Vacancy',
    category: getDepartmentLabel(vacancy.department),
    employmentType: vacancy.employmenttype?.trim() || 'N/A',
    salaryRange: vacancy.salaryrange?.trim() || 'Negotiable',
    location: vacancy.location?.trim() || 'Sri Lanka',
    overviewLocation: vacancy.overviewlocation?.trim() || vacancy.location?.trim() || 'Sri Lanka',
    experience: vacancy.experience?.trim() || 'N/A',
    degree: vacancy.degree?.trim() || 'N/A',
    description: splitTextIntoParagraphs(vacancy.description),
    responsibilities: mapListBlocks(vacancy.responsibilityblocks),
    skills: mapListBlocks(vacancy.skillsblocks),
    noticeDocumentUrl: getStrapiMediaUrl(vacancy.noticedocument) || '',
    openingDate: vacancy.openingdate,
    closingDate: vacancy.closingdate,
    state: vacancy.state,
  };
}
