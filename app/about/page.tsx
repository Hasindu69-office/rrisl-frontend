import PageHero from '../components/shared/PageHero';
import WhoWeAreSection from '../components/about/WhoWeAreSection';
import MissionVisionSection from '../components/about/MissionVisionSection';
import ObjectivesSection from '../components/about/ObjectivesSection';
import { getAboutPage } from '../lib/strapi';
import { normalizeLocale } from '../lib/locale';
import { mapAboutHero } from '../lib/about/hero';
import { mapAboutFirstContent } from '../lib/about/firstContent';
import { mapAboutMissionVision } from '../lib/about/missionVision';
import { mapAboutObjectives } from '../lib/about/objectives';

interface AboutProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function About({ searchParams }: AboutProps) {
  const params = await searchParams;
  const locale = normalizeLocale(params.locale);
  const [aboutPage, fallbackAboutPage] = await Promise.all([
    getAboutPage(locale),
    locale !== 'en' ? getAboutPage('en') : Promise.resolve(null),
  ]);
  const hero = mapAboutHero(aboutPage, fallbackAboutPage);
  const firstContent = mapAboutFirstContent(aboutPage, fallbackAboutPage);
  const missionVision = mapAboutMissionVision(aboutPage, fallbackAboutPage);
  const objectives = mapAboutObjectives(aboutPage, fallbackAboutPage);

  return (
    <div className="min-h-screen">
      {/* Page Hero Section */}
      <PageHero
        title={hero.title}
        breadcrumbItems={hero.breadcrumbItems}
        backgroundImage={hero.backgroundImage}
        backgroundImageAlt={hero.backgroundImageAlt}
        locale={locale}
      />

      {/* Who We Are Section */}
      <WhoWeAreSection
        tag={firstContent.tag}
        title={firstContent.title}
        highlightedText={firstContent.highlightedText}
        description={firstContent.description}
        outlineLines={firstContent.outlineLines}
      />

      {/* Mission & Vision Section */}
      <MissionVisionSection
        visionLabel={missionVision.visionLabel}
        vision={missionVision.vision}
        missionLabel={missionVision.missionLabel}
        mission={missionVision.mission}
      />

      {/* Our Objectives Section */}
      <ObjectivesSection
        eyebrow={objectives.eyebrow}
        title={objectives.title}
        highlightedText={objectives.highlightedText}
        objectives={objectives.objectives}
        imageSrc={objectives.imageSrc}
        imageAlt={objectives.imageAlt}
      />

    </div>
  );
}
