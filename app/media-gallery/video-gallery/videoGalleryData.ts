export interface VideoGalleryItem {
  id: string;
  title: string;
  description?: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  sourceType: 'youtube' | 'local';
  src: string;
  duration?: string;
}

export interface VideoGalleryAlbum {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  imageAlt: string;
  href: string;
  videos: VideoGalleryItem[];
}

const sharedVideoPool: VideoGalleryItem[] = [
  {
    id: 'research-symposium-overview',
    title: 'Research Symposium Overview',
    description: 'Highlights from presentations, discussions, and institutional research updates.',
    thumbnailSrc: '/images/section7_img4.jpg',
    thumbnailAlt: 'Research symposium setting',
    sourceType: 'youtube',
    src: 'https://www.youtube.com/embed/LOD3iDKE4Bw',
    duration: '04:12',
  },
  {
    id: 'field-extension-story',
    title: 'Field Extension Story',
    description: 'A field-focused look at practical knowledge sharing with estate teams.',
    thumbnailSrc: '/images/section7_img1.jpg',
    thumbnailAlt: 'Field extension programme outdoors',
    sourceType: 'youtube',
    src: 'https://www.youtube.com/embed/LOD3iDKE4Bw',
    duration: '03:45',
  },
  {
    id: 'laboratory-demonstration',
    title: 'Laboratory Demonstration',
    description: 'Technical demonstration footage from applied rubber research activities.',
    thumbnailSrc: '/images/section7_img2.jpg',
    thumbnailAlt: 'Laboratory demonstration session',
    sourceType: 'youtube',
    src: 'https://www.youtube.com/embed/LOD3iDKE4Bw',
    duration: '05:20',
  },
  {
    id: 'stakeholder-panel',
    title: 'Stakeholder Panel Discussion',
    description: 'Panel conversation with research, industry, and extension stakeholders.',
    thumbnailSrc: '/images/Aboutussection3imgs.jpg',
    thumbnailAlt: 'Stakeholder forum discussion setting',
    sourceType: 'youtube',
    src: 'https://www.youtube.com/embed/LOD3iDKE4Bw',
    duration: '07:08',
  },
  {
    id: 'green-campus-story',
    title: 'Green Campus Story',
    description: 'A visual story from estate landscapes and green research environments.',
    thumbnailSrc: '/images/Bgimg5.jpg',
    thumbnailAlt: 'Green campus and estate environment',
    sourceType: 'youtube',
    src: 'https://www.youtube.com/embed/LOD3iDKE4Bw',
    duration: '04:55',
  },
  {
    id: 'rubber-research-journey',
    title: 'Rubber Research Journey',
    description: 'A short feature on rubber cultivation, research context, and field work.',
    thumbnailSrc: '/images/aboutusRubber.jpg',
    thumbnailAlt: 'Rubber field pathway',
    sourceType: 'youtube',
    src: 'https://www.youtube.com/embed/LOD3iDKE4Bw',
    duration: '06:16',
  },
];

function selectVideos(videoIds: string[]) {
  return videoIds
    .map((videoId) => sharedVideoPool.find((video) => video.id === videoId))
    .filter((video): video is VideoGalleryItem => Boolean(video));
}

export const videoGalleryAlbums: VideoGalleryAlbum[] = [
  {
    id: 'annual-research-symposium',
    slug: 'annual-research-symposium-highlights',
    title: 'Annual Research Symposium Highlights',
    description:
      'Selected video highlights from research presentations, institutional updates, and symposium discussions.',
    coverImage: '/images/section7_img4.jpg',
    imageAlt: 'Research symposium and institutional event setting',
    href: '/media-gallery/video-gallery/albums/annual-research-symposium-highlights',
    videos: selectVideos([
      'research-symposium-overview',
      'stakeholder-panel',
      'rubber-research-journey',
    ]),
  },
  {
    id: 'field-extension-programme',
    slug: 'field-extension-programme-coverage',
    title: 'Field Extension Programme Coverage',
    description:
      'Video coverage from field visits, extension activity, and practical engagement with rubber growers.',
    coverImage: '/images/section7_img1.jpg',
    imageAlt: 'Field extension programme event',
    href: '/media-gallery/video-gallery/albums/field-extension-programme-coverage',
    videos: selectVideos([
      'field-extension-story',
      'rubber-research-journey',
      'green-campus-story',
      'research-symposium-overview',
    ]),
  },
  {
    id: 'laboratory-demonstrations',
    slug: 'laboratory-demonstration-sessions',
    title: 'Laboratory Demonstration Sessions',
    description:
      'Technical video sessions showing laboratory demonstrations and applied research practices.',
    coverImage: '/images/section7_img2.jpg',
    imageAlt: 'Laboratory demonstration and audience setting',
    href: '/media-gallery/video-gallery/albums/laboratory-demonstration-sessions',
    videos: selectVideos([
      'laboratory-demonstration',
      'research-symposium-overview',
      'rubber-research-journey',
    ]),
  },
  {
    id: 'stakeholder-forum',
    slug: 'stakeholder-forum-and-panel-discussions',
    title: 'Stakeholder Forum and Panel Discussions',
    description:
      'Forum footage, panel discussions, and stakeholder conversations connected to rubber industry development.',
    coverImage: '/images/Aboutussection3imgs.jpg',
    imageAlt: 'Stakeholder forum discussion setting',
    href: '/media-gallery/video-gallery/albums/stakeholder-forum-and-panel-discussions',
    videos: selectVideos([
      'stakeholder-panel',
      'research-symposium-overview',
      'field-extension-story',
      'laboratory-demonstration',
    ]),
  },
  {
    id: 'green-campus-visit',
    slug: 'green-campus-and-estate-visit-stories',
    title: 'Green Campus and Estate Visit Stories',
    description:
      'Video stories from estate visits, conservation settings, and green research environments.',
    coverImage: '/images/Bgimg5.jpg',
    imageAlt: 'Green campus and estate environment',
    href: '/media-gallery/video-gallery/albums/green-campus-and-estate-visit-stories',
    videos: selectVideos([
      'green-campus-story',
      'rubber-research-journey',
      'field-extension-story',
    ]),
  },
];

export function getVideoGalleryAlbum(slug: string) {
  return videoGalleryAlbums.find((album) => album.slug === slug) ?? null;
}
