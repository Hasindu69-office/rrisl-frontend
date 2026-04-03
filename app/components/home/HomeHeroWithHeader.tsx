'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { GlobalLayout, Hero, HeroAnnouncementItem, MenuItem, StrapiImage } from '@/app/lib/types';
import { addLocaleToUrl } from '@/app/lib/locale';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';
import {
  extractTextFromBlocks,
  getHeroDesktopImage,
  getHeroMobileImage,
} from '@/app/lib/home/hero';
import Button from '../ui/Button';
import LogoSection from '../header/LogoSection';
import Navigation from '../header/Navigation';
import HeaderActions from '../header/HeaderActions';
import HeroStatistics from './HeroStatistics';
import AnnouncementSlider from './AnnouncementSlider';

interface HomeHeroWithHeaderProps {
  heroes: Hero[];
  globalLayout: GlobalLayout | null;
  leftMenuItems: MenuItem[];
  rightMenuItems: MenuItem[];
  announcements?: HeroAnnouncementItem[];
  announcementLabel?: string;
}

const avatarFallbacks = ['/images/avatarimg1.png', '/images/avatarimg2.png'];

export default function HomeHeroWithHeader({
  heroes,
  globalLayout,
  leftMenuItems,
  rightMenuItems,
  announcements = [],
  announcementLabel,
}: HomeHeroWithHeaderProps) {
  const searchParams = useSearchParams();
  const currentLocale = searchParams.get('locale') || 'en';
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const totalSlides = heroes.length;
  const currentHero = heroes[currentSlide] || heroes[0];

  useEffect(() => {
    if (totalSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 9000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const descriptionText = extractTextFromBlocks(currentHero?.description || []);
  const cta = currentHero?.primaryCta;
  const labelText = currentHero?.labels?.text || '';
  const badgeTitle = currentHero?.badges?.title || '';
  const badgeSubtitle = currentHero?.badges?.subtitle || '';
  const avatars = currentHero?.badges?.avatars || [];

  const desktopBgUrl = currentHero ? getHeroDesktopImage(currentHero, currentSlide) : null;
  const mobileBgUrl = currentHero ? getHeroMobileImage(currentHero, currentSlide) : null;
  const isLocalhost = desktopBgUrl?.includes('localhost') || mobileBgUrl?.includes('localhost') || false;

  const getLocalizedUrl = (url: string) => {
    if (url.startsWith('http') || url.startsWith('//')) {
      return url;
    }
    return addLocaleToUrl(url, currentLocale);
  };

  const getAvatarUrl = (avatar: StrapiImage, index: number): string | null => {
    const strapiUrl = getOptimizedImageUrl(avatar, 'thumbnail') || getStrapiImageUrl(avatar);
    if (strapiUrl) return strapiUrl;
    return avatarFallbacks[index % avatarFallbacks.length] || null;
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (!currentHero) {
    return null;
  }

  return (
    <section className="relative md:min-h-screen flex flex-col overflow-x-clip">
      {totalSlides > 0 && (
        <div className="absolute top-0 left-0 w-full h-[75%] lg:w-full lg:h-full z-0">
          <div className="hidden lg:block absolute top-0 left-0 w-full h-full">
            {heroes.map((hero, index) => {
              const imageUrl = getHeroDesktopImage(hero, index);
              if (!imageUrl) return null;

              return (
                <div
                  key={hero.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <Image
                    src={imageUrl}
                    alt={hero.title || `Hero Background ${index + 1}`}
                    fill
                    className="object-cover object-top"
                    priority={index === 0}
                    unoptimized={imageUrl.includes('localhost')}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>
              );
            })}
          </div>

          <div className="hidden md:block lg:hidden absolute top-0 left-0 w-full z-0" style={{ height: '85%', minHeight: '600px' }}>
            {heroes.map((hero, index) => {
              const imageUrl = getHeroDesktopImage(hero, index);
              if (!imageUrl) return null;

              return (
                <div
                  key={hero.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <Image
                    src={imageUrl}
                    alt={hero.title || `Hero Background ${index + 1}`}
                    fill
                    className="object-cover object-top"
                    priority={index === 0}
                    unoptimized={imageUrl.includes('localhost')}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>
              );
            })}
          </div>

          <div className="block md:hidden absolute top-0 left-0 w-full z-0" style={{ height: '80%', minHeight: '500px' }}>
            {heroes.map((hero, index) => {
              const imageUrl = getHeroMobileImage(hero, index);
              if (!imageUrl) return null;

              return (
                <div
                  key={hero.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <Image
                    src={imageUrl}
                    alt={hero.title || `Hero Background ${index + 1}`}
                    fill
                    className="object-cover object-top"
                    priority={index === 0}
                    unoptimized={imageUrl.includes('localhost')}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>
              );
            })}
          </div>

          {totalSlides > 1 && (
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-30 flex flex-col gap-2">
              {heroes.map((hero, index) => (
                <button
                  key={hero.id}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-white h-8' : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="relative z-50 bg-transparent">
        <div className="relative z-10">
          <div className="container mx-auto px-3 sm:px-4 md:px-5 lg:px-8 py-2 sm:py-3 md:py-3 max-w-[1440px] w-full">
            <div className="flex items-center justify-between">
              <LogoSection globalLayout={globalLayout} />
              <HeaderActions menuItems={rightMenuItems} leftMenuItems={leftMenuItems} />
            </div>
          </div>

          <div className="hidden md:block container mx-auto px-3 sm:px-4 md:px-5 lg:px-8 pb-2 sm:pb-3 md:pb-3 max-w-[1440px] w-full">
            <div className="flex items-center justify-between">
              <Navigation menuItems={leftMenuItems} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-start relative z-10 mt-6 md:mt-8 lg:mt-[120px]">
        <div className="container mx-auto px-4 pt-4 md:pt-6 pb-8 md:pb-12 w-full max-w-[1440px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
            <div className="text-white space-y-4 md:space-y-6 z-10 relative">
              {currentHero.badges && (
                <div className="lg:hidden absolute bottom-12 right-0 md:top-0 md:bottom-auto md:right-12 bg-white/10 backdrop-blur-md rounded-[20px] md:rounded-[25px] p-3 md:p-3.5 border border-white/20 z-20 shadow-lg floating-badge flex flex-col items-center gap-2 md:gap-3 w-[calc(100%-1rem)] md:w-[150px] max-w-[calc(40%-1rem)] md:max-w-[280px] h-auto min-h-[60px] md:min-h-[60px]">
                  <div className="flex items-center justify-center -space-x-2 md:-space-x-3">
                    {avatars.slice(0, 2).map((avatar, index) => {
                      const avatarUrl = getAvatarUrl(avatar, index);
                      return avatarUrl ? (
                        <div
                          key={avatar.id || index}
                          className="w-10 h-10 md:w-11 md:h-11 rounded-full overflow-hidden shadow-lg relative"
                          style={{ zIndex: index + 1 }}
                        >
                          <Image
                            src={avatarUrl}
                            alt={`Avatar ${index + 1}`}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                            unoptimized={isLocalhost}
                          />
                          {index === 0 && (
                            <div className="absolute -bottom-0.5 -right-0.5 md:-bottom-1 md:-right-1 w-4 h-4 md:w-5 md:h-5 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center z-20">
                              <span className="text-white text-[8px] md:text-[10px]">*</span>
                            </div>
                          )}
                        </div>
                      ) : null;
                    })}
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#2E7D32] flex items-center justify-center text-white text-lg md:text-xl font-bold shadow-lg relative z-10">
                      +
                    </div>
                  </div>

                  <div className="text-white text-center w-full">
                    <div className="text-[12px] md:text-[14px] font-normal text-[#FFFFFF] leading-tight">{badgeTitle}</div>
                    <div className="text-[12px] md:text-[14px] font-normal text-[#FFFFFF] leading-tight">{badgeSubtitle}</div>
                  </div>
                </div>
              )}

              <h1 className="text-[28px] md:text-[40px] lg:text-[60px] font-semibold text-white" style={{ lineHeight: '128%' }}>
                <div className="block">
                  {currentHero.title}
                </div>
                <div className="block bg-gradient-to-r from-[#20C997] to-[#A1DF0A] bg-clip-text text-transparent">
                  {currentHero.highlightedText}
                </div>
              </h1>

              {descriptionText && (
                <p className="text-[14px] md:text-[16px] lg:text-[18px] font-normal text-[#FFFFFF] max-w-2xl" style={{ lineHeight: '1.5' }}>
                  {descriptionText}
                </p>
              )}

              {cta && (
                <div className="pt-2 md:pt-4">
                  {cta.linkType === 'internal' ? (
                    <Link href={getLocalizedUrl(cta.url)}>
                      <Button
                        variant="primary"
                        size="sm"
                        className="!w-[150px] !h-[48px] md:!w-[178px] md:!h-[56px] !rounded-[30px] !bg-[#2E7D32] hover:!bg-[#2E7D32]/90 !text-sm md:!text-base"
                      >
                        {cta.label}
                      </Button>
                    </Link>
                  ) : (
                    <a
                      href={cta.url}
                      target={cta.openInNewTab ? '_blank' : '_self'}
                      rel={cta.openInNewTab ? 'noopener noreferrer' : undefined}
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        className="!w-[150px] !h-[48px] md:!w-[178px] md:!h-[56px] !rounded-[30px] !bg-[#2E7D32] hover:!bg-[#2E7D32]/90 !text-sm md:!text-base"
                      >
                        {cta.label}
                      </Button>
                    </a>
                  )}
                </div>
              )}

              <div className="pt-8 md:pt-12 lg:pt-[86px]">
                <HeroStatistics />
              </div>
            </div>

            <div className="relative flex items-start justify-center lg:justify-end h-auto lg:min-h-[600px]">
              <div className="relative w-full max-w-lg aspect-square mt-[-100px] max-[1028px]:mt-[-80px] max-[825px]:mt-[-50px] max-[780px]:mt-[-50px] max-[550px]:mt-[-210px] max-[480px]:mt-[-100px] max-[400px]:mt-[-60px] max-[345px]:mt-[-40px]">
                {currentHero.badges && (
                  <div className="hidden lg:flex absolute -top-4 -left-12 bg-white/10 backdrop-blur-md rounded-[30px] p-4 border border-white/20 z-20 shadow-lg items-center gap-6 w-[318px] h-[105px] floating-badge">
                    <div className="flex items-center -space-x-3">
                      {avatars.slice(0, 2).map((avatar, index) => {
                        const avatarUrl = getAvatarUrl(avatar, index);
                        return avatarUrl ? (
                          <div
                            key={avatar.id || index}
                            className="w-12 h-12 rounded-full overflow-hidden shadow-lg relative"
                            style={{ zIndex: index + 1 }}
                          >
                            <Image
                              src={avatarUrl}
                              alt={`Avatar ${index + 1}`}
                              width={48}
                              height={48}
                              className="object-cover"
                              unoptimized={isLocalhost}
                            />
                            {index === 0 && (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center z-20">
                                <span className="text-white text-[10px]">*</span>
                              </div>
                            )}
                          </div>
                        ) : null;
                      })}
                      <div className="w-12 h-12 rounded-full bg-[#2E7D32] flex items-center justify-center text-white text-xl font-bold shadow-lg relative z-10">
                        +
                      </div>
                    </div>

                    <div className="text-white">
                      <div className="text-[18px] font-normal text-[#FFFFFF]" style={{ lineHeight: '30px' }}>{badgeTitle}</div>
                      <div className="text-[18px] font-normal text-[#FFFFFF]" style={{ lineHeight: '30px' }}>{badgeSubtitle}</div>
                    </div>
                  </div>
                )}

                {labelText && (
                  <div className="hidden md:block absolute bottom-12 left-38 sm:bottom-8 sm:left-8 md:bottom-110 md:left-100 lg:bottom-12 lg:left-0 z-20">
                    <style jsx>{`
                      @keyframes circleFadeIn {
                        0% { opacity: 0; transform: scale(0.5); }
                        100% { opacity: 1; transform: scale(1); }
                      }
                      @keyframes ripplePulse {
                        0% { transform: scale(1); opacity: 0.6; }
                        50% { transform: scale(1.4); opacity: 0.3; }
                        100% { transform: scale(1.8); opacity: 0; }
                      }
                      @keyframes drawVerticalLine {
                        0% { stroke-dashoffset: 120; }
                        100% { stroke-dashoffset: 0; }
                      }
                      @keyframes drawHorizontalLine {
                        0% { stroke-dashoffset: 100; }
                        100% { stroke-dashoffset: 0; }
                      }
                      @keyframes labelFadeIn {
                        0% { opacity: 0; transform: translateX(-10px); }
                        100% { opacity: 1; transform: translateX(0); }
                      }
                      .circle-inner { opacity: 0; }
                      .circle-outer { opacity: 0; }
                      .circle-ripple { opacity: 0; }
                      .vertical-line {
                        stroke-dasharray: 120;
                        stroke-dashoffset: 120;
                      }
                      .horizontal-line {
                        stroke-dasharray: 100;
                        stroke-dashoffset: 100;
                      }
                      .label-text { opacity: 0; }
                      .animate .circle-inner {
                        animation: circleFadeIn 0.5s ease-out forwards;
                      }
                      .animate .circle-outer {
                        animation: circleFadeIn 0.5s ease-out forwards;
                      }
                      .animate .circle-ripple {
                        animation: circleFadeIn 0.3s ease-out 0.3s forwards,
                                   ripplePulse 1.5s ease-out 0.6s infinite;
                      }
                      .animate .vertical-line {
                        animation: drawVerticalLine 0.5s ease-out 0.8s forwards;
                      }
                      .animate .horizontal-line {
                        animation: drawHorizontalLine 0.4s ease-out 1.3s forwards;
                      }
                      .animate .label-text {
                        animation: labelFadeIn 0.4s ease-out 1.7s forwards;
                      }
                    `}</style>

                    <div key={currentSlide} className="animate">
                      <div className={`absolute right-4 z-10 ${isMobile ? 'bottom-48' : 'bottom-31'}`}>
                        <span className="label-text text-white text-sm font-medium whitespace-nowrap">{labelText}</span>
                      </div>

                      <svg
                        className={`absolute left-full pointer-events-none ${isMobile ? '-top-80' : '-top-64'}`}
                        style={{ width: '300px', height: '120px' }}
                        viewBox="0 -150 200 150"
                        preserveAspectRatio="none"
                      >
                        <line
                          className="vertical-line"
                          x1="100"
                          y1={isMobile ? '-40' : '-120'}
                          x2="100"
                          y2="0"
                          stroke="white"
                          strokeWidth="1"
                        />
                        <line
                          className="horizontal-line"
                          x1="100"
                          y1="0"
                          x2="0"
                          y2="0"
                          stroke="white"
                          strokeWidth="2"
                        />
                      </svg>

                      <div
                        className="absolute pointer-events-none flex items-center justify-center"
                        style={{
                          left: '150px',
                          top: '-235px',
                          width: '80px',
                          height: '80px',
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        <div className="circle-ripple absolute w-20 h-20 rounded-full bg-gray-300/20" />
                        <div className="circle-outer absolute w-16 h-16 rounded-full bg-gray-300/30" />
                        <div className="circle-inner absolute w-6 h-6 rounded-full bg-gray-300" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute z-20 pointer-events-none bottom-[30%] right-0 md:bottom-[32%] md:right-0 lg:-bottom-2 lg:translate-y-0 lg:-right-4 w-[300px] md:w-[650px] lg:w-[575px] xl:w-[1064px] lg:h-[80px] xl:h-[150px]">
        <svg
          width="100%"
          className="h-[80px] md:h-[120px] lg:h-[110px] xl:h-[151px]"
          viewBox="0 0 1077 151"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMinYMin meet"
        >
          <g clipPath="url(#clip0_251_42)">
            <path
              d="M0 151.831C5.29879 151.288 10.641 150.204 15.9181 150.312C32.8785 150.681 45.8866 143.631 55.1812 129.834C73.9441 101.98 92.2076 73.8003 111.144 46.0763C115.661 39.4599 119.874 32.5615 124.5 26.0101C136.009 9.67516 154.816 0 174.817 0H1077V154C1071.64 154 1066.01 154 1060.41 154"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_251_42">
              <rect width="1077" height="184" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>

      {announcements && announcements.length > 0 && (
        <div className="absolute bottom-36 md:bottom-0 lg:-bottom-64 xl:-bottom-64 right-0 md:right-0 z-30 pointer-events-auto pr-0 md:pr-8 lg:pr-8 left-[20px] xl:left-auto" style={{ overflow: 'visible' }}>
          <div className="flex justify-start md:justify-end lg:justify-end" style={{ overflow: 'visible', maxWidth: '100%' }}>
            <AnnouncementSlider announcements={announcements} label={announcementLabel} />
          </div>
        </div>
      )}
    </section>
  );
}
