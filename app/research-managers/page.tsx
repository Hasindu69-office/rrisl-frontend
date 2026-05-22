import PageHero from '../components/shared/PageHero';
import ResearchManagersSection from '../components/research-managers/ResearchManagersSection';
import { mapResearchManagersPageData } from '../lib/research-managers/pageData';
import { normalizeLocale } from '../lib/locale';
import { getResearchManagers, getResearchManagersPage } from '../lib/strapi';

interface ResearchManagersPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function ResearchManagersPage({
  searchParams,
}: ResearchManagersPageProps) {
  const params = await searchParams;
  const locale = normalizeLocale(params.locale);
  const [page, fallbackPage, researchManagers, fallbackResearchManagers] =
    await Promise.all([
      getResearchManagersPage(locale),
      locale !== 'en' ? getResearchManagersPage('en') : Promise.resolve(null),
      getResearchManagers(locale),
      locale !== 'en' ? getResearchManagers('en') : Promise.resolve([]),
    ]);
  const viewModel = mapResearchManagersPageData(
    page,
    fallbackPage,
    researchManagers,
    fallbackResearchManagers
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

      <ResearchManagersSection
        section={viewModel.section}
        labels={viewModel.labels}
        profiles={viewModel.profiles}
      />
    </div>
  );
}
