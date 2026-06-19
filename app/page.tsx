import { Suspense } from 'react';
import {
  getAllAnnouncements,
  getAllEvents,
  getEventCategories,
  getEventPage,
  getAllNewsArticles,
  getDepartmentHomepageCurrentProjects,
  getEstateSubstations,
  getGlobalLayout,
  getHomePage,
  getHomepageResearchNetworkLocations,
  getHomepageStatistics,
  getMenuBySlug,
  getNewsAndBlogPage,
} from '@/app/lib/strapi';
import { mapAboutSection } from '@/app/lib/home/aboutSection';
import {
  extractDepartmentSlugsFromMenuItems,
  mapHomeResearchSection,
} from '@/app/lib/home/currentResearchSection';
import { mapDataInsightsSection } from '@/app/lib/home/dataInsightsSection';
import { mapHomeEventsProgramsSection } from '@/app/lib/home/eventsProgramsSection';
import { resolveHeroSlides } from '@/app/lib/home/hero';
import { mapIndustrySupportSection } from '@/app/lib/home/industrySupportSection';
import { mapHomeQuickLinksSection } from '@/app/lib/home/quickLinksSection';
import { mapHomeResearchNetworkSection } from '@/app/lib/home/researchNetworkSection';
import { resolveHomePageStats } from '@/app/lib/home/stats';
import { addLocaleToUrl, normalizeLocale } from '@/app/lib/locale';
import {
  formatArticleDate,
  getFeaturedArticle,
  getPrimaryCategory,
  mapNewsArticles,
  mapNewsPageData,
  NEWS_AND_BLOGS_ROUTE,
} from '@/app/lib/news/pageData';
import { mapEventsPageData } from '@/app/lib/events/pageData';
import HomeHeroWithHeader from './components/home/HomeHeroWithHeader';
import ContentSection from './components/home/ContentSection';
import IndustrySupportSection from './components/home/IndustrySupportSection';
import ResearchSection from './components/home/ResearchSection';
import DataInsightsSection from './components/home/DataInsightsSection';
import NewsBlogSection from './components/home/NewsBlogSection';
import ResearchNetworkSection from './components/home/ResearchNetworkSection';
import EventsProgramsSection from './components/home/EventsProgramsSection';
import HomeQuickLinksSection from './components/home/HomeQuickLinksSection';
import RubberAnnouncement from './components/home/RubberAnnouncement';
import type { HeaderCtaItem } from '@/app/lib/types';

interface HomeProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  // Await searchParams in Next.js 15+
  const params = await searchParams;
  // Get locale from URL search params, default to 'en'
  const locale = normalizeLocale(params.locale);

  const [
    homePage,
    fallbackHomePage,
    homePageStatistics,
    fallbackHomePageStatistics,
    globalLayout,
    fallbackGlobalLayout,
    allAnnouncements,
    localizedNewsPage,
    fallbackNewsPage,
    localizedNewsArticles,
    fallbackNewsArticles,
    researchNetworkLocations,
    localizedEstateSubstations,
    fallbackEstateSubstations,
    localizedEvents,
    fallbackEvents,
    localizedEventCategories,
    fallbackEventCategories,
    localizedEventPage,
    fallbackEventPage,
  ] = await Promise.all([
    getHomePage(locale),
    locale !== 'en' ? getHomePage('en') : Promise.resolve(null),
    getHomepageStatistics(locale),
    locale !== 'en' ? getHomepageStatistics('en') : Promise.resolve([]),
    getGlobalLayout(locale),
    locale !== 'en' ? getGlobalLayout('en') : Promise.resolve(null),
    getAllAnnouncements(locale),
    getNewsAndBlogPage(locale),
    locale !== 'en' ? getNewsAndBlogPage('en') : Promise.resolve(null),
    getAllNewsArticles(locale),
    locale !== 'en' ? getAllNewsArticles('en') : Promise.resolve([]),
    getHomepageResearchNetworkLocations(locale),
    getEstateSubstations(locale),
    locale !== 'en' ? getEstateSubstations('en') : Promise.resolve([]),
    getAllEvents(locale),
    locale !== 'en' ? getAllEvents('en') : Promise.resolve([]),
    getEventCategories(locale),
    locale !== 'en' ? getEventCategories('en') : Promise.resolve([]),
    getEventPage(locale),
    locale !== 'en' ? getEventPage('en') : Promise.resolve(null),
  ]);

  const effectiveHomePage = homePage?.hero
    ? homePage
    : fallbackHomePage;
  const heroSlides = resolveHeroSlides(homePage?.hero, fallbackHomePage?.hero);
  const heroStatistics = resolveHomePageStats(homePage?.stats, fallbackHomePage?.stats);

  if (!effectiveHomePage?.hero || heroSlides.length === 0) {
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

  const effectiveGlobalLayout = globalLayout || fallbackGlobalLayout;

  // Fetch menus in parallel using slugs from global layout
  const [leftMenu, fallbackLeftMenu, rightMenu, fallbackRightMenu] = await Promise.all([
    effectiveGlobalLayout?.headerLeftMenuSlug
      ? getMenuBySlug(effectiveGlobalLayout.headerLeftMenuSlug, locale)
      : Promise.resolve(null),
    locale !== 'en' && fallbackGlobalLayout?.headerLeftMenuSlug
      ? getMenuBySlug(fallbackGlobalLayout.headerLeftMenuSlug, 'en')
      : Promise.resolve(null),
    effectiveGlobalLayout?.headerRightMenuSlug
      ? getMenuBySlug(effectiveGlobalLayout.headerRightMenuSlug, locale)
      : Promise.resolve(null),
    locale !== 'en' && fallbackGlobalLayout?.headerRightMenuSlug
      ? getMenuBySlug(fallbackGlobalLayout.headerRightMenuSlug, 'en')
      : Promise.resolve(null),
  ]);

  // Extract menu items
  const leftMenuItems =
    leftMenu?.items && leftMenu.items.length > 0
      ? leftMenu.items
      : fallbackLeftMenu?.items || [];
  const rightMenuFirstItem =
    rightMenu?.items && rightMenu.items.length > 0
      ? rightMenu.items[0]
      : fallbackRightMenu?.items?.[0];
  const headerCta: HeaderCtaItem | null =
    rightMenuFirstItem?.title?.trim() && rightMenuFirstItem?.url?.trim()
      ? {
          title: rightMenuFirstItem.title.trim(),
          url: rightMenuFirstItem.url.trim(),
          target: rightMenuFirstItem.target || '_self',
        }
      : null;
  const departmentSlugs = extractDepartmentSlugsFromMenuItems(leftMenuItems);
  const [departmentCurrentProjectPages, fallbackDepartmentCurrentProjectPages] = await Promise.all([
    Promise.all(
      departmentSlugs.map((slug) => getDepartmentHomepageCurrentProjects(slug, locale))
    ),
    locale !== 'en'
      ? Promise.all(
          departmentSlugs.map((slug) => getDepartmentHomepageCurrentProjects(slug, 'en'))
        )
      : Promise.resolve(Array(departmentSlugs.length).fill(null)),
  ]);

  const localizedAnnouncement = homePage?.Announcement;
  const fallbackAnnouncement = fallbackHomePage?.Announcement;

  // Always fetch English version as fallback for non-English locales
  const aboutSection = mapAboutSection(
    homePage?.aboutSection || fallbackHomePage?.aboutSection
  );
  const industrySupportSection = mapIndustrySupportSection(
    homePage?.industrysupportsection || fallbackHomePage?.industrysupportsection
  );
  const dataInsightsSection = mapDataInsightsSection(
    homePage?.datainsightssection || fallbackHomePage?.datainsightssection,
    homePageStatistics.length > 0 ? homePageStatistics : fallbackHomePageStatistics
  );
  const researchNetworkSection = mapHomeResearchNetworkSection(
    homePage?.researchnetworksection || fallbackHomePage?.researchnetworksection,
    researchNetworkLocations,
    localizedEstateSubstations,
    fallbackEstateSubstations
  );
  const researchSection = mapHomeResearchSection(
    homePage?.currentresearchsection || fallbackHomePage?.currentresearchsection,
    departmentSlugs.map((slug, index) => ({
      slug,
      page: departmentCurrentProjectPages[index],
      fallbackPage: fallbackDepartmentCurrentProjectPages[index],
    }))
  );
  const announcementSection = localizedAnnouncement || fallbackAnnouncement || null;
  const showAnnouncementCard = announcementSection?.showAnnoucementCard ?? true;
  const announcementLabel = announcementSection?.annoucementlabel || 'Research & Institute Updates';
  const newsPageData = mapNewsPageData(localizedNewsPage, fallbackNewsPage, [], []);
  const newsSectionHeader =
    homePage?.newssectionheader || fallbackHomePage?.newssectionheader || null;
  const eventPageData = mapEventsPageData(
    localizedEventPage,
    fallbackEventPage,
    [],
    []
  );
  const homeEventsProgramsSection = mapHomeEventsProgramsSection(
    homePage?.eventsandprogramssection || fallbackHomePage?.eventsandprogramssection,
    {
      upcoming: eventPageData.labels.upcoming,
      past: eventPageData.labels.past,
      previous: eventPageData.labels.previous,
      next: eventPageData.labels.next,
    },
    localizedEvents,
    fallbackEvents,
    localizedEventCategories,
    fallbackEventCategories
  );
  const quickLinksSection = mapHomeQuickLinksSection(
    homePage?.quicklinkssection || fallbackHomePage?.quicklinkssection,
    locale
  );
  const newsArticles = mapNewsArticles(
    localizedNewsArticles.length > 0 ? localizedNewsArticles : fallbackNewsArticles
  );
  const featuredNewsArticle = getFeaturedArticle(newsArticles);
  const homepageNewsArticles = newsArticles
    .filter((article) => article.slug !== featuredNewsArticle?.slug)
    .slice(0, 3)
    .map((article) => ({
      imageSrc: article.featuredImage,
      imageAlt: article.featuredImageAlt,
      title: article.title,
      categoryLabel: getPrimaryCategory(article)?.label || newsPageData.labels.article,
      date: formatArticleDate(article.publishedDate),
      link: addLocaleToUrl(`${NEWS_AND_BLOGS_ROUTE}/${article.slug}`, locale),
    }));
  const homepageFeaturedArticle = featuredNewsArticle
    ? {
        imageSrc: featuredNewsArticle.featuredImage,
        imageAlt: featuredNewsArticle.featuredImageAlt,
        title: featuredNewsArticle.title,
        description: featuredNewsArticle.summary,
        categoryLabel:
          getPrimaryCategory(featuredNewsArticle)?.label || newsPageData.labels.article,
        date: formatArticleDate(featuredNewsArticle.publishedDate),
        link: addLocaleToUrl(`${NEWS_AND_BLOGS_ROUTE}/${featuredNewsArticle.slug}`, locale),
      }
    : null;

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
          heroes={heroSlides}
          statistics={heroStatistics}
          globalLayout={globalLayout}
          leftMenuItems={leftMenuItems}
          headerCta={headerCta}
          announcements={showAnnouncementCard && allAnnouncements && allAnnouncements.length > 0 ? allAnnouncements : []}
          announcementLabel={announcementLabel}
        />
      </Suspense>

      {/* Announcement Content Section */}
      <div className="mt-2 md:mt-6 lg:mt-56">
        {/* Mobile and Tablet: Show ContentSection, Hide RubberAnnouncement */}
        <div className="lg:hidden">
          <ContentSection
            imageSrc={aboutSection.imageSrc}
            imageAlt={aboutSection.imageAlt}
            tagText={aboutSection.eyebrow}
            titlePart1={aboutSection.title}
            titlePart2={aboutSection.highlightedText}
            description={aboutSection.description}
            cta={aboutSection.cta}
          />
        </div>
        
        {/* Desktop: Hide ContentSection, Show RubberAnnouncement */}
        <div className="hidden lg:block">
          <RubberAnnouncement
            tagText={aboutSection.eyebrow}
            titlePart1={aboutSection.title}
            titlePart2={aboutSection.highlightedText}
            description={aboutSection.description}
            cta={aboutSection.cta}
          />
        </div>
      </div>

      {/* Industry Support Section */}
      <IndustrySupportSection section={industrySupportSection} />

      {/* Research Section */}
      {researchSection ? <ResearchSection section={researchSection} /> : null}

      {/* Data Insights Section */}
      <DataInsightsSection section={dataInsightsSection} />

      {/* News & Blog Section */}
      <div className="mt-8 md:mt-16 lg:mt-[150px]">
        <NewsBlogSection
          featuredArticle={homepageFeaturedArticle}
          smallArticles={homepageNewsArticles}
          tagText={newsSectionHeader?.eyebrow?.trim() || newsPageData.labels.title}
          titlePart1={newsSectionHeader?.title?.trim() || 'Tips, Stories, and Updates from'}
          titlePart2={newsSectionHeader?.hightlightedtext?.trim() || 'Our Research Institute'}
          readMoreLabel={newsPageData.labels.readArticle}
        />
      </div>

      {/* Research Network Section */}
      <div className="mt-8 md:mt-16 lg:mt-[150px]">
        <ResearchNetworkSection section={researchNetworkSection} />
      </div>

      {/* Events & Programs Section */}
      <div className="mt-8 md:mt-16">
        <EventsProgramsSection section={homeEventsProgramsSection} />
      </div>

      {/* Home Quick Links Section */}
      <div className="mb-48 md:mb-62 lg:mb-[275px]">
        <HomeQuickLinksSection section={quickLinksSection} />
      </div>

    </div>
  );
}
