import PageHero from '../components/shared/PageHero';
import AttendanceSection from '../components/board-of-management/AttendanceSection';
import BoardMembersSection from '../components/board-of-management/BoardMembersSection';

interface BoardOfManagementPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function BoardOfManagementPage({
  searchParams,
}: BoardOfManagementPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title="Board of management"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Board of management' },
        ]}
        backgroundImageAlt="Board of management background"
        locale={locale}
      />

      <BoardMembersSection />
      <AttendanceSection />
    </div>
  );
}
