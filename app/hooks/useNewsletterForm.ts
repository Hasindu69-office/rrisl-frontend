'use client';

import { useState, FormEvent } from 'react';
import { createNewsletterSubscriber } from '@/app/lib/strapi';

type Status = 'idle' | 'submitting' | 'success' | 'error';

type UseNewsletterFormOptions = {
  genericErrorMessage?: string;
};

export function useNewsletterForm(options: UseNewsletterFormOptions = {}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleEmailChange(value: string) {
    setEmail(value);
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage(null);
    }
  }

  function isValidEmail(value: string) {
    // Simple email pattern for frontend validation only
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function resetSubmissionState() {
    if (status !== 'idle') {
      setStatus('idle');
      setErrorMessage(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setStatus('error');
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('submitting');
    setErrorMessage(null);

    try {
      const sourcePage =
        typeof window !== 'undefined'
          ? `${window.location.pathname}${window.location.search}` || '/'
          : '/';
      await createNewsletterSubscriber({
        Email: normalizedEmail,
        SourcePage: sourcePage,
        SubscribedAt: new Date().toISOString(),
        State: 'Active',
      });
      setEmail('');
      setStatus('success');
    } catch (error: unknown) {
      console.error('Newsletter subscription error:', error);
      setStatus('error');
      setErrorMessage(
        error instanceof Error
          ? error.message || options.genericErrorMessage || 'Something went wrong. Please try again later.'
          : options.genericErrorMessage || 'Something went wrong. Please try again later.'
      );
    }
  }

  return {
    email,
    status,
    errorMessage,
    setEmail: handleEmailChange,
    handleSubmit,
    resetSubmissionState,
  };
}
