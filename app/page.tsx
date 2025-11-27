import { getHomePage, getGlobalLayout, getMenuBySlug } from '@/app/lib/strapi';
import HomeHeroWithHeader from './components/home/HomeHeroWithHeader';

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

  return (
    <div className="min-h-screen">
      {/* Combined Header and Hero Section */}
      <HomeHeroWithHeader 
        hero={homePage.hero}
        globalLayout={globalLayout}
        leftMenuItems={leftMenuItems}
        rightMenuItems={rightMenuItems}
      />
      
      {/* Other sections will go here */}
    </div>
  );
}
