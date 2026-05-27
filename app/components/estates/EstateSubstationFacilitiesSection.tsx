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
    <article className="rounded-[16px] border border-[#E7EED6] bg-white px-5 py-6 shadow-[0_14px_32px_rgba(15,63,29,0.05)] md:rounded-[20px] md:px-7 md:py-8">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#A1DF0A] md:h-[48px] md:w-[48px]">
        <Image
          src={iconSrc}
          alt={iconAlt}
          width={16}
          height={24}
          className="h-6 w-4 object-contain"
        />
      </div>

      <h3 className="mt-4 text-[18px] font-medium leading-[1.35] text-[#2E7D32] md:mt-5 md:text-[20px]">
        {title}
      </h3>

      <p className="mt-2.5 text-[14px] leading-[1.8] text-[#26362B] md:mt-3 md:text-[16px] md:leading-[1.95]">
        {description}
      </p>
    </article>
  );
}

export default function EstateSubstationFacilitiesSection({
  content,
}: EstateSubstationFacilitiesSectionProps) {
  return (
    <section className="bg-[#F5FCD9] px-4 py-12 md:px-6 md:py-[4.5rem] lg:px-36 lg:py-24">
      <div className="mx-auto grid w-full max-w-[1440px] gap-8 lg:grid-cols-[minmax(360px,0.92fr)_minmax(0,1.08fr)] lg:items-stretch lg:gap-14 xl:gap-[72px]">
        <div className="order-2 lg:order-1 lg:h-full">
          <div className="relative overflow-hidden rounded-[24px] md:rounded-[36px] lg:h-full lg:rounded-[50px]">
            <Image
              src={content.imageSrc}
              alt={content.imageAlt}
              width={1439}
              height={740}
              className="h-[240px] w-full object-cover sm:h-[280px] md:h-[360px] lg:h-full"
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 88vw, 46vw"
            />
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:pt-1">
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
            customSize="clamp(2rem, 5.5vw, 3.65rem)"
            className="mt-4 leading-[1.08] tracking-[-0.02em] md:mt-5 md:leading-[1.1]"
          />

          <p className="mt-5 max-w-[620px] text-[14px] leading-[1.8] text-[#26362B] md:mt-7 md:text-[16px] md:leading-[2]">
            {content.description}
          </p>

          <div className="mt-7 grid gap-4 md:mt-9 md:grid-cols-2 md:gap-6">
            {content.cards.map((card) => (
              <FacilityCard key={`${card.title}-${card.description}`} {...card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
