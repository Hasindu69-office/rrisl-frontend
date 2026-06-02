import EstatesResearchSlider from '../components/estates/EstatesResearchSlider';
import GradientTag from '../components/ui/GradientTag';
import GradientTitle from '../components/ui/GradientTitle';
import PageHero from '../components/shared/PageHero';
import { getEstateAndSubstationsPage, getEstateSubstations } from '../lib/strapi';
import { mapEstateLandingPageData } from '../lib/estates/pageData';

interface EstatesAndSubstationsPageProps {
  searchParams: Promise<{ locale?: string }>;
}

export default async function EstatesAndSubstationsPage({
  searchParams,
}: EstatesAndSubstationsPageProps) {
  const params = await searchParams;
  const locale = params.locale || 'en';
  const [page, estates] = await Promise.all([
    getEstateAndSubstationsPage(locale),
    getEstateSubstations(locale),
  ]);
  const pageData = mapEstateLandingPageData(page, estates);

  return (
    <div className="min-h-screen bg-[#F6F8F3]">
      <PageHero
        title={pageData.hero.title}
        breadcrumbItems={pageData.hero.breadcrumbItems}
        backgroundImage={pageData.hero.backgroundImage}
        backgroundImageAlt={pageData.hero.backgroundImageAlt}
        locale={locale}
      />

      <section className="relative overflow-hidden bg-white mb-48">
        <div
          className="absolute left-[-6%] top-1/2 hidden aspect-square w-[52vw] max-w-full -translate-y-1/2 bg-cover bg-center bg-no-repeat lg:block"
          style={{
            backgroundImage:
              "url('/images/estateandsubstationsbgimage.webp')",
            filter: 'blur(20px)',
          }}
          aria-hidden="true"
        />

        <div className="relative min-h-[820px] px-4 py-16 md:px-6 lg:px-36 lg:py-12">
          <div className="mx-auto w-full max-w-[1480px]">
            <div className="min-h-[820px] pt-4 lg:pt-0">
              <div className="w-full lg:ml-[48%] lg:max-w-[620px]">
                <div className="flex flex-col items-start gap-5">
                  <GradientTag
                    text={pageData.section.eyebrow}
                    className="inline-block"
                    padding="px-4 py-1.5"
                  />

                  <GradientTitle
                    part1={pageData.section.titlePart1}
                    part2={pageData.section.titlePart2}
                    lineBreak={false}
                    align="left"
                    size="custom"
                    customSize="clamp(2.25rem, 3vw, 3.75rem)"
                    className="max-w-full leading-[1.08]"
                  />
                </div>
              </div>

              <div className="mt-10 w-full lg:w-[80%] lg:ml-[10%]">
                <EstatesResearchSlider
                  slides={pageData.slides}
                  readMoreLabel={pageData.readMoreButtonLabel}
                  locale={locale}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
