import type { ReactNode } from 'react';
import type { ContactInfoPanelProps } from '@/app/lib/contact/pageData';

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13.832 16.568C14.0385 16.6628 14.2712 16.6845 14.4917 16.6294C14.7122 16.5744 14.9073 16.4458 15.045 16.265L15.4 15.8C15.5863 15.5516 15.8279 15.35 16.1056 15.2111C16.3833 15.0723 16.6895 15 17 15H20C20.5304 15 21.0391 15.2107 21.4142 15.5858C21.7893 15.9609 22 16.4696 22 17V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22C15.2261 22 10.6477 20.1036 7.27208 16.7279C3.89642 13.3523 2 8.7739 2 4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H7C7.53043 2 8.03914 2.21071 8.41421 2.58579C8.78929 2.96086 9 3.46957 9 4V7C9 7.31049 8.92771 7.61672 8.78885 7.89443C8.65 8.17214 8.44839 8.41371 8.2 8.6L7.732 8.951C7.54842 9.09118 7.41902 9.29059 7.36579 9.51535C7.31256 9.74012 7.33878 9.97638 7.44 10.184C8.80668 12.9599 11.0544 15.2048 13.832 16.568Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10.5585 13.942L21 3.5L10.5585 13.942Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 3.5L14.3538 20.5398C14.3145 20.6405 14.2487 20.7287 14.1635 20.7951C14.0782 20.8616 13.9767 20.9038 13.8696 20.9174C13.7625 20.9309 13.6538 20.9152 13.5548 20.8717C13.4558 20.8281 13.3703 20.7584 13.3074 20.6701L10.6697 16.9778C10.5937 16.8713 10.5029 16.7805 10.3964 16.7044L6.70409 14.0668C6.61581 14.0038 6.5461 13.9184 6.50253 13.8194C6.45896 13.7204 6.44324 13.6117 6.45679 13.5046C6.47034 13.3975 6.51268 13.296 6.57909 13.2107C6.64551 13.1255 6.73372 13.0597 6.83438 13.0204L21 3.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6H20C20.5523 6 21 6.44772 21 7V17C21 17.5523 20.5523 18 20 18H4C3.44772 18 3 17.5523 3 17V7C3 6.44772 3.44772 6 4 6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 7L12.5657 12.9031C12.2218 13.1438 11.7782 13.1438 11.4343 12.9031L3 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z"
        fill="#8CCB15"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M17.5 6.5H17.51M7 2H17C19.7614 2 22 4.23858 22 7V17C22 19.7614 19.7614 22 17 22H7C4.23858 22 2 19.7614 2 17V7C2 4.23858 4.23858 2 7 2ZM16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61992 14.1902 8.22773 13.4229 8.09407 12.5922C7.9604 11.7616 8.09207 10.9099 8.47033 10.1584C8.84859 9.40685 9.45419 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87659 12.63 8C13.4789 8.12588 14.2649 8.52146 14.8717 9.12831C15.4785 9.73515 15.8741 10.5211 16 11.37Z"
        stroke="#8CCB15"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z"
        fill="#8CCB15"
      />
      <path d="M6 9H2V21H6V9Z" fill="#8CCB15" />
      <path
        d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z"
        fill="#8CCB15"
      />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22 5.8C21.3 6.1 20.6 6.3 19.8 6.4C20.6 5.9 21.1 5.2 21.4 4.3C20.7 4.8 19.8 5.1 19 5.2C18.3 4.5 17.3 4 16.2 4C14.1 4 12.5 5.8 12.9 7.8C9.7 7.6 6.8 6.1 4.8 3.8C3.8 5.5 4.3 7.7 5.9 8.8C5.3 8.8 4.6 8.6 4.1 8.3C4.1 10.1 5.4 11.7 7.2 12.1C6.6 12.3 5.9 12.3 5.3 12.2C5.8 13.8 7.2 15 8.9 15C7.5 16.1 5.7 16.7 3.8 16.7C3.4 16.7 3.1 16.7 2.7 16.6C4.4 17.7 6.3 18.3 8.4 18.3C16.2 18.3 20.7 11.7 20.4 5.9C21.2 5.4 21.7 5.1 22 5.8Z"
        fill="#8CCB15"
      />
    </svg>
  );
}

function getSocialIcon(platform: ContactInfoPanelProps['socials'][number]['platform']) {
  switch (platform) {
    case 'facebook':
      return <FacebookIcon />;
    case 'instagram':
      return <InstagramIcon />;
    case 'linkedin':
      return <LinkedinIcon />;
    case 'x':
      return <TwitterIcon />;
    default:
      return null;
  }
}

function InfoRow({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-white"
        style={{ borderColor: 'rgba(161, 223, 10, 1)' }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[18px] leading-6 text-white">{title}</p>
        <div className="mt-2 space-y-1 text-[14px] font-semibold leading-6 text-white">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ContactInfoPanel({
  title,
  subtitle,
  phoneLabel,
  phoneGroups,
  addressLabel,
  address,
  emailLabel,
  email,
  socials,
}: ContactInfoPanelProps) {
  return (
    <div
      className="relative h-full min-h-[520px] overflow-hidden px-6 py-8 text-white shadow-[0_22px_60px_rgba(46,125,50,0.22)] md:px-8 md:py-10 lg:px-8 lg:py-8 xl:px-10 xl:py-9"
      style={{
        background:
          'linear-gradient(to bottom, rgba(46, 125, 50, 1) 0%, rgba(161, 223, 10, 1) 100%)',
      }}
    >
      <div className="relative z-10 flex h-full flex-col">
        <div>
          <h2 className="text-[28px] font-semibold leading-[1.2] text-white">
            {title}
          </h2>
          <p className="mt-3 text-[18px] leading-6 text-white/88">
            {subtitle}
          </p>
        </div>

        <div className="mt-12 space-y-10">
          <InfoRow icon={<PhoneIcon />} title={phoneLabel}>
            {phoneGroups.map((group) => (
              <div key={group.links.map((link) => link.href).join('|')} className="block">
                {group.links.map((link, index) => (
                  <span key={link.href + link.displayNumber}>
                    <a href={link.href} className="hover:text-white/85">
                      {link.displayNumber}
                    </a>
                    {index < group.links.length - 1 ? ', ' : null}
                  </span>
                ))}
              </div>
            ))}
          </InfoRow>

          <InfoRow icon={<LocationIcon />} title={addressLabel}>
            <p>{address}</p>
          </InfoRow>

          <InfoRow icon={<MailIcon />} title={emailLabel}>
            <a href={`mailto:${email}`} className="block hover:text-white/85">
              {email}
            </a>
          </InfoRow>
        </div>

        <div className="mt-auto pt-12">
          <div className="flex flex-wrap items-center gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-white transition-transform duration-200 hover:-translate-y-1"
              >
                {getSocialIcon(social.platform)}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-20 right-[-34px] h-[230px] w-[230px] rounded-full bg-white/14" />
      <div className="pointer-events-none absolute bottom-10 right-[86px] h-[110px] w-[110px] rounded-full bg-white/12" />
    </div>
  );
}
