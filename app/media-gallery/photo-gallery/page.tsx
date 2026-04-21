import PageHero from '../../components/shared/PageHero';
import MediaAlbumSlider from '../../components/media-gallery/MediaAlbumSlider';
import { photoGalleryAlbums } from './photoGalleryData';

interface PhotoGalleryPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function PhotoGalleryPage({
  searchParams,
}: PhotoGalleryPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';
  const albumSlides = photoGalleryAlbums.map((album) => ({
    id: album.id,
    title: album.title,
    imageSrc: album.coverImage,
    imageAlt: album.imageAlt,
    href: album.href,
  }));

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Photo Gallery"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Media Gallery' },
          { label: 'Photo Gallery' },
        ]}
        backgroundImage="/images/aboutus_heroimg.jpg"
        backgroundImageAlt="Photo gallery background"
        locale={locale}
      />

      <MediaAlbumSlider slides={albumSlides} locale={locale} />
    </div>
  );
}
