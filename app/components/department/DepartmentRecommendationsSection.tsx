import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import Button from '../ui/Button';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';

interface DepartmentRecommendationsSectionProps {
    tagText: string;
    titlePart1: string | React.ReactNode;
    titlePart2: string | React.ReactNode;
    description?: string;
    leftBackgroundImageSrc: string;
    leftBackgroundImageAlt: string;
    rightBackgroundColor?: string;
    splitPosition?: string;
    bookImageSrc: string;
    bookImageAlt: string;
    bookLabel: string;
    buttonText?: string;
    buttonHref?: string;
    className?: string;
    minHeightClassName?: string;
}

/**
 * Reusable department recommendations section with a split background,
 * featured recommendation card, and right-aligned copy block.
 */
export default function DepartmentRecommendationsSection({
    tagText,
    titlePart1,
    titlePart2,
    description,
    leftBackgroundImageSrc,
    leftBackgroundImageAlt,
    rightBackgroundColor = '#0F3F1D',
    splitPosition = '44.5%',
    bookImageSrc,
    bookImageAlt,
    bookLabel,
    buttonText = 'Read More',
    buttonHref = '#',
    className = '',
    minHeightClassName = 'min-h-[420px] md:min-h-[520px] lg:min-h-[486px]',
}: DepartmentRecommendationsSectionProps) {
    return (
        <section
            className={`relative overflow-hidden bg-[#0F3F1D] ${minHeightClassName} lg:bg-transparent ${className}`}
        >
            <div
                className="absolute inset-y-0 left-0 hidden lg:block"
                aria-hidden="true"
                style={{ width: splitPosition }}
            >
                <Image
                    src={leftBackgroundImageSrc}
                    alt={leftBackgroundImageAlt}
                    fill
                    className="object-cover object-center"
                    sizes="100vw"
                />
            </div>

            <div
                className="absolute inset-y-0 right-0 hidden lg:block"
                aria-hidden="true"
                style={{
                    left: splitPosition,
                    backgroundColor: rightBackgroundColor,
                }}
            />

            <div className="relative z-10 mx-auto flex w-full max-w-[1920px] justify-center px-4 py-10 md:px-6 md:py-12 lg:px-8 lg:py-8">
                <div className="grid w-full max-w-[1184px] grid-cols-1 items-center gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-10">
                    <div className="order-2 flex justify-center md:order-none md:justify-start lg:justify-end">
                        <div className="w-full max-w-[290px] md:max-w-[300px] lg:max-w-[390px] lg:translate-x-[4.5rem]">
                            <div className="flex aspect-square flex-col justify-between rounded-[28px] bg-white px-4 pb-4 pt-4 shadow-[0_14px_36px_rgba(0,0,0,0.08)] md:rounded-[32px] md:px-5 md:pb-5 md:pt-5 lg:rounded-[40px] lg:px-5 lg:pb-5 lg:pt-5 lg:shadow-[0_14px_36px_rgba(0,0,0,0.08)]">
                                <div className="relative mx-auto h-full w-full max-w-[250px] flex-1 md:max-w-[260px] lg:max-w-[344px]">
                                    <Image
                                        src={bookImageSrc}
                                        alt={bookImageAlt}
                                        fill
                                        className="object-contain scale-[1.08] md:scale-[1.1] lg:scale-[1.16]"
                                        sizes="(max-width: 767px) 250px, (max-width: 1023px) 260px, 344px"
                                    />
                                </div>

                                <p
                                    className="mt-2 px-3 text-center text-[20px] font-normal leading-none text-transparent md:px-4 md:text-[22px] lg:text-[24px]"
                                    style={{ WebkitTextStroke: '1px #2E7D32' }}
                                >
                                    {bookLabel}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 flex justify-center md:order-none md:justify-center lg:justify-end">
                        <div className="flex w-full max-w-[360px] flex-col items-center text-center md:max-w-[380px] lg:max-w-[560px] lg:items-end lg:text-right">
                            <GradientTag
                                text={tagText}
                                backgroundColor="white"
                                padding="px-4 py-1 md:px-5 md:py-1.5"
                                className="inline-block"
                            />

                            <GradientTitle
                                part1={titlePart1}
                                part2={titlePart2}
                                part1Color="white"
                                size="custom"
                                customSize="clamp(30px, 4.6vw, 44px)"
                                align="center"
                                className="mt-5 font-bold leading-[1.15] md:mt-6 lg:mt-7 lg:text-right"
                                gradientFrom="#FFFFFF"
                                gradientTo="#FFFFFF"
                            />

                            {description ? (
                                <p className="mt-5 max-w-[32ch] text-[18px] leading-[35px] text-white md:mt-6 md:max-w-[28ch] lg:mt-7 lg:max-w-[470px]">
                                    {description}
                                </p>
                            ) : null}

                            <div className="mt-6">
                                <Link href={buttonHref}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="!h-[46px] !w-[128px] !rounded-[8px] !border-0 !bg-[#A1DF0A] !px-6 !py-0 !text-[14px] !font-medium !text-[#0F3F1D] hover:!bg-[#b4f20c] hover:!text-[#0F3F1D] focus:!ring-[#A1DF0A]"
                                    >
                                        {buttonText}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
