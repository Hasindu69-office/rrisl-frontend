'use client';

import DepartmentCurrentProjectsSection, {
  DepartmentCurrentProjectItem,
} from '@/app/components/department/DepartmentCurrentProjectsSection';

const homeCurrentProjects: DepartmentCurrentProjectItem[] = [
  {
    id: 'genetics-clone-screening',
    departmentName: 'Genetics & Plant Breeding',
    title: 'High-potential clone screening for rubber yield stability',
    href: '/departments/genetics-and-plant-breeding',
    imageSrc: '/images/departments/ResearchProjectsection.jpg',
    imageAlt: 'Clone screening project from the Genetics and Plant Breeding Department',
  },
  {
    id: 'genetics-water-stress',
    departmentName: 'Genetics & Plant Breeding',
    title: 'Water stress response mapping across breeding populations',
    href: '/departments/genetics-and-plant-breeding',
    imageSrc: '/images/section7_img3.png',
    imageAlt: 'Water stress response mapping project from the Genetics and Plant Breeding Department',
  },
  {
    id: 'genetics-germplasm',
    departmentName: 'Genetics & Plant Breeding',
    title: 'Non-Wickham germplasm field validation and trial observations',
    href: '/departments/genetics-and-plant-breeding',
    imageSrc: '/images/departments/geneticsplantbreedingsection1.png',
    imageAlt: 'Field validation project from the Genetics and Plant Breeding Department',
  },
  {
    id: 'genetics-molecular-screening',
    departmentName: 'Genetics & Plant Breeding',
    title: 'Marker-assisted screening for drought and yield-responsive traits',
    href: '/departments/genetics-and-plant-breeding',
    imageSrc: '/images/section7_img1.jpg',
    imageAlt: 'Marker-assisted screening project from the Genetics and Plant Breeding Department',
  },
  {
    id: 'genetics-clonal-evaluation',
    departmentName: 'Genetics & Plant Breeding',
    title: 'Clonal evaluation trials for non-traditional growing regions',
    href: '/departments/genetics-and-plant-breeding',
    imageSrc: '/images/section7_img2.jpg',
    imageAlt: 'Clonal evaluation project from the Genetics and Plant Breeding Department',
  },
];

export default function ResearchSection() {
  return (
    <DepartmentCurrentProjectsSection
      tagText="Current Projects"
      titlePart1="Research Across"
      titlePart2=" Our Departments"
      projects={homeCurrentProjects}
    />
  );
}
