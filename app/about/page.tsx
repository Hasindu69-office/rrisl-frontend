import Image from 'next/image';
import PageHero from '../components/shared/PageHero';
import GradientTitle from '../components/ui/GradientTitle';
import GradientTag from '../components/ui/GradientTag';
import MissionVisionSection from '../components/about/MissionVisionSection';
import ObjectivesSlider from '../components/about/ObjectivesSlider';

interface AboutProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function About({ searchParams }: AboutProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';

  return (
    <div className="min-h-screen">
      {/* Page Hero Section */}
      <PageHero
        title="About us"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'About us' },
        ]}
        // backgroundImage defaults to /images/aboutus_heroimg.jpg
        backgroundImageAlt="About Us background"
        locale={locale}
      />

      {/* Who We Are Section */}
      <section className="relative w-full overflow-hidden min-h-[500px] sm:min-h-[600px] md:min-h-[800px] lg:min-h-[1000px] flex flex-col">
        {/* Background Image Container with Custom Dimensions */}
        <div className="absolute w-full h-full md:h-[800px] lg:w-full lg:h-[1030px] z-0">
          <Image
            src="/images/Aboutusimg1.png"
            alt="Rubber tree cultivation and roots"
            fill
            className="object-contain xl:object-cover object-bottom"
            priority
            quality={100}
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 container px-4 sm:px-6 md:px-8 lg:px-12 xl:px-8 max-w-[1440px] pt-0 pb-10 sm:pb-16 md:pb-20 mt-8 sm:mt-12 md:mt-16 lg:mt-[40px] xl:ml-[120px]">
          <div className="max-w-2xl">
            {/* Tag Section */}
            <div className="mb-4 md:mb-6">
              <GradientTag
                text="Who We Are"
                backgroundColor="transparent"
                className="inline-block"
              />
            </div>

            {/* Title Section */}
            <div className="mb-4 md:mb-6 lg:mb-8">
              <GradientTitle
                part1="Driving the Future of"
                part2={<>Sri Lanka's Rubber <br /> Industry</>}
                part1Color="dark-green"
                size="custom"
                className="font-bold text-[28px] md:text-[40px] lg:text-[50px]"
                style={{ lineHeight: '130%' }}
              />
            </div>

            {/* Description */}
            <div className="max-w-xl">
              <p className="text-gray-700 text-[14px] md:text-[16px] lg:text-[18px] leading-[1.5] lg:leading-[35px]" style={{ fontWeight: 400 }}>
                Rubber Research Institute of Sri Lanka is the oldest research institute on rubber in the world and is the nodal agency in Sri Lanka with the statutory responsibility for research and development on all aspects of rubber cultivation and processing for the benefit of the rubber industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <MissionVisionSection />

      {/* Our Objectives Slider */}
      <ObjectivesSlider />

      <div className="h-[350px]"></div>
    </div>
  );
}

