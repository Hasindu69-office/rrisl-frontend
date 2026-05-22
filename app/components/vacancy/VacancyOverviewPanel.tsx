import { BriefcaseBusiness, Clock3, GraduationCap, MapPin, ShieldCheck, WalletCards } from 'lucide-react';
import type { VacancyDetailViewModel } from '@/app/lib/vacancy/pageData';

interface VacancyOverviewPanelProps {
  heading: string;
  job: VacancyDetailViewModel;
  labels: {
    category: string;
    degree: string;
    experience: string;
    jobTitle: string;
    jobType: string;
    location: string;
    offeredSalary: string;
  };
}

function OverviewMapCard({ location }: { location: string }) {
  return (
    <div className="mt-6 overflow-hidden rounded-[16px] border border-white/50 bg-white/60 p-3 shadow-[0_8px_18px_rgba(15,63,29,0.05)]">
      <div className="overflow-hidden rounded-[12px]">
        <iframe
          title={`Map showing ${location}`}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1808.6909581613897!2d80.16835603466164!3d6.505526048127369!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3cdc1af9cd893%3A0x7ba21e419486df6a!2sDartanfield!5e1!3m2!1sen!2slk!4v1774417487392!5m2!1sen!2slk"
          width="600"
          height="450"
          className="h-[180px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <p className="mt-3 text-center text-xs font-medium text-[#4B5563]">{location}</p>
    </div>
  );
}

export default function VacancyOverviewPanel({
  heading,
  job,
  labels,
}: VacancyOverviewPanelProps) {
  const overviewItems = [
    {
      label: labels.jobTitle,
      value: job.title,
      icon: ShieldCheck,
    },
    {
      label: labels.jobType,
      value: job.employmentType,
      icon: Clock3,
    },
    {
      label: labels.category,
      value: job.category,
      icon: BriefcaseBusiness,
    },
    {
      label: labels.experience,
      value: job.experience,
      icon: ShieldCheck,
    },
    {
      label: labels.degree,
      value: job.degree,
      icon: GraduationCap,
    },
    {
      label: labels.offeredSalary,
      value: job.salaryRange,
      icon: WalletCards,
    },
    {
      label: labels.location,
      value: job.overviewLocation,
      icon: MapPin,
    },
  ];

  return (
    <aside className="h-fit rounded-[20px] bg-[#EAF4F5] p-6 shadow-[0_12px_28px_rgba(15,63,29,0.06)]">
      <h2 className="text-lg font-semibold text-[#111827]">{heading}</h2>

      <div className="mt-5 space-y-5">
        {overviewItems.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-start gap-3">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#2A9AA0]" strokeWidth={2} />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#6B7280]">
                {label}
              </p>
              <p className="mt-1 text-sm leading-6 text-[#4B5563]">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <OverviewMapCard location={job.overviewLocation} />
    </aside>
  );
}
