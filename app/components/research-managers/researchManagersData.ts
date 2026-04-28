export interface ResearchManagerProfile {
  id: string;
  name: string;
  role: string;
  credentials: string;
  imageSrc: string;
  imageAlt: string;
  emails: string[];
  phone: string;
  profileSummary: string;
  biography: string[];
  profilePoints: string[];
}

export const researchManagers: ResearchManagerProfile[] = [
  {
    id: 'sarojini-fernando',
    name: 'Mrs T H P Sarojini Fernando',
    role: 'Acting Director',
    credentials: 'BSc (SL), MPhil (SL), PhD (SL)',
    imageSrc: '/images/research-managers/Mrs T H P Sarojini Fernando.jpg',
    imageAlt: 'Portrait of Mrs T H P Sarojini Fernando',
    emails: ['dirrri@sltnet.lk', 'director@rrisl.gov.lk', 'deputydirector-biology@rrisl.gov.lk'],
    phone: '+94 71 857 9364',
    profileSummary:
      'Plant pathology specialist and long-serving RRISL research leader with extensive experience in disease management, national advisory work, and research supervision.',
    biography: [
      'Mrs T H P Sarojini Fernando obtained her BSc in Biological Science in 1996 and later completed an MPhil in Plant Pathology at the University of Colombo. She earned her PhD from the same university in 2011, focusing on Corynespora leaf fall disease of rubber.',
      'She serves as Acting Director of the Rubber Research Institute of Sri Lanka and has also held the role of Acting Deputy Director Research (Biology), while leading the Plant Pathology and Microbiology Department. Her work spans advisory programmes, national training, and disease management for economically important issues affecting rubber cultivation.',
      'Her research output includes more than 150 national and international scientific publications. She has received multiple national recognitions, including the General Research Committee Postgraduate Award, the Young Scientists Forum award for excellence in scientific research, and several President\'s Research Awards linked to her contribution to the country and the rubber industry.',
      'She has represented Sri Lanka in international technical groups, secured research funding from national and international bodies, and contributed to university-level supervision of undergraduate, master\'s, and doctoral research. She has also been recognized by FAO as an international consultant on new leaf fall disease of rubber.',
    ],
    profilePoints: [
      'More than 150 scientific publications across national and international forums.',
      'Country representative to international plant protection and rubber research groups.',
      'Extensive experience in disease advisory programmes, training, and postgraduate supervision.',
    ],
  },
  {
    id: 'enoka-munasinghe',
    name: 'Dr Enoka S Munasinghe',
    role: 'Acting Additional Director',
    credentials: 'BSc Agric (SL), PhD (SL), MBA',
    imageSrc: '/images/research-managers/Dr Enoka -Profile Photo.jpg',
    imageAlt: 'Portrait of Dr Enoka S Munasinghe',
    emails: ['adrrisl@sltnet.lk', 'additionaldirector@rrisl.gov.lk', 'enokamunasinghe@yahoo.com'],
    phone: '+94 77 264 2469',
    profileSummary:
      'Research leader in adaptive research and environmental economics, with institute-wide responsibility that connects field realities, stakeholder needs, and applied planning.',
    biography: [
      'Dr Enoka S Munasinghe completed her BSc in Agriculture at the University of Peradeniya and joined the Rubber Research Institute of Sri Lanka as a Research Officer in 2005. She later completed her PhD in Environmental Economics at the University of Sri Jayewardenepura.',
      'In addition to serving as Acting Additional Director, she has worked as a Principal Research Officer in the Adaptive Research Unit. Her work supports practical research pathways for the plantation sector, with attention to both industry-level priorities and smallholder needs.',
      'Her profile reflects a blend of research administration and applied agricultural planning, helping translate research into decisions that are relevant to growers, institutions, and policy-facing programmes.',
    ],
    profilePoints: [
      'Academic background in agriculture, environmental economics, and management.',
      'Leadership experience within RRISL\'s Adaptive Research Unit.',
      'Applied focus on linking research priorities with stakeholder and field-level needs.',
    ],
  },
  {
    id: 'sagari-kudaligama',
    name: 'Dr Sagari Kudaligama',
    role: 'Acting Deputy Director Research (Biology)',
    credentials: 'BSc (SL), MPhil (SL), PhD (SL)',
    imageSrc: '/images/research-managers/Sagari_Kudaligama.jpg',
    imageAlt: 'Portrait of Dr Sagari Kudaligama',
    emails: ['deputydirector-biology@rrisl.gov.lk', 'sagarik@rrisl.gov.lk', 'kudaligama.rrisl@gmail.com'],
    phone: '+94 77 264 0413',
    profileSummary:
      'Research manager with expertise in biochemistry, physiology, and low-intensity harvesting systems, alongside departmental leadership and award-winning applied research.',
    biography: [
      'Dr Sagari Kudaligama serves as Acting Deputy Director Research (Biology) and also leads the Biochemistry and Physiology Department at RRISL. She obtained her BSc from the University of Colombo and later completed both her MPhil and PhD in Sri Lanka.',
      'Her research has focused on latex physiology, low-intensity harvesting systems, raw rubber quality, and production sustainability. This work has been closely aligned with practical challenges faced by the rubber plantation sector.',
      'She has contributed to award-winning research and has been associated with technical outputs ranging from field systems for harvesting to innovations connected with raw material quality and processing support.',
    ],
    profilePoints: [
      'Leads the Biochemistry and Physiology Department at RRISL.',
      'Research focus includes low-intensity harvesting systems and latex physiology.',
      'Associated with nationally recognized agricultural research contributions.',
    ],
  },
  {
    id: 'anusha-attanayake',
    name: 'Dr Anusha P Attanayake',
    role: 'Deputy Director Research (Technology) - Cover-up',
    credentials: 'BSc Hons Sp. (SL), PhD (SL)',
    imageSrc: '/images/research-managers/Dr Anusha_Edit.jpg',
    imageAlt: 'Portrait of Dr Anusha P Attanayake',
    emails: ['ddrt.rrisl@gmail.com', 'anushaattanayake04@gmail.com'],
    phone: '+94 77 293 0553',
    profileSummary:
      'Research manager in rubber technology and chemical analysis, combining laboratory leadership, industry-facing analytical services, and publication-driven technical work.',
    biography: [
      'Dr Anusha P Attanayake serves in the cover-up role for Deputy Director Research (Technology) and has long led the Raw Rubber and Chemical Analysis Department at RRISL. She holds a BSc Special Degree in Chemistry from the University of Ruhuna and completed her PhD at the University of Sri Jayewardenepura.',
      'Her work supports the rubber industry through analytical services, quality control, and technical problem-solving related to raw rubber and processing chemicals. She has represented RRISL in national and international forums and is recognized as a technical expert by the Sri Lanka Accreditation Board.',
      'Her research profile includes studies on natural rubber latex properties, ethephon stimulation, processing chemistry, and material quality, with a strong emphasis on practical relevance for industry standards and innovation.',
    ],
    profilePoints: [
      'Leads work connected to raw rubber quality and chemical analysis.',
      'Recognized as a technical expert by the Sri Lanka Accreditation Board.',
      'Active publication and conference record in rubber processing and latex properties.',
    ],
  },
];
