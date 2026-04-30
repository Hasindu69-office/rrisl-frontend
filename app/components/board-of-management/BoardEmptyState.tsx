interface BoardEmptyStateProps {
  title?: string;
  description?: string;
}

export default function BoardEmptyState({
  title = 'There is no members uploaded at the moment.',
  description = 'Please check back later for upcoming board member updates.',
}: BoardEmptyStateProps) {
  return (
    <div className="mb-16 rounded-[24px] border border-[#DDE6D7] bg-[linear-gradient(135deg,#F7FBF6_0%,#EEF7EF_100%)] px-6 py-14 text-center shadow-[0_8px_24px_rgba(15,63,29,0.04)] md:px-10">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-2xl font-semibold text-[#16324F] md:text-3xl">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-[#5B6470] md:text-base">{description}</p>
      </div>
    </div>
  );
}
