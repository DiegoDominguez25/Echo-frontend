export interface Evaluation {
  audioUrl: string;
  totalScore: number;
  clarityScore: number;
  speedScore: number;
  rythmScore: number;
  articulationScore: number;
  clarityTip: string;
  speedTip: string;
  rythmTip: string;
  articulationTip: string;
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
  uid: string;
  resourceUid: string;
  type: number;
  completed: boolean;
  completionDate: Date;
  attempts: number;
  lastAttempt: Date;
  evaluation: Evaluation;
}
