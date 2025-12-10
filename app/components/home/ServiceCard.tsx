import React from 'react';

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
  const isGreen = variant === 'green';
  const bgColor = isGreen ? 'bg-[#0f422c]' : 'bg-white';
  const textColor = isGreen ? 'text-white' : 'text-[#0f422c]';
  const cornerBg = isGreen ? 'bg-gray-100' : 'bg-[#0f422c]';
  const circleBg = isGreen ? 'bg-[#0f422c]' : 'bg-white';
  const innerCornerBg = isGreen ? 'bg-[#0f422c]' : 'bg-white';
  const arrowColor = isGreen ? 'white' : '#0f422c';

  return (
    <div className={`relative w-80 h-44 ${bgColor} rounded-[12px] shadow-xl ${className}`}>
      {/* Text Content */}
      <div className="absolute inset-0 flex items-center px-8 z-0">
        <div>
          <h2 className={`${textColor} text-md font-semibold leading-tight`}>
            {title.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < title.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          {description && (
            <p className={`${textColor} text-sm mt-2 opacity-90`}>
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Decorative Corner Elements */}
      {/* Top-right large corner */}
      <div className={`absolute top-0 right-0 w-16 h-16 ${cornerBg} z-10 rounded-bl-[30px]`}></div>

      {/* Top-right middle corner */}
      <div className={`absolute top-0 right-16 w-12 h-12 ${cornerBg} z-10 rounded-br-[12px]`}>
        <div className={`absolute rounded-se-[12px] inset-0 ${innerCornerBg} -z-10`}></div>
      </div>

      {/* Bottom-right corner */}
      <div className={`absolute top-16 right-0 w-12 h-12 ${cornerBg} z-10 rounded-tl-[12px]`}>
        <div className={`absolute rounded-se-[12px] inset-0 ${innerCornerBg} -z-10`}></div>
      </div>

      {/* Circular element with arrow icon */}
      <div className={`absolute top-1 right-1 w-14 h-14 ${circleBg} rounded-full z-20 shadow-sm flex items-center justify-center`}>
        {/* Arrow icon pointing to top-right */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 17L17 7M17 7H12M17 7V12"
            stroke={arrowColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

