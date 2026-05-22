import PageHero from '../components/shared/PageHero';
import ContactInfoPanel from '../components/contact/ContactInfoPanel';
import ContactFormPanel from '../components/contact/ContactFormPanel';
import LocationSection from '../components/contact/LocationSection';
import SubStationSection from '../components/contact/SubStationSection';
import { mapContactPageData } from '../lib/contact/pageData';
import { normalizeLocale } from '../lib/locale';
import { getContactPage, getContactSubjects } from '../lib/strapi';

interface ContactPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const locale = normalizeLocale(params.locale);
  const [contactPage, contactSubjects, fallbackContactPage, fallbackContactSubjects] =
    await Promise.all([
      getContactPage(locale),
      getContactSubjects(locale),
      locale !== 'en' ? getContactPage('en') : Promise.resolve(null),
      locale !== 'en' ? getContactSubjects('en') : Promise.resolve([]),
    ]);
  const pageData = mapContactPageData(
    contactPage,
    fallbackContactPage,
    contactSubjects,
    fallbackContactSubjects
  );

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title={pageData.hero.title}
        breadcrumbItems={pageData.hero.breadcrumbItems}
        backgroundImage={pageData.hero.backgroundImage}
        backgroundImageAlt={pageData.hero.backgroundImageAlt}
        locale={locale}
      />

      <section className="bg-white px-4 py-16 md:px-6 md:py-20 lg:px-36 lg:py-24 mb-56">
        <div className="mx-auto w-full max-w-[1480px]">
          <div className="grid gap-0 lg:grid-cols-3">
            <div className="lg:col-span-1 lg:-ml-6 xl:-ml-8">
              <ContactInfoPanel {...pageData.infoPanel} />
            </div>

            <div className="lg:col-span-2">
              <ContactFormPanel {...pageData.formPanel} />
            </div>
          </div>

          <div
            className="-mx-4 px-4 py-8 md:-mx-6 md:px-6 md:py-16 lg:-mx-36 lg:px-36 lg:py-6"
            style={{ backgroundColor: 'rgba(245, 245, 245, 1)' }}
          >
            <div className="mx-auto w-full max-w-[1480px]">
              <LocationSection cards={pageData.locationCards} />
            </div>
          </div>

          <div className="-mx-4 bg-white px-4 py-2 md:-mx-6 md:px-6 md:py-16 lg:-mx-36 lg:px-36 lg:py-6">
            <div className="mx-auto w-full max-w-[1480px]">
              <SubStationSection
                titlePart1={pageData.subStationTitlePart1}
                titlePart2={pageData.subStationTitlePart2}
                cards={pageData.subStationCards}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
