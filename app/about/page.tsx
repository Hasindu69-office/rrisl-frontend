import PageHero from '../components/shared/PageHero';

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
        backgroundImage="/images/aboutus_heroimg.jpg"
        backgroundImageAlt="About Us background"
        locale={locale}
      />

      {/* Main Content Section */}
      <div className="relative bg-[#F5F5F0] py-16 md:py-24">
        {/* Subtle pattern overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(0, 0, 0, 0.02) 10px,
              rgba(0, 0, 0, 0.02) 20px
            )`,
          }}
        />
        
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1440px] relative z-10">
          <div className="max-w-4xl">
            {/* Title Section */}
            <div className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-2">
                <span className="text-[#0F3F1D]">Driving the Future of</span>
                <br />
                <span className="bg-gradient-to-r from-[#20C997] to-[#A1DF0A] bg-clip-text text-transparent">
                  Sri Lanka's Rubber Industry
                </span>
              </h2>
            </div>

            {/* Description */}
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                Rubber Research Institute of Sri Lanka is the oldest research institute on rubber in the world and is the nodal agency in Sri Lanka with the statutory responsibility for research and development on all aspects of rubber cultivation and processing for the benefit of the rubber industry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

