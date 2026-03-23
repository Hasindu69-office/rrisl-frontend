import PageHero from '../components/shared/PageHero';
import ContactInfoPanel from '../components/contact/ContactInfoPanel';
import ContactFormPanel from '../components/contact/ContactFormPanel';
import LocationSection from '../components/contact/LocationSection';
import SubStationSection from '../components/contact/SubStationSection';
import { headOfficeCard, laboratoryCard } from '../components/contact/locationData';
import { subStationCards } from '../components/contact/subStationData';

interface ContactPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title="Contact us"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Contact us' },
        ]}
        backgroundImageAlt="Contact us background"
        locale={locale}
      />

      <section className="bg-white px-4 py-16 md:px-6 md:py-20 lg:px-36 lg:py-24 mb-56">
        <div className="mx-auto w-full max-w-[1480px]">
          <div className="grid gap-0 lg:grid-cols-3">
            <div className="lg:col-span-1 lg:-ml-6 xl:-ml-8">
              <ContactInfoPanel />
            </div>

            <div className="lg:col-span-2">
              <ContactFormPanel />
            </div>
          </div>

          <div
            className="mt-16 -mx-4 px-4 py-12 md:-mx-6 md:px-6 md:py-16 lg:-mx-36 lg:px-36 lg:py-20"
            style={{ backgroundColor: 'rgba(245, 245, 245, 1)' }}
          >
            <div className="mx-auto w-full max-w-[1480px]">
              <LocationSection cards={[headOfficeCard, laboratoryCard]} />
            </div>
          </div>

          <div className="-mx-4 bg-white px-4 py-12 md:-mx-6 md:px-6 md:py-16 lg:-mx-36 lg:px-36 lg:py-20">
            <div className="mx-auto w-full max-w-[1480px]">
              <SubStationSection
                titlePart1="Rubber Research Institute"
                titlePart2="Sub-stations"
                cards={subStationCards}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
