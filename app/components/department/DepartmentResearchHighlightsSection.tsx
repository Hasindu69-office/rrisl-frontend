import Image from 'next/image';
import React from 'react';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';

interface DepartmentResearchHighlightsSectionProps {
  tagText: string;
  titlePart1: string | React.ReactNode;
  titlePart2: string | React.ReactNode;
  backgroundImageSrc: string;
  backgroundImageAlt: string;
  containerClassName?: string;
}

/**
 * Reusable department research highlights section shell.
 * This stage implements only the background artwork and the right-side vertical heading treatment.
 */
export default function DepartmentResearchHighlightsSection({
  tagText,
  titlePart1,
  titlePart2,
  backgroundImageSrc,
  backgroundImageAlt,
  containerClassName = '',
}: DepartmentResearchHighlightsSectionProps) {
  return (
    <section className="bg-white py-16 md:py-20 lg:py-24">
      <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden md:min-h-[560px] lg:min-h-[760px]">
        <div className="relative min-h-[420px] overflow-hidden md:min-h-[560px] lg:min-h-[760px]">
          <div className="absolute inset-0">
            <Image
              src={backgroundImageSrc}
              alt={backgroundImageAlt}
              fill
              className="object-cover object-center"
              priority={false}
              sizes="100vw"
            />
          </div>

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,98,26,0.12)_0%,rgba(7,98,26,0.02)_100%)]" />

          <div className={`relative z-10 mx-auto w-full max-w-[1920px] px-4 md:px-6 lg:px-8 ${containerClassName}`}>
            <div className="flex min-h-[420px] flex-col justify-between p-6 md:min-h-[560px] md:p-10 lg:min-h-[760px] lg:p-12">
              <div className="flex justify-start lg:hidden">
                <div className="flex flex-col items-start gap-4">
                  <GradientTag
                    text={tagText}
                    className="inline-block"
                    backgroundColor="white"
                    padding="px-4 py-1"
                  />

                  <GradientTitle
                    part1={titlePart1}
                    part2={titlePart2}
                    lineBreak={false}
                    part1Color="white"
                    size="custom"
                    customSize="clamp(28px, 4vw, 44px)"
                    align="left"
                    className="font-bold leading-[1.05] text-white"
                  />
                </div>
              </div>

              <div className="hidden lg:absolute lg:right-[80px] lg:top-1/2 lg:flex lg:-translate-y-1/2 lg:items-center lg:gap-2">
                <div className="pointer-events-none flex items-center gap-2">
                  <div className="inline-flex rotate-180 rounded-full bg-[linear-gradient(180deg,#20C997_0%,#A1DF0A_100%)] p-[2px]">
                    <div className="flex min-h-[200px] items-center justify-center rounded-full bg-white px-3 py-5">
                      <span className="[writing-mode:vertical-rl] text-[14px] font-semibold leading-none text-[#2E7D32]">
                        {tagText}
                      </span>
                    </div>
                  </div>

                  <div className="rotate-180 whitespace-nowrap [writing-mode:vertical-rl]">
                    <span className="text-[72px] font-bold leading-[0.85] text-white">
                      {titlePart1}{' '}
                    </span>
                    <span
                      className="text-[72px] font-bold leading-[0.85] text-transparent"
                      style={{
                        backgroundImage:
                          'linear-gradient(180deg, #20C997 0%, #A1DF0A 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                      }}
                    >
                      {titlePart2}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
