import type { PublicationCardItem } from '../shared/PublicationCard';
import type { Download, DownloadPage } from '@/app/lib/types';
import { getOptimizedImageUrl, getStrapiImageUrl, getStrapiMediaUrl } from '@/app/lib/strapi';

const sharedBookImage = '/images/departments/recommendationBook.webp';
const DEFAULT_READ_MORE_LABEL = 'Read More';
const DEFAULT_EMPTY_STATE_TITLE = 'Currently there are no downloads';
const DEFAULT_EMPTY_STATE_DESCRIPTION =
  'Please check back later for upcoming downloadable resources and publications.';

function normalizeDownload(download: Download | { attributes?: Download } | null | undefined): Download | null {
  if (!download) {
    return null;
  }

  if ('attributes' in download && download.attributes) {
    return {
      ...download.attributes,
      id: download.attributes.id || (download as Download).id,
      documentId: download.attributes.documentId || (download as Download).documentId,
    };
  }

  return download as Download;
}

function mapDownloadToPublicationItem(download: Download | null): PublicationCardItem | null {
  if (!download) {
    return null;
  }

  const title = download.Title?.trim() || 'Untitled Download';
  const image =
    getOptimizedImageUrl(download.documentimage, 'medium') ||
    getOptimizedImageUrl(download.documentimage, 'small') ||
    getStrapiImageUrl(download.documentimage) ||
    sharedBookImage;
  const documentUrl = getStrapiMediaUrl(download.document) || '';

  return {
    id: String(download.id || download.documentId || title),
    title,
    imageSrc: image,
    imageAlt: download.documentimage?.alternativeText || title,
    fallbackImageSrc: sharedBookImage,
    readMoreHref: documentUrl,
    openInNewTab: Boolean(documentUrl),
    readMoreAriaLabel: `Open PDF for ${title}`,
  };
}

export function mapDownloadsItems(downloads: Download[] | null | undefined): PublicationCardItem[] {
  return (downloads || [])
    .map((item) => normalizeDownload(item))
    .map((item) => mapDownloadToPublicationItem(item))
    .filter((item): item is PublicationCardItem => item !== null);
}

export function getDownloadsReadMoreLabel(
  localizedPage?: DownloadPage | null,
  fallbackPage?: DownloadPage | null
): string {
  return localizedPage?.LabelReadMore || fallbackPage?.LabelReadMore || DEFAULT_READ_MORE_LABEL;
}

export function getDownloadsEmptyState(
  localizedPage?: DownloadPage | null,
  fallbackPage?: DownloadPage | null
): { title: string; description: string } {
  return {
    title:
      localizedPage?.ErrrorMessage?.title ||
      fallbackPage?.ErrrorMessage?.title ||
      DEFAULT_EMPTY_STATE_TITLE,
    description:
      localizedPage?.ErrrorMessage?.description ||
      fallbackPage?.ErrrorMessage?.description ||
      DEFAULT_EMPTY_STATE_DESCRIPTION,
  };
}
