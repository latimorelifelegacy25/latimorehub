export type InterestKey =
  | 'life-insurance'
  | 'mortgage-protection'
  | 'final-expense'
  | 'retirement-income'
  | 'iul'
  | 'annuities'
  | 'business-protection'
  | 'education-funding'
  | 'team-opportunity'
  | 'pahs-football';

export type FunnelKey =
  | 'protection'
  | 'legacy-planning'
  | 'retirement'
  | 'wealth-accumulation'
  | 'business'
  | 'recruiting'
  | 'community-sponsorship';

export interface InterestMapEntry {
  label: string;
  funnel: FunnelKey;
  href: string;
  eventName: string;
  description: string;
}

export const INTEREST_MAP: Record<InterestKey, InterestMapEntry> = {
  'life-insurance': {
    label: 'Life Insurance & Living Benefits',
    funnel: 'protection',
    href: '/products#life-insurance',
    eventName: 'interest_life_insurance_click',
    description: 'Term, whole life, IUL, and living benefits for family protection.',
  },
  'mortgage-protection': {
    label: 'Mortgage Protection',
    funnel: 'protection',
    href: '/services#mortgage-protection',
    eventName: 'interest_mortgage_protection_click',
    description: 'Coverage designed to help families keep the home if income is lost.',
  },
  'final-expense': {
    label: 'Final Expense Planning',
    funnel: 'legacy-planning',
    href: '/products#final-expense',
    eventName: 'interest_final_expense_click',
    description: 'Simple coverage that helps loved ones avoid burial-cost burdens.',
  },
  'retirement-income': {
    label: 'Retirement Income Strategies',
    funnel: 'retirement',
    href: '/services#retirement-income',
    eventName: 'interest_retirement_income_click',
    description: 'Safe-money and income strategies for retirement confidence.',
  },
  iul: {
    label: 'Indexed Universal Life',
    funnel: 'wealth-accumulation',
    href: '/products#indexed-universal-life',
    eventName: 'interest_iul_click',
    description: 'Protection with tax-advantaged cash-value growth potential.',
  },
  annuities: {
    label: 'Annuities',
    funnel: 'retirement',
    href: '/products#annuities',
    eventName: 'interest_annuities_click',
    description: 'Fixed and fixed-indexed options for protected accumulation and income.',
  },
  'business-protection': {
    label: 'Business & Key-Person Insurance',
    funnel: 'business',
    href: '/services#business-protection',
    eventName: 'interest_business_protection_click',
    description: 'Continuity planning for owners, partners, and critical employees.',
  },
  'education-funding': {
    label: 'College Education Funding',
    funnel: 'wealth-accumulation',
    href: '/services#college-education-funding',
    eventName: 'interest_education_funding_click',
    description: 'Flexible strategies for funding education without risking retirement.',
  },
  'team-opportunity': {
    label: 'Join Our Team',
    funnel: 'recruiting',
    href: '/join',
    eventName: 'interest_join_team_click',
    description: 'Explore the mission, training path, and independent advisor opportunity.',
  },
  'pahs-football': {
    label: 'PAHS Football 2026',
    funnel: 'community-sponsorship',
    href: '/pahs',
    eventName: 'interest_pahs_football_click',
    description: 'Community sponsorship information for Pottsville Area football supporters.',
  },
};
