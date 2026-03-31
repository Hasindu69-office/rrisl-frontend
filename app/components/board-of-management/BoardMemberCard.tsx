import Image from 'next/image';
import type { BoardMember } from './boardMembersData';

interface BoardMemberCardProps {
  member: BoardMember;
}

export default function BoardMemberCard({ member }: BoardMemberCardProps) {
  return (
    <article className="group flex h-[400px] w-full max-w-[410px] flex-col items-center rounded-[20px] bg-[#F5F5F5] px-4 pb-6 pt-5 text-center shadow-[0_12px_32px_rgba(15,63,29,0.04)] transition-[background-color,box-shadow] duration-200 ease-out md:px-5 motion-reduce:transition-none focus-within:bg-[#F7F8F4] focus-within:shadow-[0_14px_34px_rgba(15,63,29,0.08)] focus-within:ring-2 focus-within:ring-[#7DBB6A] focus-within:ring-offset-2 focus-within:ring-offset-white hover:bg-[#F7F8F4] hover:shadow-[0_14px_34px_rgba(15,63,29,0.08)]">
      <div className="relative mb-6 h-[182px] w-[182px] shrink-0">
        <div className="absolute inset-[10px] overflow-hidden rounded-full bg-white">
          <Image
            src={member.imageSrc}
            alt={member.imageAlt}
            fill
            className="object-cover"
            sizes="182px"
          />
        </div>
      </div>

      <h3 className="text-[18px] font-medium leading-[1.35] text-[#2D8A40] transition-colors duration-200 ease-out motion-reduce:transition-none group-hover:text-[#246F35] group-focus-within:text-[#246F35]">
        {member.name}
      </h3>

      {member.descriptor ? (
        <p className="mt-2 text-[13px] italic leading-[1.45] text-[#73AA64]">
          {member.descriptor}
        </p>
      ) : null}

      {member.role ? (
        <p className="mt-2 text-[14px] font-medium leading-[1.45] text-[#1E1E1E]">
          {member.role}
        </p>
      ) : null}

      {member.organizationLines?.length ? (
        <div className="mt-1.5 space-y-0.5">
          {member.organizationLines.map((line) => (
            <p key={line} className="text-[14px] leading-[1.5] text-[#1E1E1E]">
              {line}
            </p>
          ))}
        </div>
      ) : null}
    </article>
  );
}
