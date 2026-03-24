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
      className={`group relative min-h-[108px] rounded-[16px] px-4 py-5 text-left transform-gpu transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-5 sm:py-4 ${
        active
          ? 'scale-[1.01] text-white shadow-[0_20px_40px_rgba(15,63,29,0.18)]'
          : 'bg-white text-[#2E7D32] shadow-[0_10px_30px_rgba(15,63,29,0.06)] hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(15,63,29,0.1)]'
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
      <div className="flex h-full flex-col justify-between gap-4">
        <div>
          <div className={`text-[14px] font-medium ${active ? 'text-white/92' : 'text-[#93CF19]'}`}>
            {eyebrow}
          </div>
          <div className={`mt-1 text-[18px] font-medium sm:text-[20px] ${active ? 'text-white' : 'text-[#1E6B2F]'}`}>
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
