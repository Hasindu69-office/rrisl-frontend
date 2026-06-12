export interface NewsArticle {
  slug: string;
  title: string;
  summary: string;
  content: string[];
  publishedDate: string;
  author: string;
  category: 'News' | 'Blog' | 'Research';
  featuredImage: string;
  featuredImageAlt: string;
  galleryImages?: Array<{
    src: string;
    alt: string;
  }>;
  isFeatured?: boolean;
}

export const newsArticles: NewsArticle[] = [
  {
    slug: 'new-chemical-cocktail-for-circular-leaf-spot-disease',
    title: 'New Chemical Cocktail for Circular Leaf Spot Disease in Rubber Plantations',
    summary:
      'RRISL researchers continue to refine disease management practices for healthier rubber plantations and more resilient field performance.',
    content: [
      'Circular leaf spot disease remains one of the recurring challenges for rubber growers, especially in periods where humidity and field conditions support rapid disease spread.',
      'The latest research effort focuses on practical field-level protection, combining disease observation, laboratory evaluation, and plantation feedback to identify treatments that can be adopted with confidence.',
      'This work supports the institute mission of improving productivity while protecting long-term plantation health through science-led recommendations.',
    ],
    publishedDate: '2025-08-23',
    author: 'RRISL Research Team',
    category: 'Research',
    featuredImage: '/images/section6_img1.png',
    featuredImageAlt: 'Rubber plantation research environment',
    galleryImages: [
      {
        src: '/images/section6_img2.png',
        alt: 'Researchers reviewing plantation field samples',
      },
      {
        src: '/images/section6_img3.png',
        alt: 'Green field landscape at a rubber research site',
      },
    ],
    isFeatured: true,
  },
  {
    slug: 'latex-harvesting-begins-in-the-north-central-province',
    title: 'Latex Harvesting Begins in the North-Central Province',
    summary:
      'A new harvesting cycle highlights continued extension support for growers expanding rubber cultivation beyond traditional zones.',
    content: [
      'Latex harvesting in the North-Central Province marks an important stage for growers who have adopted rubber cultivation with technical support from the institute.',
      'Field officers are working with communities to monitor tapping practices, tree health, and early yield performance so growers can maintain consistent quality across the season.',
      'The programme also strengthens knowledge sharing between researchers, extension teams, and smallholders who are adapting rubber cultivation to local conditions.',
    ],
    publishedDate: '2025-08-18',
    author: 'Extension Services Unit',
    category: 'News',
    featuredImage: '/images/section6_img2.png',
    featuredImageAlt: 'Team members at a rubber cultivation site',
    galleryImages: [
      {
        src: '/images/section7_img1.jpg',
        alt: 'Rubber estate field visit',
      },
      {
        src: '/images/section7_img2.jpg',
        alt: 'Plantation pathway and rubber trees',
      },
    ],
  },
  {
    slug: 'modern-nursery-practices-for-healthy-planting-materials',
    title: 'Modern Nursery Practices for Healthy Planting Materials',
    summary:
      'Careful nursery management helps growers establish uniform, vigorous plants before field planting begins.',
    content: [
      'High-quality planting material is one of the strongest foundations for a productive rubber estate, and nursery management plays a direct role in that outcome.',
      'Current guidance focuses on healthy root development, careful watering, pest observation, and timely selection so weak plants are removed before field establishment.',
      'These practices reduce early field losses and help growers build stronger plantations from the first stage of cultivation.',
    ],
    publishedDate: '2025-07-30',
    author: 'Plant Science Department',
    category: 'Blog',
    featuredImage: '/images/section6_img3.png',
    featuredImageAlt: 'Green nursery and landscaped research garden',
  },
  {
    slug: 'field-training-strengthens-grower-advisory-services',
    title: 'Field Training Strengthens Grower Advisory Services',
    summary:
      'Hands-on advisory programmes continue to connect institute research with daily decisions made by plantation teams.',
    content: [
      'RRISL field training sessions are designed to make technical recommendations easier to apply in real plantation settings.',
      'Participants review tapping discipline, disease observation, soil and nutrient management, and record keeping with practical demonstrations led by subject specialists.',
      'The result is a stronger advisory network that can respond quickly to grower needs and support productivity across different rubber-growing regions.',
    ],
    publishedDate: '2025-07-12',
    author: 'Advisory Services Team',
    category: 'Blog',
    featuredImage: '/images/section7_img4.jpg',
    featuredImageAlt: 'Field advisory training session',
  },
  {
    slug: 'rubber-research-symposium-shares-current-findings',
    title: 'Rubber Research Symposium Shares Current Findings',
    summary:
      'Researchers, managers, and industry stakeholders gathered to exchange updates from ongoing rubber science programmes.',
    content: [
      'The annual research symposium creates a focused space for sharing findings from plant breeding, crop protection, agronomy, processing, and industry support programmes.',
      'Presentations emphasized practical value for growers and processors, with attention to technologies that can move from research trials into field and factory use.',
      'The event also encouraged collaboration between departments, estates, private sector partners, and policy stakeholders.',
    ],
    publishedDate: '2025-06-26',
    author: 'Communications Unit',
    category: 'News',
    featuredImage: '/images/homeBannerimg2.jpg',
    featuredImageAlt: 'Rubber research and stakeholder event',
  },
];

export const newsCategories = ['All', ...Array.from(new Set(newsArticles.map((article) => article.category)))] as const;

export function formatArticleDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function getFeaturedArticle(): NewsArticle {
  return newsArticles.find((article) => article.isFeatured) || newsArticles[0];
}

export function getArticleBySlug(slug: string): NewsArticle | null {
  return newsArticles.find((article) => article.slug === slug) || null;
}

export function getRelatedArticles(article: NewsArticle, limit = 3): NewsArticle[] {
  const categoryMatches = newsArticles.filter(
    (item) => item.slug !== article.slug && item.category === article.category
  );
  const remaining = newsArticles.filter(
    (item) => item.slug !== article.slug && item.category !== article.category
  );

  return [...categoryMatches, ...remaining].slice(0, limit);
}
