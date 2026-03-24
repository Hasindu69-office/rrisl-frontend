import Image from 'next/image';
import GradientTag from '@/app/components/ui/GradientTag';
import GradientTitle from '@/app/components/ui/GradientTitle';
import FaqAccordion from './FaqAccordion';
import { faqItems } from './faqData';

export default function FaqIntroSection() {
  return (
    <section className="mb-48 md:mb-36 bg-white px-4 py-14 md:px-6 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1920px] lg:w-[80%]">
        <div className="grid w-full items-start gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start">
            <GradientTag
              text="FAQ"
              className="mb-5 md:mb-6"
              backgroundColor="#ffffff"
              padding="px-12 py-2"
            />

            <GradientTitle
              part1="Quick Answers"
              part2="to Common Questions"
              size="custom"
              className="w-full max-w-full font-semibold text-[32px] md:text-[40px] lg:text-[50px]"
              style={{ lineHeight: '1.15' }}
            />

            <div className="relative mt-6 w-full max-w-[280px] self-center aspect-[420/565] md:mt-8 md:max-w-[360px] lg:max-w-[420px]">
              <Image
                src="/images/faqsection1img.webp"
                alt="FAQ section illustration"
                fill
                className="object-contain object-center"
                priority
              />
            </div>
          </div>

          <div className="w-full lg:pt-4">
            <FaqAccordion items={faqItems} />
          </div>
        </div>
      </div>
    </section>
  );
}
