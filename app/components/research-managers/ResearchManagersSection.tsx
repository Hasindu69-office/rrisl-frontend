'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Mail, Phone, X } from 'lucide-react';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';
import {
  researchManagers,
  type ResearchManagerProfile,
} from './researchManagersData';

const MODAL_TRANSITION_MS = 280;

function ProfileCard({
  profile,
  onOpen,
}: {
  profile: ResearchManagerProfile;
  onOpen: () => void;
}) {
  const primaryEmail = profile.emails[0];

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-[28px] border border-[#DCE6D7] bg-white text-left shadow-[0_22px_60px_rgba(15,63,29,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#B8CDB2] hover:shadow-[0_30px_80px_rgba(15,63,29,0.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-4"
      aria-label={`View profile of ${profile.name}`}
    >
      <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(135deg,#E7F5E0_0%,#F7FBF3_58%,#FFFFFF_100%)]" />

      <div className="relative flex flex-1 flex-col p-6 md:p-7">
        <div className="flex items-start gap-4">
          <div className="relative h-[104px] w-[104px] shrink-0 overflow-hidden rounded-[24px] border border-white/70 bg-[#E7EEE4] shadow-[0_16px_30px_rgba(15,63,29,0.10)]">
            <Image
              src={profile.imageSrc}
              alt={profile.imageAlt}
              fill
              className="object-cover"
              sizes="104px"
            />
          </div>

          <div className="min-w-0 pt-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2E7D32] md:text-[12px]">
              Leadership Profile
            </p>
            <h3 className="mt-2 text-[18px] font-semibold leading-[1.16] text-[#16311F] md:text-[18px]">
              {profile.role}
            </h3>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-[18px] font-semibold leading-[1.22] text-[#0F3F1D] md:text-[19px]">
            {profile.name}
          </p>
          <p className="mt-2 text-[13px] leading-6 text-[#5A6B61] md:text-[14px]">
            {profile.credentials}
          </p>
        </div>

        <p className="mt-5 text-[14px] leading-8 text-[#4D5F56] md:text-[15px]">
          {profile.profileSummary}
        </p>

        <div className="mt-6 space-y-3 rounded-[20px] border border-[#E8EFE3] bg-[#F8FBF6] p-4">
          <div className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#2E7D32] shadow-[0_8px_18px_rgba(15,63,29,0.08)]">
              <Mail className="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#7A8C82] md:text-[12px]">
                Primary Contact
              </p>
              <p className="mt-1 break-all text-[13px] font-medium text-[#1C4A2A] md:text-[14px]">
                {primaryEmail}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#2E7D32] shadow-[0_8px_18px_rgba(15,63,29,0.08)]">
              <Phone className="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
            </span>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#7A8C82] md:text-[12px]">
                Direct Line
              </p>
              <p className="mt-1 text-[13px] font-medium text-[#1C4A2A] md:text-[14px]">
                {profile.phone}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-[#E6EEE2] pt-5">
          <span className="text-[13px] font-semibold text-[#164927] md:text-[14px]">
            View full profile
          </span>
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#0F3F1D] text-white transition duration-300 group-hover:bg-[#A1DF0A] group-hover:text-[#10341B]">
            <ArrowRight className="h-5 w-5" strokeWidth={2.1} aria-hidden="true" />
          </span>
        </div>
      </div>
    </button>
  );
}

function ProfileModal({
  profile,
  isVisible,
  onClose,
}: {
  profile: ResearchManagerProfile;
  isVisible: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

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
      aria-labelledby={`research-manager-title-${profile.id}`}
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
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[#0F3F1D]/82 text-white backdrop-blur-sm transition hover:bg-[#A1DF0A] hover:text-[#10341B] focus:outline-none focus-visible:ring-2 focus-visible:ring-white lg:right-5 lg:top-5"
          aria-label="Close profile"
        >
          <X className="h-5 w-5" strokeWidth={2.1} aria-hidden="true" />
        </button>

        <div className="relative overflow-visible bg-[radial-gradient(circle_at_top_left,_rgba(161,223,10,0.18),_rgba(32,201,151,0.08)_32%,_transparent_64%),linear-gradient(180deg,#10341B_0%,#184727_100%)] px-6 pb-6 pt-8 text-white lg:w-[360px] lg:overflow-hidden lg:px-8 lg:pb-8 lg:pt-12">
          <div className="relative h-[160px] w-[160px] overflow-hidden rounded-[30px] border border-white/20 bg-white/12 shadow-[0_20px_50px_rgba(0,0,0,0.20)] sm:h-[180px] sm:w-[180px]">
            <Image
              src={profile.imageSrc}
              alt={profile.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 639px) 160px, 180px"
              priority
            />
          </div>

          <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#A7E46A]">
            Research Management
          </p>
          <h3
            id={`research-manager-title-${profile.id}`}
            className="mt-3 text-[28px] font-semibold leading-[1.14]"
          >
            {profile.role}
          </h3>
          <p className="mt-4 text-[21px] font-semibold leading-[1.25] text-white">
            {profile.name}
          </p>
          <p className="mt-3 text-[15px] leading-7 text-white/76">
            {profile.credentials}
          </p>

          <div className="mt-6 space-y-3 border-t border-white/12 pt-6">
            {profile.emails.map((email) => (
              <a
                key={email}
                href={`mailto:${email}`}
                className="block break-all text-[14px] font-medium text-[#D9F5CC] transition hover:text-white"
              >
                {email}
              </a>
            ))}
            <p className="text-[14px] font-medium text-white/78">{profile.phone}</p>
          </div>
        </div>

        <div className="min-h-0 flex-1 px-6 py-6 md:px-8 md:py-8 lg:overflow-y-auto lg:px-10 lg:py-10">
          <div className="mx-auto max-w-[720px]">
            <div className="grid gap-4 md:grid-cols-3">
              {profile.profilePoints.map((point) => (
                <div
                  key={point}
                  className="rounded-[22px] border border-[#E3EBDD] bg-[#F8FBF6] px-5 py-5"
                >
                  <div className="h-2 w-10 rounded-full bg-[linear-gradient(90deg,#20C997_0%,#A1DF0A_100%)]" />
                  <p className="mt-4 text-[14px] leading-7 text-[#446255]">{point}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[28px] border border-[#E3EBDD] bg-white px-5 py-6 shadow-[0_18px_50px_rgba(15,63,29,0.05)] md:px-7 md:py-7">
              <h4 className="text-[22px] font-semibold text-[#15341F]">
                Profile overview
              </h4>
              <div className="mt-5 space-y-5">
                {profile.biography.map((paragraph) => (
                  <p key={paragraph} className="text-[15px] leading-8 text-[#4A5F54]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResearchManagersSection() {
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const activeProfile = useMemo(
    () =>
      activeProfileId
        ? researchManagers.find((profile) => profile.id === activeProfileId) ?? null
        : null,
    [activeProfileId]
  );

  const openProfile = (profileId: string) => {
    setActiveProfileId(profileId);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setIsModalVisible(true);
      });
    });
  };

  const closeProfile = () => {
    setIsModalVisible(false);
    window.setTimeout(() => {
      setActiveProfileId(null);
    }, MODAL_TRANSITION_MS);
  };

  return (
    <section className="relative overflow-hidden bg-white px-4 pb-72 pt-16 md:px-6 md:pb-80 md:pt-20 lg:px-36 lg:pb-[22rem] lg:pt-24">
      <div className="relative mx-auto w-full max-w-[1480px]">
        <div>
          <GradientTag
            text="Research Leadership"
            className="inline-block"
            gradientFrom="#20C997"
            gradientTo="#A1DF0A"
          />

          <div className="mt-6 max-w-[860px]">
            <GradientTitle
              part1="Profiles shaping"
              part2=" RRISL research direction"
              lineBreak={false}
              part1Color="dark-green"
              size="custom"
              customSize="clamp(2.2rem,4vw,4rem)"
              className="leading-[1.06]"
            />
          </div>

          <p className="mt-5 max-w-[760px] text-[16px] leading-8 text-[#5A6B61] md:text-[17px]">
            Explore the institute&apos;s research management team through a cleaner,
            more readable profile format. Each card surfaces the essentials first,
            with the full profile available on demand.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:gap-10 lg:grid-cols-2">
          {researchManagers.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onOpen={() => openProfile(profile.id)}
            />
          ))}
        </div>
      </div>

      {activeProfile ? (
        <ProfileModal
          profile={activeProfile}
          isVisible={isModalVisible}
          onClose={closeProfile}
        />
      ) : null}
    </section>
  );
}
