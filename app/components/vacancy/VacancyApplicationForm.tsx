import { ArrowRight } from 'lucide-react';

interface VacancyApplicationFormProps {
  contactNumberLabel: string;
  cvLabel: string;
  emailLabel: string;
  fullNameLabel: string;
  heading: string;
  jobTitle: string;
  submitLabel: string;
}

function FormField({
  id,
  label,
  type = 'text',
  accept,
}: {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'file';
  accept?: string;
}) {
  const commonClasses =
    'mt-3 block w-full rounded-[8px] border border-[#E5E7EB] bg-white px-4 text-[15px] text-[#111827] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10';

  return (
    <div>
      <label htmlFor={id} className="text-[15px] font-medium text-[#374151]">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        accept={accept}
        className={`${commonClasses} ${
          type === 'file'
            ? 'min-h-[150px] px-4 py-4 file:mr-4 file:rounded-[6px] file:border-0 file:bg-[#EEF6EE] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#2E7D32] hover:file:bg-[#E4F1E4]'
            : 'h-[52px]'
        }`}
      />
    </div>
  );
}

export default function VacancyApplicationForm({
  contactNumberLabel,
  cvLabel,
  emailLabel,
  fullNameLabel,
  heading,
  jobTitle,
  submitLabel,
}: VacancyApplicationFormProps) {
  return (
    <section id="apply-form" className="mt-14 scroll-mt-28">
      <h2 className="text-[34px] font-semibold leading-tight text-[#1F3552]">
        {heading}
      </h2>

      <form className="mt-8 space-y-6" action="#" method="post" encType="multipart/form-data">
        <input type="hidden" name="jobTitle" value={jobTitle} />

        <FormField id="fullName" label={fullNameLabel} />
        <FormField id="email" label={emailLabel} type="email" />
        <FormField id="contactNumber" label={contactNumberLabel} type="tel" />
        <FormField
          id="cv"
          label={cvLabel}
          type="file"
          accept=".pdf,.doc,.docx"
        />

        <button
          type="submit"
          className="inline-flex min-h-[52px] items-center justify-center gap-4 rounded-[2px] bg-[#2E7D32] px-6 text-sm font-medium text-white transition hover:bg-[#256A2A] focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:ring-offset-2"
          aria-label={`Send application for ${jobTitle}`}
        >
          <span>{submitLabel}</span>
          <ArrowRight className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
        </button>
      </form>
    </section>
  );
}
