'use client';

import { useState } from 'react';
import FaqAccordionItem from './FaqAccordionItem';
import type { FaqItemData } from './faqData';

interface FaqAccordionProps {
  items: FaqItemData[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openItemId, setOpenItemId] = useState<string | null>(items[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setOpenItemId((currentId) => (currentId === id ? null : id));
  };

  return (
    <div className="space-y-5 md:space-y-6 lg:location-details-scroll lg:max-h-[690px] lg:overflow-y-auto lg:pr-5">
      {items.map((item) => (
        <FaqAccordionItem
          key={item.id}
          item={item}
          isOpen={openItemId === item.id}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}
