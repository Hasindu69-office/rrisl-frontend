import AdvisoryServicesProgramsSliderSectionClient from './AdvisoryServicesProgramsSliderSectionClient';
import type { AdvisoryTrainingCategory } from './AdvisoryServicesProgramsSliderSection.data';

interface AdvisoryServicesProgramsSliderSectionProps {
  categories: AdvisoryTrainingCategory[];
  backgroundImage: string;
  backgroundImageAlt: string;
}

export default function AdvisoryServicesProgramsSliderSection({
  categories,
  backgroundImage,
  backgroundImageAlt,
}: AdvisoryServicesProgramsSliderSectionProps) {
  return (
    <AdvisoryServicesProgramsSliderSectionClient
      categories={categories}
      backgroundImage={backgroundImage}
      backgroundImageAlt={backgroundImageAlt}
    />
  );
}
