import GradientTitle from '../ui/GradientTitle';
import BoardEmptyState from './BoardEmptyState';
import BoardMemberCard from './BoardMemberCard';

interface BoardMemberCardData {
  name: string;
  descriptor?: string;
  organizationText?: string;
  imageSrc: string;
  imageAlt: string;
}

interface BoardMembersSectionProps {
  title: {
    part1: string;
    part2: string;
  };
  members: BoardMemberCardData[];
  emptyStateTitle?: string;
  emptyStateDescription?: string;
}

export default function BoardMembersSection({
  title,
  members,
  emptyStateTitle,
  emptyStateDescription,
}: BoardMembersSectionProps) {
  return (
    <section className="bg-white px-4 py-16 md:px-6 md:py-20 lg:px-36 lg:py-24">
      <div className="mx-auto w-full max-w-[1480px]">
        <div className="flex justify-center text-center">
          <GradientTitle
            part1={title.part1}
            part2={title.part2}
            lineBreak={false}
            part1Color="dark-green"
            size="custom"
            customSize="clamp(32px, 4vw, 48px)"
            align="center"
            className="font-semibold leading-[1.2]"
          />
        </div>

        {members.length === 0 ? (
          <div className="mt-10 md:mt-12">
            <BoardEmptyState
              title={emptyStateTitle}
              description={emptyStateDescription}
            />
          </div>
        ) : (
          <div className="mx-auto mt-10 grid max-w-[380px] grid-cols-2 place-items-center gap-x-4 gap-y-5 md:mt-12 md:max-w-[560px] md:grid-cols-2 md:gap-x-8 md:gap-y-8 lg:max-w-[1450px] lg:grid-cols-3 lg:gap-x-[110px] lg:gap-y-[45px]">
            {members.map((member) => (
              <BoardMemberCard key={member.name} member={member} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
