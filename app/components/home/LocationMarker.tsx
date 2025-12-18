'use client';

import React, { useState } from 'react';

interface LocationMarkerProps {
  id: string;
  label: string;
  position: { x: number; y: number }; // Percentage-based
  isActive?: boolean;
  onMouseEnter: (id: string) => void;
  onMouseLeave?: () => void;
  className?: string;
}

/**
 * LocationMarker Component
 * Interactive map marker with hover effects
 * Features: circular green pin, label, hover animations
 */
export default function LocationMarker({
  id,
  label,
  position,
  isActive = false,
  onMouseEnter,
  onMouseLeave,
  className = '',
}: LocationMarkerProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onMouseEnter(id);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (onMouseLeave) {
      onMouseLeave();
    }
  };

  const shouldShowLabel = isHovered || isActive;
  const scale = isHovered || isActive ? 1.2 : 1;

  return (
    <div
      className={`absolute ${className}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer',
        zIndex: isActive || isHovered ? 20 : 10,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Marker Pin */}
      <div
        className="relative transition-all duration-300 ease-in-out"
        style={{
          transform: `scale(${scale})`,
        }}
      >
        {/* Main Pin Circle + Ripple (mirrors hero banner ripple style) */}
        <div
          className={`relative flex items-center justify-center ${
            isHovered || isActive ? 'animate' : ''
          }`}
        >
          {/* Ripple ring */}
          <div className="circle-ripple absolute w-10 h-10 rounded-full bg-[#A1DF0A]/15" />

          {/* Outer translucent ring */}
          <div className="circle-outer absolute w-8 h-8 rounded-full bg-[#A1DF0A]/30" />

          {/* Main Pin Circle */}
          <div
            className="circle-inner relative rounded-full bg-[#A1DF0A] flex items-center justify-center"
            style={{
              width: '24px',
              height: '24px',
              boxShadow: isHovered || isActive ? '0 0 20px rgba(161, 223, 10, 0.8)' : 'none',
            }}
          >
            {/* Inner Dot */}
            <div
              className="rounded-full bg-white"
              style={{
                width: '10px',
                height: '10px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Label - Appears on hover/active */}
      {shouldShowLabel && (
        <div
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg whitespace-nowrap transition-opacity duration-300"
          style={{
            opacity: shouldShowLabel ? 1 : 0,
            pointerEvents: 'none',
          }}
        >
          <span
            className="text-[#0F3F1D] font-semibold"
            style={{
              fontSize: '14px',
            }}
          >
            {label}
          </span>
          {/* Arrow pointing up */}
          <div
            className="absolute bottom-full left-1/2 transform -translate-x-1/2"
            style={{
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '6px solid rgba(255, 255, 255, 0.9)',
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes circleFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes ripplePulse {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.4);
            opacity: 0.3;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }

        /* Base visibility: inner pin always visible, outer/ripple only when animated */
        .circle-inner {
          opacity: 1;
        }

        .circle-outer,
        .circle-ripple {
          opacity: 0;
        }

        .animate .circle-outer {
          animation: circleFadeIn 0.5s ease-out forwards;
        }

        .animate .circle-ripple {
          animation:
            circleFadeIn 0.3s ease-out 0.3s forwards,
            ripplePulse 1.5s ease-out 0.6s infinite;
        }
      `}</style>
    </div>
  );
}









