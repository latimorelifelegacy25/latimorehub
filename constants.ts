
import { PipelineStage, Client, LibraryTemplate, FunnelBlueprint, LandingPageBlueprint, FormBlueprint } from './types';

export const COLORS = {
  navy: '#2C3E50',
  gold: '#C49A6C',
  white: '#FFFFFF',
  gray: '#F8FAFC'
};

export const BRAND_STORY = {
  founder: "Jackson M. Latimore Sr.",
  origin: "Jackson M. Latimore Sr. survived sudden cardiac arrest on December 7, 2010, while playing basketball at East Stroudsburg University. An AED was available and used by trainers to restart his heart. This life-altering event, combined with the story of Greg Moyer (who passed away in 2000 due to the lack of an AED), became the foundation for Latimore Life & Legacy LLC.",
  mission: "To help families and organizations protect what matters and build legacies that outlive them — using clear education and preparation, never fear-based messaging.",
  tagline: "Protecting Today. Securing Tomorrow.",
  hashtag: "#TheBeatGoesOn"
};

export const PIPELINE_STAGES: PipelineStage[] = [
  'New Lead',
  'Contacted',
  'Booked Call',
  'Discovery Complete',
  'Options Presented',
  'App Submitted',
  'Underwriting',
  'Issued / Delivered',
  'In Force + Review',
  'Lost / Not Proceeding'
];

export const FUNNEL_BLUEPRINTS: FunnelBlueprint[] = [
  {
    id: 'f1',
    name: 'The Mortgage Protection Mastery',
    category: 'Life Insurance',
    persona: 'New Homeowners',
    stages: ['Regional FB Hook', 'Home Security Webinar', 'Direct App Link'],
    description: 'A focused strategy to convert recent homebuyers by framing life insurance as the ultimate mortgage safeguard.'
  },
  {
    id: 'f2',
    name: 'Wealth Engine (IUL Depth)',
    category: 'Life Insurance',
    persona: 'High Income Accumulators',
    stages: ['LinkedIn Strategy Post', 'The 3 Rules of Money PDF', 'Discovery Call'],
    description: 'Deep-dive educational funnel focusing on the "And" asset (IUL) for tax-advantaged growth.'
  },
  {
    id: 'f3',
    name: 'Safe Income Advantage (FIA)',
    category: 'Annuities',
    persona: 'Retirees (Age 60+)',
    stages: ['Volatility News Hook', 'Personal Pension Video', 'In-Person Review'],
    description: 'Designed for the risk-averse looking for market-proof income and the Rule of 72 benefits.'
  }
];

export const LANDING_PAGE_BLUEPRINTS: LandingPageBlueprint[] = [
  {
    id: 'lp1',
    name: 'The Legacy Protector (Classic)',
    category: 'General Life',
    sections: ['Hero: Family Security', 'The Jackson Story', '3-Bucket Education', 'Legacy Form'],
    description: 'A clean, high-trust layout focusing on the emotional core of protection.'
  },
  {
    id: 'lp2',
    name: 'The IUL Wealth Builder',
    category: 'Wealth Building',
    sections: ['Tax-Free Growth Hook', 'Market Volatility Comparison', 'Living Benefits Grid', 'Apply Now'],
    description: 'Modern, data-driven layout for younger professionals interested in IUL.'
  },
  {
    id: 'lp3',
    name: 'Annuity Safety Net',
    category: 'Retirement',
    sections: ['Market Crash Proof Hero', 'Personal Pension Explainer', 'Client Testimonials', 'Free Review CTA'],
    description: 'Trust-heavy layout for seniors worried about their nest egg.'
  }
];

export const FORM_BLUEPRINTS: FormBlueprint[] = [
  {
    id: 'frm1',
    name: 'Velocity Instant Quote',
    fields: ['Full Name', 'DOB', 'Tobacco Status', 'Coverage Amount'],
    description: 'Lightweight lead capture for Ethos/Velocity Term leads.'
  },
  {
    id: 'frm2',
    name: 'Full Legacy Discovery',
    fields: ['Family Size', 'Mortgage Balance', 'Current Assets', 'Goal Ranking'],
    description: 'Comprehensive discovery form for IUL and Holistic Legacy planning.'
  },
  {
    id: 'frm3',
    name: 'Pension Analysis Request',
    fields: ['Retirement Year', 'Current 401k Balance', 'Risk Tolerance', 'Desired Income'],
    description: 'Targeted form for FIA and Annuity opportunities.'
  }
];

export const LIBRARY_TEMPLATES: LibraryTemplate[] = [
  {
    id: 'l0',
    category: 'Legacy & Estate',
    subCategory: 'Legacy Protection',
    title: 'The Importance of Securing Legacy',
    description: 'A high-impact strategy explaining how life insurance acts as the ultimate bedrock for a family\'s future.',
    structure: 'Open with the concept that a legacy isn\'t just what you leave FOR someone, but what you leave IN them. Transition to the financial tools (IUL/Term) that ensure the mission continues. Emphasize preparation over fear. CTA: Start building your legacy blueprint today.',
    hashtags: ['LegacyBuilding', 'FamilyFirst', 'TheBeatGoesOn', 'LatimoreLegacy']
  },
  {
    id: 'l1',
    category: 'Life Insurance',
    subCategory: 'Mortgage Protection',
    title: 'Home Security Beyond the Locks',
    description: 'A compelling post explaining why life insurance is the ultimate mortgage safety net.',
    structure: 'Start by asking homeowners what their biggest monthly expense is. Transition to the risk of losing income. Explain how mortgage protection works as a specific term policy. Call to action: "Ensure your family keeps the keys, no matter what."',
    hashtags: ['MortgageProtection', 'Homeowners', 'PeaceOfMind']
  },
  {
    id: 'l2',
    category: 'Life Insurance',
    subCategory: 'IUL',
    title: 'The "And" Asset Strategy (Builder Plus 4)',
    description: 'Explaining Indexed Universal Life for both protection and supplemental retirement using the North American Builder Plus 4.',
    structure: 'Focus on the "Tax-Free" bucket. Compare traditional savings to IUL growth potential with a 0% floor. Emphasize the death benefit AND the living benefits. End with a legacy-building prompt. Reference IRS codes 7702A, 72E, and 101A.',
    hashtags: ['IUL', 'TaxFreeRetirement', 'WealthBuilding']
  },
  {
    id: 'l3',
    category: 'Annuities',
    subCategory: 'FIA',
    title: 'Safe Income Advantage (Rule of 72)',
    description: 'Breaking down Fixed Indexed Annuities (FIA) for retirees worried about market volatility, highlighting the F&G Safe Income Advantage.',
    structure: 'Acknowledge the stress of market swings. Introduce the "Personal Pension". Detail the Rule of 72 benefit: 7.2% compounded roll-up rate that doubles the income base every 10 years if deferred.',
    hashtags: ['Annuities', 'RetirementPlanning', 'FinancialSafety']
  },
  {
    id: 'l4',
    category: 'Life Insurance',
    subCategory: 'Final Expense',
    title: 'A Gift of Love, Not a Burden',
    description: 'Soft and empathetic approach to Final Expense coverage for seniors.',
    structure: 'Open with a warm family memory. Pivot to the reality of funeral costs. Explain how a small policy removes the financial burden from children. Tagline: #TheBeatGoesOn.',
    hashtags: ['FinalExpense', 'Seniors', 'LegacyLove']
  },
  {
    id: 'l5',
    category: 'Business Protection',
    subCategory: 'Key Person',
    title: 'Protecting the Leadership Beat',
    description: 'Business insurance for key employees and partners, specifically for school districts and SMEs.',
    structure: 'Ask a superintendent or business owner what happens if a vital leader is lost. Discuss transition costs and continuity. Propose Key Person Insurance as a stabilizer for the organization.',
    hashtags: ['SchoolDistricts', 'KeyPersonInsurance', 'ContinuityPlanning']
  },
  {
    id: 'l6',
    category: 'Life Insurance',
    subCategory: 'Ethos Velocity',
    title: 'Protection in 10 Minutes',
    description: 'Highlighting the "Velocity Engine" via the Ethos platform for quick term life needs.',
    structure: 'Focus on speed and simplicity. 10-minute online application, no medical exams for many, instant decisions. Ideal for busy young families in Central PA.',
    hashtags: ['Ethos', 'QuickLifeInsurance', 'ModernProtection']
  }
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
  { id: 'links', label: 'Portals & Links', icon: 'fa-link' },
  { id: 'docs', label: 'Brochures & Docs', icon: 'fa-folder-open' },
  { id: 'inbox', label: 'Inbox (Intake)', icon: 'fa-inbox' },
  { id: 'crm', label: 'Life Hub CRM', icon: 'fa-users-gear' },
  { id: 'library', label: 'Strategy Library', icon: 'fa-book-bookmark' },
  { id: 'vault', label: 'Asset Vault', icon: 'fa-folder-open' },
  { id: 'creator', label: 'Content Architect', icon: 'fa-pen-nib' },
  { id: 'tools', label: 'Marketing Tools', icon: 'fa-toolbox' },
  { id: 'funnels', label: 'Legacy Hub', icon: 'fa-filter-circle-dollar' },
  { id: 'schedule', label: 'Schedule', icon: 'fa-calendar-check' },
  { id: 'calendar', label: 'Campaigns', icon: 'fa-calendar-days' },
  { id: 'connectors', label: 'Integrations', icon: 'fa-plug' },
  { id: 'settings', label: 'Settings', icon: 'fa-gear' },
];

export const MOCK_ENGAGEMENT_DATA = [
  { date: '2024-05-01', likes: 120, shares: 15, comments: 8, clicks: 45 },
  { date: '2024-05-02', likes: 145, shares: 22, comments: 12, clicks: 58 },
  { date: '2024-05-03', likes: 130, shares: 18, comments: 10, clicks: 52 },
  { date: '2024-05-04', likes: 190, shares: 35, comments: 25, clicks: 88 },
  { date: '2024-05-05', likes: 210, shares: 42, comments: 30, clicks: 110 },
  { date: '2024-05-06', likes: 175, shares: 28, comments: 18, clicks: 75 },
  { date: '2024-05-07', likes: 250, shares: 55, comments: 45, clicks: 140 },
];

export const MOCK_CLIENTS: Client[] = [
  {
    id: '19a5e2d4-2c03-46a7-ba85-cc7896ec713a',
    name: 'Jackson M Latimore',
    email: 'jackson1989@latimorelegacy.com',
    phone: '+15705906104',
    status: 'New Lead',
    county: 'Schuylkill',
    leadSource: 'Social',
    productInterest: 'Whole Life',
    household: 'Single, 3 children',
    lastInteraction: 'Feb 01 2026',
    goals: ['Coverage Amount: 100,000'],
    notes: 'Frackville resident. Budget: 50. Prefers Text/Email.',
    monthlyPremium: 50
  },
  {
    id: 'df6f21e0-7da9-4a1e-812b-555ee02fdfad',
    name: 'Vivian Yvonne Green',
    email: 'viv.green1972.vg@gmail.com',
    phone: '+12053626495',
    status: 'New Lead',
    county: 'Other',
    leadSource: 'Social',
    productInterest: 'FE',
    household: 'Separated, 0 children',
    lastInteraction: 'Jan 31 2026',
    goals: ['Coverage Amount: 50,000'],
    notes: 'Pell City, AL. Health: High blood pressure, acid reflux, back pain. Budget: 25.',
    monthlyPremium: 25
  },
  {
    id: '7e5ddbc3-d009-4550-91fd-e9227dbd3b3f',
    name: 'Tressa peterson',
    email: 'tressap1969@gmail.com',
    phone: '+15705900852',
    status: 'New Lead',
    county: 'Schuylkill',
    leadSource: 'Social',
    productInterest: 'FE',
    household: 'Single, 4 children',
    lastInteraction: 'Jan 13 2026',
    goals: ['Just to prepare for my children to take care'],
    notes: 'Shenandoah resident. Budget: 50. Height: 5ft 6in, Weight: 185lb.',
    monthlyPremium: 50
  },
  {
    id: '45c027f3-11e6-4b50-8c2e-914d2dcc5382',
    name: 'Nicolas Elliot Milewski',
    email: 'nicm450@gmail.com',
    phone: '+15709001155',
    status: 'New Lead',
    county: 'Schuylkill',
    leadSource: 'Social',
    productInterest: 'IUL',
    household: 'Single, 2 children',
    lastInteraction: 'Dec 17 2025',
    goals: ['Sustained growth'],
    notes: 'Shenandoah resident. Manager at Anthracite Tree Care LLC. Has existing Life/Auto.',
    monthlyPremium: 100
  },
  {
    id: '9b859235-e376-4ea6-a397-865912b900cf',
    name: 'James Colosimo',
    email: 'jimcolly36@gmail.com',
    phone: '+15705163900',
    status: 'New Lead',
    county: 'Schuylkill',
    leadSource: 'Social',
    productInterest: 'None',
    household: 'Married, 1 child',
    lastInteraction: 'Oct 31 2025',
    goals: [],
    notes: 'New Boston resident. Manufacturing industry. Has Auto Insurance.',
  },
  {
    id: 'f948cc3d-295f-4eb1-9059-1d15cdc7c07f',
    name: 'Meda Marshall',
    email: 'mlm436a@gmail.com',
    phone: '+15706241765',
    status: 'New Lead',
    county: 'Schuylkill',
    leadSource: 'Social',
    productInterest: 'FE',
    household: 'Single, 5 children',
    lastInteraction: 'Oct 01 2025',
    goals: [],
    notes: 'Minersville resident. Health: Arthritis, Copd, HBP, Degenerative Disc Disease. Budget: 25.',
    monthlyPremium: 25
  },
  {
    id: '96be9910-88d4-4947-8689-f7c1eb9b6982',
    name: 'Jackson M Latimore (Frackville)',
    email: 'jackson1989@latimorelegacy.com',
    phone: '+15709001266',
    status: 'New Lead',
    county: 'Schuylkill',
    leadSource: 'Social',
    productInterest: 'IUL',
    household: 'Single, 3 children',
    lastInteraction: 'Oct 01 2025',
    goals: [],
    notes: 'Frackville resident. Insurance industry. Pacemaker wearer. Budget: 50.',
    monthlyPremium: 50
  }
];
