'use client';

import { useEffect, useMemo, useState } from 'react';
interface BoardMemberCardProps {
  member: {
    name: string;
    descriptor?: string;
    organizationText?: string;
    imageSrc: string;
    imageAlt: string;
  };
}

const PLACEHOLDER_AVATAR = '/images/avatarimages.png';

function resolveMemberImageSrc(src: string): string {
  if (typeof window === 'undefined') {
    return src;
  }

  try {
    const url = new URL(src);

    if (url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') {
      return src;
    }

    const currentHostname = window.location.hostname;

    if (currentHostname === 'localhost' || currentHostname === '127.0.0.1') {
      return src;
    }

    url.hostname = currentHostname;
    return url.toString();
  } catch {
    return src;
  }
}

export default function BoardMemberCard({ member }: BoardMemberCardProps) {
  const resolvedSrc = useMemo(() => resolveMemberImageSrc(member.imageSrc), [member.imageSrc]);
  const [imageSrc, setImageSrc] = useState(resolvedSrc);

  useEffect(() => {
    setImageSrc(resolvedSrc);
  }, [resolvedSrc]);

  return (
    <article className="group flex h-[320px] w-full max-w-[176px] flex-col items-center rounded-[16px] bg-[#F5F5F5] px-3 pb-5 pt-4 text-center shadow-[0_10px_24px_rgba(15,63,29,0.04)] transition-[background-color,box-shadow] duration-200 ease-out motion-reduce:transition-none hover:bg-[#F7F8F4] hover:shadow-[0_14px_34px_rgba(15,63,29,0.08)] focus-within:bg-[#F7F8F4] focus-within:shadow-[0_14px_34px_rgba(15,63,29,0.08)] focus-within:ring-2 focus-within:ring-[#7DBB6A] focus-within:ring-offset-2 focus-within:ring-offset-white md:h-[320px] md:max-w-[230px] md:rounded-[18px] md:px-4 md:pb-5 md:pt-4 md:shadow-[0_11px_28px_rgba(15,63,29,0.04)] lg:h-[400px] lg:w-[410px] lg:max-w-none lg:rounded-[20px] lg:px-4 lg:pb-6 lg:pt-5 lg:shadow-[0_12px_32px_rgba(15,63,29,0.04)]">
      <div className="relative mb-4 h-[116px] w-[116px] shrink-0 md:mb-5 md:h-[142px] md:w-[142px] lg:mb-6 lg:h-[182px] lg:w-[182px]">
        <div className="absolute inset-[7px] overflow-hidden rounded-full bg-white md:inset-[8px] lg:inset-[10px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={member.imageAlt}
            className="h-full w-full object-cover"
            onError={() => {
              if (imageSrc !== PLACEHOLDER_AVATAR) {
                setImageSrc(PLACEHOLDER_AVATAR);
              }
            }}
          />
        </div>
      </div>

      <h3 className="text-[12px] font-medium leading-[1.3] text-[#2D8A40] transition-colors duration-200 ease-out motion-reduce:transition-none group-hover:text-[#246F35] group-focus-within:text-[#246F35] md:text-[14px] lg:text-[18px]">
        {member.name}
      </h3>

      {member.organizationText ? (
        <p className="mt-1 text-[10px] italic leading-[1.35] text-[#73AA64] md:mt-1.5 md:text-[11px] lg:mt-2 lg:text-[13px] lg:leading-[1.45]">
          {member.organizationText}
        </p>
      ) : null}

      {member.descriptor ? (
        <p
          className={`mt-1 text-[11px] font-medium leading-[1.35] text-[#1E1E1E] md:text-[12px] lg:text-[14px] lg:leading-[1.45] ${
            member.organizationText ? 'lg:mt-2' : ''
          }`}
        >
          {member.descriptor}
        </p>
      ) : null}
    </article>
  );
}
