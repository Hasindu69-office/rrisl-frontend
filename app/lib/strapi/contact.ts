import { getStrapiUrl } from './client';

export type CreateContactMessageInput = {
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  subject: string;
  message: string;
};

export async function createContactMessage(
  payload: CreateContactMessageInput
): Promise<void> {
  const url = getStrapiUrl('/api/contact-messages');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: payload,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    let errorMessage = 'Failed to create contact message.';

    try {
      const parsedError = JSON.parse(errorText) as {
        message?: string;
        error?: {
          message?: string;
        };
      };

      errorMessage = parsedError.message || parsedError.error?.message || errorMessage;
    } catch {
      // Keep the default message when the response body is not JSON.
    }

    console.error(
      `[Strapi API] Error ${response.status} ${response.statusText} for ${url}`,
      errorText
    );
    throw new Error(errorMessage);
  }
}
