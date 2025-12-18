'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { FooterSocialLink } from './footerData';

interface FooterSocialsProps {
  links: FooterSocialLink[];
  className?: string;
}

const SocialIcon = ({ type }: { type: FooterSocialLink['type'] }) => {
  const icons = {
    facebook: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    instagram: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.5 6.5H17.51M7 2H17C19.7614 2 22 4.23858 22 7V17C22 19.7614 19.7614 22 17 22H7C4.23858 22 2 19.7614 2 17V7C2 4.23858 4.23858 2 7 2ZM16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61992 14.1902 8.22773 13.4229 8.09407 12.5922C7.9604 11.7616 8.09207 10.9099 8.47033 10.1584C8.84859 9.40685 9.45419 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87659 12.63 8C13.4789 8.12588 14.2649 8.52146 14.8717 9.12831C15.4785 9.73515 15.8741 10.5211 16 11.37Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    linkedin: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 9H2V21H6V9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    youtube: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.50001 17C1.80143 13.7033 1.80143 10.2967 2.50001 7C2.5918 6.66521 2.76914 6.36007 3.01461 6.11461C3.26008 5.86914 3.56522 5.69179 3.90001 5.6C9.26346 4.71146 14.7366 4.71146 20.1 5.6C20.4348 5.69179 20.7399 5.86914 20.9854 6.11461C21.2309 6.36007 21.4082 6.66521 21.5 7C22.1986 10.2967 22.1986 13.7033 21.5 17C21.4082 17.3348 21.2309 17.6399 20.9854 17.8854C20.7399 18.1309 20.4348 18.3082 20.1 18.4C14.7366 19.2887 9.26344 19.2887 3.90001 18.4C3.56522 18.3082 3.26008 18.1309 3.01461 17.8854C2.76914 17.6399 2.5918 17.3348 2.50001 17Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 15L15 12L10 9V15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  };

  return icons[type] || null;
};

export default function FooterSocials({ links, className = '' }: FooterSocialsProps) {
  if (!links.length) return null;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);

  // Detect when the socials column scrolls into view
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasEnteredView(true);
            observer.disconnect();
          }
        });
      },
      {
        root: null,
        threshold: 0.2,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col items-center gap-3 ${className}`}
      aria-label="Social media links"
    >
      {links.map((link, index) => {
        const delay = 0.15 * index; // stagger each icon a bit

        return (
          <a
            key={link.type}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Visit our ${link.type} page`}
            className="group relative flex h-[66px] w-[66px] items-center justify-center transition-transform transition-opacity duration-500 hover:opacity-90"
            style={{
              opacity: hasEnteredView ? 1 : 0,
              transform: hasEnteredView ? 'translateY(0)' : 'translateY(-40px)',
              transitionDelay: `${delay}s`,
            }}
          >
            {/* Gradient border using mask */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(to right, #20C997, #A1DF0A)',
                maskImage: `radial-gradient(circle, transparent 32px, black 32px, black 33px, transparent 33px)`,
                WebkitMaskImage: `radial-gradient(circle, transparent 32px, black 32px, black 33px, transparent 33px)`,
              }}
            />
            {/* Icon on top */}
            <div className="relative z-10">
              <SocialIcon type={link.type} />
            </div>
          </a>
        );
      })}
    </div>
  );
}



