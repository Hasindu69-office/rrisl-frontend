import Image from 'next/image';
import Link from 'next/link';
import { BriefcaseBusiness, Check, Clock3, MapPin, WalletCards } from 'lucide-react';
import Button from '@/app/components/ui/Button';
import VacancyApplicationForm from './VacancyApplicationForm';
import VacancyAttachmentLink from './VacancyAttachmentLink';
import VacancyOverviewPanel from './VacancyOverviewPanel';
import type {
  VacancyDetailLabelsViewModel,
  VacancyDetailViewModel,
  VacancyLabelsViewModel,
} from '@/app/lib/vacancy/pageData';

interface VacancyDetailContentProps {
  job: VacancyDetailViewModel;
  labels: VacancyLabelsViewModel;
  detailLabels: VacancyDetailLabelsViewModel;
}

function VacancySectionList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <section className="mt-10" data-vacancy-detail-reveal>
      <h2 className="text-[24px] font-semibold text-[#111827]">{title}</h2>
      <ul className="mt-5 space-y-4">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-[15px] leading-7 text-[#4B5563]">
            <Check className="mt-1 h-4 w-4 shrink-0 text-[#2E7D32]" strokeWidth={2.2} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function VacancyDetailContent({
  job,
  labels,
  detailLabels,
}: VacancyDetailContentProps) {
  const metaItems = [
    {
      key: 'category',
      icon: BriefcaseBusiness,
      value: job.category,
    },
    {
      key: 'jobType',
      icon: Clock3,
      value: job.employmentType,
    },
    {
      key: 'salary',
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
    <div className="min-w-0">
      <div
        className="flex flex-col gap-6 border-b border-[#E5E7EB] pb-8 lg:flex-row lg:items-start lg:justify-between"
        data-vacancy-detail-reveal
      >
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
              <h1 className="text-[28px] font-semibold leading-tight text-[#111827] md:text-[34px]">
                {job.title}
              </h1>
              <p className="mt-1 text-sm text-[#4B5563]">{job.category}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            {metaItems.map(({ key, icon: Icon, value }) => (
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

        <Link
          href="#apply-form"
          className="hidden lg:inline-flex"
          aria-label={`Apply for ${job.title}`}
        >
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="min-h-[46px] !rounded-[7px] px-8 text-sm font-semibold"
          >
            {labels.applyJobLabel}
          </Button>
        </Link>
      </div>

      <div className="mt-8 lg:hidden" data-vacancy-detail-reveal>
        <VacancyOverviewPanel
          heading={labels.overviewTitle}
          job={job}
          labels={labels.overviewItemLabels}
        />
      </div>

      <section className="mt-10" data-vacancy-detail-reveal>
        <h2 className="text-[24px] font-semibold text-[#111827]">{labels.descriptionTitle}</h2>
        <div className="mt-5 space-y-4 text-[15px] leading-7 text-[#4B5563]">
          {job.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <VacancySectionList title={labels.responsibilitiesTitle} items={job.responsibilities} />
      <VacancySectionList title={labels.skillsTitle} items={job.skills} />
      {job.noticeDocumentUrl ? (
        <div data-vacancy-detail-reveal>
          <VacancyAttachmentLink
            buttonLabel={labels.downloadButtonLabel}
            href={job.noticeDocumentUrl}
            title={labels.downloadNoticeTitle}
          />
        </div>
      ) : null}
      <div data-vacancy-detail-reveal>
        <VacancyApplicationForm
          contactNumberLabel={labels.contactNumberLabel}
          cvLabel={labels.cvLabel}
          emailLabel={labels.emailLabel}
          fullNameLabel={labels.fullNameLabel}
          heading={labels.applyFormTitle}
          jobTitle={job.title}
          slug={job.slug}
          submitLabel={labels.submitLabel}
          validationLabels={detailLabels.validationLabels}
        />
      </div>
    </div>
  );
}
