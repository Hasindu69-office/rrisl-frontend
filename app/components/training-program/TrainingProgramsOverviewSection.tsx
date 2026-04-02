import Image from 'next/image';
import GradientTag from '@/app/components/ui/GradientTag';
import GradientTitle from '@/app/components/ui/GradientTitle';

type TrainingProgramCardData = {
  title: string;
  items: string[];
  imageSrc: string;
  imageAlt: string;
  variant: 'light' | 'green';
  imageWrapClassName: string;
  imageClassName: string;
  contentClassName?: string;
  titleWrapClassName?: string;
  listClassName?: string;
  imageWidth: number;
  imageHeight: number;
};

const SECTION_COPY = {
  tag: 'FAQ',
  title: {
    part1: 'Training & Capacity',
    part2: 'Building for Farmers',
  },
  description:
    'Two types of training programs are conducted by the ASD for rubber growers',
} as const;

const trainingProgramCards: TrainingProgramCardData[] = [
  {
    title: 'Centralized farmer Training programs',
    items: [
      'Nursery management and bud grafting training for selected nursery owners and bud grafters',
      'Advance training on rubber cultivation and plantation management for medium scale rubber growers',
      'Advance training on rubber cultivation and processing for rubber growers in non traditional areas',
    ],
    imageSrc: '/images/farmerleft.png',
    imageAlt: 'Farmer standing with folded arms',
    variant: 'light',
    imageWrapClassName: 'right-[-4px] md:right-[-10px] lg:right-[-200px]',
    imageClassName: 'w-[140px] md:w-[190px] lg:w-[750px]',
    contentClassName: 'px-5 py-5 md:px-6 md:py-6 lg:pt-8 lg:pb-30 lg:px-10',
    titleWrapClassName: 'max-w-full pr-0',
    listClassName: 'mt-5 space-y-4 pr-0 md:mt-6 md:space-y-5 md:pr-24 lg:mt-10 lg:space-y-9 lg:pr-24',
    imageWidth: 800,
    imageHeight: 382,
  },
  {
    title: 'Decentralized Training Programs',
    items: [
      'Nursery management and bud grafting training for selected nursery owners and bud grafters',
      'Advance training on rubber cultivation and plantation management for medium scale rubber growers',
      'Advance training on rubber cultivation and processing for rubber growers in non traditional areas',
    ],
    imageSrc: '/images/farmerright.png',
    imageAlt: 'Farmer using a laptop',
    variant: 'green',
    imageWrapClassName: 'right-[-8px] md:right-[-14px] lg:right-[-130px]',
    imageClassName: 'w-[165px] md:w-[220px] lg:w-[650px]',
    contentClassName: 'px-5 py-5 md:px-6 md:py-6 lg:pt-8 lg:pb-30 lg:px-10',
    titleWrapClassName: 'max-w-full pr-0',
    listClassName: 'mt-5 space-y-4 pr-0 md:mt-6 md:space-y-5 md:pr-24 lg:mt-10 lg:space-y-9 lg:pr-24',
    imageWidth: 425,
    imageHeight: 328,
  },
] as const;

function TrainingProgramCard({
  title,
  items,
  imageSrc,
  imageAlt,
  variant,
  imageWrapClassName,
  imageClassName,
  contentClassName,
  titleWrapClassName,
  listClassName,
  imageWidth,
  imageHeight,
}: TrainingProgramCardData) {
  const isGreen = variant === 'green';

  return (
    <article
      className="relative min-h-[300px] overflow-hidden rounded-[20px] border border-[#21442A] md:min-h-[340px] lg:min-h-[396px]"
    >
      <div
        className={`absolute inset-0 ${
          isGreen
            ? 'bg-[linear-gradient(135deg,#8CC60D_0%,#A5D70F_100%)]'
            : 'bg-[linear-gradient(135deg,#F8F8F8_0%,#F2F2F2_100%)]'
        }`}
      />
      <div
        className={`absolute inset-0 ${
          isGreen
            ? 'bg-[radial-gradient(circle_at_50%_78%,rgba(213,255,41,0.9)_0%,rgba(196,242,41,0.58)_16%,rgba(170,220,25,0.28)_36%,rgba(166,214,29,0)_72%),repeating-conic-gradient(from_0deg_at_50%_78%,rgba(255,255,255,0.16)_0deg,rgba(255,255,255,0)_14deg,rgba(255,255,255,0.08)_24deg,rgba(255,255,255,0)_34deg)] opacity-45'
            : 'bg-[radial-gradient(circle_at_50%_78%,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.88)_18%,rgba(247,247,247,0.62)_38%,rgba(255,255,255,0)_70%),repeating-conic-gradient(from_0deg_at_50%_78%,rgba(115,115,115,0.09)_0deg,rgba(115,115,115,0)_14deg,rgba(115,115,115,0.05)_24deg,rgba(115,115,115,0)_34deg)] opacity-35'
        }`}
      />

      <div className={`relative z-10 flex h-full flex-col ${contentClassName ?? ''}`}>
        <div className={titleWrapClassName}>
          <h3
            className={`text-[22px] font-semibold leading-[1.25] md:text-[25px] lg:text-[26px] ${
              isGreen ? 'text-black' : 'text-[#2E7D32]'
            }`}
          >
            {title}
          </h3>
        </div>

        <ul className={listClassName}>
          {items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <Image
                src="/images/Checkboxicon.png"
                alt=""
                width={18}
                height={18}
                className={`mt-1 h-[18px] w-[18px] shrink-0 ${isGreen ? 'brightness-0' : ''}`}
                aria-hidden="true"
              />
              <p className="text-[14px] font-normal leading-[1.7] text-black md:text-[15px] md:leading-[1.75] lg:text-base lg:leading-[1.9]">
                {item}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className={`pointer-events-none absolute bottom-0 z-20 hidden lg:block ${imageWrapClassName}`}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
          className={`h-auto object-contain ${imageClassName}`}
        />
      </div>
    </article>
  );
}

/**
 * Section scaffold for the training programs overview.
 * The background and spacing are established first so the content grid
 * can be layered in incrementally without changing the section shell.
 */
export default function TrainingProgramsOverviewSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/datainsightsbackground.png"
          alt="Training programs background"
          fill
          priority
          className="object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,244,0.96)_0%,rgba(255,249,241,0.88)_24%,rgba(247,251,239,0.62)_55%,rgba(239,246,227,0.48)_100%)]" />
      </div>

      <div className="relative z-10 min-h-[680px] px-4 py-24 md:px-6 md:py-20 lg:px-36 lg:py-24 lg:pb-42">
        <div className="mx-auto mb-36 w-full max-w-[1920px]">
          <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-start lg:gap-16">
            <div className="max-w-[620px]">
              <GradientTag
                text={SECTION_COPY.tag}
                backgroundColor="white"
                textColor="#2E7D32"
                padding="px-8 py-1.5"
              />

              <GradientTitle
                part1={SECTION_COPY.title.part1}
                part2={SECTION_COPY.title.part2}
                lineBreak
                size="custom"
                customSize="clamp(2.25rem, 5vw, 3.75rem)"
                className="mt-5 font-bold"
                style={{ lineHeight: '130%' }}
                align="left"
                gradientFrom="#20C997"
                gradientTo="#9BDE10"
              />
            </div>

            <div className="max-w-[520px] lg:justify-self-end lg:pt-14">
              <p className="text-[15px] font-normal leading-[1.7] text-[#111111] md:text-[16px] lg:text-lg">
                {SECTION_COPY.description}
              </p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:mt-12 md:gap-7 lg:mt-16 lg:grid-cols-2 lg:gap-8">
            {trainingProgramCards.map((card) => (
              <TrainingProgramCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
