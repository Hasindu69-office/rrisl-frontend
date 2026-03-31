import GradientTitle from '../ui/GradientTitle';
import BoardMemberCard from './BoardMemberCard';
import { boardMembers } from './boardMembersData';

export default function BoardMembersSection() {
  return (
    <section className="bg-white px-4 py-16 md:px-6 md:py-20 lg:px-36 lg:py-24">
      <div className="mx-auto w-full max-w-[1480px]">
        <div className="flex justify-center text-center">
          <GradientTitle
            part1="Members"
            part2=" of the Board"
            lineBreak={false}
            part1Color="dark-green"
            size="custom"
            customSize="clamp(32px, 4vw, 48px)"
            align="center"
            className="font-semibold leading-[1.2]"
          />
        </div>

        <div className="mx-auto mt-12 grid max-w-[1450px] grid-cols-1 place-items-center gap-x-[110px] gap-y-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-[45px]">
          {boardMembers.map((member) => (
            <BoardMemberCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
