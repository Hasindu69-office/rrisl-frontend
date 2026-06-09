export type AdvisoryTrainingCategoryId = string;

export interface AdvisoryTrainingCard {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export interface AdvisoryTrainingCategory {
  id: AdvisoryTrainingCategoryId;
  label: string;
  cards: AdvisoryTrainingCard[];
}

export const ADVISORY_TRAINING_CATEGORIES: AdvisoryTrainingCategory[] = [
  {
    id: 'centralized',
    label: 'Centralized farmer Training programs',
    cards: [
      {
        id: 'centralized-plantation',
        title: 'Rubber Plantation Training',
        description:
          'Advance training on rubber cultivation and plantation management for medium scale rubber growers.',
        imageSrc: '/images/farmerright.png',
        imageAlt: 'Trainer working with rubber nursery plants',
      },
      {
        id: 'centralized-processing',
        title: 'Rubber Processing Training',
        description:
          'Advance training on rubber cultivation and processing for rubber growers in non traditional areas.',
        imageSrc:
          '/images/services/advisoryservices/advisoryservicessection1img.webp',
        imageAlt: 'Advisor in a rubber plantation for training support',
      },
      {
        id: 'centralized-bud-grafting',
        title: 'Bud Grafting Training',
        description:
          'Nursery management and bud grafting training for selected nursery owners and bud grafters.',
        imageSrc: '/images/farmerleft.png',
        imageAlt: 'Rubber nursery plants prepared for training',
      },
    ],
  },
  {
    id: 'decentralized',
    label: 'Decentralized Training Programs',
    cards: [
      {
        id: 'decentralized-field-clinic',
        title: 'Field Advisory Clinics',
        description:
          'On-site guidance sessions for smallholders to improve adoption of recommended rubber cultivation practices.',
        imageSrc:
          '/images/services/advisoryservices/advisoryservicessection1img.webp',
        imageAlt: 'Advisor standing in a plantation during a field clinic',
      },
      {
        id: 'decentralized-plantation-guidance',
        title: 'On-site Plantation Guidance',
        description:
          'Hands-on plantation management support for growers who need practical recommendations in their own fields.',
        imageSrc: '/images/farmerright.png',
        imageAlt: 'Hands-on training activity among rubber plants',
      },
      {
        id: 'decentralized-processing-demo',
        title: 'Processing Demonstrations',
        description:
          'Community-level demonstrations focused on better rubber processing practices and post-harvest improvement.',
        imageSrc: '/images/farmerleft.png',
        imageAlt: 'Rubber nursery stock used during demonstration activities',
      },
    ],
  },
  {
    id: 'specialized',
    label: 'Specialized Training Programs',
    cards: [
      {
        id: 'specialized-tapping-skills',
        title: 'Advanced Tapping Skills',
        description:
          'Focused practical sessions for experienced tappers to improve latex harvesting quality, consistency, and field efficiency.',
        imageSrc:
          '/images/services/advisoryservices/advisoryservicessection1img.webp',
        imageAlt: 'Specialized field-based rubber tapping training session',
      },
      {
        id: 'specialized-quality-control',
        title: 'Rubber Quality Control Workshops',
        description:
          'Hands-on workshops that help growers and processors identify quality issues early and apply better grading and handling practices.',
        imageSrc: '/images/farmerright.png',
        imageAlt: 'Instructor guiding participants through quality control methods',
      },
      {
        id: 'specialized-small-group',
        title: 'Small Group Technical Clinics',
        description:
          'Targeted advisory clinics for selected grower groups needing deeper support on cultivation, processing, and productivity challenges.',
        imageSrc: '/images/farmerleft.png',
        imageAlt: 'Participants attending a small group technical advisory clinic',
      },
    ],
  },
];
