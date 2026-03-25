import PageHero from '../components/shared/PageHero';
import BidNoticeGrid from '../components/bid-notice/BidNoticeGrid';

interface BidNoticeProps {
  searchParams: Promise<{ locale?: string }>;
}

const mockBidNotices = [
  {
    id: '1',
    title: 'Supply, Installation, Service & Maintenance of Branded and Brand New Desktop Computers',
    refNo: 'RRISL/PRO/R&M Lib/2025 (37B)',
    closingDate: '19-12-2025',
    readMoreHref: '#'
  },
  {
    id: '2',
    title: 'Purchase of Commercial Internet Security Licensed Software',
    refNo: 'RRISL/PRO/CAPITAL/AVIT/2025/52',
    closingDate: '23-12-2025',
    readMoreHref: '#'
  },
  {
    id: '3',
    title: 'Supply, Deployment & Support of Subscription-Based Microsoft Office 365 Cloud Productivity & Email Solution',
    refNo: 'RRISL/PRO/CAPITAL/AVIT/2025/51',
    closingDate: '23-12-2025',
    readMoreHref: '#'
  },
  {
    id: '4',
    title: 'Supply and Installation of Laboratory Equipment for Biochemistry Department',
    refNo: 'RRISL/PRO/LAB/BIO/2025/12',
    closingDate: '15-01-2026',
    readMoreHref: '#'
  },
  {
    id: '5',
    title: 'Provision of Insurance Services for Institute Vehicles and Property',
    refNo: 'RRISL/PRO/ADMIN/INS/2025/08',
    closingDate: '20-12-2025',
    readMoreHref: '#'
  },
  {
    id: '6',
    title: 'Construction of New Greenhouse Facility at Agalawatta Head Office',
    refNo: 'RRISL/PRO/CIVIL/ENG/2025/15',
    closingDate: '10-01-2026',
    readMoreHref: '#'
  },
  {
    id: '7',
    title: 'Supply of High-Yield Clonal Rubber Plantlets for 2026 Planting Season',
    refNo: 'RRISL/PRO/PLANT/GENT/2025/22',
    closingDate: '05-01-2026',
    readMoreHref: '#'
  },
  {
    id: '8',
    title: 'Security Services for Substations and Research Centers',
    refNo: 'RRISL/PRO/ADMIN/SEC/2025/03',
    closingDate: '28-12-2025',
    readMoreHref: '#'
  }
];

export default async function BidNotice({ searchParams }: BidNoticeProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      {/* Page Hero Section */}
      <PageHero
        title="Bid Notice"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Bid Notice' },
        ]}
        backgroundImageAlt="Bid Notice background"
        locale={locale}
      />
      
      {/* Bid Notices Content Section */}
      <section className="bg-white px-4 py-16 md:px-6 md:py-20 lg:px-36 lg:py-24 mb-36">
        <div className="mx-auto w-full max-w-[1440px]">
          <BidNoticeGrid 
            initialNotices={mockBidNotices} 
            locale={locale} 
          />
        </div>
      </section>
    </div>
  );
}
