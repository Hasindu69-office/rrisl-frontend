import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHero from '../../../../components/shared/PageHero';
import VideoAlbumShowcase from '../../../../components/media-gallery/VideoAlbumShowcase';
import {
  getVideoGalleryAlbum,
  videoGalleryAlbums,
} from '../../videoGalleryData';

interface VideoAlbumPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ locale?: string }>;
}

export function generateStaticParams() {
  return videoGalleryAlbums.map((album) => ({
    slug: album.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const album = getVideoGalleryAlbum(slug);

  return {
    title: album ? `${album.title} | Video Gallery` : 'Video Gallery Album',
    description: album?.description,
  };
}

export default async function VideoAlbumPage({
  params,
  searchParams,
}: VideoAlbumPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const locale = query.locale || 'en';
  const album = getVideoGalleryAlbum(slug);

  if (!album) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title={album.title}
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Video Gallery', href: '/media-gallery/video-gallery' },
          { label: 'Album' },
        ]}
        backgroundImage={album.coverImage}
        backgroundImageAlt={album.imageAlt}
        locale={locale}
      />

      <VideoAlbumShowcase album={album} />
    </div>
  );
}
