'use client';

import { useState } from 'react';
import type {
  ChangeEvent,
  FormEvent,
  InputHTMLAttributes,
} from 'react';

import Button from '@/app/components/ui/Button';
import { useContactFormSubmission } from '@/app/hooks/useContactFormSubmission';
import type { ContactFormPanelProps } from '@/app/lib/contact/pageData';

const contactFormValidation = {
  firstName: { minLength: 3, maxLength: 50 },
  lastName: { minLength: 3, maxLength: 50 },
  email: { minLength: 3, maxLength: 255 },
  phoneNumber: { pattern: '^[0-9]+$', maxLength: 20 },
  message: { minLength: 10, maxLength: 255 },
} as const;

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;
type FormTouched = Partial<Record<keyof FormValues, boolean>>;
type FieldName = keyof FormValues;

function buildInitialValues(subjectOptions: ContactFormPanelProps['subjectOptions']): FormValues {
  return {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    subject: subjectOptions[0]?.value || '',
    message: '',
  };
}

function validateField(
  name: FieldName,
  value: string,
  labels: ContactFormPanelProps['labels']
): string {
  const trimmedValue = value.trim();

  switch (name) {
    case 'firstName':
      if (!trimmedValue) return labels.firstNameRequiredMessage;
      if (trimmedValue.length < contactFormValidation.firstName.minLength) {
        return `First name must be at least ${contactFormValidation.firstName.minLength} characters.`;
      }
      if (trimmedValue.length > contactFormValidation.firstName.maxLength) {
        return `First name cannot exceed ${contactFormValidation.firstName.maxLength} characters.`;
      }
      return '';

    case 'lastName':
      if (!trimmedValue) return labels.lastNameRequiredMessage;
      if (trimmedValue.length < contactFormValidation.lastName.minLength) {
        return `Last name must be at least ${contactFormValidation.lastName.minLength} characters.`;
      }
      if (trimmedValue.length > contactFormValidation.lastName.maxLength) {
        return `Last name cannot exceed ${contactFormValidation.lastName.maxLength} characters.`;
      }
      return '';

    case 'email':
      if (!trimmedValue) return labels.emailRequiredMessage;
      if (trimmedValue.length < contactFormValidation.email.minLength) {
        return `Email must be at least ${contactFormValidation.email.minLength} characters.`;
      }
      if (trimmedValue.length > contactFormValidation.email.maxLength) {
        return `Email cannot exceed ${contactFormValidation.email.maxLength} characters.`;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
        return 'Enter a valid email address.';
      }
      return '';

    case 'phoneNumber':
      if (!trimmedValue) return labels.phoneNumberRequiredMessage;
      if (!new RegExp(contactFormValidation.phoneNumber.pattern).test(trimmedValue)) {
        return 'Phone number must contain digits only.';
      }
      return '';

    case 'subject':
      if (!trimmedValue) return 'Select a subject.';
      return '';

    case 'message':
      if (!trimmedValue) return labels.messageRequiredMessage;
      if (trimmedValue.length < contactFormValidation.message.minLength) {
        return `Message must be at least ${contactFormValidation.message.minLength} characters.`;
      }
      if (trimmedValue.length > contactFormValidation.message.maxLength) {
        return `Message cannot exceed ${contactFormValidation.message.maxLength} characters.`;
      }
      return '';

    default:
      return '';
  }
}

function UnderlineField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  autoComplete,
  minLength,
  maxLength,
  required = true,
  pattern,
  inputMode,
  title,
  error,
}: {
  id: Extract<FieldName, 'firstName' | 'lastName' | 'email' | 'phoneNumber'>;
  label: string;
  type?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  autoComplete?: string;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  pattern?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
  title?: string;
  error?: string;
}) {
  const errorId = `${id}-error`;

  return (
    <label htmlFor={id} className="block">
      <span className="block text-[12px] leading-[1.2] text-[#000000]">{label}</span>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        minLength={minLength}
        maxLength={maxLength}
        required={required}
        pattern={pattern}
        inputMode={inputMode}
        title={title}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
        className={`mt-2 h-10 w-full border-b bg-transparent pb-2 text-[16px] leading-6 text-[#102337] outline-none placeholder:text-[rgba(141,141,141,1)] focus:border-[#2E7D32] ${
          error ? 'border-[#D92D20]' : 'border-[rgba(141,141,141,1)]'
        }`}
      />
      <p
        id={error ? errorId : undefined}
        className={`mt-2 min-h-[20px] text-[12px] leading-5 text-[#D92D20] transition-opacity ${
          error ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {error || ' '}
      </p>
    </label>
  );
}

export default function ContactFormPanel({ labels, subjectOptions }: ContactFormPanelProps) {
  const [values, setValues] = useState<FormValues>(() => buildInitialValues(subjectOptions));
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const {
    status,
    errorMessage: submitErrorMessage,
    submitContactMessage,
    resetSubmissionState,
  } = useContactFormSubmission();

  const isSubmitting = status === 'submitting';

  const updateField = (name: FieldName, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
    resetSubmissionState();

    if (touched[name]) {
      setErrors((current) => ({
        ...current,
        [name]: validateField(name, value, labels),
      }));
    }
  };

  const handleBlur = (name: FieldName) => {
    setTouched((current) => ({ ...current, [name]: true }));
    setErrors((current) => ({
      ...current,
      [name]: validateField(name, values[name], labels),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextTouched: FormTouched = {
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      subject: true,
      message: true,
    };

    const nextErrors: FormErrors = {
      firstName: validateField('firstName', values.firstName, labels),
      lastName: validateField('lastName', values.lastName, labels),
      email: validateField('email', values.email, labels),
      phoneNumber: validateField('phoneNumber', values.phoneNumber, labels),
      subject: validateField('subject', values.subject, labels),
      message: validateField('message', values.message, labels),
    };

    setTouched(nextTouched);
    setErrors(nextErrors);

    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (hasErrors) {
      return;
    }

    try {
      await submitContactMessage({
        firstname: values.firstName.trim(),
        lastname: values.lastName.trim(),
        email: values.email.trim(),
        phonenumber: values.phoneNumber.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
      });

      setValues(buildInitialValues(subjectOptions));
      setErrors({});
      setTouched({});
    } catch {
      // Error state is handled by the submission hook.
    }
  };

  return (
    <div className="flex h-full min-h-[520px] bg-white px-8 py-8 shadow-[0_18px_60px_rgba(0,0,0,0.08)] md:px-10 md:py-10 lg:px-12 lg:py-12 xl:px-16">
      <form className="flex w-full flex-col" noValidate onSubmit={handleSubmit}>
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          <UnderlineField
            id="firstName"
            label={labels.firstNameLabel}
            value={values.firstName}
            onChange={(event) => updateField('firstName', event.target.value)}
            onBlur={() => handleBlur('firstName')}
            autoComplete="given-name"
            minLength={contactFormValidation.firstName.minLength}
            maxLength={contactFormValidation.firstName.maxLength}
            title={`First name must be between ${contactFormValidation.firstName.minLength} and ${contactFormValidation.firstName.maxLength} characters.`}
            error={errors.firstName}
          />
          <UnderlineField
            id="lastName"
            label={labels.lastNameLabel}
            value={values.lastName}
            onChange={(event) => updateField('lastName', event.target.value)}
            onBlur={() => handleBlur('lastName')}
            autoComplete="family-name"
            minLength={contactFormValidation.lastName.minLength}
            maxLength={contactFormValidation.lastName.maxLength}
            title={`Last name must be between ${contactFormValidation.lastName.minLength} and ${contactFormValidation.lastName.maxLength} characters.`}
            error={errors.lastName}
          />
          <UnderlineField
            id="email"
            label={labels.emailLabel}
            type="email"
            value={values.email}
            onChange={(event) => updateField('email', event.target.value)}
            onBlur={() => handleBlur('email')}
            autoComplete="email"
            minLength={contactFormValidation.email.minLength}
            maxLength={contactFormValidation.email.maxLength}
            title={`Email must be between ${contactFormValidation.email.minLength} and ${contactFormValidation.email.maxLength} characters.`}
            error={errors.email}
          />
          <UnderlineField
            id="phoneNumber"
            label={labels.phoneNumberLabel}
            type="tel"
            value={values.phoneNumber}
            onChange={(event) => updateField('phoneNumber', event.target.value)}
            onBlur={() => handleBlur('phoneNumber')}
            autoComplete="tel"
            pattern={contactFormValidation.phoneNumber.pattern}
            inputMode="numeric"
            maxLength={contactFormValidation.phoneNumber.maxLength}
            title="Phone number must contain digits only."
            error={errors.phoneNumber}
          />
        </div>

        <fieldset className="mt-10 border-0 p-0">
          <legend className="text-[12px] font-medium leading-[1.2] text-[#000000]">
            {labels.selectSubjectLabel}
          </legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {subjectOptions.map((option) => (
              <label
                key={option.id}
                htmlFor={option.id}
                className="inline-flex cursor-pointer items-center gap-3 text-[12px] leading-[1.2] text-[#102337]"
              >
                <input
                  id={option.id}
                  type="radio"
                  name="subject"
                  value={option.value}
                  checked={values.subject === option.value}
                  onChange={(event) => updateField('subject', event.target.value)}
                  onBlur={() => handleBlur('subject')}
                  className="h-4 w-4 border border-[rgba(141,141,141,1)] text-[#2E7D32] focus:ring-[#2E7D32]"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          <p
            className={`mt-2 min-h-[20px] text-[12px] leading-5 text-[#D92D20] transition-opacity ${
              errors.subject ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {errors.subject || ' '}
          </p>
        </fieldset>

        <label htmlFor="message" className="mt-10 block">
          <span className="block text-[12px] leading-[1.2] text-[#000000]">{labels.messageLabel}</span>
          <textarea
            id="message"
            name="message"
            rows={3}
            value={values.message}
            onChange={(event) => updateField('message', event.target.value)}
            onBlur={() => handleBlur('message')}
            placeholder={labels.messagePlaceholder}
            autoComplete="off"
            minLength={contactFormValidation.message.minLength}
            maxLength={contactFormValidation.message.maxLength}
            required
            aria-invalid={errors.message ? 'true' : 'false'}
            aria-describedby={errors.message ? 'message-error' : undefined}
            title={`Message must be between ${contactFormValidation.message.minLength} and ${contactFormValidation.message.maxLength} characters.`}
            className={`mt-2 min-h-[48px] w-full resize-none border-b bg-transparent pb-2 text-[16px] leading-6 text-[#102337] outline-none placeholder:text-[rgba(141,141,141,1)] focus:border-[#2E7D32] ${
              errors.message ? 'border-[#D92D20]' : 'border-[rgba(141,141,141,1)]'
            }`}
          />
          <p
            id={errors.message ? 'message-error' : undefined}
            className={`mt-2 min-h-[20px] text-[12px] leading-5 text-[#D92D20] transition-opacity ${
              errors.message ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {errors.message || ' '}
          </p>
        </label>

        <div className="mt-4 min-h-[24px]" aria-live="polite">
          {status === 'success' ? (
            <p className="text-[14px] leading-6 text-[#2E7D32]">
              Your message has been sent successfully.
            </p>
          ) : null}
          {submitErrorMessage ? (
            <p className="text-[14px] leading-6 text-[#D92D20]">
              {submitErrorMessage}
            </p>
          ) : null}
        </div>

        <div className="mt-auto flex justify-end pt-12">
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="primary"
            size="md"
            className="min-h-[54px] min-w-[180px] !rounded-[5px] px-8 py-3 text-[18px] font-medium disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Sending...' : labels.buttonLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
