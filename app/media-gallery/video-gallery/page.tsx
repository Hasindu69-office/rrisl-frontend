import PageHero from '../../components/shared/PageHero';

interface VideoGalleryPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function VideoGalleryPage({
  searchParams,
}: VideoGalleryPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title="Video Gallery"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Media Gallery' },
          { label: 'Video Gallery' },
        ]}
        backgroundImage="/images/aboutus_heroimg.jpg"
        backgroundImageAlt="Video gallery background"
        locale={locale}
      />
    </div>
  );
}
