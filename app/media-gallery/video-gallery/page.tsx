import PageHero from '../../components/shared/PageHero';
import MediaAlbumSlider, {
  type MediaAlbumSlide,
} from '../../components/media-gallery/MediaAlbumSlider';

interface VideoGalleryPageProps {
  searchParams: Promise<{ locale?: string }>;
}

const videoGalleryAlbums: MediaAlbumSlide[] = [
  {
    id: 'annual-research-symposium',
    title: 'Annual Research Symposium Highlights',
    imageSrc: '/images/section7_img4.jpg',
    imageAlt: 'Research symposium and institutional event setting',
    href: '/media-gallery/video-gallery/albums/annual-research-symposium-highlights',
  },
  {
    id: 'field-extension-programme',
    title: 'Field Extension Programme Coverage',
    imageSrc: '/images/section7_img1.jpg',
    imageAlt: 'Field extension programme event',
    href: '/media-gallery/video-gallery/albums/field-extension-programme-coverage',
  },
  {
    id: 'laboratory-demonstrations',
    title: 'Laboratory Demonstration Sessions',
    imageSrc: '/images/section7_img2.jpg',
    imageAlt: 'Laboratory demonstration and audience setting',
    href: '/media-gallery/video-gallery/albums/laboratory-demonstration-sessions',
  },
  {
    id: 'stakeholder-forum',
    title: 'Stakeholder Forum and Panel Discussions',
    imageSrc: '/images/Aboutussection3imgs.jpg',
    imageAlt: 'Stakeholder forum discussion setting',
    href: '/media-gallery/video-gallery/albums/stakeholder-forum-and-panel-discussions',
  },
  {
    id: 'green-campus-visit',
    title: 'Green Campus and Estate Visit Stories',
    imageSrc: '/images/Bgimg5.jpg',
    imageAlt: 'Green campus and estate environment',
    href: '/media-gallery/video-gallery/albums/green-campus-and-estate-visit-stories',
  },
];

export default async function VideoGalleryPage({
  searchParams,
}: VideoGalleryPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';

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

      <MediaAlbumSlider slides={videoGalleryAlbums} locale={locale} />
    </div>
  );
}
