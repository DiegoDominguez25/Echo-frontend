export interface Evaluation {
  articulation_score: number;
  clarity_score: number;
  rhythm_score: number;
  speed_score: number;
  total_score: number;
  articulation_tip: Array<string>;
  clarity_tip: Array<string>;
  rhythm_tip: Array<string>;
  speed_tip: Array<string>;
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
  resourceUid: string;
  type: number;
  completed: boolean;
  completionDate: Date;
  attempts: number;
  lastAttempt: Date;
  evaluation: Evaluation;
}
