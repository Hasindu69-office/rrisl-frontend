import PageHero from '../../components/shared/PageHero';
import MediaAlbumSlider from '../../components/media-gallery/MediaAlbumSlider';
import { normalizeLocale } from '../../lib/locale';
import { mapVideoGalleryPageData } from '../../lib/video-gallery/pageData';
import { getVideoGalleryAlbums, getVideoGalleryPage } from '../../lib/strapi';

interface VideoGalleryPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function VideoGalleryPage({
  searchParams,
}: VideoGalleryPageProps) {
  const params = await searchParams;
  const locale = normalizeLocale(params.locale);
  const [page, albums] = await Promise.all([
    getVideoGalleryPage(locale),
    getVideoGalleryAlbums(locale),
  ]);
  const pageData = mapVideoGalleryPageData(page, albums);

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
