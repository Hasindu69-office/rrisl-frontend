export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterPhone {
  label: string;
  number: string;
}

export interface FooterSocialLink {
  type: 'facebook' | 'instagram' | 'linkedin' | 'youtube';
  href: string;
}

export interface FooterConfig {
  quickLinks: FooterLink[];
  importantLinks: FooterLink[];
  addressLines: string[];
  phones: FooterPhone[];
  email: string;
  socialLinks: FooterSocialLink[];
}

export const footerConfig: FooterConfig = {
  quickLinks: [
    { label: 'About us', href: '#' },
    { label: 'Services', href: '#' },
    { label: 'Statistics', href: '#' },
    { label: 'Privacy policy', href: '#' },
    { label: 'Terms and conditions', href: '#' },
  ],
  importantLinks: [
    { label: 'Vacancies', href: '#' },
    { label: 'Bid notice', href: '#' },
    { label: 'Statistics', href: '#' },
    { label: 'Annual report', href: '#' },
    { label: 'Rubber prices', href: '#' },
    { label: 'Rubber research act', href: '#' },
  ],
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
    { type: 'facebook', href: '#' },
    { type: 'instagram', href: '#' },
    { type: 'linkedin', href: '#' },
  ],
};



