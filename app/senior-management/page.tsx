import PageHero from '../components/shared/PageHero';
import SeniorManagementShowcaseSection from '../components/senior-management/SeniorManagementShowcaseSection';
import { mapSeniorManagementPageData } from '../lib/senior-management/pageData';
import { normalizeLocale } from '../lib/locale';
import { getSeniorManagementMembers, getSeniorManagementPage } from '../lib/strapi';

interface SeniorManagementPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function SeniorManagementPage({
  searchParams,
}: SeniorManagementPageProps) {
  const params = await searchParams;
  const locale = normalizeLocale(params.locale);
  const [page, fallbackPage, members, fallbackMembers] = await Promise.all([
    getSeniorManagementPage(locale),
    locale !== 'en' ? getSeniorManagementPage('en') : Promise.resolve(null),
    getSeniorManagementMembers(locale),
    locale !== 'en' ? getSeniorManagementMembers('en') : Promise.resolve([]),
  ]);
  const viewModel = mapSeniorManagementPageData(
    page,
    fallbackPage,
    members,
    fallbackMembers
  );

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-2">
      <PageHero
        title={viewModel.hero.title}
        breadcrumbItems={viewModel.hero.breadcrumbItems}
        backgroundImage={viewModel.hero.backgroundImage}
        backgroundImageAlt={viewModel.hero.backgroundImageAlt}
        locale={locale}
      />
      <div className="mb-64 md:mb-72 lg:mb-72">
        <SeniorManagementShowcaseSection items={viewModel.items} />
      </div>
    </div>
  );
}
