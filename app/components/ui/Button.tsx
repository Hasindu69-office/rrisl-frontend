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
    primary: 'bg-[#2E7D32] hover:bg-[#2E7D32]/90 text-white rounded-[30px] cursor-pointer',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'border-1 border-[#A1DF0A] text-[#A1DF0A] rounded-[30px] hover:bg-[#2E7D32]/90 cursor-pointer hover:text-white',
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
      {children}
    </button>
  );
}
