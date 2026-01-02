/* eslint-disable jsx-a11y/label-has-associated-control */
'use client';

import React from 'react';
import { useNewsletterForm } from '@/app/hooks/useNewsletterForm';
import Button from '@/app/components/ui/Button';

export default function FooterNewsletter() {
  const { email, status, errorMessage, setEmail, handleSubmit } = useNewsletterForm();

  const isSubmitting = status === 'submitting';
  const isSuccess = status === 'success';

  return (
    <section
      aria-label="Newsletter subscription"
      className="relative z-20 px-4 md:px-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-[1480px]">
        <div className="relative flex items-center overflow-hidden rounded-[16px] md:rounded-[24px] lg:rounded-[32px] bg-gradient-to-r from-[#20C997] to-[#A1DF0A] px-4 py-6 sm:px-6 sm:py-8 md:px-12 md:py-10 lg:px-[97px] lg:py-0 lg:h-[366px] shadow-[0_16px_40px_rgba(0,0,0,0.25)] md:shadow-[0_24px_60px_rgba(0,0,0,0.3)] lg:shadow-[0_32px_80px_rgba(0,0,0,0.35)]">
          {/* Content layout */}
          <div className="w-full grid items-center gap-6 sm:gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            {/* Text */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[50px] font-bold leading-[130%] text-white">
                Stay Updated With the Latest Research &amp; Insights
              </h2>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="w-full lg:w-[561px] h-auto lg:h-[74px]"
              noValidate
            >
              <label className="sr-only" htmlFor="footer-newsletter-email">
                Email address
              </label>
              
              {/* Mobile/Tablet: Stacked layout */}
              <div className="flex flex-col gap-3 lg:hidden">
                <input
                  id="footer-newsletter-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter Your Email"
                  className="w-full h-12 sm:h-14 bg-white rounded-[24px] sm:rounded-[32px] px-4 sm:px-6 text-sm md:text-base text-gray-800 placeholder:text-gray-500 outline-none"
                  aria-invalid={errorMessage ? 'true' : 'false'}
                  aria-describedby={errorMessage ? 'footer-newsletter-error' : undefined}
                  required
                />
                <Button
                  type="submit"
                  variant="outline"
                  disabled={isSubmitting || isSuccess}
                  className="!w-full sm:!w-auto sm:!mx-auto !h-12 sm:!h-14 !rounded-[24px] sm:!rounded-[32px] border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white disabled:cursor-default disabled:opacity-80 text-sm sm:text-base px-8"
                >
                  {isSubmitting ? 'Submitting...' : isSuccess ? 'Subscribed' : 'Submit'}
                </Button>
              </div>

              {/* Desktop: Inline layout (preserved original design) */}
              <div className="hidden lg:block relative w-full h-full bg-white rounded-[50px] flex items-center">
                <input
                  id="footer-newsletter-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter Your Email"
                  className="flex-1 h-full bg-transparent pl-[39px] pr-[190px] text-base text-gray-800 placeholder:text-gray-500 outline-none rounded-l-[50px]"
                  aria-invalid={errorMessage ? 'true' : 'false'}
                  aria-describedby={errorMessage ? 'footer-newsletter-error' : undefined}
                  required
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={isSubmitting || isSuccess}
                    className="!w-[178px] !h-[56px] !rounded-[50px] border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white disabled:cursor-default disabled:opacity-80"
                  >
                    {isSubmitting ? 'Submitting...' : isSuccess ? 'Subscribed' : 'Submit'}
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="min-h-[1.5rem] mt-2">
                {errorMessage && (
                  <p
                    id="footer-newsletter-error"
                    role="alert"
                    className="text-sm text-red-100"
                  >
                    {errorMessage}
                  </p>
                )}
                {isSuccess && !errorMessage && (
                  <p
                    role="status"
                    className="text-sm text-emerald-50"
                  >
                    Thank you for subscribing. You&apos;ll start receiving updates soon.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}



