import GradientTitle from '../ui/GradientTitle';
import DepartmentAnimatedSection from '../department/DepartmentAnimatedSection';
import BoardEmptyState from './BoardEmptyState';
import BoardMemberCard from './BoardMemberCard';

interface BoardMemberCardData {
  name: string;
  descriptor?: string;
  organizationText?: string;
  imageSrc: string;
  imageAlt: string;
}

interface AttendanceSectionProps {
  title: {
    part1: string;
    part2: string;
  };
  members: BoardMemberCardData[];
  emptyStateTitle?: string;
  emptyStateDescription?: string;
}

export default function AttendanceSection({
  title,
  members,
  emptyStateTitle,
  emptyStateDescription,
}: AttendanceSectionProps) {
  return (
    <section className="bg-white px-4 pb-16 md:px-6 md:pb-20 lg:px-36 lg:pb-24 mb-64">
      <DepartmentAnimatedSection className="mx-auto w-full max-w-[1480px]">
        <div className="flex justify-center text-center" data-department-reveal>
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
          <div className="mt-10 md:mt-12" data-department-reveal>
            <BoardEmptyState
              title={emptyStateTitle}
              description={emptyStateDescription}
            />
          </div>
        ) : (
          <div className="mx-auto mt-10 grid max-w-[380px] grid-cols-2 place-items-center gap-x-4 gap-y-5 md:mt-12 md:max-w-[560px] md:grid-cols-2 md:gap-x-8 md:gap-y-8 lg:max-w-[1450px] lg:grid-cols-3 lg:gap-x-[110px] lg:gap-y-[45px]">
            {members.map((member) => (
              <div key={member.name} data-department-reveal>
                <BoardMemberCard member={member} />
              </div>
            ))}
          </div>
        )}
      </DepartmentAnimatedSection>
    </section>
  );
}
