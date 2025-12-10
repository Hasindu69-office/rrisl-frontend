import { getHomePage, getGlobalLayout, getMenuBySlug, getAllAnnouncements } from '@/app/lib/strapi';
import HomeHeroWithHeader from './components/home/HomeHeroWithHeader';
import AnnouncementCard from './components/home/AnnouncementCard';
import AnnouncementSlider from './components/home/AnnouncementSlider';

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
      <HomeHeroWithHeader 
        hero={hero}
        globalLayout={globalLayout}
        leftMenuItems={leftMenuItems}
        rightMenuItems={rightMenuItems}
        announcements={showAnnouncementCard && allAnnouncements && allAnnouncements.length > 0 ? allAnnouncements : []}
      />
      
      {/* Next Section - Placeholder */}
      <section className="relative bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Next Section
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              This is a placeholder section to help visualize the layout and test scrolling.
              You can replace this with your actual content.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
