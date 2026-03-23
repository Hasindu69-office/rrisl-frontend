import type { SubStationCardData, SubStationContact } from './subStationData';

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13.832 16.568C14.0385 16.6628 14.2712 16.6845 14.4917 16.6294C14.7122 16.5744 14.9073 16.4458 15.045 16.265L15.4 15.8C15.5863 15.5516 15.8279 15.35 16.1056 15.2111C16.3833 15.0723 16.6895 15 17 15H20C20.5304 15 21.0391 15.2107 21.4142 15.5858C21.7893 15.9609 22 16.4696 22 17V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22C15.2261 22 10.6477 20.1036 7.27208 16.7279C3.89642 13.3523 2 8.7739 2 4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H7C7.53043 2 8.03914 2.21071 8.41421 2.58579C8.78929 2.96086 9 3.46957 9 4V7C9 7.31049 8.92771 7.61672 8.78885 7.89443C8.65 8.17214 8.44839 8.41371 8.2 8.6L7.732 8.951C7.54842 9.09118 7.41902 9.29059 7.36579 9.51535C7.31256 9.74012 7.33878 9.97638 7.44 10.184C8.80668 12.9599 11.0544 15.2048 13.832 16.568Z"
        stroke="rgba(46, 125, 50, 1)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NavigationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15.8 8.2L13.03 15.3C12.9969 15.3847 12.9415 15.4588 12.8698 15.5147C12.7982 15.5705 12.7129 15.606 12.6229 15.6174C12.533 15.6288 12.4416 15.6156 12.3585 15.579C12.2754 15.5424 12.2036 15.4838 12.1508 15.4097L11.0514 13.8702C11.0001 13.7982 10.9387 13.7368 10.8667 13.6855L9.32724 12.5861C9.25314 12.5332 9.19451 12.4615 9.15795 12.3784C9.1214 12.2952 9.10817 12.2039 9.11957 12.1139C9.13097 12.024 9.16658 11.9387 9.22239 11.8671C9.27821 11.7954 9.35225 11.74 9.437 11.7068L15.8 8.2Z"
        stroke="rgba(46, 125, 50, 1)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ContactRow({ item }: { item: SubStationContact }) {
  const icon = item.label === 'Postal Address' ? <NavigationIcon /> : <PhoneIcon />;
  const content = item.href ? (
    <a href={item.href} className="font-semibold text-[#2E7D32] hover:text-[#246327]">
      {item.value}
    </a>
  ) : (
    <p className="font-semibold text-[#2E7D32]">{item.value}</p>
  );

  return (
    <div className="flex items-start gap-3">
      <div
        className="mt-1 flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full border"
        style={{ borderColor: 'rgba(46, 125, 50, 1)' }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[13px] leading-5 text-[#7A8B7B]">{item.label}</p>
        <div className="mt-1 text-[13px] leading-5">{content}</div>
      </div>
    </div>
  );
}

export default function SubStationCard({ name, subtitle, contacts }: SubStationCardData) {
  return (
    <article className="relative overflow-hidden rounded-[24px] border-b border-transparent bg-white px-5 py-6 shadow-[0_20px_55px_rgba(0,0,0,0.06)] transition-colors duration-200 hover:border-[rgba(46,125,50,0.27)] md:px-7 md:py-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "url('/images/Aboutussection2rightbranch.png')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left bottom',
          backgroundSize: '75% auto',
        }}
      />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[72px] w-[72px] rounded-tl-full bg-[rgba(161,223,10,0.45)]" />
      <div className="pointer-events-none absolute bottom-3 right-8 h-[62px] w-[62px] rounded-full bg-[rgba(161,223,10,0.32)]" />

      <div className="relative z-10">
        <h3
          className="max-w-full bg-clip-text text-[25px] font-semibold leading-[1.2] text-transparent"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(32, 201, 151, 1), rgba(161, 223, 10, 1))',
          }}
        >
          {name}
        </h3>
        {subtitle ? (
          <p
            className="mt-1 max-w-full bg-clip-text text-[25px] font-semibold leading-[1.25] text-transparent"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(32, 201, 151, 1), rgba(161, 223, 10, 1))',
            }}
          >
            {subtitle}
          </p>
        ) : null}

        <div className="mt-8">
          <div className="location-details-scroll max-h-[240px] space-y-4 overflow-y-auto pr-4">
            {contacts.map((item) => (
              <ContactRow key={`${item.label}-${item.value}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
