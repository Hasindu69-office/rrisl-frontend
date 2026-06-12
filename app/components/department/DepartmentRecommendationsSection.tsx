'use client';

import Image from 'next/image';
import { CheckCircle2, ChevronDown, FileImage, ListChecks, Table2 } from 'lucide-react';
import { useState } from 'react';
import GradientTag from '../ui/GradientTag';
import GradientTitle from '../ui/GradientTitle';
import type { DepartmentRecommendationsContent } from '@/app/lib/departments/recommendationsData';
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

      <div className={`${caption ? 'mt-5' : ''} overflow-hidden rounded-[8px] border border-[#E1EBDD] bg-[#F8FBF6]`}>
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

export default function DepartmentRecommendationsSection({
  content,
  containerClassName = 'w-[80%]',
}: DepartmentRecommendationsSectionProps) {
  const [openBlockId, setOpenBlockId] = useState<string | null>(null);

  return (
    <section className="bg-[linear-gradient(180deg,#F7FBF4_0%,#FFFFFF_100%)] px-4 py-16 md:px-6 md:py-20 lg:px-0 lg:py-24">
      <div className={`mx-auto max-w-[1280px] ${containerClassName}`} data-department-reveal>
        <div className="max-w-[820px]">
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
            align="left"
            className="mt-5 font-bold leading-[1.12]"
          />

        </div>

        <div className="mt-10 space-y-6 md:mt-12 md:space-y-7">
          {content.blocks.map((block) => {
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
      </div>
    </section>
  );
}
