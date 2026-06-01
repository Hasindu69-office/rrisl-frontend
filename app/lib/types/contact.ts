import type { AboutPageBreadcrumbItem } from './shared';
import type { StrapiImage } from './strapi';

export interface ContactPageHero {
  id: number;
  PageTitle: string;
  backgroundImageAlt?: string | null;
  Breadcrumb?: AboutPageBreadcrumbItem[] | null;
  backgroundImage?: StrapiImage | null;
}

export interface ContactPhoneNumber {
  id: number;
  label?: string | null;
  number: string;
  isprimary?: boolean;
  sortorder: number;
}

export interface ContactFormLabels {
  id: number;
  firstnamelabel: string;
  firstnameerrormsg: string;
  lastnamelabel: string;
  lastnameerrormsg: string;
  emaillabel: string;
  emailerrormsg: string;
  phonenumberlabel: string;
  phonenumbererrormsg: string;
  selectsubjectlabel: string;
  messagelabel: string;
  messageplaceholder: string;
  messageerrormsg: string;
  buttonlabel: string;
}

export interface ContactInformationDetails {
  id: number;
  title: string;
  subtitle: string;
  phonenumberlabel: string;
  phonenumbers?: ContactPhoneNumber[] | null;
  addresslabel: string;
  address: string;
  emaillabel: string;
  emailaddress: string;
  contactformlabels?: ContactFormLabels | null;
}

export type ContactSocialPlatform = 'Facebook' | 'Instagram' | 'LinkedIn' | 'X';

export interface ContactSocialLink {
  id: number;
  platform: ContactSocialPlatform;
  url: string;
  isvisible: boolean;
}

export interface ContactLocationCard {
  id: number;
  title: string;
  hightlightedtext?: string | null;
  addresslabel: string;
  address: string;
  phonenumber?: ContactPhoneNumber[] | null;
  verticaltext: string;
  gmapembedlink: string;
}

export interface ContactSubStationCard {
  id: number;
  substationtitle: string;
  postaladdresslabel: string;
  postaladdress: string;
  gmapembedlink?: string | null;
  emaillabel?: string | null;
  emailaddress?: string | null;
  phonenumbers?: ContactPhoneNumber[] | null;
  sortorder: number;
}

export interface ContactPage {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
  pagehero?: ContactPageHero | null;
  contactinformationdetails?: ContactInformationDetails | null;
  sociallinkscontact?: ContactSocialLink[] | null;
  headofficeandboardofficedetails?: ContactLocationCard[] | null;
  substationtitle?: string | null;
  hightlightedtext?: string | null;
  substations?: ContactSubStationCard[] | null;
}

export interface ContactSubject {
  id: number;
  documentId?: string;
  subject: string;
  sortorder: number;
  locale?: string;
}
