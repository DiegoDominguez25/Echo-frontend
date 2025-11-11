import type { AudioAnalysis } from "./ResourcesData";

export interface Tips {
  articulation_tip: string[];
  clarity_tip: string[];
  rythm_tip: string[];
  speed_tip: string[];
}
export interface Evaluation {
  articulation_score: number;
  clarity_score: number;
  rythm_score: number;
  speed_score: number;
  total_score: number;
  tips: Tips;
  classification: string;
  audio_url?: string;
}

export interface UserAccountPayload {
  email: string;
  name: string;
  password: string;
  disabled: boolean;
}
export interface CreateAccountResponse {
  message: string;
  doc_id: string;
}

export interface UserApplicationPayload {
  user_uid: string;
  last_login: string;
  creation_date: string;
  date_of_birth: string;
  gender: number;
  profile_picture: string | null;
  username: string;
}
export interface UserApplicationResponse {
  message: string;
  doc_id: string;
}

export interface LoginResponse {
  message: string;
  user_id: string;
  name: string;
  email: string;
}

export interface UserApplicationData {
  id: string;
  username: string;
  profile_picture: string | null;
  gender: number;
  user_uid: string;
  last_login: string;
  date_of_birth: string;
  creation_date: string;
}

export interface Progress {
  id: string;
  resource_uid: string;
  type: number;
  completed: boolean;
  completion_date: Date;
  attempts: number;
  last_attempt: Date;
  evaluation: Evaluation;
  audio_analysis: AudioAnalysis;
}

export interface FlatEvaluation {
  articulation_tip: string[];
  clarity_tip: string[];
  rythm_tip: string[];
  speed_tip: string[];
  articulation_score: number;
  clarity_score: number;
  rythm_score: number;
  speed_score: number;
  total_score: number;
  classification: string;
}
export interface EvaluationScores {
  articulation_score: number;
  clarity_score: number;
  rythm_score: number;
  speed_score: number;
  total_score: number;
}
