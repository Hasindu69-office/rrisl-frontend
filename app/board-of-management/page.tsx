import PageHero from '../components/shared/PageHero';
import AttendanceSection from '../components/board-of-management/AttendanceSection';
import BoardMembersSection from '../components/board-of-management/BoardMembersSection';
import { mapBoardOfManagementPageData } from '../lib/board-of-management/pageData';
import { normalizeLocale } from '../lib/locale';
import { getBoardMembers, getManagementBoardPage } from '../lib/strapi';

interface BoardOfManagementPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function BoardOfManagementPage({
  searchParams,
}: BoardOfManagementPageProps) {
  const params = await searchParams;
  const locale = normalizeLocale(params.locale);
  const [page, fallbackPage, boardMembers, attendanceMembers] = await Promise.all([
    getManagementBoardPage(locale),
    locale === 'en' ? Promise.resolve(null) : getManagementBoardPage('en'),
    getBoardMembers('Member Board', locale),
    getBoardMembers('In Attendance', locale),
  ]);
  const viewModel = mapBoardOfManagementPageData(
    page,
    fallbackPage,
    boardMembers,
    attendanceMembers
  );

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title={viewModel.hero.title}
        breadcrumbItems={viewModel.hero.breadcrumbItems}
        backgroundImage={viewModel.hero.backgroundImage}
        backgroundImageAlt={viewModel.hero.backgroundImageAlt}
        locale={locale}
      />

      <BoardMembersSection
        title={viewModel.memberBoardTitle}
        members={viewModel.boardMembers}
        emptyStateTitle={viewModel.emptyStateTitle}
        emptyStateDescription={viewModel.emptyStateDescription}
      />
      <AttendanceSection
        title={viewModel.attendanceTitle}
        members={viewModel.attendanceMembers}
        emptyStateTitle={viewModel.emptyStateTitle}
        emptyStateDescription={viewModel.emptyStateDescription}
      />
    </div>
  );
}
