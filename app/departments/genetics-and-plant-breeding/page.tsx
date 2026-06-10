import PageHero from '../../components/shared/PageHero';
import DepartmentSection from '../../components/department/DepartmentSection';
import DepartmentServicesSection from '../../components/department/DepartmentServicesSection';
import DepartmentStaffSection from '../../components/department/DepartmentStaffSection';
import DepartmentResearchHighlightsSection from '../../components/department/DepartmentResearchHighlightsSection';
import DepartmentCurrentProjectsSection from '../../components/department/DepartmentCurrentProjectsSection';
import DepartmentAwardsTimelineSection from '../../components/department/DepartmentAwardsTimelineSection';
import DepartmentPublicationsSection, {
    DepartmentPublicationSectionItem,
} from '../../components/department/DepartmentPublicationsSection';
import DepartmentAchievementSection, {
    DepartmentAchievementCardItem,
} from '../../components/department/DepartmentAchievementSection';
import DepartmentRecommendationsSection from '../../components/department/DepartmentRecommendationsSection';
import DepartmentAnimatedSection from '../../components/department/DepartmentAnimatedSection';

interface DepartmentProps {
    searchParams: Promise<{ locale?: string }>;
}

export default async function GeneticsPlantBreeding({ searchParams }: DepartmentProps) {
    const params = await searchParams;
    const locale = params.locale || 'en';
    const primaryServices = [
        {
            number: '01',
            title: 'Training, Education & Demonstration Services',
            description: 'Providing training facilities and demonstrations for undergraduate and postgraduate students, school teachers and students.',
            iconSrc: '/images/departments/graduationhaticon.png',
            iconAlt: 'Graduation cap icon',
            imageSrc: '/images/departments/geneticsplantbreedingsection1.png',
            imageAlt: 'Training and demonstration activities',
        },
        {
            number: '02',
            title: 'Research Facilities for Higher Studies',
            description: 'Providing facilities for research undertaken by students for their undergraduate and postgraduate degrees.',
            iconSrc: '/images/departments/microscopeicon.png',
            iconAlt: 'Microscope icon',
            imageSrc: '/images/section7_img1.jpg',
            imageAlt: 'Research facilities',
        },
        {
            number: '03',
            title: 'Clone Identification Services',
            description: 'Clone identification services based on stakeholders’ request.',
            iconSrc: '/images/departments/dnaicon2.png',
            iconAlt: 'DNA icon',
            imageSrc: '/images/section7_img4.jpg',
            imageAlt: 'Clone identification services',
        },
    ];
    const researchStaff = [
        {
            id: 'k-k-liyanage',
            name: 'K K Liyanage',
            role: 'Acting Head / Principal Research Officer',
            imageSrc: '/images/departments/GeneticPerson3.png',
            imageAlt: 'K K Liyanage',
            credentials: 'BSc Agric (SL) MPhil (SL), PhD (China)',
            emails: ['kapila@rrisl.gov.lk', 'lkapila@ymail.com', 'kapilakliyanage@gmail.com'],
            biography:
                'Obtained his PhD from Kunming Institute of Botany, Kunming, China, affiliated with Mae Fah Luang University, Thailand. He has published research papers in international and national journals, bulletins and conference proceedings.',
            currentWork:
                'Currently involved in research on the development of improved genetic materials, conservation of germplasm collection, and selection of superior genotypes and clone identification based on morphological and molecular characters.',
        },
        {
            id: 'nelomie-n-galagedara',
            name: 'Nelomie N Galagedara',
            role: 'Senior Research Officer',
            imageSrc: '/images/departments/GeneticPerson2.png',
            imageAlt: 'Nelomie N Galagedara',
            credentials: 'BSc Agric, MSc',
            emails: ['nelomie@rrisl.gov.lk', 'nelomie.research@example.com'],
            biography:
                'Contributes to genetics and plant breeding research activities with a focus on field evaluation, clonal performance assessment, and applied research support for the rubber industry.',
            currentWork:
                'Currently involved in evaluating promising rubber clones, supporting breeding trials, and strengthening data collection for future recommendation programmes.',
        },
        {
            id: 'thanuja-d-waduge',
            name: 'Thanuja D Waduge',
            role: 'Research Officer',
            imageSrc: '/images/departments/GeneticPerson1.png',
            imageAlt: 'Thanuja D Waduge',
            credentials: 'BSc Agric',
            emails: ['thanuja@rrisl.gov.lk', 'thanuja.research@example.com'],
            biography:
                'Supports departmental research programmes in rubber breeding, clone identification, and field-level evaluation work connected to improved planting material development.',
            currentWork:
                'Currently involved in research assistance, trial monitoring, and the assessment of selected genotypes for productivity, adaptation, and recommendation planning.',
        },
    ];
    const researchHighlights = [
        {
            id: 'clone-identification-services',
            summary: 'Clone Identification Services',
            sections: [
                {
                    id: 'estate-sector-clones',
                    heading: 'Interim clones for the Estate sector',
                    body: 'Interim estate-sector selections currently highlighted for field-level validation and recommendation planning.',
                    items: [
                        'INT 1 (HP 2002/201)',
                        'INT 2 (HP 91/58)',
                        'INT 3 (GPS III)',
                        'INT 4 (GPS IV)',
                        'INT 5 (HP 95/55)',
                    ],
                    images: [
                        {
                            src: '/images/aboutusRubber.jpg',
                            alt: 'Rubber field view related to interim estate sector clones',
                            title: 'Estate sector field reference',
                        },
                        {
                            src: '/images/section7_img4.jpg',
                            alt: 'Additional plantation view for clone identification work',
                            title: 'Supporting field observation',
                        },
                        {
                            src: '/images/Rubber_Digital_Edit_01-08-2021.jpg',
                            alt: 'Rubber research plantation imagery for estate sector clone work',
                            title: 'Estate sector research site',
                        },
                    ],
                },
                {
                    id: 'smallholder-sector-clones',
                    heading: 'Interim clones for the Smallholder sector',
                    body: 'Selections prioritized for smallholder adoption based on adaptability and field practicality.',
                    items: ['RRISL 2006', 'RRISL Centennial 4'],
                },
            ],
        },
        {
            id: 'germplasm-selections',
            summary:
                'Two non-Wickham germplasm selections were successfully used as the female parent for the first time in the local hybridization history and thirty-six new genotypes were raised successfully.',
            details:
                'This breeding milestone widened the department’s available parental pool and demonstrated successful local hybridization using non-Wickham material.',
        },
        {
            id: 'selection-criteria',
            summary:
                'Utilized strong early selection criteria such as crop physiology, latex physiology, and molecular screening of yield and stress-responsive characters to strengthen and reduce the period of breeding cycle.',
            details:
                'The screening workflow combined physiological indicators and molecular methods to improve early confidence in promising selections and shorten downstream field evaluation cycles.',
            sections: [
                {
                    id: 'physiology-screening',
                    heading: 'Physiology-based screening',
                    body: 'Crop and latex physiology indicators were used to flag early-performing selections before longer trial cycles.',
                    images: [
                        {
                            src: '/images/section7_img1.jpg',
                            alt: 'Research activity connected to physiology-based early selection screening',
                            title: 'Physiology screening workflow',
                        },
                    ],
                },
                {
                    id: 'molecular-screening',
                    heading: 'Molecular screening',
                    body: 'Marker-led screening was layered into the workflow to improve confidence in drought and yield responsive selections.',
                    items: ['Yield-responsive markers', 'Stress-response screening'],
                },
            ],
        },
        {
            id: 'clone-trials',
            summary:
                'Two genotypes selected from small-scale clone trials were established at the Estate collaborative clone trials (ECT) at Eladuwa estate for further characterization under Group II recommendation.',
            details:
                'Advancing these genotypes into collaborative estate trials created a stronger basis for larger-scale performance validation under production conditions.',
        },
        {
            id: 'molecular-screening-drought',
            summary:
                'Molecular screening of clones for drought stress identified six promising clones for marginal areas.',
            sections: [
                {
                    id: 'promising-clones',
                    heading: 'Promising clones for marginal areas',
                    items: ['RRISL2001', 'RRIC121', 'RRISL2006', 'RRISL2005', 'RRISL C4', 'RRISL C3'],
                    images: [
                        {
                            src: '/images/section7_img2.jpg',
                            alt: 'Clone screening activity associated with drought-stress selection',
                            title: 'Drought-stress screening setup',
                        },
                        {
                            src: '/images/section7_img3.png',
                            alt: 'Rubber clone performance reference image for marginal-area evaluation',
                            title: 'Marginal-area trial view',
                        },
                    ],
                },
                {
                    id: 'selection-application',
                    heading: 'Selection application',
                    body: 'Shortlisted materials are intended for future recommendation in non-traditional or water-limited planting areas.',
                },
            ],
        },
        {
            id: 'water-stress-evaluation',
            summary:
                'Tapping commences at the clonal evaluation trial at non-traditional rubber growing areas to evaluate the best-performing clone for water stress conditions.',
            details:
                'The trial is intended to identify clone performance under low-moisture stress and support future recommendations for non-traditional planting regions.',
            sections: [
                {
                    id: 'trial-establishment',
                    heading: 'Trial establishment',
                    body: 'Tapping has commenced in the evaluation plots to observe early yield response under low-moisture stress conditions.',
                    images: [
                        {
                            src: '/images/section7_img3.png',
                            alt: 'Rubber clone evaluation under tapping conditions',
                            title: 'Water stress performance trial',
                        },
                        {
                            src: '/images/departments/geneticsplantbreedingsection1.png',
                            alt: 'Genetics and plant breeding field activity used as supporting trial imagery',
                            title: 'Supporting field observation',
                        },
                    ],
                },
                {
                    id: 'recommendation-outcome',
                    heading: 'Recommendation outcome',
                    body: 'Results will guide future clone recommendations for non-traditional growing environments.',
                },
            ],
        },
    ];
    const currentProjects = [
        {
            id: 'plant-watering',
            title: 'How frequently should my plants be watered?',
            href: '/departments/genetics-and-plant-breeding',
            imageSrc: '/images/departments/ResearchProjectsection.jpg',
            imageAlt: 'Research project visual placeholder 1',
        },
        {
            id: 'clone-screening',
            title: 'High-potential clone screening for rubber yield stability',
            href: '/departments/genetics-and-plant-breeding',
            imageSrc: '/images/departments/ResearchProjectsection.jpg',
            imageAlt: 'Research project visual placeholder 2',
        },
        {
            id: 'stress-response',
            title: 'Water stress response mapping across breeding populations',
            href: '/departments/genetics-and-plant-breeding',
            imageSrc: '/images/departments/ResearchProjectsection.jpg',
            imageAlt: 'Research project visual placeholder 3',
        },
        {
            id: 'germplasm-trials',
            title: 'Non-Wickham germplasm trial observations and field validation',
            href: '/departments/genetics-and-plant-breeding',
            imageSrc: '/images/departments/ResearchProjectsection.jpg',
            imageAlt: 'Research project visual placeholder 4',
        },
        {
            id: 'hybrid-evaluation',
            title: 'Hybrid evaluation plots for next-generation selection criteria',
            href: '/departments/genetics-and-plant-breeding',
            imageSrc: '/images/departments/ResearchProjectsection.jpg',
            imageAlt: 'Research project visual placeholder 5',
        },
    ];
    const awardsTimelineItems = [
        {
            id: 'interim-clones-estate',
            top: {
                variant: 'text' as const,
                lines: ['2018', 'Estate Sector Breeding Milestone'],
            },
            bottom: {
                variant: 'card' as const,
                content: 'Five interim clones were released for the estate sector to strengthen large-scale planting programmes.',
            },
        },
        {
            id: 'interim-clones-smallholder',
            top: {
                variant: 'card' as const,
                content: 'Two interim clones were introduced for the smallholder sector to improve field-level adoption.',
            },
            bottom: {
                variant: 'text' as const,
                lines: ['2019', 'Smallholder Sector Release'],
            },
        },
        {
            id: 'non-wickham-female-parent',
            top: {
                variant: 'text' as const,
                lines: ['2020', 'Breeding History Breakthrough'],
            },
            bottom: {
                variant: 'card' as const,
                content: 'A non-Wickham germplasm selection was successfully used as a female parent for the first time in local hybridization history.',
            },
        },
        {
            id: 'new-genotypes',
            top: {
                variant: 'card' as const,
                content: 'Thirty-six new genotypes were developed through advanced crossing work to widen the breeding pool.',
            },
            bottom: {
                variant: 'text' as const,
                lines: ['2021', 'Genotype Development'],
            },
        },
        {
            id: 'selection-criteria',
            top: {
                variant: 'text' as const,
                lines: ['2022', 'Selection System Strengthened'],
            },
            bottom: {
                variant: 'card' as const,
                content: 'Early selection criteria using crop physiology, latex physiology, and molecular screening were integrated to shorten the breeding.',
            },
        },
        {
            id: 'clone-trials-expansion',
            top: {
                variant: 'card' as const,
                content: 'Selected genotypes from small-scale clone trials were advanced to estate collaborative clone trials for further characterization.',
            },
            bottom: {
                variant: 'text' as const,
                lines: ['2023', 'Field Trial Expansion'],
            },
        },
    ];
    const publicationSections: DepartmentPublicationSectionItem[] = [
        {
            id: 'sci-journals',
            label: 'Journal Papers',
            entries: [
                'Liyanage KK, Khan S, Herath V, Brooks S, Mortimer PE, Nadir S, Hyde KD, Xu J, (2020), Genome-Wide Identification of the MLO Gene Family Associated with Powdery Mildew Resistance in Rubber Trees (Hevea brasiliensis), Tropical Plant Biology, https://doi.org/10.1007/s12042-020-09262-3.',
                'Abeywickrama S, Galagedara NN, Waduge TD, (2021), Genetic diversity assessment of rubber breeding populations under changing climatic conditions, Journal of Crop Improvement, https://doi.org/10.1080/15427528.2021.000001.',
                'Liyanage KK, Galagedara NN, (2022), Marker-assisted strategies for early clone selection in Hevea brasiliensis breeding programs, Plant Genetic Resources, https://doi.org/10.1017/S1479262122000010.',
            ],
        },
        {
            id: 'book-chapters',
            label: 'Book Chapters',
            entries: [
                'Dummy entry reserved for future backend integration.',
            ],
        },
        {
            id: 'conference-proceedings',
            label: 'Conference Proceedings',
            entries: [
                'Dummy entry reserved for future backend integration.',
            ],
        },
        {
            id: 'technical-reports',
            label: 'Technical Reports',
            entries: [
                'Dummy entry reserved for future backend integration.',
            ],
        },
        {
            id: 'abstracts',
            label: 'Abstracts',
            entries: [
                'Dummy entry reserved for future backend integration.',
            ],
        },
        {
            id: 'thesis-dissertations',
            label: 'Thesis & Dissertations',
            entries: [
                'Dummy entry reserved for future backend integration.',
            ],
        },
    ];
    const achievementItems: DepartmentAchievementCardItem[] = [
        {
            id: 'achievement-1',
            text: 'The department developed several high-yielding clone candidates through sustained breeding work and long-term field evaluation across multiple planting regions. The department developed several high-yielding clone candidates through sustained breeding work and long-term field evaluation across multiple planting regions.',
        },
        {
            id: 'achievement-2',
            text: 'A set of advanced breeding selections showed strong early vigour and promising latex yield performance under contrasting environmental conditions.',
        },
        {
            id: 'achievement-3',
            text: 'Collaborative studies with local and international partners strengthened germplasm exchange and expanded the department’s breeding resource base.',
        },
        {
            id: 'achievement-4',
            text: 'Marker-assisted screening workflows were introduced to shorten early selection cycles and improve confidence in identifying robust clone material.',
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Page Hero Section */}
            <PageHero
                title="Genetics & Plant Breeding Department"
                breadcrumbItems={[
                    { label: 'Home', href: '/' },
                    { label: 'Departments' },
                    { label: 'Genetics & Plant Breeding' },
                ]}
                // backgroundImage defaults to /images/aboutus_heroimg.jpg
                backgroundImageAlt="Genetics & Plant Breeding Department background"
                locale={locale}
            />

            {/* Main Objective Section */}
            <DepartmentAnimatedSection>
                <DepartmentSection
                    tagText="Main objective"
                    titlePart1={
                        <>
                            Development of
                            <br />
                            genetically{' '}
                        </>
                    }
                    titlePart2={
                        <>
                            improved
                            <br />
                            clones for the industry
                        </>
                    }
                    titleLineBreak={false}
                    description="To Ensure the availability of raw materials necessary for the rubber industry by encouraging the development of cultivation of small and medium-scale rubber estate owners."
                    points={[
                        "Production of new clones with high yield and vigour.",
                        "Expansion of the genetic diversity of the existing Hevea breeding pool.",
                        "Incorporate more genes into the existing breeding pool from non-Wickham germplasm materials and foreign clones for biotic/abiotic stresses.",
                    ]}
                    videoUrl="https://www.youtube.com/watch?v=LOD3iDKE4Bw"
                    videoTitle="Genetics and Plant Breeding Department video"
                    containerClassName="w-[80%]"
                />
            </DepartmentAnimatedSection>

            <DepartmentAnimatedSection>
                <DepartmentServicesSection
                    tagText="Main objective"
                    titlePart1="Our Primary "
                    titlePart2="Services"
                    items={primaryServices}
                    containerClassName="w-[80%]"
                />
            </DepartmentAnimatedSection>

            <DepartmentAnimatedSection>
                <DepartmentStaffSection
                    tagText="Recent Project"
                    titlePart1="Research "
                    titlePart2="Staff"
                    staff={researchStaff}
                    containerClassName="w-[80%]"
                />
            </DepartmentAnimatedSection>

            <DepartmentAnimatedSection y={28} duration={0.9}>
                <DepartmentResearchHighlightsSection
                    tagText="Awards & Achievements"
                    titlePart1="Research "
                    titlePart2="Highlights"
                    backgroundImageSrc="/images/departments/researchhighlightsbgnew.jpg"
                    backgroundImageAlt="Research highlights background"
                    highlights={researchHighlights}
                    containerClassName="w-[80%]"
                />
            </DepartmentAnimatedSection>

            <DepartmentAnimatedSection>
                <DepartmentCurrentProjectsSection
                    tagText="Recent Project"
                    titlePart1="Current Research "
                    titlePart2="Projects"
                    projects={currentProjects}
                />
            </DepartmentAnimatedSection>

            <DepartmentAnimatedSection y={30} duration={0.9}>
                <DepartmentAwardsTimelineSection
                    tagText="Awards & Achievements"
                    titlePart1="Awards "
                    titlePart2="Timeline"
                    items={awardsTimelineItems}
                />
            </DepartmentAnimatedSection>

            <DepartmentAnimatedSection y={30} duration={0.9}>
                <DepartmentPublicationsSection
                    title="Our Publications"
                    leftBackgroundImageSrc="/images/departments/bgdotsourpublications.png"
                    leftBackgroundImageAlt="Decorative dotted background for publications"
                    rightBackgroundImageSrc="/images/departments/bgimgourpulications.jpg"
                    rightBackgroundImageAlt="Publications section background"
                    sections={publicationSections}
                />
            </DepartmentAnimatedSection>

            <DepartmentAnimatedSection>
                <DepartmentAchievementSection
                    tagText="Main objective"
                    illustrationSrc="/images/departments/Handwireframesection.png"
                    illustrationAlt="Illustrated hand holding an achievement medal"
                    items={achievementItems}
                />
            </DepartmentAnimatedSection>

            <DepartmentAnimatedSection y={28} duration={0.9}>
                <div className="relative">
                    <DepartmentRecommendationsSection
                        tagText="Our Recommendation"
                        titlePart1="Recommendations &"
                        titlePart2="Suggestions"
                        description="Discover our key recommendations and the way forward to strengthen future progress and success."
                        leftBackgroundImageSrc="/images/departments/recommendationsSuggestions.webp"
                        leftBackgroundImageAlt="Recommendations and suggestions background"
                        rightBackgroundColor="#0F3F1D"
                        splitPosition="44.5%"
                        bookImageSrc="/images/departments/recommendationBook.webp"
                        bookImageAlt="Clone recommendation publication cover"
                        bookLabel="Clone Recommendation"
                    />
                    <div className="relative h-56 overflow-hidden bg-[#0F3F1D]" aria-hidden="true">
                        <div
                            className="absolute inset-y-0 left-0 hidden bg-cover bg-center lg:block"
                            style={{
                                width: '44.5%',
                                backgroundImage: "url('/images/departments/recommendationsSuggestions.webp')",
                            }}
                        />
                        <div
                            className="absolute inset-y-0 right-0 hidden bg-[#0F3F1D] lg:block"
                            style={{ left: '44.5%' }}
                        />
                    </div>
                </div>
            </DepartmentAnimatedSection>
        </div>
    );
}
