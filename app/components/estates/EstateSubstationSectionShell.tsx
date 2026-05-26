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
  children?: ReactNode;
}

export default function EstateSubstationSectionShell({
  content,
  className = '',
  contentClassName = '',
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
        className={`relative z-10 px-4 py-16 md:px-6 md:py-20 lg:px-36 lg:py-24 ${contentClassName}`.trim()}
      >
        <div className="mx-auto flex w-full max-w-[1440px] justify-center">
          <div className="flex w-full flex-col items-center text-center">
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
                customSize="clamp(2.2rem, 4vw, 3.85rem)"
                className="mt-5 leading-[1.12] tracking-[-0.02em]"
              />
            </div>

            {children ? <div className="mt-12 w-full">{children}</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
