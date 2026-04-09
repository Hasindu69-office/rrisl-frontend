'use client';

import Link from 'next/link';
import { ArrowRight, Home, Mail } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Button from '@/app/components/ui/Button';
import { addLocaleToUrl } from '@/app/lib/locale';

export default function NotFoundActions() {
  const searchParams = useSearchParams();
  const currentLocale = searchParams.get('locale') || 'en';

  const homeHref = addLocaleToUrl('/', currentLocale);
  const contactHref = addLocaleToUrl('/contact', currentLocale);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <Link href={homeHref} aria-label="Go back to the RRISL home page">
        <Button
          variant="primary"
          className="!flex !w-[200px] items-center justify-center gap-2 !rounded-[999px] shadow-[0_14px_40px_rgba(46,125,50,0.3)]"
        >
          <Home className="h-4 w-4" />
          Go Home
        </Button>
      </Link>

      <Link href={contactHref} aria-label="Go to the RRISL contact page">
        <Button
          variant="outline"
          className="!flex !w-[200px] items-center justify-center gap-2 !rounded-[999px] border-[#2E7D32] bg-white/80 text-[#2E7D32] backdrop-blur-sm hover:bg-[#2E7D32] hover:text-white"
        >
          <Mail className="h-4 w-4" />
          Contact Us
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
