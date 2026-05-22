import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHero from '../../../../components/shared/PageHero';
import VideoAlbumShowcase from '../../../../components/media-gallery/VideoAlbumShowcase';
import { normalizeLocale } from '../../../../lib/locale';
import { mapVideoGalleryAlbumData } from '../../../../lib/video-gallery/pageData';
import {
  getVideoGalleryAlbumBySlug,
  getVideoGalleryAlbumSlugs,
  getVideoGalleryPage,
} from '../../../../lib/strapi';

interface VideoAlbumPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ locale?: string }>;
}

export async function generateStaticParams() {
  return getVideoGalleryAlbumSlugs('en');
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ locale?: string }>;
}): Promise<Metadata> {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const locale = normalizeLocale(query.locale);
  const album = await getVideoGalleryAlbumBySlug(slug, locale);

  return {
    title: album ? `${album.videoalbumname} | Video Gallery` : 'Video Gallery Album',
    description: album?.videoalbumsummary,
  };
}

export default async function VideoAlbumPage({
  params,
  searchParams,
}: VideoAlbumPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const locale = normalizeLocale(query.locale);
  const [albumRecord, page] = await Promise.all([
    getVideoGalleryAlbumBySlug(slug, locale),
    getVideoGalleryPage(locale),
  ]);

  if (!albumRecord) {
    notFound();
  }

  const album = mapVideoGalleryAlbumData(albumRecord, page);

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title={album.title}
        breadcrumbItems={[
          { label: album.labels.home, href: '/' },
          {
            label: album.labels.videoGallery,
            href: '/media-gallery/video-gallery',
          },
          { label: album.labels.album },
        ]}
        backgroundImage={album.coverImage}
        backgroundImageAlt={album.imageAlt}
        locale={locale}
      />

      <VideoAlbumShowcase album={album} />
    </div>
  );
}
