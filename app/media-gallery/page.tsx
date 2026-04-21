import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Camera, Film } from 'lucide-react';
import PageHero from '../components/shared/PageHero';
import GradientTag from '../components/ui/GradientTag';
import GradientTitle from '../components/ui/GradientTitle';
import { addLocaleToUrl } from '../lib/locale';
import { photoGalleryAlbums } from './photo-gallery/photoGalleryData';
import { videoGalleryAlbums } from './video-gallery/videoGalleryData';

interface MediaGalleryPageProps {
  searchParams: Promise<{ locale?: string }>;
}

const galleryCards = [
  {
    id: 'photo-gallery',
    title: 'Photo Gallery',
    description:
      'Browse photo albums from research activities, field visits, outreach programmes, and institutional events.',
    href: '/media-gallery/photo-gallery',
    albumLabel: 'Photo Albums',
    icon: Camera,
    albums: photoGalleryAlbums,
  },
  {
    id: 'video-gallery',
    title: 'Video Gallery',
    description:
      'Watch video albums covering symposium highlights, field extension stories, demonstrations, and stakeholder sessions.',
    href: '/media-gallery/video-gallery',
    albumLabel: 'Video Albums',
    icon: Film,
    albums: videoGalleryAlbums,
  },
];

export default async function MediaGalleryPage({
  searchParams,
}: MediaGalleryPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Media Gallery"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Media Gallery' },
        ]}
        backgroundImage="/images/aboutus_heroimg.jpg"
        backgroundImageAlt="Media gallery background"
        locale={locale}
      />

      <section className="bg-white px-4 pb-72 pt-14 md:px-6 md:pb-72 md:pt-18 lg:px-36 lg:pb-84 lg:pt-22">
        <div className="mx-auto w-full max-w-[1480px]">
          <div className="max-w-[760px]">
            <GradientTag
              text="Gallery Collection"
              className="inline-block"
              gradientFrom="#20C997"
              gradientTo="#A1DF0A"
            />
            <div className="mt-6">
              <GradientTitle
                part1="Explore RRISL moments"
                part2="through photos and videos."
                part1Color="dark-green"
                size="custom"
                className="text-[32px] font-semibold md:text-[46px] lg:text-[58px]"
                style={{ lineHeight: '1.08' }}
              />
            </div>
            <p className="mt-5 max-w-[680px] text-[16px] leading-8 text-[#667085] md:text-[17px]">
              Choose a media type to view organized albums from institute
              programmes, field work, research events, and knowledge sharing
              activities.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {galleryCards.map((card) => {
              const Icon = card.icon;
              const coverAlbum = card.albums[0];
              const coverImage = coverAlbum?.coverImage ?? '/images/aboutus_heroimg.jpg';
              const coverAlt = coverAlbum?.imageAlt ?? `${card.title} cover image`;
              const href = addLocaleToUrl(card.href, locale);

              return (
                <Link
                  key={card.id}
                  href={href}
                  className="group relative block overflow-hidden rounded-[28px] bg-[#0F3F1D] shadow-[0_22px_70px_rgba(15,63,29,0.13)] outline-none transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(15,63,29,0.2)] focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-4"
                  aria-label={`Open ${card.title}`}
                >
                  <div className="relative aspect-[16/12] min-h-[360px] md:aspect-[16/10] lg:min-h-[460px]">
                    <Image
                      src={coverImage}
                      alt={coverAlt}
                      fill
                      className="object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                      sizes="(max-width: 1023px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,32,18,0.08)_0%,rgba(4,32,18,0.2)_36%,rgba(4,32,18,0.92)_100%)]" />

                    <div className="absolute left-5 top-5 flex items-center gap-3 md:left-7 md:top-7">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#0F3F1D] shadow-[0_10px_24px_rgba(4,32,18,0.16)] backdrop-blur transition duration-300 group-hover:bg-[#A1DF0A]">
                        <Icon className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
                      </span>
                      <span className="rounded-full bg-white/88 px-4 py-2 text-sm font-semibold text-[#0F3F1D] backdrop-blur">
                        {card.albums.length} {card.albumLabel}
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
                        <span>View albums</span>
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
        </div>
      </section>
    </div>
  );
}
