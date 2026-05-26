import Image from 'next/image';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';

export interface EstateSubstationIntroContent {
  eyebrow: string;
  titlePart1: string;
  titlePart2: string;
  paragraphs: string[];
  imageSrc: string;
  imageAlt: string;
}

export interface EstateSubstationIntroSectionProps {
  content: EstateSubstationIntroContent;
}

export default function EstateSubstationIntroSection({
  content,
}: EstateSubstationIntroSectionProps) {
  return (
    <section className="bg-white px-4 py-16 md:px-6 md:py-20 lg:px-36 lg:py-24">
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,520px)] lg:items-center lg:gap-16 xl:gap-24">
        <div className="max-w-[720px]">
          <GradientTag
            text={content.eyebrow}
            backgroundColor="transparent"
            padding="px-4 py-1.5"
          />

          <GradientTitle
            part1=""
            part2={`${content.titlePart1}${content.titlePart2}`}
            lineBreak={false}
            align="left"
            size="custom"
            customSize="clamp(2.2rem, 3vw, 3.55rem)"
            className="mt-5 leading-[1.12] tracking-[-0.02em]"
          />

          <div className="mt-8 space-y-7 text-[15px] leading-[2] text-[#26362B] md:text-[16px] md:leading-[2.05]">
            {content.paragraphs.map((paragraph) => (
              <p key={paragraph} className="max-w-[700px] text-justify">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[320px] md:max-w-[420px] lg:max-w-[520px]">
            <Image
              src={content.imageSrc}
              alt={content.imageAlt}
              width={1000}
              height={1000}
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
