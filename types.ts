
export interface SocialPost {
  id: string;
  content: string;
  platform: 'facebook' | 'linkedin' | 'instagram' | 'twitter';
  status: 'draft' | 'scheduled' | 'published';
  scheduledDate?: string;
  publishedDate?: string;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    clicks: number;
  };
}

export interface EngagementMetric {
  date: string;
  likes: number;
  shares: number;
  comments: number;
  clicks: number;
}

export interface ContentIdea {
  title: string;
  draft: string;
  platform: string;
  scheduledDate?: string;
  isScheduled?: boolean;
  engagementScore?: number;
}

export interface ContentTemplate {
  id: string;
  name: string;
  structure: string;
  icon: string;
}

export interface LibraryTemplate {
  id: string;
  category: 'Life Insurance' | 'Annuities' | 'Legacy & Estate' | 'Business Protection';
  subCategory: string;
  title: string;
  description: string;
  structure: string;
  hashtags: string[];
}

export type PipelineStage = 
  | 'New Lead' 
  | 'Contacted' 
  | 'Booked Call' 
  | 'Discovery Complete' 
  | 'Options Presented' 
  | 'App Submitted' 
  | 'Underwriting' 
  | 'Issued / Delivered' 
  | 'In Force + Review' 
  | 'Lost / Not Proceeding';

export type ProductType = 'Term' | 'IUL' | 'FE' | 'FIA' | 'Business' | 'Whole Life' | 'None';
export type LeadSource = 'Website' | 'Referral' | 'Community' | 'School District' | 'Social';
export type County = 'Schuylkill' | 'Luzerne' | 'Northumberland' | 'Other';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: PipelineStage;
  county: County;
  leadSource: LeadSource;
  productInterest: ProductType;
  household: string;
  lastInteraction: string;
  goals: string[];
  notes: string;
  carrier?: string;
  monthlyPremium?: number;
  appDate?: string;
  issueDate?: string;
  reviewMonth?: string;
  snapshot?: ClientSnapshot;
}

export interface ClientSnapshot {
  whoTheyAre: string;
  familyContext: string[];
  financialPicture: string[];
  topGoals: string[];
  riskThemes: string[];
  summary: string;
}

export interface FunnelStage {
  name: string;
  strategy: string;
  assetCopy: string;
}

export interface Funnel {
  id: string;
  name: string;
  goal: string;
  persona: string;
  stages: FunnelStage[];
  status: 'Draft' | 'Active';
}

export interface FunnelBlueprint {
  id: string;
  name: string;
  category: string;
  persona: string;
  stages: string[];
  description: string;
}

export type LinkCategory = 'Carrier' | 'GFI' | 'Portals' | 'Social' | 'Tools' | 'Funnels' | 'Other';

export interface LinkItem {
  id: string;
  name: string;
  url: string;
  category: LinkCategory;
  tags: string[];
  notes?: string;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type DocCategory = 'Brochure' | 'Product Guide' | 'Presentation' | 'Script' | 'Compliance' | 'Other';

export interface DocItem {
  id: string;
  title: string;
  category: DocCategory;
  carrier?: string;
  url?: string; // external link for now; file upload will be enabled when Supabase storage is connected
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InboxMessage {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  receivedAt: string;
  status: 'New' | 'Triaged' | 'Converted';
}

export interface LandingPageBlueprint {
  id: string;
  name: string;
  category: string;
  sections: string[];
  description: string;
}

export interface FormBlueprint {
  id: string;
  name: string;
  fields: string[];
  description: string;
}

export interface Connector {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'Agency' | 'Carrier' | 'Social' | 'Analytics';
  isConnected: boolean;
  lastSync?: string;
  color: string;
  brandColor?: string;
  agentId?: string;
}

export interface CarrierAsset {
  id: string;
  name: string;
  carrier: string;
  type: string;
  uploadDate: string;
  fileData?: string;
  mimeType?: string;
}
