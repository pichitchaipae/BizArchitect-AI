export interface CanvasItem {
  content: string;
  status: 'strong' | 'assumed' | 'missing'; // Green, Yellow, Red
  reasoning: string;
}

export interface BusinessCanvasState {
  valueProposition: CanvasItem;
  customerSegments: CanvasItem;
  channels: CanvasItem;
  customerRelationships: CanvasItem;
  revenueStreams: CanvasItem;
  keyResources: CanvasItem;
  keyActivities: CanvasItem;
  keyPartners: CanvasItem;
  costStructure: CanvasItem;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // Base64 string for display
  timestamp: number;
  suggestions?: string[]; // New: Chips for user reply
}

export interface ArchitectResponse {
  responseToUser: string;
  canvasUpdate: BusinessCanvasState;
  suggestions: string[]; // New: AI generated suggestions
}

export type TechStack = 'opensource' | 'enterprise' | 'aws' | 'google';
export type Theme = 'light' | 'dark' | 'system';
export type AnalystRole = 'business_dev' | 'mba_consultant';

export enum CanvasSection {
  KeyPartners = 'keyPartners',
  KeyActivities = 'keyActivities',
  KeyResources = 'keyResources',
  ValueProposition = 'valueProposition',
  CustomerRelationships = 'customerRelationships',
  Channels = 'channels',
  CustomerSegments = 'customerSegments',
  CostStructure = 'costStructure',
  RevenueStreams = 'revenueStreams',
}