'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Camera, ChevronLeft, ChevronRight, Images, X } from 'lucide-react';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';
import GradientTag from '@/app/components/ui/GradientTag';
import GradientTitle from '@/app/components/ui/GradientTitle';
import type { PhotoGalleryAlbumViewModel } from '@/app/lib/photo-gallery/pageData';

interface PhotoAlbumShowcaseProps {
  album: PhotoGalleryAlbumViewModel;
}

function PhotoTile({
  photo,
  onOpen,
}: {
  photo: PhotoGalleryAlbumViewModel['photos'][number];
  onOpen: () => void;
}) {
  const useUnoptimizedImage = isLocalhostAssetUrl(photo.src);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative block w-full cursor-pointer overflow-hidden rounded-[26px] bg-[#DDE6DD] text-left shadow-[0_18px_50px_rgba(15,63,29,0.08)] outline-none transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(15,63,29,0.16)] focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-4"
      aria-label={`View ${photo.accessibilityLabel}`}
    >
      <div className="relative aspect-[4/5]">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          unoptimized={useUnoptimizedImage}
          className="object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]"
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,32,18,0)_28%,rgba(4,32,18,0.18)_58%,rgba(4,32,18,0.86)_100%)]" />
        <div className="absolute left-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/88 text-[#0F3F1D] shadow-[0_10px_24px_rgba(4,32,18,0.16)] backdrop-blur transition duration-300 group-hover:bg-[#A1DF0A] group-hover:scale-105">
          <Camera className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
        </div>
      </div>
    </button>
  );
}

export default function PhotoAlbumShowcase({
  album,
}: PhotoAlbumShowcaseProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [isLightboxVisible, setIsLightboxVisible] = useState(false);
  const [isClosingLightbox, setIsClosingLightbox] = useState(false);
  const featuredPhotos = album.photos.slice(0, 3);
  const activePhoto = useMemo(
    () =>
      activePhotoIndex === null
        ? null
        : album.photos[activePhotoIndex] ?? null,
    [activePhotoIndex, album.photos]
  );

  const closeLightbox = () => {
    setIsClosingLightbox(true);
    setIsLightboxVisible(false);
  };

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
    setIsClosingLightbox(false);
    window.requestAnimationFrame(() => {
      setIsLightboxVisible(true);
    });
  };

  const showPreviousPhoto = () => {
    setActivePhotoIndex((currentIndex) => {
      if (currentIndex === null || album.photos.length === 0) {
        return currentIndex;
      }

      return (currentIndex - 1 + album.photos.length) % album.photos.length;
    });
  };

  const showNextPhoto = () => {
    setActivePhotoIndex((currentIndex) => {
      if (currentIndex === null || album.photos.length === 0) {
        return currentIndex;
      }

      return (currentIndex + 1) % album.photos.length;
    });
  };

  useEffect(() => {
    if (activePhotoIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLightbox();
      }

      if (event.key === 'ArrowLeft') {
        showPreviousPhoto();
      }

      if (event.key === 'ArrowRight') {
        showNextPhoto();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePhotoIndex, album.photos.length]);

  useEffect(() => {
    if (!isClosingLightbox) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setActivePhotoIndex(null);
      setIsClosingLightbox(false);
    }, 240);

    return () => window.clearTimeout(timeout);
  }, [isClosingLightbox]);

  return (
    <section className="bg-white px-4 pb-72 pt-12 md:px-6 md:pb-72 md:pt-16 lg:px-36 lg:pb-84 lg:pt-20">
      <div className="mx-auto w-full max-w-[1480px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(360px,0.42fr)] lg:items-end">
          <div>
            <div className="max-w-[760px]">
              <GradientTag
                text={album.labels.photos}
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

          <aside className="rounded-[28px] border border-[#E5EBDD] bg-[#F6F8F3] p-5 shadow-[0_18px_50px_rgba(15,63,29,0.06)]">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#A1DF0A] text-[#0F3F1D]">
                <Images className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium text-[#667085]">
                  {album.labels.albumPhotos}
                </p>
                <p className="text-3xl font-semibold leading-none text-[#0F3F1D]">
                  {album.photos.length}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {featuredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative aspect-square overflow-hidden rounded-[16px] bg-[#DDE6DD]"
                >
                  <Image
                    src={photo.src}
                    alt=""
                    fill
                    unoptimized={isLocalhostAssetUrl(photo.src)}
                    className="object-cover"
                    sizes="120px"
                  />
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {album.photos.map((photo, index) => (
            <PhotoTile
              key={photo.id}
              photo={photo}
              onOpen={() => openLightbox(index)}
            />
          ))}
        </div>
      </div>

      {activePhoto && activePhotoIndex !== null && (
        <div
          className={`fixed inset-0 z-[120] flex min-h-dvh items-center justify-center bg-[#03100A]/92 px-4 py-5 backdrop-blur-sm transition-opacity duration-300 ease-out md:px-8 ${
            isLightboxVisible ? 'opacity-100' : 'opacity-0'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.accessibilityLabel}
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
                  Photo {activePhotoIndex + 1} / {album.photos.length}
                </p>
              </div>

              <button
                type="button"
                onClick={closeLightbox}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#A1DF0A] hover:text-[#0F3F1D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A1DF0A]"
                aria-label="Close photo viewer"
              >
                <X className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
              </button>
            </div>

            <div className="relative min-h-0 flex-1 overflow-hidden rounded-[28px] border border-white/10 bg-black/30 shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
              <Image
                src={activePhoto.src}
                alt={activePhoto.alt}
                fill
                unoptimized={isLocalhostAssetUrl(activePhoto.src)}
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {album.photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPreviousPhoto}
                  className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/12 text-white backdrop-blur transition hover:bg-[#A1DF0A] hover:text-[#0F3F1D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A1DF0A] md:left-5 md:h-12 md:w-12"
                  aria-label="Show previous photo"
                >
                  <ChevronLeft className="h-6 w-6" strokeWidth={2.2} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={showNextPhoto}
                  className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/12 text-white backdrop-blur transition hover:bg-[#A1DF0A] hover:text-[#0F3F1D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A1DF0A] md:right-5 md:h-12 md:w-12"
                  aria-label="Show next photo"
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
