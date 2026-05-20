import PageHero from '../components/shared/PageHero';
import ServicesSection from '../components/services/ServicesSection';
import { normalizeLocale } from '../lib/locale';

interface ServicesPageProps {
  searchParams: Promise<{ locale?: string }>;
}

const SERVICES_DESCRIPTION =
  'All research and extension departments of RRISL provide advice on every aspect of rubber agronomy and technology to stakeholders. The Institute also supports academic programs of universities and other higher education institutions by supervising students, and contributes to human resource development programs of other organizations by training teachers and stakeholders. When analytical services are provided, a nominal fee is charged to cover basic costs.';

const SAMPLE_SUBMISSION_POPUP_IMAGES: Record<string, { imageSrc: string; imageAlt: string }> = {
  en: {
    imageSrc: '/images/Rubber_Digital_Edit_01-08-2021.jpg',
    imageAlt: 'Rubber sample submission guide',
  },
  si: {
    imageSrc: '/images/Rubber_Digital_Edit_01-08-2021.jpg',
    imageAlt: 'Rubber sample submission guide',
  },
  ta: {
    imageSrc: '/images/Rubber_Digital_Edit_01-08-2021.jpg',
    imageAlt: 'Rubber sample submission guide',
  },
};

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const params = await searchParams;
  const locale = normalizeLocale(params.locale);
  const sampleSubmissionPopup =
    SAMPLE_SUBMISSION_POPUP_IMAGES[locale] || SAMPLE_SUBMISSION_POPUP_IMAGES.en;

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title="Services"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Services' },
        ]}
        backgroundImageAlt="Services background"
        locale={locale}
      />

      <ServicesSection
        locale={locale}
        description={SERVICES_DESCRIPTION}
        sampleSubmissionPopup={sampleSubmissionPopup}
      />
    </div>
  );
}
