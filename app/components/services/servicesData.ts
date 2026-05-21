import { BookOpen, FlaskConical, Sprout } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface ServiceHighlight {
  title: string;
  description: string;
  Icon: LucideIcon;
}

export interface TestingService {
  number: number;
  name: string;
}

export interface TestingServiceGroup {
  title: string;
  items: TestingService[];
}

export const serviceHighlights: ServiceHighlight[] = [
  {
    title: 'Advisory services',
    description: 'Guidance on rubber agronomy and technology for growers, industry partners, and other stakeholders.',
    Icon: Sprout,
  },
  {
    title: 'Academic support',
    description: 'Supervision and training support for universities, higher education institutions, and development programs.',
    Icon: BookOpen,
  },
  {
    title: 'Analytical testing',
    description: 'Laboratory and analytical services with nominal fees charged to cover basic operating costs.',
    Icon: FlaskConical,
  },
];

export const testingServiceGroups: TestingServiceGroup[] = [
  {
    title: 'Latex & Raw Rubber Tests',
    items: [
      { number: 1, name: 'Dry Rubber Content (DRC)' },
      { number: 2, name: 'Total Solid Content (TSC)' },
      { number: 3, name: 'Volatile Fatty Acid No' },
      { number: 4, name: 'Mechanical Stability Time' },
      { number: 5, name: 'Alkalinity (on latex phase)' },
      { number: 6, name: 'KOH Number' },
      { number: 7, name: 'Viscosity (Brookfield)' },
      { number: 8, name: 'Mg Content' },
      { number: 9, name: 'pH' },
      { number: 10, name: 'Coagulum Content' },
      { number: 11, name: 'Chemical Stability Time' },
      { number: 12, name: 'Phosphate Content (*)' },
      { number: 13, name: 'Dirt Content' },
      { number: 14, name: 'Ash Content' },
      { number: 15, name: 'Volatile Matter Content' },
      { number: 16, name: 'Nitrogen Content' },
      { number: 17, name: 'Plasticity Number' },
      { number: 18, name: 'Plasticity Retention Index' },
      { number: 19, name: 'Mooney Viscosity' },
      { number: 20, name: 'Colour' },
      { number: 21, name: 'Gel Content' },
      { number: 22, name: 'Acetone Extraction' },
      { number: 23, name: 'Accelerated Storage Hardening Test (Delta P)' },
      { number: 24, name: 'Strength of Sodium Sulphite' },
      { number: 25, name: 'Strength of Sodium bi-sulphite (S-meta bi-sulphite)' },
      { number: 26, name: 'Strength of Oxalic Acid' },
      { number: 27, name: 'Strength of Formic Acid' },
      { number: 28, name: 'Thickness (polythene)' },
      { number: 29, name: 'Strength of Ammonia' },
      { number: 30, name: 'Strength of Sulphuric' },
      { number: 31, name: 'Ethephon concentration' },
      { number: 32, name: 'Latex diagnosis (10 replicates)' },
    ],
  },
  {
    title: 'Fertilizer, Leaf, Compost & Soil Tests',
    items: [
      { number: 33, name: 'Site Specific Fertilizer Recommendation / Fertilizer, Leaf, Compost (Total digestions)' },
      { number: 34, name: 'N, P, K, Mg' },
      { number: 35, name: 'N' },
      { number: 36, name: 'P' },
      { number: 37, name: 'K' },
      { number: 38, name: 'Mg' },
      { number: 39, name: 'Ca' },
      { number: 40, name: 'Soil N' },
      { number: 41, name: 'Soil P' },
      { number: 42, name: 'Soil K' },
      { number: 43, name: 'Soil Mg' },
      { number: 44, name: 'Soil Ca' },
      { number: 45, name: 'Soil micronutrient or other' },
      { number: 46, name: 'pH' },
      { number: 47, name: 'Organic Carbon' },
      { number: 48, name: 'Moisture content' },
      { number: 49, name: 'Particle size' },
      { number: 50, name: 'CEC' },
      { number: 51, name: 'Soil Texture' },
      { number: 52, name: 'Gravel' },
    ],
  },
  {
    title: 'Instrumental & Physical Rubber Tests',
    items: [
      { number: 53, name: 'FTIR analysis per sample' },
      { number: 54, name: 'TGA analysis per sample' },
      { number: 55, name: 'DSC analysis per sample (if liquid nitrogen is not used)' },
      { number: 56, name: 'DSC analysis per sample (if liquid nitrogen is used)' },
      { number: 57, name: 'DMA analysis per sample (if liquid nitrogen is not used)' },
      { number: 58, name: 'DMA analysis per sample (if liquid nitrogen is used)' },
      { number: 59, name: 'Tensile properties - without preparation of test pieces' },
      { number: 60, name: 'Tensile properties - with preparation of test pieces' },
      { number: 61, name: 'Tensile properties - with ageing (without preparation of test pieces)' },
      { number: 62, name: 'Tensile properties - with preparation of test pieces & ageing' },
      { number: 63, name: 'Tear strength - without preparation of test pieces' },
      { number: 64, name: 'Tear strength - with preparation of test pieces' },
      { number: 65, name: 'Tear strength - with ageing (without preparation of test pieces)' },
      { number: 66, name: 'Tear strength - with preparation of test pieces & ageing' },
      { number: 67, name: 'Hardness - without preparation of test pieces' },
      { number: 68, name: 'Hardness - with preparation of test pieces' },
      { number: 69, name: 'Hardness - with ageing (without preparation of test pieces)' },
      { number: 70, name: 'Hardness - with preparation of test pieces & ageing' },
      { number: 71, name: 'Hardness - with preparation of test pieces & ageing in water / ASTM oil' },
      { number: 72, name: 'Abrasion volume loss - without preparation of test pieces' },
      { number: 73, name: 'Abrasion volume loss - with preparation of test pieces' },
      { number: 74, name: 'Compression set - without preparation of test pieces' },
      { number: 75, name: 'Compression set - with preparation of test pieces' },
      { number: 76, name: 'Compression set - with ageing (without preparation of test pieces)' },
      { number: 77, name: 'Compression set - with preparation of test pieces & ageing' },
      { number: 78, name: 'Specific gravity' },
      { number: 79, name: 'Resilience - without preparation of test pieces' },
      { number: 80, name: 'Resilience - with preparation of test pieces' },
      { number: 81, name: 'Rubber Process Analyzer Test - Rheograph / Cure characteristics' },
      { number: 82, name: 'Rubber Process Analyzer Test - Strain / Frequency / Temperature sweep' },
      { number: 83, name: 'Peel strength' },
      { number: 84, name: 'Swelling test at ambient temperature' },
      { number: 85, name: 'Swelling test above ambient temperature / Change in volume with ageing' },
      { number: 86, name: 'Compounding (Two roll mill - without material charges) per 1Kg' },
      { number: 87, name: 'Compounding (Two roll mill - with material charges) per 1Kg' },
      { number: 88, name: 'Compounding (Internal Mixer - without material charges) per 1Kg' },
      { number: 89, name: 'Compounding (Internal Mixer - with material charges) per 1Kg' },
    ],
  },
  {
    title: 'Microbiology, Quarantine & Land Evaluation',
    items: [
      { number: 90, name: 'Identification of a diseased sample - up to genus level of the causative agent' },
      { number: 91, name: 'Soil microbiological Test' },
      { number: 92, name: 'Product microbiological Test' },
      { number: 93, name: 'Quarantine test' },
      { number: 94, name: 'Microbiological testing for Compost' },
      { number: 95, name: 'Bioefficacy test (pesticide / biopesticide)' },
      { number: 96, name: 'Purchasing microbiological cultures' },
      { number: 97, name: 'Providing report for rubber land evaluation' },
    ],
  },
];
