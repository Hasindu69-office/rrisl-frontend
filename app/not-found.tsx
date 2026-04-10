import { cookies, headers } from 'next/headers';
import Header from './components/header/Header';
import NotFoundActions from './components/not-found/NotFoundActions';
import { normalizeLocale } from './lib/locale';

const contentByLocale = {
  en: {
    title: 'Page not found.',
    description:
      'The page you requested may have moved or no longer exist. Use the links below to return to the main site or contact the institute directly.',
    homeLabel: 'Go Home',
    contactLabel: 'Contact Us',
  },
  si: {
    title: '\u0db4\u0dd2\u0da7\u0dd4\u0dc0 \u0dc4\u0db8\u0dd4 \u0db1\u0ddc\u0dc0\u0dd3\u0dba.',
    description:
      '\u0d94\u0db6 \u0d89\u0dbd\u0dca\u0dbd\u0dd4\u0db8\u0dca \u0d9a\u0dbd \u0db4\u0dd2\u0da7\u0dd4\u0dc0 \u0dc0\u0dd9\u0db1\u0dc3\u0dca \u0d9a\u0dbb \u0d87\u0dad\u0dd2 \u0dc4\u0ddd \u0dad\u0dc0\u0daf\u0dd4\u0dbb\u0da7\u0dad\u0dca \u0db1\u0ddc\u0db4\u0dd0\u0dc0\u0dad\u0dd2\u0dba \u0dc4\u0dd0\u0d9a. \u0db4\u0dc4\u0dad \u0dc3\u0db6\u0dd0\u0db3\u0dd2 \u0db7\u0dcf\u0dc0\u0dd2\u0dad\u0dcf \u0d9a\u0dbb \u0db4\u0dca\u200d\u0dbb\u0db0\u0dcf\u0db1 \u0dc0\u0dd9\u0db6\u0dca \u0d85\u0da9\u0dc0\u0dd2\u0dba\u0da7 \u0dc4\u0ddd \u0dc3\u0db8\u0dca\u0db6\u0db1\u0dca\u0db0\u0dad\u0dcf \u0db4\u0dd2\u0da7\u0dd4\u0dc0\u0da7 \u0dba\u0db1\u0dca\u0db1.',
    homeLabel: '\u0db8\u0dd4\u0dbd\u0dca \u0db4\u0dd2\u0da7\u0dd4\u0dc0\u0da7',
    contactLabel: '\u0d85\u0db4 \u0d85\u0db8\u0dad\u0db1\u0dca\u0db1',
  },
  ta: {
    title: '\u0baa\u0b95\u0bcd\u0b95\u0bae\u0bcd \u0b95\u0bbf\u0b9f\u0bc8\u0b95\u0bcd\u0b95\u0bb5\u0bbf\u0bb2\u0bcd\u0bb2\u0bc8.',
    description:
      '\u0ba8\u0bc0\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0b95\u0bc7\u0b9f\u0bcd\u0b9f \u0baa\u0b95\u0bcd\u0b95\u0bae\u0bcd \u0bae\u0bbe\u0bb1\u0bcd\u0bb1\u0baa\u0bcd\u0baa\u0b9f\u0bcd\u0b9f\u0bbf\u0bb0\u0bc1\u0b95\u0bcd\u0b95\u0bb2\u0bbe\u0bae\u0bcd \u0b85\u0bb2\u0bcd\u0bb2\u0ba4\u0bc1 \u0b87\u0ba9\u0bbf \u0b87\u0bb0\u0bc1\u0b95\u0bcd\u0b95\u0bbe\u0bae\u0bb2\u0bcd \u0b87\u0bb0\u0bc1\u0b95\u0bcd\u0b95\u0bbe\u0bae\u0bb2\u0bbe\u0bae\u0bcd. \u0b95\u0bc0\u0bb4\u0bc7 \u0b89\u0bb3\u0bcd\u0bb3 \u0b87\u0ba3\u0bc8\u0baa\u0bcd\u0baa\u0bc1\u0b95\u0bb3\u0bc8 \u0baa\u0baf\u0ba9\u0bcd\u0baa\u0b9f\u0bc1\u0ba4\u0bcd\u0ba4\u0bbf \u0bae\u0bc1\u0ba4\u0bb1\u0bcd\u0baa\u0b95\u0bcd\u0b95\u0ba4\u0bcd\u0ba4\u0bbf\u0bb1\u0bcd\u0b95\u0bcb \u0ba4\u0bca\u0b9f\u0bb0\u0bcd\u0baa\u0bc1 \u0baa\u0b95\u0bcd\u0b95\u0ba4\u0bcd\u0ba4\u0bbf\u0bb1\u0bcd\u0b95\u0bcb \u0b9a\u0bc6\u0bb2\u0bcd\u0bb2\u0bb2\u0bbe\u0bae\u0bcd.',
    homeLabel: '\u0bae\u0bc1\u0b95\u0baa\u0bcd\u0baa\u0bc1\u0b95\u0bcd\u0b95\u0bc1',
    contactLabel: '\u0b8e\u0b99\u0bcd\u0b95\u0bb3\u0bc8 \u0ba4\u0bca\u0b9f\u0bb0\u0bcd\u0baa\u0bc1\u0b95\u0bca\u0bb3\u0bcd\u0bb3',
  },
} as const;

export default async function NotFound() {
  const requestHeaders = await headers();
  const cookieStore = await cookies();
  const locale = normalizeLocale(
    requestHeaders.get('x-rrisl-locale') ?? cookieStore.get('rrisl-locale')?.value
  );
  const content = contentByLocale[locale as keyof typeof contentByLocale] ?? contentByLocale.en;

  return (
    <div className="rrisl-not-found-page min-h-[100dvh] bg-[#0B1F16] text-[#0F3F1D]">
      <section className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[#0B1F16]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(32,201,151,0.18),_transparent_34%),radial-gradient(circle_at_80%_18%,_rgba(161,223,10,0.14),_transparent_22%),linear-gradient(135deg,_rgba(4,32,18,0.96),_rgba(34,58,45,0.92))]" />
        <div className="pointer-events-none absolute inset-0 bg-[url('/images/footer_bg.png')] bg-cover bg-center opacity-15" />
        <div className="pointer-events-none absolute -left-20 top-28 h-56 w-56 rounded-full bg-[#20C997]/12 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-20 h-48 w-48 rounded-full bg-[#A1DF0A]/12 blur-3xl" />

        <div className="relative z-20">
          <Header locale={locale} compactOnMobile />
        </div>

        <div className="relative z-10 mx-auto flex w-full flex-1 items-center px-4 pb-10 pt-4 text-center sm:px-6 sm:pb-14 sm:pt-6 md:px-8 md:pb-[4.5rem] md:pt-8 lg:px-10 lg:pb-24 lg:pt-10">
          <div className="mx-auto max-w-[860px]">
            <p className="text-[3.75rem] font-semibold leading-none tracking-[-0.05em] text-white/12 sm:text-[5rem] md:text-[6.5rem] xl:text-[8rem]">
              404
            </p>

            <h1 className="mx-auto -mt-1 max-w-[14ch] text-[2rem] font-semibold leading-tight text-white sm:-mt-2 sm:max-w-[13ch] sm:text-4xl md:max-w-[12ch] md:text-5xl xl:text-6xl">
              {content.title}
            </h1>

            <p className="mx-auto mt-5 max-w-[34rem] text-[0.95rem] leading-7 text-[#D9E5DD] sm:mt-6 sm:max-w-[36rem] sm:text-base sm:leading-8 md:max-w-[38rem] md:text-[1.05rem] md:leading-8 lg:max-w-[42rem] lg:text-lg">
              {content.description}
            </p>

            <div className="mt-8 flex justify-center sm:mt-10">
              <NotFoundActions
                locale={locale}
                homeLabel={content.homeLabel}
                contactLabel={content.contactLabel}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
