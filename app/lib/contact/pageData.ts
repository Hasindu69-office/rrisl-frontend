import type { BreadcrumbItem } from '@/app/components/shared/Breadcrumb';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';
import type {
  ContactFormLabels,
  ContactPage,
  ContactPageHero,
  ContactPhoneNumber,
  ContactSocialLink,
  ContactSubject,
} from '@/app/lib/types';

export interface ContactHeroViewModel {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  backgroundImage?: string;
  backgroundImageAlt: string;
}

export interface ContactInfoPanelPhoneGroup {
  links: Array<{
    displayNumber: string;
    href: string;
  }>;
}

export interface ContactInfoPanelSocialLink {
  href: string;
  platform: 'facebook' | 'instagram' | 'linkedin' | 'x';
  label: string;
}

export interface ContactInfoPanelProps {
  title: string;
  subtitle: string;
  phoneLabel: string;
  phoneGroups: ContactInfoPanelPhoneGroup[];
  addressLabel: string;
  address: string;
  emailLabel: string;
  email: string;
  socials: ContactInfoPanelSocialLink[];
}

export interface ContactFormSubjectOption {
  id: string;
  label: string;
  value: string;
}

export interface ContactFormPanelLabels {
  firstNameLabel: string;
  firstNameRequiredMessage: string;
  lastNameLabel: string;
  lastNameRequiredMessage: string;
  emailLabel: string;
  emailRequiredMessage: string;
  phoneNumberLabel: string;
  phoneNumberRequiredMessage: string;
  selectSubjectLabel: string;
  messageLabel: string;
  messagePlaceholder: string;
  messageRequiredMessage: string;
  buttonLabel: string;
}

export interface ContactFormPanelProps {
  labels: ContactFormPanelLabels;
  subjectOptions: ContactFormSubjectOption[];
}

export interface ContactPageViewModel {
  hero: ContactHeroViewModel;
  infoPanel: ContactInfoPanelProps;
  formPanel: ContactFormPanelProps;
}

const CONTACT_PAGE_FALLBACK: ContactPageViewModel = {
  hero: {
    title: 'Contact us',
    breadcrumbItems: [
      { label: 'Home', href: '/' },
      { label: 'Contact us' },
    ],
    backgroundImage: '/images/aboutus_heroimg.jpg',
    backgroundImageAlt: 'Contact us background',
  },
  infoPanel: {
    title: 'Contact Information',
    subtitle: 'Say something to start a live chat!',
    phoneLabel: 'Looking for Consultation',
    phoneGroups: [],
    addressLabel: 'Visit Our Location',
    address: 'Dartonfield, Agalawatta, 12200',
    emailLabel: 'Email',
    email: '',
    socials: [],
  },
  formPanel: {
    labels: {
      firstNameLabel: 'First Name',
      firstNameRequiredMessage: 'First name is required.',
      lastNameLabel: 'Last Name',
      lastNameRequiredMessage: 'Last name is required.',
      emailLabel: 'Email',
      emailRequiredMessage: 'Email is required.',
      phoneNumberLabel: 'Phone Number',
      phoneNumberRequiredMessage: 'Phone number is required.',
      selectSubjectLabel: 'Select Subject?',
      messageLabel: 'Message',
      messagePlaceholder: 'Write your message..',
      messageRequiredMessage: 'Message is required.',
      buttonLabel: 'Send Message',
    },
    subjectOptions: [],
  },
};

function mapBreadcrumbItems(hero: ContactPageHero | null | undefined): BreadcrumbItem[] {
  const breadcrumbItems =
    hero?.Breadcrumb
      ?.filter((item) => item?.label)
      .map((item) => ({
        label: item.label,
        ...(item.href ? { href: item.href } : {}),
      })) || [];

  return breadcrumbItems.length > 0
    ? breadcrumbItems
    : CONTACT_PAGE_FALLBACK.hero.breadcrumbItems;
}

function sortPhoneNumbers(phoneNumbers: ContactPhoneNumber[] | null | undefined): ContactPhoneNumber[] {
  return [...(phoneNumbers || [])].sort((left, right) => {
    const leftOrder = typeof left?.sortorder === 'number' ? left.sortorder : Number.MAX_SAFE_INTEGER;
    const rightOrder = typeof right?.sortorder === 'number' ? right.sortorder : Number.MAX_SAFE_INTEGER;
    return leftOrder - rightOrder;
  });
}

function buildPhoneHref(number: string): string {
  const sanitized = number.replace(/[^0-9+]/g, '');
  return sanitized ? `tel:${sanitized}` : '#';
}

function mapPhoneGroups(phoneNumbers: ContactPhoneNumber[] | null | undefined): ContactInfoPanelPhoneGroup[] {
  const sortedNumbers = sortPhoneNumbers(phoneNumbers)
    .map((phone) => phone?.number?.trim())
    .filter((number): number is string => Boolean(number));

  const phoneGroups: ContactInfoPanelPhoneGroup[] = [];

  for (let index = 0; index < sortedNumbers.length; index += 2) {
    const groupNumbers = sortedNumbers.slice(index, index + 2);
    if (groupNumbers.length === 0) {
      continue;
    }

    phoneGroups.push({
      links: groupNumbers.map((number) => ({
        displayNumber: number,
        href: buildPhoneHref(number),
      })),
    });
  }

  return phoneGroups;
}

function mapSocialPlatform(
  platform: ContactSocialLink['platform']
): ContactInfoPanelSocialLink['platform'] | null {
  switch (platform) {
    case 'Facebook':
      return 'facebook';
    case 'Instagram':
      return 'instagram';
    case 'LinkedIn':
      return 'linkedin';
    case 'X':
      return 'x';
    default:
      return null;
  }
}

function mapSocialLinks(
  localizedPage: ContactPage | null | undefined,
  fallbackPage: ContactPage | null | undefined
): ContactInfoPanelSocialLink[] {
  const socialLinks = localizedPage?.sociallinkscontact || fallbackPage?.sociallinkscontact || [];

  return socialLinks
    .filter((item) => item?.isvisible && item?.url)
    .map((item): ContactInfoPanelSocialLink | null => {
      const platform = mapSocialPlatform(item.platform);
      if (!platform) {
        return null;
      }

      return {
        href: item.url,
        platform,
        label: String(item.platform),
      };
    })
    .filter((item): item is ContactInfoPanelSocialLink => item !== null);
}

function mapFormLabels(
  labels: ContactFormLabels | null | undefined,
  fallbackLabels: ContactFormLabels | null | undefined
): ContactFormPanelLabels {
  const resolvedLabels = labels || fallbackLabels;

  return {
    firstNameLabel:
      resolvedLabels?.firstnamelabel || CONTACT_PAGE_FALLBACK.formPanel.labels.firstNameLabel,
    firstNameRequiredMessage:
      resolvedLabels?.firstnameerrormsg ||
      CONTACT_PAGE_FALLBACK.formPanel.labels.firstNameRequiredMessage,
    lastNameLabel:
      resolvedLabels?.lastnamelabel || CONTACT_PAGE_FALLBACK.formPanel.labels.lastNameLabel,
    lastNameRequiredMessage:
      resolvedLabels?.lastnameerrormsg ||
      CONTACT_PAGE_FALLBACK.formPanel.labels.lastNameRequiredMessage,
    emailLabel:
      resolvedLabels?.emaillabel || CONTACT_PAGE_FALLBACK.formPanel.labels.emailLabel,
    emailRequiredMessage:
      resolvedLabels?.emailerrormsg ||
      CONTACT_PAGE_FALLBACK.formPanel.labels.emailRequiredMessage,
    phoneNumberLabel:
      resolvedLabels?.phonenumberlabel ||
      CONTACT_PAGE_FALLBACK.formPanel.labels.phoneNumberLabel,
    phoneNumberRequiredMessage:
      resolvedLabels?.phonenumbererrormsg ||
      CONTACT_PAGE_FALLBACK.formPanel.labels.phoneNumberRequiredMessage,
    selectSubjectLabel:
      resolvedLabels?.selectsubjectlabel ||
      CONTACT_PAGE_FALLBACK.formPanel.labels.selectSubjectLabel,
    messageLabel:
      resolvedLabels?.messagelabel || CONTACT_PAGE_FALLBACK.formPanel.labels.messageLabel,
    messagePlaceholder:
      resolvedLabels?.messageplaceholder ||
      CONTACT_PAGE_FALLBACK.formPanel.labels.messagePlaceholder,
    messageRequiredMessage:
      resolvedLabels?.messageerrormsg ||
      CONTACT_PAGE_FALLBACK.formPanel.labels.messageRequiredMessage,
    buttonLabel:
      resolvedLabels?.buttonlabel || CONTACT_PAGE_FALLBACK.formPanel.labels.buttonLabel,
  };
}

function mapSubjectOptions(subjects: ContactSubject[] | null | undefined): ContactFormSubjectOption[] {
  return (subjects || [])
    .filter((item) => item?.subject?.trim())
    .map((item, index) => ({
      id: `subject-${item.id || index}`,
      label: item.subject.trim(),
      value: item.subject.trim(),
    }));
}

function mapHero(
  localizedPage: ContactPage | null | undefined,
  fallbackPage: ContactPage | null | undefined
): ContactHeroViewModel {
  const hero = localizedPage?.pagehero || fallbackPage?.pagehero;
  const image = hero?.backgroundImage || fallbackPage?.pagehero?.backgroundImage || null;

  return {
    title: hero?.PageTitle || CONTACT_PAGE_FALLBACK.hero.title,
    breadcrumbItems: mapBreadcrumbItems(hero),
    backgroundImage:
      getOptimizedImageUrl(image, 'large') ||
      getOptimizedImageUrl(image, 'medium') ||
      getStrapiImageUrl(image) ||
      CONTACT_PAGE_FALLBACK.hero.backgroundImage,
    backgroundImageAlt:
      hero?.backgroundImageAlt ||
      image?.alternativeText ||
      CONTACT_PAGE_FALLBACK.hero.backgroundImageAlt,
  };
}

export function mapContactPageData(
  localizedPage: ContactPage | null | undefined,
  fallbackPage: ContactPage | null | undefined,
  localizedSubjects: ContactSubject[] | null | undefined,
  fallbackSubjects: ContactSubject[] | null | undefined
): ContactPageViewModel {
  const info = localizedPage?.contactinformationdetails || fallbackPage?.contactinformationdetails;
  const fallbackInfo = fallbackPage?.contactinformationdetails;
  const labels = info?.contactformlabels;
  const fallbackLabels = fallbackInfo?.contactformlabels;
  const subjects =
    localizedSubjects && localizedSubjects.length > 0
      ? localizedSubjects
      : fallbackSubjects || [];

  return {
    hero: mapHero(localizedPage, fallbackPage),
    infoPanel: {
      title: info?.title || CONTACT_PAGE_FALLBACK.infoPanel.title,
      subtitle: info?.subtitle || CONTACT_PAGE_FALLBACK.infoPanel.subtitle,
      phoneLabel: info?.phonenumberlabel || CONTACT_PAGE_FALLBACK.infoPanel.phoneLabel,
      phoneGroups:
        mapPhoneGroups(info?.phonenumbers) || CONTACT_PAGE_FALLBACK.infoPanel.phoneGroups,
      addressLabel: info?.addresslabel || CONTACT_PAGE_FALLBACK.infoPanel.addressLabel,
      address: info?.address || CONTACT_PAGE_FALLBACK.infoPanel.address,
      emailLabel: info?.emaillabel || CONTACT_PAGE_FALLBACK.infoPanel.emailLabel,
      email: info?.emailaddress || CONTACT_PAGE_FALLBACK.infoPanel.email,
      socials: mapSocialLinks(localizedPage, fallbackPage),
    },
    formPanel: {
      labels: mapFormLabels(labels, fallbackLabels),
      subjectOptions: mapSubjectOptions(subjects),
    },
  };
}
