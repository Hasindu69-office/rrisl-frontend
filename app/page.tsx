import { Suspense } from 'react';
import { getHomePage, getGlobalLayout, getMenuBySlug, getAllAnnouncements } from '@/app/lib/strapi';
import HomeHeroWithHeader from './components/home/HomeHeroWithHeader';
import ContentSection from './components/home/ContentSection';
import IndustrySupportSection from './components/home/IndustrySupportSection';
import ResearchSection from './components/home/ResearchSection';
import DataInsightsSection from './components/home/DataInsightsSection';
import NewsBlogSection from './components/home/NewsBlogSection';
import ResearchNetworkSection from './components/home/ResearchNetworkSection';

interface HomeProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  // Await searchParams in Next.js 15+
  const params = await searchParams;
  // Get locale from URL search params, default to 'en'
  const locale = params.locale || 'en';

  const [homePage, globalLayout, allAnnouncements] = await Promise.all([
    getHomePage(locale),
    getGlobalLayout(locale),
    getAllAnnouncements(locale),
  ]);

  if (!homePage || !homePage.hero) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to RRISL
          </h1>
          <p className="text-lg text-gray-600">
            Content is loading...
          </p>
        </div>
      </div>
    );
  }

  // Fetch menus in parallel using slugs from global layout
  const [leftMenu, rightMenu] = await Promise.all([
    globalLayout?.headerLeftMenuSlug
      ? getMenuBySlug(globalLayout.headerLeftMenuSlug, locale)
      : Promise.resolve(null),
    globalLayout?.headerRightMenuSlug
      ? getMenuBySlug(globalLayout.headerRightMenuSlug, locale)
      : Promise.resolve(null),
  ]);

  // Extract menu items
  const leftMenuItems = leftMenu?.items || [];
  const rightMenuItems = rightMenu?.items || [];

  const { hero } = homePage;

  // Check if announcement item exists in current locale
  const hasAnnouncementItem = !!hero.hero_annoucements_items;

  // Always fetch English version as fallback for non-English locales
  // Relations (announcements) might not be localized in Strapi
  let fallbackHomePage: typeof homePage | null = null;
  if (locale !== 'en') {
    fallbackHomePage = await getHomePage('en');
  }

  const announcementItem = hasAnnouncementItem
    ? hero.hero_annoucements_items
    : (fallbackHomePage?.hero?.hero_annoucements_items || null);

  // For show flags: prefer current locale, but use English fallback if current locale doesn't have data
  // If we're using fallback data, we should also use fallback show flags
  const usingFallbackAnnouncement = !hasAnnouncementItem && !!announcementItem;

  const showAnnouncementCardFlag = usingFallbackAnnouncement
    ? (fallbackHomePage?.hero?.showAnnouncementCard ?? true)
    : (hero.showAnnouncementCard ?? true);

  // Determine if announcement card should be shown
  const showAnnouncementCard = showAnnouncementCardFlag && announcementItem;

  return (
    <div className="min-h-screen">
      {/* Combined Header and Hero Section */}
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }>
        <HomeHeroWithHeader
          hero={hero}
          globalLayout={globalLayout}
          leftMenuItems={leftMenuItems}
          rightMenuItems={rightMenuItems}
          announcements={showAnnouncementCard && allAnnouncements && allAnnouncements.length > 0 ? allAnnouncements : []}
        />
      </Suspense>

      {/* Announcement Content Section */}
      <div className="mt-2 md:mt-6 lg:mt-56">
        <ContentSection
          imageSrc="/images/sec1-img 1.png"
          imageAlt="Rubber Research Institute of Sri Lanka"
          tagText="Announcement"
          titlePart1="Advancing Rubber"
          titlePart2="Research for Sri Lanka's Future"
          description="Rubber Research Institute of Sri Lanka is the oldest research institute on rubber in the world and is the nodal agency in Sri Lanka with the statutory responsibility for research and development on all aspects of rubber cultivation and processing for the benefit of the rubber industry."
          buttonText="Read More"
          buttonLink="#"
        />
      </div>

      {/* Industry Support Section */}
      <IndustrySupportSection />

      {/* Research Section */}
      <ResearchSection />

      {/* Data Insights Section */}
      <DataInsightsSection />

      {/* News & Blog Section */}
      <div className="mt-[150px]">
        <NewsBlogSection />
      </div>

      {/* Research Network Section */}
      <div className="mt-[150px]">
        <ResearchNetworkSection />
      </div>
      
    </div>
  );
}
