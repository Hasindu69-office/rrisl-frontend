import type { Footer } from '@/app/lib/types';
import { getStrapiUrl } from '@/app/lib/strapi/client';

export interface FooterLink {
  label: string;
  href: string;
  openInNewTab?: boolean;
}

export interface FooterLinkGroupData {
  title: string;
  links: FooterLink[];
}

export interface FooterPhone {
  label: string;
  number: string;
}

export type FooterSocialType = 'facebook' | 'instagram' | 'linkedin' | 'youtube';

export interface FooterSocialLink {
  type: FooterSocialType;
  label: string;
  href: string;
}

export interface FooterConfig {
  logo: {
    src: string;
    alt: string;
  };
  backgroundImage: {
    src: string;
    alt: string;
  };
  linkGroups: FooterLinkGroupData[];
  contactTitle: string;
  addressLines: string[];
  phones: FooterPhone[];
  email: string;
  socialLinks: FooterSocialLink[];
  rightsText: string;
}

export const footerConfig: FooterConfig = {
  logo: {
    src: '/images/rrisl_logo.png',
    alt: 'Rubber Research Institute of Sri Lanka logo',
  },
  backgroundImage: {
    src: '/images/footer_bg.png',
    alt: '',
  },
  linkGroups: [
    {
      title: 'Quick Links',
      links: [
        { label: 'About us', href: '#' },
        { label: 'Services', href: '#' },
        { label: 'Statistics', href: '#' },
        { label: 'Privacy policy', href: '#' },
        { label: 'Terms and conditions', href: '#' },
      ],
    },
    {
      title: 'Important links',
      links: [
        { label: 'Vacancies', href: '#' },
        { label: 'Bid notice', href: '#' },
        { label: 'Statistics', href: '#' },
        { label: 'Annual report', href: '#' },
        { label: 'Rubber prices', href: '#' },
        { label: 'Rubber research act', href: '#' },
      ],
    },
  ],
  contactTitle: 'Contact us',
  addressLines: [
    'Rubber Research Institute of Sri Lanka,',
    'Dartonfield, Agalawatta, 12200',
  ],
  phones: [
    { label: 'Hotline', number: '034-2247426' },
    { label: 'Research', number: '034-2247383' },
    { label: 'Hotline', number: '034-2248459' },
    { label: 'Research', number: '034-2295540' },
    { label: 'Fax', number: '034-2247427' },
  ],
  email: 'dirrrisl@sltnet.lk',
  socialLinks: [
    { type: 'facebook', label: 'Facebook', href: '#' },
    { type: 'instagram', label: 'Instagram', href: '#' },
    { type: 'linkedin', label: 'LinkedIn', href: '#' },
    { type: 'youtube', label: 'YouTube', href: '#' },
  ],
  rightsText: `\u00A9 ${new Date().getFullYear()} Rubber Research Institute of Sri Lanka. All rights reserved.`,
};

function toAbsoluteMediaUrl(url: string | null | undefined): string | null {
  if (!url) {
    return null;
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  return getStrapiUrl(url);
}

function splitAddressLines(address: string | null | undefined): string[] {
  if (!address) {
    return footerConfig.addressLines;
  }

  return address
    .split(/\r?\n|,/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function resolveSocialType(label: string, url: string): FooterSocialType | null {
  const source = `${label.trim().toLowerCase()} ${url.trim().toLowerCase()}`;

  if (source.includes('facebook')) {
    return 'facebook';
  }

  if (source.includes('instagram')) {
    return 'instagram';
  }

  if (source.includes('linkedin')) {
    return 'linkedin';
  }

  if (source.includes('youtube') || source.includes('youtu.be')) {
    return 'youtube';
  }

  return null;
}

export function mapFooterToConfig(footer: Footer | null | undefined): FooterConfig {
  if (!footer) {
    return footerConfig;
  }

  const linkGroups = footer.TopicandLinks?.length
    ? footer.TopicandLinks.map((group) => ({
        title: group.GroupTitle,
        links: group.Links.map((link) => ({
          label: link.Label,
          href: link.URL,
          openInNewTab: link.openinnewtab,
        })),
      }))
    : footerConfig.linkGroups;

  const socialLinks = footer.SocialLinks?.length
    ? footer.SocialLinks
        .map((link) => {
          const type = resolveSocialType(link.label, link.Url);

          return type
            ? {
                type,
                label: link.label,
                href: link.Url,
              }
            : null;
        })
        .filter((link): link is FooterSocialLink => link !== null)
    : footerConfig.socialLinks;

  return {
    logo: {
      src: toAbsoluteMediaUrl(footer.FooterLogo?.url) || footerConfig.logo.src,
      alt: footer.FooterLogo?.alternativeText || footerConfig.logo.alt,
    },
    backgroundImage: {
      src:
        toAbsoluteMediaUrl(footer.FooterBackgroundImage?.url) ||
        footerConfig.backgroundImage.src,
      alt: footer.FooterBackgroundImage?.alternativeText || footerConfig.backgroundImage.alt,
    },
    linkGroups,
    contactTitle: footer.ContactInfo?.Title || footerConfig.contactTitle,
    addressLines: splitAddressLines(footer.ContactInfo?.Address),
    phones:
      footer.ContactInfo?.PhoneNumber?.map((phone) => ({
        label: phone.Label,
        number: phone.Number,
      })) || footerConfig.phones,
    email: footer.ContactInfo?.EmailAddress || footerConfig.email,
    socialLinks: socialLinks.length ? socialLinks : footerConfig.socialLinks,
    rightsText: footer.AllrightsreserveText || footerConfig.rightsText,
  };
}
