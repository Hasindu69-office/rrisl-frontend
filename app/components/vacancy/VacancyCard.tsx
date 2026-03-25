import Image from 'next/image';
import { BriefcaseBusiness, Clock3, WalletCards, MapPin } from 'lucide-react';
import type { VacancyJob } from './vacancyData';

interface VacancyCardProps {
  job: VacancyJob;
}

export default function VacancyCard({ job }: VacancyCardProps) {
  const metadata = [
    {
      key: 'category',
      icon: BriefcaseBusiness,
      value: job.category,
    },
    {
      key: 'employmentType',
      icon: Clock3,
      value: job.employmentType,
    },
    {
      key: 'salaryRange',
      icon: WalletCards,
      value: job.salaryRange,
    },
    {
      key: 'location',
      icon: MapPin,
      value: job.location,
    },
  ];

  return (
    <article className="rounded-[18px] border border-[#A9B1B8] bg-white px-5 py-6 shadow-[0_8px_24px_rgba(15,63,29,0.06)] md:px-7 md:py-7 lg:px-6 lg:py-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-4">
            <div className="relative mt-1 h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-[#B5C0C9]">
              <Image
                src="/images/rrisl-logo-only.webp"
                alt="RRISL logo"
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>

            <div className="min-w-0">
              <h2 className="text-[22px] font-semibold leading-tight text-[#111827]">
                {job.title}
              </h2>
              <p className="mt-2 text-sm text-[#3F3F46]">{job.organization}</p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            {metadata.map(({ key, icon: Icon, value }) => (
              <div
                key={key}
                className="flex items-center gap-2 text-sm leading-none text-[#5B6470]"
              >
                <Icon className="h-4 w-4 shrink-0 text-[#2E7D32]" strokeWidth={1.9} />
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 justify-start lg:justify-end">
          <button
            type="button"
            className="inline-flex min-h-[40px] items-center justify-center rounded-[7px] bg-[#2E7D32] px-5 text-sm font-semibold text-white transition hover:bg-[#256A2A] focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:ring-offset-2"
            aria-label={`View details for ${job.title}`}
          >
            Job Details
          </button>
        </div>
      </div>
    </article>
  );
}
