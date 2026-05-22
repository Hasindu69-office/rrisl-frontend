import { ArrowDownToLine, FileText } from 'lucide-react';

interface VacancyAttachmentLinkProps {
  buttonLabel: string;
  href: string;
  title: string;
}

export default function VacancyAttachmentLink({
  buttonLabel,
  href,
  title,
}: VacancyAttachmentLinkProps) {
  return (
    <section className="mt-10 rounded-[18px] border border-[#DDE6D7] bg-[linear-gradient(135deg,#F7FBF6_0%,#EEF7EF_100%)] p-5 shadow-[0_8px_24px_rgba(15,63,29,0.04)] md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#E4F1E4] text-[#2E7D32]">
            <FileText className="h-5 w-5" strokeWidth={2.1} />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#16324F]">{title}</h3>
          </div>
        </div>

        <a
          href={href}
          download
          className="inline-flex min-h-[46px] items-center justify-center gap-3 rounded-[8px] bg-[#2E7D32] px-5 text-sm font-semibold text-white transition hover:bg-[#256A2A] focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:ring-offset-2"
        >
          <ArrowDownToLine className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
          <span>{buttonLabel}</span>
        </a>
      </div>
    </section>
  );
}
