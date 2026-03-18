'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface DataItem {
  label: string;
  value: number;
}

interface CustomPieChartProps {
  data: DataItem[];
}

export default function CustomPieChart({ data }: CustomPieChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const segmentsRef = useRef<(SVGPathElement | null)[]>([]);
  const labelsRef = useRef<(SVGTextElement | null)[]>([]);

  const total = useMemo(() => data.reduce((acc, item) => acc + item.value, 0), [data]);

  // Generate shades of green based on index
  const getGreenShade = (index: number, totalItems: number) => {
    // Base HSL for the theme green: H: 80, S: 70, L: 50 (approx #A1DF0A)
    const h = 80;
    const s = 70 - (index * 5); // Slight saturation variation
    const l = 85 - (index * (40 / totalItems)); // Lightness variation from light to medium
    return `hsla(${h}, ${s}%, ${l}%, 0.69)`;
  };

  const calculatePath = (startAngle: number, endAngle: number, radius: number) => {
    const x1 = radius + radius * Math.cos((Math.PI * startAngle) / 180);
    const y1 = radius + radius * Math.sin((Math.PI * startAngle) / 180);
    const x2 = radius + radius * Math.cos((Math.PI * endAngle) / 180);
    const y2 = radius + radius * Math.sin((Math.PI * endAngle) / 180);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  const segments = useMemo(() => {
    let currentAngle = -90; // Start from top
    return data.map((item, index) => {
      const angle = (item.value / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      const midAngle = startAngle + angle / 2;
      currentAngle += angle;

      return {
        ...item,
        startAngle,
        endAngle,
        midAngle,
        color: getGreenShade(index, data.length),
        path: calculatePath(startAngle, endAngle, 200),
      };
    });
  }, [data, total]);

  const handleMouseEnter = (index: number) => {
    const segment = segmentsRef.current[index];
    const label = labelsRef.current[index];
    if (!segment || !label) return;

    const midAngle = segments[index].midAngle;
    const distance = 25; // How much it protrudes
    const dx = Math.cos((Math.PI * midAngle) / 180) * distance;
    const dy = Math.sin((Math.PI * midAngle) / 180) * distance;

    // Animate segment
    gsap.to(segment, {
      x: dx,
      y: dy,
      scale: 1.08,
      filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.15))',
      stroke: 'url(#hover-gradient)',
      strokeWidth: 1,
      duration: 0.4,
      ease: 'power2.out',
      transformOrigin: 'center center',
    });

    // Animate label in sync
    gsap.to(label, {
      x: dx,
      y: dy,
      scale: 1.08,
      duration: 0.4,
      ease: 'power2.out',
      transformOrigin: 'center center',
    });
  };

  const handleMouseLeave = (index: number) => {
    const segment = segmentsRef.current[index];
    const label = labelsRef.current[index];
    if (!segment || !label) return;

    gsap.to([segment, label], {
      x: 0,
      y: 0,
      scale: 1,
      filter: 'drop-shadow(0 0px 0px rgba(0,0,0,0))',
      stroke: 'transparent',
      strokeWidth: 2,
      duration: 0.4,
      ease: 'power2.inOut',
    });
  };

  return (
    <div className="relative w-full h-[350px] md:h-[450px] lg:h-[550px] flex items-center justify-center">
      <svg
        ref={svgRef}
        viewBox="0 0 450 450"
        className="w-full h-full max-w-[500px] overflow-visible"
        style={{ filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.05))' }}
      >
        <defs>
          <linearGradient id="hover-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#20C997" />
            <stop offset="100%" stopColor="#9BDE10" />
          </linearGradient>
        </defs>
        <g transform="translate(25, 25)">
          {segments.map((segment, index) => (
            <g key={index} className="cursor-pointer">
              <path
                ref={(el) => { segmentsRef.current[index] = el; }}
                d={segment.path}
                fill={segment.color}
                stroke="transparent"
                strokeWidth="2"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
                className="transition-colors duration-200"
              />

              {/* Text labels inside segments */}
              <text
                ref={(el) => { labelsRef.current[index] = el; }}
                x={200 + 130 * Math.cos((Math.PI * segment.midAngle) / 180)}
                y={200 + 130 * Math.sin((Math.PI * segment.midAngle) / 180)}
                textAnchor="middle"
                className="pointer-events-none"
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  fill: '#2E7D32',
                  opacity: 0.9,
                }}
              >
                <tspan x={200 + 130 * Math.cos((Math.PI * segment.midAngle) / 180)} dy="-0.5em">
                  {segment.label}
                </tspan>
                <tspan
                  x={200 + 130 * Math.cos((Math.PI * segment.midAngle) / 180)}
                  dy="1.2em"
                  style={{ fontSize: '18px', fontWeight: 700 }}
                >
                  {segment.value.toLocaleString()}
                </tspan>
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
