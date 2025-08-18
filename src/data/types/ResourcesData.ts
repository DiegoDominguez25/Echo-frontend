interface AudioAnalysis {
  numberOfSyllables: number;
  numberOfPauses: number;
  speechRate: number;
  articulationRate: number;
  speakingDuration: number;
  totalDuration: number;
  ratio: number;
  transcription: string;
}

export interface Sentences {
  uid: string;
  audioUrl: string;
  text: string;
  difficulty: string;
  categories: string[];
  wordCount: number;
  translation: string;
  AudioAnalysis: AudioAnalysis;
}

export interface Words {
  uid: string;
  audioUrl: string;
  text: string;
  difficulty: string;
  categories: string[];
  wordCount: number;
  definitions: { [key: string]: string }[];
  ipa: string;
  translation: string;
  AudioAnalysis: AudioAnalysis;
}

export interface Texts {
  uid: string;
  audioUrl: string;
  text: string;
  difficulty: string;
  categories: string[];
  wordCount: number;
  bookTitle: string;
  translation: string;
  AudioAnalysis: AudioAnalysis;
}
