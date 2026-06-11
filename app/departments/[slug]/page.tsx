import { notFound } from 'next/navigation';
import PageHero from '../../components/shared/PageHero';
import DepartmentAnimatedSection from '../../components/department/DepartmentAnimatedSection';
import DepartmentSection from '../../components/department/DepartmentSection';
import DepartmentServicesSection from '../../components/department/DepartmentServicesSection';
import DepartmentStaffSection from '../../components/department/DepartmentStaffSection';
import DepartmentResearchHighlightsSection from '../../components/department/DepartmentResearchHighlightsSection';
import DepartmentCurrentProjectsSection from '../../components/department/DepartmentCurrentProjectsSection';
import DepartmentAwardsTimelineSection from '../../components/department/DepartmentAwardsTimelineSection';
import DepartmentPublicationsSection from '../../components/department/DepartmentPublicationsSection';
import DepartmentAchievementSection from '../../components/department/DepartmentAchievementSection';
import DepartmentRecommendationsSection from '../../components/department/DepartmentRecommendationsSection';
import { normalizeLocale } from '../../lib/locale';
import { getDepartmentPage } from '../../lib/strapi';
import {
  mapDepartmentAchievements,
  mapDepartmentAwardsTimeline,
  mapDepartmentCurrentProjects,
  mapDepartmentHero,
  mapDepartmentIntroduction,
  mapDepartmentPublications,
  mapDepartmentResearchHighlights,
  mapDepartmentResearchStaff,
  mapDepartmentServices,
} from '../../lib/departments/pageData';
import { mapDepartmentRecommendations } from '../../lib/departments/recommendationsData';

interface DepartmentPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ locale?: string }>;
}

export default async function DepartmentPage({
  params,
  searchParams,
}: DepartmentPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const locale = normalizeLocale(query.locale);
  const [departmentPage, fallbackDepartmentPage] = await Promise.all([
    getDepartmentPage(slug, locale),
    locale !== 'en' ? getDepartmentPage(slug, 'en') : Promise.resolve(null),
  ]);

  if (!departmentPage && !fallbackDepartmentPage) {
    notFound();
  }

  const hero = mapDepartmentHero(departmentPage, fallbackDepartmentPage, slug);
  const introduction = mapDepartmentIntroduction(
    departmentPage?.introductionsection,
    fallbackDepartmentPage?.introductionsection
  );
  const services = mapDepartmentServices(departmentPage, fallbackDepartmentPage);
  const researchStaff = mapDepartmentResearchStaff(departmentPage, fallbackDepartmentPage);
  const researchHighlights = mapDepartmentResearchHighlights(
    departmentPage,
    fallbackDepartmentPage
  );
  const currentProjects = mapDepartmentCurrentProjects(
    departmentPage,
    fallbackDepartmentPage,
    slug
  );
  const awardsTimeline = mapDepartmentAwardsTimeline(departmentPage, fallbackDepartmentPage);
  const publications = mapDepartmentPublications(departmentPage, fallbackDepartmentPage);
  const achievements = mapDepartmentAchievements(departmentPage, fallbackDepartmentPage);
  const recommendations = await mapDepartmentRecommendations(departmentPage, fallbackDepartmentPage);

  return (
    <div className="min-h-screen bg-white pb-56 md:pb-64 lg:pb-72">
      <PageHero
        title={hero.title}
        breadcrumbItems={hero.breadcrumbItems}
        backgroundImage={hero.backgroundImage}
        backgroundImageAlt={hero.backgroundImageAlt}
        locale={locale}
      />

      {introduction ? (
        <DepartmentAnimatedSection>
          <DepartmentSection
            tagText={introduction.tagText}
            titlePart1={introduction.titlePart1}
            titlePart2={introduction.titlePart2}
            titleLineBreak={false}
            description={introduction.description}
            points={introduction.points}
            videoUrl={introduction.videoUrl}
            videoTitle={introduction.videoTitle}
            containerClassName="w-[80%]"
          />
        </DepartmentAnimatedSection>
      ) : null}

      {services ? (
        <DepartmentAnimatedSection>
          <DepartmentServicesSection
            tagText={services.tagText}
            titlePart1={services.titlePart1}
            titlePart2={services.titlePart2}
            items={services.items}
            containerClassName="w-[80%]"
          />
        </DepartmentAnimatedSection>
      ) : null}

      {researchStaff ? (
        <DepartmentAnimatedSection>
          <DepartmentStaffSection
            tagText={researchStaff.tagText}
            titlePart1={researchStaff.titlePart1}
            titlePart2={researchStaff.titlePart2}
            staff={researchStaff.staff}
            containerClassName="w-[80%]"
          />
        </DepartmentAnimatedSection>
      ) : null}

      {researchHighlights ? (
        <DepartmentAnimatedSection y={28} duration={0.9}>
          <DepartmentResearchHighlightsSection
            tagText={researchHighlights.tagText}
            titlePart1={researchHighlights.titlePart1}
            titlePart2={researchHighlights.titlePart2}
            highlights={researchHighlights.highlights}
            containerClassName="w-[80%]"
          />
        </DepartmentAnimatedSection>
      ) : null}

      {currentProjects ? (
        <DepartmentAnimatedSection>
          <DepartmentCurrentProjectsSection
            tagText={currentProjects.tagText}
            titlePart1={currentProjects.titlePart1}
            titlePart2={currentProjects.titlePart2}
            projects={currentProjects.projects}
          />
        </DepartmentAnimatedSection>
      ) : null}

      {awardsTimeline ? (
        <DepartmentAnimatedSection y={30} duration={0.9}>
          <DepartmentAwardsTimelineSection
            tagText={awardsTimeline.tagText}
            titlePart1={awardsTimeline.titlePart1}
            titlePart2={awardsTimeline.titlePart2}
            items={awardsTimeline.items}
          />
        </DepartmentAnimatedSection>
      ) : null}

      {publications ? (
        <DepartmentAnimatedSection y={30} duration={0.9}>
          <DepartmentPublicationsSection
            title={publications.title}
            leftBackgroundImageSrc={publications.leftBackgroundImageSrc}
            leftBackgroundImageAlt={publications.leftBackgroundImageAlt}
            rightBackgroundImageSrc={publications.rightBackgroundImageSrc}
            rightBackgroundImageAlt={publications.rightBackgroundImageAlt}
            sections={publications.sections}
          />
        </DepartmentAnimatedSection>
      ) : null}

      {achievements ? (
        <DepartmentAnimatedSection>
          <DepartmentAchievementSection
            tagText={achievements.tagText}
            titlePart1={achievements.titlePart1}
            titlePart2={achievements.titlePart2}
            outlineText={achievements.outlineText}
            illustrationSrc={achievements.illustrationSrc}
            illustrationAlt={achievements.illustrationAlt}
            items={achievements.items}
          />
        </DepartmentAnimatedSection>
      ) : null}

      {recommendations ? (
        <DepartmentAnimatedSection>
          <DepartmentRecommendationsSection content={recommendations} />
        </DepartmentAnimatedSection>
      ) : null}
    </div>
  );
}
