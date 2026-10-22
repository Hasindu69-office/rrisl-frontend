'use client';

import Image from 'next/image';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';

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

function DepartmentStaffCard({
  member,
  onOpen,
}: {
  member: DepartmentStaffMember;
  onOpen: (trigger: HTMLButtonElement) => void;
}) {
  const useUnoptimizedImage = isLocalhostAssetUrl(member.imageSrc);

  return (
    <button
      type="button"
      data-department-reveal
      onClick={(event) => onOpen(event.currentTarget)}
      className="group mx-auto flex h-full w-full max-w-[340px] cursor-pointer flex-col overflow-hidden rounded-[24px] border border-[#DFE9D9] bg-white text-left shadow-[0_12px_32px_rgba(15,63,29,0.06)] transition duration-300 ease-out hover:-translate-y-1 hover:border-[#BFD6B3] hover:shadow-[0_20px_44px_rgba(15,63,29,0.12)] focus:outline-none focus-visible:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-4"
      aria-label={`View profile of ${member.name}`}
    >
      <div className="relative mx-4 mt-4 h-[180px] overflow-hidden rounded-[18px] bg-[#EAF4E5] sm:h-[190px]">
        <Image
          src={member.imageSrc}
          alt={member.imageAlt}
          fill
          className="object-cover object-[center_20%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
          sizes="(max-width: 767px) 70vw, 340px"
          unoptimized={useUnoptimizedImage}
        />
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <p className="line-clamp-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2E7D32]">
          {member.role}
        </p>
        <h3 className="mt-1.5 text-[18px] font-semibold leading-[1.3] text-[#0F3F1D] md:text-[19px]">
          {member.name}
        </h3>
        {member.credentials ? (
          <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-[#607067]">
            {member.credentials}
          </p>
        ) : null}
        <span className="mt-4 text-[13px] font-semibold text-[#28733A] transition-colors group-hover:text-[#0F3F1D]">
          View profile <span aria-hidden="true">→</span>
        </span>
      </div>
    </button>
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
  const activeTriggerRef = useRef<HTMLButtonElement | null>(null);

  const activeMember = useMemo(
    () =>
      activeStaffId
        ? staff.find((member) => (member.id || member.name) === activeStaffId) ?? null
        : null,
    [activeStaffId, staff]
  );

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
    <section className="bg-white py-16 md:py-20 lg:py-24">
      <div className={`mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8 ${containerClassName}`}>
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
            className="mt-5 font-bold leading-[1.15]"
          />
        </div>

        {staff.length > 0 ? (
          <div className="mt-12 md:mt-14">
            <div className="flex items-end justify-between gap-6 border-b border-[#DDE8D7] pb-4" data-department-reveal>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#4B8B52]">
                  Profiles
                </p>
                <h3 className="mt-1 text-[25px] font-semibold text-[#0F3F1D] md:text-[30px]">
                  Research Staff
                </h3>
              </div>
              <p className="hidden max-w-[420px] text-right text-[14px] leading-6 text-[#66756C] md:block">
                Select a profile to view qualifications, experience, and current research focus.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-5 md:gap-6">
              {staff.map((member) => (
                <DepartmentStaffCard
                  key={member.id || member.name}
                  member={member}
                  onOpen={(trigger) => openProfile(member, trigger)}
                />
              ))}
            </div>
          </div>
        ) : null}

        {technicalStaffGroups.length > 0 ? (
          <div className="mt-16 md:mt-20" data-department-reveal>
            <div className="border-b border-[#DDE8D7] pb-4">
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#4B8B52]">
                Department Directory
              </p>
              <h3 className="mt-1 text-[25px] font-semibold text-[#0F3F1D] md:text-[30px]">
                Technical Staff
              </h3>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-7 lg:grid-cols-2 lg:gap-9">
              {technicalStaffGroups.map((group) => (
                <article
                  key={group.id || group.title}
                  className="overflow-hidden rounded-[28px] border border-[#DFE9D9] bg-[#F8FBF6] shadow-[0_16px_45px_rgba(15,63,29,0.06)]"
                >
                  <div className="bg-[linear-gradient(135deg,#123B20_0%,#24663A_100%)] px-6 py-5 text-white md:px-7">
                    <h4 className="text-[20px] font-semibold md:text-[22px]">{group.title}</h4>
                    <p className="mt-1 text-[13px] text-white/70">
                      {group.members.length} {group.members.length === 1 ? 'officer' : 'officers'}
                    </p>
                  </div>

                  <ul className="divide-y divide-[#DFE9D9] px-5 md:px-6">
                    {group.members.map((member) => (
                      <li key={member.id || member.name} className="flex items-start gap-4 py-5">
                        <span className="mt-1.5 h-2.5 w-2.5 flex-none rounded-full bg-[linear-gradient(135deg,#20C997,#A1DF0A)] shadow-[0_0_0_5px_rgba(46,125,50,0.08)]" aria-hidden="true" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[16px] font-semibold leading-6 text-[#173C22]">
                            {member.name}
                          </p>
                          {member.qualifications ? (
                            <p className="mt-1 text-[14px] leading-6 text-[#66756C]">
                              {member.qualifications}
                            </p>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>
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
