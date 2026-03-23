import LocationCard from './LocationCard';
import type { LocationCardData } from './locationData';

interface LocationSectionProps {
  cards: LocationCardData[];
}

export default function LocationSection({ cards }: LocationSectionProps) {
  return (
    <div>
      {cards.map((card) => (
        <LocationCard key={`${card.sideLabel}-${card.mapTitle}`} {...card} />
      ))}
    </div>
  );
}
