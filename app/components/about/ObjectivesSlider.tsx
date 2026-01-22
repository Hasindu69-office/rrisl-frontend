'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import GradientTag from '@/app/components/ui/GradientTag';
import GradientTitle from '@/app/components/ui/GradientTitle';

const slides = [
  {
    id: 1,
    image: '/images/Aboutussection3imgs.jpg',
    title: 'Increase productivity',
    description: 'Increase productivity to potential levels of the crop.',
  },
  {
    id: 2,
    image: '/images/Aboutussection3imgs.jpg',
    title: 'Increase national production',
    description: 'Increase national production of NR to meet the increasing demand.',
  },
  {
    id: 3,
    image: '/images/Aboutussection3imgs.jpg',
    title: 'Optimal utilization',
    description: 'Optimal and sustainable utilization of land, labour and other resources.',
  },
  {
    id: 4,
    image: '/images/Aboutussection3imgs.jpg',
    title: 'Value addition',
    description: 'Maximize domestic value addition and market opportunities for rubber.',
  },
];

export default function ObjectivesSlider() {
  // Use a 3x-duplicated track and start in the middle copy for seamless looping
  const [currentIndex, setCurrentIndex] = useState<number>(slides.length);
  const currentIndexRef = useRef<number>(slides.length);
  const [noTransition, setNoTransition] = useState(false);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      if (w < 640) setSlidesPerView(1);
      else if (w < 768) setSlidesPerView(2);
      else if (w < 1024) setSlidesPerView(3);
      else setSlidesPerView(4);
    };

    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (isHovered) return;

    intervalRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 4000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isHovered]);

  const handlePrev = () => setCurrentIndex((prev) => prev - 1);
  const handleNext = () => setCurrentIndex((prev) => prev + 1);

  // Fixed slide dimensions (px) with responsive fallback
  const BASE_WIDTH = 560; // requested width
  const BASE_HEIGHT = 390; // requested height
  const GAP_PX = 24;
  const [slideWidthPx, setSlideWidthPx] = useState<number>(BASE_WIDTH);
  const [slideHeightPx, setSlideHeightPx] = useState<number>(BASE_HEIGHT);

  // adjust slide size on resize (so it fits smaller screens)
  useEffect(() => {
    const adjust = () => {
      const w = window.innerWidth;
      // ensure it fits on small screens (padding 40)
      const maxAllowed = Math.max(280, w - 48);
      const width = Math.min(BASE_WIDTH, maxAllowed);
      setSlideWidthPx(width);
      // keep aspect ratio
      setSlideHeightPx(Math.round((width * BASE_HEIGHT) / BASE_WIDTH));
    };

    adjust();
    window.addEventListener('resize', adjust);
    return () => window.removeEventListener('resize', adjust);
  }, []);

  // Keep a ref of currentIndex for transition handler
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Duplicate slides for seamless looping
  const extendedSlides = [...slides, ...slides, ...slides];

  // We'll show a transformed track so the selected slide is at left-most position (px)
  const transformPx = currentIndex * (slideWidthPx + GAP_PX);
  const trackWidthPx = extendedSlides.length * (slideWidthPx + GAP_PX) - GAP_PX;
  const visibleWidthPx = slidesPerView * (slideWidthPx + GAP_PX) - GAP_PX;

  return (
    <section className="relative w-full py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Centered Tag & Title */}
        <div className="text-center mb-10">
          <div className="mb-4">
            <GradientTag
              text="Who we are"
              className="inline-block mx-auto"
              backgroundColor="transparent"
              gradientFrom="#20C997"
              gradientTo="#A1DF0A"
            />
          </div>

          <div>
            <GradientTitle
              part1="Our "
              part2="Objectives"
              lineBreak={false}
              part1Color="dark-green"
              size="custom"
              customSize="40px"
              className="font-bold"
              align="center"
            />
          </div>
        </div>

        {/* Slider */}
        <div className="w-full" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <div className="overflow-hidden">
            <div
              ref={trackRef}
              onTransitionEnd={() => {
                // handle seamless wrap: if we've moved into buffer copies, jump to middle copy without animation
                const cur = currentIndexRef.current;
                if (cur >= slides.length * 2) {
                  const target = cur - slides.length;
                  setNoTransition(true);
                  setCurrentIndex(target);
                  // next frame re-enable transitions
                  requestAnimationFrame(() => requestAnimationFrame(() => setNoTransition(false)));
                } else if (cur < slides.length) {
                  const target = cur + slides.length;
                  setNoTransition(true);
                  setCurrentIndex(target);
                  requestAnimationFrame(() => requestAnimationFrame(() => setNoTransition(false)));
                }
              }}
              className="flex items-stretch"
              style={{
                width: `${trackWidthPx}px`,
                transform: `translateX(-${transformPx}px)`,
                gap: `${GAP_PX}px`,
                transition: noTransition ? 'none' : 'transform 700ms ease-in-out',
              }}
            >
              {extendedSlides.map((s, idx) => (
                <div
                  key={`slide-${idx}-${s.id}`}
                  className="flex-shrink-0"
                  style={{ width: `${slideWidthPx}px` }}
                >
                  <div className="relative w-full rounded-xl overflow-hidden shadow-lg" style={{ height: `${slideHeightPx}px` }}>
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      className="object-cover"
                      quality={85}
                      priority={false}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F3F1D]/80 to-transparent flex items-end">
                      <div className="p-6 text-white">
                        <h4 className="font-semibold text-[16px] md:text-[18px] mb-2">{s.title}</h4>
                        <p className="text-[13px] md:text-[15px] max-w-[420px]">{s.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls & Dots - Centered */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              aria-label="Previous"
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow hover:opacity-95"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="#0F3F1D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="flex gap-3">
              {slides.map((_, i) => {
                const logicalCurrent = ((currentIndex % slides.length) + slides.length) % slides.length;
                return (
                  <button
                    key={`dot-${i}`}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setCurrentIndex(slides.length + i)}
                    className={`w-2 h-2 rounded-full ${i === logicalCurrent ? 'bg-[#20C997]' : 'bg-[#D1D5DB]'}`}
                  />
                );
              })}
            </div>

            <button
              aria-label="Next"
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow hover:opacity-95"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="#0F3F1D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile short description under slider */}
        <div className="md:hidden mt-6 text-center">
          <p className="text-gray-700">The Rubber Research Institute pursues objectives that strengthen production, ensure sustainability and increase value across the rubber value chain.</p>
        </div>
      </div>
    </section>
  );
}
