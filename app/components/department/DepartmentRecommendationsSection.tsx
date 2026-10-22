'use client';

import Image from 'next/image';
import { CheckCircle2, ChevronDown, FileImage, ListChecks, Table2 } from 'lucide-react';
import { useState } from 'react';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';
import type {
  DepartmentRecommendationBriefItem,
  DepartmentRecommendationGroupView,
  DepartmentRecommendationsContent,
} from '@/app/lib/departments/recommendationsData';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';

interface DepartmentRecommendationsSectionProps {
  content: DepartmentRecommendationsContent;
  containerClassName?: string;
}

function RecommendationBullets({
  items,
}: Extract<DepartmentRecommendationsContent['blocks'][number], { type: 'bullets' }>) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[15px] leading-7 text-[#263A2C] md:text-[16px]">
          <CheckCircle2
            className="mt-1 h-5 w-5 shrink-0 text-[#2E7D32]"
            strokeWidth={2.2}
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function RecommendationImage({
  imageSrc,
  imageAlt,
  caption,
}: Extract<DepartmentRecommendationsContent['blocks'][number], { type: 'image' }>) {
  const useUnoptimizedImage = isLocalhostAssetUrl(imageSrc);

  return (
    <>
      {caption ? (
        <p className="text-[14px] leading-6 text-[#5A6B61] md:text-[15px]">{caption}</p>
      ) : null}

      <div
        className={`${caption ? 'mt-5' : ''} overflow-hidden rounded-[8px] border border-[#E1EBDD] bg-[#F8FBF6]`}
      >
        <div className="relative h-[360px] w-full md:h-[520px] lg:h-[640px]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-contain"
            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 80vw, 960px"
            unoptimized={useUnoptimizedImage}
          />
        </div>
      </div>
    </>
  );
}

function RecommendationTable({
  columns,
  rows,
  note,
}: Extract<DepartmentRecommendationsContent['blocks'][number], { type: 'table' }>) {
  return (
    <>
      <div className="overflow-x-auto rounded-[8px] border border-[#D8E6D3]">
        <table className="min-w-[720px] w-full border-collapse text-left text-[14px] text-[#263A2C] md:text-[15px]">
          <thead className="bg-[#EAF4E4] text-[#10341B]">
            <tr>
              {columns.map((column) => (
                <th key={column} scope="col" className="border-b border-[#D8E6D3] px-4 py-3 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`${row.join('-')}-${rowIndex}`} className="even:bg-[#F8FBF6]">
                {row.map((cell, cellIndex) => (
                  <td key={`${cell}-${cellIndex}`} className="border-t border-[#E4EEE0] px-4 py-3 align-top">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {note ? (
        <p className="mt-4 text-[14px] leading-7 text-[#5A6B61] md:text-[15px]">{note}</p>
      ) : null}
    </>
  );
}

function getBlockTitle(block: DepartmentRecommendationsContent['blocks'][number]) {
  if (block.title) {
    return block.title;
  }

  if (block.type === 'bullets') {
    return 'Recommendation points';
  }

  return 'Recommendation';
}

function getBlockMeta(block: DepartmentRecommendationsContent['blocks'][number]) {
  if (block.type === 'bullets') {
    return {
      icon: <ListChecks className="h-5 w-5" strokeWidth={2.1} aria-hidden="true" />,
    };
  }

  if (block.type === 'image') {
    return {
      icon: <FileImage className="h-5 w-5" strokeWidth={2.1} aria-hidden="true" />,
    };
  }

  return {
    icon: <Table2 className="h-5 w-5" strokeWidth={2.1} aria-hidden="true" />,
  };
}

function RecommendationBriefCard({
  item,
  index,
}: {
  item: DepartmentRecommendationBriefItem;
  index: number;
}) {
  return (
    <article
      data-department-reveal
      className="group flex h-full gap-4 rounded-[24px] border border-[#DCE9D5] bg-white p-5 shadow-[0_14px_34px_rgba(15,63,29,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#B9DDA9] hover:shadow-[0_20px_44px_rgba(15,63,29,0.1)] md:gap-5 md:p-6"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#A1DF0A] text-[14px] font-bold text-[#0F3F1D] md:h-12 md:w-12 md:text-[15px]">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="min-w-0">
        <h4 className="text-[16px] font-semibold leading-[1.4] text-[#153C21] md:text-[18px]">
          {item.title}
        </h4>
        {item.description ? (
          <p className="mt-3 text-[14px] leading-[1.75] text-[#3D4E41] md:text-[15px] md:leading-[1.8]">
            {item.description}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function RecommendationGroupsLayout({
  groups,
}: {
  groups: DepartmentRecommendationGroupView[];
}) {
  return (
    <div className="mt-10 space-y-10 md:mt-12 md:space-y-12">
      {groups.map((group) => (
        <div key={group.id} data-department-reveal>
          <div className="mb-5 flex items-center gap-3 md:mb-6">
            <span className="inline-flex items-center rounded-full bg-[#EEF7E8] px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#2E7D32]">
              {group.title}
            </span>
            <span className="h-px flex-1 bg-[linear-gradient(90deg,#C9DFBE_0%,rgba(201,223,190,0)_100%)]" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:gap-6">
            {group.items.map((item, index) => (
              <RecommendationBriefCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function LegacyRecommendationBlocks({
  blocks,
}: {
  blocks: DepartmentRecommendationsContent['blocks'];
}) {
  const [openBlockId, setOpenBlockId] = useState<string | null>(null);

  return (
    <div className="mt-10 space-y-6 md:mt-12 md:space-y-7">
      {blocks.map((block) => {
        const isOpen = block.id === openBlockId;
        const title = getBlockTitle(block);
        const meta = getBlockMeta(block);
        const triggerId = `department-recommendation-trigger-${block.id}`;
        const panelId = `department-recommendation-panel-${block.id}`;

        return (
          <article
            key={block.id}
            className={`overflow-hidden rounded-[8px] border bg-white shadow-[0_14px_34px_rgba(15,63,29,0.06)] transition-[border-color,box-shadow] duration-300 ${
              isOpen ? 'border-[#BFDAB7]' : 'border-[#DDEBD8]'
            }`}
          >
            <button
              id={triggerId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenBlockId((currentId) => (currentId === block.id ? null : block.id))}
              className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-[#F8FBF6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-inset md:px-5 md:py-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#EEF7E8] text-[#2E7D32]">
                {meta.icon}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[18px] font-semibold leading-[1.35] text-[#10341B] md:text-[20px]">
                  {title}
                </span>
              </span>

              <ChevronDown
                className={`h-5 w-5 shrink-0 text-[#2E7D32] transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : 'rotate-0'
                }`}
                strokeWidth={2.2}
                aria-hidden="true"
              />
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="border-t border-[#E4EEE0] px-4 py-5 md:px-5 md:py-6">
                  {block.type === 'bullets' ? (
                    <RecommendationBullets {...block} />
                  ) : block.type === 'image' ? (
                    <RecommendationImage {...block} />
                  ) : (
                    <RecommendationTable {...block} />
                  )}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/**
 * Department recommendations: numbered brief cards for grouped items,
 * with legacy accordion fallback for image/bullets/table blocks.
 */
export default function DepartmentRecommendationsSection({
  content,
  containerClassName = 'w-[80%]',
}: DepartmentRecommendationsSectionProps) {
  const hasGroups = content.groups.length > 0;

  return (
    <section className="bg-[linear-gradient(180deg,#F7FBF4_0%,#FFFFFF_100%)] px-4 py-16 md:px-6 md:py-20 lg:px-0 lg:py-24">
      <div className={`mx-auto max-w-[1280px] ${containerClassName}`} data-department-reveal>
        <div className={hasGroups ? 'text-center' : 'max-w-[820px]'}>
          <GradientTag
            text={content.eyebrow}
            backgroundColor="white"
            padding="px-5 py-1.5"
            className="inline-block"
          />

          <GradientTitle
            part1={content.title}
            part2={content.highlightedText}
            lineBreak={false}
            part1Color="dark-green"
            size="custom"
            customSize="clamp(30px, 4vw, 52px)"
            align={hasGroups ? 'center' : 'left'}
            className="mt-5 font-bold leading-[1.12]"
          />
        </div>

        {hasGroups ? (
          <RecommendationGroupsLayout groups={content.groups} />
        ) : (
          <LegacyRecommendationBlocks blocks={content.blocks} />
        )}
      </div>
    </section>
  );
}
