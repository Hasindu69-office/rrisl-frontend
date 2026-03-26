import React from 'react';
import Image from 'next/image';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';

interface DepartmentSectionProps {
    tagText: string;
    titlePart1: string | React.ReactNode;
    titlePart2: string | React.ReactNode;
    description: string;
    points: string[];
    imageSrc: string;
    imageAlt: string;
    reverse?: boolean;
    containerClassName?: string;
}

const LeafIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-1">
        <path d="M12 12.07V20M12 11.93C12 7.577 15.538 4.043 19.919 4C19.9723 4.37067 19.9993 4.748 20 5.132C20 9.485 16.462 13.018 12.081 13.062C12.0271 12.6864 12.0001 12.3074 12 11.928M12 11.928C12 7.576 8.462 4.042 4.081 4C4.02767 4.37067 4.00067 4.748 4 5.132C4 9.485 7.538 13.018 11.919 13.062C11.9729 12.6864 11.9999 12.3074 12 11.928Z" stroke="#2E7D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function DepartmentSection({
    tagText,
    titlePart1,
    titlePart2,
    description,
    points,
    imageSrc,
    imageAlt,
    reverse = false,
    containerClassName = '',
}: DepartmentSectionProps) {
    return (
        <section className="py-16 md:py-24">
            <div className={`container mx-auto max-w-[1920px] px-0 md:px-6 lg:px-8 ${containerClassName}`}>
                <div className={`flex flex-col gap-10 md:gap-14 lg:flex-row lg:items-center lg:gap-24 ${reverse ? 'lg:flex-row-reverse' : ''}`}>
                    {/* Content Side */}
                    <div className="w-full space-y-6 md:space-y-8 lg:w-1/2">
                        <div className="flex justify-start">
                            <GradientTag text={tagText} backgroundColor="transparent" className="inline-block" />
                        </div>

                        <GradientTitle
                            part1={titlePart1}
                            part2={titlePart2}
                            part1Color="dark-green"
                            size="custom"
                            customSize="clamp(28px, 4vw, 50px)"
                            align="left"
                            className="font-bold leading-[1.2]"
                        />

                        <p className="text-justify text-[16px] leading-[1.7] text-gray-700 md:text-[18px] lg:max-w-[640px] lg:text-[18px] lg:leading-[1.95]">
                            {description}
                        </p>

                        <ul className="space-y-4 md:space-y-5">
                            {points.map((point, index) => (
                                <li key={index} className="flex items-start gap-3 md:gap-4">
                                    <LeafIcon />
                                    <span className="text-justify text-[16px] leading-[1.7] text-gray-800 md:text-[17px] md:leading-[1.8] lg:text-[18px] lg:leading-[1.9]">
                                        {point}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Image Side */}
                    <div className="w-full lg:w-1/2">
                        <div className="relative mx-auto aspect-[4/3] w-full max-w-[560px] md:max-w-[720px] lg:max-w-none">
                            <Image
                                src={imageSrc}
                                alt={imageAlt}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
