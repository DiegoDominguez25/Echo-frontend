import daily_life from "@/assets/images/daily_life.png";
import education from "@/assets/images/education.png";
import health from "@/assets/images/health.png";
import work from "@/assets/images/work.png";
import travel from "@/assets/images/travel.png";
import social_life from "@/assets/images/social_life.png";
import { FiBarChart, FiTrendingUp, FiAward } from "react-icons/fi";

export const resourceTypes = [
  { value: "words", label: "Words" },
  { value: "sentences", label: "Sentences" },
  { value: "texts", label: "Texts" },
];

export const difficultyLevels = [
  { value: "0", label: "Easy" },
  { value: "1", label: "Intermediate" },
  { value: "2", label: "Difficult" },
];

export const categoryImages: Record<string, string> = {
  "daily life": daily_life,
  education: education,
  health: health,
  work: work,
  travel: travel,
  "social life": social_life,
};

export const backgroundColors: Record<string, string> = {
  "daily life": "bg-[#D8E3FF]",
  work: "bg-[#EDD5D5]",
  "social life": "bg-[#EFECAE]",
  education: "bg-[#D2F2E4]",
  travel: "bg-[#D8E3FF]",
  health: "bg-[#EDD5D5]",
};

export const ITEMS_PER_PAGE = 10;

export const levelConfig = {
  Beginner: {
    title: "Beginner",
    description: "You're building a great foundation. Keep practicing!",
    icon: <FiBarChart className="h-6 w-6" />,
    color: "text-green-500",
    bg: "bg-green-50",
    border: "border-green-300",
  },
  Intermediate: {
    title: "Intermediate",
    description: "You're showing solid skills. Challenge yourself to improve!",
    icon: <FiTrendingUp className="h-6 w-6" />,
    color: "text-yellow-500",
    bg: "bg-yellow-50",
    border: "border-yellow-300",
  },
  Advanced: {
    title: "Advanced",
    description: "Excellent work! You have a strong command of the language.",
    icon: <FiAward className="h-6 w-6" />,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    border: "border-indigo-300",
  },
};

export const tagColors = [
  {
    bg: "bg-indigo-50",
    border: "border-indigo-300",
    text: "text-indigo-800",
  },
  { bg: "bg-pink-50", border: "border-pink-300", text: "text-pink-800" },
  { bg: "bg-amber-50", border: "border-amber-300", text: "text-amber-800" },
];
