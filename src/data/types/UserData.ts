import type { AudioAnalysis } from "./ResourcesData";
export interface Evaluation {
  articulation_score: number;
  clarity_score: number;
  rythm_score: number;
  speed_score: number;
  total_score: number;
  articulation_tip: string[];
  clarity_tip: string[];
  rythm_tip: string[];
  speed_tip: string[];
  classification: string;
}

export interface Users {
  uid: string;
  email: string;
  name: string;
  password: string;
  disabled: boolean;
}

export interface UserApplication {
  uid: string;
  userId: string;
  lastLogin: Date;
  creationDate: Date;
  dateOfBirth: Date;
  gender: number;
  profilePicture: string;
  username: string;
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
