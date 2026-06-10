import Image from 'next/image';
import React from 'react';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';

interface DepartmentStaffMember {
  name: string;
  role: string;
  imageSrc: string;
  imageAlt: string;
}

interface DepartmentStaffSectionProps {
  tagText: string;
  titlePart1: string | React.ReactNode;
  titlePart2: string | React.ReactNode;
  staff: DepartmentStaffMember[];
  containerClassName?: string;
}

function DepartmentStaffCard({
  member,
}: {
  member: DepartmentStaffMember;
}) {
  return (
    <article data-department-reveal className="group mx-auto flex h-[390px] w-full max-w-full flex-col overflow-hidden rounded-[30px] bg-[#F5F5F5] px-5 pt-5 shadow-[0_14px_40px_rgba(15,63,29,0.04)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(15,63,29,0.12)] focus-within:-translate-y-1 focus-within:shadow-[0_24px_58px_rgba(15,63,29,0.12)] md:h-[426px] md:px-6 md:pt-6 xl:h-[400px]">
      <div className="space-y-1.5">
        <h3 className="text-[18px] font-semibold leading-[1.25] text-[#0F3F1D] md:text-[19px] xl:text-[20px]">
          {member.name}
        </h3>
        <p className="text-[18px] leading-[1.5] text-[#1E1E1E]">
          {member.role}
        </p>
      </div>

      <div className="relative mt-6 flex-1 overflow-hidden rounded-b-[24px]">
        <Image
          src={member.imageSrc}
          alt={member.imageAlt}
          fill
          className="object-contain object-bottom scale-[1.12] translate-y-3 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.16] group-focus-within:scale-[1.16] md:scale-[1.12] md:translate-y-4"
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
        />
      </div>
    </article>
  );
}

/**
 * Reusable department staff section for department pages.
 */
export default function DepartmentStaffSection({
  tagText,
  titlePart1,
  titlePart2,
  staff,
  containerClassName = '',
}: DepartmentStaffSectionProps) {
  return (
    <section className="bg-white py-16 md:py-20 lg:py-24">
      <div className={`mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8 ${containerClassName}`}>
        <div className="flex flex-col items-center text-center" data-department-reveal>
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
            customSize="clamp(28px, 4vw, 50px)"
            align="center"
            className="mt-5 font-bold leading-[1.15]"
          />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 md:mt-12 md:grid-cols-2 md:gap-10 xl:grid-cols-3 xl:gap-12">
          {staff.map((member) => (
            <DepartmentStaffCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
