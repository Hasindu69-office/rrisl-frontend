import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHero from '../../../../components/shared/PageHero';
import PhotoAlbumShowcase from '../../../../components/media-gallery/PhotoAlbumShowcase';
import { normalizeLocale } from '../../../../lib/locale';
import { mapPhotoGalleryAlbumData } from '../../../../lib/photo-gallery/pageData';
import {
  getPhotoGalleryAlbumBySlug,
  getPhotoGalleryAlbumSlugs,
  getPhotoGalleryPage,
} from '../../../../lib/strapi';

interface PhotoAlbumPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ locale?: string }>;
}

export async function generateStaticParams() {
  return getPhotoGalleryAlbumSlugs('en');
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
  const album = await getPhotoGalleryAlbumBySlug(slug, locale);

  return {
    title: album ? `${album.albumname} | Photo Gallery` : 'Photo Gallery Album',
    description: album?.albumsummary,
  };
}

export default async function PhotoAlbumPage({
  params,
  searchParams,
}: PhotoAlbumPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const locale = normalizeLocale(query.locale);
  const [albumRecord, page] = await Promise.all([
    getPhotoGalleryAlbumBySlug(slug, locale),
    getPhotoGalleryPage(locale),
  ]);

  if (!albumRecord) {
    notFound();
  }

  const album = mapPhotoGalleryAlbumData(albumRecord, page);

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title={album.title}
        breadcrumbItems={[
          { label: album.labels.home, href: '/' },
          {
            label: album.labels.photoGallery,
            href: '/media-gallery/photo-gallery',
          },
          { label: album.labels.album },
        ]}
        backgroundImage={album.coverImage}
        backgroundImageAlt={album.imageAlt}
        locale={locale}
      />

      <PhotoAlbumShowcase album={album} />
    </div>
  );
}
