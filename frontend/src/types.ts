export type TabType = 'home' | 'assistant' | 'laws' | 'report' | 'awareness' | 'about';

export type Language = 'en' | 'te';

export interface SourceMetadata {
  doc_id: string;
  title: string;
  document_type?: string;
  jurisdiction?: string;
  issue_date?: string;
}

export interface ChatResponse {
  answer: string;
  answer_source: 'dataset_summary' | 'gemini_fallback' | 'emergency_offline' | 'system';
  dataset_match: boolean;
  sources: SourceMetadata[];
  top_score?: number;
  fallback_notice?: string;
  disclaimer: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  responseMeta?: ChatResponse;
}

export interface LawItem {
  id: string;
  section: string;
  act: string;
  category: string;
  title: string;
  description: string;
  penalty: string;
  bailable: string;
}

export interface AwarenessItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  tips: string[];
}
