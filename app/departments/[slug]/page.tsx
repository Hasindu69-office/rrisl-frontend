import { notFound } from 'next/navigation';
import PageHero from '../../components/shared/PageHero';
import DepartmentAnimatedSection from '../../components/department/DepartmentAnimatedSection';
import DepartmentSection from '../../components/department/DepartmentSection';
import DepartmentServicesSection from '../../components/department/DepartmentServicesSection';
import DepartmentStaffSection from '../../components/department/DepartmentStaffSection';
import { normalizeLocale } from '../../lib/locale';
import { getDepartmentPage } from '../../lib/strapi';
import {
  mapDepartmentHero,
  mapDepartmentIntroduction,
  mapDepartmentResearchStaff,
  mapDepartmentServices,
} from '../../lib/departments/pageData';

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

  return (
    <div className="min-h-screen">
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
    </div>
  );
}
