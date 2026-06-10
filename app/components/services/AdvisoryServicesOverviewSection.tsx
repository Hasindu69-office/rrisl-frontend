import Image from 'next/image';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';
import type { AdvisoryServicesOverviewViewModel } from '@/app/lib/advisory-services/pageData';

interface AdvisoryServicesOverviewSectionProps {
  overview: AdvisoryServicesOverviewViewModel;
}

export default function AdvisoryServicesOverviewSection({
  overview,
}: AdvisoryServicesOverviewSectionProps) {
  const useUnoptimizedImage = isLocalhostAssetUrl(overview.imageSrc);

  return (
    <section className="bg-white py-14 md:py-18 lg:py-24">
      <div className="mx-auto w-full max-w-[1480px] px-4 md:px-6 lg:px-36">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(320px,440px)_minmax(0,1fr)] lg:items-center lg:gap-14 xl:gap-18">
          <div className="relative overflow-hidden shadow-[0_18px_42px_rgba(15,63,29,0.08)] lg:-ml-36 lg:w-[calc(100%+9rem)] lg:shadow-none">
            <div className="relative aspect-[4/4.7] min-h-[320px] sm:min-h-[420px] lg:min-h-[560px]">
              <Image
                src={overview.imageSrc}
                alt={overview.imageAlt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1023px) 100vw, 584px"
                priority
                unoptimized={useUnoptimizedImage}
              />
            </div>
          </div>

          <div className="lg:py-4 xl:py-6">
            <GradientTag
              text={overview.tag}
              backgroundColor="#ffffff"
              padding="px-7 py-2"
            />

            <GradientTitle
              part1={overview.title}
              part2=""
              lineBreak={false}
              size="custom"
              className="mt-5 text-[34px] md:text-[42px] lg:text-[56px]"
              style={{ lineHeight: '1.12' }}
              align="left"
            />

            <div className="mt-7 flex max-w-[760px] flex-col gap-6 md:mt-8 md:gap-7">
              {overview.paragraphs.map((paragraph, index) => (
                <p
                  key={`${paragraph}-${index}`}
                  className="text-justify text-[15px] leading-[1.95] text-[#1F2E24] md:text-[16px] lg:text-[18px]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
