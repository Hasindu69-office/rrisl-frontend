import PageHero from '../../components/shared/PageHero';
import MediaAlbumSlider from '../../components/media-gallery/MediaAlbumSlider';
import { normalizeLocale } from '../../lib/locale';
import { getPhotoGalleryAlbums, getPhotoGalleryPage } from '../../lib/strapi';
import { mapPhotoGalleryPageData } from '../../lib/photo-gallery/pageData';

interface PhotoGalleryPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function PhotoGalleryPage({
  searchParams,
}: PhotoGalleryPageProps) {
  const params = await searchParams;
  const locale = normalizeLocale(params.locale);
  const [page, albums] = await Promise.all([
    getPhotoGalleryPage(locale),
    getPhotoGalleryAlbums(locale),
  ]);
  const pageData = mapPhotoGalleryPageData(page, albums);

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title={pageData.hero.title}
        breadcrumbItems={pageData.hero.breadcrumbItems}
        backgroundImage={pageData.hero.backgroundImage}
        backgroundImageAlt={pageData.hero.backgroundImageAlt}
        locale={locale}
      />

      <MediaAlbumSlider slides={pageData.slides} locale={locale} />
    </div>
  );
}
