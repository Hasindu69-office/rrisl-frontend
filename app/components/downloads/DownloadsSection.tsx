import PublicationCard from '../shared/PublicationCard';
import type { PublicationCardItem } from '../shared/PublicationCard';

interface DownloadsSectionProps {
  items: PublicationCardItem[];
  buttonLabel?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
}

export default function DownloadsSection({
  items,
  buttonLabel = 'Read More',
  emptyStateTitle = 'Currently there are no downloads',
  emptyStateDescription = 'Please check back later for upcoming downloadable resources and publications.',
}: DownloadsSectionProps) {
  return (
    <section className="bg-white px-4 pb-72 pt-14 md:px-6 md:pb-72 md:pt-16 lg:px-8 lg:pb-84 lg:pt-20">
      <div className="mx-auto w-full max-w-[1440px]">
        {items.length === 0 ? (
          <div className="mb-16 rounded-[24px] border border-[#DDE6D7] bg-[linear-gradient(135deg,#F7FBF6_0%,#EEF7EF_100%)] px-6 py-14 text-center shadow-[0_8px_24px_rgba(15,63,29,0.04)] md:px-10">
            <div className="mx-auto max-w-2xl">
              <h2 className="text-2xl font-semibold text-[#16324F] md:text-3xl">{emptyStateTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-[#5B6470] md:text-base">{emptyStateDescription}</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto grid justify-center gap-6 sm:grid-cols-2 md:[grid-template-columns:repeat(2,246px)] xl:[grid-template-columns:repeat(4,246px)]">
            {items.map((item) => (
              <PublicationCard
                key={item.id}
                item={item}
                className="mx-auto w-full max-w-[246px]"
                imageWrapperClassName="max-w-[210px] md:max-w-[220px]"
                titleClassName="text-[14px] font-medium leading-[1.35]"
                buttonLabel={buttonLabel}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
