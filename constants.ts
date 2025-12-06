import { BusinessCanvasState } from './types';

export const INITIAL_CANVAS_STATE: BusinessCanvasState = {
  valueProposition: { content: '', status: 'missing', reasoning: 'What value do you deliver to the customer?' },
  customerSegments: { content: '', status: 'missing', reasoning: 'Who are you creating value for?' },
  channels: { content: '', status: 'missing', reasoning: 'How do you reach your customers?' },
  customerRelationships: { content: '', status: 'missing', reasoning: 'What type of relationship does each segment expect?' },
  revenueStreams: { content: '', status: 'missing', reasoning: 'For what value are customers really willing to pay?' },
  keyResources: { content: '', status: 'missing', reasoning: 'What key resources does your value proposition require?' },
  keyActivities: { content: '', status: 'missing', reasoning: 'What key activities does your value proposition require?' },
  keyPartners: { content: '', status: 'missing', reasoning: 'Who are your key partners and suppliers?' },
  costStructure: { content: '', status: 'missing', reasoning: 'What are the most important costs inherent in your business model?' },
};

export const SECTION_LABELS: Record<string, string> = {
  keyPartners: 'Key Partners',
  keyActivities: 'Key Activities',
  keyResources: 'Key Resources',
  valueProposition: 'Value Proposition',
  customerRelationships: 'Customer Relationships',
  channels: 'Channels',
  customerSegments: 'Customer Segments',
  costStructure: 'Cost Structure',
  revenueStreams: 'Revenue Streams',
};