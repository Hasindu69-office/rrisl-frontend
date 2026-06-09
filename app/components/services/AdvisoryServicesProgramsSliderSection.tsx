import AdvisoryServicesProgramsSliderSectionClient from './AdvisoryServicesProgramsSliderSectionClient';
import { ADVISORY_TRAINING_CATEGORIES } from './AdvisoryServicesProgramsSliderSection.data';

export default function AdvisoryServicesProgramsSliderSection() {
  return (
    <AdvisoryServicesProgramsSliderSectionClient
      categories={ADVISORY_TRAINING_CATEGORIES}
    />
  );
}
