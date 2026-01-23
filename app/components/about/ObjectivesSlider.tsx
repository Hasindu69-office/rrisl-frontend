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
  const [current, setCurrent] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const [isHovered, setIsHovered] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  // Prevent starting another animation while one is running (avoids jank)
  const isTransitioningRef = useRef(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Continuous animation refs used for manual animations (no autoplay)
  const offsetRef = useRef(0); // current scroll offset in px
  const animFrameRef = useRef<number | null>(null);

  // Fixed slide dimensions (px) with responsive fallback
  const BASE_WIDTH = 400; // requested width
  const BASE_HEIGHT = 390; // requested height
  const GAP_PX = 24;
  const [slideWidthPx, setSlideWidthPx] = useState<number>(BASE_WIDTH);
  const [slideHeightPx, setSlideHeightPx] = useState<number>(BASE_HEIGHT);

  // helpers for controlled animation (prev/next/dots)
  const setTrackTransform = (value: number, step: number) => {
    const originalWidth = slides.length * step - GAP_PX;
    const display = ((value % originalWidth) + originalWidth) % originalWidth;
    if (trackRef.current) trackRef.current.style.transform = `translateX(-${display}px)`;
  };

  const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

  const animateTo = (targetAbsolute: number, duration = 400) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setIsTransitioning(true);

    const step = slideWidthPx + GAP_PX;
    const originalWidth = slides.length * step - GAP_PX;
    const start = offsetRef.current;
    const delta = targetAbsolute - start;
    let startTime: number | null = null;

    const frame = (ts: number) => {
      if (startTime === null) startTime = ts;
      const p = Math.min(1, (ts - startTime) / duration);
      const eased = easeInOutQuad(p);
      const current = start + delta * eased;
      setTrackTransform(current, step);
      if (p < 1) {
        animFrameRef.current = window.requestAnimationFrame(frame);
      } else {
        offsetRef.current = ((targetAbsolute % originalWidth) + originalWidth) % originalWidth;
        setTrackTransform(offsetRef.current, step);
        // update current slide index to match new offset
        const newIndex = Math.floor((offsetRef.current % originalWidth) / step) % slides.length;
        setCurrent(newIndex);
        isTransitioningRef.current = false;
        setIsTransitioning(false);
        // cleanup any running frame reference
        if (animFrameRef.current) {
          window.cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }
      }
    };

    animFrameRef.current = window.requestAnimationFrame(frame);
  };

  const handleNext = () => animateTo(offsetRef.current + (slideWidthPx + GAP_PX), 400);
  const handlePrev = () => animateTo(offsetRef.current - (slideWidthPx + GAP_PX), 400);

  const goToIndex = (i: number) => {
    if (isTransitioningRef.current) return;
    const step = slideWidthPx + GAP_PX;
    const originalWidth = slides.length * step - GAP_PX;
    const currentMod = ((offsetRef.current % originalWidth) + originalWidth) % originalWidth;
    const targetSingle = i * step;
    let diff = ((targetSingle - currentMod + originalWidth) % originalWidth);
    if (diff > originalWidth / 2) diff -= originalWidth; // choose shortest path
    animateTo(offsetRef.current + diff, 500);
  };

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



  // ensure track transform consistent when slide width changes
  useEffect(() => {
    const step = slideWidthPx + GAP_PX;
    const originalWidth = slides.length * step - GAP_PX;
    if (trackRef.current) {
      const display = ((offsetRef.current % originalWidth) + originalWidth) % originalWidth;
      trackRef.current.style.transform = `translateX(-${display}px)`;
    }

    // cleanup on unmount - cancel any active animation frame
    return () => {
      if (animFrameRef.current) {
        window.cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [slideWidthPx]);


  // slide dimension state declared above (moved earlier)
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

  // Use duplicated slides for continuous scrolling
  const duplicatedSlides = [...slides, ...slides];
  const step = slideWidthPx + GAP_PX;
  const originalWidth = slides.length * step - GAP_PX;
  const trackWidthPx = duplicatedSlides.length * step - GAP_PX;
  const visibleWidthPx = slidesPerView * step - GAP_PX;

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
        <div className="w-full">
          <div className="overflow-hidden" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <div
              ref={trackRef}
              className={`flex items-stretch will-change-transform`}
              style={{
                width: `${trackWidthPx}px`,
                transform: `translateX(-0px)`,
                gap: `${GAP_PX}px`,
              }}
            >
              {duplicatedSlides.map((s, idx) => (
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
              disabled={isTransitioning}
              className={`w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow hover:opacity-95 ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="#0F3F1D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="flex gap-3">
              {slides.map((_, i) => (
                <button
                  key={`dot-${i}`}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => goToIndex(i)}
                  disabled={isTransitioning}
                  className={`w-2 h-2 rounded-full ${i === (((current % slides.length) + slides.length) % slides.length) ? 'bg-[#20C997]' : 'bg-[#D1D5DB]'} ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              ))}
            </div>

            <button
              aria-label="Next"
              onClick={handleNext}
              disabled={isTransitioning}
              className={`w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow hover:opacity-95 ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="#0F3F1D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
