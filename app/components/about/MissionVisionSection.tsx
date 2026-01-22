import React from 'react';
import Image from 'next/image';

const MissionVisionSection = () => {
    return (
        <section className="relative w-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px] overflow-hidden">
            {/* Background Image (Full width) */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/Aboutussection2bg.jpg"
                    alt="Mission and Vision background"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Grid Container for two columns */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 w-full h-full">
                {/* Left Column: Greenery Image */}
                <div className="relative h-[300px] lg:h-full w-full lg:w-[150%] z-20 overflow-hidden">
                    <Image
                        src="/images/Aboutussection2leftImg.png"
                        alt="Green leaves"
                        fill
                        className="object-cover object-left"
                    />
                </div>

                {/* Right Column: Mission & Vision Content */}
                <div className="relative flex flex-col justify-center px-4 md:px-12 lg:px-24 py-4 lg:py-6 bg-transparent">
                    {/* Decorative SVG Text Graident Definitions */}
                    <svg width="0" height="0" className="absolute">
                        <defs>
                            <linearGradient id="outlineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#20C997" />
                                <stop offset="100%" stopColor="#A1DF0A" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Outline Background Text - Mission (Top Right) */}
                    <div className="absolute top-0 right-4 md:right-8 lg:right-36 select-none opacity-30 pointer-events-none">
                        <svg
                            width="500"
                            height="150"
                            viewBox="0 0 500 150"
                            className="w-[200px] md:w-[300px] lg:w-[450px] h-auto"
                        >
                            <text
                                x="100%"
                                y="50%"
                                textAnchor="end"
                                dominantBaseline="middle"
                                fill="transparent"
                                stroke="url(#outlineGradient)"
                                strokeWidth="1.5"
                                fontSize="100"
                                fontWeight="bold"
                                fontFamily="sans-serif"
                            >
                                Mission
                            </text>
                        </svg>
                    </div>

                    {/* Outline Background Text - Vision (Bottom Right) */}
                    <div className="absolute bottom-2 right-4 md:right-8 lg:right-36 select-none opacity-30 pointer-events-none">
                        <svg
                            width="500"
                            height="150"
                            viewBox="0 0 500 150"
                            className="w-[200px] md:w-[300px] lg:w-[450px] h-auto"
                        >
                            <text
                                x="100%"
                                y="50%"
                                textAnchor="end"
                                dominantBaseline="middle"
                                fill="transparent"
                                stroke="url(#outlineGradient)"
                                strokeWidth="1.5"
                                fontSize="100"
                                fontWeight="bold"
                                fontFamily="sans-serif"
                            >
                                Vision
                            </text>
                        </svg>
                    </div>

                    {/* Right Branch Image (Decorative background for right column) */}
                    <div
                        className="absolute right-[-200px] top-[10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] opacity-20 z-0 pointer-events-none transform rotate-[-90deg] scale-x-[-1]"
                    >
                        <Image
                            src="/images/Aboutussection2rightbranch.png"
                            alt="Branch decoration"
                            fill
                            className="object-contain"
                        />
                    </div>

                    {/* Mission Content */}
                    <div className="relative mb-10 lg:mb-[250px] max-w-xl z-10 mt-[144px]">
                        <h3 className="text-3xl md:text-4xl font-bold text-[#0F3F1D] mb-6">Mission</h3>
                        <p className="text-gray-800 text-lg md:text-[18px] leading-relaxed text-justify">
                            To revitalize the rubber sector by developing economically and environmentally sustainable innovations and transferring the latest technologies to the stakeholders through training and advisory services.
                        </p>
                    </div>

                    {/* Vision Content */}
                    <div className="relative max-w-xl z-10">
                        <h3 className="text-3xl md:text-4xl font-bold text-[#0F3F1D] mb-6">Vision</h3>
                        <p className="text-gray-800 text-lg md:text-[18px] leading-relaxed text-justify mb-[144px]">
                            To emerge as the centre of excellence in providing high quality scientific technologies to the rubber industry.
                        </p>
                    </div>
                </div>
            </div>

            {/* Vertical Center Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#ffffff]/20 z-30 hidden lg:block" />

            {/* Middle Logo - Positioned at the center of the divider */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-[120px] h-[120px] md:w-[180px] md:h-[180px] lg:w-[220px] lg:h-[220px]">
                <Image
                    src="/images/Aboutussection2middlelogo.png"
                    alt="RRISL Logo"
                    fill
                    className="object-contain drop-shadow-2xl"
                />
            </div>
        </section>
    );
};

export default MissionVisionSection;
