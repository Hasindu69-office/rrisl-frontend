export interface VacancyJob {
  id: string;
  title: string;
  organization: string;
  category: string;
  employmentType: string;
  salaryRange: string;
  location: string;
  overviewLocation: string;
  experience: string;
  degree: string;
  description: string[];
  responsibilities: string[];
  skills: string[];
}

const baseDescription = [
  'The Rubber Research Institute of Sri Lanka is seeking a capable professional to contribute to applied research, field coordination, and evidence-based decision making across the division. The selected candidate will work closely with technical teams to plan activities, document findings, and support timely delivery of institutional priorities.',
  'This role suits a detail-oriented applicant who can balance technical rigor with practical implementation. You will collaborate with cross-functional teams, prepare reports, and help translate research outcomes into operational improvements for the wider sector.',
];

const baseResponsibilities = [
  'Coordinate departmental research and operational activities with internal teams and external stakeholders.',
  'Prepare technical notes, progress updates, and documentation aligned with institutional standards.',
  'Support field visits, data collection, and interpretation of results for ongoing projects.',
  'Contribute to planning sessions, review meetings, and implementation follow-ups across assigned workstreams.',
  'Maintain accurate records and ensure timely communication of project milestones and issues.',
];

const baseSkills = [
  'Strong written and verbal communication with the ability to prepare clear technical documentation.',
  'Ability to work with multidisciplinary teams and manage multiple tasks with minimal supervision.',
  'Practical understanding of research, field operations, or administrative coordination in a technical environment.',
  'Comfort with reporting tools, spreadsheets, and structured record-keeping practices.',
];

export const vacancyJobs: VacancyJob[] = [
  {
    id: 'research-officer-1',
    title: 'Research Officer',
    organization: 'Bauch, Schuppe and Schulist Co',
    category: 'Genetics & Plant Breeding Department',
    employmentType: 'Full time',
    salaryRange: 'LKR 40,000-LKR 42,000',
    location: 'Sri Lanka',
    overviewLocation: 'Agalawatta, Sri Lanka',
    experience: '5 Years',
    degree: 'Master',
    description: baseDescription,
    responsibilities: baseResponsibilities,
    skills: baseSkills,
  },
  {
    id: 'plant-breeder',
    title: 'Plant Breeder',
    organization: 'RRISL Scientific Services',
    category: 'Genetics & Plant Breeding Department',
    employmentType: 'Full time',
    salaryRange: 'LKR 42,000-LKR 46,000',
    location: 'Agalawatta',
    overviewLocation: 'Agalawatta, Sri Lanka',
    experience: '4 Years',
    degree: 'BSc / MSc',
    description: baseDescription,
    responsibilities: baseResponsibilities,
    skills: baseSkills,
  },
  {
    id: 'pathology-analyst',
    title: 'Pathology Analyst',
    organization: 'Greenleaf Crop Systems',
    category: 'Plant Pathology Department',
    employmentType: 'Contract',
    salaryRange: 'LKR 36,000-LKR 39,000',
    location: 'Colombo',
    overviewLocation: 'Colombo, Sri Lanka',
    experience: '3 Years',
    degree: 'BSc',
    description: baseDescription,
    responsibilities: baseResponsibilities,
    skills: baseSkills,
  },
  {
    id: 'agronomy-officer',
    title: 'Agronomy Officer',
    organization: 'Field Research Unit',
    category: 'Agronomy Department',
    employmentType: 'Full time',
    salaryRange: 'LKR 38,000-LKR 41,000',
    location: 'Kalutara',
    overviewLocation: 'Kalutara, Sri Lanka',
    experience: '2 Years',
    degree: 'BSc',
    description: baseDescription,
    responsibilities: baseResponsibilities,
    skills: baseSkills,
  },
  {
    id: 'soil-scientist',
    title: 'Soil Scientist',
    organization: 'NutriLab Research Partners',
    category: 'Soil & Plant Nutrition Department',
    employmentType: 'Full time',
    salaryRange: 'LKR 43,000-LKR 47,000',
    location: 'Sri Lanka',
    overviewLocation: 'Ratmalana, Sri Lanka',
    experience: '5 Years',
    degree: 'Master',
    description: baseDescription,
    responsibilities: baseResponsibilities,
    skills: baseSkills,
  },
  {
    id: 'biotech-associate',
    title: 'Biotechnology Associate',
    organization: 'RRISL Innovation Cell',
    category: 'Biotechnology Department',
    employmentType: 'Part time',
    salaryRange: 'LKR 25,000-LKR 29,000',
    location: 'Maharagama',
    overviewLocation: 'Maharagama, Sri Lanka',
    experience: '2 Years',
    degree: 'BSc',
    description: baseDescription,
    responsibilities: baseResponsibilities,
    skills: baseSkills,
  },
  {
    id: 'research-officer-2',
    title: 'Research Officer',
    organization: 'Bauch, Schuppe and Schulist Co',
    category: 'Genetics & Plant Breeding Department',
    employmentType: 'Full time',
    salaryRange: 'LKR 40,000-LKR 42,000',
    location: 'Sri Lanka',
    overviewLocation: 'Agalawatta, Sri Lanka',
    experience: '5 Years',
    degree: 'Master',
    description: baseDescription,
    responsibilities: baseResponsibilities,
    skills: baseSkills,
  },
  {
    id: 'crop-protection-specialist',
    title: 'Crop Protection Specialist',
    organization: 'Pathway Agricultural Labs',
    category: 'Plant Pathology Department',
    employmentType: 'Full time',
    salaryRange: 'LKR 41,000-LKR 45,000',
    location: 'Kandy',
    overviewLocation: 'Kandy, Sri Lanka',
    experience: '4 Years',
    degree: 'BSc / MSc',
    description: baseDescription,
    responsibilities: baseResponsibilities,
    skills: baseSkills,
  },
] as const;

export function getVacancyJobById(id: string) {
  return vacancyJobs.find((job) => job.id === id);
}
