import React from 'react';

interface GradientTagProps {
  text: string;
  className?: string;
  backgroundColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

/**
 * Reusable gradient tag component with pill shape
 * Outer pill has linear gradient from #20C997 to #A1DF0A (default)
 * Text color is #2E7D32, text size 20px
 */
export default function GradientTag({ 
  text, 
  className = '',
  backgroundColor = 'white',
  gradientFrom = '#20C997',
  gradientTo = '#A1DF0A'
}: GradientTagProps) {
  return (
    <div 
      className={`inline-block ${className}`}
      style={{
        background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
        borderRadius: '9999px', // Full pill shape
        padding: '2px', // This creates the border effect
      }}
    >
      <div
        className="px-4 py-1.5 rounded-full"
        style={{
          backgroundColor: backgroundColor,
          borderRadius: '9999px',
        }}
      >
        <span
          style={{
            color: '#2E7D32',
            fontSize: '20px',
            fontWeight: 600, // semibold
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
}

