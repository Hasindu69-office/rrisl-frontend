'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import GradientTag from '@/app/components/ui/GradientTag';
import GradientTitle from '@/app/components/ui/GradientTitle';
import type { AboutObjectiveViewModel } from '@/app/lib/about/objectives';

const desktopPositions: Record<string, string> = {
  '01': 'left-[9%] top-[54%] w-[200px]',
  '02': 'left-[21%] top-[29%] w-[220px]',
  '03': 'left-1/2 top-[9%] w-[260px] -translate-x-1/2',
  '04': 'right-[20%] top-[29%] w-[220px]',
  '05': 'right-[6%] top-[56%] w-[240px]',
};

type Objective = {
  id: string;
  text: string;
};

type ObjectiveCardProps = {
  obj: Objective;
  isActive: boolean;
  onActivate: (id: string) => void;
  className?: string;
};

function ObjectiveCard({ obj, isActive, onActivate, className = '' }: ObjectiveCardProps) {
  return (
    <button
      type="button"
      onMouseEnter={() => onActivate(obj.id)}
      onFocus={() => onActivate(obj.id)}
      className={`group flex flex-col items-center text-center focus:outline-none ${className}`}
    >
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[0_18px_40px_rgba(15,63,29,0.16)] md:h-24 md:w-24">
        <div
          className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            padding: '3px',
            background: 'linear-gradient(to right, #20C997, #9BDE10)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
        <div
          className={`absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(155,222,16,0.28)_0%,rgba(32,201,151,0.16)_45%,rgba(32,201,151,0)_72%)] blur-md transition-opacity duration-300 ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <span className="text-[28px] font-semibold leading-none text-[#111111] md:text-[36px]">
          {obj.id}
        </span>
      </div>

      <p
        className={`mt-4 max-w-[24ch] text-sm font-medium leading-[1.22] transition-colors duration-300 md:text-[17px] ${
          isActive ? 'text-[#111111]' : 'text-white'
        }`}
      >
        {obj.text}
      </p>
    </button>
  );
}

type ObjectiveStackCardProps = {
  obj: Objective;
  className?: string;
};

function ObjectiveStackCard({ obj, className = '' }: ObjectiveStackCardProps) {
  return (
    <article
      className={`group relative overflow-hidden rounded-[28px] border border-white/45 bg-white/88 p-5 text-left shadow-[0_20px_50px_rgba(15,63,29,0.16)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(15,63,29,0.2)] focus-within:-translate-y-1 ${className}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_42%)]" />
      <div className="relative flex items-start gap-4">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_12px_28px_rgba(15,63,29,0.14)]">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(155,222,16,0.34)_0%,rgba(32,201,151,0.18)_45%,rgba(32,201,151,0)_72%)] opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100" />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              padding: '3px',
              background: 'linear-gradient(to right, #20C997, #9BDE10)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
          <span className="text-[24px] font-semibold leading-none text-[#111111]">{obj.id}</span>
        </div>

        <div className="min-w-0 pt-2">
          <p className="text-[16px] font-semibold leading-[1.45] text-[#17361D] md:text-[17px]">
            {obj.text}
          </p>
        </div>
      </div>
    </article>
  );
}

interface ObjectivesSectionProps {
  eyebrow: string;
  title: string;
  highlightedText: string;
  objectives: AboutObjectiveViewModel[];
  imageSrc: string;
  imageAlt: string;
}

export default function ObjectivesSection({
  eyebrow,
  title,
  highlightedText,
  objectives,
  imageSrc,
  imageAlt,
}: ObjectivesSectionProps) {
  const [activeObjective, setActiveObjective] = useState<string>(objectives[0]?.id || '01');

  return (
    <section className="relative overflow-hidden bg-white pb-20 pt-16 md:pb-24 md:pt-20 xl:mb-20 xl:pb-0 xl:pt-24">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/datainsightsbackground.png"
          alt="Objectives background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(245,250,237,0.82)_28%,rgba(134,162,84,0.42)_60%,rgba(64,90,30,0.56)_100%)]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 mb-42 md:mb-48 lg:mb-20">
        <div className="text-center">
          <GradientTag
            text={eyebrow}
            className="mx-auto inline-block"
            backgroundColor="transparent"
            gradientFrom="#20C997"
            gradientTo="#A1DF0A"
            padding="px-8 py-1.5"
          />

          <GradientTitle
            part1={title}
            part2={highlightedText}
            lineBreak={false}
            part1Color="dark-green"
            size="custom"
            customSize="clamp(2.25rem, 3vw, 3.25rem)"
            className="mt-5 font-bold"
            align="center"
            gradientFrom="#20C997"
            gradientTo="#9BDE10"
          />
        </div>

        <div className="mt-8 hidden md:block xl:hidden">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-5 lg:gap-6">
            {objectives.map((obj, index) => (
              <ObjectiveStackCard
                key={obj.id}
                obj={obj}
                className={index === objectives.length - 1 ? 'col-span-2 mx-auto w-full max-w-[420px]' : ''}
              />
            ))}
          </div>
        </div>

        <div className="relative mt-0 hidden h-[640px] xl:block">
          <div className="absolute bottom-[11%] left-1/2 z-20 w-[480px] -translate-x-1/2">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={520}
              height={640}
              className="h-auto w-full object-contain"
              unoptimized={imageSrc.includes('localhost')}
            />
          </div>

          <div className="absolute inset-x-[20%] bottom-[12%] z-10 h-[180px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.08)_34%,rgba(0,0,0,0)_72%)] blur-2xl" />

          {objectives.map((obj) => (
            <div
              key={obj.id}
              className={`absolute z-30 transition-transform duration-300 ${desktopPositions[obj.id]}`}
            >
              <ObjectiveCard
                obj={obj}
                isActive={activeObjective === obj.id}
                onActivate={setActiveObjective}
              />
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center md:hidden">
          <div className="flex w-full flex-col gap-4">
            {objectives.map((obj) => (
              <ObjectiveStackCard
                key={obj.id}
                obj={obj}
                className="mx-auto max-w-[320px]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
