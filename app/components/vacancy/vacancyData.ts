export interface VacancyJob {
  id: string;
  title: string;
  organization: string;
  category: string;
  employmentType: string;
  salaryRange: string;
  location: string;
}

export const vacancyJobs: VacancyJob[] = [
  {
    id: 'research-officer-1',
    title: 'Research Officer',
    organization: 'Bauch, Schuppe and Schulist Co',
    category: 'Genetics & Plant Breeding Department',
    employmentType: 'Full time',
    salaryRange: 'LKR 40000-LKR 42000',
    location: 'Sri Lanka',
  },
  {
    id: 'plant-breeder',
    title: 'Plant Breeder',
    organization: 'RRISL Scientific Services',
    category: 'Genetics & Plant Breeding Department',
    employmentType: 'Full time',
    salaryRange: 'LKR 42000-LKR 46000',
    location: 'Agalawatta',
  },
  {
    id: 'pathology-analyst',
    title: 'Pathology Analyst',
    organization: 'Greenleaf Crop Systems',
    category: 'Plant Pathology Department',
    employmentType: 'Contract',
    salaryRange: 'LKR 36000-LKR 39000',
    location: 'Colombo',
  },
  {
    id: 'agronomy-officer',
    title: 'Agronomy Officer',
    organization: 'Field Research Unit',
    category: 'Agronomy Department',
    employmentType: 'Full time',
    salaryRange: 'LKR 38000-LKR 41000',
    location: 'Kalutara',
  },
  {
    id: 'soil-scientist',
    title: 'Soil Scientist',
    organization: 'NutriLab Research Partners',
    category: 'Soil & Plant Nutrition Department',
    employmentType: 'Full time',
    salaryRange: 'LKR 43000-LKR 47000',
    location: 'Sri Lanka',
  },
  {
    id: 'biotech-associate',
    title: 'Biotechnology Associate',
    organization: 'RRISL Innovation Cell',
    category: 'Biotechnology Department',
    employmentType: 'Part time',
    salaryRange: 'LKR 25000-LKR 29000',
    location: 'Maharagama',
  },
  {
    id: 'research-officer-2',
    title: 'Research Officer',
    organization: 'Bauch, Schuppe and Schulist Co',
    category: 'Genetics & Plant Breeding Department',
    employmentType: 'Full time',
    salaryRange: 'LKR 40000-LKR 42000',
    location: 'Sri Lanka',
  },
  {
    id: 'crop-protection-specialist',
    title: 'Crop Protection Specialist',
    organization: 'Pathway Agricultural Labs',
    category: 'Plant Pathology Department',
    employmentType: 'Full time',
    salaryRange: 'LKR 41000-LKR 45000',
    location: 'Kandy',
  },
] as const;
