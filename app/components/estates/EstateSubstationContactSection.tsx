import LocationCard from '../contact/LocationCard';
import type { LocationCardData } from '../contact/locationData';

export type EstateSubstationContactSectionContent = LocationCardData;

export interface EstateSubstationContactSectionProps {
  content: EstateSubstationContactSectionContent;
  className?: string;
}

export default function EstateSubstationContactSection({
  content,
  className = '',
}: EstateSubstationContactSectionProps) {
  return (
    <section
      className={`bg-white px-4 py-16 md:px-6 md:py-20 lg:px-36 lg:py-8 mb-78 ${className}`.trim()}
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="-mt-16 md:-mt-20">
          <LocationCard {...content} />
        </div>
      </div>
    </section>
  );
}
