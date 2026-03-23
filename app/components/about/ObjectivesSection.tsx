'use client';

import React from 'react';
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

export default function ObjectivesSection() {
  return (
    <section className="relative w-full min-h-[600px] md:min-h-[980px] py-20 overflow-hidden">
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

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-24">
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

        {/* Objectives Arc Layout - Desktop */}
        <div className="hidden md:block relative h-[400px] mt-10">
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
                className="absolute group transition-all duration-500 ease-out"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '220px',
                }}
              >
                <div className="flex flex-col items-center">
                  {/* Circle with Gradient Border on Hover */}
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center shadow-lg transition-all duration-300 overflow-hidden">
                    {/* Hover Gradient Border */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        padding: '3px',
                        background: 'linear-gradient(to right, #20C997, #9BDE10)',
                        borderRadius: '50%',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                      }}
                    />

                    <span className="text-2xl md:text-3xl font-bold text-[#0F3F1D] group-hover:scale-110 transition-transform duration-300">
                      {obj.id}
                    </span>
                  </div>

                  {/* Description Text */}
                  <p className="mt-6 text-center text-white/90 group-hover:text-black font-medium text-sm md:text-base leading-relaxed transition-colors duration-300 px-2">
                    {obj.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Objectives List - Mobile */}
        <div className="md:hidden flex flex-col gap-10 mt-10">
          {objectives.map((obj) => (
            <div key={obj.id} className="flex flex-col items-center group">
              <div className="relative w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg mb-4">
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    padding: '3px',
                    background: 'linear-gradient(to right, #20C997, #9BDE10)',
                    borderRadius: '50%',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                />
                <span className="text-2xl font-bold text-[#0F3F1D]">
                  {obj.id}
                </span>
              </div>
              <p className="text-center text-white/90 group-hover:text-black font-medium transition-colors duration-300">
                {obj.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
