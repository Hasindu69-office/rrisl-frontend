'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GradientTag from '@/app/components/ui/GradientTag';
import Button from '@/app/components/ui/Button';
import GradientTitle from '@/app/components/ui/GradientTitle';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Research Section Component
 * Features a light green rounded container with research content on left
 * and images (world and hand) on the right side
 * Right side cards change on scroll while left side remains sticky
 */

interface ResearchCard {
  imageSrc: string;
  imageAlt: string;
  title: string;
  buttonText: string;
  buttonLink: string;
}

export default function ResearchSection() {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const lastCardIndexRef = useRef(0);
  const leftContentRef = useRef<HTMLDivElement>(null);

  // Define 4 cards with different content
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

  // Setup GSAP ScrollTrigger
  useEffect(() => {
      if (!sectionRef.current) return;

    // Calculate scroll distance based on number of cards
    // Each card transition should take about 1200px of scroll
    // Increased distance ensures users see each card properly
    const scrollDistance = (cards.length - 1) * 1200;

    // Create ScrollTrigger to pin section and track progress
    const scrollTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: `+=${scrollDistance}`,
      pin: true,
      scrub: 2, // Higher scrub value = more smoothing/lag, slower card transitions
      anticipatePin: 1, // Better pinning behavior for smoother transitions
      onUpdate: (self) => {
        // Calculate which card should be active based on scroll progress
        const progress = self.progress;
        
        // Calculate card index - each card gets equal scroll distance
        // The higher scrub value (2) already adds smoothing/lag
        // This calculation ensures smooth transitions between cards
        const cardProgress = progress * cards.length;
        const cardIndex = Math.min(
          Math.max(0, Math.floor(cardProgress)),
          cards.length - 1
        );
        
        // Only update if card actually changed to prevent unnecessary re-renders
        if (cardIndex !== lastCardIndexRef.current) {
          setActiveCardIndex(cardIndex);
          lastCardIndexRef.current = cardIndex;
        }
      },
      onEnter: () => {
        // When entering from above (scrolling down), start at first card
        setActiveCardIndex(0);
      },
      onEnterBack: () => {
        // When entering from below (scrolling up), start at last card
        setActiveCardIndex(cards.length - 1);
      },
      onLeave: () => {
        // When leaving section by scrolling down past last card
        // Ensure we're on the last card for smooth transition
        setActiveCardIndex(cards.length - 1);
      },
      onLeaveBack: () => {
        // When leaving section by scrolling up past first card
        // Ensure we're on the first card for smooth transition
        setActiveCardIndex(0);
      },
    });

    // Store reference for cleanup
    scrollTriggerRef.current = scrollTrigger;

    return () => {
      // Cleanup ScrollTrigger
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
    };
  }, [cards.length]);

  // Fade-in animation for left content when section first enters view
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
      className="relative w-full overflow-hidden"
      style={{ height: '100vh' }}
    >
      <div className="sticky top-0 w-full h-screen px-4 md:px-6 lg:px-8 flex items-center">
        {/* Light Green Rounded Container */}
        <div 
          className="relative rounded-[100px] overflow-hidden mx-auto w-full"
          style={{
            width: '95%',
            maxWidth: '1824px',
            height: '720px',
            backgroundColor: '#2E7D3221', // Light green background
            padding: '115px 50px 60px 240px',
          }}
        >
          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16 relative h-full">
            {/* Left Side - Content (Sticky, fades in on scroll) */}
            <div ref={leftContentRef} className="flex-1 flex flex-col z-20">
              {/* Our Research Tag */}
              <div className="mb-6">
                <GradientTag 
                  text="Our Research"
                  className="inline-block"
                  gradientFrom="#20C997"
                  gradientTo="#A1DF0A"
                  backgroundColor="#FFFFFF"
                  textColor="#2E7D32"
                />
              </div>

              {/* Main Heading */}
              <div className="mb-6">
                <GradientTitle
                  part1="Your Gateway to"
                  part2="Research & Innovation"
                  part1Color="dark-green"
                  size="custom"
                  customSize="50px"
                  className="font-bold"
                  style={{ lineHeight: '130%' }}
                />
              </div>

              {/* Description */}
              <p 
                className="max-w-2xl"
                style={{
                  fontSize: '18px',
                  fontWeight: 400,
                  lineHeight: '35px',
                  color: '#000000',
                }}
              >
                Our researchers are developing advanced planting materials, disease-resistant clones, and modern agronomic techniques to increase field productivity while minimizing environmental impact.
              </p>
            </div>

            {/* Right Side - Cards Container */}
            <div className="flex-1 flex flex-col z-20 relative" style={{ minHeight: '400px' }}>
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
                  {/* Earth Image */}
                  <div 
                    className="relative overflow-hidden mb-6"
                    style={{
                      width: '500px',
                      height: '270px',
                      borderRadius: '30px',
                    }}
                  >
                    <Image
                      src={card.imageSrc}
                      alt={card.imageAlt}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      quality={90}
                    />
                  </div>

                  {/* Publications and Read more - Positioned at bottom left */}
                  <div className="flex flex-col gap-4 items-start">
                    {/* Publications Heading */}
                    <h3 
                      className="text-[#0f422c]"
                      style={{
                        fontSize: '20px',
                        lineHeight: '137%',
                        fontWeight: 600,
                      }}
                    >
                      {card.title}
                    </h3>

                    {/* Read more Button */}
                    <div>
                      <Link href={card.buttonLink}>
                        <Button variant="outline" size="md">
                          {card.buttonText}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Right - Hand Holding Plant Illustration */}
            <div 
              className="absolute -bottom-32 -right-54 z-10 pointer-events-none overflow-hidden"
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

