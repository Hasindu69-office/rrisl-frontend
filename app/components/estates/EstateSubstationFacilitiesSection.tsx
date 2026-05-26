import Image from 'next/image';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';

export interface EstateSubstationFacilityCard {
  title: string;
  description: string;
  iconSrc: string;
  iconAlt: string;
}

export interface EstateSubstationFacilitiesContent {
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  cards: EstateSubstationFacilityCard[];
}

export interface EstateSubstationFacilitiesSectionProps {
  content: EstateSubstationFacilitiesContent;
}

function FacilityCard({
  title,
  description,
  iconSrc,
  iconAlt,
}: EstateSubstationFacilityCard) {
  return (
    <article className="rounded-[20px] border border-[#E7EED6] bg-white px-6 py-7 shadow-[0_14px_32px_rgba(15,63,29,0.05)] md:px-7 md:py-8">
      <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#A1DF0A]">
        <Image
          src={iconSrc}
          alt={iconAlt}
          width={16}
          height={24}
          className="h-6 w-4 object-contain"
        />
      </div>

      <h3 className="mt-5 text-[20px] font-medium leading-[1.35] text-[#2E7D32]">
        {title}
      </h3>

      <p className="mt-3 text-[15px] leading-[1.95] text-[#26362B] md:text-[16px]">
        {description}
      </p>
    </article>
  );
}

export default function EstateSubstationFacilitiesSection({
  content,
}: EstateSubstationFacilitiesSectionProps) {
  return (
    <section className="bg-[#F5FCD9] px-4 py-16 md:px-6 md:py-20 lg:px-36 lg:py-24">
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 lg:grid-cols-[minmax(360px,0.92fr)_minmax(0,1.08fr)] lg:items-stretch lg:gap-14 xl:gap-[72px]">
        <div className="order-1 lg:h-full">
          <div className="relative overflow-hidden rounded-[50px] lg:h-full">
            <Image
              src={content.imageSrc}
              alt={content.imageAlt}
              width={1439}
              height={740}
              className="h-[380px] w-full object-cover sm:h-[460px] lg:h-full"
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 88vw, 46vw"
            />
          </div>
        </div>

        <div className="order-2 lg:pt-1">
          <GradientTag
            text={content.eyebrow}
            backgroundColor="transparent"
            padding="px-4 py-1.5"
          />

          <GradientTitle
            part1=""
            part2={content.title}
            lineBreak={false}
            align="left"
            size="custom"
            customSize="clamp(2.25rem, 3.2vw, 3.65rem)"
            className="mt-5 leading-[1.1] tracking-[-0.02em]"
          />

          <p className="mt-7 max-w-[620px] text-[15px] leading-[1.95] text-[#26362B] md:text-[16px] md:leading-[2]">
            {content.description}
          </p>

          <div className="mt-9 grid gap-5 md:grid-cols-2 md:gap-6">
            {content.cards.map((card) => (
              <FacilityCard key={`${card.title}-${card.description}`} {...card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
