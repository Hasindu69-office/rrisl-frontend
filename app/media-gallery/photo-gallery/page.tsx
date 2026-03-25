import PageHero from '../../components/shared/PageHero';
import MediaAlbumSlider, {
  type MediaAlbumSlide,
} from '../../components/media-gallery/MediaAlbumSlider';

interface PhotoGalleryPageProps {
  searchParams: Promise<{ locale?: string }>;
}

const photoGalleryAlbums: MediaAlbumSlide[] = [
  {
    id: 'special-scientific-committee',
    title: 'A Special Scientific Committee Meeting',
    imageSrc: '/images/aboutusRubber.jpg',
    imageAlt: 'Rubber field pathway during a research visit',
    href: '/media-gallery/photo-gallery/albums/special-scientific-committee-meeting',
  },
  {
    id: 'field-observations',
    title: 'Field Observations and Estate Visits',
    imageSrc: '/images/section7_img1.jpg',
    imageAlt: 'Research field visit with participants outdoors',
    href: '/media-gallery/photo-gallery/albums/field-observations-and-estate-visits',
  },
  {
    id: 'forest-collection',
    title: 'Forest Collection and Conservation Records',
    imageSrc: '/images/Bgimg5.jpg',
    imageAlt: 'Dense green forest research environment',
    href: '/media-gallery/photo-gallery/albums/forest-collection-and-conservation-records',
  },
  {
    id: 'outreach-programmes',
    title: 'Extension Outreach Programmes',
    imageSrc: '/images/section7_img2.jpg',
    imageAlt: 'Outreach programme venue and participants',
    href: '/media-gallery/photo-gallery/albums/extension-outreach-programmes',
  },
  {
    id: 'knowledge-sharing',
    title: 'Knowledge Sharing Sessions',
    imageSrc: '/images/Aboutussection3imgs.jpg',
    imageAlt: 'Knowledge sharing session and presentation setting',
    href: '/media-gallery/photo-gallery/albums/knowledge-sharing-sessions',
  },
];

export default async function PhotoGalleryPage({
  searchParams,
}: PhotoGalleryPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';

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

      <MediaAlbumSlider slides={photoGalleryAlbums} locale={locale} />
    </div>
  );
}
