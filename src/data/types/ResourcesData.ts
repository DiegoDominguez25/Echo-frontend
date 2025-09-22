export interface AudioAnalysis {
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
  id: string;
  audio_url: string;
  text: string;
  difficulty: string;
  categories: string[];
  wordCount: number;
  translation: string;
  audio_analysis: AudioAnalysis;
}

export interface Words {
  id: string;
  audio_url: string;
  text: string;
  difficulty: string;
  categories: string[];
  wordCount: number;
  definitions: { [key: string]: string }[];
  ipa: string;
  translation: string;
  audio_analysis: AudioAnalysis;
}

export interface Texts {
  id: string;
  audio_url: string;
  text: string;
  difficulty: string;
  categories: string[];
  wordCount: number;
  bookTitle: string;
  translation: string;
  audio_analysis: AudioAnalysis;
}
