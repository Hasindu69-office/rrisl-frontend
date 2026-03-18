import React from 'react';
import GradientTag from '@/app/components/ui/GradientTag';
import GradientTitle from '@/app/components/ui/GradientTitle';
import Button from '@/app/components/ui/Button';
import CustomPieChart from './CustomPieChart';

const chartData = [
  { label: 'Production', value: 12799 },
  { label: 'Plantation', value: 12799 },
  { label: 'Price', value: 15000 },
  { label: 'Price', value: 17000 },
  { label: 'Other', value: 10000 },
];

/**
 * Data Insights Section Component
 * Features a light background with statistics visualization and detailed insights
 */
export default function DataInsightsSection() {
  return (
    <section
      className="relative w-full overflow-hidden flex items-center justify-center py-12 md:py-24 -mt-[1px]"
      style={{
        minHeight: '600px',
        backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.7) 100%, rgba(255, 255, 255, 0) 100%), url("/images/datainsightsbackground.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundColor: 'white',
      }}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Left Side - Statistics Visualization */}
          <div className="flex flex-col min-h-[400px] md:min-h-[600px] rounded-[40px] p-2 md:p-10 overflow-hidden">
            {/* Header of the visualization */}
            <div className="w-full">
              <div className="flex justify-between items-end w-full mb-1">
                <div
                  className="font-medium text-sm md:text-lg text-[#929292]"
                >
                  Statistics
                </div>
                <div
                  className="font-medium text-right text-sm md:text-lg text-[#929292]"
                >
                  Year
                </div>
              </div>
              <div className="flex justify-between items-start w-full gap-4">
                <div className="text-left">
                  <h3
                    className="font-bold tracking-tight text-lg md:text-[22px] text-[#17203E]"
                  >
                    Rubber Production by Different Types
                  </h3>
                </div>
                <div className="text-right whitespace-nowrap">
                  <div
                    className="font-bold text-xl md:text-[22px] text-[#17203E]"
                  >
                    2024
                  </div>
                </div>
              </div>

              {/* Horizontal separator line */}
              <hr className="border-t border-[#E5E5E5] mt-4 md:mt-6 mb-6 md:mb-10" />
            </div>

            {/* Custom SVG Pie Chart */}
            <div className="flex-1 flex items-center justify-center">
              <CustomPieChart data={chartData} />
            </div>
          </div>

          {/* Right Side - Content Section */}
          <div className="flex flex-col items-start text-left px-2 md:px-0">
            {/* Data & Insights Tag */}
            <div className="mb-6">
              <GradientTag
                text="Data & Insights"
                backgroundColor="transparent"
                textColor="#2E7D32"
              />
            </div>

            {/* Title */}
            <GradientTitle
              part1="Real-Time "
              part2="Data & Insights"
              part1Color="dark-green"
              lineBreak={false}
              size="lg"
              align="left"
              className="font-bold mb-6 md:mb-8"
              style={{ lineHeight: '130%' }}
            />

            {/* Description */}
            <div className="space-y-4 md:space-y-6 text-[#4A4A4A] text-sm md:text-base leading-[160%] max-w-[600px] mb-8 md:mb-10 text-justify">
              <p>
                This section presents a detailed year-to-year comparison of growth across
                major rubber product categories, including Sheet, Sole Crepe, Scrap Crepe,
                Latex Crepe, T.S.R., and Latex Other. It allows users to analyze annual
                performance by examining changes in production volumes and identifying
                patterns of growth, decline, or stability over time. Through clear visualization
                and structured data presentation, the section supports easy comparison
                between years and product types, helping users understand both short-term
                fluctuations and long-term industry trends.
              </p>
              <p>
                The information is particularly useful for researchers, policymakers,
                rubber growers, exporters, and industry stakeholders who require reliable
                insights for planning and evaluation. By observing year-on-year movements,
                users can assess how market demand, production conditions, and policy or
                environmental factors may influence different product segments.
              </p>
            </div>

            {/* View Data Button */}
            <Button variant="primary" size="lg">
              View Data
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

