import React from 'react';
import Image from 'next/image';

const MissionVisionSection = () => {
    return (
        <section className="relative isolate w-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px] overflow-visible pt-[60px] md:pt-[110px] lg:pt-[150px] -mt-[60px] md:-mt-[110px] lg:-mt-[150px]">
            {/* Decorative Branch Separator */}
            <div className="absolute -top-16 left-0 right-0 h-[120px] md:h-[220px] lg:h-[500px] z-[120] pointer-events-none">
                <Image
                    src="/images/aboutUsBranch.png"
                    alt="Decorative Branch separator"
                    fill
                    className="object-cover object-center"
                    priority
                />
            </div>

            {/* Content Wrapper with Overflow Hidden (to clip branches leaking horizontally) */}
            <div className="relative w-full h-full overflow-hidden z-0">
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
                    {/* Left Column: Greenery Image - Hidden on mobile/tablet */}
                    <div className="relative h-full w-full lg:w-full z-20 overflow-hidden hidden lg:block">
                        <Image
                            src="/images/aboutusRubber.jpg"
                            alt="Rubber extraction"
                            fill
                            className="object-cover object-center"
                        />
                    </div>

                    {/* Right Column: Mission & Vision Content */}
                    <div className="relative flex flex-col justify-center px-6 md:px-16 lg:px-24 py-12 lg:py-12 bg-transparent">
                        {/* Decorative SVG Text Graident Definitions */}
                        <svg width="0" height="0" className="absolute">
                            <defs>
                                <linearGradient id="outlineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#20C997" />
                                    <stop offset="100%" stopColor="#A1DF0A" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Outline Background Text - Mission (Bottom of Mission section) */}
                        <div className="absolute top-[35%] md:top-[40%] lg:top-[45%] right-4 md:right-8 lg:right-36 select-none opacity-20 lg:opacity-30 pointer-events-none">
                            <svg
                                width="500"
                                height="150"
                                viewBox="0 0 500 150"
                                className="w-[150px] md:w-[250px] lg:w-[450px] h-auto"
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
                        <div className="absolute bottom-2 right-4 md:right-8 lg:right-52 select-none opacity-20 lg:opacity-30 pointer-events-none">
                            <svg
                                width="500"
                                height="150"
                                viewBox="0 0 500 150"
                                className="w-[150px] md:w-[250px] lg:w-[450px] h-auto"
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
                        <div className="relative mb-12 md:mb-20 lg:mb-[250px] max-w-xl z-10 mt-8 md:mt-16 lg:mt-[144px]">
                            <h3 className="text-3xl md:text-4xl font-bold text-[#0F3F1D] mb-4 md:mb-6">Mission</h3>
                            <p className="text-gray-800 text-base md:text-lg lg:text-[18px] leading-relaxed text-justify">
                                To revitalize the rubber sector by developing economically and environmentally sustainable innovations and transferring the latest technologies to the stakeholders through training and advisory services.
                            </p>
                        </div>

                        {/* Vision Content */}
                        <div className="relative max-w-xl z-10">
                            <h3 className="text-3xl md:text-4xl font-bold text-[#0F3F1D] mb-4 md:mb-6">Vision</h3>
                            <p className="text-gray-800 text-base md:text-lg lg:text-[18px] leading-relaxed text-justify mb-12 md:mb-24 lg:mb-[144px]">
                                To emerge as the centre of excellence in providing high quality scientific technologies to the rubber industry.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Vertical Center Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#ffffff]/20 z-30 hidden lg:block" />

                {/* Mobile Logo Visibility Optimization: We show it in the flow or as a smaller indicator if needed */}
                <div className="absolute right-4 top-4 z-40 w-[60px] h-[60px] lg:hidden opacity-80">
                    <Image
                        src="/images/Aboutussection2middlelogo.png"
                        alt="RRISL Logo Mobile"
                        fill
                        className="object-contain"
                    />
                </div>
            </div>
        </section>
    );
};

export default MissionVisionSection;
