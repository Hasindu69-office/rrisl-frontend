import Image from 'next/image';
import PageHero from '../components/shared/PageHero';
import GradientTitle from '../components/ui/GradientTitle';
import GradientTag from '../components/ui/GradientTag';
import WhoWeAreSection from '../components/about/WhoWeAreSection';
import MissionVisionSection from '../components/about/MissionVisionSection';
import ObjectivesSlider from '../components/about/ObjectivesSlider';

interface AboutProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function About({ searchParams }: AboutProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';

  return (
    <div className="min-h-screen">
      {/* Page Hero Section */}
      <PageHero
        title="About us"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'About us' },
        ]}
        // backgroundImage defaults to /images/aboutus_heroimg.jpg
        backgroundImageAlt="About Us background"
        locale={locale}
      />

      {/* Who We Are Section */}
      <WhoWeAreSection locale={locale} />

      {/* Mission & Vision Section */}
      <MissionVisionSection />

      {/* Our Objectives Slider */}
      <ObjectivesSlider />

      <div className="h-[350px]"></div>
    </div>
  );
}

