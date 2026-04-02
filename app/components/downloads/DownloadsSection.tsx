import PublicationCard from '../shared/PublicationCard';
import { downloadsItems } from './downloadsData';

export default function DownloadsSection() {
  return (
    <section className="bg-white px-4 pb-72 pt-14 md:px-6 md:pb-72 md:pt-16 lg:px-8 lg:pb-84 lg:pt-20">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="mx-auto grid justify-center gap-6 sm:grid-cols-2 md:[grid-template-columns:repeat(2,246px)] xl:[grid-template-columns:repeat(4,246px)]">
          {downloadsItems.map((item) => (
            <PublicationCard
              key={item.id}
              item={item}
              className="mx-auto w-full max-w-[246px]"
              imageWrapperClassName="max-w-[210px] md:max-w-[220px]"
              titleClassName="text-[14px] font-medium leading-[1.35]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
