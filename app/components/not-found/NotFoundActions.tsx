import Link from 'next/link';
import { ArrowRight, Home, Mail } from 'lucide-react';
import Button from '@/app/components/ui/Button';
import { addLocaleToUrl } from '@/app/lib/locale';

interface NotFoundActionsProps {
  locale?: string;
  homeLabel?: string;
  contactLabel?: string;
}

export default function NotFoundActions({
  locale = 'en',
  homeLabel = 'Go Home',
  contactLabel = 'Contact Us',
}: NotFoundActionsProps) {
  const homeHref = addLocaleToUrl('/', locale);
  const contactHref = addLocaleToUrl('/contact', locale);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <Link href={homeHref} aria-label="Go back to the RRISL home page">
        <Button
          variant="primary"
          className="!flex items-center justify-center gap-2"
        >
          <Home className="h-4 w-4" />
          {homeLabel}
        </Button>
      </Link>

      <Link href={contactHref} aria-label="Go to the RRISL contact page">
        <Button
          variant="outline"
          className="!flex items-center justify-center gap-2"
        >
          <Mail className="h-4 w-4" />
          {contactLabel}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
