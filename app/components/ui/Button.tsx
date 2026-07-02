import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'group relative inline-flex max-w-full items-center justify-center overflow-hidden text-center font-medium leading-tight whitespace-normal rounded-[30px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all duration-500 ease-out';

  const variants = {
    primary:
      'bg-[#2E7D32] text-white shadow-[0_8px_20px_rgba(46,125,50,0.22)] hover:shadow-[0_14px_32px_rgba(46,125,50,0.35)] hover:-translate-y-[2px] focus-visible:ring-[#2E7D32]',

    secondary:
      'bg-gray-700 text-white shadow-[0_8px_20px_rgba(0,0,0,0.16)] hover:bg-gray-800 hover:shadow-[0_14px_32px_rgba(0,0,0,0.25)] hover:-translate-y-[2px] focus-visible:ring-gray-600',

    outline:
      'border border-[#A1DF0A] text-[#A1DF0A] hover:text-white hover:border-[#2E7D32] shadow-[0_8px_20px_rgba(161,223,10,0.12)] hover:shadow-[0_14px_32px_rgba(46,125,50,0.25)] hover:-translate-y-[2px] focus-visible:ring-[#A1DF0A]',
  };

  const sizes = {
    sm: 'min-h-10 px-8 py-2 text-sm',
    md: 'min-h-12 px-6 py-2 text-base',
    lg: 'min-h-12 px-7 py-2.5 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {/* Left-to-right green fill animation for outline button */}
      {variant === 'outline' && (
        <span className="absolute inset-0 z-0 -translate-x-full rounded-[30px] bg-[#2E7D32] transition-transform duration-500 ease-out group-hover:translate-x-0" />
      )}

      {/* Elegant light sweep - only for primary and secondary buttons */}
      {variant !== 'outline' && (
        <span className="absolute left-[-75%] top-0 z-0 h-full w-[50%] skew-x-[-25deg] bg-white/20 transition-all duration-700 ease-out group-hover:left-[125%]" />
      )}

      {/* Natural leaf/rubber glow */}
      <span className="absolute inset-0 z-0 rounded-[30px] opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_20%,rgba(161,223,10,0.28),transparent_35%)]" />

      {/* Button text */}
      <span className="relative z-10 transition-transform duration-500 ease-out group-hover:scale-[1.03]">
        {children}
      </span>
    </button>
  );
}
