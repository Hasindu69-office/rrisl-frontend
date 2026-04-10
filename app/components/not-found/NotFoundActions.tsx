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
    <div className="flex w-full max-w-[28rem] flex-col items-stretch gap-3 sm:max-w-[34rem] sm:flex-row sm:justify-center">
      <Link
        href={homeHref}
        aria-label="Go back to the RRISL home page"
        className="flex w-full sm:flex-1 md:w-auto md:flex-none"
      >
        <Button
          variant="primary"
          className="!flex w-full min-w-0 items-center justify-center gap-2 px-5 py-3 text-center leading-tight sm:min-h-[56px] sm:px-6 md:min-w-[178px] xl:!w-[200px]"
        >
          <Home className="h-4 w-4" />
          {homeLabel}
        </Button>
      </Link>

      <Link
        href={contactHref}
        aria-label="Go to the RRISL contact page"
        className="flex w-full sm:flex-1 md:w-auto md:flex-none"
      >
        <Button
          variant="outline"
          className="!flex w-full min-w-0 items-center justify-center gap-2 px-5 py-3 text-center leading-tight sm:min-h-[56px] sm:px-6 md:min-w-[178px] xl:!w-[200px]"
        >
          <Mail className="h-4 w-4" />
          {contactLabel}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
