import PageHero from '../components/shared/PageHero';
import FaqIntroSection from '../components/faq/FaqIntroSection';

interface FaqPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function FaqPage({ searchParams }: FaqPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title="FAQ section"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'FAQ section' },
        ]}
        backgroundImage="/images/faqbanner.webp"
        backgroundImageAlt="FAQ section background"
        locale={locale}
      />

      <FaqIntroSection />
    </div>
  );
}
