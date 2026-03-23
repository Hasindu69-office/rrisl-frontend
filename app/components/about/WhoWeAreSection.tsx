import React from 'react';
import Image from 'next/image';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';

interface WhoWeAreSectionProps {
  locale?: string;
}

const WhoWeAreSection = ({ locale = 'en' }: WhoWeAreSectionProps) => {
  return (
    <section className="relative w-full min-h-[600px] md:min-h-[700px] lg:min-h-[1280px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/Aboutusimg1.png"
          alt="Who We Are background"
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10 h-full">
        {/* Main content wrapper with relative positioning for elements */}
        <div className="relative w-full min-h-[600px] md:min-h-[700px] lg:min-h-[850px] pt-12 md:pt-20 lg:pt-24">

          {/* Left Column: Content (Top Left) */}
          <div className="flex flex-col gap-6 max-w-2xl items-start relative z-20">
            <GradientTag text="Who We Are" />

            <GradientTitle
              part1="Driving the Future of"
              part2="Sri Lanka's Rubber Industry"
              size="lg"
              lineBreak={true}
              style={{ lineHeight: '130%' }}
            />

            <p className="text-[#000000] text-lg md:text-xl leading-relaxed max-w-xl text-justify">
              Rubber Research Institute of Sri Lanka is the oldest research institute on rubber in the world and is the nodal agency in Sri Lanka with the statutory responsibility for research and development on all aspects of rubber cultivation and processing for the benefit of the rubber industry.
            </p>
          </div>

          {/* Right Column: Outline Text (Slightly bottom right) */}
          <div className="absolute top-[55%] md:top-[40%] lg:top-[40%] right-0 md:right-4 lg:right-[-2%] z-10 select-none pointer-events-none">
            <div className="transform translate-y-12">
              <svg
                width="900"
                height="450"
                viewBox="0 0 900 450"
                className="w-[300px] md:w-[500px] lg:w-[600px] h-auto"
              >
                <text
                  x="100%"
                  y="30%"
                  textAnchor="end"
                  dominantBaseline="middle"
                  fill="transparent"
                  stroke="#1047203D"
                  strokeWidth="1"
                  fontSize="90"
                  fontWeight="bold"
                  className="font-sans"
                >
                  More than 100 years
                </text>
                <text
                  x="100%"
                  y="55%"
                  textAnchor="end"
                  dominantBaseline="middle"
                  fill="transparent"
                  stroke="#1047203D"
                  strokeWidth="1"
                  fontSize="90"
                  fontWeight="bold"
                  className="font-sans"
                >
                  of Excellence
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAreSection;
