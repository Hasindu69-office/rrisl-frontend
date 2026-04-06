import React from 'react';
import Breadcrumb, { BreadcrumbItem } from './Breadcrumb';
import styles from './PageHero.module.css';

interface HeroCutoutProps {
    breadcrumbItems?: BreadcrumbItem[];
    locale?: string;
}

const HeroCutout = ({ breadcrumbItems = [], locale = 'en' }: HeroCutoutProps) => {
    return (
        <div className="absolute bottom-0 right-0 w-full sm:w-auto z-20">
            <div className="relative w-full sm:w-auto">
                <svg
                    width="874"
                    height="77"
                    viewBox="0 0 874 77"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto max-w-[80vw] sm:max-w-[60vw] md:max-w-[60vw] lg:max-w-[60vw] xl:max-w-none ml-auto pointer-events-none"
                    preserveAspectRatio="xMaxYMax meet"
                >
                    <path
                        d="M0 151.831C5.29879 151.288 10.641 150.204 15.9181 150.312C32.8785 150.681 45.8866 143.631 55.1812 129.834C73.9441 101.98 92.2076 73.8002 111.144 46.0763C115.661 39.4599 119.874 32.5615 124.5 26.0101C136.009 9.67516 154.816 0 174.817 0H1077V154C1071.64 154 1066.01 154 1060.41 154"
                        fill="white"
                    />
                </svg>

                {breadcrumbItems.length > 0 && (
                    <div className={`${styles.breadcrumbReveal} absolute inset-x-0 bottom-2 flex justify-center px-4 sm:bottom-2 md:bottom-3 pl-32 md:pl-0`}>
                        <Breadcrumb
                            items={breadcrumbItems}
                            variant="dark"
                            locale={locale}
                            className="pointer-events-auto whitespace-nowrap text-xs sm:text-sm md:text-base"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeroCutout;
