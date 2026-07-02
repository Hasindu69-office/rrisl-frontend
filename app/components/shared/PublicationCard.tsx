'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/app/components/ui/Button';

export interface PublicationCardItem {
  id: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  fallbackImageSrc?: string;
  readMoreHref: string;
  openInNewTab?: boolean;
  readMoreAriaLabel?: string;
}

interface PublicationCardProps {
  item: PublicationCardItem;
  className?: string;
  imageWrapperClassName?: string;
  titleClassName?: string;
  buttonLabel?: string;
}

export default function PublicationCard({
  item,
  className = '',
  imageWrapperClassName = '',
  titleClassName = '',
  buttonLabel = 'Read More',
}: PublicationCardProps) {
  const hasDocument = Boolean(item.readMoreHref);
  const hasLocalhostUrl = item.imageSrc.includes('localhost');
  const [useFallbackImage, setUseFallbackImage] = useState(() => {
    if (typeof window !== 'undefined' && hasLocalhostUrl) {
      const hostname = window.location.hostname;
      return hostname !== 'localhost' && hostname !== '127.0.0.1';
    }

    return false;
  });
  const resolvedImageSrc =
    useFallbackImage && item.fallbackImageSrc ? item.fallbackImageSrc : item.imageSrc;
  const useUnoptimized = resolvedImageSrc.includes('localhost');
  const buttonClassName =
    '!h-[42px] !w-[138px] !rounded-[999px] px-0 py-0 text-[13px] font-medium';

  return (
    <article
      className={`flex h-full min-h-[360px] flex-col rounded-[20px] border border-[#E6E8E4] bg-white px-2.5 pb-5 pt-0.5 shadow-[0_12px_36px_rgba(15,63,29,0.04)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,63,29,0.08)] md:min-h-[390px] md:px-3 md:pb-5 ${className}`}
    >
      <div
        className={`pointer-events-none relative mx-auto -mb-1 -mt-6 aspect-[0.82] w-[calc(100%+16px)] max-w-[248px] md:w-[calc(100%+28px)] md:max-w-[286px] ${imageWrapperClassName}`}
      >
        {useFallbackImage ? (
          <img
            src={resolvedImageSrc}
            alt={item.imageAlt}
            className="h-full w-full scale-[1.5] object-contain"
          />
        ) : (
          <Image
            src={resolvedImageSrc}
            alt={item.imageAlt}
            fill
            className="scale-[1.5] object-contain"
            sizes="(max-width: 767px) 78vw, (max-width: 1279px) 38vw, (max-width: 1535px) 28vw, 18vw"
            unoptimized={useUnoptimized}
            onError={() => {
              if (item.fallbackImageSrc) {
                setUseFallbackImage(true);
              }
            }}
          />
        )}
      </div>

      <div className="relative z-[1] mt-0 flex w-full flex-1 flex-col items-center text-center">
        <h3
          className={`flex min-h-[42px] w-full items-center justify-center px-4 text-[15px] font-semibold leading-[1.2] text-[#101828] md:px-5 ${titleClassName}`}
        >
          {item.title}
        </h3>

        <div className="mb-[18px] mt-auto flex justify-center pt-6">
          {hasDocument ? (
            item.openInNewTab ? (
              <a
                href={item.readMoreHref}
                target="_blank"
                rel="noreferrer"
                aria-label={item.readMoreAriaLabel || `${buttonLabel} for ${item.title}`}
              >
                <Button type="button" variant="outline" size="sm" className={buttonClassName}>
                  {buttonLabel}
                </Button>
              </a>
            ) : (
              <Link href={item.readMoreHref}>
                <Button type="button" variant="outline" size="sm" className={buttonClassName}>
                  {buttonLabel}
                </Button>
              </Link>
            )
          ) : (
            <span
              className="inline-flex !h-[42px] !w-[138px] cursor-not-allowed items-center justify-center rounded-[999px] border border-[#A1DF0A]/50 px-0 py-0 text-[13px] font-medium text-[#A1DF0A]/60"
              aria-disabled="true"
            >
              {buttonLabel}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
