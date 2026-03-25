export const vacancyCategories = [
  'Genetics & Plant Breeding Department',
  'Plant Pathology Department',
  'Agronomy Department',
  'Soil & Plant Nutrition Department',
  'Biotechnology Department',
] as const;

export type VacancyCategory = (typeof vacancyCategories)[number];
