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
            name: 'K K Liyanage',
            role: 'Acting Head / Principal Research Officer',
            imageSrc: '/images/departments/GeneticPerson1.png',
            imageAlt: 'K K Liyanage',
        },
        {
            name: 'Nelomie N Galagedara',
            role: 'Senior Research Officer',
            imageSrc: '/images/departments/GeneticPerson2.png',
            imageAlt: 'Nelomie N Galagedara',
        },
        {
            name: 'Thanuja D Waduge',
            role: 'Research Officer',
            imageSrc: '/images/departments/GeneticPerson3.png',
            imageAlt: 'Thanuja D Waduge',
        },
    ];
    const researchHighlights = [
        {
            id: 'released-clones',
            text: 'Released five interim clones for the estate sector and two interim clones for the smallholder sector.',
            imageSrc: '/images/aboutusRubber.jpg',
            imageAlt: 'Rubber tapping trees representing released interim clones',
        },
        {
            id: 'germplasm-selections',
            text: 'Two non-Wickham germplasm selections were successfully used as the female parent for the first time in the local hybridization history and thirty-six new genotypes raised.',
            imageSrc: '/images/estateandsubstationsbgimage.webp',
            imageAlt: 'Genetics and plant breeding field research',
        },
        {
            id: 'selection-criteria',
            text: 'Utilized strong early selection criteria such as crop physiology, latex physiology, and molecular screening of yield and stress-responsive characters to strengthen and reduce the period of breeding cycle.',
            imageSrc: '/images/section7_img1.jpg',
            imageAlt: 'Laboratory and research facilities used for early selection criteria',
        },
        {
            id: 'clone-trials',
            text: 'Two genotypes selected from small-scale clone trials were established at the Estate collaborative clone trials (ECT) at Eladuwa estate for further characterization under Group II recommendation.',
            imageSrc: '/images/section7_img2.jpg',
            imageAlt: 'Field trial setup for collaborative clone trials',
        },
        {
            id: 'tapping-evaluation',
            text: 'Tapping commences at the clonal evaluation trial at non-traditional rubber growing areas to evaluate the best-performing clone for water stress conditions.',
            imageSrc: '/images/section7_img3.png',
            imageAlt: 'Rubber clone evaluation under tapping conditions',
        },
        {
            id: 'water-stress-clone',
            text: 'Tapping commences at the clonal evaluation trial at non-traditional rubber growing areas to evaluate the best-performing clone for water stress conditions.',
            imageSrc: '/images/aboutusRubber.jpg',
            imageAlt: 'Rubber plantation image representing water stress clone evaluation',
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

    return (
        <div className="min-h-screen mb-56">
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
            <DepartmentSection
                tagText="Main objective"
                titlePart1="Development of"
                titlePart2={
                    <>
                        genetically improved <br /> clones for the industry
                    </>
                }
                description="To Ensure the availability of raw materials necessary for the rubber industry by encouraging the development of cultivation of small and medium-scale rubber estate owners."
                points={[
                    "Production of new clones with high yield and vigour.",
                    "Expansion of the genetic diversity of the existing Hevea breeding pool.",
                    "Incorporate more genes into the existing breeding pool from non-Wickham germplasm materials and foreign clones for biotic/abiotic stresses.",
                ]}
                imageSrc="/images/departments/geneticsplantbreedingsection1.png"
                imageAlt="Genetics and Plant Breeding Section 1 Collage"
                containerClassName="w-[80%]"
            />

            <DepartmentServicesSection
                tagText="Main objective"
                titlePart1="Our Primary "
                titlePart2="Services"
                items={primaryServices}
                containerClassName="w-[80%]"
            />

            <DepartmentStaffSection
                tagText="Recent Project"
                titlePart1="Research"
                titlePart2="Staff"
                staff={researchStaff}
                containerClassName="w-[80%]"
            />

            <DepartmentResearchHighlightsSection
                tagText="Awards & Achievements"
                titlePart1="Research "
                titlePart2="Highlights"
                backgroundImageSrc="/images/departments/ResearchHightlightBackground.jpg"
                backgroundImageAlt="Research highlights background"
                highlights={researchHighlights}
                containerClassName="w-[80%]"
            />

            
            <DepartmentCurrentProjectsSection
                tagText="Recent Project"
                titlePart1="Current Research "
                titlePart2="Projects"
                projects={currentProjects}
            />

            <DepartmentAwardsTimelineSection
                tagText="Awards & Achievements"
                titlePart1="Awards "
                titlePart2="Timeline"
                items={awardsTimelineItems}
            />

            <DepartmentPublicationsSection
                title="Our Publications"
                leftBackgroundImageSrc="/images/departments/bgdotsourpublications.png"
                leftBackgroundImageAlt="Decorative dotted background for publications"
                rightBackgroundImageSrc="/images/departments/bgimgourpulications.jpg"
                rightBackgroundImageAlt="Publications section background"
                sections={publicationSections}
            />
        </div>
    );
}
