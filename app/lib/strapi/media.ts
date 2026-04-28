import { STRAPI_API_URL } from './client';

export function getStrapiMediaUrl(media: any): string | null {
  if (!media) {
    return null;
  }

  if (media.data?.attributes?.url) {
    const url = media.data.attributes.url;
    return url.startsWith('http') ? url : `${STRAPI_API_URL}${url}`;
  }

  if (media.attributes?.url) {
    const url = media.attributes.url;
    return url.startsWith('http') ? url : `${STRAPI_API_URL}${url}`;
  }

  if (media.url) {
    return media.url.startsWith('http') ? media.url : `${STRAPI_API_URL}${media.url}`;
  }

  return null;
}

export function getStrapiImageUrl(image: any): string | null {
  return getStrapiMediaUrl(image);
}

export function getOptimizedImageUrl(
  image: any,
  format: 'thumbnail' | 'small' | 'medium' | 'large' = 'small'
): string | null {
  if (!image) {
    return null;
  }

  let formats = null;

  if (image.data?.attributes?.formats) {
    formats = image.data.attributes.formats;
  } else if (image.attributes?.formats) {
    formats = image.attributes.formats;
  } else if (image.formats) {
    formats = image.formats;
  }

  if (formats && formats[format]?.url) {
    const formatUrl = formats[format].url;
    return formatUrl.startsWith('http') ? formatUrl : `${STRAPI_API_URL}${formatUrl}`;
  }

  return getStrapiImageUrl(image);
}
