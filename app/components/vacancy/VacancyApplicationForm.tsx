'use client';

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '@/app/components/ui/Button';
import { createVacancyApplication } from '@/app/lib/strapi';
import type { VacancyDetailLabelsViewModel } from '@/app/lib/vacancy/pageData';

interface VacancyApplicationFormProps {
  contactNumberLabel: string;
  cvLabel: string;
  emailLabel: string;
  fullNameLabel: string;
  heading: string;
  jobTitle: string;
  slug: string;
  submitLabel: string;
  validationLabels: VacancyDetailLabelsViewModel['validationLabels'];
}

function FormField({
  error,
  id,
  label,
  onBlur,
  onChange,
  value,
  type = 'text',
  accept,
}: {
  error?: string;
  id: string;
  label: string;
  onBlur?: () => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  type?: 'text' | 'email' | 'tel' | 'file';
  accept?: string;
}) {
  const commonClasses =
    'mt-3 block w-full rounded-[8px] border border-[#E5E7EB] bg-white px-4 text-[15px] text-[#111827] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10';
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="text-[15px] font-medium text-[#374151]">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        accept={accept}
        value={type === 'file' ? undefined : value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
        className={`${commonClasses} ${
          type === 'file'
            ? 'min-h-[150px] px-4 py-4 file:mr-4 file:rounded-[6px] file:border-0 file:bg-[#EEF6EE] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#2E7D32] hover:file:bg-[#E4F1E4]'
            : 'h-[52px]'
        } ${error ? 'border-[#D92D20]' : ''}`}
      />
      <p
        id={error ? errorId : undefined}
        className={`mt-2 min-h-[20px] text-[12px] leading-5 text-[#D92D20] transition-opacity ${
          error ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {error || ' '}
      </p>
    </div>
  );
}

type FormValues = {
  contactNumber: string;
  email: string;
  fullName: string;
};

type FormErrors = Partial<Record<keyof FormValues | 'cv', string>>;
type FormTouched = Partial<Record<keyof FormValues | 'cv', boolean>>;
type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

function validateField(
  name: keyof FormValues | 'cv',
  value: string | File | null,
  validationLabels: VacancyApplicationFormProps['validationLabels']
): string {
  switch (name) {
    case 'fullName': {
      const normalized = typeof value === 'string' ? value.trim() : '';
      if (!normalized) return validationLabels.fullName.requiredLabel;
      if (normalized.length < 3) {
        return validationLabels.fullName.minimumCharacterLabel;
      }
      if (normalized.length > 255) {
        return validationLabels.fullName.maximumCharactersLabel;
      }
      return '';
    }
    case 'email': {
      const normalized = typeof value === 'string' ? value.trim() : '';
      if (!normalized) return validationLabels.email.requiredLabel;
      if (normalized.length > 255) {
        return validationLabels.email.maximumCharactersLabel;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return 'Enter a valid email address.';
      return '';
    }
    case 'contactNumber': {
      const normalized = typeof value === 'string' ? value.trim() : '';
      if (!normalized) return validationLabels.contactNumber.requiredLabel;
      if (normalized.length < 7 || normalized.length > 20) {
        return 'Contact number must be between 7 and 20 characters.';
      }
      if (!/^[+\d\s\-()]+$/.test(normalized)) {
        return 'Enter a valid contact number.';
      }
      return '';
    }
    case 'cv': {
      if (!(value instanceof File)) return validationLabels.cvRequired;
      const lowerName = value.name.toLowerCase();
      if (!lowerName.endsWith('.pdf') && !lowerName.endsWith('.doc') && !lowerName.endsWith('.docx')) {
        return validationLabels.cvType;
      }
      if (value.size <= 0) return validationLabels.cvEmptyFile;
      return '';
    }
    default:
      return '';
  }
}

export default function VacancyApplicationForm({
  contactNumberLabel,
  cvLabel,
  emailLabel,
  fullNameLabel,
  heading,
  jobTitle,
  slug,
  submitLabel,
  validationLabels,
}: VacancyApplicationFormProps) {
  const [values, setValues] = useState<FormValues>({
    contactNumber: '',
    email: '',
    fullName: '',
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const isSubmitting = status === 'submitting';

  function resetFeedback() {
    if (status !== 'idle' || submitMessage) {
      setStatus('idle');
      setSubmitMessage(null);
    }
  }

  function updateValue(name: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    resetFeedback();

    if (touched[name]) {
      setErrors((current) => ({
        ...current,
        [name]: validateField(name, value, validationLabels),
      }));
    }
  }

  function handleBlur(name: keyof FormValues | 'cv') {
    setTouched((current) => ({ ...current, [name]: true }));
    setErrors((current) => ({
      ...current,
      [name]:
        name === 'cv'
          ? validateField('cv', cvFile, validationLabels)
          : validateField(name, values[name], validationLabels),
    }));
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] || null;
    setCvFile(nextFile);
    resetFeedback();

    if (touched.cv) {
      setErrors((current) => ({
        ...current,
        cv: validateField('cv', nextFile, validationLabels),
      }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;

    const nextErrors: FormErrors = {
      fullName: validateField('fullName', values.fullName, validationLabels),
      email: validateField('email', values.email, validationLabels),
      contactNumber: validateField('contactNumber', values.contactNumber, validationLabels),
      cv: validateField('cv', cvFile, validationLabels),
    };

    setTouched({
      contactNumber: true,
      cv: true,
      email: true,
      fullName: true,
    });
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean) || !cvFile) {
      return;
    }

    setStatus('submitting');
    setSubmitMessage(null);

    try {
      const response = await createVacancyApplication({
        slug,
        fullname: values.fullName.trim(),
        email: values.email.trim(),
        contactnumber: values.contactNumber.trim(),
        cv: cvFile,
      });

      setValues({
        contactNumber: '',
        email: '',
        fullName: '',
      });
      setCvFile(null);
      setErrors({});
      setTouched({});
      setStatus('success');
      setSubmitMessage(
        response.message || validationLabels.submitSuccessMessage
      );
      formElement.reset();
    } catch (error: unknown) {
      setStatus('error');
      setSubmitMessage(
        error instanceof Error
          ? error.message || validationLabels.applicationErrorMessage
          : validationLabels.applicationErrorMessage
      );
    }
  }

  return (
    <section id="apply-form" className="mt-14 scroll-mt-28">
      <h2 className="text-[34px] font-semibold leading-tight text-[#1F3552]">
        {heading}
      </h2>

      <form
        className="mt-8 space-y-6"
        onSubmit={handleSubmit}
        noValidate
        encType="multipart/form-data"
      >
        <input type="hidden" name="jobTitle" value={jobTitle} />

        <FormField
          error={errors.fullName}
          id="fullName"
          label={fullNameLabel}
          onBlur={() => handleBlur('fullName')}
          onChange={(event) => updateValue('fullName', event.target.value)}
          value={values.fullName}
        />
        <FormField
          error={errors.email}
          id="email"
          label={emailLabel}
          type="email"
          onBlur={() => handleBlur('email')}
          onChange={(event) => updateValue('email', event.target.value)}
          value={values.email}
        />
        <FormField
          error={errors.contactNumber}
          id="contactNumber"
          label={contactNumberLabel}
          type="tel"
          onBlur={() => handleBlur('contactNumber')}
          onChange={(event) => updateValue('contactNumber', event.target.value)}
          value={values.contactNumber}
        />
        <FormField
          error={errors.cv}
          id="cv"
          label={cvLabel}
          type="file"
          accept=".pdf,.doc,.docx"
          onBlur={() => handleBlur('cv')}
          onChange={handleFileChange}
        />

        <div className="min-h-[24px]" aria-live="polite">
          {status === 'success' && submitMessage ? (
            <p className="text-[14px] leading-6 text-[#2E7D32]">{submitMessage}</p>
          ) : null}
          {status === 'error' && submitMessage ? (
            <p className="text-[14px] leading-6 text-[#D92D20]">{submitMessage}</p>
          ) : null}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          variant="primary"
          size="md"
          className="min-h-[52px] gap-4 !rounded-[2px] px-6 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-70"
          aria-label={`Send application for ${jobTitle}`}
        >
          <span className="inline-flex items-center gap-4">
            <span>{isSubmitting ? 'Sending...' : submitLabel}</span>
            <ArrowRight className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
          </span>
        </Button>
      </form>
    </section>
  );
}
