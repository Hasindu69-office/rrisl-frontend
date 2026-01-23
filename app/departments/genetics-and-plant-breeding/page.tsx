import PageHero from '../../components/shared/PageHero';
import DepartmentSection from '../../components/department/DepartmentSection';

interface DepartmentProps {
    searchParams: Promise<{ locale?: string }>;
}

export default async function GeneticsPlantBreeding({ searchParams }: DepartmentProps) {
    const params = await searchParams;
    const locale = params.locale || 'en';

    return (
        <div className="min-h-screen">
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
            />
        </div>
    );
}
