'use client';

import type { FaqItemData } from './faqData';

interface FaqAccordionItemProps {
  item: FaqItemData;
  isOpen: boolean;
  onToggle: (id: string) => void;
}

export default function FaqAccordionItem({
  item,
  isOpen,
  onToggle,
}: FaqAccordionItemProps) {
  const buttonId = `faq-trigger-${item.id}`;
  const panelId = `faq-panel-${item.id}`;

  return (
    <article className="rounded-[20px] bg-[#DCE25A] px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6">
      <button
        id={buttonId}
        type="button"
        onClick={() => onToggle(item.id)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full cursor-pointer items-center justify-between gap-4 text-left"
      >
        <span className="pr-3 text-[20px] font-medium leading-[1.35] tracking-[-0.02em] text-[#2E7D32] sm:pr-4 sm:text-[24px] lg:text-[24px]">
          {item.number} {item.question}
        </span>
        <span aria-hidden="true" className="relative block h-6 w-6 shrink-0 sm:h-7 sm:w-7">
          <span className="absolute left-1/2 top-1/2 h-[2px] w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2E7D32]" />
          {!isOpen && (
            <span className="absolute left-1/2 top-1/2 h-4 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2E7D32]" />
          )}
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!isOpen}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-3 sm:pt-4">
            <div className="border-t border-white" />
            <p className="pt-3 text-[15px] leading-[1.75] text-[#546F7A] sm:pt-4 sm:text-[16px] lg:text-[16px]">
              {item.answer}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
