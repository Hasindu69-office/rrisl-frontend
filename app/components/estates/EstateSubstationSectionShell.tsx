import Image from 'next/image';
import type { ReactNode } from 'react';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';

export interface EstateSubstationSectionShellContent {
  eyebrow: string;
  title: string;
  backgroundImageSrc: string;
  backgroundImageAlt: string;
}

export interface EstateSubstationSectionShellProps {
  content: EstateSubstationSectionShellContent;
  className?: string;
  contentClassName?: string;
  containerClassName?: string;
  children?: ReactNode;
}

export default function EstateSubstationSectionShell({
  content,
  className = '',
  contentClassName = '',
  containerClassName = 'max-w-[1440px]',
  children,
}: EstateSubstationSectionShellProps) {
  return (
    <section className={`relative overflow-hidden ${className}`.trim()}>
      <div className="absolute inset-0">
        <Image
          src={content.backgroundImageSrc}
          alt={content.backgroundImageAlt}
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <div
        className={`relative z-10 px-4 py-12 md:px-6 md:py-16 lg:px-36 lg:py-24 ${contentClassName}`.trim()}
      >
        <div className={`mx-auto flex w-full justify-center ${containerClassName}`.trim()}>
          <div className="flex w-full flex-col items-center">
            <div className="flex max-w-[980px] flex-col items-center text-center">
              <GradientTag
                text={content.eyebrow}
                backgroundColor="transparent"
                padding="px-4 py-1.5"
              />

              <GradientTitle
                part1=""
                part2={content.title}
                lineBreak={false}
                align="center"
                size="custom"
                customSize="clamp(2rem, 5.2vw, 3.85rem)"
                className="mt-4 leading-[1.08] tracking-[-0.02em] md:mt-5 md:leading-[1.12]"
              />
            </div>

            {children ? <div className="mt-8 w-full md:mt-10 lg:mt-12">{children}</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
