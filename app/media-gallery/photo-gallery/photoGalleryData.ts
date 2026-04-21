export interface PhotoGalleryPhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
}

export interface PhotoGalleryAlbum {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  imageAlt: string;
  href: string;
  photos: PhotoGalleryPhoto[];
}

const sharedPhotoPool: PhotoGalleryPhoto[] = [
  {
    id: 'rubber-field-pathway',
    src: '/images/aboutusRubber.jpg',
    alt: 'Rubber field pathway at the institute',
    caption: 'Field pathway through mature rubber cultivation',
  },
  {
    id: 'research-field-visit',
    src: '/images/section7_img1.jpg',
    alt: 'Researchers and participants during a field visit',
    caption: 'Estate visit with technical and research teams',
  },
  {
    id: 'forest-research-site',
    src: '/images/Bgimg5.jpg',
    alt: 'Dense green forest research environment',
    caption: 'Conservation landscape and field study context',
  },
  {
    id: 'outreach-programme',
    src: '/images/section7_img2.jpg',
    alt: 'Outreach programme with participants',
    caption: 'Knowledge transfer programme for stakeholders',
  },
  {
    id: 'presentation-session',
    src: '/images/Aboutussection3imgs.jpg',
    alt: 'Presentation and knowledge sharing session',
    caption: 'Technical discussion and knowledge sharing',
  },
  {
    id: 'rubber-research-campus',
    src: '/images/Bgimg.jpg',
    alt: 'Green research campus landscape',
    caption: 'Research environment shaped by rubber science',
  },
  {
    id: 'plant-research-detail',
    src: '/images/section6_img1.png',
    alt: 'Rubber plant research detail',
    caption: 'Plant material and research observations',
  },
  {
    id: 'estate-support',
    src: '/images/section7_img4.jpg',
    alt: 'Estate support and field activity',
    caption: 'Field support for growers and estate teams',
  },
];

function selectPhotos(photoIds: string[]) {
  return photoIds
    .map((photoId) => sharedPhotoPool.find((photo) => photo.id === photoId))
    .filter((photo): photo is PhotoGalleryPhoto => Boolean(photo));
}

export const photoGalleryAlbums: PhotoGalleryAlbum[] = [
  {
    id: 'special-scientific-committee',
    slug: 'special-scientific-committee-meeting',
    title: 'A Special Scientific Committee Meeting',
    description:
      'A visual record of scientific exchange, technical review, and institutional collaboration around rubber research priorities.',
    coverImage: '/images/aboutusRubber.jpg',
    imageAlt: 'Rubber field pathway during a research visit',
    href: '/media-gallery/photo-gallery/albums/special-scientific-committee-meeting',
    photos: selectPhotos([
      'rubber-field-pathway',
      'presentation-session',
      'research-field-visit',
      'plant-research-detail',
      'rubber-research-campus',
    ]),
  },
  {
    id: 'field-observations',
    slug: 'field-observations-and-estate-visits',
    title: 'Field Observations and Estate Visits',
    description:
      'Moments from estate visits, field diagnostics, and applied research observations across rubber growing environments.',
    coverImage: '/images/section7_img1.jpg',
    imageAlt: 'Research field visit with participants outdoors',
    href: '/media-gallery/photo-gallery/albums/field-observations-and-estate-visits',
    photos: selectPhotos([
      'research-field-visit',
      'rubber-field-pathway',
      'estate-support',
      'plant-research-detail',
      'outreach-programme',
      'rubber-research-campus',
    ]),
  },
  {
    id: 'forest-collection',
    slug: 'forest-collection-and-conservation-records',
    title: 'Forest Collection and Conservation Records',
    description:
      'Conservation-focused field imagery documenting landscapes, collection work, and ecological research settings.',
    coverImage: '/images/Bgimg5.jpg',
    imageAlt: 'Dense green forest research environment',
    href: '/media-gallery/photo-gallery/albums/forest-collection-and-conservation-records',
    photos: selectPhotos([
      'forest-research-site',
      'rubber-research-campus',
      'plant-research-detail',
      'rubber-field-pathway',
    ]),
  },
  {
    id: 'outreach-programmes',
    slug: 'extension-outreach-programmes',
    title: 'Extension Outreach Programmes',
    description:
      'A collection from training, extension, and outreach programmes connecting research knowledge with industry practice.',
    coverImage: '/images/section7_img2.jpg',
    imageAlt: 'Outreach programme venue and participants',
    href: '/media-gallery/photo-gallery/albums/extension-outreach-programmes',
    photos: selectPhotos([
      'outreach-programme',
      'estate-support',
      'research-field-visit',
      'presentation-session',
      'rubber-field-pathway',
      'plant-research-detail',
      'rubber-research-campus',
    ]),
  },
  {
    id: 'knowledge-sharing',
    slug: 'knowledge-sharing-sessions',
    title: 'Knowledge Sharing Sessions',
    description:
      'Highlights from briefings, presentations, and collaborative sessions where research findings are shared and discussed.',
    coverImage: '/images/Aboutussection3imgs.jpg',
    imageAlt: 'Knowledge sharing session and presentation setting',
    href: '/media-gallery/photo-gallery/albums/knowledge-sharing-sessions',
    photos: selectPhotos([
      'presentation-session',
      'outreach-programme',
      'research-field-visit',
      'rubber-research-campus',
      'estate-support',
    ]),
  },
];

export function getPhotoGalleryAlbum(slug: string) {
  return photoGalleryAlbums.find((album) => album.slug === slug) ?? null;
}
