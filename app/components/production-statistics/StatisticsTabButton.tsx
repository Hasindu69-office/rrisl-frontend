'use client';

import type { StatisticsTabId } from './productionStatisticsData';

interface StatisticsTabButtonProps {
  id: StatisticsTabId;
  label: string;
  eyebrow: string;
  active: boolean;
  onClick: (tabId: StatisticsTabId) => void;
}

function TrendIcon({ active }: { active: boolean }) {
  const stroke = active ? '#68D20E' : '#C9E88A';

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
    >
      <path
        d="M4 16.5L9 11.5L13 15.5L20 8.5"
        stroke={stroke}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 8.5H20V13"
        stroke={stroke}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function StatisticsTabButton({
  id,
  label,
  eyebrow,
  active,
  onClick,
}: StatisticsTabButtonProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-controls={`statistics-panel-${id}`}
      id={`statistics-tab-${id}`}
      onClick={() => onClick(id)}
      className={`group relative min-h-[70px] min-w-[116px] rounded-[14px] px-3 py-3 text-left transition-colors duration-200 ease-out md:min-h-[78px] md:min-w-[140px] md:px-3.5 md:py-3.5 lg:min-h-[92px] lg:min-w-0 lg:rounded-[15px] lg:px-4 lg:py-3.5 lg:transform-gpu lg:transition-all lg:duration-300 lg:ease-[cubic-bezier(0.22,1,0.36,1)] xl:min-h-[96px] xl:rounded-[16px] xl:px-4 xl:py-4 ${
        active
          ? 'text-white shadow-[0_10px_24px_rgba(15,63,29,0.12)] lg:scale-[1.01] lg:shadow-[0_20px_40px_rgba(15,63,29,0.18)]'
          : 'bg-white text-[#2E7D32] shadow-[0_6px_18px_rgba(15,63,29,0.05)] lg:hover:-translate-y-0.5 lg:hover:shadow-[0_18px_38px_rgba(15,63,29,0.1)]'
      }`}
      style={
        active
          ? {
              background:
                'radial-gradient(circle at top right, rgba(26, 115, 52, 1) 0%, rgba(26, 115, 52, 1) 58%, rgba(16, 89, 33, 1) 100%)',
            }
          : undefined
      }
    >
      <div className="flex h-full flex-col justify-between gap-2 md:gap-3 xl:gap-4">
        <div>
          <div className={`text-[10px] font-medium leading-none md:text-[11px] lg:text-[12px] xl:text-[13px] ${active ? 'text-white/92' : 'text-[#93CF19]'}`}>
            {eyebrow}
          </div>
          <div className={`mt-1 text-[15px] font-medium leading-tight md:text-[16px] lg:text-[18px] xl:text-[19px] ${active ? 'text-white' : 'text-[#1E6B2F]'}`}>
            {label}
          </div>
        </div>

        <div className="flex justify-end">
          <TrendIcon active={active} />
        </div>
      </div>
    </button>
  );
}
