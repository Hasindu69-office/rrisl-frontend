export type DepartmentRecommendationBlock =
  | {
      type: 'bullets';
      id: string;
      title?: string;
      items: string[];
    }
  | {
      type: 'image';
      id: string;
      title: string;
      imageSrc: string;
      imageAlt: string;
      caption?: string;
    }
  | {
      type: 'table';
      id: string;
      title: string;
      columns: string[];
      rows: string[][];
      note?: string;
    };

export interface DepartmentRecommendationsContent {
  eyebrow: string;
  title: string;
  blocks: DepartmentRecommendationBlock[];
}

const DEPARTMENT_RECOMMENDATIONS: Record<string, DepartmentRecommendationsContent> = {
  'genetics-and-plant-breeding': {
    eyebrow: 'Recommendations',
    title: 'Recommendations',
    blocks: [
      {
        type: 'image',
        id: 'revised-clone-recommendations-december-2023',
        title: 'Revised clone recommendations December 2023',
        imageSrc: '/images/departments/recommendationBook.webp',
        imageAlt: 'Clone recommendation publication cover',
        caption: 'Clone recommendation publication for plantation and smallholder sectors.',
      },
      {
        type: 'bullets',
        id: 'new-recommendations',
        title: 'New recommendations',
        items: [
          'The life span of budwood nurseries is ten years and therefore it is recommended to replace 10% of the nursery with new clones every year.',
          'Young buddings used for planting should be less than one year old at planting and bare root budded plants are not recommended as a planting material.',
        ],
      },
      {
        type: 'table',
        id: 'clone-recommendation-groups',
        title: 'Clone recommendation groups',
        columns: ['Sector', 'Group', 'Recommended clones', 'Planting limit'],
        rows: [
          ['Plantation sector', 'Group I', 'RRIC 102, RRIC 130, RRISL 203, PB 260', 'Up to 10% of total extent'],
          ['Plantation sector', 'Group II', 'RRIC 133, RRISL 2001, RRISL 2004, BPM 24', 'Up to 3% of total extent'],
          ['Smallholder sector', 'Group A', 'RRIC 102, PB 86, RRIC 100', 'Up to 10% of extent above 5 ha'],
          ['High elevations', 'Group A', 'RRIC 100, RRIC 130', 'Avoid wind-prone areas'],
        ],
        note:
          'This table is a structured preview of the clone recommendation document and can be replaced or expanded when the final legacy data is supplied.',
      },
    ],
  },
  'plant-science': {
    eyebrow: 'Recommendations',
    title: 'New Recommendations',
    blocks: [
      {
        type: 'bullets',
        id: 'plant-disease-management',
        items: [
          'Revised recommendations for chemical control of White Root Disease.',
          'Recommendations for the rehabilitation of White Root Disease patches.',
          'Recommendations for the management of the new leaf fall disease caused by Colletotrichum and Pestalotiopsis.',
          'Revision of the prophylactic fungicide recommendation against Phytophthora Bark rots.',
          'Recommendation of substitute insecticide for the chemical control of Cockchafer Grub infestations.',
          'Recommendation of chemical controlling systems for Brown Root Disease.',
          'Revision of the chemical controlling for Nursery diseases.',
        ],
      },
      {
        type: 'table',
        id: 'manuring-schedule-for-mature-rubber',
        title: 'Manuring schedule for mature rubber',
        columns: [
          'Region',
          'Fertilizer',
          'While tapped on virgin bark',
          'While tapped on renewed bark',
        ],
        rows: [
          ['Kegalle Kurunegala Kandy', 'Urea', '200', '150'],
          ['Kegalle Kurunegala Kandy', 'ERP', '100', '-'],
          ['Kegalle Kurunegala Kandy', 'MOP', '100', '75'],
          ['All other rubber growing areas', 'Urea', '200', '150'],
          ['All other rubber growing areas', 'ERP', '100', '-'],
          ['All other rubber growing areas', 'MOP', '200', '150'],
        ],
        note:
          'ERP - Eppawala Rock Phosphate. MOP - Muriate of Potash. Plantations under the regional plantation companies are strongly advised to obtain site-specific fertilizer recommendation from the RRISL for their mature fields. In areas where fertilizers are not recommended on the basis of foliar survey, fertilizer quantities in the table could be used.',
      },
    ],
  },
};

export function getDepartmentRecommendations(
  slug: string
): DepartmentRecommendationsContent | null {
  return DEPARTMENT_RECOMMENDATIONS[slug] ?? null;
}
