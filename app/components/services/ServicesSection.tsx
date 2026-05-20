'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';
import { serviceHighlights, testingServiceGroups } from './servicesData';
import type { TestingServiceGroup } from './servicesData';
import Button from '../ui/Button';

const POPUP_SESSION_KEY_PREFIX = 'rrisl-services-sample-submission-popup';

interface SampleSubmissionPopup {
  imageSrc: string;
  imageAlt: string;
}

interface ServicesSectionProps {
  locale: string;
  description?: string;
  sampleSubmissionPopup?: SampleSubmissionPopup | null;
}

function HighlightTiles() {
  return (
    <div className="mt-10 grid gap-5 md:grid-cols-3 lg:mt-12">
      {serviceHighlights.map(({ title, description, Icon }) => (
        <article
          key={title}
          className="group relative overflow-hidden rounded-[18px] border border-[#DDEAD7] bg-[#F7FBF5] p-5 shadow-[0_14px_34px_rgba(15,63,29,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,63,29,0.1)] md:p-6"
        >
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_10px_24px_rgba(46,125,50,0.12)]">
            <Icon className="h-6 w-6 text-[#2E7D32]" strokeWidth={2.2} />
          </div>

          <h3 className="text-[18px] font-semibold leading-[1.3] text-[#0F3F1D] md:text-[20px]">
            {title}
          </h3>
          <p className="mt-3 text-[15px] leading-[1.75] text-[#334339] md:text-[16px]">
            {description}
          </p>
        </article>
      ))}
    </div>
  );
}

function ServicesTable({ group }: { group: TestingServiceGroup }) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-b-[18px] border-t border-[#E0EADC] bg-white md:block">
        <table className="w-full table-fixed border-collapse">
          <thead className="bg-[#F3FAEE] text-left">
            <tr>
              <th className="w-[96px] px-5 py-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#2E7D32]">
                No.
              </th>
              <th className="px-5 py-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#2E7D32]">
                Name of the Test
              </th>
            </tr>
          </thead>
          <tbody>
            {group.items.map((item) => (
              <tr key={item.number} className="border-t border-[#E9EFE4]">
                <td className="px-5 py-3.5 align-top text-[15px] font-semibold text-[#0F3F1D]">
                  {item.number.toString().padStart(2, '0')}
                </td>
                <td className="px-5 py-3.5 text-[15px] leading-[1.65] text-[#1F2E24]">
                  {item.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 border-t border-[#E0EADC] bg-white p-4 md:hidden">
        {group.items.map((item) => (
          <div
            key={item.number}
            className="flex gap-3 rounded-[14px] border border-[#E7EFE1] bg-[#FAFCF7] p-3"
          >
            <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-[#2E7D32] text-[12px] font-semibold text-white">
              {item.number.toString().padStart(2, '0')}
            </span>
            <p className="pt-1 text-[14px] leading-[1.6] text-[#1F2E24]">
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

function TestingAccordion() {
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set(testingServiceGroups[0] ? [testingServiceGroups[0].title] : []),
  );

  return (
    <div className="mt-10 space-y-5 md:mt-12">
      {testingServiceGroups.map((group) => {
        const isOpen = openGroups.has(group.title);
        const panelId = `testing-service-panel-${group.range}`;
        const buttonId = `testing-service-trigger-${group.range}`;
        let transitionDuration = 'duration-500';

        if (group.items.length > 30) {
          transitionDuration = 'duration-1000';
        } else if (group.items.length > 15) {
          transitionDuration = 'duration-700';
        }

        return (
          <article
            key={group.title}
            className="overflow-hidden rounded-[20px] border border-[#DCE9D5] bg-white shadow-[0_16px_40px_rgba(15,63,29,0.06)]"
          >
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() =>
                setOpenGroups((current) => {
                  const next = new Set(current);

                  if (next.has(group.title)) {
                    next.delete(group.title);
                  } else {
                    next.add(group.title);
                  }

                  return next;
                })
              }
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left md:px-7 md:py-6"
            >
              <div>
                <div className="mb-2 inline-flex rounded-full bg-[#EFF8EA] px-3 py-1 text-[12px] font-semibold text-[#2E7D32]">
                  Tests {group.range}
                </div>
                <h3 className="text-[18px] font-semibold leading-[1.3] text-[#0F3F1D] md:text-[22px]">
                  {group.title}
                </h3>
              </div>

              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3FAEE] text-[#2E7D32] transition-transform duration-300 ease-out ${
                  isOpen ? 'rotate-180' : 'rotate-0'
                }`}
              >
                <ChevronDown className="h-5 w-5" strokeWidth={2.4} />
              </span>
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-[grid-template-rows,opacity] ${transitionDuration} ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <ServicesTable group={group} />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function SampleSubmissionPopup({
  popup,
  locale,
}: {
  popup: SampleSubmissionPopup;
  locale: string;
}) {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    const sessionKey = `${POPUP_SESSION_KEY_PREFIX}:${locale}`;

    try {
      if (window.sessionStorage.getItem(sessionKey) === 'shown') {
        return false;
      }

      window.sessionStorage.setItem(sessionKey, 'shown');
    } catch {
      return true;
    }

    return true;
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex min-h-dvh items-center justify-center bg-[#03140B]/72 px-3 py-3 backdrop-blur-[6px] sm:px-4 md:px-6 lg:px-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="services-sample-submission-popup-title"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="relative flex w-full max-w-[860px] flex-col overflow-hidden rounded-[24px] border border-white/14 bg-[#F8FBF6] shadow-[0_40px_120px_rgba(0,0,0,0.34)] md:rounded-[28px] lg:rounded-[30px]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute right-3 top-3 z-20 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[#0F3F1D]/82 text-white backdrop-blur-sm transition hover:bg-[#A1DF0A] hover:text-[#10341B] focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:right-4 md:top-4"
          aria-label="Close sample submission guide"
        >
          <X className="h-5 w-5" strokeWidth={2.1} aria-hidden="true" />
        </button>

        <div className="sr-only">
          <h3
            id="services-sample-submission-popup-title"
          >
            Rubber Sample Submission Guide
          </h3>
        </div>

        <div className="bg-[linear-gradient(180deg,#F6F9F3_0%,#FFFFFF_100%)] p-3 sm:p-4 md:p-5 lg:p-6">
          <div className="rounded-[22px] border border-[#E1EBDD] bg-white p-2.5 shadow-[0_18px_40px_rgba(15,63,29,0.08)] sm:rounded-[24px] sm:p-3 md:rounded-[26px] md:p-4">
            <div className="rounded-[18px] border border-dashed border-[#D7E4D1] bg-[#FAFCF8] p-2 sm:rounded-[20px] sm:p-3 md:rounded-[22px] md:p-4">
              <div className="relative mx-auto aspect-[5/7] w-full max-w-[560px] max-h-[70dvh] overflow-hidden rounded-[16px] bg-white shadow-[0_18px_40px_rgba(15,63,29,0.08)]">
                <Image
                  src={popup.imageSrc}
                  alt={popup.imageAlt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 767px) 78vw, (max-width: 1279px) 62vw, 560px"
                  priority
                  unoptimized={popup.imageSrc.includes('localhost')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesSection({
  locale,
  description,
  sampleSubmissionPopup,
}: ServicesSectionProps) {
  const serviceDescription =
    description ||
    'All research and extension departments of RRISL provide advice on every aspect of rubber agronomy and technology to stakeholders. The Institute also supports academic programs of universities and other higher education institutions by supervising students, and contributes to human resource development programs of other organizations by training teachers and stakeholders. When analytical services are provided, a nominal fee is charged to cover basic costs.';

  return (
    <>
      <section className="bg-white px-4 pb-72 pt-14 md:px-6 md:pb-72 md:pt-20 lg:px-36 lg:pb-84 lg:pt-24">
        <div className="mx-auto w-full max-w-[1480px]">
          <div className="max-w-[960px]">
            <div>
              <GradientTag
                text="Our Services"
                className="mb-5 md:mb-6"
                backgroundColor="#ffffff"
                padding="px-8 py-2"
              />

              <GradientTitle
                part1="Research, Extension"
                part2="& Analytical Services"
                size="custom"
                className="max-w-[820px] text-[32px] md:text-[42px] lg:text-[54px]"
                style={{ lineHeight: '1.14' }}
              />

              <p className="mt-6 max-w-[860px] text-justify text-[16px] leading-[1.9] text-[#26362B] md:text-[18px]">
                {serviceDescription}
              </p>
            </div>
          </div>

          <HighlightTiles />

          <div className="mt-16 rounded-[28px] bg-[#F6FAF2] px-4 py-10 md:mt-20 md:px-8 md:py-14 lg:px-10 lg:py-16">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <GradientTag
                  text="Testing Services"
                  className="mb-5"
                  backgroundColor="#F6FAF2"
                  padding="px-8 py-2"
                />

                <GradientTitle
                  part1="Laboratory Tests"
                  part2="Available at RRISL"
                  size="custom"
                  className="text-[30px] md:text-[40px] lg:text-[50px]"
                  style={{ lineHeight: '1.15' }}
                />
              </div>

              <p className="max-w-[430px] text-[15px] leading-[1.8] text-[#405144] md:text-[16px]">
                The following laboratory tests are carried out by the Rubber Research Institute of
                Sri Lanka.
              </p>
            </div>

            <TestingAccordion />

            <div className="mt-10 overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#0F3F1D_0%,#2E7D32_100%)] p-6 shadow-[0_18px_44px_rgba(15,63,29,0.18)] md:mt-12 md:p-8 lg:p-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-[720px]">
                  <h3 className="text-[24px] font-semibold leading-[1.25] text-white md:text-[30px]">
                    Need more information about a testing service?
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.8] text-white/82 md:text-[17px]">
                    Contact RRISL for service availability, sample submission guidance, and fee
                    details.
                  </p>
                </div>

                <Link href="/contact" className="shrink-0">
                  <Button
                    variant="outline"
                    size="md"
                    className="border-[#2E7D32] bg-white text-[#2E7D32] shadow-md hover:bg-[#2E7D32] hover:text-white"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {sampleSubmissionPopup ? (
        <SampleSubmissionPopup popup={sampleSubmissionPopup} locale={locale} />
      ) : null}
    </>
  );
}
