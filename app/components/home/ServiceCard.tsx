import React, { useState } from 'react';

interface ServiceCardProps {
  title: string;
  description?: string;
  variant?: 'green' | 'white';
  className?: string;
}

/**
 * Service Card Component
 * Features a green or white card with decorative corner elements
 * Based on the HTML design provided
 */
export default function ServiceCard({
  title,
  description,
  variant = 'green',
  className = '',
}: ServiceCardProps) {
  // All text is white regardless of variant
  const textColor = 'text-white';
  // Circle background is always white
  const circleBg = 'bg-white';
  // Dark arrow for contrast on white circle
  const arrowColor = '#0f422c';
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`group relative w-80 h-44 rounded-[12px] shadow-xl overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background SVG container (large shape on the left) */}
      <svg
        className="absolute inset-0 w-full h-full"
        width="321"
        height="167"
        viewBox="0 0 321 167"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="serviceCardBackgroundGradient"
            x1="0"
            y1="0"
            x2="321"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#A1DF0A" />
            <stop offset="100%" stopColor="#577905" />
          </linearGradient>
        </defs>
        <path
          d="M30 0.5H211.5C227.792 0.5 241 13.7076 241 30V47.3145C241 63.2115 253.211 76.4423 269.057 77.7158L297.46 79.998L297.479 80H297.5C310.203 80 320.5 90.2975 320.5 103V137C320.5 153.292 307.292 166.5 291 166.5H30C13.7076 166.5 0.5 153.292 0.5 137V30L0.509766 29.2383C0.913784 13.2979 13.9623 0.5 30 0.5Z"
          fill={isHovered ? '#FFFFFF' : 'url(#serviceCardBackgroundGradient)'}
          className="transition-all duration-500 ease-in-out"
        />
      </svg>

      {/* Text Content - constrained to left-side container area */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-8 pr-20 z-0">
        <div className="max-w-[190px]">
          <h2 className={`${textColor} group-hover:text-[#2E7D32] text-md font-semibold leading-tight transition-colors duration-500 ease-in-out`}>
            {title.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < title.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          {description && (
            <p className={`${textColor} group-hover:text-black text-sm mt-2 opacity-90 transition-colors duration-500 ease-in-out`}>
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Top-right circle with arrow */}
      <div
        className={`absolute top-2 right-2 w-16 h-16 rounded-full flex items-center justify-center shadow-md bg-white group-hover:bg-[#A1DF0A] transition-colors duration-500 ease-in-out`}
      >
        <svg
          width="19"
          height="18"
          viewBox="0 0 19 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.6851 1.30287C18.7018 0.750841 18.2679 0.28977 17.7158 0.273042L8.71996 0.000439862C8.16793 -0.0162884 7.70686 0.417661 7.69013 0.969692C7.67341 1.52172 8.10736 1.98279 8.65939 1.99952L16.6557 2.24184L16.4134 10.2382C16.3967 10.7902 16.8306 11.2513 17.3827 11.268C17.9347 11.2847 18.3958 10.8508 18.4125 10.2987L18.6851 1.30287ZM0.685547 17.2726L1.37091 18.0008L18.3709 2.00078L17.6855 1.27258L17.0002 0.544383L0.000182152 16.5444L0.685547 17.2726Z"
            fill={arrowColor}
          />
        </svg>
      </div>
    </div>
  );
}

