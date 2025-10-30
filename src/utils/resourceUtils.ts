import type { FlatEvaluation, Evaluation } from "@/data/interfaces/UserData";

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const truncateText = (text: string, wordLimit: number): string => {
  if (!text) return "";

  const words = text.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return text;
};

export const mapDifficulty = (level: string | number) => {
  switch (String(level)) {
    case "0":
      return "Easy";
    case "1":
      return "Intermediate";
    case "2":
      return "Difficult";
    default:
      return "Unknown";
  }
};

export const transformEvaluation = (
  rawEvaluation: FlatEvaluation,
  audio_url?: string
): Evaluation => {
  return {
    articulation_score: rawEvaluation.articulation_score,
    clarity_score: rawEvaluation.clarity_score,
    rythm_score: rawEvaluation.rythm_score,
    speed_score: rawEvaluation.speed_score,
    total_score: rawEvaluation.total_score,
    classification: rawEvaluation.classification,
    tips: {
      articulation_tip: rawEvaluation.articulation_tip,
      clarity_tip: rawEvaluation.clarity_tip,
      rythm_tip: rawEvaluation.rythm_tip,
      speed_tip: rawEvaluation.speed_tip,
    },
    audio_url: audio_url,
  };
};
