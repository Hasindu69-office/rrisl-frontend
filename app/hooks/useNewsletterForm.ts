'use client';

import { useState, FormEvent } from 'react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function useNewsletterForm() {
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      setStatus('error');
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!isValidEmail(email.trim())) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('submitting');
    setErrorMessage(null);

    try {
      // Backend is not implemented yet.
      // Simulate a short delay to provide feedback and keep API integration simple for later.
      await new Promise((resolve) => setTimeout(resolve, 800));

      setStatus('success');
    } catch (error) {
      console.error('Newsletter subscription error (mock):', error);
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again later.');
    }
  }

  return {
    email,
    status,
    errorMessage,
    setEmail: handleEmailChange,
    handleSubmit,
  };
}



