
export interface BiomarkerDraft {
  name: string;
  value: string | number;
  unit: string;
}

export interface Biomarker {
  biomarcador: string;
  valor: string | number;
  unidade?: string;
  faixa_ideal: string;
  classificacao: 'otimo' | 'alerta' | 'critico';
  interpretacao_simples: string;
  possiveis_correlacoes: string[];
  merece_atencao: boolean;
  system?: string; // Para fins de organização visual
}

export interface AnalysisReport {
  id: string;
  patientName: string;
  patientAge?: string;
  patientSex?: 'Masculino' | 'Feminino';
  patientSymptoms?: string;
  patientCity?: string;
  patientEmail?: string;
  patientPhone?: string;
  date: string;
  patientSummary: string;
  functionalHealthImpactSummary: string;
  healthScore: number;
  clinicalConfirmationIndex?: number;
  biomarkers: Biomarker[];
  o_que_merece_atencao: string[];
  proximos_passos_possiveis: string[];
  disclaimer: string;
  systemsScores: { [key: string]: number };
}

export type AppStage = 'upload' | 'review' | 'report';

export enum AnalysisMode {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE'
}

export interface Review {
  id: string;
  author: string;
  role: string;
  content: string;
  rating: number;
  isFeatured?: boolean;
  date: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  patientName: string;
  score: number;
  report: AnalysisReport;
}

export interface LeadInfo {
  name: string;
  phone: string;
  email: string;
  city?: string;
  age?: string;
  sex?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}
