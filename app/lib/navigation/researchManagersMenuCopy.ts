import type { ResearchManagersMenuCopy, ResearchManagersPage } from '../types';

const RESEARCH_MANAGERS_MENU_COPY_FALLBACK: ResearchManagersMenuCopy = {
  eyebrow: 'Research Leadership',
  title: 'Profiles shaping RRISL research direction',
  description:
    "Explore the institute's research management team through a cleaner, more readable profile format. Each card surfaces the essentials first, with the full profile available on demand.",
  cta: 'View Full Profile',
  label: 'Research Management',
};

function firstText(...values: Array<string | null | undefined>): string {
  return values.map((value) => value?.trim()).find(Boolean) || '';
}

export function mapResearchManagersMenuCopy(
  page: ResearchManagersPage | null | undefined,
  fallbackPage?: ResearchManagersPage | null,
): ResearchManagersMenuCopy {
  const header = page?.researchleadershipdetails;
  const fallbackHeader = fallbackPage?.researchleadershipdetails;
  const title = firstText(header?.title, fallbackHeader?.title);
  const highlightedText = firstText(
    header?.hightlightedtext,
    fallbackHeader?.hightlightedtext,
  );

  return {
    eyebrow: firstText(
      header?.eyebrow,
      fallbackHeader?.eyebrow,
      RESEARCH_MANAGERS_MENU_COPY_FALLBACK.eyebrow,
    ),
    title:
      [title, highlightedText].filter(Boolean).join(' ') ||
      RESEARCH_MANAGERS_MENU_COPY_FALLBACK.title,
    description: firstText(
      page?.description,
      fallbackPage?.description,
      RESEARCH_MANAGERS_MENU_COPY_FALLBACK.description,
    ),
    cta: firstText(
      page?.viewfullprofilebuttonlabel,
      fallbackPage?.viewfullprofilebuttonlabel,
      RESEARCH_MANAGERS_MENU_COPY_FALLBACK.cta,
    ),
    label: firstText(
      page?.researchmanagementlabel,
      fallbackPage?.researchmanagementlabel,
      RESEARCH_MANAGERS_MENU_COPY_FALLBACK.label,
    ),
  };
}
