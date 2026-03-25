import Image from 'next/image';
import React from 'react';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';

interface DepartmentServiceItem {
  number: string;
  title: string;
  description: string;
  iconSrc: string;
  iconAlt: string;
  imageSrc: string;
  imageAlt: string;
}

interface DepartmentServicesSectionProps {
  tagText: string;
  titlePart1: string | React.ReactNode;
  titlePart2: string | React.ReactNode;
  items: DepartmentServiceItem[];
  containerClassName?: string;
}

function ServiceNumberBadge({
  number,
  isBack = false,
}: {
  number: string;
  isBack?: boolean;
}) {
  return (
    <div
      className={[
        'absolute right-0 top-0 flex h-[74px] w-[62px] items-center justify-center rounded-bl-[20px] rounded-tr-[20px]',
        isBack ? 'bg-[#A1DF0A]' : 'bg-[#0F4B24]',
      ].join(' ')}
    >
      <span
        className={[
          'text-[24px] font-semibold leading-none tracking-[-0.04em]',
          isBack ? 'text-[#0F4B24]' : 'text-[#A1DF0A]',
        ].join(' ')}
      >
        {number}
      </span>
    </div>
  );
}

function DepartmentServiceCard({
  item,
}: {
  item: DepartmentServiceItem;
}) {
  return (
    <article className="group mx-auto w-full max-w-[360px] [perspective:1600px] md:max-w-none">
      <div className="relative h-[384px] w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        <div className="absolute inset-0 overflow-hidden rounded-[20px] bg-[rgba(161,223,10,0.11)] [backface-visibility:hidden]">
          <ServiceNumberBadge number={item.number} />

            <div className="flex h-full flex-col px-6 pb-10 pt-16">
            <div className="mb-9 flex h-[56px] w-[56px] items-center justify-center">
              <Image
                src={item.iconSrc}
                alt={item.iconAlt}
                width={56}
                height={56}
                className="object-contain"
                style={{
                  filter:
                    'brightness(0) saturate(100%) invert(16%) sepia(35%) saturate(921%) hue-rotate(88deg) brightness(95%) contrast(98%)',
                }}
              />
            </div>

            <h3 className="max-w-[220px] text-[18px] font-medium leading-[1.3] text-[#2E7D32]">
              {item.title}
            </h3>

            <p className="mt-5 max-w-[232px] text-[16px] leading-[1.8] text-[#000000]">
              {item.description}
            </p>
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden rounded-[20px] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <Image
            src={item.imageSrc}
            alt={item.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 767px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,75,36,0.3)_0%,rgba(8,40,18,0.82)_58%,rgba(8,40,18,0.92)_100%)]" />

          <ServiceNumberBadge number={item.number} isBack />

          <div className="relative z-10 flex h-full flex-col px-6 pb-10 pt-16">
            <div className="mb-9 flex h-[56px] w-[56px] items-center justify-center">
              <Image
                src={item.iconSrc}
                alt={item.iconAlt}
                width={56}
                height={56}
                className="object-contain brightness-0 invert"
              />
            </div>

            <h3 className="max-w-[220px] text-[18px] font-semibold leading-[1.3] text-[#A1DF0A]">
              {item.title}
            </h3>

            <p className="mt-5 max-w-[232px] text-[16px] leading-[1.8] text-white">
              {item.description}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Reusable department services section with flip cards for department landing pages.
 */
export default function DepartmentServicesSection({
  tagText,
  titlePart1,
  titlePart2,
  items,
  containerClassName = '',
}: DepartmentServicesSectionProps) {
  return (
    <section className="bg-[rgba(161,223,10,0.13)] py-16 md:py-20 lg:py-24">
      <div className={`mx-auto max-w-[1920px] px-4 md:px-6 lg:px-8 ${containerClassName}`}>
        <div className="flex flex-col items-center text-center md:items-end md:text-right">
          <GradientTag
            text={tagText}
            backgroundColor="transparent"
            className="inline-block"
            padding="px-4 py-1"
          />

          <GradientTitle
            part1={titlePart1}
            part2={titlePart2}
            lineBreak={false}
            part1Color="dark-green"
            size="custom"
            customSize="clamp(2rem, 2.5vw + 1.2rem, 3.25rem)"
            align="left"
            className="mt-5 text-center font-bold leading-[1.15] md:text-right"
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <DepartmentServiceCard key={item.number} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
