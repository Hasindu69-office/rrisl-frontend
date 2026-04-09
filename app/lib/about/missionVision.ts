import type { AboutPage } from '@/app/lib/types';

export interface AboutMissionVisionViewModel {
  visionLabel: string;
  vision: string;
  missionLabel: string;
  mission: string;
}

const ABOUT_MISSION_VISION_FALLBACK: AboutMissionVisionViewModel = {
  visionLabel: 'Vision',
  vision:
    'To emerge as the centre of excellence in providing high quality scientific technologies to the rubber industry.',
  missionLabel: 'Mission',
  mission:
    'To revitalize the rubber sector by developing economically and environmentally sustainable innovations and transferring the latest technologies to the stakeholders through training and advisory services.',
};

export function mapAboutMissionVision(
  localizedPage: AboutPage | null | undefined,
  fallbackPage?: AboutPage | null
): AboutMissionVisionViewModel {
  const effectivePage = localizedPage || fallbackPage;

  return {
    visionLabel: effectivePage?.vissionlabel || ABOUT_MISSION_VISION_FALLBACK.visionLabel,
    vision: effectivePage?.vision || ABOUT_MISSION_VISION_FALLBACK.vision,
    missionLabel: effectivePage?.missionlabel || ABOUT_MISSION_VISION_FALLBACK.missionLabel,
    mission: effectivePage?.mission || ABOUT_MISSION_VISION_FALLBACK.mission,
  };
}
