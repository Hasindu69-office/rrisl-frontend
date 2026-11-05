'use client';

import Image from 'next/image';
import React, { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { ClipboardList, FlaskConical, Microscope, Settings, Sprout, UserRound, UsersRound, X } from 'lucide-react';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';
import styles from './DepartmentStaffSection.module.css';

export interface DepartmentStaffMember {
  id?: string;
  name: string;
  role: string;
  imageSrc: string;
  imageAlt: string;
  credentials?: string;
  emails?: string[];
  biography?: string;
  currentWork?: string;
}

export interface DepartmentTechnicalStaffMemberItem {
  id?: string;
  name: string;
  qualifications?: string;
}

export interface DepartmentTechnicalStaffGroupItem {
  id?: string;
  title: string;
  members: DepartmentTechnicalStaffMemberItem[];
}

interface DepartmentStaffSectionProps {
  tagText: string;
  titlePart1: string | React.ReactNode;
  titlePart2: string | React.ReactNode;
  staff: DepartmentStaffMember[];
  technicalStaffGroups?: DepartmentTechnicalStaffGroupItem[];
  containerClassName?: string;
}

const mobileCarouselMedia = '(max-width: 639px)';

function subscribeMobileCarousel(onChange: () => void) {
  const media = window.matchMedia(mobileCarouselMedia);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

function getMobileCarouselSnapshot() {
  return window.matchMedia(mobileCarouselMedia).matches;
}

function getMobileCarouselServerSnapshot() {
  return false;
}

function DepartmentStaffCard({
  member,
  onOpen,
}: {
  member: DepartmentStaffMember;
  onOpen: (trigger: HTMLButtonElement) => void;
}) {
  const useUnoptimizedImage = isLocalhostAssetUrl(member.imageSrc);
  const gradientId = useId().replaceAll(':', '');
  const hexagonPath = 'M 128 6 Q 140 -1 152 6 L 268 72 Q 278 78 278 91 L 278 229 Q 278 242 268 248 L 152 314 Q 140 321 128 314 L 12 248 Q 2 242 2 229 L 2 91 Q 2 78 12 72 Z';

  return (
    <button
      type="button"
      data-department-reveal
      onClick={(event) => onOpen(event.currentTarget)}
      className={`${styles.researchCard} group relative isolate flex shrink-0 cursor-pointer flex-col items-center justify-start text-center focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F3F1D]`}
      aria-label={`View profile of ${member.name}`}
    >
      <svg className={styles.cardShape} viewBox="0 0 280 320" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#88c900" />
            <stop offset="45%" stopColor="#378a05" />
            <stop offset="100%" stopColor="#124d0b" />
          </linearGradient>
        </defs>
        <path d={hexagonPath} fill="rgba(255,255,255,0.94)" />
        <path className={styles.cardHoverFill} d={hexagonPath} fill={`url(#${gradientId})`} />
        <path d={hexagonPath} fill="none" stroke="#8DCA18" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className={`${styles.portrait} relative z-10 mt-4 overflow-hidden`}>
        <Image
          src={member.imageSrc}
          alt={member.imageAlt}
          fill
          className="object-cover object-[center_20%] transition-transform duration-500 ease-out group-hover:scale-105 group-focus-visible:scale-105"
          sizes="(max-width: 319px) 78vw, 230px"
          unoptimized={useUnoptimizedImage}
        />
      </div>
      <div className="relative z-10 flex w-full flex-1 flex-col items-center px-5 pb-14 pt-0 sm:px-6">
        <h3 className="max-w-[220px] break-words text-[16px] font-bold leading-[1.2] text-[#102817] transition-colors group-hover:text-white group-focus-visible:text-white">
          {member.name}
        </h3>
        <p className="mt-2 max-w-[180px] break-words text-[11px] font-semibold uppercase leading-[1.25] text-[#27342A] transition-colors group-hover:text-white group-focus-visible:text-white">
          {member.role}
        </p>
      </div>
    </button>
  );
}

function renderTechnicalGroupIcon(title: string) {
  const normalized = title.toLowerCase();
  const iconProps = { size: 32, strokeWidth: 1.8 };
  if (normalized.includes('experiment')) return <FlaskConical {...iconProps} />;
  if (normalized.includes('technical')) return <Settings {...iconProps} />;
  if (normalized.includes('field')) return <Sprout {...iconProps} />;
  if (normalized.includes('laborat')) return <Microscope {...iconProps} />;
  if (normalized.includes('support')) return <ClipboardList {...iconProps} />;
  return <UsersRound {...iconProps} />;
}

function TechnicalStaffGroup({ group }: { group: DepartmentTechnicalStaffGroupItem }) {
  return (
    <article className="min-w-0" data-department-reveal>
      <div className="mb-3 flex min-h-[66px] items-center gap-4">
        <span className={`${styles.groupEmblem} flex h-[60px] w-[92px] shrink-0 items-center justify-center text-white`} aria-hidden="true">
          {renderTechnicalGroupIcon(group.title)}
        </span>
        <div className="min-w-0 flex-1 self-end border-b border-[#7AC826] pb-1">
          <h4 className="text-[19px] font-bold leading-tight text-[#102B18] md:text-[21px]">{group.title}</h4>
          <p className="text-[14px] font-medium text-[#386D38]">
            {group.members.length} {group.members.length === 1 ? 'Officer' : 'Officers'}
          </p>
        </div>
      </div>
      <ul className={`grid gap-2 ${group.members.length >= 5 ? styles.denseMemberGrid : ''}`}>
        {group.members.map((member) => (
          <li key={member.id || member.name} className={`${styles.memberRow} flex min-h-10 min-w-0 items-center gap-3 rounded-full bg-white/90 py-1 pl-1.5 pr-4 shadow-[0_4px_12px_rgba(32,57,32,0.16)]`}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#EDF6DA] bg-[#F6FBE8] text-[#73BD00] shadow-[0_2px_5px_rgba(34,70,25,0.15)]" aria-hidden="true">
              <UserRound size={19} strokeWidth={2} />
            </span>
            <span className="min-w-0 text-[14px] leading-[1.25]">
              <span className="font-semibold text-[#17281B]">{member.name}</span>
              {member.qualifications ? <span className="ml-2 text-[13px] font-medium text-[#34466C]">{member.qualifications}</span> : null}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function DepartmentStaffProfileModal({
  member,
  isVisible,
  onClose,
}: {
  member: DepartmentStaffMember;
  isVisible: boolean;
  onClose: () => void;
}) {
  const useUnoptimizedImage = isLocalhostAssetUrl(member.imageSrc);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-[120] flex min-h-dvh items-center justify-center bg-[#03140B]/72 px-4 py-4 backdrop-blur-[6px] transition-[opacity,backdrop-filter] duration-300 ease-out md:px-6 lg:px-8 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`department-staff-title-${member.id || member.name}`}
      onClick={onClose}
    >
      <div
        className={`relative flex max-h-[92dvh] w-full max-w-[1180px] flex-col overflow-y-auto rounded-[30px] border border-white/14 bg-[#F8FBF6] shadow-[0_40px_120px_rgba(0,0,0,0.34)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:max-h-[88dvh] lg:flex-row lg:overflow-hidden ${
          isVisible
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-5 scale-[0.98] opacity-0'
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[#0F3F1D]/82 text-white backdrop-blur-sm transition hover:bg-[#A1DF0A] hover:text-[#10341B] focus:outline-none focus-visible:ring-2 focus-visible:ring-white lg:right-5 lg:top-5"
          aria-label="Close staff profile"
        >
          <X className="h-5 w-5" strokeWidth={2.1} aria-hidden="true" />
        </button>

        <aside className="relative overflow-visible bg-[radial-gradient(circle_at_top_left,_rgba(161,223,10,0.18),_rgba(32,201,151,0.08)_32%,_transparent_64%),linear-gradient(180deg,#10341B_0%,#184727_100%)] px-6 pb-6 pt-8 text-white lg:w-[360px] lg:overflow-hidden lg:px-8 lg:pb-8 lg:pt-12">
          <div className="relative h-[140px] w-[140px] overflow-hidden rounded-[22px] border border-white/20 bg-white/12 shadow-[0_16px_40px_rgba(0,0,0,0.20)] sm:h-[152px] sm:w-[152px]">
            <Image
              src={member.imageSrc}
              alt={member.imageAlt}
              fill
              className="object-cover object-[center_20%]"
              sizes="(max-width: 639px) 140px, 152px"
              priority
              unoptimized={useUnoptimizedImage}
            />
          </div>

          <h3
            id={`department-staff-title-${member.id || member.name}`}
            className="mt-5 text-[24px] font-semibold leading-[1.2] md:text-[26px]"
          >
            {member.role}
          </h3>
          <p className="mt-4 text-[21px] font-semibold leading-[1.25] text-white">
            {member.name}
          </p>
          {member.credentials ? (
            <p className="mt-3 text-[15px] leading-7 text-white/76">
              {member.credentials}
            </p>
          ) : null}

          {member.emails && member.emails.length > 0 ? (
            <div className="mt-6 space-y-3 border-t border-white/12 pt-6">
              {member.emails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="block break-all text-[14px] font-medium text-[#D9F5CC] transition hover:text-white"
                >
                  {email}
                </a>
              ))}
            </div>
          ) : null}
        </aside>

        <div className="min-h-0 flex-1 px-6 py-6 md:px-8 md:py-8 lg:overflow-y-auto lg:px-10 lg:py-10">
          <div className="mx-auto max-w-[720px]">
            <div className="rounded-[28px] border border-[#E3EBDD] bg-white px-5 py-6 shadow-[0_18px_50px_rgba(15,63,29,0.05)] md:px-7 md:py-7">
              <h4 className="text-[22px] font-semibold text-[#15341F]">
                Profile Overview
              </h4>
              <div className="mt-5 space-y-5">
                {member.biography ? (
                  <p className="text-[15px] leading-8 text-[#4A5F54]">
                    {member.biography}
                  </p>
                ) : null}

                {member.currentWork ? (
                  <p className="text-[15px] leading-8 text-[#4A5F54]">
                    {member.currentWork}
                  </p>
                ) : null}

                {!member.biography && !member.currentWork ? (
                  <p className="text-[15px] leading-8 text-[#4A5F54]">
                    Profile details are not available at this time.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Reusable department staff section for department pages.
 */
export default function DepartmentStaffSection({
  tagText,
  titlePart1,
  titlePart2,
  staff,
  technicalStaffGroups = [],
  containerClassName = '',
}: DepartmentStaffSectionProps) {
  const [activeStaffId, setActiveStaffId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const isMobileCarousel = useSyncExternalStore(
    subscribeMobileCarousel,
    getMobileCarouselSnapshot,
    getMobileCarouselServerSnapshot
  );
  const activeTriggerRef = useRef<HTMLButtonElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const carouselInteractedRef = useRef(false);
  const visibleSlide = activeSlide % Math.max(staff.length, 1);

  const activeMember = useMemo(
    () =>
      activeStaffId
        ? staff.find((member) => (member.id || member.name) === activeStaffId) ?? null
        : null,
    [activeStaffId, staff]
  );

  useEffect(() => {
    if (staff.length < 2 || activeStaffId || !isMobileCarousel) return;

    const timer = window.setInterval(() => {
      if (
        carouselInteractedRef.current ||
        document.visibilityState !== 'visible' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        (document.activeElement && carouselRef.current?.contains(document.activeElement))
      ) return;

      setActiveSlide((current) => (current + 1) % staff.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [activeStaffId, isMobileCarousel, staff.length]);

  const handleTouchEnd = (endX: number) => {
    if (touchStartXRef.current === null || staff.length < 2) return;
    const movement = endX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(movement) < 45) return;
    setActiveSlide((current) => (current + (movement < 0 ? 1 : staff.length - 1)) % staff.length);
  };

  const openProfile = (member: DepartmentStaffMember, trigger: HTMLButtonElement) => {
    activeTriggerRef.current = trigger;
    setActiveStaffId(member.id || member.name);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setIsModalVisible(true);
      });
    });
  };

  const closeProfile = () => {
    setIsModalVisible(false);
    window.setTimeout(() => {
      setActiveStaffId(null);
      activeTriggerRef.current?.focus();
      activeTriggerRef.current = null;
    }, 300);
  };

  return (
    <section className={`${styles.section} relative py-14 md:py-16 lg:py-20`}>
      <div className={`relative mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 ${containerClassName}`}>
        <div className="flex flex-col items-center text-center" data-department-reveal>
          <GradientTag
            text={tagText}
            backgroundColor="transparent"
            className="inline-block"
            padding="px-4 py-1"
          />

          <GradientTitle
            part1={titlePart1}
            part2={titlePart2}
            lineBreak={false}
            part1Color="dark-green"
            size="custom"
            customSize="clamp(28px, 4vw, 50px)"
            align="center"
            className="mt-3 font-bold leading-[1.15]"
          />
        </div>

        {staff.length > 0 ? (
          <div className="mt-7 md:mt-10">
            <div
              ref={carouselRef}
              className={`${styles.researchCarousel} mx-auto max-w-[960px]`}
              role="region"
              aria-label="Research staff profiles"
              aria-roledescription={isMobileCarousel ? 'carousel' : undefined}
              onPointerDown={() => { carouselInteractedRef.current = true; }}
              onTouchStart={(event) => { touchStartXRef.current = event.touches[0]?.clientX ?? null; }}
              onTouchEnd={(event) => { handleTouchEnd(event.changedTouches[0]?.clientX ?? 0); }}
            >
              <div
                className={`${styles.researchTrack} flex flex-wrap justify-start gap-x-3 gap-y-3 sm:justify-center sm:gap-x-4 sm:gap-y-4`}
                style={{ '--slide-offset': `-${visibleSlide * 100}%` } as React.CSSProperties}
              >
                {staff.map((member, index) => (
                  <div
                    className={styles.researchSlide}
                    key={member.id || member.name}
                    inert={isMobileCarousel && visibleSlide !== index}
                  >
                    <DepartmentStaffCard
                      member={member}
                      onOpen={(trigger) => openProfile(member, trigger)}
                    />
                  </div>
                ))}
              </div>
              {staff.length > 1 ? (
                <div className={`${styles.carouselDots} mt-4 flex flex-wrap items-center justify-center gap-1`} role="group" aria-label="Choose research staff profile">
                  {staff.map((member, index) => (
                    <button
                      key={member.id || member.name}
                      type="button"
                      className={`${styles.carouselDot} ${visibleSlide === index ? styles.carouselDotActive : ''} flex h-9 w-9 cursor-pointer items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F3F1D]`}
                      aria-label={`Show ${member.name}`}
                      aria-current={visibleSlide === index ? 'true' : undefined}
                      onClick={() => {
                        carouselInteractedRef.current = true;
                        setActiveSlide(index);
                      }}
                    >
                      <span aria-hidden="true" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {technicalStaffGroups.length > 0 ? (
          <div className="mt-12 md:mt-16" data-department-reveal>
            <h3 className="text-[28px] font-bold text-[#102B18] md:text-[34px]">Technical Staff</h3>
            <div className="mt-4 grid grid-cols-1 gap-x-12 gap-y-7 lg:grid-cols-2 lg:gap-y-9">
              {technicalStaffGroups.map((group) => (
                <TechnicalStaffGroup key={group.id || group.title} group={group} />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {activeMember ? (
        <DepartmentStaffProfileModal
          member={activeMember}
          isVisible={isModalVisible}
          onClose={closeProfile}
        />
      ) : null}
    </section>
  );
}
