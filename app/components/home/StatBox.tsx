import React from 'react';

interface StatBoxProps {
  value: string;
  label: string;
  className?: string;
}

/**
 * StatBox Component
 * Reusable component for displaying statistics with a leaf icon
 * Features: rounded box with green border, leaf icon at top, value and label
 */
export default function StatBox({
  value,
  label,
  className = '',
}: StatBoxProps) {
  return (
    <div
      className={`relative border border-[#A1DF0A] bg-transparent p-4 flex flex-col items-start ${className}`}
      style={{
        width: '150px',
        height: '130px',
        borderRadius: '20px',
        marginLeft: '20px',
        marginTop: '40px',
      }}
    >
      {/* Leaf Icon at Top */}
      <div
        className="mb-3 flex items-center justify-center"
        style={{
          width: '40px',
          aspectRatio: '1 / 1',
          borderRadius: '9999px',
          backgroundColor: '#D9D9D930',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block"
        >
          <defs>
            <linearGradient
              id="statBoxLeafGradient"
              x1="2"
              y1="11.5"
              x2="21"
              y2="11.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.0288462" stopColor="#20C997" />
              <stop offset="1" stopColor="#A1DF0A" />
            </linearGradient>
          </defs>
          <path
            d="M2 21C2 18 3.85 15.64 7.08 15C9.5 14.52 12 13 13 12M11 20C9.24406 20.0053 7.55025 19.3505 6.25452 18.1654C4.95878 16.9803 4.15577 15.3515 4.00474 13.6021C3.8537 11.8527 4.36569 10.1104 5.43915 8.72074C6.51261 7.33112 8.06913 6.3957 9.8 6.1C15.5 5 17 4.48 19 2C20 4 21 6.18 21 10C21 15.5 16.22 20 11 20Z"
            stroke="url(#statBoxLeafGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Value */}
      <div
        className="text-white mb-1 text-left w-full"
        style={{
          fontSize: '18px',
          lineHeight: '20px',
          fontWeight: 400,
        }}
      >
        {value}
      </div>

      {/* Label */}
      <div
        className="text-white/80 text-left w-full"
        style={{
          fontSize: '16px',
          lineHeight: '25px',
          fontWeight: 400,
        }}
      >
        {label}
      </div>
    </div>
  );
}

