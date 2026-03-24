import PageHero from '../components/shared/PageHero';
import InteractiveOrgChart from './InteractiveOrgChart';

interface OrganizationalStructureProps {
    searchParams: Promise<{ locale?: string }>;
}

export default async function OrganizationalStructure({
    searchParams,
}: OrganizationalStructureProps) {
    const params = await searchParams;
    const locale = params.locale || 'en';

    return (
        <div className="min-h-screen bg-[#F6F8F3]">
            {/* Page Hero Section */}
            <PageHero
                title="Organizational Structure"
                breadcrumbItems={[
                    { label: 'Home', href: '/' },
                    { label: 'Organizational Structure' },
                ]}
                backgroundImageAlt="Organizational Structure background"
                locale={locale}
            />

            {/* Organizational Chart Section */}
            <section className="bg-white pb-56 pt-8 md:pb-28 lg:pb-64">
                <div className="mx-auto w-full max-w-[1920px] px-4 md:px-6">
                    <div className="mx-auto max-w-[1746px]">
                        <InteractiveOrgChart />
                    </div>
                </div>
            </section>
        </div>
    );
}
