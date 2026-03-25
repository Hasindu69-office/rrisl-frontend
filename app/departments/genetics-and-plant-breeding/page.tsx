import PageHero from '../../components/shared/PageHero';
import DepartmentSection from '../../components/department/DepartmentSection';
import DepartmentServicesSection from '../../components/department/DepartmentServicesSection';

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
            iconSrc: '/images/departments/dnaicon.png',
            iconAlt: 'DNA icon',
            imageSrc: '/images/section7_img4.jpg',
            imageAlt: 'Clone identification services',
        },
    ];

    return (
        <div className="min-h-screen mb-56">
            {/* Page Hero Section */}
            <PageHero
                title="Genetics & Plant Breeding Department"
                breadcrumbItems={[
                    { label: 'Home', href: '/' },
                    { label: 'Departments', href: '/departments' },
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
        </div>
    );
}
