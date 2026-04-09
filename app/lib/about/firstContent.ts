import type { AboutPage } from '@/app/lib/types';

export interface AboutFirstContentViewModel {
  tag: string;
  title: string;
  highlightedText: string;
  description: string;
  outlineLines: string[];
}

const ABOUT_FIRST_CONTENT_FALLBACK: AboutFirstContentViewModel = {
  tag: 'Who We Are',
  title: 'Driving the Future of',
  highlightedText: "Sri Lanka's Rubber Industry",
  description:
    'Rubber Research Institute of Sri Lanka is the oldest research institute on rubber in the world and is the nodal agency in Sri Lanka with the statutory responsibility for research and development on all aspects of rubber cultivation and processing for the benefit of the rubber industry.',
  outlineLines: ['More than 100 years', 'of Excellence'],
};

function splitOutlineText(outlineText: string | null | undefined): string[] {
  if (!outlineText) {
    return ABOUT_FIRST_CONTENT_FALLBACK.outlineLines;
  }

  const normalizedText = outlineText.trim();

  if (!normalizedText) {
    return ABOUT_FIRST_CONTENT_FALLBACK.outlineLines;
  }

  if (normalizedText.includes('|')) {
    const explicitLines = normalizedText
      .split('|')
      .map((line) => line.trim())
      .filter(Boolean);

    return explicitLines.length > 0
      ? explicitLines
      : ABOUT_FIRST_CONTENT_FALLBACK.outlineLines;
  }

  const words = normalizedText.split(/\s+/);

  if (words.length <= 3) {
    return [normalizedText];
  }

  const midpoint = Math.ceil(words.length / 2);
  return [
    words.slice(0, midpoint).join(' '),
    words.slice(midpoint).join(' '),
  ];
}

export function mapAboutFirstContent(
  localizedPage: AboutPage | null | undefined,
  fallbackPage?: AboutPage | null
): AboutFirstContentViewModel {
  const firstContent = localizedPage?.firstcontent || fallbackPage?.firstcontent;

  return {
    tag: firstContent?.tag || ABOUT_FIRST_CONTENT_FALLBACK.tag,
    title: firstContent?.title || ABOUT_FIRST_CONTENT_FALLBACK.title,
    highlightedText:
      firstContent?.hightlightedtext || ABOUT_FIRST_CONTENT_FALLBACK.highlightedText,
    description: firstContent?.description || ABOUT_FIRST_CONTENT_FALLBACK.description,
    outlineLines: splitOutlineText(firstContent?.outlinetext),
  };
}
