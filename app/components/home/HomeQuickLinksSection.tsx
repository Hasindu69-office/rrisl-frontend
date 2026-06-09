import Image from 'next/image';
import Link from 'next/link';

const quickLinks = [
  {
    title: 'PROCUREMENT NOTICE',
    href: '/bid-notice',
  },
  {
    title: 'DOWNLOADS',
    href: '/downloads',
  },
  {
    title: 'ADVISORY CIRCULARS',
    href: '/e-Library-Publications',
  },
  {
    title: 'RUBBER PRICES',
    href: '/rubber-prices',
  },
  {
    title: 'CONTACT',
    href: '/contact',
  },
];

export default function HomeQuickLinksSection() {
  return (
    <section className="overflow-x-clip bg-white py-6 md:py-10">
      <div className="mx-auto w-full max-w-[1600px] px-3 min-[420px]:px-4 md:px-6 xl:w-[80%] xl:px-0">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-4 xl:grid-cols-5 xl:gap-6">
          {quickLinks.map((item, index) => (
            <Link
              key={`${item.title}-${item.href}`}
              href={item.href}
              className={[
                'group flex h-full rounded-[10px] bg-[linear-gradient(90deg,#20C997,#9BDE10)] p-px transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#20C997] focus-visible:ring-offset-4',
                'md:col-span-2 xl:col-span-1',
                index === 3 ? 'md:col-start-2 xl:col-start-auto' : '',
              ].join(' ')}
              aria-label={`Open ${item.title.toLowerCase()}`}
            >
              <span className="flex min-h-[104px] w-full flex-col items-center justify-center rounded-[9px] bg-white px-3 py-4 text-center shadow-[0_12px_30px_rgba(15,63,29,0.04)] transition-shadow duration-300 group-hover:shadow-[0_18px_40px_rgba(15,63,29,0.10)] min-[420px]:min-h-[116px] min-[420px]:px-4 md:min-h-[130px] md:px-5 md:py-5 xl:items-start xl:text-left">
                <Image
                  src="/images/lets-icons_arhives-group-docks-light.png"
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
                <span className="mt-3 max-w-full break-words text-[14px] font-semibold leading-tight text-[#2E7D32] md:mt-4">
                  {item.title}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
