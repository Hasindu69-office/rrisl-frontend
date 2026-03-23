'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import GradientTag from '@/app/components/ui/GradientTag';
import GradientTitle from '@/app/components/ui/GradientTitle';

const objectives = [
  {
    id: '01',
    text: 'Increase productivity to potential levels of the crop.',
  },
  {
    id: '02',
    text: 'Increase national production of NR to meet the increasing demand.',
  },
  {
    id: '03',
    text: 'Optimal and sustainable utilization of land, labour and other resources.',
  },
  {
    id: '04',
    text: 'Increase productivity to potential levels of the crop.',
  },
  {
    id: '05',
    text: 'Increase productivity to potential levels of the crop.',
  },
];

type Objective = {
  id: string;
  text: string;
};

type ObjectiveCardProps = {
  obj: Objective;
  isActive: boolean;
  onActivate: (id: string | null) => void;
  className?: string;
  circleClassName?: string;
  textClassName?: string;
};

function ObjectiveCard({
  obj,
  isActive,
  onActivate,
  className = '',
  circleClassName = '',
  textClassName = '',
}: ObjectiveCardProps) {
  return (
    <button
      type="button"
      onClick={() => onActivate(isActive ? null : obj.id)}
      onMouseEnter={() => onActivate(obj.id)}
      onMouseLeave={() => onActivate(null)}
      onFocus={() => onActivate(obj.id)}
      onBlur={() => onActivate(null)}
      className={`group flex flex-col items-center text-center focus:outline-none ${className}`}
    >
      <div
        className={`relative rounded-full bg-white flex items-center justify-center shadow-lg transition-all duration-300 overflow-hidden ${circleClassName}`}
      >
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            padding: '3px',
            background: 'linear-gradient(to right, #20C997, #9BDE10)',
            borderRadius: '50%',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        <span
          className={`font-bold text-[#0F3F1D] transition-transform duration-300 ${
            isActive ? 'scale-110' : 'scale-100'
          }`}
        >
          {obj.id}
        </span>
      </div>

      <p
        className={`font-medium leading-relaxed transition-colors duration-300 ${
          isActive ? 'text-black' : 'text-white/90'
        } ${textClassName}`}
      >
        {obj.text}
      </p>
    </button>
  );
}

export default function ObjectivesSection() {
  const [activeObjective, setActiveObjective] = useState<string | null>(null);

  return (
    <section className="relative w-full min-h-[600px] md:min-h-[900px] lg:min-h-[980px] py-20 overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/datainsightsbackground.png"
          alt="Objectives Background"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(57, 78, 16, 1) 100%)'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 mb-48 lg:mb-0">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20 lg:mb-24">
          <div className="mb-4">
            <GradientTag
              text="Who We Are"
              className="inline-block mx-auto"
              backgroundColor="transparent"
              gradientFrom="#20C997"
              gradientTo="#A1DF0A"
            />
          </div>

          <GradientTitle
            part1="Our "
            part2="Objectives"
            lineBreak={false}
            part1Color="dark-green"
            size="custom"
            customSize="48px"
            className="font-bold"
            align="center"
          />
        </div>

        {/* Objectives Grid Layout - Tablet */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-x-10 gap-y-12 mt-10 max-w-3xl mx-auto">
          {objectives.map((obj, index) => (
            <ObjectiveCard
              key={obj.id}
              obj={obj}
              isActive={activeObjective === obj.id}
              onActivate={setActiveObjective}
              className={index === objectives.length - 1 ? 'col-span-2 max-w-[280px] mx-auto' : ''}
              circleClassName="w-24 h-24 mb-5"
              textClassName="text-base px-3"
            />
          ))}
        </div>

        {/* Objectives Arc Layout - Large Tablet / Small Desktop */}
        <div className="hidden lg:block xl:hidden relative h-[360px] mt-10">
          {objectives.map((obj, index) => {
            const total = objectives.length;
            const rx = 42;
            const ry = 34;
            const verticalBase = 57;

            const xNormal = (index / (total - 1)) * 2 - 1;
            const left = 50 + xNormal * rx;
            const curveHeight = Math.sqrt(1 - Math.pow(xNormal * 0.95, 2));
            const top = verticalBase - curveHeight * ry;

            return (
              <div
                key={obj.id}
                className="absolute transition-all duration-500 ease-out"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '170px',
                }}
              >
                <ObjectiveCard
                  obj={obj}
                  isActive={activeObjective === obj.id}
                  onActivate={setActiveObjective}
                  circleClassName="w-20 h-20"
                  textClassName="mt-5 text-sm px-1"
                />
              </div>
            );
          })}
        </div>

        {/* Objectives Arc Layout - Desktop */}
        <div className="hidden xl:block relative h-[400px] mt-10">
          {objectives.map((obj, index) => {
            const total = objectives.length;

            // --- ARC ADJUSTMENT PARAMETERS ---
            // 1. Horizontal Spread: Increase 'rx' to spread items wider across the page
            const rx = 35;

            // 2. Vertical Curvature: Increase 'ry' to make the arc higher/deeper
            const ry = 45;

            // 3. Vertical Offset: Change '55' to move the entire arc up or down
            const verticalBase = 58;
            // ---------------------------------

            // Calculate linear horizontal position (-1 to 1) for equal gaps
            const xNormal = (index / (total - 1)) * 2 - 1;
            const left = 50 + xNormal * rx;

            // Calculate height based on a circular curve formula
            // (Uses Math.sqrt for a smoother, more natural arc than sin/cos for linear x)
            const curveHeight = Math.sqrt(1 - Math.pow(xNormal * 0.95, 2));
            const top = verticalBase - curveHeight * ry;

            return (
              <div
                key={obj.id}
                className="absolute transition-all duration-500 ease-out"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '220px',
                }}
              >
                <ObjectiveCard
                  obj={obj}
                  isActive={activeObjective === obj.id}
                  onActivate={setActiveObjective}
                  circleClassName="w-24 h-24"
                  textClassName="mt-6 text-base px-2"
                />
              </div>
            );
          })}
        </div>

        {/* Objectives List - Mobile */}
        <div className="md:hidden flex flex-col gap-10 mt-10">
          {objectives.map((obj) => (
            <ObjectiveCard
              key={obj.id}
              obj={obj}
              isActive={activeObjective === obj.id}
              onActivate={setActiveObjective}
              circleClassName="w-20 h-20 mb-4"
              textClassName="text-sm px-4"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
