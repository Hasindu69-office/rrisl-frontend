export interface FaqItemData {
  id: string;
  number: string;
  question: string;
  answer: string;
}

export const faqItems: FaqItemData[] = [
  {
    id: 'agriculture-01',
    number: '01.',
    question: 'What Is Agriculture?',
    answer:
      "Lorem Ipsum is simply dummy. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown.",
  },
  {
    id: 'agriculture-02',
    number: '02.',
    question: 'What Is Agriculture?',
    answer:
      'Agriculture includes cultivating land, producing crops, and managing livestock to supply food, materials, and other useful products.',
  },
  {
    id: 'agriculture-03',
    number: '03.',
    question: 'What Is Agriculture?',
    answer:
      'Modern agriculture combines traditional farming knowledge with science, technology, and environmental management practices.',
  },
  {
    id: 'agriculture-04',
    number: '04.',
    question: 'What Is Agriculture?',
    answer:
      'It supports economies, rural livelihoods, food systems, and industrial supply chains through coordinated production activities.',
  },
  {
    id: 'agriculture-05',
    number: '05.',
    question: 'What Is Agriculture?',
    answer:
      'Sustainable agriculture focuses on productivity while protecting soil health, water resources, biodiversity, and long-term resilience.',
  },
];
