import Image from 'next/image';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';

export interface EstateSubstationFeatureCard {
  title: string;
  badge: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export interface EstateSubstationFeatureSectionContent {
  eyebrow: string;
  titlePart1: string;
  titlePart2: string;
  description: string;
  backgroundImageSrc: string;
  backgroundImageAlt: string;
  cards?: EstateSubstationFeatureCard[];
}

export interface EstateSubstationFeatureSectionProps {
  content: EstateSubstationFeatureSectionContent;
}

function FeatureCard({
  title,
  badge,
  description,
  imageSrc,
  imageAlt,
}: EstateSubstationFeatureCard) {
  return (
    <article className="relative overflow-hidden rounded-[24px] min-h-[410px] shadow-[0_18px_34px_rgba(33,72,24,0.12)]">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover"
        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 48vw, 20vw"
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(13,38,17,0.12)_100%)]" />

      <div className="relative z-10 flex min-h-[410px] items-end p-4 md:p-5">
        <div className="flex h-[170px] w-full flex-col overflow-hidden rounded-[22px] bg-white px-5 py-4 shadow-[0_12px_24px_rgba(15,63,29,0.08)] md:px-6 md:py-5">
          <h3 className="text-[17px] font-semibold leading-[1.15] text-[#567184] md:text-[18px]">
            {title}
          </h3>

          <div className="mt-2 inline-flex rounded-full bg-[#9DE100] px-3 py-1.5">
            <span className="text-[12px] font-semibold leading-none text-white md:text-[13px]">
              {badge}
            </span>
          </div>

          <p className="mt-2 max-w-[260px] overflow-hidden text-[12.5px] leading-[1.42] text-[#5E7280] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4] md:text-[13.5px]">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function EstateSubstationFeatureSection({
  content,
}: EstateSubstationFeatureSectionProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={content.backgroundImageSrc}
          alt={content.backgroundImageAlt}
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.78)_38%,rgba(255,255,255,0.56)_100%)]" />
      </div>

      <div className="relative z-10 px-4 py-16 md:px-6 md:py-20 lg:px-36 lg:py-24">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.85fr)] lg:items-start lg:gap-16">
            <div className="max-w-[640px]">
              <GradientTag
                text={content.eyebrow}
                backgroundColor="transparent"
                padding="px-4 py-1.5"
              />

              <GradientTitle
                part1={content.titlePart1}
                part2={content.titlePart2}
                lineBreak
                align="left"
                size="custom"
                customSize="clamp(2.2rem, 3vw, 3.6rem)"
                className="mt-5 leading-[1.1] tracking-[-0.02em]"
              />
            </div>

            <div className="max-w-[560px] justify-self-start lg:justify-self-end">
              <p className="text-justify text-[15px] leading-[2] text-[#5E7280] md:text-[16px] md:leading-[2.05]">
                {content.description}
              </p>
            </div>
          </div>

          {content.cards?.length ? (
            <div className="mt-12 md:mt-14 lg:relative lg:left-1/2 lg:w-screen lg:max-w-none lg:-translate-x-1/2 lg:px-8 xl:px-10">
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
                {content.cards.map((card) => (
                  <FeatureCard key={`${card.title}-${card.badge}`} {...card} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
