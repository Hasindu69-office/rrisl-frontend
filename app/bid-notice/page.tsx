import PageHero from '../components/shared/PageHero';
import BidNoticeGrid from '../components/bid-notice/BidNoticeGrid';
import { getBidNoticePage, getTenders } from '../lib/strapi';
import { mapBidNoticeHero } from '../lib/bid-notice/hero';
import { mapBidNoticeList } from '../lib/bid-notice/notices';

interface BidNoticeProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function BidNotice({ searchParams }: BidNoticeProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';
  const [bidNoticePage, fallbackPage, tenders] = await Promise.all([
    getBidNoticePage(locale),
    locale === 'en' ? Promise.resolve(null) : getBidNoticePage('en'),
    getTenders(locale),
  ]);
  const hero = mapBidNoticeHero(bidNoticePage, fallbackPage);
  const logo = bidNoticePage?.rrisllogo || fallbackPage?.rrisllogo || null;
  const {
    notices,
    logoSrc,
    logoAlt,
    closingDateLabel,
    readMoreLabel,
    emptyStateTitle,
    emptyStateDescription,
  } = mapBidNoticeList(
    tenders,
    logo,
    bidNoticePage,
    fallbackPage
  );

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title={hero.title}
        breadcrumbItems={hero.breadcrumbItems}
        backgroundImage={hero.backgroundImage}
        backgroundImageAlt={hero.backgroundImageAlt}
        locale={locale}
      />

      <section className="bg-white px-4 py-16 md:px-6 md:py-20 lg:px-36 lg:py-24 mb-36">
        <div className="mx-auto w-full max-w-[1440px]">
          <BidNoticeGrid
            initialNotices={notices}
            logoSrc={logoSrc}
            logoAlt={logoAlt}
            closingDateLabel={closingDateLabel}
            readMoreLabel={readMoreLabel}
            emptyStateTitle={emptyStateTitle}
            emptyStateDescription={emptyStateDescription}
          />
        </div>
      </section>
    </div>
  );
}
