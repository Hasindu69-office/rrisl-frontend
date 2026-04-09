'use client';

import { useState } from 'react';

import {
  createContactMessage,
  type CreateContactMessageInput,
} from '@/app/lib/strapi';

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

export function useContactFormSubmission() {
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function submitContactMessage(payload: CreateContactMessageInput) {
    setStatus('submitting');
    setErrorMessage(null);

    try {
      await createContactMessage(payload);
      setStatus('success');
    } catch (error: unknown) {
      console.error('Contact message submission error:', error);

      setStatus('error');

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again later.'
      );

      throw error;
    }
  }

  function resetSubmissionState() {
    if (status !== 'idle') {
      setStatus('idle');
      setErrorMessage(null);
    }
  }

  return {
    status,
    errorMessage,
    submitContactMessage,
    resetSubmissionState,
  };
}
