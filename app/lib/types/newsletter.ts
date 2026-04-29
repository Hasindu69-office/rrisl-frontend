export interface NewsletterSection {
  id: number;
  documentId?: string;
  Title: string;
  EmailPlaceholder?: string | null;
  ButtonText: string;
  SuccessMessage: string;
  ErrorMessage: string;
  locale?: string;
}
