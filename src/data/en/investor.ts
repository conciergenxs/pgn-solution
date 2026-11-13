// English copy for src/data/investor.ts, following the original English page (/en/investor). The English
// annual-report text there starts mid-way; its first two sentences are translated from the Indonesian.
import * as id from '../investor';

export const investorHero: typeof id.investorHero = {
  ...id.investorHero,
  title: 'Enhancing quality for a greater future',
  text: 'Find out more about the PT PGAS Solution strategy and business development. Gain insight into how our growth and performance are helping to drive the now and next of PT PGAS Solution’s development.',
};

export const highlightsIntro: typeof id.highlightsIntro = {
  eyebrow: 'Highlights',
  title: 'PGAS Solution throughout the years',
  text: 'We are confident in stepping forward successfully, becoming a market leader in the operational and gas engineering field in Indonesia.',
};

const en: Record<string, { label: string; series: string; unit: string }> = {
  'work-hours': { label: 'Safe work hours in 2025', series: 'Safe Work Hours', unit: 'hours' },
  projects: { label: 'Total projects as of 2025', series: 'Total Projects', unit: 'projects' },
  pipeline: { label: 'O&M pipeline length as of 2025', series: 'O&M Pipeline Length', unit: 'km' },
  revenue: { label: 'billion revenue in 2025', series: 'billion', unit: 'billion' },
};
export const highlights: typeof id.highlights = id.highlights.map((h) => ({ ...h, prefix: 'More than', ...en[h.id] }));

export const featuredReport: typeof id.featuredReport = {
  year: 2025,
  title: 'Weave the Bond, Reach Beyond',
  text: 'In 2025, PT PGAS Solution proved the roots of its resilience on its journey towards excellence. Amid a challenging business environment, the Company remained steadfast in the core of its excellence: innovation, quality, and integrity. This excellence is not merely a goal, but has become an integral part of the Company, reflected in every target, decision, and strategy undertaken. The Company understands that excellence is not about reaching the highest point once, but about consistently surpassing established standards. To that end, PT PGAS Solution has pursued various innovations as part of its sustainable development efforts, with a focus on environmental sustainability. This is reflected in operational procedures that prioritize safety and environmental sustainability, the implementation of corporate social responsibility programs in environmental aspects, the execution of routine inspections and assessments related to environmental conditions across development projects, and other measures. Moving forward, to explore untapped energy sources, synergy from all fronts is essential, both internal and external, to achieve optimization across all lines, as well as positive synergy in the shared mission of nation-building. PT PGAS Solution remains committed and proactive in fostering such synergy, one that unites and energizes the nation to achieve shared aspirations, justice, and equitable prosperity.',
};
