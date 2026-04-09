import type { AboutPage, AboutPageObjective } from '@/app/lib/types';
import { getOptimizedImageUrl, getStrapiImageUrl } from '@/app/lib/strapi';

export interface AboutObjectiveViewModel {
  id: string;
  text: string;
}

export interface AboutObjectivesViewModel {
  eyebrow: string;
  title: string;
  highlightedText: string;
  alignment: 'left' | 'center' | 'right';
  objectives: AboutObjectiveViewModel[];
  imageSrc: string;
  imageAlt: string;
}

const ABOUT_OBJECTIVES_FALLBACK: AboutObjectivesViewModel = {
  eyebrow: 'Who We Are',
  title: 'Our',
  highlightedText: 'Objectives',
  alignment: 'center',
  objectives: [
    { id: '01', text: 'Increase productivity to potential levels of the crop' },
    { id: '02', text: 'Increase national production of NR to meet the increasing demand' },
    { id: '03', text: 'Optimal and sustainable utilization of land, labour and other resources' },
    { id: '04', text: 'Maximize domestic value addition to rubber' },
    { id: '05', text: 'Transfer the developed technologies through training and advisory services' },
  ],
  imageSrc: '/images/AboutusBottomImg.webp',
  imageAlt: 'Researcher examining rubber sample',
};

function mapObjectives(objectives: AboutPageObjective[] | null | undefined): AboutObjectiveViewModel[] {
  const mappedObjectives =
    objectives
      ?.filter((objective) => objective?.objectivenumber && objective?.objectivecontent)
      .map((objective) => ({
        id: objective.objectivenumber,
        text: objective.objectivecontent,
      })) || [];

  if (mappedObjectives.length === 0) {
    return ABOUT_OBJECTIVES_FALLBACK.objectives;
  }

  return mappedObjectives.sort((left, right) => left.id.localeCompare(right.id));
}

export function mapAboutObjectives(
  localizedPage: AboutPage | null | undefined,
  fallbackPage?: AboutPage | null
): AboutObjectivesViewModel {
  const effectivePage = localizedPage || fallbackPage;
  const image = effectivePage?.objectivebgimage || fallbackPage?.objectivebgimage || null;

  return {
    eyebrow:
      effectivePage?.objectivesection?.eyebrow || ABOUT_OBJECTIVES_FALLBACK.eyebrow,
    title: effectivePage?.objectivesection?.title || ABOUT_OBJECTIVES_FALLBACK.title,
    highlightedText:
      effectivePage?.objectivesection?.hightlightedtext ||
      ABOUT_OBJECTIVES_FALLBACK.highlightedText,
    alignment:
      effectivePage?.objectivesection?.alignment || ABOUT_OBJECTIVES_FALLBACK.alignment,
    objectives: mapObjectives(effectivePage?.objectives),
    imageSrc:
      getOptimizedImageUrl(image, 'large') ||
      getOptimizedImageUrl(image, 'medium') ||
      getStrapiImageUrl(image) ||
      ABOUT_OBJECTIVES_FALLBACK.imageSrc,
    imageAlt: image?.alternativeText || ABOUT_OBJECTIVES_FALLBACK.imageAlt,
  };
}
