import { getHomePage, getGlobalLayout, getMenuBySlug } from '@/app/lib/strapi';
import HomeHeroWithHeader from './components/home/HomeHeroWithHeader';
import NewsCard from './components/home/NewsCard';
import AnnouncementCard from './components/home/AnnouncementCard';

interface HomeProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  // Await searchParams in Next.js 15+
  const params = await searchParams;
  // Get locale from URL search params, default to 'en'
  const locale = params.locale || 'en';

  const [homePage, globalLayout] = await Promise.all([
    getHomePage(locale),
    getGlobalLayout(locale),
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
  
  // Check if news/announcement items exist in current locale
  const hasNewsItems = hero.hero_news_items && Array.isArray(hero.hero_news_items) && hero.hero_news_items.length > 0;
  const hasAnnouncementItem = !!hero.hero_annoucements_items;
  
  // Always fetch English version as fallback for non-English locales
  // Relations (news/announcements) might not be localized in Strapi
  let fallbackHomePage: typeof homePage | null = null;
  if (locale !== 'en') {
    fallbackHomePage = await getHomePage('en');
  }
  
  // Use current locale data if available, otherwise fallback to English
  const newsItems = hasNewsItems 
    ? hero.hero_news_items 
    : (fallbackHomePage?.hero?.hero_news_items || []);
  
  const announcementItem = hasAnnouncementItem
    ? hero.hero_annoucements_items
    : (fallbackHomePage?.hero?.hero_annoucements_items || null);
  
  // For show flags: prefer current locale, but use English fallback if current locale doesn't have data
  // If we're using fallback data, we should also use fallback show flags
  const usingFallbackNews = !hasNewsItems && newsItems.length > 0;
  const usingFallbackAnnouncement = !hasAnnouncementItem && !!announcementItem;
  
  const showNewsCardFlag = usingFallbackNews
    ? (fallbackHomePage?.hero?.showNewsCard ?? true)
    : (hero.showNewsCard ?? true);
  
  const showAnnouncementCardFlag = usingFallbackAnnouncement
    ? (fallbackHomePage?.hero?.showAnnouncementCard ?? true)
    : (hero.showAnnouncementCard ?? true);
  
  // Determine if cards should be shown
  const showNewsCard = showNewsCardFlag && newsItems && newsItems.length > 0;
  const showAnnouncementCard = showAnnouncementCardFlag && announcementItem;

  return (
    <div className="min-h-screen">
      {/* Combined Header and Hero Section */}
      <HomeHeroWithHeader 
        hero={hero}
        globalLayout={globalLayout}
        leftMenuItems={leftMenuItems}
        rightMenuItems={rightMenuItems}
      />
      
      {/* News and Announcement Cards Section */}
      {(showNewsCard || showAnnouncementCard) && (
        <section className="relative z-10 bg-white py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Latest News Card */}
              {showNewsCard && (
                <NewsCard
                  title={hero.newsCardTitle || 'Latest News'}
                  newsItems={newsItems}
                />
              )}

              {/* Announcement Card */}
              {showAnnouncementCard && (
                <AnnouncementCard
                  title={hero.announcementCardTitle || 'Announcements'}
                  announcement={announcementItem}
                />
              )}
            </div>
          </div>
        </section>
      )}
      
      {/* Other sections will go here */}
    </div>
  );
}
