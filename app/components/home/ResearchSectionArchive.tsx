'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GradientTag from '@/app/components/ui/GradientTag';
import Button from '@/app/components/ui/Button';
import GradientTitle from '@/app/components/ui/GradientTitle';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ResearchCard {
  imageSrc: string;
  imageAlt: string;
  title: string;
  buttonText: string;
  buttonLink: string;
}

export default function ResearchSectionArchive() {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const lastCardIndexRef = useRef(0);
  const leftContentRef = useRef<HTMLDivElement>(null);

  const cards: ResearchCard[] = [
    {
      imageSrc: '/images/section4_world.png',
      imageAlt: 'Earth covered in green foliage representing global research impact',
      title: 'Publications',
      buttonText: 'Read more',
      buttonLink: '#',
    },
    {
      imageSrc: '/images/sec1-img 1.png',
      imageAlt: 'Research projects and initiatives',
      title: 'Research Projects',
      buttonText: 'Read more',
      buttonLink: '#',
    },
    {
      imageSrc: '/images/section4_world.png',
      imageAlt: 'Innovation and development',
      title: 'Innovation',
      buttonText: 'Read more',
      buttonLink: '#',
    },
    {
      imageSrc: '/images/section4_world.png',
      imageAlt: 'Collaborations and partnerships',
      title: 'Collaborations',
      buttonText: 'Read more',
      buttonLink: '#',
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const scrollDistance = (cards.length - 1) * 1200;

    const scrollTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: `+=${scrollDistance}`,
      pin: true,
      scrub: 2,
      anticipatePin: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const cardProgress = progress * cards.length;
        const cardIndex = Math.min(
          Math.max(0, Math.floor(cardProgress)),
          cards.length - 1
        );

        if (cardIndex !== lastCardIndexRef.current) {
          setActiveCardIndex(cardIndex);
          lastCardIndexRef.current = cardIndex;
        }
      },
      onEnter: () => {
        setActiveCardIndex(0);
      },
      onEnterBack: () => {
        setActiveCardIndex(cards.length - 1);
      },
      onLeave: () => {
        setActiveCardIndex(cards.length - 1);
      },
      onLeaveBack: () => {
        setActiveCardIndex(0);
      },
    });

    scrollTriggerRef.current = scrollTrigger;

    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
    };
  }, [cards.length]);

  useEffect(() => {
    if (!sectionRef.current || !leftContentRef.current) return;

    gsap.fromTo(
      leftContentRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 45%',
          once: true,
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden h-auto lg:min-h-screen"
    >
      <div className="relative lg:sticky top-0 w-full min-h-screen px-4 md:px-6 lg:px-8 flex items-center py-10 lg:py-8 xl:py-10">
        <div
          className="relative rounded-[30px] lg:rounded-[100px] overflow-hidden mx-auto w-full h-auto lg:min-h-[calc(100vh-64px)] xl:min-h-[calc(100vh-80px)] bg-[#2E7D3221] p-6 md:p-12 lg:p-16 xl:pt-[115px] xl:pr-[50px] xl:pb-[60px] xl:pl-[240px]"
          style={{
            width: '95%',
            maxWidth: '1824px',
          }}
        >
          <div className="flex flex-col lg:flex-row items-start gap-8 md:gap-12 lg:gap-16 relative h-full">
            <div ref={leftContentRef} className="flex-1 flex flex-col z-20 w-full">
              <div className="mb-4 lg:mb-6">
                <GradientTag
                  text="Our Research"
                  className="inline-block"
                  gradientFrom="#20C997"
                  gradientTo="#A1DF0A"
                  backgroundColor="#FFFFFF"
                  textColor="#2E7D32"
                />
              </div>

              <div className="mb-4 lg:mb-6">
                <GradientTitle
                  part1="Your Gateway to"
                  part2="Research & Innovation"
                  part1Color="dark-green"
                  size="custom"
                  className="font-bold text-[28px] md:text-[40px] lg:text-[50px]"
                  style={{ lineHeight: '130%' }}
                />
              </div>

              <p
                className="max-w-2xl text-[14px] md:text-[16px] lg:text-[18px] leading-[1.5] lg:leading-[35px]"
                style={{
                  fontWeight: 400,
                  color: '#000000',
                }}
              >
                Our researchers are developing advanced planting materials, disease-resistant clones, and modern agronomic techniques to increase field productivity while minimizing environmental impact.
              </p>
            </div>

            <div className="flex-1 flex flex-col z-20 relative w-full" style={{ minHeight: '350px' }}>
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="absolute inset-0 flex flex-col"
                  style={{
                    opacity: index === activeCardIndex ? 1 : 0,
                    transform: index === activeCardIndex
                      ? 'translateY(0)'
                      : index < activeCardIndex
                        ? 'translateY(-20px)'
                        : 'translateY(20px)',
                    transition: 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out',
                    pointerEvents: index === activeCardIndex ? 'auto' : 'none',
                  }}
                >
                  <div className="relative overflow-hidden mb-6 w-full max-w-[500px] aspect-video xl:w-[500px] xl:h-[270px] rounded-[20px] xl:rounded-[30px]">
                    <Image
                      src={card.imageSrc}
                      alt={card.imageAlt}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      quality={90}
                    />
                  </div>

                  <div className="flex flex-col gap-4 items-start">
                    <h3
                      className="text-[#0f422c] text-[18px] lg:text-[20px] font-semibold"
                      style={{
                        lineHeight: '137%',
                      }}
                    >
                      {card.title}
                    </h3>

                    <div>
                      <Link href={card.buttonLink}>
                        <Button variant="outline" size="sm" className="md:!text-base">
                          {card.buttonText}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="absolute -bottom-32 -right-54 z-10 pointer-events-none overflow-hidden hidden lg:block"
              style={{
                width: '500px',
                height: '330px',
              }}
            >
              <Image
                src="/images/section4_hand.png"
                alt="Hand holding plant sprout"
                fill
                className="object-cover"
                quality={90}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
