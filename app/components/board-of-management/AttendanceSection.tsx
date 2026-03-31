import GradientTitle from '../ui/GradientTitle';
import BoardMemberCard from './BoardMemberCard';
import { attendanceMembers } from './boardMembersData';

export default function AttendanceSection() {
  return (
    <section className="bg-white px-4 pb-16 md:px-6 md:pb-20 lg:px-36 lg:pb-24 mb-64">
      <div className="mx-auto w-full max-w-[1480px]">
        <div className="flex justify-center text-center">
          <GradientTitle
            part1="In"
            part2=" Attendance"
            lineBreak={false}
            part1Color="dark-green"
            size="custom"
            customSize="clamp(32px, 4vw, 48px)"
            align="center"
            className="font-semibold leading-[1.2]"
          />
        </div>

        <div className="mx-auto mt-10 grid max-w-[380px] grid-cols-2 place-items-center gap-x-4 gap-y-5 md:mt-12 md:max-w-[560px] md:grid-cols-2 md:gap-x-8 md:gap-y-8 lg:max-w-[1450px] lg:grid-cols-3 lg:gap-x-[110px] lg:gap-y-[45px]">
          {attendanceMembers.map((member) => (
            <BoardMemberCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
