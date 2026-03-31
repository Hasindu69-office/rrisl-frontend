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
        <section className={`relative overflow-hidden ${minHeightClassName} ${className}`}>
            <div
                className="absolute inset-y-0 left-0"
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
                className="absolute inset-y-0 right-0"
                style={{
                    left: splitPosition,
                    backgroundColor: rightBackgroundColor,
                }}
            />

            <div className="relative z-10 mx-auto flex w-full max-w-[1920px] justify-center px-4 py-14 md:px-6 md:py-16 lg:px-8 lg:py-8">
                <div className="grid w-full max-w-[1184px] grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-10">
                    <div className="flex justify-center lg:justify-end">
                        <div className="w-full max-w-[390px] lg:translate-x-[4.5rem]">
                            <div className="flex aspect-square flex-col justify-between rounded-[40px] bg-white px-5 pb-5 pt-5 shadow-[0_14px_36px_rgba(0,0,0,0.08)] md:px-7 md:pb-6 md:pt-7">
                                <div className="relative mx-auto h-full w-full max-w-[344px] flex-1">
                                    <Image
                                        src={bookImageSrc}
                                        alt={bookImageAlt}
                                        fill
                                        className="object-contain scale-[1.16]"
                                        sizes="(max-width: 767px) 320px, (max-width: 1023px) 344px, 344px"
                                    />
                                </div>

                                <p
                                    className="mt-2 px-3 text-center text-[24px] font-normal leading-none text-transparent md:px-4 md:text-32px]"
                                    style={{ WebkitTextStroke: '1px #2E7D32' }}
                                >
                                    {bookLabel}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center lg:justify-end">
                        <div className="flex w-full max-w-[560px] flex-col items-center text-center lg:items-end lg:text-right">
                            <GradientTag
                                text={tagText}
                                backgroundColor="white"
                                padding="px-5 py-1.5"
                                className="inline-block"
                            />

                            <GradientTitle
                                part1={titlePart1}
                                part2={titlePart2}
                                part1Color="white"
                                size="custom"
                                customSize="44px"
                                align="right"
                                className="mt-7 font-bold leading-[1.18]"
                                gradientFrom="#FFFFFF"
                                gradientTo="#FFFFFF"
                            />

                            {description ? (
                                <p className="mt-7 max-w-[470px] text-[18px] leading-[35px] text-white">
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
