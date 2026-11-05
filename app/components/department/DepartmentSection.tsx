'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { FlaskConical, Layers3, Leaf, Play, Settings2, Sprout, Trees, X } from 'lucide-react';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';
import styles from './DepartmentSection.module.css';

export interface DepartmentSectionPoint {
  text: string;
  iconSrc?: string;
  iconAlt?: string;
}

interface DepartmentSectionProps {
  tagText: string;
  titlePart1: string;
  titlePart2: string;
  description: string;
  closingDescription?: string;
  points: Array<string | DepartmentSectionPoint>;
  videoUrl?: string;
  videoTitle?: string;
  videoThumbnailUrl?: string;
  backgroundImageSrc: string;
  featureImageSrc: string;
  featureImageAlt: string;
  departmentSlug: string;
  locale: string;
}

const plantScienceIcons = [Sprout, Trees, Settings2, Layers3, FlaskConical];

function youtubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    const id = host === 'youtu.be'
      ? parsed.pathname.split('/')[1]
      : host === 'youtube.com' || host === 'm.youtube.com'
        ? parsed.pathname.startsWith('/embed/')
          ? parsed.pathname.split('/')[2]
          : parsed.searchParams.get('v')
        : null;
    return id ? `https://www.youtube.com/embed/${encodeURIComponent(id)}?rel=0` : null;
  } catch {
    return null;
  }
}

function directVideoUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol) && /\.(mp4|webm|ogg)$/i.test(parsed.pathname);
  } catch {
    return false;
  }
}

function DepartmentVideo({ url, title, thumbnail }: { url?: string; title: string; thumbnail?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const closingRef = useRef(false);
  const embed = url ? youtubeEmbedUrl(url) : null;
  const direct = url && directVideoUrl(url);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, [isOpen]);

  if (!embed && !direct) return null;

  const openPlayer = () => {
    if (dialogRef.current?.open) return;
    closingRef.current = false;
    setIsClosing(false);
    setIsOpen(true);
    dialogRef.current?.showModal();
  };

  const closePlayer = () => {
    const dialog = dialogRef.current;
    if (!dialog?.open || closingRef.current) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dialog.close();
      return;
    }

    closingRef.current = true;
    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(() => dialogRef.current?.close(), 220);
  };

  return (
    <>
      <div className="relative aspect-video w-full overflow-hidden rounded-[24px] border-[6px] border-white bg-[#123b23] shadow-[0_18px_45px_rgba(8,49,25,.24)] sm:rounded-[30px]">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt=""
            fill
            sizes="(max-width: 1280px) 90vw, 35vw"
            className="object-cover"
            unoptimized={isLocalhostAssetUrl(thumbnail)}
          />
        ) : direct ? (
          <video
            src={url}
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        <button
          ref={triggerRef}
          type="button"
          onClick={openPlayer}
          aria-label={`Open video player: ${title}`}
          className="group absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-[-8px] focus-visible:outline-[#A1DF0A]"
        >
          <span className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/25" />
          <span className="relative grid h-16 w-16 place-items-center rounded-full border-2 border-white bg-white text-[#12602e] shadow-lg transition-transform group-hover:scale-110 group-focus-visible:scale-110 sm:h-20 sm:w-20">
            <Play className="ml-1 h-7 w-7 fill-current" aria-hidden="true" />
          </span>
          {!thumbnail && !direct ? (
            <span className="absolute bottom-4 left-4 right-4 truncate text-left text-sm font-medium text-white">{title}</span>
          ) : null}
        </button>
      </div>

      <dialog
        ref={dialogRef}
        aria-label={title}
        data-closing={isClosing ? 'true' : undefined}
        onClose={() => {
          if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
          closeTimerRef.current = null;
          closingRef.current = false;
          setIsClosing(false);
          setIsOpen(false);
          triggerRef.current?.focus();
        }}
        onCancel={(event) => {
          event.preventDefault();
          closePlayer();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closePlayer();
        }}
        className={`${styles.videoDialog} fixed inset-0 m-auto w-[92vw] max-w-[1000px] max-h-[92dvh] overflow-hidden rounded-[24px] border border-white/15 bg-[#07170e] p-0 text-white shadow-[0_30px_90px_rgba(0,0,0,.5)] backdrop:bg-[#03100A]/85 backdrop:backdrop-blur-sm`}
      >
        <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6">
          <p className="min-w-0 truncate text-sm font-semibold sm:text-base">{title}</p>
          <button
            type="button"
            onClick={closePlayer}
            aria-label="Close video player"
            className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full bg-white/10 text-white transition hover:bg-[#A1DF0A] hover:text-[#0F3F1D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A1DF0A]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="aspect-video max-h-[calc(92dvh-64px)] w-full bg-black">
          {isOpen && (embed ? (
            <iframe
              src={`${embed}&autoplay=1`}
              title={title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <video
              src={url}
              poster={thumbnail}
              aria-label={title}
              className="h-full w-full object-contain"
              controls
              autoPlay
              playsInline
              preload="metadata"
            />
          ))}
        </div>
      </dialog>
    </>
  );
}

export default function DepartmentSection({
  tagText,
  titlePart1,
  titlePart2,
  description,
  closingDescription,
  points,
  videoUrl,
  videoTitle = 'Department video',
  videoThumbnailUrl,
  backgroundImageSrc,
  featureImageSrc,
  featureImageAlt,
  departmentSlug,
  locale,
}: DepartmentSectionProps) {
  const isPlantScience = departmentSlug === 'plant-science';
  const hasVideo = Boolean(videoUrl && (youtubeEmbedUrl(videoUrl) || directVideoUrl(videoUrl)));
  const focusTitle = locale === 'si'
    ? 'ප්‍රධාන පර්යේෂණ ක්ෂේත්‍ර'
    : locale === 'ta'
      ? 'முக்கிய ஆராய்ச்சித் துறைகள்'
      : 'Research Focus Areas';

  return (
    <section className="relative isolate overflow-hidden bg-[#f7faf5]" aria-labelledby="department-overview-title">
      <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0" focusable="false">
        <defs>
          <clipPath id="department-overview-photo-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0 0 L 0.6 0 C 0.79 0.07 0.98 0.26 1 0.47 C 1 0.7 0.88 0.84 0.69 0.91 C 0.44 1 0.16 0.91 0 0.69 Z" />
          </clipPath>
        </defs>
      </svg>
      <Image
        src={backgroundImageSrc}
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover object-left-top opacity-20 xl:object-fill xl:opacity-100"
        unoptimized={isLocalhostAssetUrl(backgroundImageSrc)}
      />
      <div className="mx-auto grid max-w-[1920px] grid-cols-1 xl:grid-cols-[37%_63%] xl:grid-rows-[auto_1fr]">
        <div className="min-w-0 px-5 pt-10 sm:px-8 sm:pt-12 xl:col-start-2 xl:row-start-1 xl:px-[clamp(36px,4vw,76px)]" data-department-reveal>
          <span className="inline-flex rounded-full border border-[#71bf1c] px-6 py-1.5 text-sm font-semibold text-[#0e4e25] shadow-sm">
            {tagText}
          </span>
          <h2 id="department-overview-title" className="mt-5 max-w-[1100px] text-[28px] font-bold leading-[1.2] tracking-[-.025em] text-[#103d24] sm:text-3xl lg:text-4xl">
            {titlePart1}{titlePart2}
          </h2>
          <div className="mt-3 h-1.5 w-28 rounded-full bg-gradient-to-r from-[#43a00d] to-[#a9d600]" aria-hidden="true" />
          <p className="mt-4 max-w-[1040px] text-[15px] leading-[1.65] text-[#46536b] sm:text-base">
            {description}
          </p>
        </div>

        <div className="relative mx-auto mt-6 w-full max-w-[700px] px-5 pb-3 sm:px-8 xl:col-start-1 xl:row-start-1 xl:row-span-2 xl:mt-0 xl:min-h-[760px] xl:max-w-none xl:px-0 xl:pb-0" data-department-reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-[0_20px_60px_rgba(19,78,29,.12)] sm:rounded-[36px] xl:absolute xl:inset-x-0 xl:top-0 xl:h-[71%] xl:aspect-auto xl:rounded-tl-none xl:rounded-bl-[35%] xl:rounded-br-[48%] xl:rounded-tr-[48%] xl:[clip-path:url(#department-overview-photo-clip)]">
            <Image
              src={featureImageSrc}
              alt={featureImageAlt}
              fill
              priority
              sizes="(max-width: 1280px) 90vw, 37vw"
              className="object-cover object-left-top"
              unoptimized={isLocalhostAssetUrl(featureImageSrc)}
            />
          </div>
          {hasVideo ? (
            <div className="relative z-10 mx-auto -mt-[10%] w-[90%] max-w-[620px] xl:absolute xl:bottom-[11%] xl:left-[12%] xl:mt-0 xl:w-[86%]" data-department-reveal>
              <DepartmentVideo url={videoUrl} title={videoTitle} thumbnail={videoThumbnailUrl} />
            </div>
          ) : null}
        </div>

        <div className="min-w-0 px-5 pb-12 sm:px-8 xl:col-start-2 xl:row-start-2 xl:px-[clamp(36px,4vw,76px)] xl:pb-16" data-department-reveal>

          {points.length > 0 ? (
            <div className="mt-7">
              <div className="flex items-center gap-4">
                <Leaf className="h-8 w-8 shrink-0 text-[#187a2c]" strokeWidth={1.8} aria-hidden="true" />
                <h3 className="text-xl font-bold leading-snug text-[#10442c] lg:text-2xl">{focusTitle}</h3>
                <div className="h-px flex-1 bg-[#a5c69b]" aria-hidden="true" />
              </div>
              <ul className={`mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 ${points.length === 5 ? '2xl:grid-cols-6' : '2xl:grid-cols-3'}`}>
                {points.map((item, index) => {
                  const point = typeof item === 'string' ? { text: item } : item;
                  const Icon = isPlantScience ? plantScienceIcons[index] : null;
                  return (
                    <li key={`${point.text}-${index}`} className={`group flex min-h-[88px] min-w-0 items-center gap-2 rounded-[20px] border border-[#e0eee0] bg-[linear-gradient(135deg,rgba(255,255,255,.94),rgba(226,242,224,.72))] px-3 py-3 shadow-[0_8px_22px_rgba(31,94,40,.04)] transition-[border-color,box-shadow,transform] duration-[450ms] ease-in-out hover:border-[#afd8a5] hover:shadow-[0_14px_30px_rgba(18,81,31,.12)] motion-safe:hover:-translate-y-1 motion-reduce:transition-none sm:min-h-[100px] sm:gap-3 sm:rounded-[24px] ${points.length === 5 ? index < 3 ? '2xl:col-span-2' : '2xl:col-span-3' : ''}`}>
                      <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-[16px] bg-[linear-gradient(135deg,#f5faed,#e0f1cd)] text-[#248b22] transition-transform duration-[450ms] ease-in-out motion-safe:group-hover:scale-105 motion-reduce:transition-none sm:h-[60px] sm:w-[60px] sm:rounded-[20px]">
                        {point.iconSrc ? (
                          <Image src={point.iconSrc} alt="" fill sizes="(max-width: 640px) 48px, 60px" className="object-contain p-2 [filter:brightness(0)_saturate(100%)_invert(41%)_sepia(69%)_saturate(903%)_hue-rotate(78deg)_brightness(91%)_contrast(92%)] sm:p-3" unoptimized={isLocalhostAssetUrl(point.iconSrc)} />
                        ) : Icon ? (
                          <Icon className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={1.7} aria-hidden="true" />
                        ) : (
                          <Leaf className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={1.7} aria-hidden="true" />
                        )}
                      </span>
                      <span className="h-10 w-px shrink-0 bg-[#a4c6a1] sm:h-[52px]" aria-hidden="true" />
                      <span className="min-w-0 break-words text-sm font-medium leading-[1.5] text-[#162944]">{point.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {closingDescription ? (
            <div className="mt-6 flex flex-col overflow-hidden rounded-[24px] bg-[linear-gradient(100deg,#e0efc8,#f1f7e7)] text-[#163450] sm:flex-row sm:rounded-[28px]">
              <div className="grid h-14 w-full shrink-0 place-items-center bg-[linear-gradient(140deg,#0b6030,#32861c)] text-white sm:h-auto sm:w-24 xl:w-32">
                <Leaf className="h-8 w-8 sm:h-12 sm:w-12" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <p className="px-5 py-4 text-sm leading-[1.6] sm:px-7 sm:text-[15px]">{closingDescription}</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
