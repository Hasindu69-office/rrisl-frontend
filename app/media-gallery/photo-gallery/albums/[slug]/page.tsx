import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHero from '../../../../components/shared/PageHero';
import PhotoAlbumShowcase from '../../../../components/media-gallery/PhotoAlbumShowcase';
import {
  getPhotoGalleryAlbum,
  photoGalleryAlbums,
} from '../../photoGalleryData';

interface PhotoAlbumPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ locale?: string }>;
}

export function generateStaticParams() {
  return photoGalleryAlbums.map((album) => ({
    slug: album.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const album = getPhotoGalleryAlbum(slug);

  return {
    title: album ? `${album.title} | Photo Gallery` : 'Photo Gallery Album',
    description: album?.description,
  };
}

export default async function PhotoAlbumPage({
  params,
  searchParams,
}: PhotoAlbumPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const locale = query.locale || 'en';
  const album = getPhotoGalleryAlbum(slug);

  if (!album) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title={album.title}
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Photo Gallery', href: '/media-gallery/photo-gallery' },
          { label: 'Album' },
        ]}
        backgroundImage={album.coverImage}
        backgroundImageAlt={album.imageAlt}
        locale={locale}
      />

      <PhotoAlbumShowcase album={album} />
    </div>
  );
}
