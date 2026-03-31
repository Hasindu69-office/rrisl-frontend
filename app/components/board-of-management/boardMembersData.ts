export interface BoardMember {
  name: string;
  role?: string;
  descriptor?: string;
  organizationLines?: string[];
  imageSrc: string;
  imageAlt: string;
}

const placeholderAvatar = '/images/avatarimages.png';

export const boardMembers: BoardMember[] = [
  {
    name: 'Dr. Priyantha Weerasinghe',
    role: 'Chairman',
    imageSrc: placeholderAvatar,
    imageAlt: 'Portrait of Dr. Priyantha Weerasinghe',
  },
  {
    name: 'Mr. Sunil Poholiyadde',
    descriptor: 'Ex-officio member, Chairman',
    organizationLines: ["Planters' Association of Ceylon"],
    imageSrc: placeholderAvatar,
    imageAlt: 'Portrait of Mr. Sunil Poholiyadde',
  },
  {
    name: 'Mrs. H.N.S.T.K. De Silva',
    descriptor: 'Nominated member, Additional Secretary',
    organizationLines: [
      'Ministry of Plantation and Community',
      'Infrastructure',
    ],
    imageSrc: placeholderAvatar,
    imageAlt: 'Portrait of Mrs. H.N.S.T.K. De Silva',
  },
  {
    name: 'Mrs. P.D.L.P. Senarathna',
    descriptor: 'Nominated member, Director,',
    organizationLines: [
      'National Budget Department, Ministry of',
      'Finance (Representative of the Treasury)',
    ],
    imageSrc: placeholderAvatar,
    imageAlt: 'Portrait of Mrs. P.D.L.P. Senarathna',
  },
  {
    name: 'Mr. Manoj Udugampola',
    descriptor: 'Nominated member, COO',
    organizationLines: [
      'Rubber, Agalawatta PIns PLC,',
      "(Representative of the Planters'",
      'Association of Ceylon)',
    ],
    imageSrc: placeholderAvatar,
    imageAlt: 'Portrait of Mr. Manoj Udugampola',
  },
  {
    name: 'Mr. Prins Gunasekara',
    descriptor: 'Nominated member, CEO',
    organizationLines: [
      'Kegalle/ Nannukula Plantations',
      "PLC, (Representative of the Planters'",
      'Association of Ceylon)',
    ],
    imageSrc: placeholderAvatar,
    imageAlt: 'Portrait of Mr. Prins Gunasekara',
  },
  {
    name: 'Prof. R. Saman Dharmakeerthi',
    descriptor: 'Nominated member, Chairman,',
    organizationLines: [
      'Sri Lanka Council for Agricultural Research',
      'Policy',
    ],
    imageSrc: placeholderAvatar,
    imageAlt: 'Portrait of Prof. R. Saman Dharmakeerthi',
  },
  {
    name: 'Dr. Susantha Siriwardena,',
    descriptor: 'Nominated member,',
    organizationLines: [
      'Representative of the Small Rubber',
      'Holders',
    ],
    imageSrc: placeholderAvatar,
    imageAlt: 'Portrait of Dr. Susantha Siriwardena',
  },
  {
    name: 'Mr. Janaka Alahakoon',
    descriptor: 'Nominated member',
    organizationLines: [
      'Representative of the Small Rubber',
      'Holders',
    ],
    imageSrc: placeholderAvatar,
    imageAlt: 'Portrait of Mr. Janaka Alahakoon',
  },
  {
    name: 'Mr. B.C. Gunasekara',
    descriptor: 'Nominated member',
    organizationLines: [
      'Tempo Division, Neuchatel Estate,',
      'Neboda, Horana, (Representative of',
      "Colombo Rubber Traders' Association)",
    ],
    imageSrc: placeholderAvatar,
    imageAlt: 'Portrait of Mr. B.C. Gunasekara',
  },
  {
    name: 'Mr. Justin Senevirathne',
    descriptor: 'Nominated member, Director',
    organizationLines: [
      'Lalan Rubbers (Pvt) Ltd, (Representative of',
      'the Sri Lanka Association of Manufactures',
      '& Exporters of Rubber Products',
    ],
    imageSrc: placeholderAvatar,
    imageAlt: 'Portrait of Mr. Justin Senevirathne',
  },
  {
    name: 'Dr. C.K. Jayasinghe',
    descriptor: 'Nominated member',
    organizationLines: ['(Representative of the Union)'],
    imageSrc: placeholderAvatar,
    imageAlt: 'Portrait of Dr. C.K. Jayasinghe',
  },
  {
    name: 'Mr. Kamalnath Jinadasa',
    descriptor: 'Nominated member',
    organizationLines: ['(Representative of the Union)'],
    imageSrc: placeholderAvatar,
    imageAlt: 'Portrait of Mr. Kamalnath Jinadasa',
  },
];

export const attendanceMembers: BoardMember[] = [
  {
    name: 'Mrs. U K A Tharinduni',
    descriptor: 'Administrative Office',
    organizationLines: ['(Cover up Duties for Board Secretary)'],
    imageSrc: placeholderAvatar,
    imageAlt: 'Portrait of Mrs. U K A Tharinduni',
  },
];
