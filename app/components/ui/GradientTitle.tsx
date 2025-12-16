import React from 'react';

interface GradientTitleProps {
  part1: string | React.ReactNode;
  part2: string | React.ReactNode;
  part1Color?: 'dark-green' | 'white' | 'custom';
  customPart1Color?: string;
  lineBreak?: boolean;
  className?: string;
  style?: React.CSSProperties;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  customSize?: string;
  align?: 'left' | 'center' | 'right';
  gradientFrom?: string;
  gradientTo?: string;
}

const sizeClasses = {
  sm: 'text-2xl md:text-3xl',
  md: 'text-3xl md:text-4xl lg:text-5xl',
  lg: 'text-4xl md:text-5xl lg:text-6xl',
  xl: 'text-5xl md:text-6xl lg:text-7xl',
};

const colorClasses = {
  'dark-green': 'text-[#0F3F1D]',
  'white': 'text-white',
  'custom': '',
};

export default function GradientTitle({
  part1,
  part2,
  part1Color = 'dark-green',
  customPart1Color,
  lineBreak = true,
  className = '',
  style,
  size = 'md',
  customSize,
  align = 'left',
  gradientFrom = '#20C997',
  gradientTo = '#A1DF0A',
}: GradientTitleProps) {
  const sizeClass = size === 'custom' && customSize ? '' : sizeClasses[size];
  const fontSizeStyle = size === 'custom' && customSize ? { fontSize: customSize } : {};
  
  const part1ColorClass = part1Color === 'custom' && customPart1Color 
    ? '' 
    : colorClasses[part1Color];
  const part1ColorStyle = part1Color === 'custom' && customPart1Color
    ? { color: customPart1Color }
    : {};

  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align];

  return (
    <h2 
      className={`font-semibold ${sizeClass} ${alignClass} ${className}`}
      style={{ ...fontSizeStyle, ...style }}
    >
      {part1 && (
        <>
          <span 
            className={part1ColorClass}
            style={part1ColorStyle}
          >
            {part1}
          </span>
          {lineBreak && <br />}
        </>
      )}
      <span 
        className="bg-gradient-to-r bg-clip-text text-transparent"
        style={{
          backgroundImage: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
        }}
      >
        {part2}
      </span>
    </h2>
  );
}

