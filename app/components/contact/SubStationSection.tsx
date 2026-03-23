import SubStationCard from './SubStationCard';
import type { SubStationCardData } from './subStationData';

interface SubStationSectionProps {
  titlePart1: string;
  titlePart2: string;
  cards: SubStationCardData[];
}

export default function SubStationSection({
  titlePart1,
  titlePart2,
  cards,
}: SubStationSectionProps) {
  return (
    <section className="mt-20">
      <h2 className="text-[34px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#0F3F1D] md:text-[48px]">
        {titlePart1}{' '}
        <span
          className="inline-block bg-clip-text text-transparent"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(32, 201, 151, 1), rgba(161, 223, 10, 1))',
          }}
        >
          - {titlePart2}
        </span>
      </h2>

      <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-10 xl:gap-x-20 xl:gap-y-16">
        {cards.map((card) => (
          <SubStationCard key={card.name} {...card} />
        ))}
      </div>
    </section>
  );
}
