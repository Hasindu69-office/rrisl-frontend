import PageHero from '../../components/shared/PageHero';
import MediaAlbumSlider from '../../components/media-gallery/MediaAlbumSlider';
import { videoGalleryAlbums } from './videoGalleryData';

interface VideoGalleryPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function VideoGalleryPage({
  searchParams,
}: VideoGalleryPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';
  const albumSlides = videoGalleryAlbums.map((album) => ({
    id: album.id,
    title: album.title,
    imageSrc: album.coverImage,
    imageAlt: album.imageAlt,
    href: album.href,
  }));

  return (
    <div className="min-h-screen bg-white">
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

      <MediaAlbumSlider slides={albumSlides} locale={locale} />
    </div>
  );
}
