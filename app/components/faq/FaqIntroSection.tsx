import Image from 'next/image';
import GradientTag from '@/app/components/ui/GradientTag';
import GradientTitle from '@/app/components/ui/GradientTitle';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';
import FaqAccordion from './FaqAccordion';
import type { FaqItemData } from './faqData';

interface FaqIntroSectionProps {
  section: {
    eyebrow: string;
    title: {
      part1: string;
      part2: string;
      align?: 'left' | 'center' | 'right';
    };
    imageSrc: string;
    imageAlt: string;
  };
  items: FaqItemData[];
}

export default function FaqIntroSection({ section, items }: FaqIntroSectionProps) {
  const useUnoptimizedImage = isLocalhostAssetUrl(section.imageSrc);

  return (
    <section className="mb-48 md:mb-36 bg-white px-4 py-14 md:px-6 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1920px] lg:w-[80%]">
        <div className="grid w-full items-start gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start">
            <GradientTag
              text={section.eyebrow}
              className="mb-5 md:mb-6"
              backgroundColor="#ffffff"
              padding="px-12 py-2"
            />

            <GradientTitle
              part1={section.title.part1}
              part2={section.title.part2}
              size="custom"
              align={section.title.align}
              className="w-full max-w-full font-semibold text-[32px] md:text-[40px] lg:text-[50px]"
              style={{ lineHeight: '1.15' }}
            />

            <div className="relative mt-6 w-full max-w-[280px] self-center aspect-[420/565] md:mt-8 md:max-w-[360px] lg:max-w-[420px]">
              <Image
                src={section.imageSrc}
                alt={section.imageAlt}
                fill
                className="object-contain object-center"
                priority
                unoptimized={useUnoptimizedImage}
              />
            </div>
          </div>

          <div className="w-full lg:pt-4">
            <FaqAccordion items={items} />
          </div>
        </div>
      </div>
    </section>
  );
}
