import Image from 'next/image';
import Link from 'next/link';

import Button from '@/app/components/ui/Button';

export interface PublicationCardItem {
  id: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  readMoreHref: string;
}

interface PublicationCardProps {
  item: PublicationCardItem;
  className?: string;
  imageWrapperClassName?: string;
  titleClassName?: string;
  buttonLabel?: string;
}

export default function PublicationCard({
  item,
  className = '',
  imageWrapperClassName = '',
  titleClassName = '',
  buttonLabel = 'Read More',
}: PublicationCardProps) {
  return (
    <article
      className={`rounded-[20px] border border-[#E6E8E4] bg-white px-2.5 pb-5 pt-0.5 shadow-[0_12px_36px_rgba(15,63,29,0.04)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,63,29,0.08)] md:px-3 md:pb-5 ${className}`}
    >
      <div
        className={`pointer-events-none relative mx-auto -mb-1 -mt-6 aspect-[0.82] w-[calc(100%+16px)] max-w-[248px] md:w-[calc(100%+28px)] md:max-w-[286px] ${imageWrapperClassName}`}
      >
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          fill
          className="scale-[1.5] object-contain"
          sizes="(max-width: 767px) 78vw, (max-width: 1279px) 38vw, (max-width: 1535px) 28vw, 18vw"
        />
      </div>

      <div className="relative z-[1] mt-0 flex w-full flex-col items-center text-center">
        <h3
          className={`w-[calc(100%+20px)] text-[15px] font-semibold leading-[1.2] text-[#101828] ${titleClassName}`}
        >
          {item.title}
        </h3>

        <div className="mb-[18px] mt-2 flex justify-center">
          <Link href={item.readMoreHref} className="inline-flex">
            <Button
              variant="outline"
              size="sm"
              className="!h-[42px] !w-[138px] !rounded-[999px] !px-0 !py-0 text-[13px] font-medium"
            >
              {buttonLabel}
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
