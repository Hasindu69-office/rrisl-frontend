import Image from 'next/image';
import Link from 'next/link';
import type { HomeQuickLinksSectionViewModel } from '@/app/lib/home/quickLinksSection';
import { isLocalhostAssetUrl } from '@/app/lib/strapi';

interface HomeQuickLinksSectionProps {
  section: HomeQuickLinksSectionViewModel;
}

export default function HomeQuickLinksSection({
  section,
}: HomeQuickLinksSectionProps) {
  const shouldCenterFifthItem = section.items.length === 5;

  return (
    <section className="overflow-x-clip bg-white py-6 md:py-10">
      <div className="mx-auto w-full max-w-[1600px] px-3 min-[420px]:px-4 md:px-6 xl:w-[80%] xl:px-0">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-4 xl:grid-cols-5 xl:gap-6">
          {section.items.map((item, index) => {
            const className = [
              'group flex h-full rounded-[10px] bg-[linear-gradient(90deg,#20C997,#9BDE10)] p-px transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20C997] focus-visible:ring-offset-4',
              'md:col-span-2 xl:col-span-1',
              shouldCenterFifthItem && index === 3 ? 'md:col-start-2 xl:col-start-auto' : '',
            ].join(' ');
            const content = (
              <span className="flex min-h-[104px] w-full flex-col items-center justify-center rounded-[9px] bg-white px-3 py-4 text-center shadow-[0_12px_30px_rgba(15,63,29,0.04)] transition-shadow duration-300 group-hover:shadow-[0_18px_40px_rgba(15,63,29,0.10)] min-[420px]:min-h-[116px] min-[420px]:px-4 md:min-h-[130px] md:px-5 md:py-5 xl:items-start xl:text-left">
                <Image
                  src={item.iconSrc}
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                  unoptimized={isLocalhostAssetUrl(item.iconSrc)}
                />
                <span className="mt-3 max-w-full break-words text-[14px] font-semibold leading-tight text-[#2E7D32] md:mt-4">
                  {item.title}
                </span>
              </span>
            );

            if (item.isExternal || item.openInNewTab) {
              return (
                <a
                  key={`${item.title}-${item.href}`}
                  href={item.href}
                  target={item.openInNewTab ? '_blank' : '_self'}
                  rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                  className={className}
                  aria-label={`Open ${item.title.toLowerCase()}`}
                >
                  {content}
                </a>
              );
            }

            return (
              <Link
                key={`${item.title}-${item.href}`}
                href={item.href}
                className={className}
                aria-label={`Open ${item.title.toLowerCase()}`}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
