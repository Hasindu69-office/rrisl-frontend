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
  const baseStyles = 'inline-flex max-w-full items-center justify-center text-center font-medium leading-tight whitespace-normal transition-colors rounded focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-[#2E7D32] hover:bg-[#2E7D32]/90 text-white focus:ring-green-500 rounded-[30px] cursor-pointer',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    outline: 'border-1 border-[#A1DF0A] text-[#A1DF0A] rounded-[30px] hover:bg-[#2E7D32]/90 focus:ring-[#A1DF0A] cursor-pointer hover:text-white',
  };
  
  const sizes = {
    sm: 'min-h-12 px-4 py-2 text-sm',
    md: 'min-h-14 px-6 py-3 text-base',
    lg: 'min-h-14 px-7 py-3.5 text-lg',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

