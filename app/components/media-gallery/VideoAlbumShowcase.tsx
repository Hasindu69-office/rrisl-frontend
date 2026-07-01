'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Film,
  Play,
  PlayCircle,
  X,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GradientTag from '@/app/components/ui/GradientTag';
import GradientTitle from '@/app/components/ui/GradientTitle';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';
import type {
  VideoGalleryAlbumViewModel,
  VideoGalleryItemViewModel,
} from '@/app/lib/video-gallery/pageData';

gsap.registerPlugin(ScrollTrigger);

interface VideoAlbumShowcaseProps {
  album: VideoGalleryAlbumViewModel;
}

function VideoCard({
  video,
  onOpen,
}: {
  video: VideoGalleryItemViewModel;
  onOpen: () => void;
}) {
  const useUnoptimizedImage = isLocalhostAssetUrl(video.thumbnailSrc);

  return (
    <button
      type="button"
      onClick={onOpen}
      data-video-gallery-reveal
      className="group relative block w-full cursor-pointer overflow-hidden rounded-[26px] bg-[#DDE6DD] text-left shadow-[0_18px_50px_rgba(15,63,29,0.08)] outline-none transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(15,63,29,0.16)] focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-4"
      aria-label={`Play ${video.title}`}
    >
      <div className="relative aspect-video">
        <Image
          src={video.thumbnailSrc}
          alt={video.thumbnailAlt}
          fill
          className="object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]"
          unoptimized={useUnoptimizedImage}
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,32,18,0.08)_0%,rgba(4,32,18,0.18)_42%,rgba(4,32,18,0.9)_100%)]" />

        <div className="absolute left-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#0F3F1D] shadow-[0_10px_24px_rgba(4,32,18,0.16)] backdrop-blur transition duration-300 group-hover:scale-105 group-hover:bg-[#A1DF0A]">
          <Play className="ml-0.5 h-4 w-4 fill-current" strokeWidth={2.2} aria-hidden="true" />
        </div>

        {video.duration && (
          <div className="absolute right-4 top-4 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {video.duration}
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          <h3 className="text-[17px] font-semibold leading-6 text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.34)] md:text-[19px]">
            {video.title}
          </h3>
          {video.description && (
            <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-white/78 md:text-[14px]">
              {video.description}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

function VideoPlayer({ video }: { video: VideoGalleryItemViewModel }) {
  if (video.sourceType === 'youtube') {
    return (
      <iframe
        src={`${video.src}${video.src.includes('?') ? '&' : '?'}autoplay=1&rel=0`}
        title={video.title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <video
      key={video.src}
      src={video.src}
      className="h-full w-full bg-black"
      controls
      autoPlay
      playsInline
    >
      <track kind="captions" />
    </video>
  );
}

export default function VideoAlbumShowcase({
  album,
}: VideoAlbumShowcaseProps) {
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);
  const [isLightboxVisible, setIsLightboxVisible] = useState(false);
  const [isClosingLightbox, setIsClosingLightbox] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const featuredVideos = album.videos.slice(0, 3);
  const activeVideo = useMemo(
    () =>
      activeVideoIndex === null
        ? null
        : album.videos[activeVideoIndex] ?? null,
    [activeVideoIndex, album.videos]
  );

  const closeLightbox = () => {
    setIsClosingLightbox(true);
    setIsLightboxVisible(false);
  };

  const openLightbox = (index: number) => {
    setActiveVideoIndex(index);
    setIsClosingLightbox(false);
    window.requestAnimationFrame(() => {
      setIsLightboxVisible(true);
    });
  };

  const showPreviousVideo = () => {
    setActiveVideoIndex((currentIndex) => {
      if (currentIndex === null || album.videos.length === 0) {
        return currentIndex;
      }

      return (currentIndex - 1 + album.videos.length) % album.videos.length;
    });
  };

  const showNextVideo = () => {
    setActiveVideoIndex((currentIndex) => {
      if (currentIndex === null || album.videos.length === 0) {
        return currentIndex;
      }

      return (currentIndex + 1) % album.videos.length;
    });
  };

  useEffect(() => {
    if (activeVideoIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsClosingLightbox(true);
        setIsLightboxVisible(false);
      }

      if (event.key === 'ArrowLeft') {
        setActiveVideoIndex((currentIndex) => {
          if (currentIndex === null || album.videos.length === 0) {
            return currentIndex;
          }

          return (currentIndex - 1 + album.videos.length) % album.videos.length;
        });
      }

      if (event.key === 'ArrowRight') {
        setActiveVideoIndex((currentIndex) => {
          if (currentIndex === null || album.videos.length === 0) {
            return currentIndex;
          }

          return (currentIndex + 1) % album.videos.length;
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeVideoIndex, album.videos.length]);

  useEffect(() => {
    if (!isClosingLightbox) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setActiveVideoIndex(null);
      setIsClosingLightbox(false);
    }, 240);

    return () => window.clearTimeout(timeout);
  }, [isClosingLightbox]);

  useLayoutEffect(() => {
    if (
      typeof window === 'undefined' ||
      !sectionRef.current ||
      !introRef.current ||
      !statsRef.current
    ) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const sectionNode = sectionRef.current;
    const introNode = introRef.current;
    const statsNode = statsRef.current;
    const gridItems = gridRef.current
      ? gsap.utils.toArray<HTMLElement>('[data-video-gallery-reveal]', gridRef.current)
      : [];
    const featuredItems = gsap.utils.toArray<HTMLElement>(
      '[data-video-gallery-featured]',
      statsNode
    );

    const context = gsap.context(() => {
      gsap.set([introNode, statsNode], {
        autoAlpha: 0,
        y: 28,
      });

      if (featuredItems.length > 0) {
        gsap.set(featuredItems, {
          autoAlpha: 0,
          y: 16,
        });
      }

      if (gridItems.length > 0) {
        gsap.set(gridItems, {
          autoAlpha: 0,
          y: 30,
        });
      }

      const timeline = gsap.timeline({
        paused: true,
        defaults: {
          ease: 'power3.out',
        },
      });

      timeline.to(introNode, {
        autoAlpha: 1,
        y: 0,
        duration: 0.78,
        clearProps: 'opacity,visibility,transform',
      });

      timeline.to(
        statsNode,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.76,
          clearProps: 'opacity,visibility,transform',
        },
        '-=0.48'
      );

      if (featuredItems.length > 0) {
        timeline.to(
          featuredItems,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.58,
            stagger: 0.07,
            clearProps: 'opacity,visibility,transform',
          },
          '-=0.32'
        );
      }

      if (gridItems.length > 0) {
        timeline.to(
          gridItems,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            stagger: 0.055,
            clearProps: 'opacity,visibility,transform',
          },
          '-=0.2'
        );
      }

      ScrollTrigger.create({
        trigger: sectionNode,
        start: 'top 84%',
        once: true,
        onEnter: () => timeline.play(0),
      });

      ScrollTrigger.refresh();
    }, sectionNode);

    return () => context.revert();
  }, [album.videos.length]);

  return (
    <section
      ref={sectionRef}
      className="bg-white px-4 pb-72 pt-12 md:px-6 md:pb-72 md:pt-16 lg:px-36 lg:pb-84 lg:pt-20"
    >
      <div className="mx-auto w-full max-w-[1480px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(360px,0.42fr)] lg:items-end">
          <div>
            <div ref={introRef} className="max-w-[760px]">
              <GradientTag
                text={album.labels.videos}
                className="inline-block"
                gradientFrom="#20C997"
                gradientTo="#A1DF0A"
              />

              <div className="mt-6">
                <GradientTitle
                  part1=""
                  part2={album.albumTitle}
                  size="custom"
                  className="text-[32px] font-semibold md:text-[46px] lg:text-[58px]"
                  style={{ lineHeight: '1.08' }}
                />
              </div>

              <p className="mt-5 max-w-[680px] text-[16px] leading-8 text-[#667085] md:text-[17px]">
                {album.description}
              </p>
            </div>
          </div>

          <aside
            ref={statsRef}
            className="rounded-[28px] border border-[#E5EBDD] bg-[#F6F8F3] p-5 shadow-[0_18px_50px_rgba(15,63,29,0.06)]"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#A1DF0A] text-[#0F3F1D]">
                <Film className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium text-[#667085]">{album.labels.albumVideos}</p>
                <p className="text-3xl font-semibold leading-none text-[#0F3F1D]">
                  {album.videos.length}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {featuredVideos.map((video) => (
                <div
                  key={video.id}
                  data-video-gallery-featured
                  className="relative aspect-video overflow-hidden rounded-[16px] bg-[#DDE6DD]"
                >
                  <Image
                    src={video.thumbnailSrc}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized={isLocalhostAssetUrl(video.thumbnailSrc)}
                    sizes="120px"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-[#042012]/20">
                    <PlayCircle className="h-6 w-6 text-white drop-shadow" strokeWidth={2.1} aria-hidden="true" />
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div ref={gridRef} className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3 lg:gap-6">
          {album.videos.map((video, index) => (
            <VideoCard
              key={video.id}
              video={video}
              onOpen={() => openLightbox(index)}
            />
          ))}
        </div>
      </div>

      {activeVideo && activeVideoIndex !== null && (
        <div
          className={`fixed inset-0 z-[120] flex min-h-dvh items-center justify-center bg-[#03100A]/92 px-4 py-5 backdrop-blur-sm transition-opacity duration-300 ease-out md:px-8 ${
            isLightboxVisible ? 'opacity-100' : 'opacity-0'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.title}
          onClick={closeLightbox}
        >
          <div
            className={`relative flex h-full w-full max-w-[1280px] flex-col transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isLightboxVisible
                ? 'translate-y-0 scale-100 opacity-100'
                : 'translate-y-4 scale-[0.98] opacity-0'
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A1DF0A]">
                  Video {activeVideoIndex + 1} / {album.videos.length}
                </p>
                <p className="mt-1 truncate text-sm font-medium text-white/82 md:text-base">
                  {activeVideo.title}
                </p>
              </div>

              <button
                type="button"
                onClick={closeLightbox}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#A1DF0A] hover:text-[#0F3F1D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A1DF0A]"
                aria-label="Close video player"
              >
                <X className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
              </button>
            </div>

            <div className="relative min-h-0 flex-1 overflow-hidden rounded-[28px] border border-white/10 bg-black shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
              <VideoPlayer video={activeVideo} />
            </div>

            {album.videos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPreviousVideo}
                  className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/12 text-white backdrop-blur transition hover:bg-[#A1DF0A] hover:text-[#0F3F1D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A1DF0A] md:left-5 md:h-12 md:w-12"
                  aria-label="Show previous video"
                >
                  <ChevronLeft className="h-6 w-6" strokeWidth={2.2} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={showNextVideo}
                  className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/12 text-white backdrop-blur transition hover:bg-[#A1DF0A] hover:text-[#0F3F1D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A1DF0A] md:right-5 md:h-12 md:w-12"
                  aria-label="Show next video"
                >
                  <ChevronRight className="h-6 w-6" strokeWidth={2.2} aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
