import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Camera, Film } from 'lucide-react';
import PageHero from '../components/shared/PageHero';
import DepartmentAnimatedSection from '../components/department/DepartmentAnimatedSection';
import GradientTag from '../components/ui/GradientTag';
import GradientTitle from '../components/ui/GradientTitle';
import { normalizeLocale, addLocaleToUrl } from '../lib/locale';
import {
  getGalleryPage,
  getPhotoGalleryAlbums,
  getVideoGalleryAlbums,
  isLocalhostAssetUrl,
} from '../lib/strapi';
import { mapMediaGalleryPageData } from '../lib/media-gallery/pageData';

interface MediaGalleryPageProps {
  searchParams: Promise<{ locale?: string }>;
}

const galleryCardMeta = [
  {
    id: 'photo-gallery',
    icon: Camera,
  },
  {
    id: 'video-gallery',
    icon: Film,
  },
] as const;

export default async function MediaGalleryPage({
  searchParams,
}: MediaGalleryPageProps) {
  const params = await searchParams;
  const locale = normalizeLocale(params.locale);
  const [galleryPage, fallbackGalleryPage, photoAlbums, videoAlbums] = await Promise.all([
    getGalleryPage(locale),
    locale === 'en' ? Promise.resolve(null) : getGalleryPage('en'),
    getPhotoGalleryAlbums(locale),
    getVideoGalleryAlbums(locale),
  ]);
  const pageData = mapMediaGalleryPageData(galleryPage, fallbackGalleryPage);

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title={pageData.hero.title}
        breadcrumbItems={pageData.hero.breadcrumbItems}
        backgroundImage={pageData.hero.backgroundImage}
        backgroundImageAlt={pageData.hero.backgroundImageAlt}
        locale={locale}
      />

      <section className="bg-white px-4 pb-72 pt-14 md:px-6 md:pb-72 md:pt-18 lg:px-36 lg:pb-84 lg:pt-22">
        <DepartmentAnimatedSection
          className="mx-auto w-full max-w-[1480px]"
          y={34}
          duration={0.78}
          stagger={0.1}
        >
          <div className="max-w-[760px]" data-department-reveal>
            <GradientTag
              text={pageData.section.tag}
              className="inline-block"
              gradientFrom="#20C997"
              gradientTo="#A1DF0A"
            />
            <div className="mt-6">
              <GradientTitle
                part1={pageData.section.titlePart1}
                part2={pageData.section.titlePart2}
                part1Color="dark-green"
                size="custom"
                className="text-[32px] font-semibold md:text-[46px] lg:text-[58px]"
                style={{ lineHeight: '1.08' }}
              />
            </div>
            <p className="mt-5 max-w-[680px] text-[16px] leading-8 text-[#667085] md:text-[17px]">
              {pageData.section.description}
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {pageData.cards.map((card) => {
              const meta = galleryCardMeta.find((item) => item.id === card.id)!;
              const Icon = meta.icon;
              const href = addLocaleToUrl(card.href, locale);
              const useUnoptimizedImage = isLocalhostAssetUrl(card.coverImage);
              const albumCount =
                card.id === 'photo-gallery'
                  ? photoAlbums.length
                  : videoAlbums.length;

              return (
                <Link
                  key={card.id}
                  href={href}
                  data-department-reveal
                  className="group relative block overflow-hidden rounded-[28px] bg-[#0F3F1D] shadow-[0_22px_70px_rgba(15,63,29,0.13)] outline-none transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(15,63,29,0.2)] focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-4"
                  aria-label={`Open ${card.title}`}
                >
                  <div className="relative aspect-[16/12] min-h-[360px] md:aspect-[16/10] lg:min-h-[460px]">
                    <Image
                      src={card.coverImage}
                      alt={card.coverAlt}
                      fill
                      className="object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                      sizes="(max-width: 1023px) 100vw, 50vw"
                      unoptimized={useUnoptimizedImage}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,32,18,0.08)_0%,rgba(4,32,18,0.2)_36%,rgba(4,32,18,0.92)_100%)]" />

                    <div className="absolute left-5 top-5 flex items-center gap-3 md:left-7 md:top-7">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#0F3F1D] shadow-[0_10px_24px_rgba(4,32,18,0.16)] backdrop-blur transition duration-300 group-hover:bg-[#A1DF0A]">
                        <Icon className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
                      </span>
                      <span className="rounded-full bg-white/88 px-4 py-2 text-sm font-semibold text-[#0F3F1D] backdrop-blur">
                        {albumCount} {card.albumLabel}
                      </span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 lg:p-8">
                      <h3 className="text-[28px] font-semibold leading-tight text-white md:text-[36px]">
                        {card.title}
                      </h3>
                      <p className="mt-3 max-w-[560px] text-[15px] leading-7 text-white/78 md:text-[16px]">
                        {card.description}
                      </p>

                      <div className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-[#A1DF0A]">
                        <span>{card.viewAlbumLabel}</span>
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#A1DF0A] text-[#0F3F1D] transition duration-300 group-hover:translate-x-1">
                          <ArrowRight className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </DepartmentAnimatedSection>
      </section>
    </div>
  );
}
