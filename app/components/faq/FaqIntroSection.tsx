import Image from 'next/image';
import GradientTag from '@/app/components/ui/GradientTag';
import GradientTitle from '@/app/components/ui/GradientTitle';
import FaqAccordion from './FaqAccordion';
import { faqItems } from './faqData';

export default function FaqIntroSection() {
  return (
    <section className="bg-white px-4 py-16 md:px-6 md:py-20 lg:py-24 mb-36">
      <div className="mx-auto w-full max-w-[1920px] lg:w-[80%]">
        <div className="grid w-full items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start">
            <GradientTag
              text="FAQ"
              className="mb-6"
              backgroundColor="#ffffff"
            />

            <GradientTitle
              part1="Quick Answers"
              part2="to Common Questions"
              size="custom"
              customSize="50px"
              className="w-full max-w-full font-semibold"
              style={{ lineHeight: '1.15' }}
            />

            <div className="relative mt-8 w-full max-w-[420px] self-center aspect-[420/565]">
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
