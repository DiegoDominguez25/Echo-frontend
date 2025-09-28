export interface AudioAnalysis {
  number_of_syllables: number;
  number_of_pauses: number;
  speech_rate: number;
  articulation_rate: number;
  speaking_duration: number;
  total_duration: number;
  ratio: number;
  transcription: string;
}

export interface Sentences {
  id: string;
  audio_url: string;
  text: string;
  difficulty: string;
  categories: string[];
  word_count: number;
  translation: string;
  audio_analysis: AudioAnalysis;
  audio_duration: number;
}

export interface Words {
  id: string;
  audio_url: string;
  text: string;
  difficulty: string;
  categories: string[];
  word_count: number;
  definitions: { [key: string]: string }[];
  ipa: string;
  translation: string;
  audio_analysis: AudioAnalysis;
  audio_duration: number;
}

export interface Texts {
  id: string;
  audio_url: string;
  text: string;
  difficulty: string;
  categories: string[];
  word_count: number;
  bookTitle: string;
  translation: string;
  audio_analysis: AudioAnalysis;
  audio_duration: number;
}
