import React from 'react';

interface GradientTagProps {
  text: string;
  className?: string;
  backgroundColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  textColor?: string;
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
  gradientTo = '#A1DF0A',
  textColor = '#2E7D32'
}: GradientTagProps) {
  // Check if background is transparent
  const isTransparent = backgroundColor === 'transparent' || 
                        backgroundColor === 'rgba(255, 255, 255, 0)' ||
                        (backgroundColor?.includes('rgba') && backgroundColor.includes(', 0)'));
  
  // For transparent backgrounds, we use a CSS mask technique
  // The mask creates a "donut" effect showing only the border area
  // We need to keep the text visible by positioning it separately
  if (isTransparent) {
    return (
      <div 
        className={`inline-block ${className}`}
        style={{
          position: 'relative',
          display: 'inline-block',
        }}
      >
        {/* Gradient border with mask */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
            borderRadius: '9999px',
            padding: '2px',
            // Create mask that shows only the border (padding area)
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            pointerEvents: 'none', // Allow clicks to pass through to text
          }}
        >
          <div
            className="px-4 py-1.5 rounded-full"
            style={{
              backgroundColor: 'transparent',
              borderRadius: '9999px',
              width: '100%',
              height: '100%',
            }}
          />
        </div>
        {/* Text content - positioned above the masked border */}
        <div
          className="px-4 py-1.5 rounded-full"
          style={{
            position: 'relative',
            zIndex: 1,
            backgroundColor: 'transparent',
            borderRadius: '9999px',
          }}
        >
          <span
            style={{
              color: textColor,
              fontSize: '20px',
              fontWeight: 600,
            }}
          >
            {text}
          </span>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={`inline-block ${className}`}
      style={{
        background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
        borderRadius: '9999px',
        padding: '2px',
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
            color: textColor,
            fontSize: '20px',
            fontWeight: 600,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
}

