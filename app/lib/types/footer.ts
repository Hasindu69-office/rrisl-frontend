import type { StrapiImage } from './strapi';

export interface FooterLinkItem {
  id: number;
  Label: string;
  URL: string;
  openinnewtab: boolean;
}

export interface FooterLinkGroup {
  id: number;
  GroupTitle: string;
  Links: FooterLinkItem[];
}

export interface FooterPhoneLine {
  id: number;
  Label: string;
  Number: string;
}

export interface FooterContactInfo {
  id: number;
  Title: string;
  Address: string;
  PhoneNumber: FooterPhoneLine[];
  EmailAddress: string;
}

export interface FooterSocialLink {
  id: number;
  label: string;
  Icon?: StrapiImage | null;
  Url: string;
}

export interface Footer {
  id: number;
  FooterLogo: StrapiImage | null;
  FooterBackgroundImage: StrapiImage | null;
  TopicandLinks: FooterLinkGroup[];
  ContactInfo: FooterContactInfo | null;
  AllrightsreserveText: string;
  SocialLinks: FooterSocialLink[];
}
