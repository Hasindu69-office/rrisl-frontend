import type { BidNoticePage, StrapiImage, Tender } from '@/app/lib/types';
import { getStrapiMediaUrl, getStrapiImageUrl } from '@/app/lib/strapi';

export interface BidNoticeItemViewModel {
  id: string;
  title: string;
  refNo: string;
  closingDate: string;
  readMoreHref: string;
}

export interface BidNoticeListViewModel {
  notices: BidNoticeItemViewModel[];
  logoSrc: string;
  logoAlt: string;
  closingDateLabel: string;
  readMoreLabel: string;
}

const BID_NOTICE_LIST_FALLBACK: BidNoticeListViewModel = {
  notices: [],
  logoSrc: '/images/rrisl_logo.png',
  logoAlt: 'RRISL Logo',
  closingDateLabel: 'Closing Date',
  readMoreLabel: 'Read More',
};

function normalizeTender(tender: Tender | { attributes?: Tender } | null | undefined): Tender | null {
  if (!tender) {
    return null;
  }

  if ('attributes' in tender && tender.attributes) {
    return {
      ...tender.attributes,
      id: tender.attributes.id || (tender as Tender).id,
      documentId: tender.attributes.documentId || (tender as Tender).documentId,
    };
  }

  return tender as Tender;
}

function formatClosingDate(date: string | null | undefined): string {
  if (!date) {
    return 'Closing date to be announced';
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsedDate);
}

function mapTenderToNotice(tender: Tender | null): BidNoticeItemViewModel | null {
  if (!tender || tender.State !== 'Open') {
    return null;
  }

  const title = tender.Title?.trim() || 'Untitled Tender';
  const refNo = tender.TenderNumber?.trim() || 'Reference unavailable';
  const readMoreHref = getStrapiMediaUrl(tender.Document) || '';

  return {
    id: String(tender.id || tender.documentId || title),
    title,
    refNo,
    closingDate: formatClosingDate(tender.ClosingDate),
    readMoreHref,
  };
}

export function mapBidNoticeList(
  tenders: Tender[] | null | undefined,
  logo?: StrapiImage | null,
  localizedPage?: BidNoticePage | null,
  fallbackPage?: BidNoticePage | null
): BidNoticeListViewModel {
  const notices = (tenders || [])
    .map((item) => normalizeTender(item))
    .map((tender) => mapTenderToNotice(tender))
    .filter((notice): notice is BidNoticeItemViewModel => notice !== null);

  return {
    notices,
    logoSrc: getStrapiImageUrl(logo) || BID_NOTICE_LIST_FALLBACK.logoSrc,
    logoAlt: logo?.alternativeText || BID_NOTICE_LIST_FALLBACK.logoAlt,
    closingDateLabel:
      localizedPage?.LabelClosingDate ||
      fallbackPage?.LabelClosingDate ||
      BID_NOTICE_LIST_FALLBACK.closingDateLabel,
    readMoreLabel:
      localizedPage?.LabelReadMore ||
      fallbackPage?.LabelReadMore ||
      BID_NOTICE_LIST_FALLBACK.readMoreLabel,
  };
}
